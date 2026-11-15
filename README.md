# GridWatch — Frontend Application

Modern Next.js App Router frontend for the **GridWatch** Load Shedding & Power Outage Management System, developed for the B7A7 Fullstack Assignment.

---

## 1. Technology Stack

- **Framework:** Next.js (App Router, Server Components by default)
- **Language:** TypeScript (Strict mode enabled)
- **Styling:** Tailwind CSS v4 & shadcn/ui
- **Icons:** Lucide React
- **Server State & Caching:** TanStack Query v5 (React Query)
- **Client State:** Zustand
- **Form Management:** React Hook Form + Zod (`@hookform/resolvers`)
- **Notifications:** Sonner
- **Deployment Target:** Vercel

---

## 2. Getting Started

### Prerequisites
- Node.js v20.x or v22.x
- npm v10.x or v11.x

### Installation

Clone the repository and install dependencies using npm:

```bash
cd loadSheddingManagement-frontend
npm install
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Live Deployed Backend API Endpoint (Render)
NEXT_PUBLIC_API_URL=https://loadsheddingmanagement-backend.onrender.com/api/v1

# Base Backend URL
NEXT_PUBLIC_BASE_URL=https://loadsheddingmanagement-backend.onrender.com

# Stripe Test Mode Publishable Key (optional in Phase 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the application.

---

## 3. Build & Quality Verification

Run TypeScript compilation check:
```bash
npx tsc --noEmit
```

Run ESLint check:
```bash
npm run lint
```

Create production build:
```bash
npm run build
```

---

## 4. Project Architecture

```text
loadSheddingManagement-frontend/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx             # Public shell (Navbar + Footer)
│   │   │   └── page.tsx               # GridWatch landing page
│   │   ├── layout.tsx                 # Root layout & providers
│   │   ├── loading.tsx                # Global loading state
│   │   ├── error.tsx                  # Global error boundary
│   │   ├── not-found.tsx              # Custom 404 page
│   │   └── globals.css                # Energy-management design system tokens
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives (Button, Card, Sheet, etc.)
│   │   ├── shared/                    # Reusable components (Navbar, Footer)
│   │   └── layouts/                   # Reusable dashboard shell, sidebar & header
│   ├── lib/
│   │   ├── utils.ts                   # Tailwind merge (cn) & formatters
│   │   ├── constants.ts               # App metadata, routes, demo credentials
│   │   ├── env.ts                     # Centralized environment access
│   │   └── query-client.ts            # TanStack Query client configuration
│   ├── providers/
│   │   ├── index.tsx                  # Combined AppProviders (React Query, Tooltip, Sonner)
│   │   └── query-provider.tsx         # TanStack Query provider
│   ├── schemas/
│   │   ├── auth.schema.ts             # Zod validation schemas
│   │   └── index.ts
│   ├── stores/
│   │   └── ui-store.ts                # Zustand global UI state (sidebar, mobile menu)
│   └── types/
│       └── index.ts                   # Verified TypeScript domain models & API envelopes
├── .env.example
├── components.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Verified Demo Credentials (From Backend Database Seed)

The backend database on Neon already has pre-seeded accounts:

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@gridwatch.com` | `Admin123!Secure` | User management, grid topology, financial logs |
| **Power Operator** | `operator@gridwatch.com` | `User123!Secure` | Outage scheduling, report triage, technician dispatch |
| **Customer** | `customer@gridwatch.com` | `User123!Secure` | Outage tracking, incident reporting, premium passes |
