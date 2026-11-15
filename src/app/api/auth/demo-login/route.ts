import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { setAuthCookies } from "@/lib/auth-server";
import type { UserRole } from "@/types";

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
        email = process.env.DEMO_ADMIN_EMAIL || "";
        password = process.env.DEMO_ADMIN_PASSWORD || "";
        roleLabel = "Administrator";
        break;
      case "POWER_OPERATOR":
        email = process.env.DEMO_PROVIDER_EMAIL || "";
        password = process.env.DEMO_PROVIDER_PASSWORD || "";
        roleLabel = "Electricity Provider / Operator";
        break;
      case "CUSTOMER":
        email = process.env.DEMO_USER_EMAIL || "";
        password = process.env.DEMO_USER_PASSWORD || "";
        roleLabel = "Residential Consumer";
        break;
    }

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: `Demo credentials for ${roleLabel} are not configured in the server environment. Please set DEMO_${role}_EMAIL and DEMO_${role}_PASSWORD in .env.local.`,
        },
        { status: 400 }
      );
    }

    // Authenticate with real backend login endpoint
    const backendResponse = await fetch(`${env.backendApiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok || !backendData.success) {
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

    const { user, accessToken, refreshToken } = backendData.data;

    // Securely set HTTP-only cookies
    await setAuthCookies(accessToken, refreshToken);

    // Map verified role to destination dashboard
    let redirectTo: string = ROUTES.DASHBOARD;
    if (user.role === "ADMIN") {
      redirectTo = ROUTES.ADMIN;
    } else if (user.role === "POWER_OPERATOR") {
      redirectTo = ROUTES.PROVIDER;
    }

    return NextResponse.json({
      success: true,
      message: `Demo authentication as ${roleLabel} successful!`,
      data: {
        user,
        redirectTo,
      },
    });
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
