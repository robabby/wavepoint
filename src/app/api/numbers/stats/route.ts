/**
 * GET /api/numbers/stats - Get user's number pattern statistics
 *
 * Authenticated endpoint that returns the user's sighting stats
 * for personalization on the Numbers pages.
 *
 * Query params:
 * - pattern: Optional. Get stats for a specific pattern only.
 */

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getUserNumberStats,
  getUserAllNumberStats,
  getUserTotalSightings,
} from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pattern = searchParams.get("pattern");

    // Get stats for a specific pattern
    if (pattern) {
      const stats = await getUserNumberStats(session.user.id, pattern);
      return NextResponse.json({
        pattern,
        stats,
      });
    }

    // Get all stats for the user
    const [stats, totalSightings] = await Promise.all([
      getUserAllNumberStats(session.user.id),
      getUserTotalSightings(session.user.id),
    ]);

    return NextResponse.json({
      stats,
      totalSightings,
      uniquePatterns: stats.length,
    });
  } catch (error) {
    console.error("Get number stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
