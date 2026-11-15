import type { Metadata } from "next";
import {
  Radio,
  Server,
  KeyRound,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Operator Dispatch Station",
  description: "GridWatch electricity provider and power operator dispatch station.",
};

export default async function ProviderDashboardPage() {
  const session = await getServerSession();
  const operator = session.user;

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
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
            Welcome back, <strong className="text-foreground">{operator?.name || "Power Operator"}</strong>. Grid dispatch and load-shedding control station is online.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span>Telemetry Stream Active</span>
          </div>
        </div>
      </div>

      {/* Authenticated Operator Identity & Dispatch Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Verified Operator Profile */}
        <Card className="border-amber-500/20 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Radio className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Verified Operator Credentials
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Authenticated grid operator profile linked to power dispatch services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Operator Name</span>
                <span className="font-semibold text-foreground truncate block">
                  {operator?.name || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Dispatch Email</span>
                <span className="font-semibold text-foreground truncate block">
                  {operator?.email || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Assigned Role</span>
                <Badge variant="secondary" className="text-[10px] font-mono mt-0.5">
                  {operator?.role || "POWER_OPERATOR"}
                </Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Station Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {operator?.isActive ? "Authorized & Active" : "Suspended"}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Database User ID:</span>
                <span className="font-mono text-foreground">{operator?.id}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Phone / Radio Contact:</span>
                <span className="text-foreground">{operator?.phone || "Standard Hotline"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Dispatch Security Architecture */}
        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Server className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Session & Route Guard Configuration
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Role isolation mechanisms guarding dispatch operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <KeyRound className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Operator Role Authorization
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Access is restricted to verified `POWER_OPERATOR` accounts. Customer accounts attempting to navigate to `/provider/*` are automatically redirected to 403 Forbidden.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Token Rotation & Revocation
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    BFF sessions refresh automatically before expiration using secure token rotation, backed by PostgreSQL refresh token revocation tables.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 2 Foundation Banner & Phase 3 Roadmap */}
      <Card className="border-border/80 bg-linear-to-r from-amber-500/5 via-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Phase 2 Dispatch Foundation Active
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Phase 2 Complete
            </Badge>
          </div>
          <CardDescription className="text-xs">
            The Operator shell, navigation matrix, and authentication boundaries are established.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-3.5 rounded-lg border border-border/80 bg-background/80 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">
              Upcoming Phase 3 Dispatch Workflows (Reserved for Next Phase):
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Conflict-Free Outage Scheduler (/provider/schedules/new)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Customer Blackout Incident Triage & Verification (/provider/reports)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Technician Dispatch with PostgreSQL Advisory Locks (/provider/technicians)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Live Power Restoration Cascade & Notification Dispatch</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
