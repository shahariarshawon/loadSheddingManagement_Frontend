import Link from "next/link";
import {
  Zap,
  CalendarSearch,
  AlertCircle,
  Wrench,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Radio,
  Layers,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES, DEMO_CREDENTIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ==================================================================== */}
      {/* Hero Section */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24 lg:py-32">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary shadow-xs">
              <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>GridWatch Live Telemetry Online</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-mono text-[11px] text-muted-foreground">PostgreSQL Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Real-Time Power Outage &{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-amber-500 bg-clip-text text-transparent">
                Load Shedding
              </span>{" "}
              Management
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              An enterprise distribution monitoring platform connecting citizens, power utility operators, and field technicians across multi-tiered regional electrical grids.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <Link
                href={ROUTES.SCHEDULES}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto gap-2 text-sm font-semibold shadow-md"
                )}
              >
                <CalendarSearch className="h-4 w-4" />
                View Live Schedules
              </Link>

              <Link
                href={ROUTES.LOGIN}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto gap-2 text-sm font-semibold"
                )}
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Report an Outage
              </Link>

              <Link
                href={ROUTES.NETWORK}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "w-full sm:w-auto gap-1 text-sm font-semibold text-muted-foreground"
                )}
              >
                <span>Grid Topology</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-6 pt-6 text-xs text-muted-foreground border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Zero Conflict Scheduling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Advisory Locked Dispatch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Verified Stripe Test Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4-Tier Grid Architecture Visualization */}
      {/* ==================================================================== */}
      <section className="py-16 bg-muted/20 border-b border-border/80">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono">
              Topology Hierarchy
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              4-Tier Distribution Network
            </h2>
            <p className="text-sm text-muted-foreground">
              GridWatch organizes power flow from regional zones down to local residential sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level 1: Zone */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">Tier 1</Badge>
                  <Layers className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base font-bold mt-2">Distribution Zones</CardTitle>
                <CardDescription className="text-xs">
                  Regional grid territories covering major urban areas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 text-xs text-muted-foreground space-y-1 font-mono">
                <div>• Dhaka North Distribution</div>
                <div>• Dhaka South Distribution</div>
              </CardContent>
            </Card>

            {/* Level 2: Substation */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">Tier 2</Badge>
                  <Zap className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-base font-bold mt-2">Grid Substations</CardTitle>
                <CardDescription className="text-xs">
                  High-voltage 132/33kV power conversion hubs.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 text-xs text-muted-foreground space-y-1 font-mono">
                <div>• Gulshan 100MVA Substation</div>
                <div>• Dhanmondi 80MVA Substation</div>
              </CardContent>
            </Card>

            {/* Level 3: Feeder */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">Tier 3</Badge>
                  <Wrench className="h-4 w-4 text-amber-500" />
                </div>
                <CardTitle className="text-base font-bold mt-2">Primary Feeders</CardTitle>
                <CardDescription className="text-xs">
                  11kV high-capacity commercial and residential transmission lines.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 text-xs text-muted-foreground space-y-1 font-mono">
                <div>• Gulshan Res Feeder 01</div>
                <div>• Banani Commercial Feeder 01</div>
              </CardContent>
            </Card>

            {/* Level 4: Area */}
            <Card className="border-border/80 bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px]">Tier 4</Badge>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-base font-bold mt-2">Consumer Areas</CardTitle>
                <CardDescription className="text-xs">
                  Local residential blocks, commercial strips, and customer meters.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 text-xs text-muted-foreground space-y-1 font-mono">
                <div>• Gulshan-2 Sector C</div>
                <div>• Dhanmondi Road 27</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* Verified Core Capabilities */}
      {/* ==================================================================== */}
      <section className="py-20 bg-background border-b border-border/80">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineered for Complete Grid Reliability
            </h2>
            <p className="text-sm text-muted-foreground">
              Built upon verified REST API endpoints and strict database constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border-border/80 hover:border-primary/50 transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-2">
                  <CalendarSearch className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold">Planned Load Shedding</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Time-bound scheduling guarded by PostgreSQL advisory locks preventing concurrent scheduling conflicts in the same residential area.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border/80 hover:border-primary/50 transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-2">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold">Citizen Incident Reporting</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Citizens submit sudden blackout reports with severity ratings. Operators review and either link reports or trigger unexpected outage workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border/80 hover:border-primary/50 transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
                  <Wrench className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold">Technician Dispatch</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Utility operators assign specialized repair crews with single-active assignment guards. Restoration cascades notifications to all affected residents.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-border/80 hover:border-primary/50 transition-all duration-200">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-2">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-bold">30-Day Grid Analytics</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Stripe-gated Area Reliability Analytics calculating live 30-day availability scores (99.0%+ EXCELLENT), cumulative downtime, and restoration benchmarks.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3 User Roles & Demo Access Matrix */}
      {/* ==================================================================== */}
      <section className="py-20 bg-muted/20 border-b border-border/80">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono">
              Role-Based Access Control
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Three Distinct User Portals
            </h2>
            <p className="text-sm text-muted-foreground">
              Pre-configured demo credentials available for instant verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Customer Role */}
            <Card className="border-border/80 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">Role: CUSTOMER</Badge>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-bold mt-2">{DEMO_CREDENTIALS.CUSTOMER.label}</CardTitle>
                <CardDescription className="text-xs">
                  Public electricity consumer portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>View scheduled load-shedding for your area</li>
                  <li>Submit blackout reports & track resolution</li>
                  <li>In-app power restoration alerts</li>
                  <li>Purchase Area Reliability Pass ($10/mo)</li>
                </ul>
                <div className="pt-2 border-t text-[11px] font-mono text-foreground">
                  Demo: <span className="text-primary font-semibold">{DEMO_CREDENTIALS.CUSTOMER.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Operator Role */}
            <Card className="border-primary/40 bg-card shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-mono text-xs text-primary">Role: POWER_OPERATOR</Badge>
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <CardTitle className="text-lg font-bold mt-2">{DEMO_CREDENTIALS.OPERATOR.label}</CardTitle>
                <CardDescription className="text-xs">
                  Grid operations and dispatch portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Create & publish load-shedding schedules</li>
                  <li>Triage and verify incoming citizen reports</li>
                  <li>Dispatch field technicians with locks</li>
                  <li>Record live repair progress & restore power</li>
                </ul>
                <div className="pt-2 border-t text-[11px] font-mono text-foreground">
                  Demo: <span className="text-primary font-semibold">{DEMO_CREDENTIALS.OPERATOR.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Role */}
            <Card className="border-border/80 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">Role: ADMIN</Badge>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-lg font-bold mt-2">{DEMO_CREDENTIALS.ADMIN.label}</CardTitle>
                <CardDescription className="text-xs">
                  System administrative control center.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>User role promotion & account suspension</li>
                  <li>Grid topology management (Zones/Feeders)</li>
                  <li>Field technician creation and management</li>
                  <li>System-wide audit logs & Stripe ledger</li>
                </ul>
                <div className="pt-2 border-t text-[11px] font-mono text-foreground">
                  Demo: <span className="text-primary font-semibold">{DEMO_CREDENTIALS.ADMIN.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* Call to Action Banner */}
      {/* ==================================================================== */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Explore GridWatch?
          </h2>
          <p className="text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Check real-time power outage timetables for your residential sector or sign in with verified demo credentials.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={ROUTES.SCHEDULES}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "font-semibold text-sm"
              )}
            >
              Explore Public Schedules
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-sm"
              )}
            >
              Go to Authentication
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
