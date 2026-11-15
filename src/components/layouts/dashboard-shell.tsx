"use client";

import type React from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { DashboardHeader } from "./dashboard-header";
import {
  ADMIN_NAV_ITEMS,
  PROVIDER_NAV_ITEMS,
  CUSTOMER_NAV_ITEMS,
} from "@/lib/nav-config";
import type { NavItem, UserRole } from "@/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  roleTitle?: string;
  roleBadge?: string;
  breadcrumbs?: BreadcrumbItem[];
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({
  children,
  navItems: propNavItems,
  roleTitle = "Portal Dashboard",
  roleBadge,
  breadcrumbs,
  userRole = "CUSTOMER",
  userName,
  userEmail,
}: DashboardShellProps) {
  // Resolve nav items inside the Client Component so React Component / Icon functions
  // NEVER cross the React Server Component -> Client Component serialization boundary.
  const resolvedNavItems =
    propNavItems ||
    (userRole === "ADMIN"
      ? ADMIN_NAV_ITEMS
      : userRole === "POWER_OPERATOR"
      ? PROVIDER_NAV_ITEMS
      : CUSTOMER_NAV_ITEMS);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        items={resolvedNavItems}
        roleTitle={roleTitle}
        roleBadge={roleBadge}
      />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        items={resolvedNavItems}
        roleTitle={roleTitle}
        roleBadge={roleBadge}
      />

      {/* Main View Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          breadcrumbs={breadcrumbs}
          userRole={userRole}
          userName={userName}
          userEmail={userEmail}
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
