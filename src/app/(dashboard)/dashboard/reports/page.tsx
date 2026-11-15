"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList,
  Search,
  Filter,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Loader2,
  Clock,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatDateTime } from "@/lib/utils";
import type { OutageReport, ApiResponse } from "@/types";

function MyReportsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 6;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);

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

  const queryKey = ["outage-reports", "my", page, limit, search, status];

  // Fetch customer's personal reports via BFF
  const {
    data: reportsResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiResponse<OutageReport[]>>({
    queryKey,
    queryFn: () =>
      apiClient.get<OutageReport[]>("/outage-reports/my", {
        page,
        limit,
        search,
        status: status || undefined,
      }),
  });

  // Withdraw report mutation with Optimistic UI updates
  const withdrawMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/outage-reports/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<ApiResponse<OutageReport[]>>(queryKey);

      if (previousData?.data) {
        queryClient.setQueryData<ApiResponse<OutageReport[]>>(queryKey, {
          ...previousData,
          data: previousData.data.filter((r) => r.id !== id),
        });
      }

      setDeleteReportId(null);
      return { previousData };
    },
    onError: (err: Error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Withdrawal Failed", {
        description: err.message || "Could not withdraw report. Reverted.",
      });
    },
    onSuccess: () => {
      toast.success("Report Withdrawn", {
        description: "Your incident report has been deleted.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["outage-reports", "my"] });
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
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>My Outage Incident Reports</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track the verification and restoration status of your submitted blackout reports.
          </p>
        </div>

        <Link href="/dashboard/reports/new">
          <Button size="sm" className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs w-fit">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Report New Incident</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-border bg-card/60 backdrop-blur-sm p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by report number or incident details..."
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
              <option value="">All Triage Statuses</option>
              <option value="PENDING">PENDING (Awaiting Review)</option>
              <option value="VERIFIED">VERIFIED (Linked to Outage)</option>
              <option value="RESOLVED">RESOLVED (Power Restored)</option>
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

      {/* Reports List */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center space-y-2 border border-destructive/20 bg-destructive/10 rounded-xl">
          <AlertTriangle className="h-6 w-6 text-destructive mx-auto" />
          <p className="text-xs font-semibold text-destructive">Failed to load personal outage reports.</p>
        </div>
      )}

      {!isLoading && !isError && reports.length === 0 && (
        <Card className="border-border bg-card p-10 text-center space-y-3">
          <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-sm text-foreground">No Incident Reports Recorded</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "No reports match your current filter criteria."
              : "You haven't submitted any outage reports yet. If you experience an unexpected blackout, let us know."}
          </p>
          <Link href="/dashboard/reports/new">
            <Button size="sm" className="text-xs mt-2">
              Submit Outage Report
            </Button>
          </Link>
        </Card>
      )}

      {!isLoading && !isError && reports.length > 0 && (
        <div className="space-y-3">
          {reports.map((report) => {
            const statusColor =
              report.status === "VERIFIED"
                ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                : report.status === "RESOLVED"
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : report.status === "REJECTED"
                ? "border-destructive/40 text-destructive bg-destructive/10"
                : "border-border text-muted-foreground bg-muted/20";

            const isPending = report.status === "PENDING";

            return (
              <Card key={report.id} className="border-border bg-card/60 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] font-mono uppercase ${statusColor}`}>
                      {report.status}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                      Severity: {report.severity}
                    </Badge>
                    <span className="font-semibold text-xs text-foreground">
                      {report.title || "Blackout Incident Report"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {report.reportNumber}
                    </span>
                    {isPending && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteReportId(report.id)}
                        className="h-6 text-[11px] text-destructive hover:text-destructive cursor-pointer px-1.5"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {report.description}
                </p>

                {report.rejectionReason && (
                  <div className="p-2.5 rounded-md border border-destructive/20 bg-destructive/5 text-destructive text-[11px]">
                    <strong>Rejection Reason:</strong> {report.rejectionReason}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground pt-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>Sector: {report.area?.name || "Assigned Area"}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <Clock className="h-4 w-4" />
                    <span>Submitted: {formatDateTime(report.createdAt)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
          <span className="text-muted-foreground">
            Page <strong className="text-foreground">{page}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => updateFilters({ page: page - 1 })}
              className="h-8 text-xs cursor-pointer gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => updateFilters({ page: page + 1 })}
              className="h-8 text-xs cursor-pointer gap-1"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Withdraw Dialog */}
      <Dialog open={Boolean(deleteReportId)} onOpenChange={(open) => !open && setDeleteReportId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Withdraw Incident Report</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to withdraw this blackout report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setDeleteReportId(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={withdrawMutation.isPending}
              onClick={() => deleteReportId && withdrawMutation.mutate(deleteReportId)}
              className="text-xs font-semibold"
            >
              {withdrawMutation.isPending ? "Withdrawing..." : "Confirm Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MyReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <MyReportsContent />
    </Suspense>
  );
}
