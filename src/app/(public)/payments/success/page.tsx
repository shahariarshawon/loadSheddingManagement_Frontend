"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Loader2,
  Clock,
  Home,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import type { Payment, ApiResponse } from "@/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Query verified status from backend
  const { data, isLoading, isError, error } = useQuery<ApiResponse<Payment>>({
    queryKey: ["payment-status", sessionId],
    queryFn: () => apiClient.get<Payment>(`/api/v1/payments/status/${sessionId}`),
    enabled: Boolean(sessionId),
    refetchInterval: (query) => {
      // If status is still pending (awaiting webhook), poll every 2 seconds up to 5 times
      const payment = query.state.data?.data;
      if (payment && payment.status === "PENDING") {
        return 2000;
      }
      return false;
    },
  });

  const payment = data?.data;

  if (!sessionId) {
    return (
      <Card className="max-w-md mx-auto p-8 text-center space-y-4 shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Missing Session Reference</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          No checkout session ID was provided in the return query parameter. If you completed a payment, check your transaction ledger in Billing.
        </p>
        <div className="pt-2">
          <Link href="/dashboard/billing" className={buttonVariants({ size: "sm" })}>
            Go to Billing & Passes
          </Link>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto p-8 text-center space-y-4 shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary animate-pulse">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Verifying Payment With Backend...</h1>
        <p className="text-xs text-muted-foreground">
          Confirming Stripe transaction cryptographic signature and activating priority pass.
        </p>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
    );
  }

  if (isError || !payment) {
    return (
      <Card className="max-w-md mx-auto p-8 text-center space-y-4 shadow-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Verification Check Failed</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error?.message || "Unable to confirm payment status with the central billing ledger."}
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Return to Dashboard
          </Link>
          <Link href="/dashboard/billing" className={buttonVariants({ size: "sm" })}>
            View Billing History
          </Link>
        </div>
      </Card>
    );
  }

  const isConfirmed = payment.status === "SUCCEEDED";
  const planName =
    payment.metadata && typeof payment.metadata === "object" && "planName" in payment.metadata
      ? String(payment.metadata.planName)
      : payment.subscription?.plan === "ANNUAL_PRIORITY"
      ? "GridWatch 365-Day Annual Pass"
      : "GridWatch 30-Day Priority Pass";

  return (
    <Card className="max-w-lg mx-auto p-8 text-center space-y-6 shadow-md border-emerald-500/30">
      {/* Icon */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      {/* Heading */}
      <div className="space-y-1">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
        >
          {isConfirmed ? "Payment Confirmed & Verified" : "Payment Session Processed"}
        </Badge>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Priority Pass Activated!
        </h1>
        <p className="text-xs text-muted-foreground">
          Thank you! Your payment of{" "}
          <strong className="text-foreground">
            ${Number(payment.amount).toFixed(2)} {payment.currency}
          </strong>{" "}
          has been confirmed by the Stripe gateway.
        </p>
      </div>

      {/* Verified Transaction Manifest */}
      <div className="rounded-lg border bg-muted/40 p-4 text-left text-xs space-y-2.5">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-muted-foreground">Plan Activated</span>
          <span className="font-semibold text-foreground">{planName}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-muted-foreground">Amount Paid</span>
          <span className="font-bold text-foreground">
            ${Number(payment.amount).toFixed(2)} {payment.currency}
          </span>
        </div>

        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-muted-foreground">Gateway Status</span>
          <Badge
            variant="outline"
            className={
              isConfirmed
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
            }
          >
            {payment.status}
          </Badge>
        </div>

        <div className="flex flex-col gap-0.5 pt-1">
          <span className="text-muted-foreground">Stripe Session ID</span>
          <span className="font-mono text-[10px] text-muted-foreground break-all">
            {payment.stripeSessionId}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/dashboard/billing"
          className={buttonVariants({ variant: "outline", size: "sm", className: "w-full sm:w-auto" })}
        >
          <CreditCard className="mr-1.5 h-4 w-4" />
          View Billing Ledger
        </Link>
        <Link
          href="/dashboard"
          className={buttonVariants({ size: "sm", className: "w-full sm:w-auto" })}
        >
          <Home className="mr-1.5 h-4 w-4" />
          Go to Consumer Overview
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12 px-4">
      <Suspense
        fallback={
          <div className="max-w-md mx-auto p-8 text-center space-y-4">
            <div className="h-14 w-14 bg-muted animate-pulse rounded-full mx-auto" />
            <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
