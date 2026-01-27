/**
 * Types for the Astrology Sensitive Points (Nodes) content module.
 *
 * Sensitive points are calculated chart positions that aren't planets:
 * - Lunar Nodes (North/South Node)
 * - Black Moon Lilith
 * - Chiron (classified here for content purposes)
 * - Part of Fortune
 * - Vertex
 */

import type { SensitivePointId, ZodiacSign, PlanetId } from "../constants";
import type {
  Citation,
  SourcedClaim,
  ConfidenceLevel,
  NumerologyConnection,
  GeometryConnection,
} from "../planets/types";

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Categories of sensitive points for theming and grouping.
 */
export type SensitivePointCategory =
  | "lunar" // North Node, South Node, Lilith
  | "asteroid" // Chiron
  | "arabic-part" // Part of Fortune
  | "angle"; // Vertex

// ═══════════════════════════════════════════════════════════════════════════
// SENSITIVE POINT DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Traits for the sensitive point - strengths and shadow expressions
 */
export interface SensitivePointTraits {
  /** Positive qualities when this point is emphasized */
  strengths: string[];
  /** Shadow expressions and challenges */
  challenges: string[];
}

/**
 * Complete sensitive point page data.
 */
export interface SensitivePointPageData {
  // =========================================================================
  // Identity
  // =========================================================================

  /** Point identifier */
  id: SensitivePointId;
  /** Display name */
  name: string;
  /** Unicode glyph symbol (e.g., "☊", "☋", "⚸") */
  glyph: string;
  /** Archetype title (e.g., "The Soul's Destination") */
  archetype: string;
  /** Keywords for quick reference */
  keywords: string[];
  /** Category for theming */
  category: SensitivePointCategory;

  // =========================================================================
  // Cross-Domain Connections (optional)
  // =========================================================================

  /** Connection to numerology (if applicable) */
  numerology?: NumerologyConnection;
  /** Connection to sacred geometry (if applicable) */
  geometry?: GeometryConnection;

  // =========================================================================
  // Astrological Relationships
  // =========================================================================

  /** Associated zodiac signs (if any) */
  associatedSigns?: ZodiacSign[];
  /** Associated house numbers (if any) */
  associatedHouses?: number[];
  /** Polarity point (e.g., North Node ↔ South Node) */
  polarityPoint?: SensitivePointId;
  /** Related planets */
  relatedPlanets?: PlanetId[];

  // =========================================================================
  // Rich Content with Sourcing
  // =========================================================================

  /** Core archetype description with sources */
  coreArchetype: SourcedClaim;
  /** Mythological associations with sources */
  mythology: SourcedClaim;
  /** Modern/psychological interpretation with sources */
  modernInterpretation: SourcedClaim;
  /** Shadow expression with sources */
  shadowExpression: SourcedClaim;
  /** Strengths and challenges */
  traits: SensitivePointTraits;

  // =========================================================================
  // SEO
  // =========================================================================

  /** Meta description for SEO */
  metaDescription: string;
  /** SEO keywords */
  seoKeywords: string[];
}

/**
 * Sensitive point with computed relations for detail pages
 */
export interface SensitivePointWithRelations extends SensitivePointPageData {
  /** Adjacent points for circular navigation */
  adjacentPoints: {
    previous: SensitivePointPageData;
    next: SensitivePointPageData;
  };
  /** URL to polarity point page (if applicable) */
  polarityPointUrl?: string;
  /** Other points of the same category */
  sameCategoryPoints: SensitivePointPageData[];
}

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS FOR CONVENIENCE
// ═══════════════════════════════════════════════════════════════════════════

export type { Citation, SourcedClaim, ConfidenceLevel, NumerologyConnection, GeometryConnection };
