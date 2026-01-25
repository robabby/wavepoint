/**
 * Type definitions for the Astrology module.
 *
 * Framework-agnostic types for birth charts and astrological calculations.
 */

import type {
  ZodiacSign,
  CelestialBodyId,
  AspectType,
  HouseSystem,
  ZodiacSystem,
  AngleId,
} from "./constants";

/**
 * Geographic location for chart calculation
 */
export interface GeoLocation {
  /** Latitude in decimal degrees (-90 to 90) */
  latitude: number;
  /** Longitude in decimal degrees (-180 to 180) */
  longitude: number;
  /** Optional location name for display */
  name?: string;
}

/**
 * Birth data required to calculate a natal chart
 */
export interface BirthData {
  /** Birth year (CE only, >= 1) */
  year: number;
  /** Birth month (1-12, NOT 0-indexed) */
  month: number;
  /** Birth day of month (1-31) */
  day: number;
  /** Birth hour in 24-hour format (0-23) */
  hour: number;
  /** Birth minute (0-59) */
  minute: number;
  /** Birth second (0-59), defaults to 0 */
  second?: number;
  /** Birth location */
  location: GeoLocation;
}

/**
 * Degrees broken into components (degrees, minutes, seconds)
 */
export interface ArcDegrees {
  /** Whole degrees (0-359) */
  degrees: number;
  /** Arc minutes (0-59) */
  minutes: number;
  /** Arc seconds (0-59) */
  seconds: number;
}

/**
 * Position along the ecliptic (zodiac wheel)
 */
export interface EclipticPosition {
  /** Total degrees from 0 Aries (0-360) */
  longitude: number;
  /** Degrees within the sign (0-30) */
  signDegrees: number;
  /** The zodiac sign */
  sign: ZodiacSign;
  /** Arc degrees breakdown */
  arc: ArcDegrees;
  /** Formatted as "15 30' 45''" */
  formatted: string;
  /** Formatted with sign: "15 30' Gemini" */
  formattedWithSign: string;
}

/**
 * A celestial body's position in the chart
 */
export interface PlanetPosition {
  /** Planet identifier */
  id: CelestialBodyId;
  /** Display name */
  name: string;
  /** Glyph/symbol */
  glyph: string;
  /** Position on the ecliptic */
  position: EclipticPosition;
  /** Whether the planet is in apparent retrograde motion */
  isRetrograde: boolean;
  /** House number this planet occupies (1-12) */
  house: number;
}

/**
 * A major angle in the chart (Ascendant, Midheaven)
 */
export interface AnglePosition {
  /** Angle identifier */
  id: AngleId;
  /** Display name */
  name: string;
  /** Position on the ecliptic */
  position: EclipticPosition;
}

/**
 * A house cusp (beginning of a house)
 */
export interface HouseCusp {
  /** House number (1-12) */
  number: number;
  /** Position where the house begins */
  position: EclipticPosition;
  /** The sign ruling this house */
  sign: ZodiacSign;
}

/**
 * An aspect between two points in the chart
 */
export interface Aspect {
  /** First point (typically the faster planet) */
  point1: {
    id: string;
    name: string;
  };
  /** Second point */
  point2: {
    id: string;
    name: string;
  };
  /** Type of aspect */
  type: AspectType;
  /** Display name (e.g., "Conjunction") */
  typeName: string;
  /** Symbol for the aspect */
  symbol: string;
  /** Exact angle of aspect (e.g., 0, 90, 120) */
  exactAngle: number;
  /** Actual orb in degrees */
  orb: number;
  /** Whether the aspect is applying (getting closer) or separating */
  isApplying: boolean;
  /** Nature of the aspect */
  nature: "harmonious" | "challenging" | "neutral";
}

/**
 * Configuration options for chart calculation
 */
export interface ChartOptions {
  /** House system to use */
  houseSystem?: HouseSystem;
  /** Zodiac system (tropical or sidereal) */
  zodiacSystem?: ZodiacSystem;
  /** Which aspect types to calculate */
  aspectTypes?: ("major" | "minor")[];
  /** Custom orbs for aspects (overrides defaults) */
  customOrbs?: Partial<Record<AspectType, number>>;
  /** Language for labels */
  language?: string;
}

/**
 * Complete natal chart calculation result
 */
export interface ChartResult {
  /** Original birth data used for calculation */
  birthData: BirthData;
  /** Options used for this calculation */
  options: Required<Omit<ChartOptions, "customOrbs">> & { customOrbs?: ChartOptions["customOrbs"] };

  /** Sun sign (convenient accessor) */
  sunSign: ZodiacSign;
  /** Moon sign (convenient accessor) */
  moonSign: ZodiacSign;
  /** Rising sign / Ascendant sign (convenient accessor) */
  risingSign: ZodiacSign;

  /** All planetary positions */
  planets: Record<CelestialBodyId, PlanetPosition>;
  /** Ordered array of planets for iteration */
  planetList: PlanetPosition[];

  /** Major angles (Ascendant, Midheaven) */
  angles: Record<AngleId, AnglePosition>;

  /** House cusps (1-12) */
  houses: HouseCusp[];

  /** All calculated aspects */
  aspects: {
    /** All aspects in a flat array */
    all: Aspect[];
    /** Aspects organized by type */
    byType: Partial<Record<AspectType, Aspect[]>>;
    /** Aspects organized by planet */
    byPlanet: Partial<Record<string, Aspect[]>>;
  };

  /** Raw ephemeris data (for debugging/verification) */
  _raw?: unknown;
}

/**
 * Summary of key chart placements for display
 */
export interface ChartSummary {
  /** Sun sign */
  sun: { sign: ZodiacSign; degree: string };
  /** Moon sign */
  moon: { sign: ZodiacSign; degree: string };
  /** Rising/Ascendant sign */
  rising: { sign: ZodiacSign; degree: string };
  /** Mercury sign */
  mercury: { sign: ZodiacSign; degree: string };
  /** Venus sign */
  venus: { sign: ZodiacSign; degree: string };
  /** Mars sign */
  mars: { sign: ZodiacSign; degree: string };
}
