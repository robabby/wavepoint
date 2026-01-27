/**
 * GET /api/profile/resonance-summary - Get aggregate resonance stats for the user
 */

import { NextResponse } from "next/server";
import { and, eq, isNotNull, desc } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, interpretationResonance } from "@/lib/db";
import type { ResonanceSummary, ResonanceTrend } from "@/lib/resonance";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all resonance records for the user (excluding null = "not sure")
    const records = await db
      .select({
        resonated: interpretationResonance.resonated,
        createdAt: interpretationResonance.createdAt,
      })
      .from(interpretationResonance)
      .where(
        and(
          eq(interpretationResonance.userId, userId),
          isNotNull(interpretationResonance.resonated)
        )
      )
      .orderBy(desc(interpretationResonance.createdAt));

    const totalResponses = records.length;

    // Not enough data
    if (totalResponses === 0) {
      const summary: ResonanceSummary = {
        totalResponses: 0,
        resonanceRate: 0,
        trend: "stable",
      };
      return NextResponse.json({ summary });
    }

    // Calculate overall resonance rate
    const positiveCount = records.filter((r) => r.resonated === true).length;
    const resonanceRate = Math.round((positiveCount / totalResponses) * 100);

    // Calculate trend
    let trend: ResonanceTrend = "stable";

    if (totalResponses >= 10) {
      // Recent = last 10 responses (most recent, sorted desc so first 10)
      const recent = records.slice(0, 10);
      const older = records.slice(10);

      if (older.length > 0) {
        const recentPositive = recent.filter((r) => r.resonated === true).length;
        const olderPositive = older.filter((r) => r.resonated === true).length;

        const recentRate = (recentPositive / recent.length) * 100;
        const olderRate = (olderPositive / older.length) * 100;

        const difference = recentRate - olderRate;

        if (difference >= 10) {
          trend = "improving";
        } else if (difference <= -10) {
          trend = "declining";
        }
      }
    }

    const summary: ResonanceSummary = {
      totalResponses,
      resonanceRate,
      trend,
    };

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Get resonance summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resonance summary" },
      { status: 500 }
    );
  }
}
