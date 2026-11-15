"use client";

import { Suspense, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarSearch,
  Search,
  Filter,
  RotateCcw,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Radio,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/lib/env";
import type { Outage, Area, ApiResponse } from "@/types";

function SchedulesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read current URL parameters
  const page = Number(searchParams.get("page")) || 1;
  const limit = 6;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const areaId = searchParams.get("areaId") || "";

  // Local state for immediate typing feedback
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  // Helper to update URL params
  const updateFilters = (newParams: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === "" || value === "ALL") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    // Always reset to page 1 on filter/search change unless page was explicitly set
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

  // Fetch areas for the dropdown filter
  const { data: areasData } = useQuery<{ data: Area[] }>({
    queryKey: ["areas", "dropdown-list"],
    queryFn: async () => {
      const res = await fetch(`${env.apiUrl}/areas?limit=50`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });
  const areas = areasData?.data || [];

  // Fetch paginated outages matching URL query filters
  const {
    data: outagesResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<ApiResponse<Outage[]>>({
    queryKey: ["outages", "public-list", page, limit, search, status, type, areaId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (type) params.set("type", type);
      if (areaId) params.set("areaId", areaId);

      const res = await fetch(`${env.apiUrl}/outages?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load outage schedules.");
      }
      return res.json();
    },
  });

  const outages = outagesResponse?.data || [];
  const meta = outagesResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  const hasActiveFilters = Boolean(search || status || type || areaId);

  return (
    <div className="space-y-6">
      {/* Search & Relational Filters Bar */}
      <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schedules by outage number, title, or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <Button type="submit" size="sm" className="font-medium text-xs h-9 cursor-pointer shadow-xs gap-1.5">
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </Button>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="font-medium text-xs h-9 cursor-pointer gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </Button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-border/40">
            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" /> Status
              </label>
              <select
                value={status}
                onChange={(e) => updateFilters({ status: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Operational Statuses</option>
                <option value="ACTIVE">ACTIVE (In Progress)</option>
                <option value="PUBLISHED">PUBLISHED (Upcoming)</option>
                <option value="RESTORED">RESTORED (Completed)</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Outage Type Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Radio className="h-3 w-3" /> Outage Nature
              </label>
              <select
                value={type}
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Outage Types</option>
                <option value="PLANNED">Planned Load Shedding</option>
                <option value="UNEXPECTED">Emergency / Unexpected Blackout</option>
              </select>
            </div>

            {/* Area Filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Distribution Sector
              </label>
              <select
                value={areaId}
                onChange={(e) => updateFilters({ areaId: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Areas</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Card>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-2">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
          <h3 className="font-semibold text-sm text-destructive">Failed to Load Outage Schedules</h3>
          <p className="text-xs text-muted-foreground">
            Could not communicate with the power grid service. Please verify your connection.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && outages.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center space-y-3">
          <CalendarSearch className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-semibold text-base text-foreground">No Outage Schedules Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {hasActiveFilters
              ? "No schedules match your current search and filter criteria. Try adjusting or resetting your filters."
              : "There are currently no active or planned power outages recorded on the network."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs cursor-pointer">
              Reset Filters
            </Button>
          )}
        </div>
      )}

      {/* Outage Cards Grid */}
      {!isLoading && !isError && outages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outages.map((outage) => {
            const isEmergency = outage.type === "UNEXPECTED";
            const isActive = outage.status === "ACTIVE" || outage.status === "IN_PROGRESS";
            const isRestored = outage.status === "RESTORED" || outage.status === "COMPLETED";

            return (
              <Card
                key={outage.id}
                className={`transition-all duration-200 border bg-card/60 hover:bg-card hover:shadow-xs flex flex-col justify-between ${
                  isActive ? "border-amber-500/40" : "border-border"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge
                          variant={isEmergency ? "destructive" : "secondary"}
                          className="text-[10px] font-mono uppercase"
                        >
                          {outage.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-mono uppercase ${
                            isActive
                              ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                              : isRestored
                              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                              : ""
                          }`}
                        >
                          {outage.status}
                        </Badge>
                      </div>

                      <span className="font-mono text-[11px] text-muted-foreground">
                        {outage.outageNumber}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 pt-1">
                      {outage.title}
                    </h3>

                    {outage.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {outage.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>Area:</span>
                      </span>
                      <span className="font-medium text-foreground truncate max-w-[180px]">
                        {outage.area?.name || "Grid Sector"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Start Window:</span>
                      </span>
                      <span className="font-mono text-foreground">
                        {new Date(outage.startTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Dispatcher: {outage.createdBy?.name || "Power Operator"}
                      </span>
                      <Link href={`/schedules/${outage.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-medium cursor-pointer p-0 hover:bg-transparent text-primary hover:underline">
                          <span>Inspect Schedule</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs">
          <div className="text-muted-foreground">
            Showing page <strong className="text-foreground">{page}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong> ({meta.total} total schedules)
          </div>

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
    </div>
  );
}

export default function SchedulesPage() {
  return (
    <div className="flex flex-col min-h-screen py-10 sm:py-16 space-y-8">
      {/* Header */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-3">
        <Badge variant="outline" className="text-xs uppercase font-mono px-3 py-1 border-primary/30 text-primary">
          Verified Timetables
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Live Outage Schedules
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Filter and track real planned load-shedding schedules and emergency incident restoration windows across the power grid.
        </p>
      </section>

      {/* Main Container with Suspense Boundary */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          }
        >
          <SchedulesContent />
        </Suspense>
      </section>
    </div>
  );
}
