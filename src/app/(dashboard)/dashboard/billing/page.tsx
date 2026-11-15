"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreditCard,
  Sparkles,
  CheckCircle2,
  Lock,
  Loader2,
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { formatDateTime, formatDate } from "@/lib/utils";
import type { Payment, CheckoutResponse, ApiResponse } from "@/types";

export default function CustomerBillingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<"MONTHLY_PRIORITY" | "ANNUAL_PRIORITY">(
    "MONTHLY_PRIORITY"
  );
  const [initiatingPlan, setInitiatingPlan] = useState<string | null>(null);

  // 1. Fetch authenticated customer payment transactions
  const {
    data: paymentsRes,
    isLoading: loadingPayments,
    isError: paymentsError,
    refetch: refetchPayments,
  } = useQuery<ApiResponse<Payment[]>>({
    queryKey: ["customer-payments", page],
    queryFn: () => apiClient.get<Payment[]>("/payments/my", { page, limit: 5 }),
  });

  const payments = paymentsRes?.data || [];
  const meta = paymentsRes?.meta;
  const totalPages = meta?.totalPages || 1;

  // Find active subscription from recent payments if any
  const activePaymentWithSub = payments.find(
    (p) => p.subscription && p.subscription.status === "ACTIVE"
  );
  const activeSubscription = activePaymentWithSub?.subscription;

  // 2. Stripe Checkout Initiation Mutation
  const checkoutMutation = useMutation({
    mutationFn: async (plan: "MONTHLY_PRIORITY" | "ANNUAL_PRIORITY") => {
      setInitiatingPlan(plan);
      return apiClient.post<ApiResponse<CheckoutResponse>>("/payments/checkout", {
        plan,
      });
    },
    onSuccess: (res) => {
      const checkoutUrl = res?.data?.data?.checkoutUrl || res?.data?.data?.url;
      if (checkoutUrl) {
        toast.success("Redirecting to Stripe Test Sandbox...", {
          description: "Secure 256-bit encrypted checkout session initialized.",
        });
        // Redirect browser directly to Stripe Sandbox
        window.location.href = checkoutUrl;
      } else {
        setInitiatingPlan(null);
        toast.error("Checkout URL not returned from payment service.");
      }
    },
    onError: (err: Error) => {
      setInitiatingPlan(null);
      toast.error("Failed to initiate Stripe Checkout", {
        description: err.message || "An error occurred communicating with Stripe.",
      });
    },
  });

  const handleCheckout = (plan: "MONTHLY_PRIORITY" | "ANNUAL_PRIORITY") => {
    checkoutMutation.mutate(plan);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return (
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Succeeded
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="border-slate-500/30 bg-slate-500/10 text-muted-foreground font-medium">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
            Failed
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2.5 border-b pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Billing & Priority Passes</h1>
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-2.5 py-0.5">
            Stripe Test Sandbox Active
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Upgrade to verified priority status, instant SMS/push restoration alerts, and real-time outage telemetry for{" "}
          <strong className="text-foreground">{user?.name}</strong>.
        </p>
      </div>

      {/* Active Subscription Banner (if present) */}
      {activeSubscription && (
        <Card className="p-6 border-emerald-500/40 bg-emerald-500/5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-foreground text-base">
                  Active Priority Pass: {activeSubscription.plan === "ANNUAL_PRIORITY" ? "365-Day Annual Pass" : "30-Day Monthly Pass"}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Valid until {formatDate(activeSubscription.endDate)}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1">Active Status</Badge>
          </div>
        </Card>
      )}

      {/* Pricing / Plan Selection Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Select a Priority Plan</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Prices are billed securely through Stripe in Test Mode. You can use standard test card credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Priority Pass */}
          <Card
            className={`p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer ${
              selectedPlan === "MONTHLY_PRIORITY"
                ? "border-primary ring-2 ring-primary shadow-sm"
                : "border-border"
            }`}
            onClick={() => setSelectedPlan("MONTHLY_PRIORITY")}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-foreground">30-Day Priority Pass</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Monthly Sector Reliability Access</p>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary text-xs font-semibold px-2.5 py-0.5">
                  Popular
                </Badge>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-foreground">$10.00</span>
                <span className="text-sm text-muted-foreground font-semibold">USD / 30 Days</span>
              </div>

              <div className="space-y-3 border-t pt-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>30-Day access to sector reliability score & forecasts</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Priority triage queueing for customer outage reports</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Instant in-app notifications on schedule adjustments</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t">
              <Button
                className="w-full h-11 text-sm font-semibold"
                onClick={() => handleCheckout("MONTHLY_PRIORITY")}
                disabled={checkoutMutation.isPending && initiatingPlan === "MONTHLY_PRIORITY"}
              >
                {checkoutMutation.isPending && initiatingPlan === "MONTHLY_PRIORITY" ? (
                  <>
                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                    Connecting to Stripe...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4.5 w-4.5" />
                    Proceed with Stripe Checkout ($10.00)
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Annual Priority Pass */}
          <Card
            className={`p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-md cursor-pointer relative overflow-hidden ${
              selectedPlan === "ANNUAL_PRIORITY"
                ? "border-primary ring-2 ring-primary shadow-sm"
                : "border-border"
            }`}
            onClick={() => setSelectedPlan("ANNUAL_PRIORITY")}
          >
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3.5 py-1 rounded-bl-md">
              Save 17%
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xl text-foreground">365-Day Annual Pass</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Comprehensive Year-Round Protection</p>
                </div>
                <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold px-2.5 py-0.5">
                  Best Value
                </Badge>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-foreground">$99.00</span>
                <span className="text-sm text-muted-foreground font-semibold">USD / Year</span>
              </div>

              <div className="space-y-3 border-t pt-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>365-Day unrestricted historical downtime & telemetry metrics</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Immediate field crew dispatch prioritization</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automated emergency restoration alerts</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Priority developer API access for smart home automation</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t">
              <Button
                variant={selectedPlan === "ANNUAL_PRIORITY" ? "default" : "outline"}
                className="w-full h-11 text-sm font-semibold"
                onClick={() => handleCheckout("ANNUAL_PRIORITY")}
                disabled={checkoutMutation.isPending && initiatingPlan === "ANNUAL_PRIORITY"}
              >
                {checkoutMutation.isPending && initiatingPlan === "ANNUAL_PRIORITY" ? (
                  <>
                    <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                    Connecting to Stripe...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4.5 w-4.5 text-amber-400" />
                    Get 365-Day Annual Pass ($99.00)
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Stripe Sandbox Test Instructions Card */}
      <Card className="p-5 bg-muted/40 border text-sm text-muted-foreground space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm">
          <HelpCircle className="h-4.5 w-4.5 text-primary" />
          Stripe Test Mode Simulator Instructions:
        </div>
        <p className="leading-relaxed">
          On the Stripe checkout screen, you can complete a test payment using the standard Stripe test card:{" "}
          <strong className="font-mono text-foreground font-semibold">4242 • 4242 • 4242 • 4242</strong> with any future date and CVC{" "}
          <strong className="font-mono text-foreground font-semibold">123</strong>. No real payment card is charged.
        </p>
      </Card>

      {/* Payment Transaction History Table */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Payment & Transaction History</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Directly synchronized from the backend payment ledger in PostgreSQL.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetchPayments()} className="text-sm font-medium">
            Refresh History
          </Button>
        </div>

        <Card className="overflow-hidden shadow-sm">
          {loadingPayments ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4.5 w-36" />
                    <Skeleton className="h-3.5 w-48" />
                  </div>
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : paymentsError ? (
            <div className="p-10 text-center text-destructive space-y-3">
              <AlertCircle className="mx-auto h-8 w-8" />
              <p className="text-base font-semibold">Unable to load transaction history</p>
              <Button variant="outline" size="sm" onClick={() => refetchPayments()}>
                Retry
              </Button>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center space-y-2.5">
              <CreditCard className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <p className="text-base font-semibold text-foreground">No payment transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Your future Priority Pass purchases will appear in this ledger.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 border-b font-bold uppercase tracking-wider text-muted-foreground text-xs">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Plan / Product</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Stripe Session Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((p) => {
                    const planName =
                       p.metadata && typeof p.metadata === "object" && "planName" in p.metadata
                        ? String(p.metadata.planName)
                        : p.subscription?.plan === "ANNUAL_PRIORITY"
                        ? "365-Day Annual Pass"
                        : "30-Day Monthly Pass";

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4 text-muted-foreground whitespace-nowrap font-medium text-sm">
                          {formatDateTime(p.createdAt)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-foreground text-sm">{planName}</td>
                        <td className="px-5 py-4 font-bold text-foreground text-base">
                          ${Number(p.amount).toFixed(2)} {p.currency}
                        </td>
                        <td className="px-5 py-4">{getStatusBadge(p.status)}</td>
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground max-w-[220px] truncate">
                          {p.stripeSessionId}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
