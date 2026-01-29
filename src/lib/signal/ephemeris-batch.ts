/**
 * Batch ephemeris computation for calendar month views.
 *
 * Pre-computes sign transition timelines for the full date range,
 * then looks up per day — reducing ~1,050 chart calculations to ~270.
 */

import { calculateChart } from "@/lib/astrology/chart";
import { buildDashboardContext } from "./cosmic-context";
import { calculateNextSignTransition } from "./sign-transitions";
import type { SignTransition, DashboardCosmicContext } from "./cosmic-context";

/**
 * Greenwich location for calculations.
 */
const GREENWICH = {
  latitude: 51.4772,
  longitude: 0,
  name: "Greenwich",
};

/**
 * Get a Date object representing noon on a given date in a specific timezone.
 */
export function getNoonInTimezone(dateStr: string, timezone: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date(`${dateStr}T12:00:00Z`);
  }

  const noonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    hour12: false,
  });

  try {
    const hourInTz = parseInt(formatter.format(noonUtc), 10);
    const offsetHours = 12 - hourInTz;
    return new Date(noonUtc.getTime() + offsetHours * 60 * 60 * 1000);
  } catch {
    return noonUtc;
  }
}

/**
 * A timeline of sign transitions for a celestial body.
 */
interface TransitionEvent {
  timestamp: string; // ISO UTC
  nextSign: string;
}

/**
 * Build a timeline of all sign transitions for a body across a date range.
 * Chains `calculateNextSignTransition` calls sequentially from start to end.
 */
function computeTransitionTimeline(
  body: "sun" | "moon",
  startDate: Date,
  endDate: Date,
): TransitionEvent[] {
  const timeline: TransitionEvent[] = [];
  // Extend search past endDate to cover last day's lookup
  const searchEndMs = endDate.getTime() + 3 * 24 * 60 * 60 * 1000;

  let currentDate = new Date(startDate);

  while (currentDate.getTime() < searchEndMs) {
    // Get current longitude
    const chart = calculateChart({
      year: currentDate.getUTCFullYear(),
      month: currentDate.getUTCMonth() + 1,
      day: currentDate.getUTCDate(),
      hour: currentDate.getUTCHours(),
      minute: currentDate.getUTCMinutes(),
      second: currentDate.getUTCSeconds(),
      location: GREENWICH,
    });

    const longitude = chart.planets[body]?.position.longitude ?? 0;
    const transition = calculateNextSignTransition(body, longitude, currentDate);

    if (!transition) break;

    const transitionTime = new Date(transition.timestamp);
    if (transitionTime.getTime() > searchEndMs) break;

    timeline.push({
      timestamp: transition.timestamp,
      nextSign: transition.nextSign,
    });

    // Advance to just after the transition for the next iteration
    currentDate = new Date(transitionTime.getTime() + 60 * 1000);
  }

  return timeline;
}

/**
 * Look up the next transition after a given date from a pre-computed timeline.
 */
function lookupTransition(
  timeline: TransitionEvent[],
  queryDate: Date,
): SignTransition | null {
  const queryMs = queryDate.getTime();
  for (const event of timeline) {
    if (new Date(event.timestamp).getTime() > queryMs) {
      return {
        nextSign: event.nextSign as SignTransition["nextSign"],
        timestamp: event.timestamp,
      };
    }
  }
  return null;
}

/**
 * Calculate ephemeris for a batch of date keys using pre-computed transition timelines.
 *
 * @param dateKeys - Array of YYYY-MM-DD strings
 * @param timezone - IANA timezone string
 * @returns Map of date key to DashboardCosmicContext
 */
export function calculateBatchEphemeris(
  dateKeys: string[],
  timezone: string,
): Record<string, DashboardCosmicContext> {
  if (dateKeys.length === 0) return {};

  // Compute noon timestamps for range bounds
  const firstNoon = getNoonInTimezone(dateKeys[0]!, timezone);
  const lastNoon = getNoonInTimezone(dateKeys[dateKeys.length - 1]!, timezone);

  // Pre-compute transition timelines
  const moonTimeline = computeTransitionTimeline("moon", firstNoon, lastNoon);
  const sunTimeline = computeTransitionTimeline("sun", firstNoon, lastNoon);

  // Compute each day using the pre-computed timelines
  const results: Record<string, DashboardCosmicContext> = {};

  for (const dateKey of dateKeys) {
    const noonLocal = getNoonInTimezone(dateKey, timezone);

    const chart = calculateChart({
      year: noonLocal.getUTCFullYear(),
      month: noonLocal.getUTCMonth() + 1,
      day: noonLocal.getUTCDate(),
      hour: noonLocal.getUTCHours(),
      minute: noonLocal.getUTCMinutes(),
      second: noonLocal.getUTCSeconds(),
      location: GREENWICH,
    });

    const moonTransition = lookupTransition(moonTimeline, noonLocal);
    const sunTransition = lookupTransition(sunTimeline, noonLocal);

    results[dateKey] = buildDashboardContext(chart, noonLocal, moonTransition, sunTransition);
  }

  return results;
}
