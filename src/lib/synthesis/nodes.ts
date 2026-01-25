/**
 * Node data for the synthesis graph.
 *
 * Imports from existing modules and transforms into graph nodes.
 */

import {
  DIGIT_PLANETARY_META,
  ZERO_META,
  PLANET_META,
  ELEMENT_META,
  GEOMETRY_META,
  type Planet,
  type Element,
  type PlatonicSolid,
} from "@/lib/numbers/planetary";
import { ZODIAC_SIGNS, ZODIAC_META, type ZodiacSign } from "@/lib/astrology";
import { getAllArchetypes } from "@/lib/archetypes";

import type {
  NumberNode,
  PlanetNode,
  ElementNode,
  GeometryNode,
  ZodiacSignNode,
  HouseNode,
  ArchetypeNode,
  ModalityNode,
  Modality,
} from "./types";

/**
 * Create all number nodes (0-9)
 */
export function createNumberNodes(): NumberNode[] {
  const nodes: NumberNode[] = [];

  // Zero is special
  nodes.push({
    type: "number",
    id: "0",
    name: "Zero",
    digit: 0,
    planetId: null,
    elementId: "ether",
    traits: ZERO_META.traits,
    confidence: "high",
  });

  // Digits 1-9
  for (const [digitStr, meta] of Object.entries(DIGIT_PLANETARY_META)) {
    const digit = parseInt(digitStr, 10);
    nodes.push({
      type: "number",
      id: String(digit),
      name: String(digit),
      digit,
      planetId: meta.planet,
      elementId: meta.element,
      traits: meta.traits,
      confidence: meta.confidence,
    });
  }

  return nodes;
}

/**
 * Create all planet nodes
 */
export function createPlanetNodes(): PlanetNode[] {
  const nodes: PlanetNode[] = [];

  for (const [planetId, meta] of Object.entries(PLANET_META)) {
    const planet = planetId as Planet;

    // Find digit for this planet
    let digit = 0;
    for (const [digitStr, digitMeta] of Object.entries(DIGIT_PLANETARY_META)) {
      if (digitMeta.planet === planet) {
        digit = parseInt(digitStr, 10);
        break;
      }
    }

    // Determine nature
    let nature: "benefic" | "malefic" | "variable" = "variable";
    if (["jupiter", "venus"].includes(planet)) {
      nature = "benefic";
    } else if (["saturn", "mars"].includes(planet)) {
      nature = "malefic";
    }

    nodes.push({
      type: "planet",
      id: planet,
      name: meta.name,
      symbol: meta.symbol,
      elementId: meta.element,
      digit,
      dayOfWeek: meta.dayOfWeek,
      archetype: meta.archetype,
      nature,
    });
  }

  return nodes;
}

/**
 * Create all element nodes
 */
export function createElementNodes(): ElementNode[] {
  const nodes: ElementNode[] = [];

  for (const [elementId, meta] of Object.entries(ELEMENT_META)) {
    nodes.push({
      type: "element",
      id: elementId as Element,
      name: meta.name,
      quality: meta.quality,
      direction: meta.direction,
      geometryId: meta.geometry,
    });
  }

  return nodes;
}

/**
 * Create all geometry nodes (Platonic solids)
 */
export function createGeometryNodes(): GeometryNode[] {
  const nodes: GeometryNode[] = [];

  for (const [geometryId, meta] of Object.entries(GEOMETRY_META)) {
    nodes.push({
      type: "geometry",
      id: geometryId as PlatonicSolid,
      name: meta.name,
      faces: meta.faces,
      elementId: meta.element,
      description: meta.description,
    });
  }

  return nodes;
}

/**
 * Create all zodiac sign nodes
 */
export function createZodiacSignNodes(): ZodiacSignNode[] {
  const nodes: ZodiacSignNode[] = [];

  for (const sign of ZODIAC_SIGNS) {
    const meta = ZODIAC_META[sign];
    nodes.push({
      type: "zodiacSign",
      id: sign,
      name: sign.charAt(0).toUpperCase() + sign.slice(1),
      symbol: meta.glyph,
      elementId: meta.element,
      modality: meta.modality,
      rulingPlanetId: meta.ruler,
    });
  }

  return nodes;
}

