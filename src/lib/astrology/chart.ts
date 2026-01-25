/**
 * Birth chart calculation wrapper for circular-natal-horoscope-js.
 *
 * This module provides a clean TypeScript interface to the ephemeris library.
 */

import horoscopeLib from "circular-natal-horoscope-js";

// The library exports Origin and Horoscope as named exports on the default
const { Origin, Horoscope } = horoscopeLib as any; // eslint-disable-line

import {
  ZODIAC_SIGNS,
  ZODIAC_META,
  PLANET_META,
  ASPECT_META,
  CELESTIAL_BODIES,
  DEFAULT_HOUSE_SYSTEM,
  DEFAULT_ZODIAC_SYSTEM,
  type ZodiacSign,
  type CelestialBodyId,
  type AspectType,
  type AngleId,
} from "./constants";

import type {
  BirthData,
  ChartOptions,
  ChartResult,
  ChartSummary,
  PlanetPosition,
  AnglePosition,
  HouseCusp,
  Aspect,
  EclipticPosition,
  ArcDegrees,
} from "./types";

/**
 * Convert decimal degrees to arc degrees (degrees, minutes, seconds)
 */
function decimalToArc(decimal: number): ArcDegrees {
  const totalSeconds = Math.round(decimal * 3600);
  const degrees = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { degrees, minutes, seconds };
}

/**
 * Format arc degrees as string (e.g., "24 32' 15''")
 */
function formatArc(arc: ArcDegrees): string {
  return `${arc.degrees}\u00B0 ${arc.minutes}' ${arc.seconds}''`;
}

/**
 * Get zodiac sign from ecliptic longitude
 */
function getSignFromLongitude(longitude: number): ZodiacSign {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  return ZODIAC_SIGNS[signIndex]!;
}

/**
 * Get degrees within sign from ecliptic longitude
 */
function getSignDegrees(longitude: number): number {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  return normalizedLon % 30;
}

/**
 * Create an EclipticPosition from longitude
 */
function createEclipticPosition(longitude: number): EclipticPosition {
  const normalizedLon = ((longitude % 360) + 360) % 360;
  const sign = getSignFromLongitude(normalizedLon);
  const signDegrees = getSignDegrees(normalizedLon);
  const arc = decimalToArc(signDegrees);
  const signMeta = ZODIAC_META[sign];

  return {
    longitude: normalizedLon,
    signDegrees,
    sign,
    arc,
    formatted: formatArc(arc),
    formattedWithSign: `${arc.degrees}\u00B0 ${arc.minutes}' ${signMeta.glyph} ${sign.charAt(0).toUpperCase() + sign.slice(1)}`,
  };
}

/**
 * Map library aspect key to our AspectType
 */
function mapAspectKey(key: string): AspectType | null {
  const keyMap: Record<string, AspectType> = {
    conjunction: "conjunction",
    opposition: "opposition",
    trine: "trine",
    square: "square",
    sextile: "sextile",
    quincunx: "quincunx",
    "semi-sextile": "semi-sextile",
    semisextile: "semi-sextile",
    "semi-square": "semi-square",
    semisquare: "semi-square",
    quintile: "quintile",
    septile: "septile",
  };
  return keyMap[key.toLowerCase()] ?? null;
}

/**
 * Extract planet position from library result
 */
function extractPlanetPosition(
  body: Record<string, unknown>,
  id: CelestialBodyId,
  houses: HouseCusp[]
): PlanetPosition {
  const meta = PLANET_META[id];
  const chartPos = body?.ChartPosition as Record<string, unknown> | undefined;
  const ecliptic = chartPos?.Ecliptic as Record<string, unknown> | undefined;
  const longitude = (ecliptic?.DecimalDegrees as number) ?? 0;
  const position = createEclipticPosition(longitude);

  // Determine which house this planet is in (Whole Sign: sign determines house)
  // For Whole Sign, the Ascendant sign = 1st house, next sign = 2nd house, etc.
  const house = houses.findIndex((h) => h.sign === position.sign) + 1 || 1;

  return {
    id,
    name: meta.name,
    glyph: meta.glyph,
    position,
    isRetrograde: (body?.isRetrograde as boolean) ?? false,
    house,
  };
}

