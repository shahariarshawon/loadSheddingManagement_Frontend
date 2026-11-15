import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { ROUTES } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session.authenticated || !session.user) {
    redirect(`${ROUTES.LOGIN}?from=${encodeURIComponent(ROUTES.ADMIN)}`);
  }

  if (session.user.role !== "ADMIN") {
    redirect(ROUTES.UNAUTHORIZED);
  }

  return (
    <DashboardShell
      roleTitle="Platform Administrator"
      roleBadge="ADMIN"
      breadcrumbs={[{ label: "Control Center", href: ROUTES.ADMIN }]}
      userRole={session.user.role}
      userName={session.user.name}
      userEmail={session.user.email}
    >
      {children}
    </DashboardShell>
  );
}
