"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard Module Exception:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 text-center space-y-4 shadow-sm border-destructive/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Dashboard Module Error</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An issue occurred while loading this dashboard view. Your session remains authenticated and other modules are fully accessible.
          </p>
        </div>

        {error?.message && (
          <div className="bg-muted/50 rounded-md p-3 text-xs font-mono text-muted-foreground break-all text-left max-h-32 overflow-auto">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button onClick={() => reset()} size="sm" variant="outline" className="w-full sm:w-auto">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Retry View
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({ size: "sm", className: "w-full sm:w-auto" })}
          >
            <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
            Return to Overview
          </Link>
        </div>
      </Card>
    </div>
  );
}
