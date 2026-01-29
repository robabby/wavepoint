/**
 * Cosmic context for Signal sightings.
 *
 * Calculates planetary positions at the moment of a sighting capture.
 * Uses the astrology chart library with a Greenwich location (planetary
 * positions are global - only houses/angles require true location).
 */

import { calculateChart } from "@/lib/astrology/chart";
import { PLANET_META, ZODIAC_META, ASPECT_META } from "@/lib/astrology/constants";
import type { ZodiacSign, AspectType } from "@/lib/astrology/constants";

// =============================================================================
// Types
// =============================================================================

/**
 * Moon phase - 8 phases based on Sun-Moon angle (45° each)
 */
export type MoonPhase =
  | "new_moon"
  | "waxing_crescent"
  | "first_quarter"
  | "waxing_gibbous"
  | "full_moon"
  | "waning_gibbous"
  | "last_quarter"
  | "waning_crescent";

/**
 * Planet position context
 */
export interface PlanetContext {
  sign: ZodiacSign;
  degree: number; // 0-29.99 within sign
  isRetrograde?: boolean; // Mercury, Venus, Mars only
}

/**
 * Cosmic aspect between two planets (tight orb only)
 */
export interface CosmicAspect {
  planet1: string; // "sun", "moon", etc.
  planet2: string;
  type: AspectType;
  orb: number; // Actual orb in degrees
}

/**
 * Complete cosmic context at moment of sighting
 */
export interface CosmicContext {
  sun: PlanetContext;
  moon: PlanetContext & { phase: MoonPhase };
  mercury: PlanetContext;
  venus: PlanetContext;
  mars: PlanetContext;
  jupiter: Pick<PlanetContext, "sign">;
  saturn: Pick<PlanetContext, "sign">;
  aspects: CosmicAspect[];
  calculatedAt: string; // ISO timestamp
}

/**
 * Sign transition info - when a luminary enters a new sign
 */
export interface SignTransition {
  nextSign: ZodiacSign;
  timestamp: string; // ISO UTC timestamp
}

/**
 * Extended cosmic context for dashboard display.
 * Includes generational planets and sign transitions.
 */
export interface DashboardCosmicContext extends Omit<CosmicContext, "jupiter" | "saturn"> {
  // Social planets with degree info for dashboard
  jupiter: PlanetContext;
  saturn: PlanetContext;
  // Generational planets (sign only)
  uranus: Pick<PlanetContext, "sign">;
  neptune: Pick<PlanetContext, "sign">;
  pluto: Pick<PlanetContext, "sign">;
  // Sign transitions for luminaries
  transitions: {
    moon: SignTransition | null;
    sun: SignTransition | null;
  };
  // Lunar elongation (Sun-Moon angle, 0-360°)
  // 0° = New Moon peak, 180° = Full Moon peak
  lunarElongation: number;
}

// =============================================================================
// Constants
// =============================================================================

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
 * Maximum orb for aspects to include (tight aspects only)
 */
const MAX_ASPECT_ORB = 2;

/**
 * Moon phase emojis
 */
const MOON_PHASE_EMOJI: Record<MoonPhase, string> = {
  new_moon: "🌑",
  waxing_crescent: "🌒",
  first_quarter: "🌓",
  waxing_gibbous: "🌔",
  full_moon: "🌕",
  waning_gibbous: "🌖",
  last_quarter: "🌗",
  waning_crescent: "🌘",
};

/**
 * Moon phase display names
 */
const MOON_PHASE_NAMES: Record<MoonPhase, string> = {
  new_moon: "New Moon",
  waxing_crescent: "Waxing Crescent",
  first_quarter: "First Quarter",
  waxing_gibbous: "Waxing Gibbous",
  full_moon: "Full Moon",
  waning_gibbous: "Waning Gibbous",
  last_quarter: "Last Quarter",
  waning_crescent: "Waning Crescent",
};

// =============================================================================
// Calculation functions
// =============================================================================

