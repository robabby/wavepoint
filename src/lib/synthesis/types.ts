/**
 * Type definitions for the Synthesis module.
 *
 * The synthesis graph connects Sacred Geometry, Numerology, Astrology,
 * and Archetypes through their shared foundations (elements, planets).
 */

import type { Planet, Element, PlatonicSolid, ConfidenceLevel } from "@/lib/numbers/planetary";
import type { ZodiacSign, PlanetId } from "@/lib/astrology";
import type { ArchetypeSlug } from "@/lib/archetypes";

// =============================================================================
// NODE TYPES
// =============================================================================

/**
 * All node types in the synthesis graph
 */
export const NODE_TYPES = [
  "geometry",
  "element",
  "planet",
  "number",
  "zodiacSign",
  "house",
  "archetype",
  "modality",
] as const;

export type NodeType = (typeof NODE_TYPES)[number];

/**
 * Base interface for all nodes
 */
export interface BaseNode {
  type: NodeType;
  id: string;
  name: string;
}

/**
 * Geometry node (Platonic solids)
 */
export interface GeometryNode extends BaseNode {
  type: "geometry";
  id: PlatonicSolid;
  faces: number;
  elementId: Element;
  description: string;
}

/**
 * Element node (classical elements)
 */
export interface ElementNode extends BaseNode {
  type: "element";
  id: Element;
  quality: string;
  direction: string;
  geometryId: PlatonicSolid;
}

/**
 * Planet node
 */
export interface PlanetNode extends BaseNode {
  type: "planet";
  id: Planet;
  symbol: string;
  elementId: Element;
  digit: number;
  dayOfWeek?: string;
  archetype: string;
  nature: "benefic" | "malefic" | "variable";
}

/**
 * Number node (base digits 0-9)
 */
export interface NumberNode extends BaseNode {
  type: "number";
  id: string; // "0" - "9"
  digit: number;
  planetId: Planet | null;
  elementId: Element;
  traits: string[];
  confidence: ConfidenceLevel;
}

/**
 * Zodiac sign node
 */
export interface ZodiacSignNode extends BaseNode {
  type: "zodiacSign";
  id: ZodiacSign;
  symbol: string;
  elementId: Element;
  modality: "cardinal" | "fixed" | "mutable";
  rulingPlanetId: PlanetId;
}

/**
 * House node (1-12)
 */
export interface HouseNode extends BaseNode {
  type: "house";
  id: string; // "1" - "12"
  number: number;
  lifeArea: string;
  keywords: string[];
  naturalSignId: ZodiacSign;
  elementId: Element;
}

/**
 * Archetype node (Major Arcana)
 */
export interface ArchetypeNode extends BaseNode {
  type: "archetype";
  id: ArchetypeSlug;
  number: number;
  hebrewLetter: string;
  hebrewLetterMeaning: string;
  primaryAttribution: string;
  attributionType: "element" | "planet" | "zodiac";
  elementId: Element | null;
  planetId: Planet | null;
  zodiacId: ZodiacSign | null;
  confidence: ConfidenceLevel;
  keywords: string[];
  jungianArchetype: string;
}

/**
 * Modality type (cardinal, fixed, mutable)
 */
export type Modality = "cardinal" | "fixed" | "mutable";

/**
 * Modality node (astrological quality)
 */
export interface ModalityNode extends BaseNode {
  type: "modality";
  id: Modality;
  quality: string;
  keywords: string[];
}

/**
 * Union of all node types
 */
export type SynthesisNode =
  | GeometryNode
  | ElementNode
  | PlanetNode
  | NumberNode
  | ZodiacSignNode
  | HouseNode
  | ArchetypeNode
  | ModalityNode;

// =============================================================================
// EDGE TYPES
// =============================================================================

/**
 * All edge types in the synthesis graph
 */
