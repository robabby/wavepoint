/**
 * House type-based visual styles for use across components.
 *
 * These styles provide consistent theming for house cards,
 * heroes, and other components based on house type (Angular/Succedent/Cadent).
 *
 * Houses represent the architectural framework of the chart, so the visual
 * language emphasizes structure and prominence levels:
 * - Angular: Most powerful, brightest gold, strong presence
 * - Succedent: Stabilizing, warm copper/bronze, grounded
 * - Cadent: Transitional, cooler silver/lavender, subtle
 */

import type { HouseType } from "@/lib/astrology/houses";

/**
 * House type style configuration
 */
export interface HouseTypeStyle {
  /** Background gradient classes (from-[x] via-[y] to-[z]) */
  gradient: string;
  /** Glow color for radial gradients and box shadows */
  glowColor: string;
  /** Border accent color for hover states */
  accentBorder: string;
  /** Drop shadow filter for symbol/glyph elements */
  symbolGlow: string;
  /** Drop shadow filter for text elements */
  textGlow: string;
  /** Font styling for Roman numerals */
  numberStyle: string;
  /** Border style for cards */
  borderStyle: "solid" | "dashed" | "dotted";
}

/**
 * Default style (Angular) used as fallback
 */
export const DEFAULT_HOUSE_TYPE_STYLE: HouseTypeStyle = {
  gradient: "from-[#12100a] via-[#1f1a10] to-[#181408]",
  glowColor: "rgba(232, 192, 104, 0.18)",
  accentBorder: "rgba(232, 192, 104, 0.45)",
  symbolGlow: "drop-shadow(0 0 40px rgba(232, 192, 104, 0.5))",
  textGlow: "drop-shadow(0 0 12px rgba(232, 192, 104, 0.6))",
  numberStyle: "font-bold tracking-tight",
  borderStyle: "solid",
};

/**
 * House type-based visual configurations.
 *
 * - Angular (1, 4, 7, 10): Powerful gold, commanding presence
 * - Succedent (2, 5, 8, 11): Warm copper/bronze, grounded stability
 * - Cadent (3, 6, 9, 12): Cool silver/lavender, subtle transition
 */
export const HOUSE_TYPE_STYLES: Record<HouseType, HouseTypeStyle> = {
  angular: {
    // Angular = powerful, prominent - brightest gold, strong presence
    gradient: "from-[#12100a] via-[#1f1a10] to-[#181408]",
    glowColor: "rgba(232, 192, 104, 0.18)",
    accentBorder: "rgba(232, 192, 104, 0.45)",
    symbolGlow: "drop-shadow(0 0 40px rgba(232, 192, 104, 0.5))",
    textGlow: "drop-shadow(0 0 12px rgba(232, 192, 104, 0.6))",
    numberStyle: "font-bold tracking-tight",
    borderStyle: "solid",
  },
  succedent: {
    // Succedent = stable, resourceful - warm copper/bronze, grounded
    gradient: "from-[#0f0c08] via-[#1a1510] to-[#14110a]",
    glowColor: "rgba(184, 140, 80, 0.14)",
    accentBorder: "rgba(184, 140, 80, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(184, 140, 80, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(184, 140, 80, 0.5))",
    numberStyle: "font-medium tracking-normal",
    borderStyle: "dashed",
  },
  cadent: {
    // Cadent = subtle, mental, transitional - cooler silver/lavender
    gradient: "from-[#0a0a0e] via-[#12121a] to-[#0e0e14]",
    glowColor: "rgba(160, 160, 190, 0.12)",
    accentBorder: "rgba(160, 160, 190, 0.3)",
    symbolGlow: "drop-shadow(0 0 25px rgba(160, 160, 190, 0.35))",
    textGlow: "drop-shadow(0 0 6px rgba(160, 160, 190, 0.4))",
    numberStyle: "font-light tracking-wide",
    borderStyle: "dotted",
  },
};

/**
 * Get the house type style for a given type.
 * Returns default Angular style if type is not found.
 */
export function getHouseTypeStyle(type: HouseType | string): HouseTypeStyle {
  return HOUSE_TYPE_STYLES[type as HouseType] ?? DEFAULT_HOUSE_TYPE_STYLE;
}
