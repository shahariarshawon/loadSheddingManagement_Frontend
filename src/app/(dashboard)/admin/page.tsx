import type { Metadata } from "next";
import {
  ShieldAlert,
  Server,
  KeyRound,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Admin Control Center",
  description: "GridWatch platform administration and grid governance portal.",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  const admin = session.user;

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
            Welcome back, <strong className="text-foreground">{admin?.name || "Administrator"}</strong>. Grid governance and access telemetry are active.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Session Verified</span>
          </div>
        </div>
      </div>

      {/* Authenticated Identity & Security Scope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Verified User Identity */}
        <Card className="border-purple-500/20 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Verified Administrator Identity
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Live credentials validated by PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Admin Name</span>
                <span className="font-semibold text-foreground truncate block">
                  {admin?.name || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Primary Email</span>
                <span className="font-semibold text-foreground truncate block">
                  {admin?.email || "N/A"}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Role Privilege</span>
                <Badge variant="secondary" className="text-[10px] font-mono mt-0.5">
                  {admin?.role || "ADMIN"}
                </Badge>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60">
                <span className="text-muted-foreground block text-[11px]">Account Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {admin?.isActive ? "Active / In Good Standing" : "Suspended"}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-[11px] space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Database User ID:</span>
                <span className="font-mono text-foreground">{admin?.id}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Account Created:</span>
                <span className="text-foreground">
                  {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "Active"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Security & Backend Architecture */}
        <Card className="border-border bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Server className="h-4.5 w-4.5" />
              <CardTitle className="text-base font-semibold">
                Backend-For-Frontend (BFF) Security
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Token isolation and Next.js route protection specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <KeyRound className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    HTTP-Only Cookie Isolation
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Access and refresh JWTs are stored in HTTP-Only, SameSite=Lax cookies, completely inaccessible to browser JavaScript.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/40">
                <Layers className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-foreground">
                    Next.js 16 Proxy + Server Guard
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Multi-layer protection: `src/proxy.ts` performs edge boundary validation, while Server Component layouts execute live backend session verification.
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase 2 Foundation Banner & Phase 3 Roadmap */}
      <Card className="border-border/80 bg-linear-to-r from-purple-500/5 via-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Phase 2 Architecture Established
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              Phase 2 Complete
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Authentication, authorization, session persistence, and role-based dashboard shells are fully implemented and verified against the live Render backend.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="p-3.5 rounded-lg border border-border/80 bg-background/80 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">
              Upcoming Phase 3 Modules (Reserved for Next Phase):
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Administrative User & Role Management (/admin/users)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>4-Tier Electrical Grid Topology Manager (/admin/grid)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Financial Transactions & Stripe Pass Audit (/admin/payments)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span>Immutable System Audit Trail Explorer (/admin/audit-logs)</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