/**
 * Calculate moon phase from Sun-Moon angle.
 *
 * Divides the 360° cycle into 8 phases of 45° each:
 * - New Moon: 0°-22.5° and 337.5°-360°
 * - Waxing Crescent: 22.5°-67.5°
 * - First Quarter: 67.5°-112.5°
 * - Waxing Gibbous: 112.5°-157.5°
 * - Full Moon: 157.5°-202.5°
 * - Waning Gibbous: 202.5°-247.5°
 * - Last Quarter: 247.5°-292.5°
 * - Waning Crescent: 292.5°-337.5°
 */
export function calculateMoonPhase(sunLon: number, moonLon: number): MoonPhase {
  // Calculate Moon's angle ahead of Sun (0-360)
  const angle = ((moonLon - sunLon + 360) % 360);

  if (angle < 22.5 || angle >= 337.5) return "new_moon";
  if (angle < 67.5) return "waxing_crescent";
  if (angle < 112.5) return "first_quarter";
  if (angle < 157.5) return "waxing_gibbous";
  if (angle < 202.5) return "full_moon";
  if (angle < 247.5) return "waning_gibbous";
  if (angle < 292.5) return "last_quarter";
  return "waning_crescent";
}

/**
 * Calculate cosmic context for a given timestamp.
 *
 * @param timestamp - The moment to calculate for (defaults to now)
 * @returns The cosmic context with planetary positions and aspects
 */
