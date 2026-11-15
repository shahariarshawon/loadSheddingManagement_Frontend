/**
 * Global Application Constants & Route Configuration
 */

export const APP_CONFIG = {
  name: "GridWatch",
  fullName: "GridWatch — Load Shedding & Power Outage Management System",
  description:
    "Intelligent electricity distribution monitoring, verified load-shedding scheduling, real-time outage dispatch, and area reliability analytics.",
  version: "1.0.0",
  year: 2026,
  backendLiveUrl: "https://loadsheddingmanagement-backend.onrender.com",
  swaggerDocsUrl: "https://loadsheddingmanagement-backend.onrender.com/api-docs",
  healthUrl: "https://loadsheddingmanagement-backend.onrender.com/api/v1/health",
} as const;

export const ROUTES = {
  // Public Routes
  HOME: "/",
  ABOUT: "/about",
  NETWORK: "/network",
  SCHEDULES: "/schedules",
  CONTACT: "/contact",

  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  UNAUTHORIZED: "/unauthorized",

  // Role-Based Dashboards (Phase 2 primary routes)
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_GRID: "/admin/grid",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",

  DASHBOARD: "/dashboard",
  CUSTOMER_REPORTS: "/dashboard/reports",
  CUSTOMER_NEW_REPORT: "/dashboard/reports/new",
  CUSTOMER_ANALYTICS: "/dashboard/analytics",
  CUSTOMER_BILLING: "/dashboard/billing",
  CUSTOMER_PROFILE: "/dashboard/profile",

  PROVIDER: "/provider",
  PROVIDER_SCHEDULES: "/provider/schedules",
  PROVIDER_NEW_SCHEDULE: "/provider/schedules/new",
  PROVIDER_REPORTS: "/provider/reports",
  PROVIDER_TECHNICIANS: "/provider/technicians",

  // Aliases for backwards compatibility with Phase 1 references
  CUSTOMER_DASHBOARD: "/dashboard",
  OPERATOR_DASHBOARD: "/provider",
  ADMIN_DASHBOARD: "/admin",

  // Payment Redirect Routes
  PAYMENT_SUCCESS: "/payments/success",
  PAYMENT_CANCEL: "/payments/cancel",
} as const;

/**
 * Verified pre-seeded demo accounts from Backend Phase 0 Audit
 */
export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: "admin@gridwatch.com",
    role: "ADMIN" as const,
    label: "Administrator",
    description: "System governance, user roles, grid topology & financial records",
  },
  PROVIDER: {
    email: "operator@gridwatch.com",
    role: "POWER_OPERATOR" as const,
    label: "Electricity Provider / Operator",
    description: "Load-shedding coordination, dispatch triage & technician rosters",
  },
  OPERATOR: {
    email: "operator@gridwatch.com",
    role: "POWER_OPERATOR" as const,
    label: "Power Operator",
    description: "Load-shedding coordination, dispatch triage & technician rosters",
  },
  CUSTOMER: {
    email: "customer@gridwatch.com",
    role: "CUSTOMER" as const,
    label: "User / Consumer",
    description: "Outage schedules, personal incident reports & reliability analytics",
  },
} as const;

export const COOKIE_KEYS = {
  ACCESS_TOKEN: "gw_access_token",
  REFRESH_TOKEN: "gw_refresh_token",
} as const;
