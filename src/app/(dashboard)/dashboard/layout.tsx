import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { ROUTES } from "@/lib/constants";

export default async function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session.authenticated || !session.user) {
    redirect(`${ROUTES.LOGIN}?from=${encodeURIComponent(ROUTES.DASHBOARD)}`);
  }

  // Cross-role safety routing
  if (session.user.role === "ADMIN") {
    redirect(ROUTES.ADMIN);
  }
  if (session.user.role === "POWER_OPERATOR") {
    redirect(ROUTES.PROVIDER);
  }
  if (session.user.role !== "CUSTOMER") {
    redirect(ROUTES.UNAUTHORIZED);
  }

  return (
    <DashboardShell
      roleTitle="Residential Consumer Portal"
      roleBadge="CONSUMER"
      breadcrumbs={[{ label: "Consumer Portal", href: ROUTES.DASHBOARD }]}
      userRole={session.user.role}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
