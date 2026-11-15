import type { Metadata } from "next";
import {
  Home,
  MapPin,
  Server,
  KeyRound,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Consumer Portal",
  description: "GridWatch residential consumer dashboard and outage tracking portal.",
};

export default async function ConsumerDashboardPage() {
  const session = await getServerSession();
  const customer = session.user;

  const areaName =
    customer?.area?.name ||
    (customer?.areaId ? `Area (${customer.areaId})` : "Unassigned Area");

  return (
    <div className="space-y-6">
      {/* Welcome Heading */}
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
            Welcome back, <strong className="text-foreground">{customer?.name || "Customer"}</strong>. Your household power telemetry and outage reporting portal is active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Account Active</span>
          </div>
        </div>
      </div>

      {/* Authenticated Customer Identity & Assigned Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Verified Consumer Profile */}
        <Card className="border-emerald-500/20 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Home className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Customer Account Profile
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Authenticated consumer details and registered residential sector
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Resident Name</span>
                <span className="font-semibold text-foreground truncate block">
                  {customer?.name || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Registered Email</span>
                <span className="font-semibold text-foreground truncate block">
                  {customer?.email || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Assigned Role</span>
                <Badge variant="secondary" className="text-[10px] font-mono mt-0.5">
                  {customer?.role || "CUSTOMER"}
                </Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Service Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {customer?.isActive ? "Active / In Good Standing" : "Suspended"}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Assigned Grid Area:
                </span>
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {areaName}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Contact Phone:</span>
                <span className="text-foreground">{customer?.phone || "Not specified"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Security & Session Isolation */}
        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Server className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Protected Consumer Session
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Backend token storage and cross-session persistence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <KeyRound className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Zero Browser Storage Token Security
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    No tokens are saved in localStorage or sessionStorage. All tokens are secured inside encrypted HTTP-Only cookies with SameSite=Lax protection.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Role-Based Boundaries
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Consumer accounts are strictly bounded to consumer services. Administrative actions and dispatch portals require privileged backend credentials.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 2 Foundation Banner & Phase 3 Roadmap */}
      <Card className="border-border/80 bg-linear-to-r from-emerald-500/5 via-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Phase 2 Consumer Foundation Active
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Phase 2 Complete
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Customer authentication, area binding, and consumer navigation layout are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-3.5 rounded-lg border border-border/80 bg-background/80 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">
              Upcoming Phase 3 Citizen Modules (Reserved for Next Phase):
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Submit Outage Incident Reports (/dashboard/reports/new)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Track My Incident Reports & Resolution Status (/dashboard/reports)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Stripe Checkout for 30-Day Area Reliability Pass (/dashboard/billing)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Protected Area Reliability Analytics Chart (/dashboard/analytics)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
