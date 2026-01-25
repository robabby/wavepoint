/**
 * Planetary associations for number patterns.
 *
 * This module provides the esoteric layer connecting numbers to planets,
 * elements, and sacred geometry based on cross-traditional research from:
 * - Vedic numerology
 * - Chaldean numerology
 * - Chinese Lo Shu grid
 * - Kabbalah Sephiroth
 * - Agrippa's magic squares
 *
 * @see Areas/WavePoint/Research/Number-Planet-Associations.md (Obsidian)
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Classical planets plus modern additions for 4 and 7.
 */
export type Planet =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus" // Modern (4) - or Rahu in Vedic
  | "neptune"; // Modern (7) - or Ketu in Vedic

/**
 * Classical elements mapped from Platonic solids.
 */
export type Element = "fire" | "water" | "air" | "earth" | "ether";

/**
 * Platonic solids - the five regular convex polyhedra.
 */
export type PlatonicSolid =
  | "tetrahedron"
  | "cube"
  | "octahedron"
  | "icosahedron"
  | "dodecahedron";

/**
 * Confidence level for planetary associations.
 * Based on how many traditions agree.
 */
export type ConfidenceLevel = "very-high" | "high" | "moderate";

/**
 * Complete planetary metadata for a base digit (1-9).
 */
export interface PlanetaryDigitMeta {
  /** The digit this applies to */
  digit: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /** Primary planet association */
  planet: Planet;
  /** Unicode symbol for the planet */
  symbol: string;
  /** Classical element */
  element: Element;
  /** Associated Platonic solid (if applicable) */
  geometry?: PlatonicSolid;
  /** Confidence based on cross-traditional agreement */
  confidence: ConfidenceLevel;
  /** Day of the week (for classical planets) */
  dayOfWeek?: string;
  /** Agrippa magic square size (if this digit relates to a square root) */
  agrippaSquare?: {
    size: number;
    cells: number;
    magicConstant: number;
    totalSum: number;
  };
  /** Key traits from numerology */
  traits: string[];
  /** Traditions that agree on this association */
  traditions: string[];
}

/**
 * Planetary association for a number pattern.
 * Derived from the pattern's constituent digits.
 */
