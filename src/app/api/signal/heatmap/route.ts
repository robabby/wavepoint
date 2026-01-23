/**
 * GET /api/signal/heatmap - Get user's sighting heatmap data
 *
 * Returns day-level counts for the past year for GitHub-style activity grid.
 * Accepts optional `tz` query param for timezone-aware date grouping.
 */

import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserActivityStats } from "@/lib/db";

// IANA timezone regex - matches patterns like "America/Los_Angeles" or "Europe/London"
const IANA_TZ_REGEX = /^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/;

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract timezone from query params (default to UTC)
    const { searchParams } = new URL(request.url);
    const tz = searchParams.get("tz") ?? "UTC";

    // Validate IANA timezone format to prevent SQL injection
    if (!IANA_TZ_REGEX.test(tz) && tz !== "UTC") {
      return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
    }

    // Calculate date range: past 365 days
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Build timezone-aware SQL using AT TIME ZONE
    // After validation, the timezone is safe to use in raw SQL
    const tzLiteral = sql.raw(`'${tz}'`);

    // Query sightings grouped by date in the user's timezone
    // Note: timestamps are stored as "timestamp without time zone" in UTC
    // We need to first interpret them as UTC, then convert to the target timezone:
    // (timestamp AT TIME ZONE 'UTC') converts to timestamptz, then AT TIME ZONE 'X' converts to local
    const dailyCounts = await db
      .select({
        date: sql<string>`to_char((${signalSightings.timestamp} AT TIME ZONE 'UTC') AT TIME ZONE ${tzLiteral}, 'YYYY-MM-DD')`.as(
          "date"
        ),
        count: sql<number>`count(*)::int`.as("count"),
      })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.userId, session.user.id),
          gte(signalSightings.timestamp, oneYearAgo)
        )
      )
      .groupBy(sql`to_char((${signalSightings.timestamp} AT TIME ZONE 'UTC') AT TIME ZONE ${tzLiteral}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char((${signalSightings.timestamp} AT TIME ZONE 'UTC') AT TIME ZONE ${tzLiteral}, 'YYYY-MM-DD')`);

    // Get activity stats (streaks)
    const activityStats = await db.query.signalUserActivityStats.findFirst({
      where: eq(signalUserActivityStats.userId, session.user.id),
    });

    return NextResponse.json({
      dailyCounts,
      streaks: {
        current: activityStats?.currentStreak ?? 0,
        longest: activityStats?.longestStreak ?? 0,
        totalActiveDays: activityStats?.totalActiveDays ?? 0,
        lastActiveDate: activityStats?.lastActiveDate ?? null,
      },
    });
  } catch (error) {
    console.error("Get heatmap error:", error);
    return NextResponse.json(
      { error: "Failed to fetch heatmap data" },
      { status: 500 }
    );
  }
}
