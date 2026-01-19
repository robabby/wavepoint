/**
 * GET /api/signal/stats - Get user's number statistics
 */

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalUserNumberStats } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await db.query.signalUserNumberStats.findMany({
      where: eq(signalUserNumberStats.userId, session.user.id),
      orderBy: desc(signalUserNumberStats.count),
    });

    const totalSightings = stats.reduce((sum, s) => sum + s.count, 0);
    const uniqueNumbers = stats.length;

    return NextResponse.json({
      totalSightings,
      uniqueNumbers,
      numberCounts: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
