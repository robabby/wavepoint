/**
 * Types for the Astrology Planets content module.
 *
 * This module defines types for planet content pages, including citation
 * and source tracking for academic credibility.
 */

import type { PlanetId } from "../constants";
import type { Element, PlatonicSolid } from "@/lib/numbers/planetary";

// ═══════════════════════════════════════════════════════════════════════════
// PLANET IDS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Planet IDs for content pages (excludes Pluto).
 * 9 planets: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune
 */
export const CONTENT_PLANET_IDS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;

export type ContentPlanetId = (typeof CONTENT_PLANET_IDS)[number];

/**
 * Type guard to check if a PlanetId is a ContentPlanetId (excludes Pluto).
 */
export function isContentPlanetId(id: PlanetId): id is ContentPlanetId {
  return CONTENT_PLANET_IDS.includes(id as ContentPlanetId);
}

// ═══════════════════════════════════════════════════════════════════════════
// CITATION & SOURCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Confidence level for claims based on cross-traditional agreement.
 */
export type ConfidenceLevel =
  | "established" // Multiple scholarly sources agree
  | "consensus" // Most traditions agree
  | "majority" // More than half of traditions agree
  | "contested" // Traditions disagree
  | "wavepoint-only"; // Our synthesis, not from tradition

/**
 * Category of source for attribution.
 */
export type SourceCategory =
  | "scholarly" // Academic, peer-reviewed
  | "traditional" // Historical astrological texts
  | "practitioner" // Modern practitioner consensus
  | "wavepoint"; // Our synthesis

/**
 * A citation to a source.
 */
export interface Citation {
  /** Unique identifier for this citation */
  id: string;
  /** Source category for display styling */
  category: SourceCategory;
  /** Short label for inline display (e.g., "Ptolemy") */
  shortLabel: string;
  /** Full citation text */
  fullCitation: string;
  /** Optional URL to source */
  url?: string;
  /** Year of publication (for sorting) */
  year?: number;
}

/**
 * A claim with source attribution.
 */
export interface SourcedClaim {
  /** The primary claim text */
  primaryClaim: string;
  /** Citations supporting this claim */
  sources: Citation[];
  /** Confidence level based on source agreement */
  confidence: ConfidenceLevel;
  /** Optional WavePoint interpretation note */
  wavepointNote?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLANET DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Zodiac sign that a planet rules.
 */
export interface PlanetaryRulership {
  /** The zodiac sign */
  sign: string;
  /** Whether this is traditional (pre-modern) rulership */
  traditional: boolean;
  /** Whether this is modern rulership */
  modern: boolean;
  /** Source for this rulership */
  source?: Citation;
}

/**
 * Planetary dignity (exaltation, detriment, fall).
 */
export interface PlanetaryDignity {
  /** The zodiac sign */
  sign: string;
  /** Type of dignity */
  type: "exaltation" | "detriment" | "fall";
  /** Degree of exaltation (if applicable) */
  degree?: number;
  /** Source for this dignity */
  source?: Citation;
}

/**
 * Connection to numerology.
 */
export interface NumerologyConnection {
  /** The associated digit (1-9) */
  digit: number;
  /** Traditions that agree on this association */
  traditions: string[];
  /** Confidence level */
  confidence: ConfidenceLevel;
  /** Related number patterns (e.g., ["888", "8888", "44"]) */
  relatedPatterns: string[];
}

/**
 * Connection to sacred geometry (Platonic solids via element).
 */
export interface GeometryConnection {
  /** The associated Platonic solid */
  geometry: PlatonicSolid;
  /** The connection rationale */
  rationale: string;
  /** Confidence level */
  confidence: ConfidenceLevel;
}

/**
 * Connection to sacred patterns (direct symbolic associations).
 * Distinct from GeometryConnection which is derived via element.
 */
export interface SacredPatternConnection {
  /** The pattern slug (e.g., "circle-dot", "vesica-piscis", "pentagram") */
  pattern: string;
  /** Display name for the pattern */
  name: string;
  /** Why this planet connects to this pattern */
  rationale: string;
  /** Confidence level */
  confidence: ConfidenceLevel;
}

/**
 * Complete planet page data.
 */
export interface PlanetPageData {
  /** Planet identifier */
  id: ContentPlanetId;
  /** Display name */
  name: string;
  /** Unicode glyph symbol (e.g., "♄") */
  glyph: string;
  /** Archetype title (e.g., "The Great Teacher") */
  archetype: string;
  /** Keywords for quick reference */
  keywords: string[];
  /** Classical element */
  element: Element;
  /** Day of the week (for classical planets) */
  dayOfWeek?: string;
  /** Metal association (for classical planets) */
  metal?: string;
  /** Planet type category */
  type: "luminary" | "personal" | "social" | "transpersonal";

  // Astrological relationships
  /** Signs this planet rules */
  rulerships: PlanetaryRulership[];
  /** Dignities (exaltation, detriment, fall) */
  dignities: PlanetaryDignity[];

  // Cross-domain connections
  /** Connection to numerology */
  numerology: NumerologyConnection;
  /** Connection to Platonic solid (derived via element) */
  geometry?: GeometryConnection;
  /** Connection to sacred pattern (direct symbolic) */
  sacredPattern?: SacredPatternConnection;

  // Content sections with sourcing
  /** Core archetype description with sources */
  coreArchetype: SourcedClaim;
  /** Elemental nature description with sources */
  elementalNature: SourcedClaim;

  // SEO
  /** Meta description for SEO */
  metaDescription: string;
  /** SEO keywords */
  seoKeywords: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// PLANET GROUP TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Group of planets for display.
 */
export interface PlanetGroup {
  /** Group identifier */
  id: string;
  /** Display title */
  title: string;
  /** Description of the group */
  description: string;
  /** Planet IDs in this group */
  planets: ContentPlanetId[];
}

/**
 * The classical seven planets (visible to ancient observers).
 */
export const CLASSICAL_PLANETS: ContentPlanetId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
];

/**
 * The outer/modern planets (discovered in modern era).
 */
export const OUTER_PLANETS: ContentPlanetId[] = ["uranus", "neptune"];
