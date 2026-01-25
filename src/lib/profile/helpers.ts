/**
 * Helper functions for the Profile module.
 *
 * Element balance weighting:
 * - Sun, Moon, Rising: 2 points each (core identity)
 * - Mercury through Saturn: 1 point each (5 personal/social planets)
 * - Total: 11 points, Big Three = ~55% of weight
 * - Outer planets (Uranus, Neptune, Pluto) excluded — generational, not personal
 */

import { ZODIAC_META, type ZodiacSign, type CelestialBodyId } from "@/lib/astrology";
import type { ChartResult } from "@/lib/astrology/types";
import type {
  ElementBalance,
  ModalityBalance,
  BigThree,
  StoredChartData,
  SpiritualProfile,
} from "./types";

/**
 * Planets included in element/modality calculations with their weights
 */
const WEIGHTED_PLANETS: Array<{ id: CelestialBodyId | "rising"; weight: number }> = [
  { id: "sun", weight: 2 },
  { id: "moon", weight: 2 },
  { id: "rising", weight: 2 }, // Special handling for Rising/Ascendant
  { id: "mercury", weight: 1 },
  { id: "venus", weight: 1 },
  { id: "mars", weight: 1 },
  { id: "jupiter", weight: 1 },
  { id: "saturn", weight: 1 },
];

/**
 * Calculate element balance from a chart result
 *
 * @param chart - The calculated chart result
 * @returns Element balance with fire, earth, air, water counts
 */
export function calculateElementBalance(chart: ChartResult): ElementBalance {
  const balance: ElementBalance = {
    fire: 0,
    earth: 0,
    air: 0,
    water: 0,
    total: 0,
    dominant: null,
  };

  for (const { id, weight } of WEIGHTED_PLANETS) {
    let sign: ZodiacSign | undefined;

    if (id === "rising") {
      sign = chart.risingSign;
    } else {
      sign = chart.planets[id]?.position.sign;
    }

    if (sign) {
      const element = ZODIAC_META[sign].element;
      balance[element] += weight;
      balance.total += weight;
    }
  }

  // Determine dominant element (must be unique maximum)
  const elements = ["fire", "earth", "air", "water"] as const;
  const maxValue = Math.max(balance.fire, balance.earth, balance.air, balance.water);
  const dominants = elements.filter((e) => balance[e] === maxValue);
  balance.dominant = dominants.length === 1 ? dominants[0]! : null;

  return balance;
}

/**
 * Calculate modality balance from a chart result
 *
 * @param chart - The calculated chart result
 * @returns Modality balance with cardinal, fixed, mutable counts
 */
export function calculateModalityBalance(chart: ChartResult): ModalityBalance {
  const balance: ModalityBalance = {
    cardinal: 0,
    fixed: 0,
    mutable: 0,
    total: 0,
    dominant: null,
  };

  for (const { id, weight } of WEIGHTED_PLANETS) {
    let sign: ZodiacSign | undefined;

    if (id === "rising") {
      sign = chart.risingSign;
    } else {
      sign = chart.planets[id]?.position.sign;
    }

    if (sign) {
      const modality = ZODIAC_META[sign].modality;
      balance[modality] += weight;
      balance.total += weight;
    }
  }

  // Determine dominant modality (must be unique maximum)
  const modalities = ["cardinal", "fixed", "mutable"] as const;
  const maxValue = Math.max(balance.cardinal, balance.fixed, balance.mutable);
  const dominants = modalities.filter((m) => balance[m] === maxValue);
  balance.dominant = dominants.length === 1 ? dominants[0]! : null;

  return balance;
}

/**
 * Extract the Big Three from a chart result
 *
 * @param chart - The calculated chart result
 * @param hasBirthTime - Whether birth time was provided
 * @returns Big Three placements
 */
export function extractBigThree(chart: ChartResult, hasBirthTime: boolean): BigThree {
  return {
    sun: {
      sign: chart.sunSign,
      degree: chart.planets.sun?.position.signDegrees ?? 0,
    },
    moon: {
      sign: chart.moonSign,
      degree: chart.planets.moon?.position.signDegrees ?? 0,
    },
    rising: hasBirthTime
      ? {
          sign: chart.risingSign,
          degree: chart.angles.ascendant.position.signDegrees,
        }
      : null,
  };
}

