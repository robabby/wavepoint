/**
 * Time distribution pattern analysis.
 * Analyzes when sightings occur (peak hours, days of week).
 */

import type {
  SightingForPattern,
  TimeDistributionInsight,
  PeakHourInsight,
  DayOfWeekInsight,
} from "./types";

const HOUR_LABELS = [
  "12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am",
  "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm",
];

const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

/**
 * Compute time distribution patterns from sightings.
 * Returns peak hour and day of week insights.
 */
export function computeTimeDistribution(
  sightings: SightingForPattern[],
  sightingCount: number
): TimeDistributionInsight[] {
  if (sightings.length === 0) {
    return [];
  }

  const now = new Date();
  const insights: TimeDistributionInsight[] = [];

  // Count by hour (0-23)
  const hourCounts = new Map<number, number>();
  for (let h = 0; h < 24; h++) {
    hourCounts.set(h, 0);
  }

  // Count by day of week (0-6, Sunday = 0)
  const dayCounts = new Map<number, number>();
  for (let d = 0; d < 7; d++) {
    dayCounts.set(d, 0);
  }

  for (const sighting of sightings) {
    const date = new Date(sighting.timestamp);
    const hour = date.getHours();
    const day = date.getDay();

    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }

  // Find peak hour
  let peakHour = 0;
  let peakHourCount = 0;
  for (const [hour, count] of hourCounts) {
    if (count > peakHourCount) {
      peakHour = hour;
      peakHourCount = count;
    }
  }

  if (peakHourCount > 0) {
    const peakHourInsight: PeakHourInsight = {
      type: "time_distribution",
      key: "peak_hour",
      computedAt: now,
      sightingCountAtComputation: sightingCount,
      value: {
        hour: peakHour,
        count: peakHourCount,
        percentage: Math.round((peakHourCount / sightings.length) * 100),
        label: HOUR_LABELS[peakHour] ?? `${peakHour}:00`,
      },
    };
    insights.push(peakHourInsight);
  }

  // Find peak day of week
  let peakDay = 0;
  let peakDayCount = 0;
  for (const [day, count] of dayCounts) {
    if (count > peakDayCount) {
      peakDay = day;
      peakDayCount = count;
    }
  }

  if (peakDayCount > 0) {
    const dayOfWeekInsight: DayOfWeekInsight = {
      type: "time_distribution",
      key: "day_of_week",
      computedAt: now,
      sightingCountAtComputation: sightingCount,
      value: {
        day: peakDay,
        dayName: DAY_NAMES[peakDay] ?? "Unknown",
        count: peakDayCount,
        percentage: Math.round((peakDayCount / sightings.length) * 100),
      },
    };
    insights.push(dayOfWeekInsight);
  }

  return insights;
}
