/**
 * Helper functions for the Zodiac Signs module.
 */

import { ZODIAC_SIGNS, type ZodiacSign } from "../constants";
import type { ZodiacSignPageData, ZodiacSignWithRelations } from "./types";
import { ZODIAC_SIGN_DATA, getSignById } from "./data";
import {
  getRelatedNumbers,
  getRelatedGeometries,
  getRelatedArchetypes,
  getRulingPlanetUrl,
  getSignAspects,
} from "./correspondences";

/**
 * Check if a string is a valid zodiac sign id
 */
export function isValidSignId(id: string): id is ZodiacSign {
  return ZODIAC_SIGNS.includes(id as ZodiacSign);
}

/**
 * Get signs by element
 */
export function getSignsByElement(
  element: "fire" | "earth" | "air" | "water"
): ZodiacSignPageData[] {
  return Object.values(ZODIAC_SIGN_DATA).filter((sign) => sign.element === element);
}

/**
 * Get signs by modality
 */
export function getSignsByModality(
  modality: "cardinal" | "fixed" | "mutable"
): ZodiacSignPageData[] {
  return Object.values(ZODIAC_SIGN_DATA).filter((sign) => sign.modality === modality);
}

/**
 * Get signs by polarity
 */
export function getSignsByPolarity(
  polarity: "positive" | "negative"
): ZodiacSignPageData[] {
  return Object.values(ZODIAC_SIGN_DATA).filter((sign) => sign.polarity === polarity);
}

/**
 * Get the index of a sign in zodiac order (0-11)
 */
export function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_SIGNS.indexOf(sign);
}

/**
 * Get adjacent signs for navigation
 */
export function getAdjacentSigns(sign: ZodiacSign): {
  previous: ZodiacSign;
  next: ZodiacSign;
} {
  const index = getSignIndex(sign);
  const prevIndex = (index - 1 + 12) % 12;
  const nextIndex = (index + 1) % 12;

  return {
    previous: ZODIAC_SIGNS[prevIndex]!,
    next: ZODIAC_SIGNS[nextIndex]!,
  };
}

/**
 * Get a sign with all its relations populated
 */
export function getSignWithRelations(id: ZodiacSign): ZodiacSignWithRelations | null {
  const sign = getSignById(id);
  if (!sign) return null;

  return {
    ...sign,
    relatedNumbers: getRelatedNumbers(sign),
    relatedGeometries: getRelatedGeometries(sign),
    relatedArchetypes: getRelatedArchetypes(sign),
    rulingPlanetUrl: getRulingPlanetUrl(sign),
    aspects: getSignAspects(id),
  };
}

/**
 * Get all elements with their signs grouped
 */
export function getSignsGroupedByElement(): Record<
  "fire" | "earth" | "air" | "water",
  ZodiacSignPageData[]
> {
  return {
    fire: getSignsByElement("fire"),
    earth: getSignsByElement("earth"),
    air: getSignsByElement("air"),
    water: getSignsByElement("water"),
  };
}

/**
 * Get element display info
 */
export function getElementDisplayInfo(element: "fire" | "earth" | "air" | "water"): {
  name: string;
  description: string;
  quality: string;
} {
  const elementInfo: Record<string, { name: string; description: string; quality: string }> = {
    fire: {
      name: "Fire",
      description: "Signs of passion, energy, and inspired action",
      quality: "Transformative and willful",
    },
    earth: {
      name: "Earth",
      description: "Signs of stability, practicality, and material mastery",
      quality: "Grounding and manifestational",
    },
    air: {
      name: "Air",
      description: "Signs of intellect, communication, and social connection",
      quality: "Mental and connective",
    },
    water: {
      name: "Water",
      description: "Signs of emotion, intuition, and psychic sensitivity",
      quality: "Emotional and intuitive",
    },
  };

  return elementInfo[element]!;
}

/**
 * Search signs by keyword
 */
export function searchSigns(query: string): ZodiacSignPageData[] {
  const lowerQuery = query.toLowerCase();

  return Object.values(ZODIAC_SIGN_DATA).filter((sign) => {
    // Search in name
    if (sign.name.toLowerCase().includes(lowerQuery)) return true;

    // Search in keywords
    if (sign.keywords.some((k) => k.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    // Search in description
    if (sign.description.toLowerCase().includes(lowerQuery)) return true;

    // Search in archetype
    if (sign.archetype.toLowerCase().includes(lowerQuery)) return true;

    // Search in motto
    if (sign.motto.toLowerCase().includes(lowerQuery)) return true;

    return false;
  });
}
