/**
 * Mood correlation pattern analysis.
 * Analyzes which moods appear with which numbers.
 */

import type {
  SightingForPattern,
  MoodCorrelationInsight,
  TopMoodForNumberInsight,
  NumbersForMoodInsight,
} from "./types";

const MIN_SIGHTINGS_FOR_CORRELATION = 5;
const TOP_N_NUMBERS = 3;

/**
 * Compute mood correlation patterns from sightings.
 * Returns top mood per number and numbers per mood insights.
 */
export function computeMoodCorrelation(
  sightings: SightingForPattern[],
  sightingCount: number
): MoodCorrelationInsight[] {
  // Filter to sightings with moods
  const sightingsWithMoods = sightings.filter(
    (s) => s.moodTags && s.moodTags.length > 0
  );

  if (sightingsWithMoods.length < MIN_SIGHTINGS_FOR_CORRELATION) {
    return [];
  }

  const now = new Date();
  const insights: MoodCorrelationInsight[] = [];

  // Build number -> mood counts
  const numberMoodCounts = new Map<string, Map<string, number>>();
  // Build mood -> number counts
  const moodNumberCounts = new Map<string, Map<string, number>>();

  for (const sighting of sightingsWithMoods) {
    const moods = sighting.moodTags ?? [];
    const number = sighting.number;

    // Initialize maps if needed
    if (!numberMoodCounts.has(number)) {
      numberMoodCounts.set(number, new Map());
    }

    for (const mood of moods) {
      // Number -> mood
      const moodMap = numberMoodCounts.get(number)!;
      moodMap.set(mood, (moodMap.get(mood) ?? 0) + 1);

      // Mood -> number
      if (!moodNumberCounts.has(mood)) {
        moodNumberCounts.set(mood, new Map());
      }
      const numberMap = moodNumberCounts.get(mood)!;
      numberMap.set(number, (numberMap.get(number) ?? 0) + 1);
    }
  }

  // Generate top mood per number (for top 3 most seen numbers)
  const numberTotals = new Map<string, number>();
  for (const sighting of sightingsWithMoods) {
    numberTotals.set(sighting.number, (numberTotals.get(sighting.number) ?? 0) + 1);
  }

  const topNumbers = [...numberTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N_NUMBERS)
    .map(([number]) => number);

  for (const number of topNumbers) {
    const moodMap = numberMoodCounts.get(number);
    if (!moodMap || moodMap.size === 0) continue;

    // Find top mood for this number
    let topMood = "";
    let topMoodCount = 0;
    for (const [mood, count] of moodMap) {
      if (count > topMoodCount) {
        topMood = mood;
        topMoodCount = count;
      }
    }

    if (topMood && topMoodCount > 0) {
      const numberSightingCount = numberTotals.get(number) ?? 0;
      const insight: TopMoodForNumberInsight = {
        type: "mood_correlation",
        key: `top_mood_${number}`,
        computedAt: now,
        sightingCountAtComputation: sightingCount,
        value: {
          number,
          mood: topMood,
          count: topMoodCount,
          percentage: Math.round((topMoodCount / numberSightingCount) * 100),
        },
      };
      insights.push(insight);
    }
  }

  // Generate numbers per mood (for moods with enough data)
  for (const [mood, numberMap] of moodNumberCounts) {
    const totalForMood = [...numberMap.values()].reduce((a, b) => a + b, 0);
    if (totalForMood < MIN_SIGHTINGS_FOR_CORRELATION) continue;

    const topNumbersForMood = [...numberMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N_NUMBERS)
      .map(([number, count]) => ({
        number,
        count,
        percentage: Math.round((count / totalForMood) * 100),
      }));

    if (topNumbersForMood.length > 0) {
      const insight: NumbersForMoodInsight = {
        type: "mood_correlation",
        key: `${mood}_numbers`,
        computedAt: now,
        sightingCountAtComputation: sightingCount,
        value: {
          mood,
          numbers: topNumbersForMood,
        },
      };
      insights.push(insight);
    }
  }

  return insights;
}
