/**
 * POST /api/signal/sightings - Create a new sighting
 * GET /api/signal/sightings - List sightings with pagination
 */

import { NextResponse } from "next/server";
import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserNumberStats, spiritualProfiles } from "@/lib/db";
import { updateUserActivityStats } from "@/lib/db/queries";
import { generateInterpretation, type UserProfileContext } from "@/lib/signal/claude";
import type { ZodiacSign } from "@/lib/astrology";
import type { Element } from "@/lib/numbers/planetary";
import { personalYearNumber } from "@/lib/numerology";
import { calculateCosmicContext } from "@/lib/signal/cosmic-context";
import { detectDelight, type DelightMoment } from "@/lib/signal/delight";
import { generateInsight, type PatternInsight } from "@/lib/signal/insights";
import { getBaseMeaning } from "@/lib/signal/meanings";
import { checkRateLimit } from "@/lib/signal/rate-limit";
import { createSightingSchema, type MoodOption } from "@/lib/signal/schemas";
import { hasInsightAccess } from "@/lib/signal/subscriptions";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (30/min for sighting creation)
    const rateLimit = await checkRateLimit(`${session.user.id}:sighting:create`, {
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

    const { number, note, moodTags, tz } = parsed.data;
    const userId = session.user.id;
    const now = new Date();

    // Calculate cosmic context for this moment
    const cosmicContext = calculateCosmicContext(now);

    // Create sighting first
    const [sighting] = await db
      .insert(signalSightings)
      .values({ userId, number, note, moodTags, tz, cosmicContext })
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

    // Update activity stats (streaks) - denormalized and recoverable if this fails
    await updateUserActivityStats(userId, now, tz);

    // Count recent sightings for insight generation (past 7 days, excluding current)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [recentCountResult] = await db
      .select({ count: count().mapWith(Number) })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.userId, userId),
          eq(signalSightings.number, number),
          gte(signalSightings.timestamp, sevenDaysAgo)
        )
      );

    // Generate pattern insight
    const insight: PatternInsight | null = generateInsight({
      number,
      count: result.stats.count,
      firstSeen: result.stats.firstSeen,
      lastSeen: isFirstCatch ? null : result.stats.lastSeen,
      recentCount: (recentCountResult?.count ?? 1) - 1, // Exclude current sighting
      isFirstCatch,
    });

    // Check subscription tier for AI interpretation
    const hasAiAccess = await hasInsightAccess(userId);

    // Detect delight moments
    // Get total sightings count and first sighting date
    const [totalResult] = await db
      .select({ count: count().mapWith(Number) })
      .from(signalSightings)
      .where(eq(signalSightings.userId, userId));

    const [firstSighting] = await db
      .select({ timestamp: signalSightings.timestamp })
      .from(signalSightings)
      .where(eq(signalSightings.userId, userId))
      .orderBy(asc(signalSightings.timestamp))
      .limit(1);

    // Get historical sightings for pattern echo (last year, same number, with moods)
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const historicalSightings = await db
      .select({
        number: signalSightings.number,
        moodTags: signalSightings.moodTags,
        timestamp: signalSightings.timestamp,
      })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.userId, userId),
          eq(signalSightings.number, number),
          gte(signalSightings.timestamp, oneYearAgo),
          lte(signalSightings.timestamp, thirtyDaysAgo)
        )
      )
      .orderBy(desc(signalSightings.timestamp))
      .limit(10);

    const delight: DelightMoment | null = detectDelight({
      number,
      timestamp: now,
      moodTags: moodTags ?? undefined,
      totalSightings: totalResult?.count ?? 0,
      firstSightingDate: firstSighting?.timestamp ?? null,
      historicalSightings: historicalSightings.map((s) => ({
        number: s.number,
        moodTags: s.moodTags as MoodOption[] | null,
        timestamp: s.timestamp,
      })),
    });

    // Fetch user's spiritual profile for personalized interpretations
    let profileContext: UserProfileContext | undefined;
    try {
      const [profileRow] = await db
        .select({
          sunSign: spiritualProfiles.sunSign,
          moonSign: spiritualProfiles.moonSign,
          risingSign: spiritualProfiles.risingSign,
          elementFire: spiritualProfiles.elementFire,
          elementEarth: spiritualProfiles.elementEarth,
          elementAir: spiritualProfiles.elementAir,
          elementWater: spiritualProfiles.elementWater,
          // Numerology fields
          birthDate: spiritualProfiles.birthDate,
          lifePathNumber: spiritualProfiles.lifePathNumber,
          expressionNumber: spiritualProfiles.expressionNumber,
        })
        .from(spiritualProfiles)
        .where(eq(spiritualProfiles.userId, userId));

      if (profileRow?.sunSign) {
        // Determine dominant element
        const elements = {
          fire: profileRow.elementFire,
          earth: profileRow.elementEarth,
          air: profileRow.elementAir,
          water: profileRow.elementWater,
        };
        const maxValue = Math.max(...Object.values(elements));
        const dominantElement = maxValue > 0
          ? (Object.entries(elements).find(([, v]) => v === maxValue)?.[0] as Element | undefined)
          : undefined;

        // Calculate personal year if birth date is available
        const personalYear = profileRow.birthDate
          ? personalYearNumber(profileRow.birthDate, now)
          : undefined;

        profileContext = {
          // Astrology
          sunSign: profileRow.sunSign as ZodiacSign,
          moonSign: profileRow.moonSign as ZodiacSign | undefined,
          risingSign: profileRow.risingSign as ZodiacSign | undefined,
          dominantElement,
          // Numerology
          lifePath: profileRow.lifePathNumber ?? undefined,
          expression: profileRow.expressionNumber ?? undefined,
          personalYear,
        };
      }
    } catch {
      // Profile fetch failed - continue without personalization
    }

    // Generate interpretation based on subscription tier
    let interpretation: string;
    let tier: "free" | "insight";

    if (hasAiAccess) {
      // Insight tier: Generate AI interpretation
      const { content } = await generateInterpretation({
        sightingId: result.sighting.id,
        number,
        note: note ?? undefined,
        moodTags: moodTags ?? undefined,
        count: result.stats.count,
        isFirstCatch: result.isFirstCatch,
        profile: profileContext,
      });
      interpretation = content;
      tier = "insight";
    } else {
      // Free tier: Return base meaning from Numbers library
      interpretation = getBaseMeaning(number);
      tier = "free";
    }

    return NextResponse.json({
      sighting: result.sighting,
      interpretation,
      isFirstCatch: result.isFirstCatch,
      count: result.stats.count,
      insight,
      delight,
      tier,
      cosmicContext,
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
    const sinceParam = searchParams.get("since");

    const conditions = [eq(signalSightings.userId, session.user.id)];
    if (numberFilter) {
      conditions.push(eq(signalSightings.number, numberFilter));
    }
    if (sinceParam) {
      const sinceDate = new Date(sinceParam);
      if (!isNaN(sinceDate.getTime())) {
        conditions.push(gte(signalSightings.timestamp, sinceDate));
      }
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
