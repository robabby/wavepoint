/**
 * Transit calculation functions.
 *
 * Calculates which transiting planets are currently aspecting
 * points in a user's natal chart.
 */

import { ASPECT_META, type CelestialBodyId, type AngleId } from "@/lib/astrology/constants";
import type { DashboardCosmicContext } from "@/lib/signal/cosmic-context";
import {
  type Transit,
  type TransitOrbs,
  type StoredChartData,
  DEFAULT_TRANSIT_ORBS,
  TRANSIT_ASPECTS,
  TRANSITING_PLANETS,
  NATAL_POINTS,
} from "./types";

/**
 * Get the longitude of a point from cosmic context.
 */
function getTransitLongitude(
  context: DashboardCosmicContext,
  planet: CelestialBodyId
): number | null {
  const planetData = context[planet as keyof DashboardCosmicContext];
  if (!planetData || typeof planetData !== "object") return null;

  // Cosmic context stores sign + degree, need to calculate absolute longitude
  const data = planetData as { sign: string; degree?: number };
  if (!data.sign) return null;

  const signIndex = getSignIndex(data.sign);
  if (signIndex === -1) return null;

  const degree = data.degree ?? 0;
  return signIndex * 30 + degree;
}

/**
 * Get the longitude of a natal point from stored chart data.
 */
function getNatalLongitude(
  chartData: StoredChartData,
  point: CelestialBodyId | AngleId
): number | null {
  // Check planets
  const planet = chartData.planets[point];
  if (planet?.position?.longitude !== undefined) {
    return planet.position.longitude;
  }

  // Check angles
  const angle = chartData.angles[point];
  if (angle?.position?.longitude !== undefined) {
    return angle.position.longitude;
  }

  return null;
}

/**
 * Get zodiac sign index (0 = Aries, 11 = Pisces).
 */
function getSignIndex(sign: string): number {
  const signs = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo",
    "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
  ];
  return signs.indexOf(sign.toLowerCase());
}

/**
 * Calculate the angular distance between two longitudes.
 * Returns the shortest distance (0-180 degrees).
 */
function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Check if two longitudes form a specific aspect within orb.
 * Returns the actual orb if aspect is formed, or null if not.
 */
function checkAspect(
  transitLon: number,
  natalLon: number,
  aspectAngle: number,
  maxOrb: number
): number | null {
  const distance = angularDistance(transitLon, natalLon);
  const orb = Math.abs(distance - aspectAngle);

  if (orb <= maxOrb) {
    return Math.round(orb * 10) / 10; // Round to 1 decimal
  }

  return null;
}

/**
 * Calculate all current transits to a natal chart.
 *
 * @param cosmicContext - Current planetary positions
 * @param chartData - User's natal chart data (from spiritualProfiles.chartData)
 * @param orbs - Orb configuration (defaults to professional standards)
 * @returns Array of active transits, sorted by orb (tightest first)
 */
export function calculateTransits(
  cosmicContext: DashboardCosmicContext,
  chartData: StoredChartData,
  orbs: TransitOrbs = DEFAULT_TRANSIT_ORBS
): Transit[] {
  const transits: Transit[] = [];

  // Check each transiting planet
  for (const transitingPlanet of TRANSITING_PLANETS) {
    const transitLon = getTransitLongitude(cosmicContext, transitingPlanet);
    if (transitLon === null) continue;

    // Against each natal point
    for (const natalPoint of NATAL_POINTS) {
      const natalLon = getNatalLongitude(chartData, natalPoint);
      if (natalLon === null) continue;

      // Skip self-to-self (e.g., transit Sun to natal Sun) for outer planets
      // These are slow-moving return transits that would always be active
      if (transitingPlanet === natalPoint) continue;

      // Check each aspect type
      for (const aspectType of TRANSIT_ASPECTS) {
        const aspectAngle = ASPECT_META[aspectType].angle;
        const maxOrb = orbs[aspectType as keyof TransitOrbs] ?? 5;

        const orb = checkAspect(transitLon, natalLon, aspectAngle, maxOrb);
        if (orb !== null) {
          transits.push({
            transitingPlanet,
            natalPoint,
            aspectType,
            orb,
            isExact: orb <= 1,
          });
        }
      }
    }
  }

  // Sort by orb (tightest aspects first)
  return transits.sort((a, b) => a.orb - b.orb);
}

/**
 * Filter transits to only show the most significant ones.
 *
 * @param transits - All calculated transits
 * @param limit - Maximum number to return (default 10)
 * @returns Filtered transits prioritizing exact aspects and outer planets
 */
export function filterSignificantTransits(
  transits: Transit[],
  limit = 10
): Transit[] {
  // Prioritize:
  // 1. Exact transits (orb <= 1)
  // 2. Outer planet transits (slower = more significant)
  // 3. Transits to luminaries and angles

  const outerPlanets = new Set(["jupiter", "saturn", "uranus", "neptune", "pluto"]);
  const priorityNatalPoints = new Set(["sun", "moon", "ascendant", "midheaven"]);

  const scored = transits.map((t) => {
    let score = 0;
    if (t.isExact) score += 100;
    if (outerPlanets.has(t.transitingPlanet)) score += 50;
    if (priorityNatalPoints.has(t.natalPoint)) score += 30;
    score -= t.orb * 5; // Penalize wider orbs
    return { transit: t, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.transit);
}
