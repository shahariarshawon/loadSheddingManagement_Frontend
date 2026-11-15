import type { Metadata } from "next";
import {
  Layers,
  Zap,
  Cpu,
  MapPin,
  Server,
  Activity,
  Radio,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { env } from "@/lib/env";
import type { Zone, Substation, Area, ApiResponse } from "@/types";

export const metadata: Metadata = {
  title: "Distribution Network Topology",
  description:
    "Explore the 4-tier electrical distribution network hierarchy across zones, substations, feeders, and areas.",
};

async function getGridData() {
  try {
    const [zonesRes, substationsRes, areasRes] = await Promise.all([
      fetch(`${env.backendApiUrl}/zones?limit=50`, { cache: "no-store" }),
      fetch(`${env.backendApiUrl}/substations?limit=50`, { cache: "no-store" }),
      fetch(`${env.backendApiUrl}/areas?limit=50`, { cache: "no-store" }),
    ]);

    const zonesData: ApiResponse<Zone[]> = await zonesRes.json().catch(() => ({ data: [] }));
    const substationsData: ApiResponse<Substation[]> = await substationsRes.json().catch(() => ({ data: [] }));
    const areasData: ApiResponse<Area[]> = await areasRes.json().catch(() => ({ data: [] }));

    return {
      zones: zonesData.data || [],
      substations: substationsData.data || [],
      areas: areasData.data || [],
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      (String((error as { digest?: unknown }).digest).includes("HANGING_PROMISE") ||
        String((error as { digest?: unknown }).digest).includes("NEXT_"))
    ) {
      throw error;
    }
    console.error("Failed to load network topology:", error);
    return { zones: [], substations: [], areas: [] };
  }
}

export default async function NetworkPage() {
  const { zones, substations, areas } = await getGridData();

  return (
    <div className="flex flex-col min-h-screen py-10 sm:py-16 space-y-12">
      {/* Header */}
      <section className="container mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <Activity className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
          <span>Live Grid Topology Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Distribution Network Architecture
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Inspect real distribution corridors, high-voltage substations, and residential sectors mapped in the GridWatch system.
        </p>
      </section>

      {/* Overview Stat Counters */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground block">{zones.length}</span>
              <span className="text-xs text-muted-foreground font-medium">Distribution Zones</span>
            </div>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground block">{substations.length}</span>
              <span className="text-xs text-muted-foreground font-medium">Grid Substations</span>
            </div>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground block">
                {substations.reduce((acc, s) => acc + (s.capacityKva ? 1 : 0), 0) + 1}
              </span>
              <span className="text-xs text-muted-foreground font-medium">Active Feeders</span>
            </div>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-foreground block">{areas.length}</span>
              <span className="text-xs text-muted-foreground font-medium">Monitored Sectors</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Distribution Zones Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              <span>Primary Power Zones (Tier 1)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Regional transmission territories controlling load distribution.
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px] font-mono">
            {zones.length} Zones
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <Card key={zone.id} className="border-border bg-card/60 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase">
                    {zone.code}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    ID: {zone.id.slice(0, 8)}...
                  </span>
                </div>
                <CardTitle className="text-base font-semibold pt-1">
                  {zone.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {zone.description || "Primary regional electrical transmission corridor."}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Substations Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-amber-500" />
              <span>Grid Substations (Tier 2)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Step-down voltage conversion stations supplying child feeders.
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px] font-mono">
            {substations.length} Substations
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {substations.map((sub) => (
            <Card key={sub.id} className="border-border bg-card/60 hover:border-amber-500/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 border-amber-500/30">
                    {sub.code}
                  </Badge>
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {sub.capacityKva ? `${(sub.capacityKva / 1000).toLocaleString()} MVA` : "Nominal"}
                  </span>
                </div>
                <CardTitle className="text-sm font-semibold pt-1">
                  {sub.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">
                <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                  <span>Assigned Zone:</span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">
                    {sub.zone?.name || "Connected"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Residential Areas Grid */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-emerald-500" />
              <span>Residential & Commercial Sectors (Tier 4)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Neighborhood distribution clusters with live customer accounts and outage history.
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px] font-mono">
            {areas.length} Areas
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {areas.slice(0, 12).map((area) => (
            <div
              key={area.id}
              className="p-3.5 rounded-xl border border-border bg-card/60 hover:border-emerald-500/40 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground truncate max-w-[180px]">
                  {area.name}
                </span>
                {area.postalCode && (
                  <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-4">
                    Postal: {area.postalCode}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>Connected Feeder:</span>
                <span className="font-mono text-foreground">
                  {area.feeder?.code || "Feeder Linked"}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-[11px] pt-1 border-t border-border/40">
                <span>Outage Records:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {area.outageCount !== undefined ? `${area.outageCount} Outages` : "Telemetry Active"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
