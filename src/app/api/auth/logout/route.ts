import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { clearAuthCookies, getAuthTokens } from "@/lib/auth-server";

export async function POST() {
  try {
    const { refreshToken } = await getAuthTokens();

    // If a refresh token is present, notify backend to revoke it permanently in PostgreSQL
    if (refreshToken) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        await fetch(`${env.backendApiUrl}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (backendError) {
        console.warn("Backend logout request error (safely continuing):", backendError);
      }
    }

    // Always clear the local HTTP-only authentication cookies
    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout route handler error:", error);
    // Still ensure cookies are cleared even on exception
    try {
      await clearAuthCookies();
    } catch {
      // ignore
    }
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  }
}
