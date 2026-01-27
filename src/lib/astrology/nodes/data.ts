/**
 * Sensitive point page data for content pages.
 *
 * Six sensitive points:
 * - North Node (☊) - The Soul's Destination
 * - South Node (☋) - The Soul's Origin
 * - Black Moon Lilith (⚸) - The Wild Feminine
 * - Chiron (⚷) - The Wounded Healer
 * - Part of Fortune (⊕) - The Point of Bliss
 * - Vertex (Vx) - The Fated Encounter
 */

import type { SensitivePointPageData } from "./types";
import type { SensitivePointId } from "../constants";
import {
  SCHULMAN_NODES,
  SPILLER_NODES,
  GEORGE_LILITH,
  REINHART_CHIRON,
  ARABIC_PARTS_TRADITION,
  BONATTI_LIBER_ASTRONOMIAE,
  VEDIC_TRADITION,
  MODERN_WESTERN_CONSENSUS,
  PSYCHOLOGICAL_ASTROLOGY,
  WAVEPOINT_SYNTHESIS,
} from "../planets/citations";

// ═══════════════════════════════════════════════════════════════════════════
// NORTH NODE
// ═══════════════════════════════════════════════════════════════════════════

const NORTH_NODE: SensitivePointPageData = {
  id: "northnode",
  name: "North Node",
  glyph: "☊",
  archetype: "The Soul's Destination",
  keywords: ["destiny", "growth", "purpose", "evolution", "dharma", "future"],
  category: "lunar",

  associatedSigns: ["leo"],
  associatedHouses: [10, 11],
  polarityPoint: "southnode",
  relatedPlanets: ["moon"],

  coreArchetype: {
    primaryClaim:
      "The North Node represents the soul's evolutionary direction—the qualities, experiences, and life areas we are called to develop in this lifetime. It points toward unfamiliar territory that holds our greatest potential for growth.",
    sources: [SCHULMAN_NODES, SPILLER_NODES, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, the North Node represents the future-pull of destiny, the magnetic attractor drawing us toward experiences that expand consciousness.",
  },

  mythology: {
    primaryClaim:
      "In Vedic astrology, the North Node is Rahu—the head of the cosmic serpent who swallowed the Sun during eclipses. Rahu represents insatiable desire and worldly ambition, the drive to experience what the soul has not yet mastered.",
    sources: [VEDIC_TRADITION, SCHULMAN_NODES],
    confidence: "established",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern evolutionary astrology views the North Node as the soul's growth edge. Its sign shows the qualities to cultivate, its house reveals the life arena for development, and aspects to it indicate resources and challenges on the path.",
    sources: [SPILLER_NODES, PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  shadowExpression: {
    primaryClaim:
      "The shadow of the North Node manifests as avoidance of its lessons—retreating to South Node comfort zones when growth feels too challenging. It can also appear as obsessive pursuit of North Node themes without integrating South Node wisdom.",
    sources: [SCHULMAN_NODES, SPILLER_NODES],
    confidence: "consensus",
  },

  traits: {
    strengths: [
      "Embracing unfamiliar experiences",
      "Courage to grow beyond comfort",
      "Following soul purpose",
      "Trust in evolutionary timing",
      "Integration of new qualities",
    ],
    challenges: [
      "Resistance to change",
      "Fear of the unknown",
      "Retreating to familiar patterns",
      "Impatience with growth process",
      "Neglecting accumulated wisdom",
    ],
  },

  metaDescription:
    "Explore the North Node in astrology: your soul's destiny, evolutionary direction, and life purpose. Discover how the lunar node reveals your path of growth.",
  seoKeywords: [
    "north node astrology",
    "north node meaning",
    "rahu astrology",
    "soul purpose astrology",
    "north node destiny",
    "lunar nodes",
    "karmic astrology",
    "evolutionary astrology",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// SOUTH NODE
// ═══════════════════════════════════════════════════════════════════════════

const SOUTH_NODE: SensitivePointPageData = {
  id: "southnode",
  name: "South Node",
  glyph: "☋",
  archetype: "The Soul's Origin",
  keywords: ["past", "mastery", "comfort", "release", "karma", "inheritance"],
  category: "lunar",

  associatedSigns: ["aquarius"],
  associatedHouses: [4, 12],
  polarityPoint: "northnode",
  relatedPlanets: ["moon", "saturn"],

  coreArchetype: {
    primaryClaim:
      "The South Node represents accumulated soul wisdom—talents, tendencies, and patterns carried from past experiences. It shows our default mode of operation and the comfort zone we must eventually transcend to grow.",
    sources: [SCHULMAN_NODES, SPILLER_NODES, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, the South Node is the reservoir of mastered experience, offering gifts to be shared while releasing attachments that limit evolution.",
  },

  mythology: {
    primaryClaim:
      "In Vedic astrology, the South Node is Ketu—the tail of the cosmic serpent, representing spiritual liberation and detachment. Ketu governs transcendence, psychic sensitivity, and the dissolution of worldly attachments.",
    sources: [VEDIC_TRADITION, SCHULMAN_NODES],
    confidence: "established",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern astrology views the South Node as our default setting—skills that come easily because they are already developed. The work is to use these gifts in service of North Node growth rather than as an escape from challenge.",
    sources: [SPILLER_NODES, PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  shadowExpression: {
    primaryClaim:
      "The shadow of the South Node manifests as over-reliance on familiar patterns, using past-life gifts as a crutch to avoid growth. It can appear as stagnation, repeating old dramas, or unconsciously recreating limiting dynamics.",
    sources: [SCHULMAN_NODES, SPILLER_NODES],
    confidence: "consensus",
  },

  traits: {
    strengths: [
      "Natural talents and abilities",
      "Accumulated wisdom",
      "Comfort with familiar territory",
      "Depth of experience",
      "Foundation for growth",
    ],
    challenges: [
      "Over-attachment to the past",
      "Resistance to new experiences",
      "Using gifts to avoid growth",
      "Unconscious repetition of patterns",
      "Spiritual bypassing",
    ],
  },

  metaDescription:
    "Explore the South Node in astrology: your soul's past, karmic inheritance, and accumulated wisdom. Discover how the lunar node reveals gifts to integrate and patterns to release.",
  seoKeywords: [
    "south node astrology",
    "south node meaning",
    "ketu astrology",
    "past life astrology",
    "south node karma",
    "lunar nodes",
    "karmic patterns",
    "soul memory",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// BLACK MOON LILITH
// ═══════════════════════════════════════════════════════════════════════════

const LILITH: SensitivePointPageData = {
  id: "lilith",
  name: "Black Moon Lilith",
  glyph: "⚸",
  archetype: "The Wild Feminine",
  keywords: ["shadow", "power", "sexuality", "exile", "authenticity", "rage"],
  category: "lunar",

  associatedSigns: ["scorpio"],
  associatedHouses: [8, 12],
  relatedPlanets: ["moon", "pluto"],

  coreArchetype: {
    primaryClaim:
      "Black Moon Lilith represents the primal feminine that refuses domestication—the part of us that has been exiled for being too powerful, too sexual, too authentic. She marks where we meet our shadow and reclaim rejected power.",
    sources: [GEORGE_LILITH, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, Lilith represents the integration point between personal shadow and collective wound—where individual healing serves the greater feminine.",
  },

  mythology: {
    primaryClaim:
      "Lilith originates in Mesopotamian mythology as a wind demon, later appearing in Jewish legend as Adam's first wife who refused submission and was exiled from Eden. She represents the untamed feminine that cannot be controlled.",
    sources: [GEORGE_LILITH],
    confidence: "established",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern astrology interprets Black Moon Lilith as the shadow feminine—representing repressed sexuality, rage at injustice, and the power we've learned to hide. Her position shows where we must reclaim authenticity at the cost of approval.",
    sources: [GEORGE_LILITH, PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  shadowExpression: {
    primaryClaim:
      "Lilith's shadow manifests as destructive rage, manipulative sexuality, or complete suppression of primal power. Unintegrated, she can sabotage relationships or lead to self-exile. The work is conscious integration, not expression or repression.",
    sources: [GEORGE_LILITH, PSYCHOLOGICAL_ASTROLOGY],
    confidence: "consensus",
  },

  traits: {
    strengths: [
      "Authentic self-expression",
      "Reclaimed personal power",
      "Sexual sovereignty",
      "Boundary-setting",
      "Shadow integration",
    ],
    challenges: [
      "Destructive rage",
      "Self-sabotage",
      "Manipulative behavior",
      "Fear of rejection",
      "Compulsive exile",
    ],
  },

  metaDescription:
    "Explore Black Moon Lilith in astrology: the wild feminine, shadow integration, and reclaimed power. Discover how Lilith reveals where you must embrace authenticity.",
  seoKeywords: [
    "black moon lilith astrology",
    "lilith meaning",
    "lilith natal chart",
    "dark feminine astrology",
    "lilith shadow",
    "lilith mythology",
    "feminine power astrology",
    "shadow work astrology",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// CHIRON
// ═══════════════════════════════════════════════════════════════════════════

const CHIRON: SensitivePointPageData = {
  id: "chiron",
  name: "Chiron",
  glyph: "⚷",
  archetype: "The Wounded Healer",
  keywords: ["wound", "healing", "wisdom", "teaching", "bridge", "integration"],
  category: "asteroid",

  associatedSigns: ["virgo", "sagittarius"],
  associatedHouses: [6, 9],
  relatedPlanets: ["saturn", "uranus"],

  coreArchetype: {
    primaryClaim:
      "Chiron represents our deepest wound and our greatest gift—the place where personal suffering becomes the source of wisdom and healing for others. The wound that cannot fully heal becomes the opening through which we serve.",
    sources: [REINHART_CHIRON, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
    wavepointNote:
      "In our synthesis, Chiron is the bridge between the personal and transpersonal—the alchemical point where individual pain transmutes into collective medicine.",
  },

  mythology: {
    primaryClaim:
      "In Greek mythology, Chiron was a centaur renowned for wisdom and healing arts, who mentored heroes including Achilles, Asclepius, and Heracles. Accidentally wounded by a poisoned arrow, he suffered immortally until exchanging his immortality for Prometheus's freedom.",
    sources: [REINHART_CHIRON],
    confidence: "established",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern astrology views Chiron as the shamanic initiator—revealing where we carry core wounds that become our teaching. Its house and sign show the nature of the wound, while aspects indicate how healing integrates with the rest of the psyche.",
    sources: [REINHART_CHIRON, PSYCHOLOGICAL_ASTROLOGY, MODERN_WESTERN_CONSENSUS],
    confidence: "consensus",
  },

  shadowExpression: {
    primaryClaim:
      "Chiron's shadow manifests as identification with victimhood, using wounds to manipulate, or compulsively trying to fix others while avoiding one's own healing. The wound becomes a prison rather than a portal when we refuse its teachings.",
    sources: [REINHART_CHIRON, PSYCHOLOGICAL_ASTROLOGY],
    confidence: "consensus",
  },

  traits: {
    strengths: [
      "Wisdom from experience",
      "Compassionate healing",
      "Teaching through example",
      "Bridging worlds",
      "Transforming pain into purpose",
    ],
    challenges: [
      "Victim identification",
      "Compulsive caretaking",
      "Avoiding personal healing",
      "Wound as identity",
      "Martyrdom complex",
    ],
  },

  metaDescription:
    "Explore Chiron in astrology: the wounded healer, shamanic initiation, and transforming pain into wisdom. Discover how Chiron reveals your deepest wound and greatest gift.",
  seoKeywords: [
    "chiron astrology",
    "chiron meaning",
    "wounded healer",
    "chiron natal chart",
    "chiron mythology",
    "chiron healing",
    "chiron return",
    "asteroid chiron",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// PART OF FORTUNE
// ═══════════════════════════════════════════════════════════════════════════

const PART_OF_FORTUNE: SensitivePointPageData = {
  id: "partoffortune",
  name: "Part of Fortune",
  glyph: "⊕",
  archetype: "The Point of Bliss",
  keywords: ["fortune", "joy", "prosperity", "flow", "fulfillment", "luck"],
  category: "arabic-part",

  associatedHouses: [2, 5, 11],
  relatedPlanets: ["sun", "moon", "jupiter"],

  numerology: {
    digit: null,
    traditions: ["Arabic", "Hellenistic"],
    confidence: "majority",
    relatedPatterns: ["888", "11"],
  },

  coreArchetype: {
    primaryClaim:
      "The Part of Fortune marks where the lights (Sun and Moon) harmonize through the Ascendant—a synthesis point of identity, emotion, and physical existence. It indicates where joy and prosperity flow most naturally.",
    sources: [ARABIC_PARTS_TRADITION, BONATTI_LIBER_ASTRONOMIAE, MODERN_WESTERN_CONSENSUS],
    confidence: "established",
    wavepointNote:
      "In our synthesis, the Part of Fortune represents the integration of will (Sun), feeling (Moon), and embodiment (Ascendant)—the point of aligned manifestation.",
  },

  mythology: {
    primaryClaim:
      "The Part of Fortune derives from Hellenistic astrology, where it was called the Lot of Fortune (Fortuna). The goddess Fortuna governed luck, fate, and the turning wheel of circumstance. The lot calculates where her favor falls in the chart.",
    sources: [ARABIC_PARTS_TRADITION, BONATTI_LIBER_ASTRONOMIAE],
    confidence: "established",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern astrology interprets the Part of Fortune as a point of natural abundance and fulfillment. Its house shows the life area where success comes most easily; its sign indicates the qualities that attract good fortune.",
    sources: [MODERN_WESTERN_CONSENSUS],
    confidence: "majority",
  },

  shadowExpression: {
    primaryClaim:
      "The shadow of the Part of Fortune manifests as dependence on external luck, neglecting the effort required to manifest potential. It can also appear as guilt around receiving, or an inability to accept the good that flows naturally.",
    sources: [MODERN_WESTERN_CONSENSUS, WAVEPOINT_SYNTHESIS],
    confidence: "majority",
  },

  traits: {
    strengths: [
      "Natural abundance",
      "Aligned manifestation",
      "Joy in expression",
      "Fortunate circumstances",
      "Integrated self-expression",
    ],
    challenges: [
      "Passive reliance on luck",
      "Guilt about receiving",
      "Taking fortune for granted",
      "Neglecting other life areas",
      "Entitlement patterns",
    ],
  },

  metaDescription:
    "Explore the Part of Fortune in astrology: the point of natural joy, prosperity, and aligned manifestation. Discover where abundance flows most easily in your chart.",
  seoKeywords: [
    "part of fortune astrology",
    "lot of fortune",
    "fortuna astrology",
    "arabic parts astrology",
    "part of fortune meaning",
    "luck in astrology",
    "prosperity astrology",
    "part of fortune natal chart",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// VERTEX
// ═══════════════════════════════════════════════════════════════════════════

const VERTEX: SensitivePointPageData = {
  id: "vertex",
  name: "Vertex",
  glyph: "Vx",
  archetype: "The Fated Encounter",
  keywords: ["fate", "encounters", "destiny", "turning points", "others", "activation"],
  category: "angle",

  associatedHouses: [5, 6, 7, 8],
  relatedPlanets: ["venus", "pluto"],

  coreArchetype: {
    primaryClaim:
      "The Vertex represents fated encounters and turning points that arrive through others. Unlike the self-directed Ascendant, the Vertex marks where destiny reaches us through external agents—people, events, and circumstances beyond our control.",
    sources: [MODERN_WESTERN_CONSENSUS],
    confidence: "majority",
    wavepointNote:
      "In our synthesis, the Vertex is the receptive complement to the Ascendant—where we meet destiny through relationship rather than individual will.",
  },

  mythology: {
    primaryClaim:
      "The Vertex has no ancient mythology, being a modern astrological point calculated from the intersection of the prime vertical and the ecliptic. Its symbolism draws from concepts of fate, destiny, and the web of interconnection.",
    sources: [MODERN_WESTERN_CONSENSUS, WAVEPOINT_SYNTHESIS],
    confidence: "wavepoint-only",
  },

  modernInterpretation: {
    primaryClaim:
      "Modern astrology interprets the Vertex as a secondary descendant—a fated point activated by transits, progressions, and synastry contacts. Significant relationships and life-changing encounters often involve Vertex activation.",
    sources: [MODERN_WESTERN_CONSENSUS],
    confidence: "majority",
  },

  shadowExpression: {
    primaryClaim:
      "The shadow of the Vertex manifests as passivity toward fate, waiting for destiny rather than co-creating it. It can also appear as over-attribution of meaning to random encounters, or projection of personal responsibility onto external forces.",
    sources: [MODERN_WESTERN_CONSENSUS, WAVEPOINT_SYNTHESIS],
    confidence: "majority",
  },

  traits: {
    strengths: [
      "Openness to destiny",
      "Recognition of significant encounters",
      "Trust in life's timing",
      "Receptivity to guidance",
      "Understanding interconnection",
    ],
    challenges: [
      "Passivity toward fate",
      "Over-attribution of meaning",
      "Projection onto others",
      "Waiting rather than acting",
      "Neglecting personal agency",
    ],
  },

  metaDescription:
    "Explore the Vertex in astrology: the point of fated encounters, destined meetings, and life-changing turning points. Discover where destiny reaches you through others.",
  seoKeywords: [
    "vertex astrology",
    "vertex meaning",
    "fated encounters astrology",
    "vertex synastry",
    "vertex natal chart",
    "destiny point astrology",
    "vertex transit",
    "turning points astrology",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA EXPORT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All sensitive point data indexed by ID.
 */
export const SENSITIVE_POINT_DATA: Record<SensitivePointId, SensitivePointPageData> = {
  northnode: NORTH_NODE,
  southnode: SOUTH_NODE,
  lilith: LILITH,
  chiron: CHIRON,
  partoffortune: PART_OF_FORTUNE,
  vertex: VERTEX,
};

/**
 * Get all available sensitive points.
 */
export function getAvailableNodes(): SensitivePointPageData[] {
  return Object.values(SENSITIVE_POINT_DATA);
}

/**
 * Get all available sensitive point IDs.
 */
export function getAvailableNodeIds(): SensitivePointId[] {
  return Object.keys(SENSITIVE_POINT_DATA) as SensitivePointId[];
}
