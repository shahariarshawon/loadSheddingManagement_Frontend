"use client";

import type React from "react";
import { Sidebar } from "./sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { DashboardHeader } from "./dashboard-header";
import type { NavItem, UserRole } from "@/types";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleTitle?: string;
  roleBadge?: string;
  breadcrumbs?: BreadcrumbItem[];
  userRole?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({
  children,
  navItems,
  roleTitle = "Portal Dashboard",
  roleBadge,
  breadcrumbs,
  userRole = "CUSTOMER",
  userName,
  userEmail,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        items={navItems}
        roleTitle={roleTitle}
        roleBadge={roleBadge}
      />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        items={navItems}
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
