/**
 * POST /api/auth/verify
 *
 * Verify email with token from verification link.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyEmailWithToken } from "@/lib/auth/verification-service";

const verifySchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    const result = await verifyEmailWithToken(parsed.data.token);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
