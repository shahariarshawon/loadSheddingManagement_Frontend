import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";

/**
 * Safely parse JWT payload without external libraries in the Proxy runtime
 */
function extractRoleFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const parsed = JSON.parse(jsonPayload);
    return parsed.role || null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const role = extractRoleFromToken(accessToken) || extractRoleFromToken(refreshToken);

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isProviderRoute = pathname === "/provider" || pathname.startsWith("/provider/");
  const isConsumerRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 1. Unauthenticated users accessing any protected dashboard
  if ((isAdminRoute || isProviderRoute || isConsumerRoute) && !hasSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users accessing login or register
  if (isAuthRoute && hasSession && role) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
    }
    if (role === "POWER_OPERATOR") {
      return NextResponse.redirect(new URL(ROUTES.PROVIDER, request.url));
    }
    if (role === "CUSTOMER") {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  // 3. Strict Role-Based Protected Route Boundaries
  if (isAdminRoute && role && role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
  }

  if (isProviderRoute && role && role !== "POWER_OPERATOR") {
    return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
  }

  if (isConsumerRoute && role && role !== "CUSTOMER") {
    // If Admin or Operator visits consumer root, redirect them to their primary portal
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
    }
    if (role === "POWER_OPERATOR") {
      return NextResponse.redirect(new URL(ROUTES.PROVIDER, request.url));
    }
    return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/provider/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
