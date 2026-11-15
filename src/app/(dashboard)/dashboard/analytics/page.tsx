"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Activity, Clock, ShieldCheck, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Outage, ApiResponse } from "@/types";

export default function CustomerAnalyticsPage() {
  const { user } = useAuth();
  const areaId = user?.areaId;

  // Query outages for user's area to show real stats
  const { data, isLoading } = useQuery<ApiResponse<Outage[]>>({
    queryKey: ["customer-analytics-outages", areaId],
    queryFn: () => apiClient.get<Outage[]>(`/outages${areaId ? `?areaId=${areaId}` : ""}`),
  });

  const outages = data?.data || [];
  const activeCount = outages.filter((o) => o.status === "ACTIVE").length;
  const plannedCount = outages.filter((o) => o.type === "PLANNED").length;
  const restoredCount = outages.filter((o) => o.status === "COMPLETED" || o.status === "RESTORED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2.5 border-b pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Area Reliability Analytics</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Historical power stability, load-shedding frequency, and grid telemetry for{" "}
          <strong className="text-foreground">{user?.area?.name || "your registered distribution sector"}</strong>.
        </p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3">
          <Card className="p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Outages</p>
              <p className="text-3xl font-extrabold text-foreground mt-1.5">{activeCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Currently impacting sector</p>
            </div>
            <div className={`p-3.5 rounded-xl ${activeCount > 0 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}>
              <Activity className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Planned Rotations</p>
              <p className="text-3xl font-extrabold text-foreground mt-1.5">{plannedCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Upcoming scheduled outages</p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Clock className="h-6 w-6" />
            </div>
          </Card>

          <Card className="p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Restored Events</p>
              <p className="text-3xl font-extrabold text-foreground mt-1.5">{restoredCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Successfully resolved outages</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </Card>
        </div>
      )}

      {/* Stability Information Card */}
      <Card className="p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Zap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Sector Reliability Overview</h2>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          Grid reliability scores are calculated using live telemetry from local distribution substations and verified customer incident reports. Real-time metrics refresh dynamically whenever network operators update schedule status.
        </p>
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          Showing real backend data for: <strong className="text-foreground">{user?.area?.name || "All Monitored Sectors"}</strong> (Postal Code: {user?.area?.postalCode || "N/A"})
        </div>
      </Card>
    </div>
  );
}
