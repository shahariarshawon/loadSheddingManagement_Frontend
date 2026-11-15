import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Layers,
  Radio,
  Zap,
  CheckCircle2,
  AlertCircle,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { Outage, ApiResponse } from "@/types";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Outage Schedule Details`,
    description: `Detailed load-shedding schedule and repair timeline for outage event ${id}.`,
  };
}

async function getOutageDetails(id: string) {
  try {
    const [outageRes, historyRes] = await Promise.all([
      fetch(`${env.backendApiUrl}/outages/${id}`, { cache: "no-store" }),
      fetch(`${env.backendApiUrl}/outages/${id}/history`, { cache: "no-store" }),
    ]);

    if (!outageRes.ok) return null;

    const outageData: ApiResponse<Outage> = await outageRes.json();
    const historyData: ApiResponse<unknown[]> = await historyRes.json().catch(() => ({ data: [] }));

    return {
      outage: outageData.data,
      history: historyData.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch outage details:", error);
    return null;
  }
}

export default async function OutageDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getOutageDetails(id);

  if (!result || !result.outage) {
    notFound();
  }

  const { outage } = result;
  const isEmergency = outage.type === "UNEXPECTED";
  const isActive = outage.status === "ACTIVE" || outage.status === "IN_PROGRESS";
  const isRestored = outage.status === "RESTORED" || outage.status === "COMPLETED";

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Back Button */}
      <div>
        <Link href={ROUTES.SCHEDULES}>
          <Button variant="ghost" size="sm" className="text-xs cursor-pointer gap-1.5 text-muted-foreground hover:text-foreground p-0">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Outage Schedules</span>
          </Button>
        </Link>
      </div>

      {/* Outage Header Card */}
      <Card className="border-border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isEmergency ? "destructive" : "secondary"} className="text-xs font-mono uppercase">
                {outage.type} Outage
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs font-mono uppercase ${
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
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-1">
              {outage.title}
            </h1>
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <span className="text-[11px] text-muted-foreground block">Outage Tracking ID</span>
            <span className="font-mono font-semibold text-xs text-foreground bg-muted/60 px-2 py-1 rounded-md inline-block">
              {outage.outageNumber}
            </span>
          </div>
        </div>

        {outage.description && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {outage.description}
          </p>
        )}

        {/* Cancellation Notice if applicable */}
        {outage.cancellationReason && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">Schedule Cancelled by Operator</span>
              <span className="text-[11px] leading-relaxed">{outage.cancellationReason}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Grid Network Topology Context */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Time Windows Card */}
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-4.5 w-4.5" />
              <CardTitle className="text-sm font-semibold">Schedule Time Window</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3.5 pt-0 text-sm">
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Start Time:</span>
              <span className="font-mono font-semibold text-foreground">
                {formatDateTime(outage.startTime)}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Target / Actual End:</span>
              <span className="font-mono font-semibold text-foreground">
                {outage.endTime ? formatDateTime(outage.endTime) : "Until Restoration"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Created By Dispatcher:</span>
              <span className="font-semibold text-foreground">
                {outage.createdBy?.name || "Power Operator"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Electrical Grid Breadcrumbs */}
        <Card className="border-border bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <MapPin className="h-4.5 w-4.5" />
              <CardTitle className="text-sm font-semibold">Affected Electrical Breadcrumb</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
              <span className="text-muted-foreground">Affected Sector:</span>
              <span className="font-semibold text-foreground truncate max-w-[180px]">
                {outage.area?.name || "Sector Linked"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
              <span className="text-muted-foreground">Feeder Line:</span>
              <span className="font-mono text-foreground">
                {outage.area?.feeder?.code || "Feeder Corridor"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40">
              <span className="text-muted-foreground">Substation:</span>
              <span className="text-foreground truncate max-w-[180px]">
                {outage.area?.feeder?.substation?.name || "Grid Substation"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restoration Event Timeline */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-primary" />
              <CardTitle className="text-sm font-semibold">Audit Event Log</CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              PostgreSQL Log
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Chronological log of operator actions, dispatch assignments, and restoration verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 border-l-2 border-primary/30 pl-4 py-1 text-sm">
            <div className="relative">
              <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <div className="font-bold text-foreground">Outage Created & Recorded</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatDateTime(outage.createdAt)} by {outage.createdBy?.name || "Operator"}
              </div>
            </div>

            {isRestored && (
              <div className="relative pt-2">
                <div className="absolute -left-[21px] top-3.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="font-bold text-emerald-600 dark:text-emerald-400">Power Restored & Verified</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {outage.endTime ? formatDateTime(outage.endTime) : "Restoration Complete"}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
