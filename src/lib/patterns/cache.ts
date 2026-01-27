/**
 * Pattern insights cache.
 * Handles reading/writing pattern insights to/from the database.
 */

import { eq } from "drizzle-orm";
import { db, userPatternInsights } from "@/lib/db";
import type {
  ComputedPatterns,
  PatternInsight,
  TimeDistributionInsight,
  MoodCorrelationInsight,
  ActivityCorrelationInsight,
  FrequencyTrendInsight,
} from "./types";

/**
 * Number of new sightings before patterns are considered stale.
 */
export const STALENESS_THRESHOLD = 5;

/**
 * Check if cached patterns are stale based on sighting count.
 */
export function isPatternsStale(
  cachedSightingCount: number | null,
  currentSightingCount: number
): boolean {
  if (cachedSightingCount === null) return true;
  return currentSightingCount - cachedSightingCount >= STALENESS_THRESHOLD;
}

/**
 * Get cached patterns for a user.
 * Returns null if no cached patterns exist.
 */
export async function getCachedPatterns(
  userId: string,
  currentSightingCount: number
): Promise<ComputedPatterns | null> {
  const cached = await db
    .select()
    .from(userPatternInsights)
    .where(eq(userPatternInsights.userId, userId));

  if (cached.length === 0) {
    return null;
  }

  // Organize by type
  const timeDistribution: TimeDistributionInsight[] = [];
  const moodCorrelation: MoodCorrelationInsight[] = [];
  const activityCorrelation: ActivityCorrelationInsight[] = [];
  const frequencyTrend: FrequencyTrendInsight[] = [];

  let lastComputedAt: Date | null = null;
  let cachedSightingCount: number | null = null;

  for (const row of cached) {
    const insight = {
      type: row.insightType,
      key: row.insightKey,
      computedAt: row.computedAt ?? new Date(),
      sightingCountAtComputation: row.sightingCountAtComputation ?? 0,
      value: row.insightValue,
    } as PatternInsight;

    // Track latest computation time
    if (!lastComputedAt || (row.computedAt && row.computedAt > lastComputedAt)) {
      lastComputedAt = row.computedAt;
    }
    if (row.sightingCountAtComputation !== null) {
      cachedSightingCount = row.sightingCountAtComputation;
    }

    // Sort into type buckets
    switch (row.insightType) {
      case "time_distribution":
        timeDistribution.push(insight as TimeDistributionInsight);
        break;
      case "mood_correlation":
        moodCorrelation.push(insight as MoodCorrelationInsight);
        break;
      case "activity_correlation":
        activityCorrelation.push(insight as ActivityCorrelationInsight);
        break;
      case "frequency_trend":
        frequencyTrend.push(insight as FrequencyTrendInsight);
        break;
    }
  }

  const isStale = isPatternsStale(cachedSightingCount, currentSightingCount);

  return {
    timeDistribution,
    moodCorrelation,
    activityCorrelation,
    frequencyTrend,
    isStale,
    lastComputedAt,
    sightingCount: cachedSightingCount ?? 0,
  };
}

/**
 * Cache computed patterns for a user.
 * Uses upsert to update existing insights or insert new ones.
 */
export async function cachePatterns(
  userId: string,
  patterns: ComputedPatterns
): Promise<void> {
  const allInsights: PatternInsight[] = [
    ...patterns.timeDistribution,
    ...patterns.moodCorrelation,
    ...patterns.activityCorrelation,
    ...patterns.frequencyTrend,
  ];

  // Delete existing patterns for this user, then insert new ones
  // This is simpler than trying to upsert each one individually
  await db
    .delete(userPatternInsights)
    .where(eq(userPatternInsights.userId, userId));

  if (allInsights.length === 0) {
    return;
  }

  // Insert all new patterns
  await db.insert(userPatternInsights).values(
    allInsights.map((insight) => ({
      userId,
      insightType: insight.type,
      insightKey: insight.key,
      insightValue: insight.value,
      computedAt: insight.computedAt,
      sightingCountAtComputation: insight.sightingCountAtComputation,
    }))
  );
}

/**
 * Clear cached patterns for a user.
 */
export async function clearCachedPatterns(userId: string): Promise<void> {
  await db
    .delete(userPatternInsights)
    .where(eq(userPatternInsights.userId, userId));
}
