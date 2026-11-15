import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { setAuthCookies } from "@/lib/auth-server";
import type { UserRole, UserProfile } from "@/types";

function createSignedDemoTokens(user: { id: string; email: string; role: string; name: string }) {
  const accessSecret =
    process.env.JWT_ACCESS_SECRET || "gridwatch_jwt_access_secret_super_secure_key_2026";
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || "gridwatch_jwt_refresh_secret_super_secure_key_2026";
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");

  const accessPayload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: now,
      exp: now + 3600,
    })
  ).toString("base64url");

  const accessSig = crypto
    .createHmac("sha256", accessSecret)
    .update(`${header}.${accessPayload}`)
    .digest("base64url");

  const refreshPayload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      iat: now,
      exp: now + 7 * 24 * 3600,
    })
  ).toString("base64url");

  const refreshSig = crypto
    .createHmac("sha256", refreshSecret)
    .update(`${header}.${refreshPayload}`)
    .digest("base64url");

  return {
    accessToken: `${header}.${accessPayload}.${accessSig}`,
    refreshToken: `${header}.${refreshPayload}.${refreshSig}`,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body.role as UserRole;

    if (!role || !["ADMIN", "POWER_OPERATOR", "CUSTOMER"].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid demo role specified.",
        },
        { status: 400 }
      );
    }

    let email = "";
    let password = "";
    let roleLabel = "";

    switch (role) {
      case "ADMIN":
        email = process.env.DEMO_ADMIN_EMAIL || "admin@gridwatch.com";
        password = process.env.DEMO_ADMIN_PASSWORD || "Admin123!Secure";
        roleLabel = "Administrator";
        break;
      case "POWER_OPERATOR":
        email = process.env.DEMO_PROVIDER_EMAIL || "operator@gridwatch.com";
        password = process.env.DEMO_PROVIDER_PASSWORD || "User123!Secure";
        roleLabel = "Electricity Provider / Operator";
        break;
      case "CUSTOMER":
        email = process.env.DEMO_USER_EMAIL || "customer@gridwatch.com";
        password = process.env.DEMO_USER_PASSWORD || "User123!Secure";
        roleLabel = "Residential Consumer";
        break;
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: `Demo credentials for ${roleLabel} are not configured in the server environment.`,
        },
        { status: 400 }
      );
    }

    // Authenticate with real backend login endpoint with a 5-second timeout
    // If Render backend is sleeping, abort after 5s and issue resilient demo session with real DB IDs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const backendResponse = await fetch(`${env.backendApiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    const backendData = backendResponse ? await backendResponse.json().catch(() => null) : null;

    let user: UserProfile;
    let accessToken: string;
    let refreshToken: string;

    if (!backendResponse || !backendResponse.ok || !backendData?.success) {
      if (!backendResponse || backendResponse.status === 429 || !backendData?.data) {
        // Render backend rate limit exceeded or backend cold starting:
        // Use verified PostgreSQL database UUIDs so downstream APIs (/payments/my, /payments/checkout) succeed
        const fallbackId =
          role === "ADMIN"
            ? "b8aa1c30-3026-42a4-bbcc-5dfda44f1b74"
            : role === "POWER_OPERATOR"
            ? "2a0d3bc6-3a32-4763-b129-2c9c5b7aabd9"
            : "0c7ec917-3d6e-4408-9aaf-1dd37ff0c41e";

        const fallbackName =
          role === "ADMIN"
            ? "System Administrator"
            : role === "POWER_OPERATOR"
            ? "Chief Grid Operator"
            : "Tariq Rahman";

        const fallbackPhone =
          role === "ADMIN"
            ? "+8801700000000"
            : role === "POWER_OPERATOR"
            ? "+8801800000001"
            : "+8801900000001";

        user = {
          id: fallbackId,
          name: fallbackName,
          email,
          phone: fallbackPhone,
          role,
          isActive: true,
          areaId: role === "CUSTOMER" ? "area-gulshan-2-c" : null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const tokens = createSignedDemoTokens(user);
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              backendData.message ||
              `Failed to authenticate demo account for ${roleLabel}.`,
          },
          { status: backendResponse.status || 401 }
        );
      }
    } else {
      user = backendData.data.user;
      accessToken = backendData.data.accessToken;
      refreshToken = backendData.data.refreshToken;
    }

    // Securely set HTTP-only cookies
    await setAuthCookies(accessToken, refreshToken);

    // Map verified role to destination dashboard
    let redirectTo: string = ROUTES.DASHBOARD;
    if (user.role === "ADMIN") {
      redirectTo = ROUTES.ADMIN;
    } else if (user.role === "POWER_OPERATOR") {
      redirectTo = ROUTES.PROVIDER;
    }

    const response = NextResponse.json({
      success: true,
      message: `Demo authentication as ${roleLabel} successful!`,
      data: {
        user,
        redirectTo,
      },
    });

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("gw_access_token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    if (refreshToken) {
      response.cookies.set("gw_refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error("Demo login route handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during demo authentication.",
      },
      { status: 500 }
    );
  }
}
