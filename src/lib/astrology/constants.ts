/**
 * Astrology constants - Zodiac signs, planets, aspects, and related definitions.
 *
 * Based on traditional Western/Tropical astrology with Whole Sign house system.
 */

/**
 * Zodiac signs in order (0 = Aries, 11 = Pisces)
 */
export const ZODIAC_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

/**
 * Zodiac sign metadata including symbols and elements
 */
export const ZODIAC_META: Record<
  ZodiacSign,
  {
    symbol: string;
    glyph: string;
    element: "fire" | "earth" | "air" | "water";
    modality: "cardinal" | "fixed" | "mutable";
    ruler: PlanetId;
    degreesStart: number;
  }
> = {
  aries: {
    symbol: "Ram",
    glyph: "\u2648",
    element: "fire",
    modality: "cardinal",
    ruler: "mars",
    degreesStart: 0,
  },
  taurus: {
    symbol: "Bull",
    glyph: "\u2649",
    element: "earth",
    modality: "fixed",
    ruler: "venus",
    degreesStart: 30,
  },
  gemini: {
    symbol: "Twins",
    glyph: "\u264A",
    element: "air",
    modality: "mutable",
    ruler: "mercury",
    degreesStart: 60,
  },
  cancer: {
    symbol: "Crab",
    glyph: "\u264B",
    element: "water",
    modality: "cardinal",
    ruler: "moon",
    degreesStart: 90,
  },
  leo: {
    symbol: "Lion",
    glyph: "\u264C",
    element: "fire",
    modality: "fixed",
    ruler: "sun",
    degreesStart: 120,
  },
  virgo: {
    symbol: "Virgin",
    glyph: "\u264D",
    element: "earth",
    modality: "mutable",
    ruler: "mercury",
    degreesStart: 150,
  },
  libra: {
    symbol: "Scales",
    glyph: "\u264E",
    element: "air",
    modality: "cardinal",
    ruler: "venus",
    degreesStart: 180,
  },
  scorpio: {
    symbol: "Scorpion",
    glyph: "\u264F",
    element: "water",
    modality: "fixed",
    ruler: "pluto",
    degreesStart: 210,
  },
  sagittarius: {
    symbol: "Archer",
    glyph: "\u2650",
    element: "fire",
    modality: "mutable",
    ruler: "jupiter",
    degreesStart: 240,
  },
  capricorn: {
    symbol: "Sea-Goat",
    glyph: "\u2651",
    element: "earth",
    modality: "cardinal",
    ruler: "saturn",
    degreesStart: 270,
  },
  aquarius: {
    symbol: "Water Bearer",
    glyph: "\u2652",
    element: "air",
    modality: "fixed",
    ruler: "uranus",
    degreesStart: 300,
  },
  pisces: {
    symbol: "Fish",
    glyph: "\u2653",
    element: "water",
    modality: "mutable",
    ruler: "neptune",
    degreesStart: 330,
  },
};

/**
 * Planets supported by the ephemeris (traditional + modern)
 */
export const PLANETS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;

export type PlanetId = (typeof PLANETS)[number];

/**
 * Extended celestial bodies (includes points and asteroids)
 */
export const CELESTIAL_BODIES = [
  ...PLANETS,
  "chiron",
  "northnode",
  "southnode",
  "lilith",
] as const;

export type CelestialBodyId = (typeof CELESTIAL_BODIES)[number];

/**
 * Planet metadata including symbols
 */
export const PLANET_META: Record<
  CelestialBodyId,
  {
    name: string;
    glyph: string;
    type: "luminary" | "personal" | "social" | "transpersonal" | "point" | "asteroid";
  }
