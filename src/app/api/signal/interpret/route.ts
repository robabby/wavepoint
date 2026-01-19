/**
 * POST /api/signal/interpret - Regenerate interpretation for existing sighting
 */

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserNumberStats } from "@/lib/db";
import { generateInterpretation } from "@/lib/signal/claude";
import { checkRateLimit } from "@/lib/signal/rate-limit";

const regenerateSchema = z.object({
  sightingId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Stricter rate limit for AI regeneration (10/min - AI calls are expensive)
    const rateLimit = checkRateLimit(`${session.user.id}:interpret`, {
      limit: 10,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = regenerateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sightingId } = parsed.data;

    // Verify ownership
    const sighting = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, sightingId),
        eq(signalSightings.userId, session.user.id)
      ),
    });

    if (!sighting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get stats for count
    const stats = await db.query.signalUserNumberStats.findFirst({
      where: and(
        eq(signalUserNumberStats.userId, session.user.id),
        eq(signalUserNumberStats.number, sighting.number)
      ),
    });

    const { content } = await generateInterpretation({
      sightingId: sighting.id,
      number: sighting.number,
      note: sighting.note ?? undefined,
      moodTags: sighting.moodTags ?? undefined,
      count: stats?.count ?? 1,
      isFirstCatch: false, // Regeneration is never first catch
    });

    return NextResponse.json({ interpretation: content });
  } catch (error) {
    console.error("Regenerate interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate interpretation" },
      { status: 500 }
    );
  }
}
