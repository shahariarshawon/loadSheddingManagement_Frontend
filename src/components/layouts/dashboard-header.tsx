"use client";

import Link from "next/link";
import { Menu, ChevronRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenuPlaceholder } from "./user-menu-placeholder";
import { useUiStore } from "@/stores/ui-store";
import type { UserRole } from "@/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function DashboardHeader({
  breadcrumbs = [{ label: "Dashboard" }],
  userRole = "CUSTOMER",
  userName,
  userEmail,
}: DashboardHeaderProps) {
  const { toggleMobileMenu } = useUiStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open mobile navigation</span>
        </Button>

        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.label} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-semibold text-foreground" : "font-medium"}>
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* Live Grid Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
          <span>Telemetry Active</span>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-border" />

        {/* User Profile Menu Placeholder */}
        <UserMenuPlaceholder
          name={userName}
          email={userEmail}
          role={userRole}
        />
      </div>
    </header>
  );
}
