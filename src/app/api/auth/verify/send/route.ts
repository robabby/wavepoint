/**
 * POST /api/auth/verify/send
 *
 * Send (or resend) verification email to the authenticated user.
 * Rate limited to 1 email per 2 minutes.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/auth/verification-service";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await sendVerificationEmail(session.user.email);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          cooldownSeconds: result.cooldownSeconds,
        },
        { status: result.cooldownSeconds ? 429 : 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