export function calculateCosmicContext(timestamp: Date = new Date()): CosmicContext {
  // Calculate chart for Greenwich at the given timestamp
  const chart = calculateChart({
    year: timestamp.getUTCFullYear(),
    month: timestamp.getUTCMonth() + 1, // 1-indexed
    day: timestamp.getUTCDate(),
    hour: timestamp.getUTCHours(),
    minute: timestamp.getUTCMinutes(),
    second: timestamp.getUTCSeconds(),
    location: GREENWICH,
  });

  // Extract planet contexts
  const sunPos = chart.planets.sun;
  const moonPos = chart.planets.moon;
  const mercuryPos = chart.planets.mercury;
  const venusPos = chart.planets.venus;
  const marsPos = chart.planets.mars;
  const jupiterPos = chart.planets.jupiter;
  const saturnPos = chart.planets.saturn;

  // Calculate moon phase
  const sunLon = sunPos?.position.longitude ?? 0;
  const moonLon = moonPos?.position.longitude ?? 0;
  const moonPhase = calculateMoonPhase(sunLon, moonLon);

  // Filter for tight aspects (orb <= 2°) between personal planets
  const personalPlanets = new Set(["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"]);
  const tightAspects: CosmicAspect[] = chart.aspects.all
    .filter((aspect) => {
      // Check orb is tight
      if (aspect.orb > MAX_ASPECT_ORB) return false;
      // Check both points are personal planets
      const p1 = aspect.point1.id.toLowerCase();
      const p2 = aspect.point2.id.toLowerCase();
      return personalPlanets.has(p1) && personalPlanets.has(p2);
    })
    .map((aspect) => ({
      planet1: aspect.point1.id.toLowerCase(),
      planet2: aspect.point2.id.toLowerCase(),
      type: aspect.type,
      orb: Math.round(aspect.orb * 10) / 10, // Round to 1 decimal
    }));

  return {
    sun: {
      sign: sunPos?.position.sign ?? "aries",
      degree: Math.round((sunPos?.position.signDegrees ?? 0) * 100) / 100,
    },
    moon: {
      sign: moonPos?.position.sign ?? "aries",
      degree: Math.round((moonPos?.position.signDegrees ?? 0) * 100) / 100,
      phase: moonPhase,
    },
    mercury: {
      sign: mercuryPos?.position.sign ?? "aries",
      degree: Math.round((mercuryPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: mercuryPos?.isRetrograde ?? false,
    },
    venus: {
      sign: venusPos?.position.sign ?? "aries",
      degree: Math.round((venusPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: venusPos?.isRetrograde ?? false,
    },
    mars: {
      sign: marsPos?.position.sign ?? "aries",
      degree: Math.round((marsPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: marsPos?.isRetrograde ?? false,
    },
    jupiter: {
      sign: jupiterPos?.position.sign ?? "aries",
    },
    saturn: {
      sign: saturnPos?.position.sign ?? "aries",
    },
    aspects: tightAspects,
    calculatedAt: timestamp.toISOString(),
  };
}

// =============================================================================
// Display helpers
// =============================================================================

/**
 * Get emoji for a moon phase
 */
export function getMoonPhaseEmoji(phase: MoonPhase): string {
  return MOON_PHASE_EMOJI[phase];
}

/**
 * Get display name for a moon phase
 */
export function getMoonPhaseName(phase: MoonPhase): string {
  return MOON_PHASE_NAMES[phase];
}

/**
 * Get glyph for a planet
 */
export function getPlanetGlyph(planet: string): string {
  const meta = PLANET_META[planet as keyof typeof PLANET_META];
  return meta?.glyph ?? planet;
}

/**
 * Get glyph for a zodiac sign
 */
export function getSignGlyph(sign: ZodiacSign): string {
  return ZODIAC_META[sign].glyph;
}

/**
 * Get symbol for an aspect type
 */
export function getAspectSymbol(type: AspectType): string {
  return ASPECT_META[type].symbol;
}

/**
 * Format degree with minutes
 */
export function formatDegree(degree: number): string {
  const wholeDegrees = Math.floor(degree);
  const minutes = Math.round((degree - wholeDegrees) * 60);
  return `${wholeDegrees}° ${minutes}'`;
}

/**
 * Get glow color for a moon phase.
 * Returns CSS rgba values for atmospheric glow effects.
 */
export function getMoonPhaseGlow(phase: MoonPhase): string {
  switch (phase) {
    case "new_moon":
      return "rgba(212, 168, 75, 0.2)"; // subtle - new beginnings
    case "waxing_crescent":
    case "first_quarter":
      return "rgba(212, 168, 75, 0.35)"; // building
    case "waxing_gibbous":
      return "rgba(212, 168, 75, 0.45)"; // approaching peak
    case "full_moon":
      return "rgba(232, 192, 104, 0.6)"; // bright peak
    case "waning_gibbous":
    case "last_quarter":
      return "rgba(166, 138, 60, 0.35)"; // muted release
    case "waning_crescent":
      return "rgba(166, 138, 60, 0.25)"; // fading
    default:
      return "rgba(212, 168, 75, 0.3)";
  }
}

/**
 * Build dashboard cosmic context from a pre-computed chart and transitions.
 *
 * Pure function — takes chart results and pre-computed transitions,
 * returns the dashboard context. Used by both the single-day path
 * and the batch computation path.
 */
export function buildDashboardContext(
  chart: ReturnType<typeof calculateChart>,
  timestamp: Date,
  moonTransition: SignTransition | null,
  sunTransition: SignTransition | null,
): DashboardCosmicContext {
  // Extract planet positions
  const sunPos = chart.planets.sun;
  const moonPos = chart.planets.moon;
  const mercuryPos = chart.planets.mercury;
  const venusPos = chart.planets.venus;
  const marsPos = chart.planets.mars;
  const jupiterPos = chart.planets.jupiter;
  const saturnPos = chart.planets.saturn;
  const uranusPos = chart.planets.uranus;
  const neptunePos = chart.planets.neptune;
  const plutoPos = chart.planets.pluto;

  // Calculate moon phase and lunar elongation
  const sunLon = sunPos?.position.longitude ?? 0;
  const moonLon = moonPos?.position.longitude ?? 0;
  const moonPhase = calculateMoonPhase(sunLon, moonLon);
  const lunarElongation = ((moonLon - sunLon + 360) % 360);

  // Filter for tight aspects (orb <= 2°) between planets
  const relevantPlanets = new Set([
    "sun", "moon", "mercury", "venus", "mars",
    "jupiter", "saturn", "uranus", "neptune", "pluto"
  ]);
  const tightAspects: CosmicAspect[] = chart.aspects.all
    .filter((aspect) => {
      if (aspect.orb > MAX_ASPECT_ORB) return false;
      const p1 = aspect.point1.id.toLowerCase();
      const p2 = aspect.point2.id.toLowerCase();
      return relevantPlanets.has(p1) && relevantPlanets.has(p2);
    })
    .map((aspect) => ({
      planet1: aspect.point1.id.toLowerCase(),
      planet2: aspect.point2.id.toLowerCase(),
      type: aspect.type,
      orb: Math.round(aspect.orb * 10) / 10,
    }));

  return {
    sun: {
      sign: sunPos?.position.sign ?? "aries",
      degree: Math.round((sunPos?.position.signDegrees ?? 0) * 100) / 100,
    },
    moon: {
      sign: moonPos?.position.sign ?? "aries",
      degree: Math.round((moonPos?.position.signDegrees ?? 0) * 100) / 100,
      phase: moonPhase,
    },
    mercury: {
      sign: mercuryPos?.position.sign ?? "aries",
      degree: Math.round((mercuryPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: mercuryPos?.isRetrograde ?? false,
    },
    venus: {
      sign: venusPos?.position.sign ?? "aries",
      degree: Math.round((venusPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: venusPos?.isRetrograde ?? false,
    },
    mars: {
      sign: marsPos?.position.sign ?? "aries",
      degree: Math.round((marsPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: marsPos?.isRetrograde ?? false,
    },
    jupiter: {
      sign: jupiterPos?.position.sign ?? "aries",
      degree: Math.round((jupiterPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: jupiterPos?.isRetrograde ?? false,
    },
    saturn: {
      sign: saturnPos?.position.sign ?? "aries",
      degree: Math.round((saturnPos?.position.signDegrees ?? 0) * 100) / 100,
      isRetrograde: saturnPos?.isRetrograde ?? false,
    },
    uranus: {
      sign: uranusPos?.position.sign ?? "aries",
    },
    neptune: {
      sign: neptunePos?.position.sign ?? "aries",
    },
    pluto: {
      sign: plutoPos?.position.sign ?? "aries",
    },
    transitions: {
      moon: moonTransition,
      sun: sunTransition,
    },
    lunarElongation: Math.round(lunarElongation * 100) / 100,
    aspects: tightAspects,
    calculatedAt: timestamp.toISOString(),
  };
}

/**
 * Calculate extended cosmic context for dashboard display.
 *
 * Includes generational planets (Uranus, Neptune, Pluto) and
 * sign transitions for Moon and Sun.
 *
 * @param timestamp - The moment to calculate for (defaults to now)
 * @param calculateTransitions - Function to calculate sign transitions (injected for testability)
 * @returns The dashboard cosmic context with all planets and transitions
 */
export function calculateDashboardCosmicContext(
  timestamp: Date = new Date(),
  calculateTransitions?: (body: "sun" | "moon", longitude: number, fromDate: Date) => SignTransition | null
): DashboardCosmicContext {
  const chart = calculateChart({
    year: timestamp.getUTCFullYear(),
    month: timestamp.getUTCMonth() + 1,
    day: timestamp.getUTCDate(),
    hour: timestamp.getUTCHours(),
    minute: timestamp.getUTCMinutes(),
    second: timestamp.getUTCSeconds(),
    location: GREENWICH,
  });

  let moonTransition: SignTransition | null = null;
  let sunTransition: SignTransition | null = null;

  if (calculateTransitions) {
    const moonLon = chart.planets.moon?.position.longitude ?? 0;
    const sunLon = chart.planets.sun?.position.longitude ?? 0;
    moonTransition = calculateTransitions("moon", moonLon, timestamp);
    sunTransition = calculateTransitions("sun", sunLon, timestamp);
  }

  return buildDashboardContext(chart, timestamp, moonTransition, sunTransition);
}
