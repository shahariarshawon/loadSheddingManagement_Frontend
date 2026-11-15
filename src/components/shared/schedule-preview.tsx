"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Clock,
  MapPin,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import type { Outage, ApiResponse } from "@/types";

export function SchedulePreview() {
  const [search, setSearch] = useState("");

  const { data: outagesResponse, isLoading } = useQuery<ApiResponse<Outage[]>>({
    queryKey: ["outages", "homepage-preview"],
    queryFn: async () => {
      const res = await fetch(`${env.apiUrl}/outages?limit=4`);
      if (!res.ok) {
        throw new Error("Failed to load outage schedules");
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const outages = outagesResponse?.data || [];

  const filteredOutages = outages.filter((o) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      o.title?.toLowerCase().includes(term) ||
      o.area?.name?.toLowerCase().includes(term) ||
      o.outageNumber?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />
            Active Shedding
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[11px] font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-medium">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Power Restored
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Quick search by sector, area, or feeder name..."
            className="pl-9 h-10 text-sm bg-background border-border"
          />
        </div>
        <Link
          href={search ? `${ROUTES.SCHEDULES}?search=${encodeURIComponent(search)}` : ROUTES.SCHEDULES}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 text-xs font-semibold gap-1.5 shrink-0"
          )}
        >
          <span>View All Outage Schedules</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Grid of schedule cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-border/60 bg-card">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground">Fetching verified grid schedules...</p>
        </div>
      ) : filteredOutages.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card">
          <AlertTriangle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-foreground">No matching schedules found</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Try adjusting your search query or view full regional schedules.
          </p>
          <Link
            href={ROUTES.SCHEDULES}
            className={cn(buttonVariants({ size: "sm" }), "mt-4 text-xs font-medium")}
          >
            Explore All Schedules
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOutages.map((item) => (
            <Card
              key={item.id}
              className="border border-border/80 bg-card hover:border-slate-400 dark:hover:border-slate-600 transition-colors shadow-xs"
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                      {item.outageNumber}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-1">
                    {item.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.area?.name || "General Grid"}</span>
                    </div>
                    {item.area?.feeder?.name && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono text-[10px]">FEEDER:</span>
                        <span className="font-medium text-foreground">{item.area.feeder.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDateTime(item.startTime)}</span>
                  </div>

                  <Link
                    href={`${ROUTES.SCHEDULES}/${item.id}`}
                    className="font-medium text-primary hover:underline underline-offset-2 flex items-center gap-1 text-xs"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
