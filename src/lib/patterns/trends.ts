/**
 * Frequency trend pattern analysis.
 * Analyzes sighting frequency over time.
 */

import type {
  SightingForPattern,
  FrequencyTrendInsight,
  OverallTrendInsight,
  WeeklyTrendInsight,
} from "./types";

const TREND_THRESHOLD = 10; // Percentage change needed to be considered increasing/decreasing
const TOP_N_NUMBERS_FOR_TREND = 3;

/**
 * Determine trend direction based on percentage change.
 */
function getTrendDirection(
  current: number,
  previous: number
): "increasing" | "decreasing" | "stable" {
  if (previous === 0) {
    return current > 0 ? "increasing" : "stable";
  }
  const change = ((current - previous) / previous) * 100;
  if (change > TREND_THRESHOLD) return "increasing";
  if (change < -TREND_THRESHOLD) return "decreasing";
  return "stable";
}

/**
 * Calculate percentage change between two values.
 */
function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Compute frequency trend patterns from sightings.
 * Returns overall trend and per-number weekly trends.
 */
export function computeFrequencyTrends(
  sightings: SightingForPattern[],
  sightingCount: number
): FrequencyTrendInsight[] {
  if (sightings.length === 0) {
    return [];
  }

  const now = new Date();
  const insights: FrequencyTrendInsight[] = [];

  // Calculate time boundaries
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // Filter sightings by time period
  const last7Days = sightings.filter(
    (s) => new Date(s.timestamp) >= sevenDaysAgo
  );
  const previous7Days = sightings.filter(
    (s) =>
      new Date(s.timestamp) >= fourteenDaysAgo &&
      new Date(s.timestamp) < sevenDaysAgo
  );

  // Overall trend
  const last7Count = last7Days.length;
  const prev7Count = previous7Days.length;
  const overallTrend = getTrendDirection(last7Count, prev7Count);
  const overallChange = getPercentageChange(last7Count, prev7Count);
  const avgPerDay = Math.round((last7Count / 7) * 10) / 10;

  const overallInsight: OverallTrendInsight = {
    type: "frequency_trend",
    key: "overall_trend",
    computedAt: now,
    sightingCountAtComputation: sightingCount,
    value: {
      last7Days: last7Count,
      previous7Days: prev7Count,
      trend: overallTrend,
      percentageChange: overallChange,
      averagePerDay: avgPerDay,
    },
  };
  insights.push(overallInsight);

  // Per-number trends for top numbers
  const numberCounts = new Map<string, number>();
  for (const sighting of sightings) {
    numberCounts.set(sighting.number, (numberCounts.get(sighting.number) ?? 0) + 1);
  }

  const topNumbers = [...numberCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N_NUMBERS_FOR_TREND)
    .map(([number]) => number);

  for (const number of topNumbers) {
    const numLast7 = last7Days.filter((s) => s.number === number).length;
    const numPrev7 = previous7Days.filter((s) => s.number === number).length;

    // Only include if there's been activity in either period
    if (numLast7 === 0 && numPrev7 === 0) continue;

    const trend = getTrendDirection(numLast7, numPrev7);
    const change = getPercentageChange(numLast7, numPrev7);

    const weeklyInsight: WeeklyTrendInsight = {
      type: "frequency_trend",
      key: `${number}_weekly_trend`,
      computedAt: now,
      sightingCountAtComputation: sightingCount,
      value: {
        number,
        currentWeekCount: numLast7,
        previousWeekCount: numPrev7,
        trend,
        percentageChange: change,
      },
    };
    insights.push(weeklyInsight);
  }

  return insights;
}
