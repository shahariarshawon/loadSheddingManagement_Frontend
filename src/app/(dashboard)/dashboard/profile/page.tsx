"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { useAuth, AUTH_QUERY_KEY } from "@/features/auth/hooks/use-auth";
import type { Area, ApiResponse, UserProfile } from "@/types";

const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  areaId: z.string().trim().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CustomerProfilePage() {
  const queryClient = useQueryClient();
  const { user, refreshSession } = useAuth();

  // Load active distribution areas
  const { data: areasRes, isLoading: loadingAreas } = useQuery<ApiResponse<Area[]>>({
    queryKey: ["areas", "profile-options"],
    queryFn: () => apiClient.get<Area[]>("/areas?limit=50"),
  });
  const areas = areasRes?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      areaId: user?.areaId || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        areaId: user.areaId || "",
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      apiClient.patch<UserProfile>("/users/me", {
        name: data.name,
        phone: data.phone || undefined,
        areaId: data.areaId || undefined,
      }),
    onSuccess: (res) => {
      toast.success("Profile Updated", {
        description: "Your account details and residential sector have been saved.",
      });
      // Invalidate both local session and user query
      queryClient.setQueryData(AUTH_QUERY_KEY, {
        authenticated: true,
        user: res.data,
      });
      refreshSession();
    },
    onError: (err: Error) => {
      toast.error("Update Failed", { description: err.message });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1.5 border-b border-border/80 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <User className="h-6 w-6 text-primary" />
          <span>Profile & Residential Sector</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your personal contact details and assigned electrical distribution area.
        </p>
      </div>

      <Card className="border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-foreground">Verified Citizen Account</span>
            <span className="text-xs text-muted-foreground block font-mono">
              User ID: {user?.id}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs font-mono uppercase px-2 py-0.5">
            {user?.role || "CUSTOMER"}
          </Badge>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                disabled={updateProfileMutation.isPending}
                className="pl-10 text-sm h-10"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email (Read-only as per backend rules) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <span className="text-xs text-muted-foreground">Permanent credential</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="pl-10 text-sm h-10 bg-muted/40 cursor-not-allowed font-mono text-muted-foreground"
              />
            </div>
          </div>

          {/* Contact Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="+880 17..."
                disabled={updateProfileMutation.isPending}
                className="pl-10 text-sm h-10"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Residential Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="areaId" className="text-sm font-semibold">
                Residential Distribution Sector
              </Label>
              <span className="text-xs text-muted-foreground">Used for outage alerts</span>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                id="areaId"
                disabled={loadingAreas || updateProfileMutation.isPending}
                className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm h-10 ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                {...register("areaId")}
              >
                <option value="">Unassigned</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} {a.postalCode ? `(${a.postalCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="font-semibold text-sm h-10 px-5 cursor-pointer gap-2 shadow-xs"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
