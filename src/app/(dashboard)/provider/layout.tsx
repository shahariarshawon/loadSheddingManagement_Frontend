import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { PROVIDER_NAV_ITEMS } from "@/lib/nav-config";
import { ROUTES } from "@/lib/constants";

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session.authenticated || !session.user) {
    redirect(`${ROUTES.LOGIN}?from=${encodeURIComponent(ROUTES.PROVIDER)}`);
  }

  if (session.user.role !== "POWER_OPERATOR") {
    redirect(ROUTES.UNAUTHORIZED);
  }

  return (
    <DashboardShell
      navItems={PROVIDER_NAV_ITEMS}
      roleTitle="Grid Dispatch & Utility Operator"
      roleBadge="OPERATOR"
      breadcrumbs={[{ label: "Operator Portal", href: ROUTES.PROVIDER }]}
      userRole={session.user.role}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
