/**
 * Shared resonance queries.
 * Extracted from the API route so both API and interpretation pipeline can use them.
 */

import { and, eq, isNotNull, desc } from "drizzle-orm";

import { db, interpretationResonance } from "@/lib/db";
import type { ResonanceSummary, ResonanceTrend } from "./types";

/**
 * Get aggregate resonance summary for a user.
 * Returns overall resonance rate and trend direction.
 */
export async function getResonanceSummary(
  userId: string
): Promise<ResonanceSummary> {
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

  if (totalResponses === 0) {
    return {
      totalResponses: 0,
      resonanceRate: 0,
      trend: "stable",
    };
  }

  const positiveCount = records.filter((r) => r.resonated === true).length;
  const resonanceRate = Math.round((positiveCount / totalResponses) * 100);

  let trend: ResonanceTrend = "stable";

  if (totalResponses >= 10) {
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

  return {
    totalResponses,
    resonanceRate,
    trend,
  };
}
