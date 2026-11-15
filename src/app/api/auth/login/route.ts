import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { setAuthCookies } from "@/lib/auth-server";
import { loginSchema } from "@/features/auth/schemas/login.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Call real backend authentication endpoint
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
          message: backendData.message || "Invalid credentials. Please try again.",
          errors: backendData.errors,
        },
        { status: backendResponse.status || 400 }
      );
    }

    const { user, accessToken, refreshToken } = backendData.data;

    // Securely set HTTP-only cookies on the server
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
      message: "Login successful",
      data: {
        user,
        redirectTo,
      },
    });
  } catch (error) {
    console.error("Login route handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during authentication. Please try again.",
      },
      { status: 500 }
    );
  }
}
