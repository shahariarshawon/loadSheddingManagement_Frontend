"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  Send,
  Loader2,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { Area, ApiResponse } from "@/types";

const reportSchema = z.object({
  areaId: z.string().trim().min(1, "Please select an affected distribution area"),
  title: z.string().trim().max(100).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().trim().min(10, "Please describe the blackout incident in at least 10 characters"),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function NewReportPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Load active distribution areas
  const { data: areasRes, isLoading: loadingAreas } = useQuery<ApiResponse<Area[]>>({
    queryKey: ["areas", "report-options"],
    queryFn: () => apiClient.get<Area[]>("/areas?limit=50"),
  });
  const areas = areasRes?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      areaId: user?.areaId || "",
      title: "",
      severity: "MEDIUM",
      description: "",
    },
  });

  const createReportMutation = useMutation({
    mutationFn: (data: ReportFormData) => apiClient.post("/outage-reports", data),
    onSuccess: () => {
      toast.success("Incident Report Dispatched", {
        description: "Your report has been submitted to utility dispatchers for triage.",
      });
      queryClient.invalidateQueries({ queryKey: ["outage-reports", "my"] });
      router.push("/dashboard/reports");
    },
    onError: (err: Error) => {
      toast.error("Submission Failed", { description: err.message });
    },
  });

  const onSubmit = (data: ReportFormData) => {
    createReportMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="sm" className="text-xs cursor-pointer gap-1.5 p-0 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Reports</span>
          </Button>
        </Link>
      </div>

      <Card className="border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Submit Outage Incident Report
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Report an unexpected power blackout or hazard in your area. Power operators will review and verify your report.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Affected Sector */}
          <div className="space-y-1.5">
            <Label htmlFor="areaId" className="text-xs font-semibold">
              Affected Residential Sector *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                id="areaId"
                disabled={loadingAreas || createReportMutation.isPending}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                {...register("areaId")}
              >
                <option value="">Select your sector</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} {a.postalCode ? `(${a.postalCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
            {errors.areaId && <p className="text-[11px] text-destructive">{errors.areaId.message}</p>}
          </div>

          {/* Severity & Incident Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="severity" className="text-xs font-semibold">
                Incident Severity *
              </Label>
              <select
                id="severity"
                disabled={createReportMutation.isPending}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                {...register("severity")}
              >
                <option value="LOW">LOW — Voltage fluctuation, single phase</option>
                <option value="MEDIUM">MEDIUM — Standard neighborhood blackout</option>
                <option value="HIGH">HIGH — Entire sector without power</option>
                <option value="CRITICAL">CRITICAL — Transformer fire / fallen wire hazard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Short Title (Optional)
              </Label>
              <Input
                id="title"
                placeholder="e.g., Complete blackout on Sector 4"
                className="text-xs"
                disabled={createReportMutation.isPending}
                {...register("title")}
              />
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Incident Description *
            </Label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the power failure, any observed loud noises or sparks, and approximate duration..."
              className="w-full rounded-md border border-input bg-background p-3 text-xs ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              disabled={createReportMutation.isPending}
              {...register("description")}
            />
            {errors.description && <p className="text-[11px] text-destructive">{errors.description.message}</p>}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={createReportMutation.isPending}
              className="w-full font-medium text-xs h-9 cursor-pointer gap-1.5 shadow-xs"
            >
              {createReportMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Incident Report
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