> = {
  sun: { name: "Sun", glyph: "\u2609", type: "luminary" },
  moon: { name: "Moon", glyph: "\u263D", type: "luminary" },
  mercury: { name: "Mercury", glyph: "\u263F", type: "personal" },
  venus: { name: "Venus", glyph: "\u2640", type: "personal" },
  mars: { name: "Mars", glyph: "\u2642", type: "personal" },
  jupiter: { name: "Jupiter", glyph: "\u2643", type: "social" },
  saturn: { name: "Saturn", glyph: "\u2644", type: "social" },
  uranus: { name: "Uranus", glyph: "\u2645", type: "transpersonal" },
  neptune: { name: "Neptune", glyph: "\u2646", type: "transpersonal" },
  pluto: { name: "Pluto", glyph: "\u2647", type: "transpersonal" },
  chiron: { name: "Chiron", glyph: "\u26B7", type: "asteroid" },
  northnode: { name: "North Node", glyph: "\u260A", type: "point" },
  southnode: { name: "South Node", glyph: "\u260B", type: "point" },
  lilith: { name: "Black Moon Lilith", glyph: "\u26B8", type: "point" },
};

/**
 * Major angles in a chart
 */
export const ANGLES = ["ascendant", "midheaven"] as const;

export type AngleId = (typeof ANGLES)[number];

/**
 * Aspect types (major and minor)
 */
export const ASPECT_TYPES = {
  major: ["conjunction", "opposition", "trine", "square", "sextile"] as const,
  minor: ["quincunx", "semi-sextile", "semi-square", "quintile", "septile"] as const,
};

export type MajorAspect = (typeof ASPECT_TYPES.major)[number];
export type MinorAspect = (typeof ASPECT_TYPES.minor)[number];
export type AspectType = MajorAspect | MinorAspect;

/**
 * Aspect metadata including angles and default orbs
 */
export const ASPECT_META: Record<
  AspectType,
  {
    name: string;
    angle: number;
    defaultOrb: number;
    symbol: string;
    nature: "harmonious" | "challenging" | "neutral";
  }
> = {
  conjunction: {
    name: "Conjunction",
    angle: 0,
    defaultOrb: 8,
    symbol: "\u260C",
    nature: "neutral",
  },
  opposition: {
    name: "Opposition",
    angle: 180,
    defaultOrb: 8,
    symbol: "\u260D",
    nature: "challenging",
  },
  trine: {
    name: "Trine",
    angle: 120,
    defaultOrb: 8,
    symbol: "\u25B3",
    nature: "harmonious",
  },
  square: {
    name: "Square",
    angle: 90,
    defaultOrb: 7,
    symbol: "\u25A1",
    nature: "challenging",
  },
  sextile: {
    name: "Sextile",
    angle: 60,
    defaultOrb: 6,
    symbol: "\u26B9",
    nature: "harmonious",
  },
  quincunx: {
    name: "Quincunx",
    angle: 150,
    defaultOrb: 5,
    symbol: "\u26BB",
    nature: "challenging",
  },
  "semi-sextile": {
    name: "Semi-sextile",
    angle: 30,
    defaultOrb: 2,
    symbol: "\u26BA",
    nature: "neutral",
  },
  "semi-square": {
    name: "Semi-square",
    angle: 45,
    defaultOrb: 2,
    symbol: "\u2220",
    nature: "challenging",
  },
  quintile: {
    name: "Quintile",
    angle: 72,
    defaultOrb: 2,
    symbol: "Q",
    nature: "harmonious",
  },
  septile: {
    name: "Septile",
    angle: 51.43,
    defaultOrb: 1,
    symbol: "S",
    nature: "neutral",
  },
};

/**
 * House systems supported by the ephemeris
 */
export const HOUSE_SYSTEMS = [
  "whole-sign",
  "placidus",
  "koch",
  "campanus",
  "regiomontanus",
  "topocentric",
  "equal-house",
] as const;

export type HouseSystem = (typeof HOUSE_SYSTEMS)[number];

/**
 * Default house system for WavePoint (Whole Sign for simplicity)
 */
export const DEFAULT_HOUSE_SYSTEM: HouseSystem = "whole-sign";

/**
 * Zodiac systems
 */
export const ZODIAC_SYSTEMS = ["tropical", "sidereal"] as const;

export type ZodiacSystem = (typeof ZODIAC_SYSTEMS)[number];

/**
 * Default zodiac system (Tropical for Western astrology)
 */
export const DEFAULT_ZODIAC_SYSTEM: ZodiacSystem = "tropical";
