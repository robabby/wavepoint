/**
 * GET /api/signal/stats - Get user's number statistics and activity data
 */

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalUserNumberStats } from "@/lib/db";
import { getUserActivityStats } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [stats, activityStats] = await Promise.all([
      db.query.signalUserNumberStats.findMany({
        where: eq(signalUserNumberStats.userId, session.user.id),
        orderBy: desc(signalUserNumberStats.count),
      }),
      getUserActivityStats(session.user.id),
    ]);

    const totalSightings = stats.reduce((sum, s) => sum + s.count, 0);
    const uniqueNumbers = stats.length;

    return NextResponse.json({
      totalSightings,
      uniqueNumbers,
      numberCounts: stats,
      activity: {
        currentStreak: activityStats.currentStreak,
        longestStreak: activityStats.longestStreak,
        totalActiveDays: activityStats.totalActiveDays,
        lastActiveDate: activityStats.lastActiveDate,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
