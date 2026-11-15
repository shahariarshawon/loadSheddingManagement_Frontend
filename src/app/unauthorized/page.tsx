"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/lib/constants";

export default function UnauthorizedPage() {
  const { user, isAuthenticated, role, logout } = useAuth();

  let dashboardHref: string = ROUTES.LOGIN;
  let roleDisplay = "Unauthenticated Visitor";

  if (isAuthenticated && role) {
    if (role === "ADMIN") {
      dashboardHref = ROUTES.ADMIN;
      roleDisplay = "Administrator";
    } else if (role === "POWER_OPERATOR") {
      dashboardHref = ROUTES.PROVIDER;
      roleDisplay = "Power Operator";
    } else {
      dashboardHref = ROUTES.DASHBOARD;
      roleDisplay = "Residential Consumer";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md text-center space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldX className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              403 — Access Denied
            </h1>
            <Badge variant="destructive" className="text-[10px] uppercase font-mono">
              Forbidden
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have the required permissions to access this protected area.
            Access to this section is restricted to specific role privileges.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-left text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Signed In As:</span>
              <span className="font-semibold text-foreground truncate max-w-[180px]">
                {user.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Assigned Role:</span>
              <Badge variant="secondary" className="text-[10px] font-mono uppercase">
                {roleDisplay}
              </Badge>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {isAuthenticated ? (
            <Link href={dashboardHref} className="w-full">
              <Button className="w-full font-medium text-xs h-9 cursor-pointer shadow-xs">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Return to My Allowed Dashboard
              </Button>
            </Link>
          ) : (
            <Link href={ROUTES.LOGIN} className="w-full">
              <Button className="w-full font-medium text-xs h-9 cursor-pointer shadow-xs">
                <LogIn className="mr-2 h-3.5 w-3.5" />
                Sign In with Authorized Account
              </Button>
            </Link>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-xs text-destructive hover:text-destructive cursor-pointer"
              >
                Sign In with Different Account
              </Button>
            )}

            <Link href={ROUTES.HOME}>
              <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                <Home className="mr-1.5 h-3.5 w-3.5" />
                GridWatch Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
