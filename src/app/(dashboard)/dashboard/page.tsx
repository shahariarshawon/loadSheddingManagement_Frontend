import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  MapPin,
  Calendar,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  Radio,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { Outage, ApiResponse } from "@/types";

export const metadata: Metadata = {
  title: "Consumer Portal",
  description: "GridWatch residential consumer dashboard and outage tracking portal.",
};

async function getAreaOutages(areaId?: string | null): Promise<Outage[]> {
  if (!areaId) return [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${env.backendApiUrl}/outages?areaId=${areaId}&limit=4`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) return [];
    const data: ApiResponse<Outage[]> = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function ConsumerDashboardPage() {
  const session = await getServerSession();
  const customer = session.user;
  const areaOutages = await getAreaOutages(customer?.areaId);

  const areaName =
    customer?.area?.name ||
    (customer?.areaId ? `Area (${customer.areaId})` : "Unassigned Sector");

  const hasActiveOutage = areaOutages.some(
    (o) => o.status === "ACTIVE" || o.status === "IN_PROGRESS"
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Residential Consumer Portal
            </h1>
            <Badge variant="outline" className="text-xs uppercase font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5">
              Verified Citizen
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back, <strong className="text-foreground">{customer?.name || "Resident"}</strong>. Live power status and load-shedding alerts for your sector.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/reports/new">
            <Button size="sm" className="text-sm h-9 px-3.5 cursor-pointer gap-2 shadow-xs bg-amber-600 hover:bg-amber-700 text-white font-medium">
              <AlertTriangle className="h-4 w-4" />
              <span>Report Blackout</span>
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button size="sm" variant="outline" className="text-sm h-9 px-3.5 cursor-pointer gap-2 font-medium">
              <ClipboardList className="h-4 w-4" />
              <span>My Reports</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Status for User's Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Area Power Status */}
        <Card className={`border p-6 flex flex-col justify-between ${
          hasActiveOutage
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-emerald-500/30 bg-emerald-500/5"
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Grid Status
              </span>
              <div className={`p-2.5 rounded-lg ${hasActiveOutage ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
            </div>

            <div className="pt-1">
              <span className={`text-2xl font-bold block ${hasActiveOutage ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {hasActiveOutage ? "Outage In Progress" : "Grid Power Active"}
              </span>
              <span className="text-sm text-muted-foreground block mt-1">
                {hasActiveOutage
                  ? "Technicians or load shedding active in your sector."
                  : "Normal electricity supply active."}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 text-sm flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Assigned Sector:</span>
            <span className="font-bold text-foreground truncate max-w-[160px]">
              {areaName}
            </span>
          </div>
        </Card>

        {/* Card 2: Profile & Account Information */}
        <Card className="border-border bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Account Information
              </span>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Home className="h-5 w-5" />
              </div>
            </div>

            <div className="pt-1 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resident:</span>
                <span className="font-semibold text-foreground">{customer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registered Email:</span>
                <span className="font-mono text-foreground truncate max-w-[150px]">{customer?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Active Citizen
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40">
            <Link href="/dashboard/profile" className="text-sm font-semibold text-primary hover:underline flex items-center justify-between">
              <span>Edit Profile & Area</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Quick Action Outage Reporting */}
        <Card className="border-border bg-card/60 p-6 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Incident Reporting
              </span>
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed pt-1">
              Experiencing an unexpected power blackout or line hazard in your sector? Submit an incident report to notify operators immediately.
            </p>
          </div>

          <div className="pt-4 border-t border-border/40">
            <Link href="/dashboard/reports/new">
              <Button size="sm" variant="outline" className="w-full text-sm h-9 cursor-pointer justify-between font-medium">
                <span>Submit Incident Report</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Schedules in User's Area */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">
                Schedules for {areaName}
              </CardTitle>
            </div>
            <Link href={ROUTES.SCHEDULES}>
              <Button variant="ghost" size="sm" className="h-8 text-sm text-muted-foreground hover:text-foreground font-medium">
                <span>All Grid Schedules</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-sm">
            Live timetables recorded specifically for your residential sector
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {areaOutages.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground space-y-2 border border-dashed border-border rounded-lg">
              <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto" />
              <p className="font-medium">No active or scheduled load-shedding recorded for your residential area.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {areaOutages.map((outage) => (
                <div
                  key={outage.id}
                  className="p-4 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <Badge variant={outage.type === "UNEXPECTED" ? "destructive" : "secondary"} className="text-xs font-mono uppercase px-2 py-0.5 font-semibold">
                        {outage.type}
                      </Badge>
                      <span className="font-bold text-foreground text-base">{outage.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="font-mono text-xs">REF #{outage.outageNumber}</span>
                      <span>•</span>
                      <span>
                        Starts: {formatDateTime(outage.startTime)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    <Badge variant="outline" className="text-xs font-mono px-2 py-0.5">
                      {outage.status}
                    </Badge>
                    <Link href={`/schedules/${outage.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-sm font-medium">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
