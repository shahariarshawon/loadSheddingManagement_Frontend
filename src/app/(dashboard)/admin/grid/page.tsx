"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Layers,
  Zap,
  MapPin,
  PlusCircle,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import type { Zone, Substation, Area, ApiResponse } from "@/types";

const zoneSchema = z.object({
  name: z.string().trim().min(3, "Zone name must be at least 3 characters"),
  code: z.string().trim().min(3, "Unique zone code is required (e.g., ZONE-DHAKA-EAST)"),
  description: z.string().trim().optional(),
});
type ZoneFormData = z.infer<typeof zoneSchema>;

export default function GridTopologyPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"zones" | "substations" | "areas">("zones");
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: zonesRes, isLoading: loadingZones } = useQuery<ApiResponse<Zone[]>>({
    queryKey: ["grid", "zones"],
    queryFn: () => apiClient.get<Zone[]>("/zones?limit=50"),
  });

  const { data: subsRes, isLoading: loadingSubs } = useQuery<ApiResponse<Substation[]>>({
    queryKey: ["grid", "substations"],
    queryFn: () => apiClient.get<Substation[]>("/substations?limit=50"),
  });

  const { data: areasRes, isLoading: loadingAreas } = useQuery<ApiResponse<Area[]>>({
    queryKey: ["grid", "areas"],
    queryFn: () => apiClient.get<Area[]>("/areas?limit=50"),
  });

  const zones = zonesRes?.data || [];
  const substations = subsRes?.data || [];
  const areas = areasRes?.data || [];

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: { name: "", code: "", description: "" },
  });

  // Create Zone Mutation
  const createZoneMutation = useMutation({
    mutationFn: (data: ZoneFormData) => apiClient.post("/zones", data),
    onSuccess: () => {
      toast.success("Zone Created Successfully", {
        description: "New electrical power zone registered in database.",
      });
      queryClient.invalidateQueries({ queryKey: ["grid", "zones"] });
      reset();
      setZoneModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error("Creation Failed", { description: err.message });
    },
  });

  // Delete Zone Mutation
  const deleteZoneMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/zones/${id}`),
    onSuccess: () => {
      toast.success("Zone Removed", { description: "Power zone soft-deleted." });
      queryClient.invalidateQueries({ queryKey: ["grid", "zones"] });
      setDeleteId(null);
    },
    onError: (err: Error) => {
      toast.error("Deletion Blocked", { description: err.message });
    },
  });

  const onZoneSubmit = (data: ZoneFormData) => {
    createZoneMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span>Grid Network Topology Manager</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure distribution zones, high-voltage substations, and residential sectors.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setZoneModalOpen(true)}
          className="text-xs h-8 cursor-pointer gap-1.5 shadow-xs w-fit"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Power Zone</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 text-xs">
        <button
          onClick={() => setActiveTab("zones")}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "zones"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Zones ({zones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("substations")}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "substations"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span>Substations ({substations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("areas")}
          className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === "areas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span>Residential Sectors ({areas.length})</span>
        </button>
      </div>

      {/* Zones View */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          {loadingZones && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!loadingZones && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => (
                <Card key={zone.id} className="border-border bg-card/60 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge variant="outline" className="text-[10px] font-mono uppercase mb-1">
                        {zone.code}
                      </Badge>
                      <h3 className="font-semibold text-sm text-foreground">{zone.name}</h3>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      onClick={() => setDeleteId(zone.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {zone.description || "Primary regional electrical transmission corridor."}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40 font-mono">
                    <span>Database ID:</span>
                    <span>{zone.id.slice(0, 12)}...</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Substations View */}
      {activeTab === "substations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {substations.map((sub) => (
              <Card key={sub.id} className="border-border bg-card/60 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 border-amber-500/30">
                    {sub.code}
                  </Badge>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                    {sub.capacityKva ? `${(sub.capacityKva / 1000).toLocaleString()} MVA` : "Nominal"}
                  </span>
                </div>

                <h3 className="font-semibold text-foreground text-sm pt-1">{sub.name}</h3>

                <div className="pt-2 border-t border-border/40 text-muted-foreground text-[11px] flex justify-between">
                  <span>Parent Zone:</span>
                  <span className="font-medium text-foreground truncate max-w-[140px]">
                    {sub.zone?.name || "Connected"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Areas View */}
      {activeTab === "areas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {areas.map((a) => (
              <div key={a.id} className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{a.name}</span>
                  {a.postalCode && (
                    <Badge variant="outline" className="text-[10px] font-mono px-1 py-0 h-4">
                      {a.postalCode}
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground flex justify-between">
                  <span>Feeder Code:</span>
                  <span className="font-mono text-foreground">{a.feeder?.code || "FDR Linked"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Zone Dialog */}
      <Dialog open={zoneModalOpen} onOpenChange={setZoneModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Register Power Distribution Zone</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new primary regional zone to the GridWatch electrical topology.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onZoneSubmit)} className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label htmlFor="code" className="text-xs font-semibold">
                Zone Unique Code *
              </Label>
              <Input
                id="code"
                placeholder="ZONE-DHAKA-EAST"
                className="text-xs font-mono uppercase"
                disabled={isSubmitting}
                {...register("code")}
              />
              {errors.code && <p className="text-[11px] text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold">
                Zone Name *
              </Label>
              <Input
                id="name"
                placeholder="Dhaka East Distribution Zone"
                className="text-xs"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-semibold">
                Description (Optional)
              </Label>
              <textarea
                id="description"
                rows={2}
                placeholder="Covers Badda, Rampura, and Aftabnagar grid corridors."
                className="w-full rounded-md border border-input bg-background p-2 text-xs"
                disabled={isSubmitting}
                {...register("description")}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setZoneModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={createZoneMutation.isPending} className="font-semibold text-xs">
                {createZoneMutation.isPending ? "Creating..." : "Save Zone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Distribution Zone</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to soft-delete this electrical zone?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={deleteZoneMutation.isPending}
              onClick={() => deleteId && deleteZoneMutation.mutate(deleteId)}
              className="text-xs font-semibold"
            >
              {deleteZoneMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
