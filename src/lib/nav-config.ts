import {
  LayoutDashboard,
  Users,
  Network,
  CreditCard,
  FileText,
  Radio,
  Calendar,
  PlusCircle,
  AlertTriangle,
  Wrench,
  Home,
  ClipboardList,
  BarChart3,
  User,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import type { NavItem } from "@/types";

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Admin Overview",
    href: ROUTES.ADMIN,
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "User Management",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    title: "Grid Topology",
    href: ROUTES.ADMIN_GRID,
    icon: Network,
  },
  {
    title: "System Audit Logs",
    href: ROUTES.ADMIN_AUDIT_LOGS,
    icon: FileText,
  },
  {
    title: "Financial Audit",
    href: ROUTES.ADMIN_PAYMENTS,
    icon: CreditCard,
    badge: "Phase 4",
  },
];

export const PROVIDER_NAV_ITEMS: NavItem[] = [
  {
    title: "Dispatch Overview",
    href: ROUTES.PROVIDER,
    icon: Radio,
    exact: true,
  },
  {
    title: "Outage Schedules",
    href: ROUTES.PROVIDER_SCHEDULES,
    icon: Calendar,
  },
  {
    title: "Schedule Outage",
    href: ROUTES.PROVIDER_NEW_SCHEDULE,
    icon: PlusCircle,
  },
  {
    title: "Incident Triage",
    href: ROUTES.PROVIDER_REPORTS,
    icon: AlertTriangle,
  },
  {
    title: "Technicians Roster",
    href: ROUTES.PROVIDER_TECHNICIANS,
    icon: Wrench,
  },
];

export const CUSTOMER_NAV_ITEMS: NavItem[] = [
  {
    title: "Consumer Overview",
    href: ROUTES.DASHBOARD,
    icon: Home,
    exact: true,
  },
  {
    title: "My Reports",
    href: ROUTES.CUSTOMER_REPORTS,
    icon: ClipboardList,
  },
  {
    title: "Report Outage",
    href: ROUTES.CUSTOMER_NEW_REPORT,
    icon: PlusCircle,
  },
  {
    title: "Area Analytics",
    href: ROUTES.CUSTOMER_ANALYTICS,
    icon: BarChart3,
  },
  {
    title: "Profile & Area",
    href: ROUTES.CUSTOMER_PROFILE,
    icon: User,
  },
  {
    title: "Billing & Passes",
    href: ROUTES.CUSTOMER_BILLING,
    icon: CreditCard,
    badge: "Phase 4",
  },
];
