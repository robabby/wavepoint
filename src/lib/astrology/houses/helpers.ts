/**
 * Helper functions for the Astrological Houses module.
 */

import type {
  HouseNumber,
  HouseType,
  HousePageData,
  HouseWithRelations,
} from "./types";
import { HOUSE_NUMBERS, HOUSE_DATA, HOUSE_TYPES, getHouseByNumber } from "./data";

/**
 * Check if a number is a valid house number (1-12)
 */
export function isValidHouseNumber(num: number): num is HouseNumber {
  return Number.isInteger(num) && num >= 1 && num <= 12;
}

/**
 * Get houses by type
 */
export function getHousesByType(type: HouseType): HousePageData[] {
  return HOUSE_NUMBERS.filter((num) => HOUSE_TYPES[num] === type).map(
    (num) => HOUSE_DATA[num]
  );
}

/**
 * Get all houses grouped by type
 */
export function getHousesGroupedByType(): Record<HouseType, HousePageData[]> {
  return {
    angular: getHousesByType("angular"),
    succedent: getHousesByType("succedent"),
    cadent: getHousesByType("cadent"),
  };
}

/**
 * Get adjacent house numbers for navigation (circular)
 */
export function getAdjacentHouses(num: HouseNumber): {
  previous: HouseNumber;
  next: HouseNumber;
} {
  const prevNum = num === 1 ? 12 : ((num - 1) as HouseNumber);
  const nextNum = num === 12 ? 1 : ((num + 1) as HouseNumber);

  return {
    previous: prevNum,
    next: nextNum,
  };
}

/**
 * Get houses of the same type as the given house
 */
export function getSameTypeHouses(num: HouseNumber): HouseNumber[] {
  const type = HOUSE_TYPES[num];
  return HOUSE_NUMBERS.filter(
    (n) => HOUSE_TYPES[n] === type && n !== num
  ) as HouseNumber[];
}

/**
 * Get house with all its relations populated
 */
export function getHouseWithRelations(
  num: HouseNumber
): HouseWithRelations | null {
  const house = getHouseByNumber(num);
  if (!house) return null;

  return {
    ...house,
    naturalSignUrl: `/astrology/signs/${house.naturalSign}`,
    naturalRulerUrl: `/astrology/planets/${house.naturalRuler}`,
    adjacentHouses: getAdjacentHouses(num),
    sameTypeHouses: getSameTypeHouses(num),
  };
}

/**
 * House type display information
 */
export interface HouseTypeDisplayInfo {
  name: string;
  description: string;
  quality: string;
}

/**
 * Get display info for a house type
 */
export function getHouseTypeDisplayInfo(type: HouseType): HouseTypeDisplayInfo {
  const typeInfo: Record<HouseType, HouseTypeDisplayInfo> = {
    angular: {
      name: "Angular",
      description:
        "The most prominent and powerful houses of the chart. Angular houses represent the cardinal points of life where we initiate action, establish identity, and make our mark on the world. Planets here express their energy most directly and visibly.",
      quality: "Initiating and powerful",
    },
    succedent: {
      name: "Succedent",
      description:
        "Houses that follow the angles, representing the stabilization and consolidation of what was initiated. Succedent houses govern resources, values, and the building of lasting foundations. Planets here work steadily toward tangible results.",
      quality: "Stabilizing and resourceful",
    },
    cadent: {
      name: "Cadent",
      description:
        "Houses that precede the angles, representing preparation, learning, and transition. Cadent houses govern mental processes, communication, and service. Planets here express their energy in more subtle, adaptive ways.",
      quality: "Adaptive and transitional",
    },
  };

  return typeInfo[type];
}

/**
 * Get the type order for display (Angular → Succedent → Cadent)
 */
export const HOUSE_TYPE_ORDER: readonly HouseType[] = [
  "angular",
  "succedent",
  "cadent",
] as const;

/**
 * Search houses by keyword
 */
export function searchHouses(query: string): HousePageData[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(HOUSE_DATA).filter((house) => {
    // Search in name
    if (house.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in keywords
    if (house.keywords.some((k) => k.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in description
    if (house.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in archetype
    if (house.archetype.toLowerCase().includes(lowerQuery)) return true;

    // Search in life areas
    if (house.lifeAreas.some((area) => area.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}
