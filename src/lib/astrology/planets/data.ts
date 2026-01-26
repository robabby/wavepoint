/**
 * Planet page data for content pages.
 *
 * Using PLANET_PAGE_DATA to avoid collision with PLANET_META exports in:
 * - src/lib/astrology/constants.ts
 * - src/lib/numbers/planetary.ts
 *
 * Starting with Saturn as the template planet. Additional planets will be
 * added after the Saturn page is validated.
 */

import type { PlanetPageData, ContentPlanetId } from "./types";
import {
  PTOLEMY_TETRABIBLOS,
  LILLY_CHRISTIAN_ASTROLOGY,
  GREENE_SATURN,
  VEDIC_TRADITION,
  AGRIPPA_OCCULT_PHILOSOPHY,
  MODERN_WESTERN_CONSENSUS,
  HERMETIC_TRADITION,
  ARROYO_ASTROLOGY_PSYCHOLOGY,
  HAND_HOROSCOPE_SYMBOLS,
  RUDHYAR_ASTROLOGY_PERSONALITY,
  PSYCHOLOGICAL_ASTROLOGY,
} from "./citations";

// ═══════════════════════════════════════════════════════════════════════════
// SUN
// ═══════════════════════════════════════════════════════════════════════════

const SUN: PlanetPageData = {
  id: "sun",
  name: "Sun",
  glyph: "☉",
  archetype: "The King",
  keywords: ["identity", "vitality", "purpose", "will", "ego", "creativity"],
  element: "fire",
  dayOfWeek: "Sunday",
  metal: "Gold",
  type: "luminary",

  rulerships: [
    {
      sign: "Leo",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Aries",
      type: "exaltation",
      degree: 19,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Libra",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aquarius",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 1,
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Western"],
    confidence: "established",
    relatedPatterns: ["1", "11", "111", "1111", "10", "19", "28"],
  },

  geometry: {
    geometry: "tetrahedron",
    rationale:
      "The tetrahedron embodies the Sun's fire element: transformation, will, and the spark of creation. Its four faces represent the minimum solid form, befitting the Sun as the source from which all planetary energies emanate.",
    confidence: "consensus",
  },

  sacredPattern: {
    pattern: "circle-dot",
    name: "Circle Dot",
    rationale:
      "The Sun's astrological glyph (☉) is itself the circle-dot—the most primordial symbol in sacred geometry. This direct symbolic identity represents the divine spark, the point of creation from which all form emanates. In alchemy, the same symbol represents gold, the solar metal.",
    confidence: "established",
  },

  coreArchetype: {
    primaryClaim:
      "The Sun represents core identity, vitality, and conscious purpose. In the natal chart, the Sun shows what we are becoming—our essential self striving toward actualization.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      ARROYO_ASTROLOGY_PSYCHOLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, the Sun-1-Fire triad represents the principle of individuation. As 1 is the first number, the Sun is the first luminary—both symbolize beginnings, initiative, and the emergence of self from potential.",
  },

  elementalNature: {
    primaryClaim:
      "The Sun's hot, dry nature aligns with the fire element. This manifests as radiance, vitality, and the transformative power that sustains life. The Sun gives light by which all else is seen.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, HERMETIC_TRADITION],
    confidence: "established",
  },

  metaDescription:
    "Explore the Sun in astrology: identity, vitality, and conscious purpose. Discover connections to the number 1, fire element, and the tetrahedron in sacred geometry.",
  seoKeywords: [
    "sun astrology",
    "sun meaning",
    "sun numerology",
    "sun number 1",
    "sun identity",
    "sun vitality",
    "sun leo",
    "sun sign meaning",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// MOON
// ═══════════════════════════════════════════════════════════════════════════

const MOON: PlanetPageData = {
  id: "moon",
  name: "Moon",
  glyph: "☽",
  archetype: "The Mother",
  keywords: ["emotion", "intuition", "nurturing", "cycles", "memory", "instinct"],
  element: "water",
  dayOfWeek: "Monday",
  metal: "Silver",
  type: "luminary",

  rulerships: [
    {
      sign: "Cancer",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Taurus",
      type: "exaltation",
      degree: 3,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Scorpio",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Capricorn",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 2,
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Kabbalah"],
    confidence: "established",
    relatedPatterns: ["2", "22", "222", "2222", "11", "20", "29"],
  },

  geometry: {
    geometry: "icosahedron",
    rationale:
      "The icosahedron embodies the Moon's water element: emotion, intuition, and flow. With 20 faces, it is the most complex Platonic solid, reflecting the Moon's multifaceted influence on the unconscious depths.",
    confidence: "consensus",
  },

  sacredPattern: {
    pattern: "vesica-piscis",
    name: "Vesica Piscis",
    rationale:
      "The vesica piscis—formed by two overlapping circles—represents the divine feminine, the portal of creation, and the space between worlds. Its association with the Moon reflects lunar themes of receptivity, cycles, and the generative feminine principle.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "The Moon represents our emotional nature, instinctual responses, and unconscious patterns. In the natal chart, the Moon shows how we seek security and what makes us feel nurtured.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      ARROYO_ASTROLOGY_PSYCHOLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, the Moon-2-Water triad represents the principle of reflection and duality. As 2 follows 1, the Moon reflects the Sun's light—together they form the primal pair from which all other planetary meanings emerge.",
  },

  elementalNature: {
    primaryClaim:
      "The Moon's cold, moist nature aligns with the water element. This manifests as receptivity, changeability, and the rhythmic tides of emotion that ebb and flow through our inner world.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, HERMETIC_TRADITION],
    confidence: "established",
  },

  metaDescription:
    "Explore the Moon in astrology: emotion, intuition, and the unconscious. Discover connections to the number 2, water element, and the icosahedron in sacred geometry.",
  seoKeywords: [
    "moon astrology",
    "moon meaning",
    "moon numerology",
    "moon number 2",
    "moon emotion",
    "moon intuition",
    "moon cancer",
    "moon sign meaning",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// MERCURY
// ═══════════════════════════════════════════════════════════════════════════

const MERCURY: PlanetPageData = {
  id: "mercury",
  name: "Mercury",
  glyph: "☿",
  archetype: "The Messenger",
  keywords: ["communication", "intellect", "adaptability", "commerce", "travel", "learning"],
  element: "air",
  dayOfWeek: "Wednesday",
  metal: "Mercury (Quicksilver)",
  type: "personal",

  rulerships: [
    {
      sign: "Gemini",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Virgo",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Virgo",
      type: "exaltation",
      degree: 15,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Pisces",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Sagittarius",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 5,
    traditions: ["Vedic", "Chaldean", "Lo Shu"],
    confidence: "established",
    relatedPatterns: ["5", "55", "555", "5555", "14", "23", "32", "41"],
  },

  geometry: {
    geometry: "octahedron",
    rationale:
      "The octahedron embodies Mercury's air element: intellect, communication, and mental agility. As the dual of the cube, it represents Mercury's role as mediator between realms—translating earthly concerns into ideas and back again.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "Mercury represents the mind's capacity to perceive, process, and communicate. In the natal chart, Mercury shows how we think, learn, and exchange information with the world.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      HAND_HOROSCOPE_SYMBOLS,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, the Mercury-5-Air triad represents the principle of mediation. Five sits at the center of the 1-9 sequence, just as Mercury bridges Sun and Moon, inner and outer, idea and expression.",
  },

  elementalNature: {
    primaryClaim:
      "Mercury is traditionally considered neutral or mutable in elemental nature, taking on the qualities of whatever it contacts. However, its association with intellect and communication aligns it closely with the air element.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, ARROYO_ASTROLOGY_PSYCHOLOGY],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Mercury in astrology: communication, intellect, and adaptability. Discover connections to the number 5, air element, and the octahedron in sacred geometry.",
  seoKeywords: [
    "mercury astrology",
    "mercury meaning",
    "mercury numerology",
    "mercury number 5",
    "mercury communication",
    "mercury retrograde",
    "mercury gemini",
    "mercury virgo",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// VENUS
// ═══════════════════════════════════════════════════════════════════════════

const VENUS: PlanetPageData = {
  id: "venus",
  name: "Venus",
  glyph: "♀",
  archetype: "The Lover",
  keywords: ["love", "beauty", "harmony", "values", "pleasure", "attraction"],
  element: "earth",
  dayOfWeek: "Friday",
  metal: "Copper",
  type: "personal",

  rulerships: [
    {
      sign: "Taurus",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Libra",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Pisces",
      type: "exaltation",
      degree: 27,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Virgo",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aries",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Scorpio",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 6,
    traditions: ["Vedic", "Chaldean", "Lo Shu"],
    confidence: "established",
    relatedPatterns: ["6", "66", "666", "6666", "15", "24", "33", "42"],
  },

  geometry: {
    geometry: "dodecahedron",
    rationale:
      "The dodecahedron, with its 12 pentagonal faces, embodies Venus's connection to the golden ratio and divine proportion. This cosmic solid represents beauty, harmony, and the aesthetic principles Venus governs.",
    confidence: "majority",
  },

  sacredPattern: {
    pattern: "pentagram",
    name: "Pentagram",
    rationale:
      "Over 8 years, Venus traces a near-perfect five-pointed star (pentagram) against the zodiac through its inferior conjunctions with the Sun. This astronomical fact connects Venus to the pentagram, which itself embodies the golden ratio—the mathematical principle of beauty Venus governs.",
    confidence: "established",
  },

  coreArchetype: {
    primaryClaim:
      "Venus represents our capacity for love, appreciation of beauty, and what we value. In the natal chart, Venus shows how we attract, what gives us pleasure, and our approach to relationships.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      ARROYO_ASTROLOGY_PSYCHOLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, Venus-6-Earth represents harmony made manifest. Six is the first perfect number (1+2+3=6), and Venus brings abstract ideals of beauty into tangible form through art, relationship, and sensory pleasure.",
  },

  elementalNature: {
    primaryClaim:
      "Venus's cold, moist nature has been associated with both earth (through Taurus) and air (through Libra). The earth association emphasizes sensory pleasure and material beauty; the air emphasizes social harmony and aesthetic ideals.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, HERMETIC_TRADITION],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Venus in astrology: love, beauty, and values. Discover connections to the number 6, the golden ratio, and the dodecahedron in sacred geometry.",
  seoKeywords: [
    "venus astrology",
    "venus meaning",
    "venus numerology",
    "venus number 6",
    "venus love",
    "venus beauty",
    "venus taurus",
    "venus libra",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// MARS
// ═══════════════════════════════════════════════════════════════════════════

const MARS: PlanetPageData = {
  id: "mars",
  name: "Mars",
  glyph: "♂",
  archetype: "The Warrior",
  keywords: ["action", "courage", "drive", "passion", "assertion", "energy"],
  element: "fire",
  dayOfWeek: "Tuesday",
  metal: "Iron",
  type: "personal",

  rulerships: [
    {
      sign: "Aries",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Scorpio",
      traditional: true,
      modern: false, // Pluto is modern ruler
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Capricorn",
      type: "exaltation",
      degree: 28,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Cancer",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Libra",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Taurus",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 9,
    traditions: ["Vedic", "Chaldean", "Lo Shu", "Kabbalah"],
    confidence: "established",
    relatedPatterns: ["9", "99", "999", "9999", "18", "27", "36", "45"],
  },

  geometry: {
    geometry: "tetrahedron",
    rationale:
      "The tetrahedron embodies Mars's fire element: action, transformation, and primal force. Its sharp points and triangular faces evoke the piercing, directed energy that Mars represents.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "Mars represents our drive, desire nature, and capacity for action. In the natal chart, Mars shows how we assert ourselves, pursue what we want, and handle conflict.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      ARROYO_ASTROLOGY_PSYCHOLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, Mars-9-Fire represents completion through action. Nine is the final single digit, and Mars provides the drive to bring cycles to completion. The warrior energy is not merely aggressive but purposeful.",
  },

  elementalNature: {
    primaryClaim:
      "Mars's hot, dry nature strongly aligns with the fire element. This manifests as heat, energy, and the capacity to initiate change through direct action. Mars cuts through, separates, and transforms.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, HERMETIC_TRADITION],
    confidence: "established",
  },

  metaDescription:
    "Explore Mars in astrology: action, courage, and drive. Discover connections to the number 9, fire element, and the tetrahedron in sacred geometry.",
  seoKeywords: [
    "mars astrology",
    "mars meaning",
    "mars numerology",
    "mars number 9",
    "mars action",
    "mars warrior",
    "mars aries",
    "mars scorpio",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// JUPITER
// ═══════════════════════════════════════════════════════════════════════════

const JUPITER: PlanetPageData = {
  id: "jupiter",
  name: "Jupiter",
  glyph: "♃",
  archetype: "The Sage",
  keywords: ["expansion", "wisdom", "abundance", "growth", "faith", "optimism"],
  element: "ether",
  dayOfWeek: "Thursday",
  metal: "Tin",
  type: "social",

  rulerships: [
    {
      sign: "Sagittarius",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Pisces",
      traditional: true,
      modern: false, // Neptune is modern ruler
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Cancer",
      type: "exaltation",
      degree: 15,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Capricorn",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Gemini",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Virgo",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 3,
    traditions: ["Vedic", "Chaldean", "Lo Shu"],
    confidence: "established",
    relatedPatterns: ["3", "33", "333", "3333", "12", "21", "30", "39"],
  },

  geometry: {
    geometry: "dodecahedron",
    rationale:
      "The dodecahedron, associated with ether/spirit, embodies Jupiter's cosmic expansion and philosophical nature. Its 12 pentagonal faces echo Jupiter's connection to higher meaning and the celestial order.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "Jupiter represents the principle of expansion, growth, and the search for meaning. In the natal chart, Jupiter shows where we seek to grow, what we have faith in, and how we find wisdom.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      HAND_HOROSCOPE_SYMBOLS,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, Jupiter-3-Ether represents expansive manifestation. Three is the number of creation (thesis, antithesis, synthesis), and Jupiter provides the expansive vision that turns possibility into abundance.",
  },

  elementalNature: {
    primaryClaim:
      "Jupiter's hot, moist nature has been variously associated with fire, air, or ether. The ether association reflects Jupiter's transcendent, philosophical quality—reaching beyond the four earthly elements toward cosmic understanding.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, HERMETIC_TRADITION],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Jupiter in astrology: expansion, wisdom, and abundance. Discover connections to the number 3, ether element, and the dodecahedron in sacred geometry.",
  seoKeywords: [
    "jupiter astrology",
    "jupiter meaning",
    "jupiter numerology",
    "jupiter number 3",
    "jupiter expansion",
    "jupiter wisdom",
    "jupiter sagittarius",
    "jupiter pisces",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SATURN
// ═══════════════════════════════════════════════════════════════════════════

const SATURN: PlanetPageData = {
  id: "saturn",
  name: "Saturn",
  glyph: "♄",
  archetype: "The Great Teacher",
  keywords: ["discipline", "structure", "time", "karma", "mastery", "limits"],
  element: "earth",
  dayOfWeek: "Saturday",
  metal: "Lead",
  type: "social",

  rulerships: [
    {
      sign: "Capricorn",
      traditional: true,
      modern: true,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aquarius",
      traditional: true,
      modern: false, // Uranus is modern ruler
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  dignities: [
    {
      sign: "Libra",
      type: "exaltation",
      degree: 21,
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Aries",
      type: "fall",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Cancer",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
    {
      sign: "Leo",
      type: "detriment",
      source: PTOLEMY_TETRABIBLOS,
    },
  ],

  numerology: {
    digit: 8,
    traditions: ["Vedic", "Chaldean", "Kabbalah", "Lo Shu"],
    confidence: "established",
    relatedPatterns: ["8", "88", "888", "8888", "44", "17", "26", "35"],
  },

  geometry: {
    geometry: "cube",
    rationale:
      "The cube (hexahedron) embodies Saturn's earth element qualities: stability, structure, and grounded manifestation. Its six faces represent Saturn's mastery over the material realm.",
    confidence: "consensus",
  },

  coreArchetype: {
    primaryClaim:
      "Saturn represents the principle of limitation, structure, and time. In the natal chart, Saturn shows where we encounter obstacles that ultimately teach us discipline and mastery.",
    sources: [
      PTOLEMY_TETRABIBLOS,
      LILLY_CHRISTIAN_ASTROLOGY,
      GREENE_SATURN,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "established",
    wavepointNote:
      "In our synthesis, Saturn's role as teacher connects to the number 8's themes of karmic lessons and material mastery. The Saturn-8-Earth triad forms one of the most consistent correspondences across traditions.",
  },

  elementalNature: {
    primaryClaim:
      "Saturn's cold, dry nature aligns with the earth element. This manifests as crystallization, contraction, and the formation of lasting structures in both physical and psychological realms.",
    sources: [PTOLEMY_TETRABIBLOS, VEDIC_TRADITION, AGRIPPA_OCCULT_PHILOSOPHY],
    confidence: "established",
  },

  metaDescription:
    "Explore Saturn in astrology: the Great Teacher of discipline, time, and karmic lessons. Discover connections to the number 8, earth element, and the cube in sacred geometry.",
  seoKeywords: [
    "saturn astrology",
    "saturn meaning",
    "saturn numerology",
    "saturn number 8",
    "saturn great teacher",
    "saturn karma",
    "saturn discipline",
    "saturn capricorn",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// URANUS
// ═══════════════════════════════════════════════════════════════════════════

const URANUS: PlanetPageData = {
  id: "uranus",
  name: "Uranus",
  glyph: "⛢",
  archetype: "The Awakener",
  keywords: ["revolution", "innovation", "freedom", "disruption", "awakening", "originality"],
  element: "air",
  type: "transpersonal",

  rulerships: [
    {
      sign: "Aquarius",
      traditional: false,
      modern: true,
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  dignities: [
    {
      sign: "Scorpio",
      type: "exaltation",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Taurus",
      type: "fall",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Leo",
      type: "detriment",
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  numerology: {
    digit: 4,
    traditions: ["Vedic (as Rahu)", "Modern Western"],
    confidence: "majority",
    relatedPatterns: ["4", "44", "444", "4444", "13", "22", "31", "40"],
  },

  geometry: {
    geometry: "cube",
    rationale:
      "The cube represents structure and foundation, yet Uranus shatters existing structures to build anew. This paradox reflects Uranus's role: disrupting old forms so that more authentic structures can emerge.",
    confidence: "majority",
  },

  coreArchetype: {
    primaryClaim:
      "Uranus represents sudden insight, revolutionary change, and liberation from outworn structures. In the natal chart, Uranus shows where we seek freedom, express individuality, and experience breakthrough.",
    sources: [
      RUDHYAR_ASTROLOGY_PERSONALITY,
      HAND_HOROSCOPE_SYMBOLS,
      PSYCHOLOGICAL_ASTROLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, Uranus-4-Air represents structural innovation. Four is the number of material foundation, and Uranus challenges us to examine whether our foundations serve our authentic self or merely convention.",
  },

  elementalNature: {
    primaryClaim:
      "Uranus is associated with the air element through its rulership of Aquarius. This manifests as electrical, sudden insights—lightning bolts of awareness that shatter fixed patterns of thought.",
    sources: [PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Uranus in astrology: revolution, awakening, and liberation. Discover connections to the number 4, air element, and sudden transformation.",
  seoKeywords: [
    "uranus astrology",
    "uranus meaning",
    "uranus numerology",
    "uranus number 4",
    "uranus revolution",
    "uranus awakening",
    "uranus aquarius",
    "uranus transit",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// NEPTUNE
// ═══════════════════════════════════════════════════════════════════════════

const NEPTUNE: PlanetPageData = {
  id: "neptune",
  name: "Neptune",
  glyph: "♆",
  archetype: "The Mystic",
  keywords: ["dreams", "spirituality", "transcendence", "imagination", "dissolution", "compassion"],
  element: "water",
  type: "transpersonal",

  rulerships: [
    {
      sign: "Pisces",
      traditional: false,
      modern: true,
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  dignities: [
    {
      sign: "Leo",
      type: "exaltation",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Aquarius",
      type: "fall",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Virgo",
      type: "detriment",
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  numerology: {
    digit: 7,
    traditions: ["Vedic (as Ketu)", "Modern Western"],
    confidence: "majority",
    relatedPatterns: ["7", "77", "777", "7777", "16", "25", "34", "43"],
  },

  geometry: {
    geometry: "icosahedron",
    rationale:
      "The icosahedron embodies Neptune's water element: the dissolution of boundaries and flow between states. Its many faces reflect Neptune's capacity to shift form, dissolving the line between reality and dream.",
    confidence: "majority",
  },

  coreArchetype: {
    primaryClaim:
      "Neptune represents the longing for transcendence, spiritual connection, and dissolution of ego boundaries. In the natal chart, Neptune shows where we seek the ideal, experience inspiration, and may fall into illusion.",
    sources: [
      RUDHYAR_ASTROLOGY_PERSONALITY,
      HAND_HOROSCOPE_SYMBOLS,
      PSYCHOLOGICAL_ASTROLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, Neptune-7-Water represents spiritual transcendence. Seven is the seeker's number, and Neptune dissolves the boundaries that separate self from source, revealing the unity beneath apparent division.",
  },

  elementalNature: {
    primaryClaim:
      "Neptune is associated with the water element through its rulership of Pisces. This manifests as dissolution, permeability, and the capacity to merge with larger wholes—for better (compassion, inspiration) or worse (confusion, escapism).",
    sources: [PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Neptune in astrology: dreams, spirituality, and transcendence. Discover connections to the number 7, water element, and the dissolution of boundaries.",
  seoKeywords: [
    "neptune astrology",
    "neptune meaning",
    "neptune numerology",
    "neptune number 7",
    "neptune dreams",
    "neptune spirituality",
    "neptune pisces",
    "neptune transit",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PLUTO
// ═══════════════════════════════════════════════════════════════════════════

const PLUTO: PlanetPageData = {
  id: "pluto",
  name: "Pluto",
  glyph: "♇",
  archetype: "The Transformer",
  keywords: ["transformation", "death/rebirth", "power", "shadow", "regeneration", "depth"],
  element: "water",
  type: "transpersonal",

  rulerships: [
    {
      sign: "Scorpio",
      traditional: false,
      modern: true,
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  dignities: [
    {
      sign: "Leo",
      type: "exaltation",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Taurus",
      type: "detriment",
      source: MODERN_WESTERN_CONSENSUS,
    },
    {
      sign: "Aquarius",
      type: "fall",
      source: MODERN_WESTERN_CONSENSUS,
    },
  ],

  numerology: {
    digit: null, // Pluto has no classical numerological digit
    traditions: [],
    confidence: "wavepoint-only",
    relatedPatterns: [],
  },

  geometry: {
    geometry: "icosahedron",
    rationale:
      "Through Scorpio's water element, Pluto connects to the icosahedron—the solid of emotional depth and dissolution of boundaries. Where the icosahedron typically represents flow and merging, Pluto adds the dimension of transformation through destruction and rebirth.",
    confidence: "wavepoint-only",
  },

  coreArchetype: {
    primaryClaim:
      "Pluto represents the principle of transformation through death and rebirth, the encounter with power, and the journey into shadow. In the natal chart, Pluto shows where we experience profound change, face our deepest fears, and access regenerative power.",
    sources: [
      RUDHYAR_ASTROLOGY_PERSONALITY,
      PSYCHOLOGICAL_ASTROLOGY,
      MODERN_WESTERN_CONSENSUS,
    ],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, Pluto represents transformation without numerical correspondence—a reminder that not all cosmic forces map neatly to the 1-9 digit system. Pluto operates beyond conventional categories, as befits the lord of the underworld.",
  },

  elementalNature: {
    primaryClaim:
      "Pluto is associated with the water element through its rulership of Scorpio. This manifests as emotional intensity, psychological depth, and the capacity to penetrate beneath surfaces to hidden truths. Pluto's water is not gentle—it is the water that erodes mountains and carves canyons.",
    sources: [PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  metaDescription:
    "Explore Pluto in astrology: transformation, power, and the shadow. Discover connections to the water element, Scorpio, and the icosahedron in sacred geometry.",
  seoKeywords: [
    "pluto astrology",
    "pluto meaning",
    "pluto transformation",
    "pluto scorpio",
    "pluto shadow",
    "pluto power",
    "pluto transit",
    "pluto death rebirth",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PLANET PAGE DATA COLLECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All planet page data indexed by planet ID.
 *
 * Note: Using PLANET_PAGE_DATA name to avoid collision with PLANET_META
 * in astrology/constants.ts and numbers/planetary.ts.
 */
export const PLANET_PAGE_DATA: Record<ContentPlanetId, PlanetPageData> = {
  sun: SUN,
  moon: MOON,
  mercury: MERCURY,
  venus: VENUS,
  mars: MARS,
  jupiter: JUPITER,
  saturn: SATURN,
  uranus: URANUS,
  neptune: NEPTUNE,
  pluto: PLUTO,
};

/**
 * Get all planets that have page data.
 * Returns only planets with complete content.
 */
export function getAvailablePlanets(): PlanetPageData[] {
  return Object.values(PLANET_PAGE_DATA).filter(
    (p): p is PlanetPageData => p !== undefined
  );
}

/**
 * Get planet IDs that have page data available.
 */
export function getAvailablePlanetIds(): ContentPlanetId[] {
  return Object.keys(PLANET_PAGE_DATA) as ContentPlanetId[];
}
