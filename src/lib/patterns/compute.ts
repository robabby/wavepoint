/**
 * Pattern computation orchestrator.
 * Coordinates all pattern analysis and returns combined results.
 */

import type {
  SightingForPattern,
  ComputedPatterns,
  TimeDistributionInsight,
  MoodCorrelationInsight,
  ActivityCorrelationInsight,
  FrequencyTrendInsight,
} from "./types";
import { computeTimeDistribution } from "./time";
import { computeMoodCorrelation } from "./mood";
import { computeActivityCorrelation } from "./activity";
import { computeFrequencyTrends } from "./trends";

/**
 * Compute all pattern insights from sightings data.
 * This is the main entry point for pattern computation.
 */
export function computeAllPatterns(
  sightings: SightingForPattern[],
  sightingCount: number
): ComputedPatterns {
  const now = new Date();

  // Compute each pattern type
  const timeDistribution = computeTimeDistribution(
    sightings,
    sightingCount
  ) as TimeDistributionInsight[];

  const moodCorrelation = computeMoodCorrelation(
    sightings,
    sightingCount
  ) as MoodCorrelationInsight[];

  const activityCorrelation = computeActivityCorrelation(
    sightings,
    sightingCount
  ) as ActivityCorrelationInsight[];

  const frequencyTrend = computeFrequencyTrends(
    sightings,
    sightingCount
  ) as FrequencyTrendInsight[];

  return {
    timeDistribution,
    moodCorrelation,
    activityCorrelation,
    frequencyTrend,
    isStale: false,
    lastComputedAt: now,
    sightingCount,
  };
}
