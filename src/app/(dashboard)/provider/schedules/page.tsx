"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar,
  Search,
  Filter,
  PlusCircle,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
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
import type { Outage, ApiResponse } from "@/types";

function ProviderSchedulesContent() {
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
  const [cancelModalOutage, setCancelModalOutage] = useState<Outage | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [deleteOutageId, setDeleteOutageId] = useState<string | null>(null);

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

  // Fetch outages via BFF
  const {
    data: outagesResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiResponse<Outage[]>>({
    queryKey: ["provider", "outages", page, limit, search, status],
    queryFn: () =>
      apiClient.get<Outage[]>("/outages", {
        page,
        limit,
        search,
        status: status || undefined,
      }),
  });

  // Cancel Outage Mutation
  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.patch(`/outages/${id}/cancel`, { reason }),
    onSuccess: () => {
      toast.success("Outage Cancelled", {
        description: "Scheduled load-shedding has been cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ["provider", "outages"] });
      setCancelModalOutage(null);
      setCancelReason("");
    },
    onError: (err: Error) => {
      toast.error("Cancellation Failed", { description: err.message });
    },
  });

  // Delete Outage Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/outages/${id}`),
    onSuccess: () => {
      toast.success("Schedule Removed", { description: "Outage record deleted." });
      queryClient.invalidateQueries({ queryKey: ["provider", "outages"] });
      setDeleteOutageId(null);
    },
    onError: (err: Error) => {
      toast.error("Deletion Failed", { description: err.message });
    },
  });

  const outages = outagesResponse?.data || [];
  const meta = outagesResponse?.meta;
  const totalPages = meta?.totalPages || 1;
  const hasActiveFilters = Boolean(search || status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Outage Schedule Dispatch Management</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Coordinate planned load-shedding schedules and emergency incident restoration timelines.
          </p>
        </div>

        <Link href="/provider/schedules/new">
          <Button size="sm" className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs w-fit">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Schedule New Outage</span>
          </Button>
        </Link>
      </div>

      {/* Filter Card */}
      <Card className="border-border bg-card/60 backdrop-blur-sm p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by outage tracking ID, title, or reason..."
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
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE (In Progress)</option>
              <option value="PUBLISHED">PUBLISHED (Planned)</option>
              <option value="RESTORED">RESTORED (Completed)</option>
              <option value="CANCELLED">CANCELLED</option>
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

      {/* Table / List */}
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
            <p className="text-xs font-semibold text-destructive">Failed to fetch schedules.</p>
          </div>
        )}

        {!isLoading && !isError && outages.length === 0 && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No outage schedules match the selected filters.
          </div>
        )}

        {!isLoading && !isError && outages.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-[10px] font-mono">
                <tr>
                  <th className="px-4 py-3">Tracking ID & Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Schedule Window</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {outages.map((o) => {
                  const isActive = o.status === "ACTIVE" || o.status === "IN_PROGRESS";
                  const isRestored = o.status === "RESTORED" || o.status === "COMPLETED";
                  const isCancelled = o.status === "CANCELLED";

                  return (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          {o.outageNumber}
                        </span>
                        <span className="font-semibold text-foreground text-xs">{o.title}</span>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={o.type === "UNEXPECTED" ? "destructive" : "secondary"}
                          className="text-[10px] font-mono uppercase"
                        >
                          {o.type}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-muted-foreground font-medium">
                        {o.area?.name || "Grid Sector"}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        <div>Start: {new Date(o.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        {o.endTime && (
                          <div>End: {new Date(o.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono uppercase ${
                            isActive
                              ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                              : isRestored
                              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                              : isCancelled
                              ? "border-destructive text-destructive bg-destructive/10"
                              : ""
                          }`}
                        >
                          {o.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right space-x-1.5">
                        {!isCancelled && !isRestored && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCancelModalOutage(o)}
                            className="h-7 text-xs text-amber-600 hover:text-amber-700 cursor-pointer px-2"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteOutageId(o.id)}
                          className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
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

      {/* Cancel Outage Dialog */}
      <Dialog open={Boolean(cancelModalOutage)} onOpenChange={(open) => !open && setCancelModalOutage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Cancel Planned Outage</DialogTitle>
            <DialogDescription className="text-xs">
              Provide a verified cancellation reason for outage{" "}
              <strong>{cancelModalOutage?.outageNumber}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label htmlFor="cancelReason" className="font-semibold">
              Cancellation Reason *
            </Label>
            <textarea
              id="cancelReason"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Heavy rainfall delayed substation maintenance; load transferred to alternate feeder."
              className="w-full rounded-md border border-input bg-background p-2 text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setCancelModalOutage(null)} className="text-xs">
              Back
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              onClick={() => {
                if (cancelModalOutage && cancelReason.trim()) {
                  cancelMutation.mutate({
                    id: cancelModalOutage.id,
                    reason: cancelReason.trim(),
                  });
                }
              }}
              className="text-xs font-semibold"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Outage Dialog */}
      <Dialog open={Boolean(deleteOutageId)} onOpenChange={(open) => !open && setDeleteOutageId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Outage Record</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to permanently delete this scheduled outage record?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setDeleteOutageId(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteOutageId && deleteMutation.mutate(deleteOutageId)}
              className="text-xs font-semibold"
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProviderSchedulesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ProviderSchedulesContent />
    </Suspense>
  );
}
