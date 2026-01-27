/**
 * Template system types for deterministic interpretation assembly.
 *
 * @module templates/types
 */

import type { MoonPhase } from "@/lib/signal/cosmic-context";

// =============================================================================
// Core Types
// =============================================================================

export type Activity = "working" | "transit" | "resting" | "socializing" | "other";
export type Element = "fire" | "water" | "earth" | "air";
export type ModifierType = "moon" | "mood" | "activity" | "element";

export type TemplateCategory = "repetition" | "sequence" | "mirror" | "classic";

// =============================================================================
// Base Template
// =============================================================================

/** Base interpretation for a number pattern */
export interface BaseTemplate {
  /** The number pattern (e.g., "111", "1234") */
  number: string;
  /** Category of the pattern */
  category: TemplateCategory;
  /** 1-2 sentence core meaning */
  essence: string;
  /** 2-3 paragraph full interpretation */
  expanded: string;
  /** Keywords for semantic matching */
  keywords: string[];
  /** Optional elemental affinity */
  elementalAffinity?: Element;
}

// =============================================================================
// Modifiers
// =============================================================================

/** Base modifier interface */
interface BaseModifier {
  /** Modifier type */
  type: ModifierType;
  /** Unique key for this modifier */
  key: string;
  /** Text appended to interpretation */
  suffix: string;
  /** Connecting phrase */
  transition: string;
  /** Keywords for matching */
  keywords: string[];
}

export interface MoonModifier extends BaseModifier {
  type: "moon";
  key: string; // Moon phase key
}

export interface MoodModifier extends BaseModifier {
  type: "mood";
  key: string; // Mood name
}

export interface ActivityModifier extends BaseModifier {
  type: "activity";
  key: Activity;
}

export interface ElementModifier extends BaseModifier {
  type: "element";
  key: Element;
}

export type Modifier = MoonModifier | MoodModifier | ActivityModifier | ElementModifier;

// =============================================================================
// Pattern Injection
// =============================================================================

/** Template for injecting personalized pattern insights */
export interface PatternInjection {
  /** Type of pattern this injection handles */
  patternType: string;
  /** Template string with {{placeholders}} */
  template: string;
  /** Minimum data points needed to use this injection */
  minDataPoints: number;
}

/** Pattern insight data from user's history */
export interface PatternInsight {
  /** Type of pattern */
  type: string;
  /** Pattern data for placeholder substitution */
  value: Record<string, string | number>;
  /** Number of data points backing this insight */
  dataPoints: number;
}

// =============================================================================
// Assembly Types
// =============================================================================

/** Context for assembling an interpretation */
export interface AssemblyContext {
  /** Current moon phase */
  moonPhase?: MoonPhase;
  /** User's mood tags */
  moodTags?: string[];
  /** Current activity */
  activity?: Activity;
  /** User's dominant element from natal chart */
  userElement?: Element;
  /** Pattern insights from user's history */
  patterns?: PatternInsight[];
}

/** Result of template assembly */
export interface AssembledInterpretation {
  /** Core meaning summary */
  essence: string;
  /** Full assembled interpretation */
  interpretation: string;
  /** Source identifier */
  source: "template";
  /** IDs of templates used in assembly */
  templateIds: string[];
}

// =============================================================================
// Template Store Types
// =============================================================================

/** Loaded template collection */
export interface TemplateStore {
  /** Base templates indexed by number */
  base: Map<string, BaseTemplate>;
  /** Moon modifiers indexed by phase */
  moon: Map<string, MoonModifier>;
  /** Mood modifiers indexed by mood */
  mood: Map<string, MoodModifier>;
  /** Activity modifiers indexed by activity */
  activity: Map<string, ActivityModifier>;
  /** Element modifiers indexed by element */
  element: Map<string, ElementModifier>;
  /** Pattern injections indexed by type */
  injections: Map<string, PatternInjection>;
}
