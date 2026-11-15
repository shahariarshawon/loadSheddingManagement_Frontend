"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  MapPin,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { OutageReport, ApiResponse } from "@/types";

function OperatorReportsTriageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 8;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [verifyReport, setVerifyReport] = useState<OutageReport | null>(null);
  const [rejectReport, setRejectReport] = useState<OutageReport | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

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
    updateFilters({ search: searchInput.trim() });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

  // Fetch all reports for operator triage via BFF
  const {
    data: reportsResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiResponse<OutageReport[]>>({
    queryKey: ["provider", "outage-reports", page, limit, search, status],
    queryFn: () =>
      apiClient.get<OutageReport[]>("/outage-reports", {
        page,
        limit,
        search,
        status: status || undefined,
      }),
  });

  // Verify Report Mutation
  const verifyMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/outage-reports/${id}/verify`, {}),
    onSuccess: () => {
      toast.success("Incident Report Verified", {
        description: "Report verified and linked to emergency dispatch queue.",
      });
      queryClient.invalidateQueries({ queryKey: ["provider", "outage-reports"] });
      setVerifyReport(null);
    },
    onError: (err: Error) => {
      toast.error("Verification Failed", { description: err.message });
    },
  });

  // Reject Report Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.patch(`/outage-reports/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success("Incident Report Rejected", {
        description: "Report marked rejected with explanation provided to citizen.",
      });
      queryClient.invalidateQueries({ queryKey: ["provider", "outage-reports"] });
      setRejectReport(null);
      setRejectionReason("");
    },
    onError: (err: Error) => {
      toast.error("Rejection Failed", { description: err.message });
    },
  });

  const reports = reportsResponse?.data || [];
  const meta = reportsResponse?.meta;
  const totalPages = meta?.totalPages || 1;
  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span>Customer Incident Triage Deck</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review residential blackout incident reports, verify emergency validity, or reject invalid tickets.
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-mono w-fit">
          {meta?.total || 0} Total Reports
        </Badge>
      </div>

      {/* Filter Card */}
      <Card className="border-border bg-card/60 backdrop-blur-sm p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, report number, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs h-9 ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Triage States</option>
              <option value="PENDING">PENDING (Awaiting Review)</option>
              <option value="VERIFIED">VERIFIED (Linked to Outage)</option>
              <option value="RESOLVED">RESOLVED (Restored)</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <Button type="submit" size="sm" className="text-xs h-9 cursor-pointer gap-1">
            <Search className="h-3 w-3" />
            <span>Search</span>
          </Button>

          {hasActiveFilters && (
            <Button type="button" variant="outline" size="sm" onClick={handleReset} className="text-xs h-9 cursor-pointer gap-1">
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </form>
      </Card>

      {/* Reports Table */}
      <Card className="border-border bg-card overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="h-6 w-6 text-destructive mx-auto" />
            <p className="text-xs font-semibold text-destructive">Failed to fetch incident reports.</p>
          </div>
        )}

        {!isLoading && !isError && reports.length === 0 && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No incident reports found matching the filters.
          </div>
        )}

        {!isLoading && !isError && reports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-mono">
                <tr>
                  <th className="px-4 py-3">Report ID & Title</th>
                  <th className="px-4 py-3">Reporting Customer</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reports.map((r) => {
                  const isPending = r.status === "PENDING";
                  const statusClass =
                    r.status === "VERIFIED"
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      : r.status === "RESOLVED"
                      ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                      : r.status === "REJECTED"
                      ? "border-destructive/40 text-destructive bg-destructive/10"
                      : "border-border text-muted-foreground bg-muted/20";

                  return (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          {r.reportNumber}
                        </span>
                        <span className="font-semibold text-foreground text-xs">{r.title || "Incident Report"}</span>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-[240px]">
                          {r.description}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.customer?.name || "Citizen"}</div>
                        <div className="text-[11px] text-muted-foreground font-mono">{r.customer?.email}</div>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground font-medium">
                        {r.area?.name || "Sector Linked"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px] font-mono uppercase">
                          {r.severity}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`text-[10px] font-mono uppercase ${statusClass}`}>
                          {r.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right space-x-1.5">
                        {isPending ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setVerifyReport(r)}
                              className="h-7 text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer px-2"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verify
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRejectReport(r)}
                              className="h-7 text-xs text-destructive hover:text-destructive cursor-pointer px-2"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-mono">Triaged</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border p-3 text-xs">
            <span className="text-muted-foreground">
              Page <strong className="text-foreground">{page}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isFetching}
                onClick={() => updateFilters({ page: page - 1 })}
                className="h-7 text-xs cursor-pointer gap-1"
              >
                <ChevronLeft className="h-3 w-3" />
                <span>Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isFetching}
                onClick={() => updateFilters({ page: page + 1 })}
                className="h-7 text-xs cursor-pointer gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Verify Dialog */}
      <Dialog open={Boolean(verifyReport)} onOpenChange={(open) => !open && setVerifyReport(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Verify Customer Blackout Incident</DialogTitle>
            <DialogDescription className="text-xs">
              Confirm report <strong>{verifyReport?.reportNumber}</strong>. Verifying links this customer complaint to the active grid dispatch queue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">
            Verifying transitions this report from `PENDING` to `VERIFIED` and marks it for technician dispatch.
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setVerifyReport(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={verifyMutation.isPending}
              onClick={() => verifyReport && verifyMutation.mutate(verifyReport.id)}
              className="text-xs font-semibold"
            >
              {verifyMutation.isPending ? "Verifying..." : "Confirm Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={Boolean(rejectReport)} onOpenChange={(open) => !open && setRejectReport(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Reject Outage Report</DialogTitle>
            <DialogDescription className="text-xs">
              Provide an official explanation for rejecting ticket <strong>{rejectReport?.reportNumber}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label htmlFor="rejectionReason" className="font-semibold">
              Rejection Reason *
            </Label>
            <textarea
              id="rejectionReason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Grid telemetry indicates normal substation voltage; issue isolated to private building breaker."
              className="w-full rounded-md border border-input bg-background p-2 text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setRejectReport(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
              onClick={() => {
                if (rejectReport && rejectionReason.trim()) {
                  rejectMutation.mutate({
                    id: rejectReport.id,
                    reason: rejectionReason.trim(),
                  });
                }
              }}
              className="text-xs font-semibold"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function OperatorReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <OperatorReportsTriageContent />
    </Suspense>
  );
}
