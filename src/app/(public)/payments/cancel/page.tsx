import Link from "next/link";
import { AlertTriangle, CreditCard, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentCancelPage() {
  return (
    <div className="container py-12 px-4">
      <Card className="max-w-md mx-auto p-8 text-center space-y-6 shadow-md border-amber-500/20">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertTriangle className="h-9 w-9" />
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold"
          >
            Checkout Session Cancelled
          </Badge>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            No Charges Were Incurred
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You exited the Stripe sandbox checkout session before completing authorization. Your payment method was not billed, and your account status remains unchanged.
          </p>
        </div>

        {/* Informational Guidance */}
        <div className="rounded-lg border bg-muted/30 p-4 text-xs text-left text-muted-foreground space-y-1.5">
          <p className="font-semibold text-foreground">Why was payment cancelled?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>You may have clicked the &ldquo;Back to merchant&rdquo; or cancel button.</li>
            <li>The Stripe checkout session expired or was closed.</li>
            <li>You can restart checkout anytime from your Billing settings.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline", size: "sm", className: "w-full sm:w-auto" })}
          >
            <Home className="mr-1.5 h-4 w-4" />
            Return to Dashboard
          </Link>
          <Link
            href="/dashboard/billing"
            className={buttonVariants({ size: "sm", className: "w-full sm:w-auto" })}
          >
            <CreditCard className="mr-1.5 h-4 w-4" />
            Return to Billing & Passes
          </Link>
        </div>
      </Card>
    </div>
  );
}
