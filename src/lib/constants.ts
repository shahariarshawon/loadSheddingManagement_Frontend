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

  // Customer Dashboard Routes
  CUSTOMER_DASHBOARD: "/dashboard/customer",
  CUSTOMER_REPORTS: "/dashboard/customer/reports",
  CUSTOMER_NEW_REPORT: "/dashboard/customer/reports/new",
  CUSTOMER_ANALYTICS: "/dashboard/customer/analytics",
  CUSTOMER_BILLING: "/dashboard/customer/billing",
  CUSTOMER_PROFILE: "/dashboard/customer/profile",

  // Power Operator Dashboard Routes
  OPERATOR_DASHBOARD: "/dashboard/operator",
  OPERATOR_SCHEDULES: "/dashboard/operator/schedules",
  OPERATOR_NEW_SCHEDULE: "/dashboard/operator/schedules/new",
  OPERATOR_REPORTS: "/dashboard/operator/reports",
  OPERATOR_TECHNICIANS: "/dashboard/operator/technicians",

  // Admin Dashboard Routes
  ADMIN_DASHBOARD: "/dashboard/admin",
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_GRID: "/dashboard/admin/grid",
  ADMIN_PAYMENTS: "/dashboard/admin/payments",
  ADMIN_AUDIT_LOGS: "/dashboard/admin/audit-logs",

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
  },
  OPERATOR: {
    email: "operator@gridwatch.com",
    role: "POWER_OPERATOR" as const,
    label: "Power Operator",
  },
  CUSTOMER: {
    email: "customer@gridwatch.com",
    role: "CUSTOMER" as const,
    label: "Residential Customer",
  },
} as const;
