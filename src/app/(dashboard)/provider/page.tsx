import type { Metadata } from "next";
import Link from "next/link";
import {
  Radio,
  Calendar,
  AlertTriangle,
  Wrench,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import type { Outage, OutageReport, Technician, ApiResponse } from "@/types";

export const metadata: Metadata = {
  title: "Operator Dispatch Station",
  description: "GridWatch electricity provider and power operator dispatch station.",
};

async function getOperatorMetrics(accessToken?: string) {
  if (!accessToken) return { outages: [], reports: [], technicians: [] };
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const [outagesRes, reportsRes, techsRes] = await Promise.all([
      fetch(`${env.backendApiUrl}/outages?limit=50`, { headers, cache: "no-store" }),
      fetch(`${env.backendApiUrl}/outage-reports?limit=50`, { headers, cache: "no-store" }),
      fetch(`${env.backendApiUrl}/technicians?limit=50`, { headers, cache: "no-store" }),
    ]);

    const outagesData: ApiResponse<Outage[]> = await outagesRes.json().catch(() => ({ data: [] }));
    const reportsData: ApiResponse<OutageReport[]> = await reportsRes.json().catch(() => ({ data: [] }));
    const techsData: ApiResponse<Technician[]> = await techsRes.json().catch(() => ({ data: [] }));

    return {
      outages: outagesData.data || [],
      reports: reportsData.data || [],
      technicians: techsData.data || [],
    };
  } catch (error) {
    console.error("Failed to load operator metrics:", error);
    return { outages: [], reports: [], technicians: [] };
  }
}

export default async function ProviderDashboardPage() {
  const session = await getServerSession();
  const operator = session.user;
  const { outages, reports, technicians } = await getOperatorMetrics(session.accessToken || undefined);

  const activeOutages = outages.filter((o) => o.status === "ACTIVE" || o.status === "IN_PROGRESS");
  const pendingReports = reports.filter((r) => r.status === "PENDING");
  const availableTechs = technicians.filter((t) => t.isAvailable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Electricity Provider & Dispatch Station
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-mono border-amber-500/40 text-amber-600 dark:text-amber-400">
              Operator Access
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, <strong className="text-foreground">{operator?.name || "Power Operator"}</strong>. Grid telemetry, schedule dispatch, and technician dispatch active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/provider/schedules/new">
            <Button size="sm" className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Schedule Outage</span>
            </Button>
          </Link>
          <Link href="/provider/reports">
            <Button size="sm" variant="outline" className="text-xs h-8 cursor-pointer gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Triage Reports ({pendingReports.length})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Active Outages */}
        <Card className="border-border bg-card/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Outages
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Radio className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{activeOutages.length}</span>
            <span className="text-xs text-muted-foreground">in restoration</span>
          </div>
          <span className="text-[11px] text-muted-foreground block">
            {outages.length} total scheduled outages logged
          </span>
        </Card>

        {/* Customer Reports Pending */}
        <Card className="border-border bg-card/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Reports
            </span>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{pendingReports.length}</span>
            <span className="text-xs text-muted-foreground">need triage</span>
          </div>
          <span className="text-[11px] text-muted-foreground block">
            {reports.length} total customer reports received
          </span>
        </Card>

        {/* Available Technicians */}
        <Card className="border-border bg-card/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Field Technicians
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{availableTechs.length}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Available</span>
          </div>
          <span className="text-[11px] text-muted-foreground block">
            {technicians.length} registered on utility roster
          </span>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card/60 hover:border-primary/40 transition-colors p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Schedule Management</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Plan zero-conflict load-shedding windows and cancel outdated schedules.
            </p>
          </div>
          <Link href="/provider/schedules">
            <Button size="sm" variant="outline" className="w-full text-xs h-8 justify-between">
              <span>View Schedules</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </Card>

        <Card className="border-border bg-card/60 hover:border-primary/40 transition-colors p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-sm">Incident Triage</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review customer blackout complaints, verify authenticity, and link to outages.
            </p>
          </div>
          <Link href="/provider/reports">
            <Button size="sm" variant="outline" className="w-full text-xs h-8 justify-between">
              <span>Open Triage Deck</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </Card>

        <Card className="border-border bg-card/60 hover:border-primary/40 transition-colors p-4 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-sm">Field Technicians</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Manage field personnel availability for high-voltage repair dispatch.
            </p>
          </div>
          <Link href="/provider/technicians">
            <Button size="sm" variant="outline" className="w-full text-xs h-8 justify-between">
              <span>Technician Roster</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
