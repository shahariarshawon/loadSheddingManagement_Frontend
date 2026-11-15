import { CreditCard, ShieldCheck, Lock, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Financial Audit & Payment Ledger</h1>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Phase 4 Scope
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Platform subscription revenue audit, Stripe settlement verification, and transaction history.
        </p>
      </div>

      {/* Scope Card */}
      <Card className="p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Stripe Gateway & Payment Ledger</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Stripe Checkout sessions, webhook verification, and the administrative payment transaction ledger are scheduled for <strong>Phase 4: Payment Gateway & Commercial Modules</strong>.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Backend Readiness Verified:
          </div>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li><code className="font-mono text-foreground">POST /api/v1/payments/checkout</code> — Stripe Session Creator</li>
            <li><code className="font-mono text-foreground">POST /api/v1/payments/webhook</code> — Webhook Event Processor</li>
            <li><code className="font-mono text-foreground">GET /api/v1/payments</code> — Administrative Transaction Ledger</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
