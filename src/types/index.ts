import type React from "react";

// ============================================================================
// Core Roles & Enumerations (Verified from Backend Prisma Schema)
// ============================================================================

export type UserRole = "CUSTOMER" | "POWER_OPERATOR" | "ADMIN";

export type OutageType = "PLANNED" | "UNEXPECTED";

export type OutageStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "RESTORED"
  | "COMPLETED"
  | "CANCELLED";

export type ReportSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ReportStatus = "PENDING" | "VERIFIED" | "REJECTED" | "RESOLVED";

export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "RESTORED" | "COMPLETED";

export type SubscriptionPlan = "MONTHLY_PRIORITY" | "ANNUAL_PRIORITY";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

// ============================================================================
// Standard API Envelope Contracts
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  errors?: ApiErrorDetail[];
}

// ============================================================================
// Core Domain Models (Aligned with Backend Database Models)
// ============================================================================

export interface Area {
  id: string;
  name: string;
  postalCode?: string | null;
  feederId: string;
  feeder?: Feeder;
  substation?: Substation;
  userCount?: number;
  outageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Feeder {
  id: string;
  name: string;
  code: string;
  substationId: string;
  substation?: Substation;
  maxLoadKw?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Substation {
  id: string;
  name: string;
  code: string;
  zoneId: string;
  zone?: Zone;
  capacityKva?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  substations?: Substation[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  areaId?: string | null;
  area?: {
    id: string;
    name: string;
    postalCode?: string | null;
  } | null;
  googleId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Outage {
  id: string;
  outageNumber: string;
  type: OutageType;
  title: string;
  description?: string | null;
  areaId: string;
  area: Area;
  startTime: string;
  endTime?: string | null;
  status: OutageStatus;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email?: string;
    role: UserRole;
  };
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OutageReport {
  id: string;
  reportNumber: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  areaId: string;
  area?: Area;
  outageId?: string | null;
  outage?: Outage | null;
  title?: string | null;
  description: string;
  severity: ReportSeverity;
  status: ReportStatus;
  verifiedById?: string | null;
  verifiedBy?: {
    id: string;
    name: string;
    role: UserRole;
  } | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization?: string | null;
  zoneId: string;
  zone?: Zone;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

// ============================================================================
// Navigation & Layout Types
// ============================================================================

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  subscriptionId?: string | null;
  subscription?: Subscription | null;
  amount: number | string;
  currency: string;
  status: PaymentStatus;
  metadata?: Record<string, unknown> | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutResponse {
  paymentId: string;
  checkoutUrl: string;
  url: string;
  sessionId: string;
  amount: number;
  currency: string;
  plan: SubscriptionPlan;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
  exact?: boolean;
}

export interface AdminStats {
  users: {
    total: number;
    customers: number;
    operators: number;
    admins: number;
    active: number;
  };
  network: {
    zones: number;
    substations: number;
    feeders: number;
    areas: number;
  };
  outages: {
    total: number;
    active: number;
    planned: number;
    unexpected: number;
    restored: number;
  };
  reports: {
    total: number;
    pending: number;
    verified: number;
  };
  technicians: {
    total: number;
    available: number;
    busy: number;
  };
  finance: {
    totalPayments: number;
    successfulPayments: number;
    totalRevenueUsd: number;
    activeSubscribers: number;
  };
}
