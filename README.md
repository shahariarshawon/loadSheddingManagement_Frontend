# GridWatch — Intelligent Load Shedding & Power Outage Management System

Frontend application for the **GridWatch** Load Shedding & Power Outage Management System, developed for the **Programming Hero B7A7 Fullstack Assignment**.

---

## 1. Project Overview & URLs

- **Live Frontend (Vercel):** `https://gridwatch-frontend.vercel.app` *(or configured Vercel deployment URL)*
- **Live Backend (Render):** `https://loadsheddingmanagement-backend.onrender.com`
- **Swagger API Docs:** `https://loadsheddingmanagement-backend.onrender.com/api-docs`
- **Backend GitHub Repository:** `https://github.com/shahariarshawon/loadSheddingManagement_Backend`
- **Frontend GitHub Repository:** `https://github.com/shahariarshawon/loadSheddingManagement_Frontend`

---

## 2. Technology Stack

- **Framework:** Next.js 16 (App Router, Server Components by default, Partial Prerendering enabled)
- **Language:** TypeScript 5.9 (Strict typechecking enabled, zero `any`)
- **Styling:** Tailwind CSS v4 & custom energy-management design tokens
- **Component Primitives:** shadcn/ui & @base-ui/react
- **Data Visualizations:** Recharts (Dynamically imported with skeleton fallback)
- **Server State & Caching:** TanStack Query v5 with optimistic UI updates
- **Global Client State:** Zustand (UI sidebar state & Multi-step form draft wizard)
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Payment Gateway:** Stripe Checkout (Test Mode / Sandbox with webhook idempotency)
- **Notifications:** Sonner
- **Icons:** Lucide React

---

## 3. Core Architecture & Features

### A. Next.js App Router Architecture
- **Route Groups:** Clear separation between `(public)` and `(dashboard)` route groups.
- **Backend-for-Frontend (BFF) Layer:** Server-side route handler `/api/backend/[...path]` transparently handles HTTP-only cookie JWT injection (`gw_access_token`) and automatic token refresh (`gw_refresh_token`) on `401 Unauthorized` responses.
- **Zero Token Leakage:** Authentication tokens are stored exclusively in HTTP-only, SameSite Secure cookies and never exposed to browser JavaScript or stored in `localStorage`.
- **Fault-Tolerant Boundary Architecture:** Root `error.tsx`, dashboard-level localized `error.tsx`, global `not-found.tsx`, and suspense loading skeletons across all views.

### B. Three Distinct Role-Based Dashboards
1. **Platform Administrator (`/admin`):**
   - Live aggregated analytics from `GET /api/v1/admin/stats` with Recharts data visualizations.
   - User Management (`/admin/users`) with role elevation, status toggle, and account suspension.
   - Grid Topology (`/admin/grid`) managing 4-tier network hierarchy (Zones, Substations, Feeders, Areas).
   - System Audit Logs (`/admin/audit-logs`) with forensic activity tracking and JSON diff inspector.
   - Financial Audit Ledger (`/admin/payments`) reviewing Stripe transaction settlements.
2. **Power Operator / Provider (`/provider`):**
   - Operational dispatch overview with live active outage counters and technician readiness.
   - Outage Schedule Manager (`/provider/schedules`) with status filters, cancellation dialogs, and deletion.
   - **4-Stage Multi-Step Scheduling Wizard (`/provider/schedules/new`):**
     - Stage 1: Distribution Sector & Substation selection.
     - Stage 2: Schedule window, Outage Category (`PLANNED` vs `UNEXPECTED`), and real-time duration calculator.
     - Stage 3: Operational instructions & automated consumer notice preview.
     - Stage 4: Read-only pre-flight manifest with legal authorization confirmation.
   - Incident Triage Deck (`/provider/reports`) with verification and rejection modals.
   - Field Technicians Roster (`/provider/technicians`) with live availability counters and optimistic status toggles.
3. **Residential Consumer (`/dashboard`):**
   - Real-time power stability card for user's registered sector and upcoming scheduled load-shedding.
   - Personal Incident Reports (`/dashboard/reports`) with optimistic report withdrawal.
   - Submit Outage Report form (`/dashboard/reports/new`) with area and severity selectors.
   - Profile & Sector Management (`/dashboard/profile`) updating residential area and contact details.
   - Area Reliability Analytics (`/dashboard/analytics`) displaying historical stability and downtime telemetry.
   - Billing & Priority Passes (`/dashboard/billing`) with Stripe sandbox checkout initiation.

### C. Genuine Stripe Test Sandbox Integration
- **Storefront:** 30-Day Priority Pass ($10.00 USD) and 365-Day Annual Pass ($99.00 USD).
- **Checkout Initiation:** Backend creates real Stripe Checkout session (`POST /api/v1/payments/checkout`) and redirects client to Stripe sandbox.
- **Verification Flow:** Return URL `/payments/success?session_id=...` queries backend `GET /api/v1/payments/status/:sessionId` for cryptographically verified status.
- **Cancellation Handler:** `/payments/cancel` provides friendly feedback and allows users to retry.
- **Test Card Credentials:** Standard Stripe Test Card `4242 • 4242 • 4242 • 4242` with any future date and CVC `123`.

---

## 4. Evaluation Demo Accounts (Pre-Seeded)

One-click demo buttons are provided on `/login` and the homepage, authenticating through the live Render backend:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gridwatch.com` | `Admin123!Secure` | System stats, user roles, grid topology, audit logs, financial ledger |
| **Power Operator** | `operator@gridwatch.com` | `User123!Secure` | Multi-step outage dispatch, incident triage, technicians roster |
| **Consumer** | `customer@gridwatch.com` | `User123!Secure` | Outage tracking, incident reporting, priority passes, billing history |

---

## 5. Local Development Setup

### Prerequisites
- Node.js v20.x or v22.x
- npm v10.x+

### Installation & Environment
```bash
git clone https://github.com/shahariarshawon/loadSheddingManagement_Frontend.git
cd loadSheddingManagement_Frontend
npm install
```

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Verification & Test Suite
```bash
# TypeScript strict check (0 errors)
npx tsc --noEmit

# ESLint compliance (0 errors)
npm run lint

# Production build test (35 static and partial-prerender routes)
npm run build
```

---

## 6. Vercel Deployment Instructions

1. Push your latest commits to your frontend GitHub repository.
2. In the Vercel Dashboard, click **Add New > Project** and import `loadSheddingManagement_Frontend`.
3. Configure the following environment variables:
   - `BACKEND_API_URL`: `https://loadsheddingmanagement-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_API_URL`: `https://loadsheddingmanagement-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_BASE_URL`: `https://loadsheddingmanagement-backend.onrender.com`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `pk_test_...` *(Your Stripe publishable key)*
   - `DEMO_ADMIN_EMAIL`: `admin@gridwatch.com`
   - `DEMO_ADMIN_PASSWORD`: `Admin123!Secure`
   - `DEMO_USER_EMAIL`: `customer@gridwatch.com`
   - `DEMO_USER_PASSWORD`: `User123!Secure`
   - `DEMO_PROVIDER_EMAIL`: `operator@gridwatch.com`
   - `DEMO_PROVIDER_PASSWORD`: `User123!Secure`
4. Click **Deploy**. Vercel will build and deploy the production bundle.
