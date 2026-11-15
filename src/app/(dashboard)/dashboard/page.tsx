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
import type { Outage, ApiResponse } from "@/types";

export const metadata: Metadata = {
  title: "Consumer Portal",
  description: "GridWatch residential consumer dashboard and outage tracking portal.",
};

async function getAreaOutages(areaId?: string | null): Promise<Outage[]> {
  if (!areaId) return [];
  try {
    const res = await fetch(`${env.backendApiUrl}/outages?areaId=${areaId}&limit=4`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ApiResponse<Outage[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch area outages:", error);
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
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Residential Consumer Portal
            </h1>
            <Badge variant="outline" className="text-[10px] uppercase font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
              Verified Citizen
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back, <strong className="text-foreground">{customer?.name || "Resident"}</strong>. Live power status and load-shedding alerts for your sector.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/reports/new">
            <Button size="sm" className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs bg-amber-600 hover:bg-amber-700 text-white">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Report Blackout</span>
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button size="sm" variant="outline" className="text-xs h-8 cursor-pointer gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>My Reports</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Status for User's Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Area Power Status */}
        <Card className={`border p-5 flex flex-col justify-between ${
          hasActiveOutage
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-emerald-500/30 bg-emerald-500/5"
        }`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Grid Status
              </span>
              <div className={`p-2 rounded-lg ${hasActiveOutage ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
            </div>

            <div className="pt-1">
              <span className={`text-xl font-bold block ${hasActiveOutage ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {hasActiveOutage ? "Outage In Progress" : "Grid Power Active"}
              </span>
              <span className="text-xs text-muted-foreground block mt-0.5">
                {hasActiveOutage
                  ? "Technicians or load shedding active in your sector."
                  : "Normal electricity supply active."}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border/40 text-xs flex items-center justify-between">
            <span className="text-muted-foreground">Assigned Sector:</span>
            <span className="font-semibold text-foreground truncate max-w-[150px]">
              {areaName}
            </span>
          </div>
        </Card>

        {/* Card 2: Profile & Account Information */}
        <Card className="border-border bg-card/60 p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account Information
              </span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Home className="h-4 w-4" />
              </div>
            </div>

            <div className="pt-1 space-y-1 text-xs">
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
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Active Citizen
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/40">
            <Link href="/dashboard/profile" className="text-xs font-medium text-primary hover:underline flex items-center justify-between">
              <span>Edit Profile & Area</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Quick Action Outage Reporting */}
        <Card className="border-border bg-card/60 p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Incident Reporting
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Experiencing an unexpected power blackout or line hazard in your sector? Submit an incident report to notify operators immediately.
            </p>
          </div>

          <div className="pt-3 border-t border-border/40">
            <Link href="/dashboard/reports/new">
              <Button size="sm" variant="outline" className="w-full text-xs h-8 cursor-pointer justify-between">
                <span>Submit Incident Report</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Schedules in User's Area */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Schedules for {areaName}
              </CardTitle>
            </div>
            <Link href={ROUTES.SCHEDULES}>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                <span>All Grid Schedules</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <CardDescription className="text-xs">
            Live timetables recorded specifically for your residential sector
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {areaOutages.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-2 border border-dashed border-border rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
              <p>No active or scheduled load-shedding recorded for your residential area.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {areaOutages.map((outage) => (
                <div
                  key={outage.id}
                  className="p-3 rounded-lg border border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={outage.type === "UNEXPECTED" ? "destructive" : "secondary"} className="text-[10px] font-mono uppercase">
                        {outage.type}
                      </Badge>
                      <span className="font-semibold text-foreground">{outage.title}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                      <span className="font-mono">ID: {outage.outageNumber}</span>
                      <span>•</span>
                      <span>
                        Starts: {new Date(outage.startTime).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {outage.status}
                    </Badge>
                    <Link href={`/schedules/${outage.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
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