/**
 * House life areas and keywords
 */
const HOUSE_DATA: Array<{
  number: number;
  lifeArea: string;
  keywords: string[];
}> = [
  { number: 1, lifeArea: "Self", keywords: ["identity", "appearance", "first impressions"] },
  { number: 2, lifeArea: "Resources", keywords: ["money", "possessions", "values"] },
  { number: 3, lifeArea: "Communication", keywords: ["siblings", "learning", "writing"] },
  { number: 4, lifeArea: "Home", keywords: ["family", "roots", "emotional security"] },
  { number: 5, lifeArea: "Creativity", keywords: ["romance", "children", "self-expression"] },
  { number: 6, lifeArea: "Service", keywords: ["health", "daily work", "routines"] },
  { number: 7, lifeArea: "Partnership", keywords: ["marriage", "contracts", "one-on-one"] },
  { number: 8, lifeArea: "Transformation", keywords: ["death/rebirth", "intimacy", "occult"] },
  { number: 9, lifeArea: "Philosophy", keywords: ["higher education", "travel", "religion"] },
  { number: 10, lifeArea: "Career", keywords: ["public image", "achievement", "authority"] },
  { number: 11, lifeArea: "Community", keywords: ["friends", "groups", "humanitarian ideals"] },
  { number: 12, lifeArea: "Transcendence", keywords: ["unconscious", "solitude", "dreams"] },
];

/**
 * Create all house nodes
 */
export function createHouseNodes(): HouseNode[] {
  const naturalSigns: ZodiacSign[] = [
    "aries", "taurus", "gemini", "cancer",
    "leo", "virgo", "libra", "scorpio",
    "sagittarius", "capricorn", "aquarius", "pisces",
  ];

  return HOUSE_DATA.map((house, index) => ({
    type: "house" as const,
    id: String(house.number),
    name: `${house.number}${getOrdinalSuffix(house.number)} House`,
    number: house.number,
    lifeArea: house.lifeArea,
    keywords: house.keywords,
    naturalSignId: naturalSigns[index]!,
    elementId: ZODIAC_META[naturalSigns[index]!].element,
  }));
}

/**
 * Get ordinal suffix for a number
 */
function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return "th";
  const lastDigit = n % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}

/**
 * Create all archetype nodes
 */
export function createArchetypeNodes(): ArchetypeNode[] {
  return getAllArchetypes().map((archetype) => ({
    type: "archetype" as const,
    id: archetype.slug,
    name: archetype.name,
    number: archetype.number,
    hebrewLetter: archetype.hebrewLetter.letter,
    hebrewLetterMeaning: archetype.hebrewLetter.meaning,
    primaryAttribution: archetype.primaryAttribution,
    attributionType: archetype.attributionType,
    elementId: archetype.element,
    planetId: archetype.planet,
    zodiacId: archetype.zodiac,
    confidence: archetype.confidence,
    keywords: archetype.keywords,
    jungianArchetype: archetype.jungianArchetype,
  }));
}

/**
 * Modality metadata
 */
const MODALITY_DATA: Record<Modality, { quality: string; keywords: string[] }> = {
  cardinal: {
    quality: "Initiating",
    keywords: ["leadership", "action", "beginnings", "drive", "ambition"],
  },
  fixed: {
    quality: "Stabilizing",
    keywords: ["persistence", "determination", "loyalty", "resistance", "depth"],
  },
  mutable: {
    quality: "Adapting",
    keywords: ["flexibility", "change", "communication", "versatility", "transition"],
  },
};

/**
 * Create all modality nodes
 */
export function createModalityNodes(): ModalityNode[] {
  const modalities: Modality[] = ["cardinal", "fixed", "mutable"];

  return modalities.map((modality) => ({
    type: "modality" as const,
    id: modality,
    name: modality.charAt(0).toUpperCase() + modality.slice(1),
    quality: MODALITY_DATA[modality].quality,
    keywords: MODALITY_DATA[modality].keywords,
  }));
}
