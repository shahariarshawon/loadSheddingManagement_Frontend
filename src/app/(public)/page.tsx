import Link from "next/link";
import {
  Zap,
  CalendarSearch,
  AlertCircle,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Layers,
  CheckCircle2,
  Lock,
  Clock,
  Activity,
  Users,
  Compass,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SchedulePreview } from "@/components/shared/schedule-preview";
import { ROUTES, DEMO_CREDENTIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ==================================================================== */}
      {/* 1. Hero Banner with Authentic Photography & Clean Typography */}
      {/* ==================================================================== */}
      <section className="relative overflow-hidden border-b border-border bg-slate-950 text-white py-20 sm:py-28 lg:py-36">
        {/* Authentic Background Photography of Electric Infrastructure */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity filter contrast-125"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        {/* Professional Dark Gradient Vignette for Maximum Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />

        <div className="container relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Live System Telemetry Status Indicator */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>National Distribution Grid Telemetry Active</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-[11px] text-slate-400">Dhaka & Regional Hubs</span>
          </div>

          {/* Authentic Clean Headline Required by Specification */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stay Informed. Plan Ahead. <br />
            <span className="text-amber-400">Stay Powered.</span>
          </h1>

          {/* Concise, Informative Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A centralized distribution monitoring platform providing transparent load shedding timetables, 
            substation feeder telemetry, and coordinated community outage resolution for homes and enterprises.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.SCHEDULES}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-2 shadow-sm text-sm h-11 px-6 cursor-pointer"
              )}
            >
              <CalendarSearch className="h-4 w-4" />
              <span>Explore Schedules</span>
            </Link>

            <Link
              href={ROUTES.REGISTER}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-semibold gap-2 text-sm h-11 px-6 cursor-pointer"
              )}
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={ROUTES.LOGIN}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "w-full sm:w-auto text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium text-sm h-11 px-4 cursor-pointer"
              )}
            >
              <Lock className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>Sign In / Demo</span>
            </Link>
          </div>

          {/* Operational Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>PostgreSQL Advisory Lock Guards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Real-Time Multi-Feeder Schedules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Citizen Incident Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 2. Platform Introduction: Purpose, Stakeholders & Public Utility Context */}
      {/* ==================================================================== */}
      <section className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <Badge variant="outline" className="text-xs font-mono uppercase tracking-wider text-primary">
                About The Platform
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Predictability and Transparency for Modern Electrical Grids
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rapid urbanization and seasonal peak demand frequently strain distribution infrastructure. 
                Without clear notification, sudden outages damage commercial machinery, disrupt hospitals, 
                and leave residential neighborhoods in the dark.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong>GridWatch</strong> replaces rumor and surprise with verified, synchronized scheduling. 
                By connecting regional dispatch centers directly with local feeders and residential consumers, 
                every outage is accounted for, time-bounded, and actively monitored until full restoration.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={ROUTES.NETWORK}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-xs font-semibold gap-1.5")}
                >
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>Inspect Grid Hierarchy</span>
                </Link>
                <Link
                  href={ROUTES.ABOUT}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs font-semibold text-muted-foreground")}
                >
                  <span>Learn Platform Architecture</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border border-border/80 bg-muted/20">
                <CardHeader className="p-5 pb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 w-fit mb-2">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold">12,500+ Consumers</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground">
                  Residential and commercial meters mapped across primary and backup feeder routes.
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-muted/20">
                <CardHeader className="p-5 pb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 w-fit mb-2">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold">99.4% Telemetry Uptime</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground">
                  Continuous status synchronization between grid substations and central control rooms.
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-muted/20">
                <CardHeader className="p-5 pb-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 w-fit mb-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold">Zero Conflict Locks</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground">
                  Database transaction locks prevent simultaneous double-scheduling on the same feeder.
                </CardContent>
              </Card>

              <Card className="border border-border/80 bg-muted/20">
                <CardHeader className="p-5 pb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 w-fit mb-2">
                    <Compass className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold">4-Tier Regional Grid</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground">
                  Granular drill-down across Zones, Substations, Feeders, and Local Consumer Sectors.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. Core Features Section */}
      {/* ==================================================================== */}
      <section className="py-20 bg-muted/30 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider">
              System Capabilities
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Core Grid Management Features
            </h2>
            <p className="text-sm text-muted-foreground">
              Engineered with transactional integrity and role-specific operational workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="border border-border bg-card shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <CalendarSearch className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">Schedules & Predictions</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Time-bounded rotational load-shedding timetables. PostgreSQL advisory locks ensure zero overlapping blackout schedules in the same residential feeder.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border border-border bg-card shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">Area & Zone Exploration</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Explore distribution territories hierarchically from Regional Zones down to 132/33kV Substations, 11kV Feeders, and localized neighborhood sectors.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border border-border bg-card shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">Community Outage Reporting</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Citizens submit sudden blackout reports with real-time severity classification. Grid operators triage community reports and link them to repair actions.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border border-border bg-card shadow-xs hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                  <Wrench className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-bold">Technician Dispatch</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Utility operators assign specialized field repair crews with single-active assignment guards. Restoration cascades notifications to all affected residents.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 4. Schedule Explorer Preview (Live / Interactive Data Preview) */}
      {/* ==================================================================== */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  Live Outage Telemetry
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Schedule Explorer Preview
              </h2>
              <p className="text-sm text-muted-foreground">
                Inspect real-time rotational load shedding timetables across regional sectors. Filter by area or view detailed restoration windows.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Status Legend:</span>
              <Badge variant="outline" className="border-blue-500/40 text-blue-600 dark:text-blue-400 text-[10px]">
                Scheduled
              </Badge>
              <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px]">
                Active Shedding
              </Badge>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px]">
                Restored
              </Badge>
            </div>
          </div>

          {/* Interactive Live Schedules Card Preview Component */}
          <SchedulePreview />
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 5. How It Works: 4 Straightforward Steps */}
      {/* ==================================================================== */}
      <section className="py-20 bg-muted/20 border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider">
              Workflow Lifecycle
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              How GridWatch Operates
            </h2>
            <p className="text-sm text-muted-foreground">
              A continuous, auditable cycle from initial schedule formulation to verified power restoration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="flex flex-col space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-primary/30">01</span>
                <Badge variant="outline" className="text-[10px] font-mono">Stage 1</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Formulate & Lock Schedule</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Operators draft rotating schedules for specific feeders. PostgreSQL advisory locks prevent conflicting overlapping timeslots.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-primary/30">02</span>
                <Badge variant="outline" className="text-[10px] font-mono">Stage 2</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Citizen Notification</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Timetables are published publicly. Registered residents check their area schedules, planning daily business without sudden disruption.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-primary/30">03</span>
                <Badge variant="outline" className="text-[10px] font-mono">Stage 3</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Incident Triage & Dispatch</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When unplanned blackouts occur, citizen reports are clustered and field repair technicians dispatched with guarded assignments.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col space-y-3 p-5 rounded-xl border border-border bg-card shadow-xs relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-primary/30">04</span>
                <Badge variant="outline" className="text-[10px] font-mono">Stage 4</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Restoration & Reliability</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Circuits re-energized, resolution status recorded, and 30-day reliability metrics updated automatically on the platform ledger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 6. User Benefits & Distinct Role Matrix */}
      {/* ==================================================================== */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider">
              Tailored Experience
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Built for Every Stakeholder
            </h2>
            <p className="text-sm text-muted-foreground">
              Distinct portals with dedicated permissions and specialized interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Consumer Card */}
            <Card className="border border-border/80 bg-card shadow-xs flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono">CONSUMER</Badge>
                  <Users className="h-4 w-4 text-emerald-500" />
                </div>
                <CardTitle className="text-lg font-bold">Residential Citizens</CardTitle>
                <CardDescription className="text-xs">
                  Full visibility for homeowners, renters, and local businesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Real-time load shedding timetable lookup by area</li>
                  <li>One-click blackout reporting with photo/description</li>
                  <li>Reliability pass with 30-day availability scores</li>
                  <li>Live notifications when grid status transitions</li>
                </ul>
                <div className="pt-3 border-t text-[11px] text-foreground font-mono flex items-center justify-between">
                  <span>Demo: <strong className="text-primary">{DEMO_CREDENTIALS.CUSTOMER.email}</strong></span>
                  <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">Test Login →</Link>
                </div>
              </CardContent>
            </Card>

            {/* Operator Card */}
            <Card className="border border-primary/40 bg-card shadow-sm flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs font-mono text-primary">POWER_OPERATOR</Badge>
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <CardTitle className="text-lg font-bold">Utility Dispatchers</CardTitle>
                <CardDescription className="text-xs">
                  Comprehensive dispatch and feeder management console.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>Interactive schedule creation with advisory locks</li>
                  <li>Incident report verification and outage linking</li>
                  <li>Technician assignment and status progression</li>
                  <li>Circuit energization and power restoration logs</li>
                </ul>
                <div className="pt-3 border-t text-[11px] text-foreground font-mono flex items-center justify-between">
                  <span>Demo: <strong className="text-primary">{DEMO_CREDENTIALS.OPERATOR.email}</strong></span>
                  <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">Test Login →</Link>
                </div>
              </CardContent>
            </Card>

            {/* Administrator Card */}
            <Card className="border border-border/80 bg-card shadow-xs flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono">ADMIN</Badge>
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-lg font-bold">Platform Administrators</CardTitle>
                <CardDescription className="text-xs">
                  Centralized governance, auditing, and grid topology.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs text-muted-foreground">
                <ul className="space-y-2 list-disc list-inside">
                  <li>User role promotion and account status management</li>
                  <li>Full 4-tier grid topology control (Zones & Feeders)</li>
                  <li>Field technician creation and roster assignment</li>
                  <li>System-wide audit trail logs and payment tracking</li>
                </ul>
                <div className="pt-3 border-t text-[11px] text-foreground font-mono flex items-center justify-between">
                  <span>Demo: <strong className="text-primary">{DEMO_CREDENTIALS.ADMIN.email}</strong></span>
                  <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-semibold">Test Login →</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 7. Call To Action (CTA) Section */}
      {/* ==================================================================== */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs font-mono">
            Assignment Evaluation Ready
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Explore the Power Management Platform?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Test live load shedding schedules, explore distribution hierarchy, or log in with verified demo accounts to evaluate all three role dashboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.SCHEDULES}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm h-11 px-6 cursor-pointer"
              )}
            >
              <CalendarSearch className="h-4 w-4 mr-2" />
              <span>Explore Public Schedules</span>
            </Link>

            <Link
              href={ROUTES.LOGIN}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm h-11 px-6 cursor-pointer"
              )}
            >
              <Lock className="h-4 w-4 mr-2 text-slate-300" />
              <span>Sign In with Demo Accounts</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
