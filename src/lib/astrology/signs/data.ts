/**
 * Zodiac Sign data - 12 signs of the zodiac.
 *
 * This module extends ZODIAC_META with content fields for display
 * on the signs pages.
 */

import { ZODIAC_SIGNS, ZODIAC_META, type ZodiacSign } from "../constants";
import type { ZodiacSignPageData, Polarity } from "./types";

/**
 * Derive polarity from element.
 * - Positive (masculine/yang): fire, air
 * - Negative (feminine/yin): earth, water
 */
function getPolarity(element: string): Polarity {
  return element === "fire" || element === "air" ? "positive" : "negative";
}

/**
 * Complete data for all 12 zodiac signs.
 */
export const ZODIAC_SIGN_DATA: Record<ZodiacSign, ZodiacSignPageData> = {
  aries: {
    id: "aries",
    name: "Aries",
    glyph: ZODIAC_META.aries.glyph,
    symbol: ZODIAC_META.aries.symbol,
    element: ZODIAC_META.aries.element,
    modality: ZODIAC_META.aries.modality,
    polarity: getPolarity(ZODIAC_META.aries.element),
    ruler: ZODIAC_META.aries.ruler,
    degreesStart: ZODIAC_META.aries.degreesStart,
    dateRange: {
      start: { month: 3, day: 21 },
      end: { month: 4, day: 19 },
      formatted: "March 21 - April 19",
    },
    archetype: "The Pioneer",
    motto: "I am",
    keywords: ["courage", "initiative", "leadership", "independence", "action", "passion"],
    description:
      "Aries is the first sign of the zodiac, embodying the primal energy of new beginnings and self-assertion. As a cardinal fire sign ruled by Mars, Aries represents the spark that initiates action, the courage to forge new paths, and the drive to establish individual identity.\n\nThe Ram charges forward with unbridled enthusiasm, undeterred by obstacles. Aries energy is direct, honest, and refreshingly straightforward. This sign teaches us about the power of taking initiative, the importance of healthy self-interest, and the necessity of fighting for what we believe in.",
    traits: {
      strengths: [
        "Courageous and willing to take risks",
        "Natural leadership abilities",
        "Energetic and enthusiastic",
        "Honest and direct in communication",
        "Independent and self-reliant",
        "Quick to act and make decisions",
      ],
      challenges: [
        "Impulsive without considering consequences",
        "Can be impatient with slower processes",
        "Tendency toward self-centeredness",
        "Quick temper when frustrated",
        "Difficulty with sustained effort",
        "May overlook others' feelings",
      ],
    },
    metaDescription:
      "Explore Aries, the first zodiac sign. Learn about Aries traits, strengths, challenges, and its connection to Mars, fire element, and cardinal modality.",
    seoKeywords: [
      "aries zodiac sign",
      "aries traits",
      "aries personality",
      "aries mars",
      "fire sign aries",
      "cardinal sign",
    ],
  },

  taurus: {
    id: "taurus",
    name: "Taurus",
    glyph: ZODIAC_META.taurus.glyph,
    symbol: ZODIAC_META.taurus.symbol,
    element: ZODIAC_META.taurus.element,
    modality: ZODIAC_META.taurus.modality,
    polarity: getPolarity(ZODIAC_META.taurus.element),
    ruler: ZODIAC_META.taurus.ruler,
    degreesStart: ZODIAC_META.taurus.degreesStart,
    dateRange: {
      start: { month: 4, day: 20 },
      end: { month: 5, day: 20 },
      formatted: "April 20 - May 20",
    },
    archetype: "The Builder",
    motto: "I have",
    keywords: ["stability", "sensuality", "patience", "determination", "beauty", "material mastery"],
    description:
      "Taurus is the second sign of the zodiac, representing the consolidation and embodiment of energy into tangible form. As a fixed earth sign ruled by Venus, Taurus embodies the principles of stability, sensual pleasure, and the patient accumulation of resources.\n\nThe Bull moves slowly but with tremendous purpose, building lasting foundations through persistent effort. Taurus energy grounds us in our physical bodies and the material world, teaching us to appreciate beauty, cultivate patience, and create genuine security through steady, reliable action.",
    traits: {
      strengths: [
        "Patient and persistent in pursuits",
        "Reliable and dependable",
        "Strong appreciation for beauty",
        "Excellent with money and resources",
        "Grounded and practical",
        "Loyal and devoted in relationships",
      ],
      challenges: [
        "Stubborn resistance to change",
        "Can be possessive of people and things",
        "Tendency toward overindulgence",
        "Slow to adapt to new situations",
        "May prioritize comfort over growth",
        "Can hold grudges for too long",
      ],
    },
    metaDescription:
      "Explore Taurus, the second zodiac sign. Learn about Taurus traits, strengths, challenges, and its connection to Venus, earth element, and fixed modality.",
    seoKeywords: [
      "taurus zodiac sign",
      "taurus traits",
      "taurus personality",
      "taurus venus",
      "earth sign taurus",
      "fixed sign",
    ],
  },

  gemini: {
    id: "gemini",
    name: "Gemini",
    glyph: ZODIAC_META.gemini.glyph,
    symbol: ZODIAC_META.gemini.symbol,
    element: ZODIAC_META.gemini.element,
    modality: ZODIAC_META.gemini.modality,
    polarity: getPolarity(ZODIAC_META.gemini.element),
    ruler: ZODIAC_META.gemini.ruler,
    degreesStart: ZODIAC_META.gemini.degreesStart,
    dateRange: {
      start: { month: 5, day: 21 },
      end: { month: 6, day: 20 },
      formatted: "May 21 - June 20",
    },
    archetype: "The Messenger",
    motto: "I think",
    keywords: ["communication", "curiosity", "adaptability", "intellect", "versatility", "connection"],
    description:
      "Gemini is the third sign of the zodiac, representing the awakening of mind and the desire to connect, communicate, and understand. As a mutable air sign ruled by Mercury, Gemini embodies intellectual curiosity, verbal agility, and the ability to see multiple perspectives simultaneously.\n\nThe Twins symbolize the dual nature of existence and the mind's capacity to bridge different worlds. Gemini energy is quick, versatile, and endlessly curious, teaching us about the power of words, the value of diverse perspectives, and the importance of remaining mentally flexible.",
    traits: {
      strengths: [
        "Excellent communication skills",
        "Quick-witted and intelligent",
        "Adaptable to any situation",
        "Curious about everything",
        "Socially engaging and charming",
        "Ability to multitask effectively",
      ],
      challenges: [
        "Scattered focus and energy",
        "Can be superficial in knowledge",
        "Restless and easily bored",
        "Difficulty with commitment",
        "May come across as inconsistent",
        "Tendency to gossip or be unreliable",
      ],
    },
    metaDescription:
      "Explore Gemini, the third zodiac sign. Learn about Gemini traits, strengths, challenges, and its connection to Mercury, air element, and mutable modality.",
    seoKeywords: [
      "gemini zodiac sign",
      "gemini traits",
      "gemini personality",
      "gemini mercury",
      "air sign gemini",
      "mutable sign",
    ],
  },

  cancer: {
    id: "cancer",
    name: "Cancer",
    glyph: ZODIAC_META.cancer.glyph,
    symbol: ZODIAC_META.cancer.symbol,
    element: ZODIAC_META.cancer.element,
    modality: ZODIAC_META.cancer.modality,
    polarity: getPolarity(ZODIAC_META.cancer.element),
    ruler: ZODIAC_META.cancer.ruler,
    degreesStart: ZODIAC_META.cancer.degreesStart,
    dateRange: {
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 },
      formatted: "June 21 - July 22",
    },
    archetype: "The Nurturer",
    motto: "I feel",
    keywords: ["nurturing", "intuition", "protection", "emotion", "home", "memory"],
    description:
      "Cancer is the fourth sign of the zodiac, representing the realm of emotion, family, and the need for security and belonging. As a cardinal water sign ruled by the Moon, Cancer embodies the principles of nurturing, emotional intelligence, and the protective instincts that create safe spaces for growth.\n\nThe Crab carries its home on its back, symbolizing the deep connection to roots, heritage, and emotional foundations. Cancer energy teaches us about the power of vulnerability, the importance of honoring our feelings, and the sacred responsibility of caring for those we love.",
    traits: {
      strengths: [
        "Deeply caring and nurturing",
        "Strong emotional intelligence",
        "Protective of loved ones",
        "Excellent memory for details",
        "Intuitive and empathic",
        "Creates welcoming environments",
      ],
      challenges: [
        "Overly sensitive to criticism",
        "Tendency to cling to the past",
        "Can be moody and withdrawn",
        "Difficulty letting go of hurts",
        "May be overprotective",
        "Passive-aggressive when wounded",
      ],
    },
    metaDescription:
      "Explore Cancer, the fourth zodiac sign. Learn about Cancer traits, strengths, challenges, and its connection to the Moon, water element, and cardinal modality.",
    seoKeywords: [
      "cancer zodiac sign",
      "cancer traits",
      "cancer personality",
      "cancer moon",
      "water sign cancer",
      "cardinal sign",
    ],
  },

  leo: {
    id: "leo",
    name: "Leo",
    glyph: ZODIAC_META.leo.glyph,
    symbol: ZODIAC_META.leo.symbol,
    element: ZODIAC_META.leo.element,
    modality: ZODIAC_META.leo.modality,
    polarity: getPolarity(ZODIAC_META.leo.element),
    ruler: ZODIAC_META.leo.ruler,
    degreesStart: ZODIAC_META.leo.degreesStart,
    dateRange: {
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 },
      formatted: "July 23 - August 22",
    },
    archetype: "The Performer",
    motto: "I will",
    keywords: ["creativity", "confidence", "generosity", "drama", "leadership", "self-expression"],
    description:
      "Leo is the fifth sign of the zodiac, representing the full flowering of individual self-expression and the radiant power of the creative spirit. As a fixed fire sign ruled by the Sun, Leo embodies the principles of dignity, generosity, and the courage to shine authentically in the world.\n\nThe Lion commands attention not through force but through the natural magnetism of authentic presence. Leo energy teaches us about the importance of creative self-expression, the nobility of a generous heart, and the responsibility that comes with leadership and visibility.",
    traits: {
      strengths: [
        "Natural charisma and presence",
        "Generous and warm-hearted",
        "Creative and expressive",
        "Loyal and protective of loved ones",
        "Confident and courageous",
        "Inspiring leadership qualities",
      ],
      challenges: [
        "Need for constant attention",
        "Pride can become arrogance",
        "Difficulty accepting criticism",
        "Tendency to be dramatic",
        "May dominate conversations",
        "Can be stubborn about being right",
      ],
    },
    metaDescription:
      "Explore Leo, the fifth zodiac sign. Learn about Leo traits, strengths, challenges, and its connection to the Sun, fire element, and fixed modality.",
    seoKeywords: [
      "leo zodiac sign",
      "leo traits",
      "leo personality",
      "leo sun",
      "fire sign leo",
      "fixed sign",
    ],
  },

  virgo: {
    id: "virgo",
    name: "Virgo",
    glyph: ZODIAC_META.virgo.glyph,
    symbol: ZODIAC_META.virgo.symbol,
    element: ZODIAC_META.virgo.element,
    modality: ZODIAC_META.virgo.modality,
    polarity: getPolarity(ZODIAC_META.virgo.element),
    ruler: ZODIAC_META.virgo.ruler,
    degreesStart: ZODIAC_META.virgo.degreesStart,
    dateRange: {
      start: { month: 8, day: 23 },
      end: { month: 9, day: 22 },
      formatted: "August 23 - September 22",
    },
    archetype: "The Analyst",
    motto: "I analyze",
    keywords: ["service", "precision", "health", "improvement", "discernment", "humility"],
    description:
      "Virgo is the sixth sign of the zodiac, representing the refinement of self through service, analysis, and the pursuit of excellence. As a mutable earth sign ruled by Mercury, Virgo embodies the principles of practical wisdom, attention to detail, and the humble dedication to making things work better.\n\nThe Virgin symbolizes purity of intention and the discriminating intelligence that separates the essential from the non-essential. Virgo energy teaches us about the sacred nature of service, the value of continuous improvement, and the importance of caring for our bodies and daily routines.",
    traits: {
      strengths: [
        "Excellent attention to detail",
        "Practical problem-solving skills",
        "Dedicated to service and helping",
        "Highly organized and efficient",
        "Health-conscious and careful",
        "Reliable and hardworking",
      ],
      challenges: [
        "Overly critical of self and others",
        "Tendency toward perfectionism",
        "Can be anxious about details",
        "Difficulty seeing the big picture",
        "May come across as cold or distant",
        "Prone to worry and overthinking",
      ],
    },
    metaDescription:
      "Explore Virgo, the sixth zodiac sign. Learn about Virgo traits, strengths, challenges, and its connection to Mercury, earth element, and mutable modality.",
    seoKeywords: [
      "virgo zodiac sign",
      "virgo traits",
      "virgo personality",
      "virgo mercury",
      "earth sign virgo",
      "mutable sign",
    ],
  },

  libra: {
    id: "libra",
    name: "Libra",
    glyph: ZODIAC_META.libra.glyph,
    symbol: ZODIAC_META.libra.symbol,
    element: ZODIAC_META.libra.element,
    modality: ZODIAC_META.libra.modality,
    polarity: getPolarity(ZODIAC_META.libra.element),
    ruler: ZODIAC_META.libra.ruler,
    degreesStart: ZODIAC_META.libra.degreesStart,
    dateRange: {
      start: { month: 9, day: 23 },
      end: { month: 10, day: 22 },
      formatted: "September 23 - October 22",
    },
    archetype: "The Diplomat",
    motto: "I balance",
    keywords: ["harmony", "partnership", "beauty", "justice", "balance", "cooperation"],
    description:
      "Libra is the seventh sign of the zodiac, representing the awakening to relationships and the quest for balance, beauty, and justice. As a cardinal air sign ruled by Venus, Libra embodies the principles of harmony, aesthetic refinement, and the civilizing power of cooperation.\n\nThe Scales symbolize the constant weighing and balancing required to maintain equilibrium in a world of opposing forces. Libra energy teaches us about the art of compromise, the importance of beauty in daily life, and the pursuit of fairness in all our dealings.",
    traits: {
      strengths: [
        "Natural diplomatic abilities",
        "Strong sense of fairness",
        "Appreciation for beauty and art",
        "Skilled at seeing all perspectives",
        "Charming and socially adept",
        "Committed to partnership",
      ],
      challenges: [
        "Indecisive and people-pleasing",
        "Avoids conflict at all costs",
        "Can be superficial or vain",
        "Difficulty with self-assertion",
        "May lose self in relationships",
        "Tendency to be passive-aggressive",
      ],
    },
    metaDescription:
      "Explore Libra, the seventh zodiac sign. Learn about Libra traits, strengths, challenges, and its connection to Venus, air element, and cardinal modality.",
    seoKeywords: [
      "libra zodiac sign",
      "libra traits",
      "libra personality",
      "libra venus",
      "air sign libra",
      "cardinal sign",
    ],
  },

  scorpio: {
    id: "scorpio",
    name: "Scorpio",
    glyph: ZODIAC_META.scorpio.glyph,
    symbol: ZODIAC_META.scorpio.symbol,
    element: ZODIAC_META.scorpio.element,
    modality: ZODIAC_META.scorpio.modality,
    polarity: getPolarity(ZODIAC_META.scorpio.element),
    ruler: ZODIAC_META.scorpio.ruler,
    degreesStart: ZODIAC_META.scorpio.degreesStart,
    dateRange: {
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 },
      formatted: "October 23 - November 21",
    },
    archetype: "The Transformer",
    motto: "I desire",
    keywords: ["transformation", "intensity", "power", "depth", "mystery", "regeneration"],
    description:
      "Scorpio is the eighth sign of the zodiac, representing the depths of emotional and psychological experience and the transformative power of crisis and renewal. As a fixed water sign ruled by Pluto (traditionally Mars), Scorpio embodies the principles of penetrating insight, emotional depth, and the phoenix-like ability to rise from ashes.\n\nThe Scorpion navigates the underworld of the psyche, unafraid of the shadows that others avoid. Scorpio energy teaches us about the power of emotional truth, the necessity of facing our fears, and the profound transformations that become possible when we embrace change.",
    traits: {
      strengths: [
        "Deeply insightful and perceptive",
        "Intense loyalty and devotion",
        "Powerful will and determination",
        "Ability to transform and regenerate",
        "Comfortable with life's mysteries",
        "Strategic and resourceful",
      ],
      challenges: [
        "Can be jealous and possessive",
        "Tendency toward manipulation",
        "Difficulty forgiving betrayal",
        "Obsessive about control",
        "May use others' vulnerabilities",
        "Prone to power struggles",
      ],
    },
    metaDescription:
      "Explore Scorpio, the eighth zodiac sign. Learn about Scorpio traits, strengths, challenges, and its connection to Pluto, water element, and fixed modality.",
    seoKeywords: [
      "scorpio zodiac sign",
      "scorpio traits",
      "scorpio personality",
      "scorpio pluto",
      "water sign scorpio",
      "fixed sign",
    ],
  },

  sagittarius: {
    id: "sagittarius",
    name: "Sagittarius",
    glyph: ZODIAC_META.sagittarius.glyph,
    symbol: ZODIAC_META.sagittarius.symbol,
    element: ZODIAC_META.sagittarius.element,
    modality: ZODIAC_META.sagittarius.modality,
    polarity: getPolarity(ZODIAC_META.sagittarius.element),
    ruler: ZODIAC_META.sagittarius.ruler,
    degreesStart: ZODIAC_META.sagittarius.degreesStart,
    dateRange: {
      start: { month: 11, day: 22 },
      end: { month: 12, day: 21 },
      formatted: "November 22 - December 21",
    },
    archetype: "The Philosopher",
    motto: "I see",
    keywords: ["expansion", "truth", "adventure", "optimism", "philosophy", "freedom"],
    description:
      "Sagittarius is the ninth sign of the zodiac, representing the expansion of consciousness through exploration, philosophy, and the search for meaning. As a mutable fire sign ruled by Jupiter, Sagittarius embodies the principles of optimism, intellectual freedom, and the eternal quest for truth and understanding.\n\nThe Archer aims their arrow toward distant horizons, both physical and philosophical. Sagittarius energy teaches us about the importance of maintaining hope, the value of diverse experiences, and the liberating power of a broad perspective.",
    traits: {
      strengths: [
        "Optimistic and enthusiastic",
        "Love of learning and wisdom",
        "Adventurous and open-minded",
        "Honest and straightforward",
        "Generous and inspiring",
        "Philosophical and visionary",
      ],
      challenges: [
        "Can be tactless and blunt",
        "Restless and uncommitted",
        "Tendency to overextend",
        "May preach or moralize",
        "Difficulty with practical details",
        "Can promise more than deliver",
      ],
    },
    metaDescription:
      "Explore Sagittarius, the ninth zodiac sign. Learn about Sagittarius traits, strengths, challenges, and its connection to Jupiter, fire element, and mutable modality.",
    seoKeywords: [
      "sagittarius zodiac sign",
      "sagittarius traits",
      "sagittarius personality",
      "sagittarius jupiter",
      "fire sign sagittarius",
      "mutable sign",
    ],
  },

  capricorn: {
    id: "capricorn",
    name: "Capricorn",
    glyph: ZODIAC_META.capricorn.glyph,
    symbol: ZODIAC_META.capricorn.symbol,
    element: ZODIAC_META.capricorn.element,
    modality: ZODIAC_META.capricorn.modality,
    polarity: getPolarity(ZODIAC_META.capricorn.element),
    ruler: ZODIAC_META.capricorn.ruler,
    degreesStart: ZODIAC_META.capricorn.degreesStart,
    dateRange: {
      start: { month: 12, day: 22 },
      end: { month: 1, day: 19 },
      formatted: "December 22 - January 19",
    },
    archetype: "The Achiever",
    motto: "I use",
    keywords: ["ambition", "discipline", "responsibility", "structure", "mastery", "authority"],
    description:
      "Capricorn is the tenth sign of the zodiac, representing the pinnacle of worldly achievement and the mastery of material reality through discipline and perseverance. As a cardinal earth sign ruled by Saturn, Capricorn embodies the principles of responsibility, strategic planning, and the patient climb toward long-term goals.\n\nThe Sea-Goat combines the determination to scale the highest peaks with wisdom drawn from emotional depths. Capricorn energy teaches us about the value of hard work, the importance of integrity in our ambitions, and the rewards that come from sustained effort over time.",
    traits: {
      strengths: [
        "Ambitious and goal-oriented",
        "Disciplined and responsible",
        "Patient and persistent",
        "Practical and realistic",
        "Strong work ethic",
        "Wise with resources and time",
      ],
      challenges: [
        "Workaholic tendencies",
        "Can be overly serious",
        "Difficulty expressing emotions",
        "Pessimistic or fatalistic",
        "May prioritize status over meaning",
        "Can be rigid or authoritarian",
      ],
    },
    metaDescription:
      "Explore Capricorn, the tenth zodiac sign. Learn about Capricorn traits, strengths, challenges, and its connection to Saturn, earth element, and cardinal modality.",
    seoKeywords: [
      "capricorn zodiac sign",
      "capricorn traits",
      "capricorn personality",
      "capricorn saturn",
      "earth sign capricorn",
      "cardinal sign",
    ],
  },

  aquarius: {
    id: "aquarius",
    name: "Aquarius",
    glyph: ZODIAC_META.aquarius.glyph,
    symbol: ZODIAC_META.aquarius.symbol,
    element: ZODIAC_META.aquarius.element,
    modality: ZODIAC_META.aquarius.modality,
    polarity: getPolarity(ZODIAC_META.aquarius.element),
    ruler: ZODIAC_META.aquarius.ruler,
    degreesStart: ZODIAC_META.aquarius.degreesStart,
    dateRange: {
      start: { month: 1, day: 20 },
      end: { month: 2, day: 18 },
      formatted: "January 20 - February 18",
    },
    archetype: "The Visionary",
    motto: "I know",
    keywords: ["innovation", "humanitarian", "independence", "progress", "originality", "community"],
    description:
      "Aquarius is the eleventh sign of the zodiac, representing the evolution of consciousness beyond personal concerns toward collective welfare and future possibilities. As a fixed air sign ruled by Uranus (traditionally Saturn), Aquarius embodies the principles of innovation, social reform, and the pursuit of universal truth.\n\nThe Water Bearer pours forth the waters of knowledge and enlightenment for the benefit of humanity. Aquarius energy teaches us about the importance of thinking for ourselves, the value of community, and the power of ideas to change the world.",
    traits: {
      strengths: [
        "Original and innovative thinking",
        "Humanitarian and fair-minded",
        "Independent and authentic",
        "Visionary and progressive",
        "Excellent with groups and causes",
        "Objective and intellectual",
      ],
      challenges: [
        "Can be emotionally detached",
        "Stubborn about being different",
        "Difficulty with intimacy",
        "May seem cold or aloof",
        "Rebellious for its own sake",
        "Can be unpredictable",
      ],
    },
    metaDescription:
      "Explore Aquarius, the eleventh zodiac sign. Learn about Aquarius traits, strengths, challenges, and its connection to Uranus, air element, and fixed modality.",
    seoKeywords: [
      "aquarius zodiac sign",
      "aquarius traits",
      "aquarius personality",
      "aquarius uranus",
      "air sign aquarius",
      "fixed sign",
    ],
  },

  pisces: {
    id: "pisces",
    name: "Pisces",
    glyph: ZODIAC_META.pisces.glyph,
    symbol: ZODIAC_META.pisces.symbol,
    element: ZODIAC_META.pisces.element,
    modality: ZODIAC_META.pisces.modality,
    polarity: getPolarity(ZODIAC_META.pisces.element),
    ruler: ZODIAC_META.pisces.ruler,
    degreesStart: ZODIAC_META.pisces.degreesStart,
    dateRange: {
      start: { month: 2, day: 19 },
      end: { month: 3, day: 20 },
      formatted: "February 19 - March 20",
    },
    archetype: "The Mystic",
    motto: "I believe",
    keywords: ["compassion", "intuition", "imagination", "spirituality", "transcendence", "unity"],
    description:
      "Pisces is the twelfth and final sign of the zodiac, representing the dissolution of boundaries and the return to the cosmic ocean from which all life emerges. As a mutable water sign ruled by Neptune (traditionally Jupiter), Pisces embodies the principles of compassion, spiritual transcendence, and the interconnectedness of all beings.\n\nThe Fish swim in opposite directions, symbolizing the dual pull between material and spiritual realms. Pisces energy teaches us about the power of imagination, the healing nature of compassion, and the importance of maintaining connection to something greater than ourselves.",
    traits: {
      strengths: [
        "Deeply compassionate and empathic",
        "Highly intuitive and psychic",
        "Creative and imaginative",
        "Spiritually aware and connected",
        "Adaptable and accepting",
        "Healing and artistic gifts",
      ],
      challenges: [
        "Difficulty with boundaries",
        "Can be escapist or avoidant",
        "Overly sensitive to environment",
        "Tendency toward martyrdom",
        "May struggle with reality",
        "Can be impressionable or gullible",
      ],
    },
    metaDescription:
      "Explore Pisces, the twelfth zodiac sign. Learn about Pisces traits, strengths, challenges, and its connection to Neptune, water element, and mutable modality.",
    seoKeywords: [
      "pisces zodiac sign",
      "pisces traits",
      "pisces personality",
      "pisces neptune",
      "water sign pisces",
      "mutable sign",
    ],
  },
};

/**
 * Get all signs as an array (in zodiac order)
 */
export function getAllSigns(): ZodiacSignPageData[] {
  return ZODIAC_SIGNS.map((sign) => ZODIAC_SIGN_DATA[sign]);
}

/**
 * Get a sign by id
 */
export function getSignById(id: string): ZodiacSignPageData | undefined {
  return ZODIAC_SIGN_DATA[id as ZodiacSign];
}
