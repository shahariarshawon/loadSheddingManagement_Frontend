import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Radio,
  Cpu,
  Layers,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About GridWatch",
  description:
    "Learn about GridWatch, our mission to modernize electricity distribution monitoring, and conflict-free load-shedding management.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen py-10 sm:py-16 space-y-16">
      {/* Hero Banner */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-4">
        <Badge variant="outline" className="text-xs uppercase font-mono px-3 py-1 border-primary/30 text-primary">
          Infrastructure Modernization
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          About GridWatch
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          GridWatch is an enterprise-grade power distribution management and load-shedding scheduling system. We bridge the communication gap between utility dispatchers, field engineers, and residential consumers across multi-tier regional electrical grids.
        </p>
      </section>

      {/* Core Objectives */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary mb-2">
                <Radio className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Real-Time Telemetry</CardTitle>
              <CardDescription className="text-xs">
                Transparent schedules published directly from regional power dispatch stations.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Eliminate unexpected blackouts through publicly accessible, verified load-shedding timetables tracked down to the individual feeder and local residential neighborhood.
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2.5 w-fit rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
                <Cpu className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Advisory Locked Dispatch</CardTitle>
              <CardDescription className="text-xs">
                Database-level concurrency protection for grid technician assignments.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Our backend leverages PostgreSQL transaction advisory locks to guarantee zero schedule conflicts and prevent double-booking of emergency restoration technicians during peak load spikes.
            </CardContent>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm">
            <CardHeader>
              <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Restoration Cascade</CardTitle>
              <CardDescription className="text-xs">
                Automated notification triage when power is restored to a neighborhood.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              When utility operators mark an outage restored, all associated customer reports automatically resolve, field technicians are unlocked, and in-app alerts are dispatched across the area.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4-Tier Hierarchy Explanation */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs font-mono uppercase">
              Distribution Architecture
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              4-Tier Grid Network Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Electrical power distribution is organized in an authoritative hierarchical chain ensuring granular monitoring and precision outage routing:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Layers className="h-4 w-4" />
                <span>1. Zones</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Regional territories such as Dhaka North and Dhaka South governing major transmission corridors.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Zap className="h-4 w-4" />
                <span>2. Substations</span>
              </div>
              <p className="text-xs text-muted-foreground">
                High-capacity step-down facilities (e.g., Gulshan 132/33kV Grid Substation) with designated kVA load limits.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Cpu className="h-4 w-4" />
                <span>3. Feeders</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Dedicated medium-voltage transmission lines rated up to max kW capacities delivering power to sectors.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Users className="h-4 w-4" />
                <span>4. Areas</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Residential and commercial sectors (e.g., Gulshan-2 Sector C) where residents reside and report outages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Summary */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-center">
          Engineered for Fullstack Transparency
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Dual-token JWT authentication with cryptographically isolated HTTP-only cookies.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Strict role-based access control guarding Administrator, Operator, and Customer portals.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Real-time outage search, multi-field relational filtering, and URL-synchronized pagination.</span>
          </div>
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-border bg-card">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Public schedule explorer with repair event history and chronologically indexed audit logs.</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-6">
          <Link href={ROUTES.SCHEDULES}>
            <Button size="sm" className="font-medium text-xs">
              Explore Live Schedules
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href={ROUTES.CONTACT}>
            <Button variant="outline" size="sm" className="font-medium text-xs">
              Contact Dispatch Center
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