/**
 * Calculate a natal birth chart
 *
 * @param birthData - The birth date, time, and location
 * @param options - Optional configuration for house system, aspects, etc.
 * @returns The complete chart calculation result
 *
 * @example
 * ```ts
 * const chart = calculateChart({
 *   year: 1990,
 *   month: 6,  // June
 *   day: 15,
 *   hour: 14,
 *   minute: 30,
 *   location: { latitude: 40.7128, longitude: -74.0060, name: "New York City" }
 * });
 *
 * console.log(`Sun in ${chart.sunSign}`);
 * console.log(`Moon in ${chart.moonSign}`);
 * console.log(`Rising: ${chart.risingSign}`);
 * ```
 */
export function calculateChart(birthData: BirthData, options: ChartOptions = {}): ChartResult {
  const {
    houseSystem = DEFAULT_HOUSE_SYSTEM,
    zodiacSystem = DEFAULT_ZODIAC_SYSTEM,
    aspectTypes = ["major"],
    customOrbs,
    language = "en",
  } = options;

  // Create origin (note: library uses 0-indexed months)
  const origin = new Origin({
    year: birthData.year,
    month: birthData.month - 1, // Convert 1-indexed to 0-indexed
    date: birthData.day,
    hour: birthData.hour,
    minute: birthData.minute,
    second: birthData.second ?? 0,
    latitude: birthData.location.latitude,
    longitude: birthData.location.longitude,
  });

  // Calculate horoscope
  const horoscope = new Horoscope({
    origin,
    houseSystem,
    zodiac: zodiacSystem,
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: aspectTypes.flatMap((t) => (t === "major" ? ["major"] : ["minor"])),
    customOrbs: customOrbs ?? {},
    language,
  });

  // Extract angles
  const ascendant = horoscope.Ascendant as Record<string, unknown> | undefined;
  const ascChartPos = ascendant?.ChartPosition as Record<string, unknown> | undefined;
  const ascEcliptic = ascChartPos?.Ecliptic as Record<string, unknown> | undefined;
  const ascendantLon = (ascEcliptic?.DecimalDegrees as number) ?? 0;

  const midheaven = horoscope.Midheaven as Record<string, unknown> | undefined;
  const mcChartPos = midheaven?.ChartPosition as Record<string, unknown> | undefined;
  const mcEcliptic = mcChartPos?.Ecliptic as Record<string, unknown> | undefined;
  const midheavenLon = (mcEcliptic?.DecimalDegrees as number) ?? 0;

  const angles: Record<AngleId, AnglePosition> = {
    ascendant: {
      id: "ascendant",
      name: "Ascendant",
      position: createEclipticPosition(ascendantLon),
    },
    midheaven: {
      id: "midheaven",
      name: "Midheaven",
      position: createEclipticPosition(midheavenLon),
    },
  };

  // Extract houses
  const rawHouses = (horoscope.Houses ?? []) as Record<string, unknown>[];
  const houses: HouseCusp[] = rawHouses.map((house, index: number) => {
    const houseChartPos = house?.ChartPosition as Record<string, unknown> | undefined;
    const startPos = houseChartPos?.StartPosition as Record<string, unknown> | undefined;
    const startEcliptic = startPos?.Ecliptic as Record<string, unknown> | undefined;
    const startLon = (startEcliptic?.DecimalDegrees as number) ?? index * 30;
    const position = createEclipticPosition(startLon);
    return {
      number: index + 1,
      position,
      sign: position.sign,
    };
  });

  // Ensure we have 12 houses
  while (houses.length < 12) {
    const prevHouse = houses[houses.length - 1];
    const nextLon = prevHouse ? (prevHouse.position.longitude + 30) % 360 : houses.length * 30;
    const position = createEclipticPosition(nextLon);
    houses.push({
      number: houses.length + 1,
      position,
      sign: position.sign,
    });
  }

  // Extract planet positions
  const planets: Partial<Record<CelestialBodyId, PlanetPosition>> = {};
  const planetList: PlanetPosition[] = [];

  // Process celestial bodies
  const bodies = (horoscope.CelestialBodies ?? {}) as Record<string, Record<string, unknown>>;
  const points = (horoscope.CelestialPoints ?? {}) as Record<string, Record<string, unknown>>;

  for (const bodyId of CELESTIAL_BODIES) {
    const bodyData = bodies[bodyId] ?? points[bodyId];
    if (bodyData) {
      const position = extractPlanetPosition(bodyData, bodyId, houses);
      planets[bodyId] = position;
      planetList.push(position);
    }
  }

  // Extract aspects
  const aspects: ChartResult["aspects"] = {
    all: [],
    byType: {},
    byPlanet: {},
  };

  const aspectsObj = horoscope.Aspects as Record<string, unknown> | undefined;
  const rawAspects = (aspectsObj?.all ?? []) as Record<string, unknown>[];
  for (const rawAspect of rawAspects) {
    const aspectKey = rawAspect.aspectKey as string | undefined;
    const aspectType = mapAspectKey(aspectKey ?? "");
    if (!aspectType) continue;

    const aspectMeta = ASPECT_META[aspectType];
    const aspect: Aspect = {
      point1: {
        id: (rawAspect.point1Key as string) ?? "",
        name: (rawAspect.point1Label as string) ?? (rawAspect.point1Key as string) ?? "",
      },
      point2: {
        id: (rawAspect.point2Key as string) ?? "",
        name: (rawAspect.point2Label as string) ?? (rawAspect.point2Key as string) ?? "",
      },
      type: aspectType,
      typeName: aspectMeta.name,
      symbol: aspectMeta.symbol,
      exactAngle: aspectMeta.angle,
      orb: (rawAspect.orb as number) ?? 0,
      isApplying: false, // Library doesn't provide this directly
      nature: aspectMeta.nature,
    };

    aspects.all.push(aspect);

    // Organize by type
    if (!aspects.byType[aspectType]) {
      aspects.byType[aspectType] = [];
    }
    aspects.byType[aspectType]!.push(aspect);

    // Organize by planet
    const p1 = aspect.point1.id;
    const p2 = aspect.point2.id;
    if (!aspects.byPlanet[p1]) aspects.byPlanet[p1] = [];
    if (!aspects.byPlanet[p2]) aspects.byPlanet[p2] = [];
    aspects.byPlanet[p1]!.push(aspect);
    aspects.byPlanet[p2]!.push(aspect);
  }

  // Get the big three
  const sunSign = planets.sun?.position.sign ?? "aries";
  const moonSign = planets.moon?.position.sign ?? "aries";
  const risingSign = angles.ascendant.position.sign;

  return {
    birthData,
    options: {
      houseSystem,
      zodiacSystem,
      aspectTypes,
      customOrbs,
      language,
    },
    sunSign,
    moonSign,
    risingSign,
    planets: planets as Record<CelestialBodyId, PlanetPosition>,
    planetList,
    angles,
    houses,
    aspects,
    _raw: { origin, horoscope },
  };
}

