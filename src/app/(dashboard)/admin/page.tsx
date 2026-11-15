import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Users,
  Radio,
  Layers,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerSession } from "@/lib/auth-server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import type { AdminStats, ApiResponse } from "@/types";

const DynamicAdminAnalyticsCharts = dynamic(
  () =>
    import("@/components/dashboard/admin-analytics-charts").then(
      (mod) => mod.AdminAnalyticsCharts
    ),
  {
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Admin Control Center",
  description: "GridWatch platform administration and live grid governance analytics.",
};

async function getAdminStats(accessToken?: string): Promise<AdminStats | null> {
  if (!accessToken) return null;
  try {
    const res = await fetch(`${env.backendApiUrl}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: ApiResponse<AdminStats> = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  const admin = session.user;
  const stats = await getAdminStats(session.accessToken || undefined);

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Administrator Control Center
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-mono border-purple-500/40 text-purple-600 dark:text-purple-400">
              Root Authority
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, <strong className="text-foreground">{admin?.name || "Administrator"}</strong>. Real-time platform governance and grid telemetry are active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={ROUTES.ADMIN_USERS}>
            <Button size="sm" variant="outline" className="text-xs h-8 cursor-pointer gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Manage Users</span>
            </Button>
          </Link>
          <Link href={ROUTES.ADMIN_GRID}>
            <Button size="sm" className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>Grid Topology</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Live System Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Users */}
          <Card className="border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Registered Users</span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.users.total}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {stats.users.active} Active
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block truncate">
              {stats.users.customers} Citizens • {stats.users.operators} Operators
            </span>
          </Card>

          {/* Card 2: Outages */}
          <Card className="border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Grid Outages</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Radio className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.outages.total}</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                {stats.outages.active} Live Outages
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block truncate">
              {stats.outages.planned} Planned • {stats.outages.unexpected} Unplanned
            </span>
          </Card>

          {/* Card 3: Network Nodes */}
          <Card className="border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Network Topology</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.network.areas}</span>
              <span className="text-[11px] text-muted-foreground">Sectors</span>
            </div>
            <span className="text-[10px] text-muted-foreground block truncate">
              {stats.network.zones} Zones • {stats.network.substations} Substations
            </span>
          </Card>

          {/* Card 4: Technicians */}
          <Card className="border-border bg-card/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Field Technicians</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wrench className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.technicians.total}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {stats.technicians.available} Available
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground block truncate">
              Advisory locked dispatch ready
            </span>
          </Card>
        </div>
      )}

      {/* Real-Data Analytics Visualizations (Dynamically Imported) */}
      {stats && <DynamicAdminAnalyticsCharts stats={stats} />}

      {/* Management Modules Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-border bg-card/60 hover:border-primary/40 transition-colors p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">User & Access Management</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Audit registered customers and operators, adjust RBAC privilege tiers (`CUSTOMER`, `POWER_OPERATOR`, `ADMIN`), and manage account suspension.
            </p>
          </div>
          <Link href={ROUTES.ADMIN_USERS}>
            <Button size="sm" variant="outline" className="w-full text-xs h-8 cursor-pointer justify-between">
              <span>Open User Management</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>

        <Card className="border-border bg-card/60 hover:border-primary/40 transition-colors p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-sm text-foreground">Grid Topology Architecture</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Create and manage distribution corridors across the 4-tier network: Power Zones, Substations, Feeders, and Residential Sectors.
            </p>
          </div>
          <Link href={ROUTES.ADMIN_GRID}>
            <Button size="sm" variant="outline" className="w-full text-xs h-8 cursor-pointer justify-between">
              <span>Open Grid Topology</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
