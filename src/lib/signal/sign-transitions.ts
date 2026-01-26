/**
 * Sign transition calculations for luminaries (Sun and Moon).
 *
 * Uses binary search to find the exact moment when a body enters
 * the next zodiac sign, with ±1 minute accuracy.
 */

import { calculateChart } from "@/lib/astrology/chart";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/astrology/constants";
import type { SignTransition } from "./cosmic-context";

/**
 * Greenwich location for calculations
 * Planetary positions are global - location only affects houses/angles
 */
const GREENWICH = {
  latitude: 51.4772,
  longitude: 0,
  name: "Greenwich",
};

/**
 * Average daily motion in degrees
 */
const DEGREES_PER_DAY = {
  moon: 13.2, // ~12-15° per day
  sun: 1.0, // ~1° per day
} as const;

/**
 * Maximum days to search ahead for transition
 */
const MAX_SEARCH_DAYS = {
  moon: 3, // Moon changes sign every ~2.5 days
  sun: 32, // Sun changes sign every ~30 days
} as const;

/**
 * Get the longitude of a celestial body at a given timestamp.
 */
function getLongitude(body: "sun" | "moon", timestamp: Date): number {
  const chart = calculateChart({
    year: timestamp.getUTCFullYear(),
    month: timestamp.getUTCMonth() + 1,
    day: timestamp.getUTCDate(),
    hour: timestamp.getUTCHours(),
    minute: timestamp.getUTCMinutes(),
    second: timestamp.getUTCSeconds(),
    location: GREENWICH,
  });

  const planet = chart.planets[body];
  return planet?.position.longitude ?? 0;
}

/**
 * Get the zodiac sign from an ecliptic longitude.
 */
function getSignFromLongitude(longitude: number): ZodiacSign {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  return ZODIAC_SIGNS[signIndex]!;
}

/**
 * Get the next zodiac sign after a given sign.
 */
function getNextSign(sign: ZodiacSign): ZodiacSign {
  const currentIndex = ZODIAC_SIGNS.indexOf(sign);
  const nextIndex = (currentIndex + 1) % 12;
  return ZODIAC_SIGNS[nextIndex]!;
}

/**
 * Calculate when a luminary enters the next zodiac sign.
 *
 * Uses binary search for ±1 minute accuracy with ~5-10 ephemeris calculations.
 *
 * @param body - "sun" or "moon"
 * @param currentLongitude - Current ecliptic longitude
 * @param fromDate - Starting date for calculation
 * @returns Sign transition info, or null if calculation fails
 */
export function calculateNextSignTransition(
  body: "sun" | "moon",
  currentLongitude: number,
  fromDate: Date
): SignTransition | null {
  try {
    const currentSign = getSignFromLongitude(currentLongitude);
    const nextSign = getNextSign(currentSign);

    // Calculate degrees remaining in current sign
    const degreesInSign = currentLongitude % 30;
    const degreesRemaining = 30 - degreesInSign;

    // Estimate time to next sign based on average speed
    const degreesPerDay = DEGREES_PER_DAY[body];
    const estimatedDays = degreesRemaining / degreesPerDay;

    // Set up search bounds
    // Start slightly before estimate (body might be moving faster than average)
    const earlyFactor = 0.8;
    // End with some buffer after estimate
    const lateFactor = 1.5;

    let lowMs = fromDate.getTime() + estimatedDays * earlyFactor * 24 * 60 * 60 * 1000;
    let highMs = fromDate.getTime() + estimatedDays * lateFactor * 24 * 60 * 60 * 1000;

    // Clamp high to max search days
    const maxMs = fromDate.getTime() + MAX_SEARCH_DAYS[body] * 24 * 60 * 60 * 1000;
    highMs = Math.min(highMs, maxMs);

    // Ensure low starts from at least now
    lowMs = Math.max(lowMs, fromDate.getTime());

    // Verify low is in current sign, high is in next sign
    // Adjust bounds if needed
    let lowSign = getSignFromLongitude(getLongitude(body, new Date(lowMs)));
    let highSign = getSignFromLongitude(getLongitude(body, new Date(highMs)));

    // If low is already past current sign, transition already happened
    if (lowSign !== currentSign) {
      // Start from now instead
      lowMs = fromDate.getTime();
      lowSign = currentSign;
    }

    // If high isn't in next sign yet, extend it
    let iterations = 0;
    while (highSign !== nextSign && iterations < 5) {
      highMs += estimatedDays * 0.5 * 24 * 60 * 60 * 1000;
      if (highMs > maxMs) {
        // Can't find transition within search window
        return null;
      }
      highSign = getSignFromLongitude(getLongitude(body, new Date(highMs)));
      iterations++;
    }

    if (highSign !== nextSign) {
      return null;
    }

    // Binary search for exact transition (±1 minute accuracy)
    // 1 minute = 60,000 ms
    const targetPrecisionMs = 60 * 1000;

    while (highMs - lowMs > targetPrecisionMs) {
      const midMs = Math.floor((lowMs + highMs) / 2);
      const midSign = getSignFromLongitude(getLongitude(body, new Date(midMs)));

      if (midSign === currentSign) {
        // Still in current sign, transition is after mid
        lowMs = midMs;
      } else {
        // Already in next sign, transition is before mid
        highMs = midMs;
      }
    }

    // Return the high bound (first moment in new sign)
    return {
      nextSign,
      timestamp: new Date(highMs).toISOString(),
    };
  } catch (error) {
    console.error(`Error calculating ${body} sign transition:`, error);
    return null;
  }
}
