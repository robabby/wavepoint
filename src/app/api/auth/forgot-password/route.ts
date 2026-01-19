/**
 * POST /api/auth/forgot-password
 *
 * Request a password reset email.
 * No authentication required.
 * Rate limited to 1 email per 2 minutes per email address.
 *
 * Security: Always returns success to prevent email enumeration.
 */

import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/auth/schemas";
import { sendPasswordResetEmail } from "@/lib/auth/password-reset-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const result = await sendPasswordResetEmail(parsed.data.email);

    if (!result.success) {
      // Only reveal rate limiting errors (cooldown)
      // Other errors (like email not found) return success for security
      if (result.cooldownSeconds) {
        return NextResponse.json(
          {
            error: result.error,
            cooldownSeconds: result.cooldownSeconds,
          },
          { status: 429 }
        );
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
