"use client";

import { useState } from "react";
import { ShieldAlert, Radio, UserCheck, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { UserRole } from "@/types";

interface DemoRoleConfig {
  role: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: typeof ShieldAlert;
  accentBorder: string;
  accentBg: string;
  buttonVariant: "default" | "secondary" | "outline";
  buttonText: string;
}

const DEMO_ROLES: DemoRoleConfig[] = [
  {
    role: "ADMIN",
    title: "Admin Demo",
    badge: "ADMIN",
    description: "System governance, user roles, grid topology & platform audit trail.",
    icon: ShieldAlert,
    accentBorder: "border-slate-300 dark:border-slate-700 hover:border-slate-900 dark:hover:border-slate-300",
    accentBg: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
    buttonVariant: "default",
    buttonText: "Launch Admin",
  },
  {
    role: "POWER_OPERATOR",
    title: "Provider Demo",
    badge: "OPERATOR",
    description: "Load-shedding coordination, field technician dispatch & incident triage.",
    icon: Radio,
    accentBorder: "border-amber-200 dark:border-amber-900/60 hover:border-amber-500",
    accentBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400",
    buttonVariant: "secondary",
    buttonText: "Launch Operator",
  },
  {
    role: "CUSTOMER",
    title: "User Demo",
    badge: "CUSTOMER",
    description: "Residential power schedules, incident reporting & reliability pass.",
    icon: UserCheck,
    accentBorder: "border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    buttonVariant: "outline",
    buttonText: "Launch Customer",
  },
];

export function DemoLogin() {
  const { demoLogin, isDemoLoggingIn } = useAuth();
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);

  const handleDemoClick = async (role: UserRole) => {
    setActiveRole(role);
    try {
      await demoLogin(role);
    } finally {
      setActiveRole(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5 text-primary" />
          <span>One-Click Evaluator Demo Access</span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono">
          Mandatory B7A7
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEMO_ROLES.map((cfg) => {
          const Icon = cfg.icon;
          const isLoadingThis = isDemoLoggingIn && activeRole === cfg.role;

          return (
            <Card
              key={cfg.role}
              className={`transition-all duration-150 border bg-card ${cfg.accentBorder} flex flex-col justify-between shadow-xs`}
            >
              <CardContent className="p-3.5 flex flex-col h-full justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 rounded-md ${cfg.accentBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0 h-4 font-semibold">
                      {cfg.badge}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-xs text-foreground tracking-tight pt-1">
                    {cfg.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {cfg.description}
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant={cfg.buttonVariant}
                  disabled={isDemoLoggingIn}
                  onClick={() => handleDemoClick(cfg.role)}
                  className="w-full text-xs h-8 cursor-pointer shadow-xs font-semibold"
                >
                  {isLoadingThis ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    cfg.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