export interface PatternPlanetaryMeta {
  /** Primary planet (from dominant/base digit) */
  primaryPlanet: Planet;
  /** Primary planet symbol */
  primarySymbol: string;
  /** All planets present in the pattern */
  planets: Planet[];
  /** Dominant element */
  primaryElement: Element;
  /** All elements present */
  elements: Element[];
  /** Associated geometry (if single-digit based) */
  geometry?: PlatonicSolid;
  /** Special Agrippa significance */
  agrippaNote?: string;
  /** Planetary energy description */
  energyDescription: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// BASE DIGIT PLANETARY DATA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Planetary associations for digits 1-9.
 * This is the foundational mapping from which pattern associations are derived.
 *
 * Sources:
 * - Vedic: Sun=1, Moon=2, Jupiter=3, Rahu=4, Mercury=5, Venus=6, Ketu=7, Saturn=8, Mars=9
 * - Chaldean: Matches Vedic for 1-3, 5-6, 8-9
 * - Lo Shu: Sun=1, Moon=2, Jupiter=3, Venus=6, Saturn=8, Mars=9
 * - Agrippa: Saturn=3×3, Jupiter=4×4, Mars=5×5, Sun=6×6, Venus=7×7, Mercury=8×8, Moon=9×9
 */
export const DIGIT_PLANETARY_META: Record<number, PlanetaryDigitMeta> = {
  1: {
    digit: 1,
    planet: "sun",
    symbol: "☉",
    element: "fire",
    geometry: "tetrahedron",
    confidence: "very-high",
    dayOfWeek: "Sunday",
    traits: ["leadership", "initiative", "individuality", "creativity", "will"],
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Western"],
  },
  2: {
    digit: 2,
    planet: "moon",
    symbol: "☽",
    element: "water",
    geometry: "icosahedron",
    confidence: "very-high",
    dayOfWeek: "Monday",
    traits: ["intuition", "emotion", "receptivity", "cycles", "reflection"],
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Kabbalah"],
  },
  3: {
    digit: 3,
    planet: "jupiter",
    symbol: "♃",
    element: "ether",
    geometry: "dodecahedron",
    confidence: "high",
    dayOfWeek: "Thursday",
    agrippaSquare: {
      size: 3,
      cells: 9,
      magicConstant: 15,
      totalSum: 45,
    },
    traits: ["expansion", "wisdom", "optimism", "growth", "abundance"],
    traditions: ["Vedic", "Chaldean", "Lo Shu"],
  },
  4: {
    digit: 4,
    planet: "uranus", // Rahu in Vedic
    symbol: "⛢",
    element: "earth",
    geometry: "cube",
    confidence: "moderate",
    agrippaSquare: {
      size: 4,
      cells: 16,
      magicConstant: 34,
      totalSum: 136,
    },
    traits: ["disruption", "innovation", "karma", "structure", "rebellion"],
    traditions: ["Vedic (Rahu)", "Modern Western (Uranus)"],
  },
  5: {
    digit: 5,
    planet: "mercury",
    symbol: "☿",
    element: "air",
    geometry: "octahedron",
    confidence: "high",
    dayOfWeek: "Wednesday",
    agrippaSquare: {
      size: 5,
      cells: 25,
      magicConstant: 65,
      totalSum: 325,
    },
    traits: ["communication", "adaptability", "intellect", "change", "travel"],
    traditions: ["Vedic", "Chaldean", "Lo Shu center"],
  },
  6: {
    digit: 6,
    planet: "venus",
    symbol: "♀",
    element: "earth",
    confidence: "high",
    dayOfWeek: "Friday",
    agrippaSquare: {
      size: 6,
      cells: 36,
      magicConstant: 111, // Notable: matches angel number 111!
      totalSum: 666, // Notable: matches angel number 666!
    },
    traits: ["love", "beauty", "harmony", "nurturing", "balance"],
    traditions: ["Vedic", "Chaldean", "Lo Shu"],
  },
  7: {
    digit: 7,
    planet: "neptune", // Ketu in Vedic
    symbol: "♆",
    element: "water",
    confidence: "moderate",
    agrippaSquare: {
      size: 7,
      cells: 49,
      magicConstant: 175,
      totalSum: 1225,
    },
    traits: ["spirituality", "mysticism", "transcendence", "intuition", "detachment"],
    traditions: ["Vedic (Ketu)", "Modern Western (Neptune)"],
  },
  8: {
    digit: 8,
    planet: "saturn",
    symbol: "♄",
    element: "earth",
    geometry: "cube",
    confidence: "very-high",
    dayOfWeek: "Saturday",
    agrippaSquare: {
      size: 8,
      cells: 64,
      magicConstant: 260,
      totalSum: 2080,
    },
    traits: ["discipline", "karma", "time", "structure", "mastery"],
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Kabbalah"],
  },
  9: {
    digit: 9,
    planet: "mars",
    symbol: "♂",
    element: "fire",
    geometry: "tetrahedron",
    confidence: "very-high",
    dayOfWeek: "Tuesday",
    agrippaSquare: {
      size: 9,
      cells: 81,
      magicConstant: 369,
      totalSum: 3321,
    },
    traits: ["action", "courage", "energy", "completion", "will"],
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Kabbalah"],
  },
};

/**
 * Zero has special significance - pure potential.
 */
export const ZERO_META = {
  digit: 0 as const,
  symbol: "○",
  element: "ether" as Element,
  traits: ["potential", "void", "infinity", "source", "wholeness"],
  description: "The void before creation, infinite potential, the source from which all emerges.",
};

// ═══════════════════════════════════════════════════════════════════════════
// PLANET METADATA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Extended metadata for each planet.
 */
export const PLANET_META: Record<Planet, {
  name: string;
  symbol: string;
  element: Element;
  dayOfWeek?: string;
  color: string;
  metal?: string;
  chakra?: string;
  archetype: string;
}> = {
  sun: {
    name: "Sun",
    symbol: "☉",
    element: "fire",
    dayOfWeek: "Sunday",
    color: "gold",
    metal: "gold",
    chakra: "Solar Plexus",
    archetype: "The King/Leader",
  },
  moon: {
    name: "Moon",
    symbol: "☽",
    element: "water",
    dayOfWeek: "Monday",
    color: "silver",
    metal: "silver",
    chakra: "Sacral",
    archetype: "The Mother/Intuitive",
  },
  mercury: {
    name: "Mercury",
    symbol: "☿",
    element: "air",
    dayOfWeek: "Wednesday",
    color: "purple",
    metal: "mercury",
    chakra: "Throat",
    archetype: "The Messenger/Trickster",
  },
  venus: {
    name: "Venus",
    symbol: "♀",
    element: "earth",
    dayOfWeek: "Friday",
    color: "green",
    metal: "copper",
    chakra: "Heart",
    archetype: "The Lover/Artist",
  },
  mars: {
    name: "Mars",
    symbol: "♂",
    element: "fire",
    dayOfWeek: "Tuesday",
    color: "red",
    metal: "iron",
    chakra: "Root",
    archetype: "The Warrior/Champion",
  },
  jupiter: {
    name: "Jupiter",
    symbol: "♃",
    element: "ether",
    dayOfWeek: "Thursday",
    color: "royal blue",
    metal: "tin",
    chakra: "Third Eye",
    archetype: "The Sage/Benefactor",
  },
  saturn: {
    name: "Saturn",
    symbol: "♄",
    element: "earth",
    dayOfWeek: "Saturday",
    color: "black",
    metal: "lead",
    chakra: "Root",
    archetype: "The Elder/Teacher",
  },
  uranus: {
    name: "Uranus",
    symbol: "⛢",
    element: "air",
    color: "electric blue",
    archetype: "The Revolutionary/Awakener",
  },
  neptune: {
    name: "Neptune",
    symbol: "♆",
    element: "water",
    color: "sea green",
    archetype: "The Mystic/Dreamer",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ELEMENT & GEOMETRY METADATA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Element metadata with Platonic solid associations.
 */
export const ELEMENT_META: Record<Element, {
  name: string;
  geometry: PlatonicSolid;
  quality: string;
  direction: string;
}> = {
  fire: {
    name: "Fire",
    geometry: "tetrahedron",
    quality: "Transformation, will, action",
    direction: "South",
  },
  water: {
    name: "Water",
    geometry: "icosahedron",
    quality: "Emotion, intuition, flow",
    direction: "West",
  },
  air: {
    name: "Air",
    geometry: "octahedron",
    quality: "Intellect, communication, movement",
    direction: "East",
  },
  earth: {
    name: "Earth",
    geometry: "cube",
    quality: "Stability, manifestation, grounding",
    direction: "North",
  },
  ether: {
    name: "Ether (Spirit)",
    geometry: "dodecahedron",
    quality: "Transcendence, unity, cosmos",
    direction: "Center",
  },
};

/**
 * Platonic solid metadata.
 */
export const GEOMETRY_META: Record<PlatonicSolid, {
  name: string;
  faces: number;
  element: Element;
  planets: Planet[];
  description: string;
}> = {
  tetrahedron: {
    name: "Tetrahedron",
    faces: 4,
    element: "fire",
    planets: ["sun", "mars"],
    description: "The simplest Platonic solid. Represents transformation and the spark of creation.",
  },
  cube: {
    name: "Cube (Hexahedron)",
    faces: 6,
    element: "earth",
    planets: ["saturn"],
    description: "The most stable solid. Represents structure, foundation, and material manifestation.",
  },
  octahedron: {
    name: "Octahedron",
    faces: 8,
    element: "air",
    planets: ["mercury"],
    description: "The dual of the cube. Represents intellect, communication, and mental agility.",
  },
  icosahedron: {
    name: "Icosahedron",
    faces: 20,
    element: "water",
    planets: ["moon", "neptune"],
    description: "The most complex regular solid. Represents emotion, intuition, and the unconscious.",
  },
  dodecahedron: {
    name: "Dodecahedron",
    faces: 12,
    element: "ether",
    planets: ["jupiter", "venus"],
    description: "The cosmic solid. Represents the universe, spirit, and divine proportion.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// AGRIPPA MAGIC SQUARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Agrippa's planetary magic squares.
 * Note: These planet assignments differ from the Vedic digit-planet system.
 * Agrippa assigned squares to planets by size (3×3 to 9×9).
 */
export const AGRIPPA_MAGIC_SQUARES: Record<Planet, {
  size: number;
  cells: number;
  magicConstant: number;
  totalSum: number;
} | undefined> = {
  saturn: { size: 3, cells: 9, magicConstant: 15, totalSum: 45 },
  jupiter: { size: 4, cells: 16, magicConstant: 34, totalSum: 136 },
  mars: { size: 5, cells: 25, magicConstant: 65, totalSum: 325 },
  sun: { size: 6, cells: 36, magicConstant: 111, totalSum: 666 },
  venus: { size: 7, cells: 49, magicConstant: 175, totalSum: 1225 },
  mercury: { size: 8, cells: 64, magicConstant: 260, totalSum: 2080 },
  moon: { size: 9, cells: 81, magicConstant: 369, totalSum: 3321 },
  // Modern planets don't have classical magic squares
  uranus: undefined,
  neptune: undefined,
};

/**
 * Special Agrippa magic square connections to angel numbers.
 */
export const AGRIPPA_ANGEL_NUMBER_CONNECTIONS = {
  111: {
    planet: "sun" as Planet,
    note: "111 is the magic constant of the Sun's 6×6 magic square. This makes 111 intrinsically solar.",
  },
  666: {
    planet: "sun" as Planet,
    note: "666 is the total sum of the Sun's 6×6 magic square (all numbers 1-36). Despite cultural associations, this is a profoundly solar number representing material-spiritual integration.",
  },
  369: {
    planet: "moon" as Planet,
    note: "369 is the magic constant of the Moon's 9×9 magic square. Tesla's famous '369' obsession connects to lunar energy.",
  },
  45: {
    planet: "saturn" as Planet,
    note: "45 is the total sum of Saturn's 3×3 magic square (Lo Shu). Represents completion of Saturnian lessons.",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the dominant digit from a number pattern.
 * For repeating patterns (111, 222), returns that digit.
 * For mixed patterns, returns the most frequent digit.
 * On ties, returns the first digit encountered in the pattern.
 */
export function getDominantDigit(pattern: string): number {
  // Remove zeros for dominant digit calculation (zeros are neutral/potential)
  const nonZeroDigits = pattern.replace(/0/g, "");

  if (nonZeroDigits.length === 0) {
    return 0; // All zeros
  }

  // Count frequency of each digit and track first occurrence
  const frequency: Record<string, number> = {};
  const firstOccurrence: Record<string, number> = {};

  for (let i = 0; i < nonZeroDigits.length; i++) {
    const digit = nonZeroDigits[i]!;
    frequency[digit] = (frequency[digit] ?? 0) + 1;
    if (firstOccurrence[digit] === undefined) {
      firstOccurrence[digit] = i;
    }
  }

  // Find most frequent, preferring earlier occurrence on ties
  let maxDigit = nonZeroDigits[0] ?? "1";
  let maxCount = 0;

  for (const [digit, count] of Object.entries(frequency)) {
    if (count > maxCount ||
        (count === maxCount && firstOccurrence[digit]! < firstOccurrence[maxDigit]!)) {
      maxCount = count;
      maxDigit = digit;
    }
  }

  return parseInt(maxDigit, 10);
}

/**
 * Get all unique digits from a pattern.
 */
export function getUniqueDigits(pattern: string): number[] {
  const unique = new Set<number>();
  for (const char of pattern) {
    unique.add(parseInt(char, 10));
  }
  return Array.from(unique).sort((a, b) => a - b);
}

/**
 * Get planetary metadata for a base digit.
 */
export function getDigitPlanetaryMeta(digit: number): PlanetaryDigitMeta | undefined {
  if (digit >= 1 && digit <= 9) {
    return DIGIT_PLANETARY_META[digit];
  }
  return undefined;
}

/**
 * Compute the planetary metadata for a number pattern.
 * Derives associations from the pattern's constituent digits.
 */
export function getPatternPlanetaryMeta(pattern: string): PatternPlanetaryMeta {
  const dominantDigit = getDominantDigit(pattern);
  const uniqueDigits = getUniqueDigits(pattern);

  // Get primary planet from dominant digit
  const primaryMeta = dominantDigit > 0 ? DIGIT_PLANETARY_META[dominantDigit] : undefined;
  const primaryPlanet = primaryMeta?.planet ?? "sun";
  const primarySymbol = primaryMeta?.symbol ?? "☉";
  const primaryElement = primaryMeta?.element ?? "fire";

  // Collect all planets and elements
  const planets = new Set<Planet>();
  const elements = new Set<Element>();

  for (const digit of uniqueDigits) {
    if (digit === 0) {
      elements.add("ether"); // Zero = ether/potential
      continue;
    }
    const meta = DIGIT_PLANETARY_META[digit];
    if (meta) {
      planets.add(meta.planet);
      elements.add(meta.element);
    }
  }

  // Check for special Agrippa connections (predefined notable patterns)
  const patternNum = parseInt(pattern, 10);
  let agrippaNote: string | undefined;

  const agrippaKey = pattern as "111" | "666" | "369" | "45";
  if (agrippaKey in AGRIPPA_ANGEL_NUMBER_CONNECTIONS) {
    agrippaNote = AGRIPPA_ANGEL_NUMBER_CONNECTIONS[agrippaKey].note;
  }

  // Also check if pattern matches any magic constant or total from Agrippa's squares
  if (!agrippaNote) {
    for (const [planet, square] of Object.entries(AGRIPPA_MAGIC_SQUARES)) {
      if (square) {
        if (patternNum === square.magicConstant) {
          agrippaNote = `${pattern} is the magic constant of ${PLANET_META[planet as Planet].name}'s ${square.size}×${square.size} magic square.`;
          break;
        } else if (patternNum === square.totalSum) {
          agrippaNote = `${pattern} is the total sum of ${PLANET_META[planet as Planet].name}'s ${square.size}×${square.size} magic square.`;
          break;
        }
      }
    }
  }

  // Generate energy description
  const energyDescription = generateEnergyDescription(
    primaryPlanet,
    Array.from(planets),
    primaryElement,
    dominantDigit,
    pattern
  );

  return {
    primaryPlanet,
    primarySymbol,
    planets: Array.from(planets),
    primaryElement,
    elements: Array.from(elements),
    geometry: primaryMeta?.geometry,
    agrippaNote,
    energyDescription,
  };
}

/**
 * Generate a human-readable energy description.
 */
function generateEnergyDescription(
  primaryPlanet: Planet,
  allPlanets: Planet[],
  primaryElement: Element,
  dominantDigit: number,
  pattern: string
): string {
  const planetMeta = PLANET_META[primaryPlanet];
  const isRepeating = new Set(pattern.replace(/0/g, "")).size === 1 && pattern.length > 1;
  const hasZero = pattern.includes("0");

  let description = "";

  if (isRepeating) {
    const repeatCount = pattern.length;
    const intensity = repeatCount >= 4 ? "profoundly" : repeatCount >= 3 ? "strongly" : "doubly";
    description = `This pattern ${intensity} amplifies ${planetMeta.name} energy—${planetMeta.archetype.toLowerCase()}.`;
  } else if (allPlanets.length === 1) {
    description = `Carries the pure essence of ${planetMeta.name}—${planetMeta.archetype.toLowerCase()}.`;
  } else {
    const otherPlanets = allPlanets
      .filter((p) => p !== primaryPlanet)
      .map((p) => PLANET_META[p].name)
      .join(", ");
    description = `${planetMeta.name} leads, with influences from ${otherPlanets}.`;
  }

  if (hasZero) {
    description += " The presence of zero adds infinite potential.";
  }

  return description;
}

/**
 * Get the planetary symbol for display.
 */
export function getPlanetSymbol(planet: Planet): string {
  return PLANET_META[planet].symbol;
}

/**
 * Get the element associated with a planet.
 */
export function getPlanetElement(planet: Planet): Element {
  return PLANET_META[planet].element;
}

/**
 * Check if a pattern has a special Agrippa connection.
 */
export function hasAgrippaConnection(pattern: string): boolean {
  const meta = getPatternPlanetaryMeta(pattern);
  return !!meta.agrippaNote;
}
