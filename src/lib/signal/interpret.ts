/**
 * Interpretation orchestrator for Signal sightings.
 *
 * Decides whether to use template-based or AI-generated interpretations.
 * Templates are the primary source (~90%), AI reserved for:
 * - Regeneration requests (Insight tier)
 * - First-time novel combinations without good template match
 *
 * @module signal/interpret
 */

import { db, signalInterpretations } from "@/lib/db";
import {
  assembleInterpretation,
  meetsQualityThreshold,
  type AssemblyContext,
} from "@/lib/templates";
import {
  generateInterpretation as generateWithClaude,
  type InterpretationContext,
  type UserProfileContext,
} from "./claude";
import type { MoonPhase } from "./cosmic-context";
import type { Activity, Element } from "@/lib/templates";

// =============================================================================
// Types
// =============================================================================

export interface InterpretOptions {
  /** Force AI generation (for regeneration requests) */
  forceAI?: boolean;
  /** User ID for context gathering */
  userId: string;
  /** User's spiritual profile for personalization */
  profile?: UserProfileContext;
}

export interface SightingData {
  id: string;
  number: string;
  note?: string;
  moodTags?: string[];
  activity?: string;
  cosmicContext?: {
    moon?: {
      phase: MoonPhase;
    };
  } | null;
}

export interface InterpretResult {
  /** The interpretation content */
  content: string;
  /** Essence/summary (templates only) */
  essence?: string;
  /** Source: "ai" or "template" */
  source: "ai" | "template";
  /** Whether this used a fallback */
  fallback: boolean;
  /** Template IDs used (for debugging/analytics) */
  templateIds?: string[];
}

// =============================================================================
// A/B Test Configuration
// =============================================================================

/**
 * Percentage of sightings to use templates (0-100).
 * Start at 100% templates, adjust based on resonance data.
 */
const TEMPLATE_PERCENTAGE = 100;

/**
 * Determine if this sighting should use templates based on A/B config.
 * Uses a deterministic hash so the same sighting always gets the same treatment.
 */
function shouldUseTemplates(sightingId: string): boolean {
  // Simple hash based on sighting ID
  let hash = 0;
  for (let i = 0; i < sightingId.length; i++) {
    const char = sightingId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const percentage = Math.abs(hash % 100);
  return percentage < TEMPLATE_PERCENTAGE;
}

// =============================================================================
// Context Gathering
// =============================================================================

/**
 * Map activity string to Activity type.
 */
function mapActivity(activity?: string): Activity | undefined {
  if (!activity) return undefined;
  const validActivities: Activity[] = ["working", "transit", "resting", "socializing", "other"];
  return validActivities.includes(activity as Activity) ? (activity as Activity) : undefined;
}

/**
 * Map dominant element from profile to Element type.
 */
function mapElement(profile?: UserProfileContext): Element | undefined {
  if (!profile?.dominantElement) return undefined;
  const validElements: Element[] = ["fire", "water", "earth", "air"];
  return validElements.includes(profile.dominantElement as Element)
    ? (profile.dominantElement as Element)
    : undefined;
}

/**
 * Gather context for template assembly from sighting and profile data.
 */
function gatherAssemblyContext(
  sighting: SightingData,
  profile?: UserProfileContext
): AssemblyContext {
  return {
    moonPhase: sighting.cosmicContext?.moon?.phase,
    moodTags: sighting.moodTags,
    activity: mapActivity(sighting.activity),
    userElement: mapElement(profile),
    // Pattern insights will come from Track A when ready
    patterns: undefined,
  };
}

// =============================================================================
// Interpretation Generation
// =============================================================================

/**
 * Generate an interpretation for a sighting.
 *
 * Decision flow:
 * 1. If forceAI, use Claude
 * 2. If A/B test says AI, use Claude
 * 3. Attempt template assembly
 * 4. If assembly fails quality check, fall back to Claude
 *
 * @param sighting - The sighting data
 * @param count - Total sighting count for this number (for AI context)
 * @param isFirstCatch - Whether this is the first time seeing this number
 * @param options - Interpretation options
 */
export async function generateInterpretation(
  sighting: SightingData,
  count: number,
  isFirstCatch: boolean,
  options: InterpretOptions
): Promise<InterpretResult> {
  const { forceAI, profile } = options;
  // Note: options.userId will be used for pattern insights when Track A integrates

  // 1. Force AI for regeneration requests
  if (forceAI) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile);
  }

  // 2. Check A/B test assignment
  if (!shouldUseTemplates(sighting.id)) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile);
  }

  // 3. Attempt template assembly
  const context = gatherAssemblyContext(sighting, profile);
  const assembled = assembleInterpretation(sighting.number, context);

  // 4. Quality check - fall back to AI if assembly is weak
  if (!meetsQualityThreshold(assembled)) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile);
  }

  // Save template interpretation
  await saveInterpretation(
    sighting.id,
    assembled!.interpretation,
    "template",
    "template"
  );

  return {
    content: assembled!.interpretation,
    essence: assembled!.essence,
    source: "template",
    fallback: false,
    templateIds: assembled!.templateIds,
  };
}

/**
 * Generate AI interpretation using Claude.
 */
async function generateAIInterpretation(
  sighting: SightingData,
  count: number,
  isFirstCatch: boolean,
  profile?: UserProfileContext
): Promise<InterpretResult> {
  const claudeContext: InterpretationContext = {
    sightingId: sighting.id,
    number: sighting.number,
    note: sighting.note,
    moodTags: sighting.moodTags,
    count,
    isFirstCatch,
    profile,
  };

  const result = await generateWithClaude(claudeContext);

  return {
    content: result.content,
    source: "ai",
    fallback: result.fallback,
  };
}

/**
 * Save interpretation with source tracking.
 */
async function saveInterpretation(
  sightingId: string,
  content: string,
  model: string,
  source: "ai" | "template"
): Promise<void> {
  await db
    .insert(signalInterpretations)
    .values({
      sightingId,
      content,
      model,
      source,
    })
    .onConflictDoUpdate({
      target: signalInterpretations.sightingId,
      set: {
        content,
        model,
        source,
        createdAt: new Date(),
      },
    });
}

// =============================================================================
// Regeneration
// =============================================================================

/**
 * Regenerate interpretation for a sighting using AI.
 * Always uses Claude regardless of template availability.
 *
 * @param sighting - The sighting data
 * @param count - Total sighting count for this number
 * @param isFirstCatch - Whether this is the first time seeing this number
 * @param profile - User's spiritual profile
 */
export async function regenerateInterpretation(
  sighting: SightingData,
  count: number,
  isFirstCatch: boolean,
  profile?: UserProfileContext
): Promise<InterpretResult> {
  return generateInterpretation(sighting, count, isFirstCatch, {
    forceAI: true,
    userId: "", // Not needed for regeneration
    profile,
  });
}
