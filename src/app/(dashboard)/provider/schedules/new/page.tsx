"use client";

import { useState } from "react";
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
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  MapPin,
  Clock,
  Radio,
  FileText,
  ShieldCheck,
  Zap,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api-client";
import { useScheduleWizardStore } from "@/stores/schedule-wizard-store";
import type { Area, Zone, Outage, ApiResponse } from "@/types";

// Step 1 Validation Schema
const step1Schema = z.object({
  areaId: z.string().trim().min(1, "Please select an affected electrical area"),
});

// Step 2 Validation Schema
const step2Schema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters"),
    type: z.enum(["PLANNED", "UNEXPECTED"]),
    status: z.enum(["PUBLISHED", "DRAFT"]),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
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

// Full Combined Schema
const fullScheduleSchema = z
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

type FullScheduleFormData = z.infer<typeof fullScheduleSchema>;

const STEPS = [
  { id: 1, title: "Grid Sector", subtitle: "Target Distribution Area" },
  { id: 2, title: "Timing & Class", subtitle: "Window & Outage Type" },
  { id: 3, title: "Context & Notes", subtitle: "Operational Directives" },
  { id: 4, title: "Review & Dispatch", subtitle: "Pre-Flight Authorization" },
];

export default function MultiStepScheduleWizardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentStep, setStep, nextStep, prevStep, formData, updateFormData, reset } =
    useScheduleWizardStore();

  const [authorized, setAuthorized] = useState(false);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("");

  // 1. Fetch available zones
  const { data: zonesRes } = useQuery<ApiResponse<Zone[]>>({
    queryKey: ["zones"],
    queryFn: () => apiClient.get<Zone[]>("/api/v1/zones"),
    staleTime: 60 * 1000,
  });
  const zones = zonesRes?.data || [];

  // 2. Fetch available areas
  const { data: areasRes, isLoading: loadingAreas } = useQuery<ApiResponse<Area[]>>({
    queryKey: ["areas"],
    queryFn: () => apiClient.get<Area[]>("/api/v1/areas?limit=50"),
    staleTime: 60 * 1000,
  });
  const allAreas = areasRes?.data || [];

  // Filter areas by selected zone if specified
  const filteredAreas = selectedZoneFilter
    ? allAreas.filter(
        (a) =>
          a.substation?.zoneId === selectedZoneFilter ||
          a.feeder?.substation?.zoneId === selectedZoneFilter
      )
    : allAreas;

  // React Hook Form initialized with Zustand draft
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FullScheduleFormData>({
    resolver: zodResolver(fullScheduleSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const watchedAreaId = watch("areaId");
  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");
  const watchedType = watch("type");
  const watchedStatus = watch("status");
  const watchedTitle = watch("title");
  const watchedDescription = watch("description");

  // Selected area object for preview
  const selectedArea = allAreas.find((a) => a.id === watchedAreaId);

  // Calculate duration string in real-time
  const calculateDuration = () => {
    if (!watchedStartTime || !watchedEndTime) return null;
    const start = new Date(watchedStartTime).getTime();
    const end = new Date(watchedEndTime).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) return null;

    const diffMinutes = Math.round((end - start) / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours} hr ${minutes} min`;
  };

  // Step 1 navigation validator
  const handleProceedFromStep1 = async () => {
    const isValid = await trigger(["areaId"]);
    if (isValid && watchedAreaId) {
      updateFormData({ areaId: watchedAreaId });
      nextStep();
    } else {
      toast.error("Please select a distribution area before proceeding.");
    }
  };

  // Step 2 navigation validator
  const handleProceedFromStep2 = async () => {
    const isValid = await trigger(["title", "type", "status", "startTime", "endTime"]);
    if (isValid) {
      updateFormData({
        title: watchedTitle,
        type: watchedType,
        status: watchedStatus,
        startTime: watchedStartTime,
        endTime: watchedEndTime,
      });
      nextStep();
    } else {
      toast.error("Please fill in valid schedule timing and parameters.");
    }
  };

  // Step 3 navigation validator
  const handleProceedFromStep3 = () => {
    updateFormData({ description: watchedDescription });
    nextStep();
  };

  // Final submission mutation
  const submitMutation = useMutation({
    mutationFn: (data: FullScheduleFormData) =>
      apiClient.post<ApiResponse<Outage>>("/api/v1/outages", {
        title: data.title,
        areaId: data.areaId,
        type: data.type,
        status: data.status,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        description: data.description || undefined,
      }),
    onSuccess: (res) => {
      const outageNumber = res?.data?.data?.outageNumber || "Outage";
      toast.success("Schedule Successfully Dispatched!", {
        description: `Reference #${outageNumber} has been logged and published.`,
      });
      queryClient.invalidateQueries({ queryKey: ["outages"] });
      reset();
      router.push("/provider/schedules");
    },
    onError: (err: Error) => {
      toast.error("Failed to Dispatch Schedule", {
        description: err.message || "An unexpected error occurred. Please verify schedule details.",
      });
    },
  });

  const onFinalSubmit = () => {
    if (!authorized) {
      toast.error("Authorization Required", {
        description: "Please check the operational authorization box before dispatching.",
      });
      return;
    }
    const finalData: FullScheduleFormData = {
      title: watchedTitle,
      areaId: watchedAreaId,
      type: watchedType,
      status: watchedStatus,
      startTime: watchedStartTime,
      endTime: watchedEndTime,
      description: watchedDescription,
    };
    submitMutation.mutate(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <Link
          href="/provider/schedules"
          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          Back to Outage Schedules
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Multi-Step Outage Dispatch Wizard</h1>
            <p className="text-sm text-muted-foreground">
              4-Stage verified load-shedding scheduling workflow with area validation and concurrency locks.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              reset();
              toast.info("Draft reset to default values.");
            }}
            className="text-xs text-muted-foreground"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset Wizard
          </Button>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <Card className="p-4 shadow-sm bg-card/60 backdrop-blur">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;

            return (
              <div
                key={s.id}
                onClick={() => {
                  // Allow jumping back to earlier completed steps
                  if (s.id < currentStep) setStep(s.id);
                }}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                  s.id < currentStep ? "cursor-pointer hover:bg-muted/50" : ""
                } ${isCurrent ? "border border-primary/40 bg-primary/5" : ""}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isCurrent ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* STEP 1: Target Grid Sector */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <MapPin className="h-4 w-4" />
              Stage 1 of 4: Select Distribution Sector
            </div>
            <h2 className="text-xl font-bold text-foreground">Where will load-shedding take place?</h2>
            <p className="text-xs text-muted-foreground">
              Select the regional electrical distribution area. Grid nodes are synchronized with the central power grid topology.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Optional Zone Filter */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Filter by Zone (Optional)</Label>
              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">All Zones</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Affected Area Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Target Distribution Area <span className="text-destructive">*</span>
              </Label>
              <select
                {...register("areaId")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Select an affected area...</option>
                {filteredAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} {a.postalCode ? `(Postal: ${a.postalCode})` : ""}
                  </option>
                ))}
              </select>
              {errors.areaId && (
                <p className="text-xs text-destructive">{errors.areaId.message}</p>
              )}
            </div>
          </div>

          {/* Selected Area Inspector Card */}
          {selectedArea && (
            <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Verified Grid Sector: {selectedArea.name}
                </span>
                <Badge variant="outline" className="font-mono text-[11px]">
                  Postal: {selectedArea.postalCode || "N/A"}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Distribution Substation:{" "}
                <strong className="text-foreground">
                  {selectedArea.substation?.name ||
                    selectedArea.feeder?.substation?.name ||
                    selectedArea.feeder?.name ||
                    "Main Regional Feed"}
                </strong>
                {(selectedArea.substation?.code || selectedArea.feeder?.substation?.code) &&
                  ` (${selectedArea.substation?.code || selectedArea.feeder?.substation?.code})`}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleProceedFromStep1} size="sm">
              Continue to Timing & Class
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Timing & Outage Classification */}
      {currentStep === 2 && (
        <Card className="p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Clock className="h-4 w-4" />
              Stage 2 of 4: Schedule Timing & Classification
            </div>
            <h2 className="text-xl font-bold text-foreground">Specify Window & Outage Category</h2>
            <p className="text-xs text-muted-foreground">
              Define the title, schedule duration, and whether this event is a planned maintenance rotation or an emergency repair.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Schedule Title <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("title")}
                placeholder="e.g. Feeder-4 Transformer Maintenance & Grid Rotation"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Outage Type & Status */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Outage Category</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("type", "PLANNED", { shouldValidate: true })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-colors ${
                      watchedType === "PLANNED"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Planned Rotation
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("type", "UNEXPECTED", { shouldValidate: true })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-colors ${
                      watchedType === "UNEXPECTED"
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Unexpected Outage
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Initial Publication State</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("status", "PUBLISHED", { shouldValidate: true })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-colors ${
                      watchedStatus === "PUBLISHED"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("status", "DRAFT", { shouldValidate: true })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-md border text-xs font-medium transition-colors ${
                      watchedStatus === "DRAFT"
                        ? "border-slate-500 bg-slate-500/10 text-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Draft Only
                  </button>
                </div>
              </div>
            </div>

            {/* Timing Inputs */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Start Time <span className="text-destructive">*</span>
                </Label>
                <Input type="datetime-local" {...register("startTime")} />
                {errors.startTime && (
                  <p className="text-xs text-destructive">{errors.startTime.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">
                  Estimated End Time <span className="text-destructive">*</span>
                </Label>
                <Input type="datetime-local" {...register("endTime")} />
                {errors.endTime && (
                  <p className="text-xs text-destructive">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* Real-time Duration Card */}
            {calculateDuration() && (
              <div className="rounded-lg border bg-primary/5 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Clock className="h-4 w-4" />
                  Calculated Duration: {calculateDuration()}
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Concurrence Window Valid
                </Badge>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" onClick={prevStep}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleProceedFromStep2} size="sm">
              Continue to Context & Notes
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Technical Context & Directives */}
      {currentStep === 3 && (
        <Card className="p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <FileText className="h-4 w-4" />
              Stage 3 of 4: Technical Context & Maintenance Notes
            </div>
            <h2 className="text-xl font-bold text-foreground">Operational Instructions & Consumer Notice</h2>
            <p className="text-xs text-muted-foreground">
              Provide context for dispatch crews, substation engineers, and affected consumer dashboards.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">
                Technical Description & Safety Directives (Optional)
              </Label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Detail the technical reasoning, maintenance phases, affected secondary lines, and crew safety guidelines..."
                className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="rounded-lg border bg-amber-500/10 border-amber-500/20 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
                <Zap className="h-4 w-4" />
                Automated Consumer Telemetry Notice
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Publishing this schedule automatically updates consumer dashboards in{" "}
                <strong>{selectedArea?.name || "the selected sector"}</strong>. Verified consumers with active priority passes will receive immediate broadcast alerts.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" onClick={prevStep}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleProceedFromStep3} size="sm">
              Continue to Final Review
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Review, Authorization & Final Submission */}
      {currentStep === 4 && (
        <Card className="p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              Stage 4 of 4: Pre-Dispatch Authorization & Review
            </div>
            <h2 className="text-xl font-bold text-foreground">Review Schedule Before Dispatch</h2>
            <p className="text-xs text-muted-foreground">
              Verify all parameters. Once dispatched, load-shedding events are logged to the platform forensic audit trail.
            </p>
          </div>

          {/* Read-Only Summary Manifest */}
          <div className="rounded-lg border bg-card p-5 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <p className="text-muted-foreground uppercase tracking-wider text-[10px] font-semibold">Title</p>
                <h3 className="text-base font-bold text-foreground mt-0.5">{watchedTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    watchedType === "PLANNED"
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                  }
                >
                  {watchedType}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    watchedStatus === "PUBLISHED"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                      : "border-slate-500/30 bg-slate-500/10 text-foreground font-medium"
                  }
                >
                  {watchedStatus}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Target Sector</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {selectedArea?.name || "Unspecified Area"}
                  {selectedArea?.postalCode ? ` (Postal: ${selectedArea.postalCode})` : ""}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Estimated Window</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {calculateDuration() || "Calculated Window"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Start Timestamp</p>
                <p className="font-mono text-foreground mt-0.5">
                  {watchedStartTime ? new Date(watchedStartTime).toLocaleString() : "—"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">End Timestamp</p>
                <p className="font-mono text-foreground mt-0.5">
                  {watchedEndTime ? new Date(watchedEndTime).toLocaleString() : "—"}
                </p>
              </div>
            </div>

            {watchedDescription && (
              <div className="border-t pt-3">
                <p className="text-muted-foreground">Operational Instructions</p>
                <p className="text-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                  {watchedDescription}
                </p>
              </div>
            )}
          </div>

          {/* Authorization Checkbox */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs text-foreground leading-relaxed">
                <strong>Operator Authorization Confirmation:</strong> I confirm that this load-shedding schedule has been checked for substation concurrency conflicts and conforms to regional grid balancing protocols.
              </span>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" onClick={prevStep} disabled={submitMutation.isPending}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Notes
            </Button>
            <Button
              onClick={onFinalSubmit}
              disabled={!authorized || submitMutation.isPending}
              size="sm"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Dispatching Outage...
                </>
              ) : (
                <>
                  <Zap className="mr-1.5 h-4 w-4" />
                  Authorize & Dispatch Outage
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
