/**
 * Transit calculation types.
 *
 * Transits occur when a currently-moving planet forms an aspect
 * to a point in the user's natal chart.
 */

import type { CelestialBodyId, AngleId, AspectType } from "@/lib/astrology/constants";

/**
 * A single transit aspect.
 */
export interface Transit {
  /** The transiting (currently moving) planet */
  transitingPlanet: CelestialBodyId;
  /** The natal point being aspected */
  natalPoint: CelestialBodyId | AngleId;
  /** Type of aspect formed */
  aspectType: AspectType;
  /** Actual orb in degrees */
  orb: number;
  /** Whether the transit is exact (within 1 degree) */
  isExact: boolean;
}

/**
 * Orb configuration for transit aspects.
 * Professional astrology standards use tighter orbs for transits than natal aspects.
 */
export interface TransitOrbs {
  conjunction: number;
  opposition: number;
  trine: number;
  square: number;
  sextile: number;
  quincunx: number;
}

/**
 * Default transit orbs - professional astrology standard.
 * Tighter than natal chart orbs since transits are time-sensitive.
 */
export const DEFAULT_TRANSIT_ORBS: TransitOrbs = {
  conjunction: 8,
  opposition: 8,
  trine: 6,
  square: 6,
  sextile: 4,
  quincunx: 3,
};

/**
 * Major aspects to check for transits.
 */
export const TRANSIT_ASPECTS: AspectType[] = [
  "conjunction",
  "opposition",
  "trine",
  "square",
  "sextile",
  "quincunx",
];

/**
 * Transiting planets to consider.
 * Ordered by speed (fastest to slowest).
 */
export const TRANSITING_PLANETS: CelestialBodyId[] = [
  "moon",
  "sun",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

/**
 * Natal points that can receive transits.
 * Includes planets and angles.
 */
export const NATAL_POINTS: (CelestialBodyId | AngleId)[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "ascendant",
  "midheaven",
];

/**
 * Stored chart data structure (from spiritualProfiles.chartData JSONB).
 * Contains the positions needed for transit calculations.
 */
export interface StoredChartData {
  planets: Record<
    string,
    {
      position: {
        longitude: number;
        sign: string;
        signDegrees: number;
      };
      isRetrograde?: boolean;
    }
  >;
  angles: Record<
    string,
    {
      position: {
        longitude: number;
        sign: string;
        signDegrees: number;
      };
    }
  >;
}
