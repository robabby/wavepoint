/**
 * Astrological Houses module - Data and helpers for the 12 houses.
 *
 * Houses represent the 12 sectors of the natal chart, each governing
 * specific life areas from identity (1st) to transcendence (12th).
 *
 * @example
 * ```ts
 * import {
 *   getHouseByNumber,
 *   getHousesGroupedByType,
 *   HOUSE_DATA,
 * } from "@/lib/astrology/houses";
 *
 * const firstHouse = getHouseByNumber(1);
 * console.log(firstHouse?.name); // "House of Self"
 *
 * const byType = getHousesGroupedByType();
 * console.log(byType.angular.length); // 4
 * ```
 */

// Types
export type {
  HouseNumber,
  HouseType,
  HouseTraits,
  HousePageData,
  HouseWithRelations,
} from "./types";

// Data
export {
  HOUSE_NUMBERS,
  ROMAN_NUMERALS,
  HOUSE_TYPES,
  HOUSE_DATA,
  getAllHouses,
  getHouseByNumber,
} from "./data";

// Helpers
export {
  isValidHouseNumber,
  getHousesByType,
  getHousesGroupedByType,
  getAdjacentHouses,
  getSameTypeHouses,
  getHouseWithRelations,
  getHouseTypeDisplayInfo,
  HOUSE_TYPE_ORDER,
  searchHouses,
  type HouseTypeDisplayInfo,
} from "./helpers";
