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
  accentText: string;
  buttonVariant: "default" | "secondary" | "outline";
}

const DEMO_ROLES: DemoRoleConfig[] = [
  {
    role: "ADMIN",
    title: "Admin Demo Login",
    badge: "ADMIN",
    description: "Full system governance, user roles, grid topology & platform audit trail.",
    icon: ShieldAlert,
    accentBorder: "border-purple-500/20 hover:border-purple-500/40",
    accentBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    accentText: "text-purple-600 dark:text-purple-400",
    buttonVariant: "default",
  },
  {
    role: "POWER_OPERATOR",
    title: "Provider Demo Login",
    badge: "POWER_OPERATOR",
    description: "Load-shedding coordination, field technician dispatch & incident triage.",
    icon: Radio,
    accentBorder: "border-amber-500/20 hover:border-amber-500/40",
    accentBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    accentText: "text-amber-600 dark:text-amber-400",
    buttonVariant: "secondary",
  },
  {
    role: "CUSTOMER",
    title: "User Demo Login",
    badge: "CUSTOMER",
    description: "Residential power schedules, incident reporting & reliability pass.",
    icon: UserCheck,
    accentBorder: "border-emerald-500/20 hover:border-emerald-500/40",
    accentBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    accentText: "text-emerald-600 dark:text-emerald-400",
    buttonVariant: "outline",
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
              className={`transition-all duration-200 border bg-card/60 backdrop-blur-sm ${cfg.accentBorder} flex flex-col justify-between`}
            >
              <CardContent className="p-3.5 flex flex-col h-full justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${cfg.accentBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0 h-4">
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
                  className="w-full text-xs h-8 cursor-pointer shadow-xs font-medium"
                >
                  {isLoadingThis ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    `Launch ${cfg.badge.split("_")[0]}`
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
