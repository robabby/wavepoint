/**
 * Profile module - Spiritual profiles with birth data and natal charts.
 *
 * This module provides the data layer for the /profile section.
 * It's designed to work with the astrology module for chart calculations.
 *
 * @example
 * ```ts
 * import { calculateElementBalance, extractBigThree } from "@/lib/profile";
 * import { calculateChart } from "@/lib/astrology/chart";
 *
 * const chart = calculateChart(birthData);
 * const elementBalance = calculateElementBalance(chart);
 * const bigThree = extractBigThree(chart, true);
 * ```
 */

// Types
export type {
  ElementBalance,
  ModalityBalance,
  BigThree,
  StoredChartData,
  SpiritualProfile,
  ProfileInput,
  ProfileResponse,
  ChartCalculationInput,
  ChartCalculationResponse,
} from "./types";

// Helpers
export {
  calculateElementBalance,
  calculateModalityBalance,
  extractBigThree,
  extractStoredChartData,
  getElementBalanceFromProfile,
  getModalityBalanceFromProfile,
  getBigThreeFromProfile,
  parseBirthTime,
  formatBirthTime,
  CALCULATION_VERSION,
} from "./helpers";

// Feature flags
export { isProfileEnabled } from "./feature-flags";
