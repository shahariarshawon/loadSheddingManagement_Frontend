import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { ROUTES } from "@/lib/constants";
import { setAuthCookies } from "@/lib/auth-server";
import { registerSchema } from "@/features/auth/schemas/register.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

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

    const { name, email, password, phone, areaId } = validation.data;

    // Send registration payload to backend
    // Note: Public registration strictly creates a CUSTOMER on the backend
    const backendResponse = await fetch(`${env.backendApiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        phone: phone || undefined,
        areaId: areaId || undefined,
      }),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok || !backendData.success) {
      return NextResponse.json(
        {
          success: false,
          message: backendData.message || "Registration failed. Please check your inputs.",
          errors: backendData.errors,
        },
        { status: backendResponse.status || 400 }
      );
    }

    const { user, accessToken, refreshToken } = backendData.data;

    // Securely set HTTP-only cookies on the server
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json({
      success: true,
      message: "Customer registered successfully! Welcome to GridWatch.",
      data: {
        user,
        redirectTo: ROUTES.DASHBOARD,
      },
    });
  } catch (error) {
    console.error("Register route handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
