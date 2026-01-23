/**
 * Waitlist API Route
 *
 * Handles waitlist signup submissions.
 * - Rate limited by IP (5/hour)
 * - Stores in database
 * - Syncs to Brevo CRM (fire-and-forget)
 */

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db, waitlistSignups } from "@/lib/db";
import { waitlistSignupSchema, syncWaitlistToBrevoAsync } from "@/lib/waitlist";
import { checkRateLimit } from "@/lib/signal/rate-limit";

/**
 * Extract client IP from request headers
 * Handles Vercel, Cloudflare, and standard proxies
 */
function getClientIp(headersList: Headers): string {
  // Vercel/Cloudflare/common proxy headers
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs; first is the client
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  // Cloudflare
  const cfIp = headersList.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // Fallback for local development
  return "127.0.0.1";
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const clientIp = getClientIp(headersList);

    // Rate limit: 5 submissions per hour per IP
    const rateLimit = await checkRateLimit(`waitlist:${clientIp}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimit.resetAt - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = (await request.json()) as unknown;
    const result = waitlistSignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, source } = result.data;

    // Store in database
    const [signup] = await db
      .insert(waitlistSignups)
      .values({
        email: email.toLowerCase().trim(),
        source,
        ipAddress: clientIp,
      })
      .returning({ id: waitlistSignups.id });

    // Sync to Brevo CRM (fire-and-forget)
    syncWaitlistToBrevoAsync(email, source);

    return NextResponse.json({ success: true, id: signup?.id });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist" },
      { status: 500 }
    );
  }
}
