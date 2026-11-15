"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  registerSchema,
  type RegisterFormData,
} from "@/features/auth/schemas/register.schema";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { env } from "@/lib/env";
import type { Area } from "@/types";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { register: registerUser, isRegistering } = useAuth();

  // Fetch verified distribution areas from the live backend
  const { data: areasData, isLoading: isLoadingAreas } = useQuery<{
    data: Area[];
  }>({
    queryKey: ["areas", "public-list"],
    queryFn: async () => {
      const res = await fetch(`${env.apiUrl}/areas`);
      if (!res.ok) return { data: [] };
      return res.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  const areas: Area[] = areasData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      areaId: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerUser(data);
    } catch (err: unknown) {
      const error = err as Error;
      setApiError(error.message || "Registration failed. Please try again.");
    }
  };

  const isBusy = isRegistering || isSubmitting;

  return (
    <div className="w-full max-w-lg space-y-6">
      {/* Header & Title */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Register Customer Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join the GridWatch network to receive real-time power outage alerts and submit incident reports.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <span>
            Public registration is provisioned under the <strong>Residential Consumer</strong> role.
          </span>
        </div>

        {apiError && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{apiError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Tariq Rahman"
                disabled={isBusy}
                className="pl-9 text-sm"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="citizen@example.com"
                disabled={isBusy}
                className="pl-9 text-sm"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Phone Number
              </Label>
              <span className="text-[11px] text-muted-foreground">Optional</span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+8801700000000"
                disabled={isBusy}
                className="pl-9 text-sm"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-destructive font-medium">{errors.phone.message}</p>
            )}
          </div>

          {/* Residential Area (Optional Selector) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="areaId" className="text-xs font-semibold">
                Residential Grid Area
              </Label>
              <span className="text-[11px] text-muted-foreground">Optional</span>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                id="areaId"
                disabled={isBusy || isLoadingAreas}
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("areaId")}
              >
                <option value="">Select your area (can be assigned later)</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name} {area.postalCode ? `(${area.postalCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
            {errors.areaId && (
              <p className="text-[11px] text-destructive font-medium">{errors.areaId.message}</p>
            )}
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars"
                  disabled={isBusy}
                  className="pl-9 pr-9 text-sm"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                Confirm Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  disabled={isBusy}
                  className="pl-9 text-sm"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={isBusy}
            className="w-full h-10 font-semibold text-sm cursor-pointer mt-3 shadow-xs"
          >
            {isBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Complete Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Login Navigation Link */}
      <p className="text-center text-xs text-muted-foreground">
        Already registered with GridWatch?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-semibold text-primary hover:underline underline-offset-4"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