/**
 * Extract storable chart data from a chart result
 *
 * @param chart - The calculated chart result
 * @returns Data suitable for JSONB storage
 */
export function extractStoredChartData(chart: ChartResult): StoredChartData {
  return {
    planets: chart.planets,
    angles: chart.angles,
    houses: chart.houses,
    aspects: {
      all: chart.aspects.all,
      byType: chart.aspects.byType,
    },
    options: chart.options,
  };
}

/**
 * Build element balance from stored profile data
 *
 * @param profile - The spiritual profile
 * @returns Element balance object
 */
export function getElementBalanceFromProfile(profile: SpiritualProfile): ElementBalance {
  const balance: ElementBalance = {
    fire: profile.elementFire,
    earth: profile.elementEarth,
    air: profile.elementAir,
    water: profile.elementWater,
    total: profile.elementFire + profile.elementEarth + profile.elementAir + profile.elementWater,
    dominant: null,
  };

  // Determine dominant element
  const elements = ["fire", "earth", "air", "water"] as const;
  const maxValue = Math.max(balance.fire, balance.earth, balance.air, balance.water);
  const dominants = elements.filter((e) => balance[e] === maxValue);
  balance.dominant = dominants.length === 1 ? dominants[0]! : null;

  return balance;
}

/**
 * Build modality balance from stored profile data
 *
 * @param profile - The spiritual profile
 * @returns Modality balance object
 */
export function getModalityBalanceFromProfile(profile: SpiritualProfile): ModalityBalance {
  const balance: ModalityBalance = {
    cardinal: profile.modalityCardinal,
    fixed: profile.modalityFixed,
    mutable: profile.modalityMutable,
    total: profile.modalityCardinal + profile.modalityFixed + profile.modalityMutable,
    dominant: null,
  };

  // Determine dominant modality
  const modalities = ["cardinal", "fixed", "mutable"] as const;
  const maxValue = Math.max(balance.cardinal, balance.fixed, balance.mutable);
  const dominants = modalities.filter((m) => balance[m] === maxValue);
  balance.dominant = dominants.length === 1 ? dominants[0]! : null;

  return balance;
}

/**
 * Build Big Three from stored profile data
 *
 * @param profile - The spiritual profile
 * @returns Big Three placements
 */
export function getBigThreeFromProfile(profile: SpiritualProfile): BigThree | null {
  if (!profile.sunSign || !profile.moonSign) {
    return null;
  }

  return {
    sun: {
      sign: profile.sunSign,
      degree: profile.sunDegree ?? 0,
    },
    moon: {
      sign: profile.moonSign,
      degree: profile.moonDegree ?? 0,
    },
    rising: profile.risingSign
      ? {
          sign: profile.risingSign,
          degree: profile.risingDegree ?? 0,
        }
      : null,
  };
}

/**
 * Parse birth time string to hours and minutes
 *
 * @param timeString - Time in "HH:MM:SS" or "HH:MM" format
 * @returns Object with hour and minute, or null if invalid
 */
export function parseBirthTime(timeString: string | null): { hour: number; minute: number } | null {
  if (!timeString) return null;

  const parts = timeString.split(":");
  if (parts.length < 2) return null;

  const hour = parseInt(parts[0]!, 10);
  const minute = parseInt(parts[1]!, 10);

  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

/**
 * Format birth time for display
 *
 * @param timeString - Time in "HH:MM:SS" or "HH:MM" format
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatBirthTime(timeString: string | null): string | null {
  const parsed = parseBirthTime(timeString);
  if (!parsed) return null;

  const { hour, minute } = parsed;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const minuteStr = minute.toString().padStart(2, "0");

  return `${hour12}:${minuteStr} ${period}`;
}

/**
 * Calculation version string for tracking schema changes
 */
export const CALCULATION_VERSION = "1.0.0";
