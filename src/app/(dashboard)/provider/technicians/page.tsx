"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Wrench,
  Search,
  Filter,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Loader2,
  Radio,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { Technician, Zone, ApiResponse } from "@/types";

function TechniciansRosterContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 9;
  const search = searchParams.get("search") || "";
  const isAvailableParam = searchParams.get("isAvailable") || "";
  const zoneIdParam = searchParams.get("zoneId") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  // 1. Fetch available zones for filter dropdown
  const { data: zonesData } = useQuery<ApiResponse<Zone[]>>({
    queryKey: ["zones"],
    queryFn: () => apiClient.get<Zone[]>("/zones"),
    staleTime: 60 * 1000,
  });

  const queryKey = ["technicians", { page, search, isAvailableParam, zoneIdParam }];

  // 2. Fetch technicians with query params
  const { data, isLoading, isError, error } = useQuery<ApiResponse<Technician[]>>({
    queryKey,
    queryFn: () => {
      const q: Record<string, string | number> = {
        page,
        limit,
      };
      if (search) q.search = search;
      if (isAvailableParam) q.isAvailable = isAvailableParam;
      if (zoneIdParam) q.zoneId = zoneIdParam;

      return apiClient.get<Technician[]>("/technicians", q);
    },
  });

  // 3. Mutation to toggle availability with Optimistic UI updates
  const toggleMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: boolean }) => {
      setTogglingId(id);
      return apiClient.patch<Technician>(`/technicians/${id}`, {
        isAvailable: newStatus,
      });
    },
    onMutate: async ({ id, newStatus }) => {
      // 1. Cancel ongoing queries for technicians to prevent overwrites
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the previous cached data
      const previousData = queryClient.getQueryData<ApiResponse<Technician[]>>(queryKey);

      // 3. Optimistically update TanStack Query cache immediately
      if (previousData?.data) {
        queryClient.setQueryData<ApiResponse<Technician[]>>(queryKey, {
          ...previousData,
          data: previousData.data.map((tech) =>
            tech.id === id ? { ...tech, isAvailable: newStatus } : tech
          ),
        });
      }

      // Return context with previous snapshot for rollback on failure
      return { previousData };
    },
    onError: (err: Error, _variables, context) => {
      setTogglingId(null);
      // Roll back to previous snapshot
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error("Status Update Failed", {
        description: err.message || "Failed to update technician availability. Reverted changes.",
      });
    },
    onSuccess: (_res, variables) => {
      setTogglingId(null);
      toast.success(
        variables.newStatus
          ? "Technician status set to Available for dispatch"
          : "Technician marked as Busy / Dispatched"
      );
    },
    onSettled: () => {
      // Re-sync with backend truth
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });

  const technicians = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages || (meta?.total ? Math.ceil(meta.total / limit) : 1);
  const zones = zonesData?.data || [];

  // Summary counts
  const availableCount = technicians.filter((t) => t.isAvailable).length;
  const busyCount = technicians.filter((t) => !t.isAvailable).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wrench className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Field Technicians Roster</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time status, zone assignments, and emergency dispatch readiness for certified field crews.
          </p>
        </div>

        {/* Quick status pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-xs shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-foreground">{availableCount} Available</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-xs shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-medium text-foreground">{busyCount} Dispatched / Busy</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by technician name, specialization, or phone..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Availability Filter */}
            <select
              value={isAvailableParam}
              onChange={(e) => updateFilters({ isAvailable: e.target.value, page: 1 })}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">All Availability</option>
              <option value="true">Available On-Call</option>
              <option value="false">Dispatched / Busy</option>
            </select>

            {/* Zone Filter */}
            <select
              value={zoneIdParam}
              onChange={(e) => updateFilters({ zoneId: e.target.value, page: 1 })}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring max-w-[180px]"
            >
              <option value="">All Zones</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.code})
                </option>
              ))}
            </select>

            <Button type="submit" size="sm">
              <Filter className="mr-1.5 h-3.5 w-3.5" />
              Filter
            </Button>

            {(search || isAvailableParam || zoneIdParam) && (
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Technicians Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <div className="pt-2 flex justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="p-8 text-center text-destructive space-y-2">
          <AlertCircle className="mx-auto h-8 w-8" />
          <p className="font-semibold">Failed to load technicians</p>
          <p className="text-sm text-muted-foreground">{error?.message || "Internal server error"}</p>
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["technicians"] })}>
            Retry
          </Button>
        </Card>
      ) : technicians.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">No technicians found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {search || isAvailableParam || zoneIdParam
              ? "No technicians matched your search or filters. Try adjusting your query parameters."
              : "No technicians have been registered in the database yet."}
          </p>
          {(search || isAvailableParam || zoneIdParam) && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((tech) => (
            <Card key={tech.id} className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Header: Name and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Zap className="h-3 w-3 text-primary" />
                      {tech.specialization || "Electrical Systems Technician"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      tech.isAvailable
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                    }
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        tech.isAvailable ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {tech.isAvailable ? "Available" : "Dispatched"}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-1.5 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground/70" />
                    <span>
                      Zone: <strong className="text-foreground">{tech.zone?.name || "Unassigned"}</strong>
                      {tech.zone?.code && ` (${tech.zone.code})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-foreground/70" />
                    <a
                      href={`tel:${tech.phone}`}
                      className="hover:text-primary transition-colors hover:underline font-mono"
                    >
                      {tech.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 shrink-0 text-foreground/70" />
                    <span>
                      Member since {new Date(tech.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t flex items-center justify-between gap-2">
                <a
                  href={`tel:${tech.phone}`}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3.5 py-2 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  <Phone className="mr-2 h-4 w-4 text-primary" />
                  Call Direct
                </a>

                <Button
                  size="sm"
                  variant={tech.isAvailable ? "outline" : "default"}
                  disabled={toggleMutation.isPending && togglingId === tech.id}
                  onClick={() =>
                    toggleMutation.mutate({
                      id: tech.id,
                      newStatus: !tech.isAvailable,
                    })
                  }
                  className="text-xs"
                >
                  {toggleMutation.isPending && togglingId === tech.id ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : tech.isAvailable ? (
                    <Radio className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  )}
                  {tech.isAvailable ? "Mark Dispatched" : "Set Available"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
            {meta?.total ? ` (${meta.total} total technicians)` : ""}
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
    </div>
  );
}

export default function TechniciansRosterPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
          <div className="h-14 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <TechniciansRosterContent />
    </Suspense>
  );
}
