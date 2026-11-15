"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  Search,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  User,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { formatDateTime } from "@/lib/utils";
import type { Payment, ApiResponse } from "@/types";

function AdminPaymentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === "" || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    if (!newParams.page) {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim(), page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

  const { data, isLoading, isError, error, refetch } = useQuery<ApiResponse<Payment[]>>({
    queryKey: ["admin-payments", { page, search, status }],
    queryFn: () => {
      const q: Record<string, string | number> = {
        page,
        limit,
      };
      if (search) q.search = search;
      if (status) q.status = status;
      return apiClient.get<Payment[]>("/payments", q);
    },
  });

  const payments = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || (meta?.total ? Math.ceil(meta.total / limit) : 1);

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "SUCCEEDED":
        return (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Succeeded
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="border-slate-500/30 bg-slate-500/10 text-muted-foreground font-medium">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Financial Audit & Payment Ledger</h1>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Stripe Live Ledger
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Platform-wide transaction settlement audit, customer subscription pass volume, and Stripe gateway reconciliation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer email or Stripe session ID..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Statuses</option>
              <option value="SUCCEEDED">Succeeded</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>

            <Button type="submit" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filter
            </Button>

            {(search || status) && (
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Table Content */}
      <Card className="shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-destructive space-y-2">
            <AlertCircle className="mx-auto h-8 w-8" />
            <p className="font-semibold">Failed to query payment ledger</p>
            <p className="text-sm text-muted-foreground">{error?.message || "Internal server error"}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No transactions found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {search || status
                ? "No payment records matched your search or status filter."
                : "No payment transactions have been processed yet."}
            </p>
            {(search || status) && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product / Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Stripe Session</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => {
                  const planName =
                    p.metadata && typeof p.metadata === "object" && "planName" in p.metadata
                      ? String(p.metadata.planName)
                      : p.subscription?.plan === "ANNUAL_PRIORITY"
                      ? "365-Day Annual Pass"
                      : "30-Day Monthly Pass";

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      {/* Timestamp */}
                      <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground/60" />
                          <span>{formatDateTime(p.createdAt)}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        {p.user ? (
                          <div>
                            <p className="font-medium text-foreground text-xs">{p.user.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-muted-foreground">
                            {p.userId.slice(0, 8)}...
                          </span>
                        )}
                      </td>

                      {/* Plan Name */}
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{planName}</td>

                      {/* Amount */}
                      <td className="px-4 py-3 text-xs font-bold text-foreground">
                        ${Number(p.amount).toFixed(2)} {p.currency}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">{getStatusBadge(p.status)}</td>

                      {/* Stripe Session */}
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground truncate max-w-[150px]">
                        {p.stripeSessionId}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPayment(p)}
                          className="h-7 text-xs px-2"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
              {meta?.total ? ` (${meta.total} platform transactions)` : ""}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction Inspection Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Transaction Audit #{selectedPayment?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Stripe checkout session verification and linked subscription status.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-3 text-xs">
              <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payer Name:</span>
                  <strong className="text-foreground">{selectedPayment.user?.name || "Customer"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payer Email:</span>
                  <span className="font-mono text-foreground">{selectedPayment.user?.email || selectedPayment.userId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <strong className="text-foreground">
                    ${Number(selectedPayment.amount).toFixed(2)} {selectedPayment.currency}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Settlement Status:</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
                <p className="font-semibold text-foreground">Stripe Gateway Identifiers</p>
                <p className="text-muted-foreground">
                  Session: <code className="font-mono text-[10px] text-foreground">{selectedPayment.stripeSessionId}</code>
                </p>
                {selectedPayment.stripePaymentIntentId && (
                  <p className="text-muted-foreground">
                    PaymentIntent:{" "}
                    <code className="font-mono text-[10px] text-foreground">
                      {selectedPayment.stripePaymentIntentId}
                    </code>
                  </p>
                )}
                {selectedPayment.paidAt && (
                  <p className="text-muted-foreground">
                    Settled at: {formatDateTime(selectedPayment.paidAt)}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      }
    >
      <AdminPaymentsContent />
    </Suspense>
  );
}