export const EDGE_TYPES = [
  // Number connections
  "resonates_with",       // Number <-> Planet
  "expresses_element",    // Number <-> Element

  // Element connections
  "manifests_as",         // Element <-> Geometry

  // Planet connections
  "rules",                // Planet -> ZodiacSign
  "exalts_in",           // Planet -> ZodiacSign
  "detriment_in",        // Planet -> ZodiacSign
  "falls_in",            // Planet -> ZodiacSign

  // Zodiac connections
  "belongs_to_element",  // ZodiacSign <-> Element
  "naturally_rules",     // ZodiacSign <-> House
  "has_modality",        // ZodiacSign <-> Modality

  // Archetype connections
  "archetype_corresponds_to_planet",  // Archetype <-> Planet
  "archetype_corresponds_to_zodiac",  // Archetype <-> ZodiacSign
  "archetype_expresses_element",      // Archetype <-> Element
] as const;

export type EdgeType = (typeof EDGE_TYPES)[number];

/**
 * A relationship between two nodes
 */
export interface SynthesisEdge {
  /** Unique identifier */
  id: string;
  /** Edge type */
  type: EdgeType;
  /** Source node type */
  sourceType: NodeType;
  /** Source node ID */
  sourceId: string;
  /** Target node type */
  targetType: NodeType;
  /** Target node ID */
  targetId: string;
  /** Can traverse both directions */
  bidirectional: boolean;
  /** Connection strength (0-10) */
  weight: number;
  /** Confidence level */
  confidence?: ConfidenceLevel;
  /** Supporting traditions */
  traditions?: string[];
  /** Additional context */
  context?: string;
}

// =============================================================================
// GRAPH STRUCTURE
// =============================================================================

/**
 * The synthesis knowledge graph
 */
export interface SynthesisGraph {
  /** All nodes by composite key (type:id) */
  nodes: Map<string, SynthesisNode>;
  /** All edges by ID */
  edges: Map<string, SynthesisEdge>;
  /** Adjacency list: nodeKey -> edgeIds */
  adjacency: Map<string, string[]>;
  /** Reverse adjacency for bidirectional traversal */
  reverseAdjacency: Map<string, string[]>;
}

// =============================================================================
// QUERY TYPES
// =============================================================================

/**
 * Query parameters for graph traversal
 */
export interface SynthesisQuery {
  /** Starting nodes */
  seeds: Array<{ type: NodeType; id: string }>;
  /** Maximum traversal depth */
  maxDepth?: number;
  /** Edge types to follow */
  edgeTypes?: EdgeType[];
  /** Minimum edge weight */
  minWeight?: number;
  /** Node types to include in results */
  targetTypes?: NodeType[];
}

/**
 * Result of a synthesis query
 */
export interface SynthesisResult {
  /** Discovered nodes */
  nodes: SynthesisNode[];
  /** Traversed edges */
  edges: SynthesisEdge[];
  /** Paths from seeds to result nodes */
  paths: Array<{
    node: SynthesisNode;
    path: SynthesisEdge[];
    totalWeight: number;
  }>;
}

// =============================================================================
// PATTERN SYNTHESIS
// =============================================================================

/**
 * Query for pattern-specific synthesis
 */
export interface PatternSynthesisQuery {
  /** Number pattern (e.g., "444") */
  pattern: string;
  /** User profile data (optional) */
  profile?: {
    sunSign?: ZodiacSign;
    moonSign?: ZodiacSign;
    risingSign?: ZodiacSign;
    dominantElement?: Element;
  };
  /** Query context */
  context?: "interpretation" | "pattern_page" | "dashboard";
}

/**
 * Result of pattern synthesis
 */
export interface PatternSynthesisResult extends SynthesisResult {
  /** Pattern analysis */
  patternMeta: {
    pattern: string;
    dominantDigit: number;
    primaryPlanet: Planet;
    primaryElement: Element;
    geometry?: PlatonicSolid;
    elements: Element[];
    planets: Planet[];
    archetypes: ArchetypeSlug[];
  };
  /** Personal connections (if profile provided) */
  personalConnections?: {
    relatedSigns: ZodiacSign[];
    elementAlignment: "harmonious" | "complementary" | "challenging";
  };
  /** Narrative for Claude prompts */
  narrative: string;
}
