import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { env } from "@/env";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signUpSchema } from "@/lib/auth/schemas";
import { sendVerificationEmail } from "@/lib/auth/verification-service";
import { validateInvite, redeemInvite } from "@/lib/invites/service";
import { updateBrevoInviteStatusAsync } from "@/lib/invites/brevo";
import { checkRateLimit } from "@/lib/signal/rate-limit";

export async function POST(request: Request) {
  try {
    // Rate limit by IP: 5 attempts per hour
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const rateLimitResult = checkRateLimit(`register:${ip}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password, inviteCode } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Validate invite if invites are required
    let validatedInvite: Awaited<ReturnType<typeof validateInvite>> | null = null;

    if (env.NEXT_PUBLIC_INVITES_REQUIRED) {
      if (!inviteCode) {
        return NextResponse.json(
          { error: "Invite code is required" },
          { status: 400 }
        );
      }

      validatedInvite = await validateInvite(inviteCode, normalizedEmail);

      if (!validatedInvite.success) {
        return NextResponse.json(
          { error: validatedInvite.error },
          { status: 400 }
        );
      }
    }

    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password with cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    // If registering with a valid invite, mark email as verified (admin pre-verified)
    const [user] = await db.insert(users).values({
      email: normalizedEmail,
      passwordHash,
      emailVerified: validatedInvite?.data ? new Date() : null,
    }).returning();

    if (!user) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 500 }
      );
    }

    // Redeem invite if one was validated
    if (validatedInvite?.data) {
      await redeemInvite(validatedInvite.data.id, user.id);
      // Sync Brevo status (fire-and-forget)
      updateBrevoInviteStatusAsync(normalizedEmail);
    }

    // Send verification email only for non-invite registrations
    // Invite-based registrations are pre-verified by admin
    if (!validatedInvite?.data) {
      void sendVerificationEmail(normalizedEmail).catch((err) => {
        console.error("Failed to send verification email:", err);
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
