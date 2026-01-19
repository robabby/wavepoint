/**
 * POST /api/auth/reset-password
 *
 * Reset password using token from password reset email.
 * No authentication required.
 */

import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/auth/schemas";
import { resetPasswordWithToken } from "@/lib/auth/password-reset-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      // Return first validation error
      const errorMessage =
        errors.token?.[0] ?? errors.password?.[0] ?? "Invalid input";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const result = await resetPasswordWithToken(
      parsed.data.token,
      parsed.data.password
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
