/**
 * Activity correlation pattern analysis.
 * Analyzes which numbers appear during which activities.
 */

import type {
  SightingForPattern,
  ActivityCorrelationInsight,
  NumbersForActivityInsight,
  TopActivityForNumberInsight,
} from "./types";

const MIN_SIGHTINGS_FOR_CORRELATION = 5;
const TOP_N_NUMBERS = 3;

/**
 * Compute activity correlation patterns from sightings.
 * Returns numbers per activity and top activity per number insights.
 */
export function computeActivityCorrelation(
  sightings: SightingForPattern[],
  sightingCount: number
): ActivityCorrelationInsight[] {
  // Filter to sightings with activities
  const sightingsWithActivity = sightings.filter((s) => s.activity);

  if (sightingsWithActivity.length < MIN_SIGHTINGS_FOR_CORRELATION) {
    return [];
  }

  const now = new Date();
  const insights: ActivityCorrelationInsight[] = [];

  // Build activity -> number counts
  const activityNumberCounts = new Map<string, Map<string, number>>();
  // Build number -> activity counts
  const numberActivityCounts = new Map<string, Map<string, number>>();

  for (const sighting of sightingsWithActivity) {
    const activity = sighting.activity!;
    const number = sighting.number;

    // Activity -> number
    if (!activityNumberCounts.has(activity)) {
      activityNumberCounts.set(activity, new Map());
    }
    const numberMap = activityNumberCounts.get(activity)!;
    numberMap.set(number, (numberMap.get(number) ?? 0) + 1);

    // Number -> activity
    if (!numberActivityCounts.has(number)) {
      numberActivityCounts.set(number, new Map());
    }
    const activityMap = numberActivityCounts.get(number)!;
    activityMap.set(activity, (activityMap.get(activity) ?? 0) + 1);
  }

  // Generate numbers per activity
  for (const [activity, numberMap] of activityNumberCounts) {
    const totalForActivity = [...numberMap.values()].reduce((a, b) => a + b, 0);
    if (totalForActivity < MIN_SIGHTINGS_FOR_CORRELATION) continue;

    const topNumbers = [...numberMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N_NUMBERS)
      .map(([number, count]) => ({
        number,
        count,
        percentage: Math.round((count / totalForActivity) * 100),
      }));

    if (topNumbers.length > 0) {
      const insight: NumbersForActivityInsight = {
        type: "activity_correlation",
        key: `${activity}_numbers`,
        computedAt: now,
        sightingCountAtComputation: sightingCount,
        value: {
          activity,
          numbers: topNumbers,
        },
      };
      insights.push(insight);
    }
  }

  // Generate top activity per number (for top 3 most seen numbers with activity)
  const numberTotals = new Map<string, number>();
  for (const sighting of sightingsWithActivity) {
    numberTotals.set(sighting.number, (numberTotals.get(sighting.number) ?? 0) + 1);
  }

  const topNumbers = [...numberTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N_NUMBERS)
    .map(([number]) => number);

  for (const number of topNumbers) {
    const activityMap = numberActivityCounts.get(number);
    if (!activityMap || activityMap.size === 0) continue;

    // Find top activity for this number
    let topActivity = "";
    let topActivityCount = 0;
    for (const [activity, count] of activityMap) {
      if (count > topActivityCount) {
        topActivity = activity;
        topActivityCount = count;
      }
    }

    if (topActivity && topActivityCount > 0) {
      const numberSightingCount = numberTotals.get(number) ?? 0;
      const insight: TopActivityForNumberInsight = {
        type: "activity_correlation",
        key: `top_activity_${number}`,
        computedAt: now,
        sightingCountAtComputation: sightingCount,
        value: {
          number,
          activity: topActivity,
          count: topActivityCount,
          percentage: Math.round((topActivityCount / numberSightingCount) * 100),
        },
      };
      insights.push(insight);
    }
  }

  return insights;
}
