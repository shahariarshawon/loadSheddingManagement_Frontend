import { CreditCard, Sparkles, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CustomerBillingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Priority Passes</h1>
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
            Phase 4 Scope
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Upgrade to verified priority status, instant SMS/push restoration alerts, and premium outage telemetry.
        </p>
      </div>

      {/* Scope Card */}
      <Card className="p-8 text-center max-w-xl mx-auto space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Premium Priority Pass</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Stripe Checkout checkout flow and active pass management will be activated in <strong>Phase 4</strong> according to project milestone planning.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/40 p-4 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Upcoming Premium Capabilities:
          </div>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Zero-latency SMS emergency restoration alerts</li>
            <li>Priority triage queueing for customer incident reports</li>
            <li>Area power reliability score card & 30-day forecast</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
