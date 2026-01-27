/**
 * Type definitions for the Profile module.
 *
 * Spiritual profiles store birth data and calculated natal chart information.
 */

import type { ZodiacSign, CelestialBodyId, AngleId, AspectType } from "@/lib/astrology";
import type { NumerologyData } from "@/lib/numerology";
import type {
  PlanetPosition,
  AnglePosition,
  HouseCusp,
  Aspect,
  ChartOptions,
} from "@/lib/astrology/types";

/**
 * Element balance distribution in a chart
 */
export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
  total: number;
  dominant: "fire" | "earth" | "air" | "water" | null;
}

/**
 * Modality balance distribution in a chart
 */
export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
  total: number;
  dominant: "cardinal" | "fixed" | "mutable" | null;
}

/**
 * The Big Three placements
 */
export interface BigThree {
  sun: {
    sign: ZodiacSign;
    degree: number;
  };
  moon: {
    sign: ZodiacSign;
    degree: number;
  };
  rising: {
    sign: ZodiacSign;
    degree: number;
  } | null; // null if no birth time
}

/**
 * Stored chart data in JSONB (subset of ChartResult for persistence)
 */
export interface StoredChartData {
  planets: Record<CelestialBodyId, PlanetPosition>;
  angles: Record<AngleId, AnglePosition>;
  houses: HouseCusp[];
  aspects: {
    all: Aspect[];
    byType: Partial<Record<AspectType, Aspect[]>>;
  };
  options: Required<Omit<ChartOptions, "customOrbs">> & { customOrbs?: ChartOptions["customOrbs"] };
}

/**
 * Profile data from the database
 */
export interface SpiritualProfile {
  id: string;
  userId: string;

  // Birth data
  birthDate: Date;
  birthTime: string | null;
  birthTimeApproximate: boolean;
  birthCity: string;
  birthCountry: string;
  birthLatitude: number;
  birthLongitude: number;
  birthTimezone: string;

  // The Big Three
  sunSign: ZodiacSign | null;
  sunDegree: number | null;
  moonSign: ZodiacSign | null;
  moonDegree: number | null;
  risingSign: ZodiacSign | null;
  risingDegree: number | null;

  // Element Balance
  elementFire: number;
  elementEarth: number;
  elementAir: number;
  elementWater: number;

  // Modality Balance
  modalityCardinal: number;
  modalityFixed: number;
  modalityMutable: number;

  // Numerology
  birthName: string | null;
  lifePathNumber: number | null;
  birthdayNumber: number | null;
  expressionNumber: number | null;
  soulUrgeNumber: number | null;
  personalityNumber: number | null;
  maturityNumber: number | null;

  // Full chart data
  chartData: StoredChartData | null;

  // Metadata
  calculatedAt: Date | null;
  calculationVersion: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/**
 * Input for creating/updating a profile.
 * Note: birthDate can be Date or ISO string (API accepts both via JSON serialization)
 */
export interface ProfileInput {
  birthDate: Date | string;
  birthTime?: string | null;
  birthTimeApproximate?: boolean;
  birthCity: string;
  birthCountry: string;
  birthLatitude: number;
  birthLongitude: number;
  birthTimezone?: string; // Optional - auto-calculated from coordinates if not provided
}

/**
 * API response for profile
 */
export interface ProfileResponse {
  profile: SpiritualProfile | null;
  bigThree: BigThree | null;
  elementBalance: ElementBalance | null;
  modalityBalance: ModalityBalance | null;
  numerology: NumerologyData | null;
}

/**
 * Input for chart calculation preview (subset of ProfileInput)
 */
export interface ChartCalculationInput {
  birthDate: string;
  birthTime?: string | null;
  birthLatitude: number;
  birthLongitude: number;
}

/**
 * API response for chart calculation
 */
export interface ChartCalculationResponse {
  success: boolean;
  bigThree: BigThree;
  elementBalance: ElementBalance;
  modalityBalance: ModalityBalance;
}
