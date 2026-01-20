/**
 * POST /api/signal/sightings - Create a new sighting
 * GET /api/signal/sightings - List sightings with pagination
 */

import { NextResponse } from "next/server";
import { and, count, desc, eq, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserNumberStats } from "@/lib/db";
import { generateInterpretation } from "@/lib/signal/claude";
import { checkRateLimit } from "@/lib/signal/rate-limit";
import { createSightingSchema } from "@/lib/signal/schemas";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (30/min for sighting creation)
    const rateLimit = checkRateLimit(`${session.user.id}:sighting:create`, {
      limit: 30,
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

    const parsed = createSightingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { number, note, moodTags } = parsed.data;
    const userId = session.user.id;
    const now = new Date();

    // Create sighting first
    const [sighting] = await db
      .insert(signalSightings)
      .values({ userId, number, note, moodTags })
      .returning();

    // Upsert stats (neon-http doesn't support transactions, but stats are
    // denormalized and recoverable if this fails)
    const [stats] = await db
      .insert(signalUserNumberStats)
      .values({
        userId,
        number,
        count: 1,
        firstSeen: now,
        lastSeen: now,
      })
      .onConflictDoUpdate({
        target: [signalUserNumberStats.userId, signalUserNumberStats.number],
        set: {
          count: sql`${signalUserNumberStats.count} + 1`,
          lastSeen: now,
        },
      })
      .returning();

    const isFirstCatch = stats!.count === 1;
    const result = { sighting: sighting!, stats: stats!, isFirstCatch };

    // Generate interpretation (outside transaction - can retry independently)
    const { content: interpretation } = await generateInterpretation({
      sightingId: result.sighting.id,
      number,
      note: note ?? undefined,
      moodTags: moodTags ?? undefined,
      count: result.stats.count,
      isFirstCatch: result.isFirstCatch,
    });

    return NextResponse.json({
      sighting: result.sighting,
      interpretation,
      isFirstCatch: result.isFirstCatch,
      count: result.stats.count,
    });
  } catch (error) {
    console.error("Create sighting error:", error);
    return NextResponse.json(
      { error: "Failed to create sighting" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = parseInt(searchParams.get("limit") ?? "20", 10);
    const limit = Math.min(
      Math.max(Number.isNaN(limitParam) ? 20 : limitParam, 1),
      100
    );
    const offsetParam = parseInt(searchParams.get("offset") ?? "0", 10);
    const offset = Math.max(Number.isNaN(offsetParam) ? 0 : offsetParam, 0);
    const numberFilter = searchParams.get("number");

    const conditions = [eq(signalSightings.userId, session.user.id)];
    if (numberFilter) {
      conditions.push(eq(signalSightings.number, numberFilter));
    }

    const sightings = await db.query.signalSightings.findMany({
      where: and(...conditions),
      orderBy: desc(signalSightings.timestamp),
      limit,
      offset,
      with: {
        interpretation: true,
      },
    });

    const [countResult] = await db
      .select({ total: count().mapWith(Number) })
      .from(signalSightings)
      .where(and(...conditions));

    return NextResponse.json({
      sightings,
      total: countResult?.total ?? 0,
    });
  } catch (error) {
    console.error("Get sightings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sightings" },
      { status: 500 }
    );
  }
}
