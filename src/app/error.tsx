"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected errors safely to console for debugging
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/80 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">
            Unexpected Grid System Error
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            An unexpected error occurred while processing your request. Our telemetry has logged the incident.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 text-center">
          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground font-mono break-all">
            {error?.message || "An unexpected operational exception occurred."}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full gap-2 font-medium"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>

          <Link
            href={ROUTES.HOME}
            className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2 font-medium")}
          >
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
