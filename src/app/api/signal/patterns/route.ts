/**
 * GET /api/signal/patterns - Get computed pattern insights for the user
 *
 * Returns cached patterns if fresh, otherwise recomputes and caches.
 * Staleness is determined by sighting count since last computation.
 */

import { NextResponse } from "next/server";
import { eq, count } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings } from "@/lib/db";
import {
  getCachedPatterns,
  cachePatterns,
  computeAllPatterns,
  type SightingForPattern,
} from "@/lib/patterns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get current sighting count
    const [countResult] = await db
      .select({ count: count().mapWith(Number) })
      .from(signalSightings)
      .where(eq(signalSightings.userId, userId));

    const sightingCount = countResult?.count ?? 0;

    // Try to get cached patterns
    const cached = await getCachedPatterns(userId, sightingCount);

    // If cached and not stale, return immediately
    if (cached && !cached.isStale) {
      return NextResponse.json(cached);
    }

    // Need to recompute - fetch all sightings
    const sightings = await db
      .select({
        id: signalSightings.id,
        number: signalSightings.number,
        moodTags: signalSightings.moodTags,
        activity: signalSightings.activity,
        timestamp: signalSightings.timestamp,
        tz: signalSightings.tz,
      })
      .from(signalSightings)
      .where(eq(signalSightings.userId, userId));

    // Transform to pattern-friendly format
    const sightingsForPattern: SightingForPattern[] = sightings.map((s) => ({
      id: s.id,
      number: s.number,
      moodTags: s.moodTags,
      activity: s.activity,
      timestamp: s.timestamp,
      tz: s.tz,
    }));

    // Compute patterns
    const patterns = computeAllPatterns(sightingsForPattern, sightingCount);

    // Cache for future requests (don't await to return faster)
    void cachePatterns(userId, patterns);

    return NextResponse.json(patterns);
  } catch (error) {
    console.error("Get patterns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}
