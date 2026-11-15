import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";

export async function GET() {
  try {
    const session = await getServerSession();

    return NextResponse.json({
      success: true,
      authenticated: session.authenticated,
      user: session.user,
    });
  } catch (error: unknown) {
    const err = error as { digest?: string };
    if (
      err?.digest?.includes("HANGING_PROMISE") ||
      err?.digest?.includes("NEXT_")
    ) {
      throw error;
    }
    console.error("Session route handler error:", error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
      },
      { status: 200 }
    );
  }
}
