import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { COOKIE_KEYS } from "@/lib/constants";
import { setAuthCookies } from "@/lib/auth-server";

type RouteParams = {
  params: Promise<{
    path: string[];
  }>;
};

async function handleProxy(request: Request, { params }: RouteParams) {
  try {
    const { path } = await params;
    const pathStr = path.join("/");
    const url = new URL(request.url);
    const search = url.search;
    const targetUrl = `${env.backendApiUrl}/${pathStr}${search}`;

    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let bodyData: string | undefined = undefined;
    if (["POST", "PATCH", "PUT"].includes(request.method)) {
      try {
        bodyData = await request.text();
      } catch {
        bodyData = undefined;
      }
    }

    let backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: bodyData,
      cache: "no-store",
    });

    let newTokens: { accessToken: string; refreshToken?: string } | null = null;

    // If 401 Unauthorized and refresh token is available, attempt transparent refresh
    if (backendResponse.status === 401 && refreshToken) {
      try {
        const refreshRes = await fetch(`${env.backendApiUrl}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          accessToken = refreshData.data?.accessToken;
          const newRefreshToken = refreshData.data?.refreshToken;

          if (accessToken) {
            newTokens = { accessToken, refreshToken: newRefreshToken };
            headers["Authorization"] = `Bearer ${accessToken}`;

            // Replay original request with refreshed token
            backendResponse = await fetch(targetUrl, {
              method: request.method,
              headers,
              body: bodyData,
              cache: "no-store",
            });
          }
        }
      } catch (refreshErr) {
        console.warn("Background refresh in proxy failed:", refreshErr);
      }
    }

    const data = await backendResponse.json().catch(() => ({}));
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // If tokens were refreshed during this call, update the HTTP-only cookies
    if (newTokens) {
      try {
        await setAuthCookies(newTokens.accessToken, newTokens.refreshToken);
      } catch {
        // Fallback: set directly on response
        response.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, newTokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60,
        });
        if (newTokens.refreshToken) {
          response.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error("BFF backend proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Gateway communication error." },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const PUT = handleProxy;
