import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { COOKIE_KEYS } from "@/lib/constants";
import type { UserProfile, UserRole } from "@/types";

export interface ServerSessionResult {
  authenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
}

export function decodeJwtRole(token: string): UserRole | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);
    return payload.role || null;
  } catch {
    return null;
  }
}

export async function getAuthTokens() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value || null;
  const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value || null;
  return { accessToken, refreshToken };
}

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  // Access token cookie (15 minutes or session lifetime)
  cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  // Refresh token cookie (7 days)
  if (refreshToken) {
    cookieStore.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEYS.ACCESS_TOKEN);
  cookieStore.delete(COOKIE_KEYS.REFRESH_TOKEN);
}

/**
 * Fetch the authenticated user profile directly from the backend.
 * Used by Server Components (layouts, pages) for authoritative verification.
 */
export async function getServerSession(): Promise<ServerSessionResult> {
  try {
    const { accessToken, refreshToken } = await getAuthTokens();

    if (!accessToken && !refreshToken) {
      return { authenticated: false, user: null, accessToken: null };
    }

    // Attempt 1: Fetch profile with current accessToken
    if (accessToken) {
      const response = await fetch(`${env.backendApiUrl}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.ok) {
        const payload = await response.json();
        return {
          authenticated: true,
          user: payload.data as UserProfile,
          accessToken,
        };
      }
    }

    // Attempt 2: If accessToken is invalid/expired and refreshToken exists, attempt server-side refresh
    if (refreshToken) {
      const refreshResponse = await fetch(`${env.backendApiUrl}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;
        const newRefreshToken = refreshData.data?.refreshToken;

        if (newAccessToken) {
          // Fetch user profile with the newly issued access token
          const userResponse = await fetch(`${env.backendApiUrl}/users/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          });

          if (userResponse.ok) {
            const userPayload = await userResponse.json();
            
            // Try to persist cookies if we are in a context that allows it (Route Handler)
            try {
              await setAuthCookies(newAccessToken, newRefreshToken);
            } catch {
              // In Server Component render phase, cookies() is read-only.
              // That's fine: client will hit /api/auth/session to persist the refreshed cookies.
            }

            return {
              authenticated: true,
              user: userPayload.data as UserProfile,
              accessToken: newAccessToken,
            };
          }
        }
      }
    }

    return { authenticated: false, user: null, accessToken: null };
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    if (
      err?.digest?.includes("HANGING_PROMISE") ||
      err?.digest?.includes("NEXT_")
    ) {
      throw error;
    }
    return { authenticated: false, user: null, accessToken: null };
  }
}