/**
 * Get a summary of the chart's key placements
 */
export function getChartSummary(chart: ChartResult): ChartSummary {
  return {
    sun: {
      sign: chart.planets.sun?.position.sign ?? "aries",
      degree: chart.planets.sun?.position.formatted ?? "0\u00B0 0'",
    },
    moon: {
      sign: chart.planets.moon?.position.sign ?? "aries",
      degree: chart.planets.moon?.position.formatted ?? "0\u00B0 0'",
    },
    rising: {
      sign: chart.angles.ascendant.position.sign,
      degree: chart.angles.ascendant.position.formatted,
    },
    mercury: {
      sign: chart.planets.mercury?.position.sign ?? "aries",
      degree: chart.planets.mercury?.position.formatted ?? "0\u00B0 0'",
    },
    venus: {
      sign: chart.planets.venus?.position.sign ?? "aries",
      degree: chart.planets.venus?.position.formatted ?? "0\u00B0 0'",
    },
    mars: {
      sign: chart.planets.mars?.position.sign ?? "aries",
      degree: chart.planets.mars?.position.formatted ?? "0\u00B0 0'",
    },
  };
}

/**
 * Format a planet position for display
 */
export function formatPlanetPosition(planet: PlanetPosition): string {
  const retrograde = planet.isRetrograde ? " (R)" : "";
  const meta = ZODIAC_META[planet.position.sign];
  return `${planet.glyph} ${planet.name}: ${planet.position.arc.degrees}\u00B0${planet.position.arc.minutes}' ${meta.glyph} ${planet.position.sign.charAt(0).toUpperCase() + planet.position.sign.slice(1)}${retrograde}`;
}
