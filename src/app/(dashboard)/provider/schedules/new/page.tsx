"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Calendar,
  ArrowLeft,
  Send,
  Loader2,
  MapPin,
  Clock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import type { Area, ApiResponse } from "@/types";

const outageFormSchema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters"),
    areaId: z.string().trim().min(1, "Please select an affected electrical area"),
    type: z.enum(["PLANNED", "UNEXPECTED"]),
    status: z.enum(["PUBLISHED", "DRAFT"]),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    description: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime).getTime();
      const end = new Date(data.endTime).getTime();
      return end > start;
    },
    {
      message: "Schedule end time must be strictly after the start time",
      path: ["endTime"],
    }
  );

type OutageFormData = z.infer<typeof outageFormSchema>;

export default function NewSchedulePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Load available areas
  const { data: areasRes, isLoading: loadingAreas } = useQuery<ApiResponse<Area[]>>({
    queryKey: ["areas", "schedule-options"],
    queryFn: () => apiClient.get<Area[]>("/areas?limit=50"),
  });
  const areas = areasRes?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OutageFormData>({
    resolver: zodResolver(outageFormSchema),
    defaultValues: {
      title: "",
      areaId: "",
      type: "PLANNED",
      status: "PUBLISHED",
      startTime: "",
      endTime: "",
      description: "",
    },
  });

  const createOutageMutation = useMutation({
    mutationFn: (data: OutageFormData) =>
      apiClient.post("/outages", {
        ...data,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
      }),
    onSuccess: () => {
      toast.success("Outage Schedule Created", {
        description: "Zero-conflict check passed. Schedule published to the network.",
      });
      queryClient.invalidateQueries({ queryKey: ["provider", "outages"] });
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      router.push("/provider/schedules");
    },
    onError: (err: Error) => {
      toast.error("Scheduling Conflict or Error", { description: err.message });
    },
  });

  const onSubmit = (data: OutageFormData) => {
    createOutageMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/provider/schedules">
          <Button variant="ghost" size="sm" className="text-xs cursor-pointer gap-1.5 p-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Schedules Roster</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Schedule Load Shedding / Outage
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Register a conflict-free power outage window for a distribution sector.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Outage Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Outage Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g., Feeder 01 Planned Voltage Step-Down"
              className="text-xs"
              disabled={createOutageMutation.isPending}
              {...register("title")}
            />
            {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
          </div>

          {/* Area & Outage Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="areaId" className="text-xs font-semibold">
                Target Sector Area *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <select
                  id="areaId"
                  disabled={loadingAreas || createOutageMutation.isPending}
                  className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs"
                  {...register("areaId")}
                >
                  <option value="">Select sector</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.postalCode ? `(${a.postalCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              {errors.areaId && <p className="text-[11px] text-destructive">{errors.areaId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-semibold">
                Outage Nature *
              </Label>
              <select
                id="type"
                disabled={createOutageMutation.isPending}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                {...register("type")}
              >
                <option value="PLANNED">PLANNED (Load Shedding)</option>
                <option value="UNEXPECTED">UNEXPECTED (Emergency Blackout)</option>
              </select>
            </div>
          </div>

          {/* Time Windows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startTime" className="text-xs font-semibold">
                Start Date & Time *
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                className="text-xs font-mono"
                disabled={createOutageMutation.isPending}
                {...register("startTime")}
              />
              {errors.startTime && <p className="text-[11px] text-destructive">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endTime" className="text-xs font-semibold">
                End Date & Time *
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                className="text-xs font-mono"
                disabled={createOutageMutation.isPending}
                {...register("endTime")}
              />
              {errors.endTime && <p className="text-[11px] text-destructive">{errors.endTime.message}</p>}
            </div>
          </div>

          {/* Publish Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs font-semibold">
              Publish Status
            </Label>
            <select
              id="status"
              disabled={createOutageMutation.isPending}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
              {...register("status")}
            >
              <option value="PUBLISHED">PUBLISHED (Visible to Public and Citizens)</option>
              <option value="DRAFT">DRAFT (Operator Internal Preparation Only)</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Technical Description (Optional)
            </Label>
            <textarea
              id="description"
              rows={3}
              placeholder="e.g., Scheduled grid maintenance to install replacement distribution insulators."
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs"
              disabled={createOutageMutation.isPending}
              {...register("description")}
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={createOutageMutation.isPending}
              className="w-full font-medium text-xs h-9 cursor-pointer gap-1.5 shadow-xs"
            >
              {createOutageMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Locking & Registering Schedule...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Publish Outage Schedule
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
