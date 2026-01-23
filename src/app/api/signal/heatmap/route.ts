/**
 * GET /api/signal/heatmap - Get user's sighting heatmap data
 *
 * Returns day-level counts for the past year for GitHub-style activity grid.
 */

import { NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserActivityStats } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate date range: past 365 days
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Query sightings grouped by date
    const dailyCounts = await db
      .select({
        date: sql<string>`to_char(${signalSightings.timestamp}, 'YYYY-MM-DD')`.as(
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
      .groupBy(sql`to_char(${signalSightings.timestamp}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${signalSightings.timestamp}, 'YYYY-MM-DD')`);

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
