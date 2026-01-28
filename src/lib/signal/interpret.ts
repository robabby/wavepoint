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
  type PatternInsight as TemplatePatternInsight,
} from "@/lib/templates";
import {
  generateInterpretation as generateWithClaude,
  type InterpretationContext,
  type UserProfileContext,
} from "./claude";
import type { MoonPhase } from "./cosmic-context";
import type { Activity, Element } from "@/lib/templates";
import { isAIEnabled } from "./feature-flags";
import { getBaseMeaning } from "./meanings";
import { getPatternPlanetaryMeta } from "@/lib/numbers/planetary";
import { getSynthesisGraph, getPatternSynthesis } from "@/lib/synthesis";
import { getCachedPatterns, type ComputedPatterns } from "@/lib/patterns";
import { getResonanceSummary } from "@/lib/resonance";
import type { ResonanceSummary } from "@/lib/resonance";
import {
  pickVariant,
  MOOD_SENTENCES,
  NOTE_SENTENCES,
  FIRST_CATCH_SENTENCES,
  REPEAT_SIGHTING_SENTENCES,
  MOON_SENTENCES,
} from "./synthesis-variants";

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
  /** Total sighting count for the user (for pattern cache lookup) */
  sightingCount?: number;
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
  /** Source: "ai", "template", or "synthesis" */
  source: "ai" | "template" | "synthesis";
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
 * Map ComputedPatterns from the patterns module into the template system's PatternInsight[] shape.
 * Extracts the most useful insights: peak hour, top mood correlation, frequency trend.
 */
function mapToTemplateInsights(
  computed: ComputedPatterns
): TemplatePatternInsight[] {
  const insights: TemplatePatternInsight[] = [];

  // Peak hour
  const peakHour = computed.timeDistribution.find((i) => i.key === "peak_hour");
  if (peakHour) {
    insights.push({
      type: "peak_hour",
      value: {
        hour: peakHour.value.hour,
        label: peakHour.value.label,
        percentage: peakHour.value.percentage,
      },
      dataPoints: peakHour.sightingCountAtComputation,
    });
  }

  // Top mood correlation (first one found)
  const topMood = computed.moodCorrelation.find((i) =>
    i.key.startsWith("top_mood_")
  );
  if (topMood && "number" in topMood.value) {
    const val = topMood.value as { mood: string; number: string; count: number; percentage: number };
    insights.push({
      type: "top_mood",
      value: {
        mood: val.mood,
        number: val.number,
        percentage: val.percentage,
      },
      dataPoints: topMood.sightingCountAtComputation,
    });
  }

  // Overall frequency trend
  const overallTrend = computed.frequencyTrend.find(
    (i) => i.key === "overall_trend"
  );
  if (overallTrend && "averagePerDay" in overallTrend.value) {
    insights.push({
      type: "frequency_trend",
      value: {
        trend: overallTrend.value.trend,
        averagePerDay: overallTrend.value.averagePerDay,
        percentageChange: overallTrend.value.percentageChange,
      },
      dataPoints: overallTrend.sightingCountAtComputation,
    });
  }

  return insights;
}

/**
 * Gather context for template assembly from sighting and profile data.
 * Fetches cached pattern insights when userId and sightingCount are available.
 */
async function gatherAssemblyContext(
  sighting: SightingData,
  profile?: UserProfileContext,
  userId?: string,
  sightingCount?: number
): Promise<AssemblyContext> {
  let patterns: TemplatePatternInsight[] | undefined;

  if (userId && sightingCount && sightingCount > 0) {
    try {
      const cached = await getCachedPatterns(userId, sightingCount);
      if (cached) {
        const mapped = mapToTemplateInsights(cached);
        if (mapped.length > 0) {
          patterns = mapped;
        }
      }
    } catch {
      // Gracefully degrade - patterns are optional
    }
  }

  return {
    moonPhase: sighting.cosmicContext?.moon?.phase,
    moodTags: sighting.moodTags,
    activity: mapActivity(sighting.activity),
    userElement: mapElement(profile),
    patterns,
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
  const { forceAI, profile, userId, sightingCount } = options;

  // 0. When AI is disabled, try templates first, then fall back to synthesis
  if (!isAIEnabled()) {
    const context = await gatherAssemblyContext(sighting, profile, userId, sightingCount);
    context.sightingId = sighting.id;
    const assembled = assembleInterpretation(sighting.number, context);
    if (meetsQualityThreshold(assembled)) {
      await saveInterpretation(sighting.id, assembled.interpretation, "template", "template");
      return {
        content: assembled.interpretation,
        essence: assembled.essence,
        source: "template",
        fallback: false,
        templateIds: assembled.templateIds,
      };
    }
    return generateSynthesisInterpretation(sighting, count, isFirstCatch, profile, userId);
  }

  // 1. Force AI for regeneration requests
  if (forceAI) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile, userId);
  }

  // 2. Check A/B test assignment
  if (!shouldUseTemplates(sighting.id)) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile, userId);
  }

  // 3. Attempt template assembly
  const context = await gatherAssemblyContext(sighting, profile, userId, sightingCount);
  context.sightingId = sighting.id;
  const assembled = assembleInterpretation(sighting.number, context);

  // 4. Quality check - fall back to AI if assembly is weak
  if (!meetsQualityThreshold(assembled)) {
    return generateAIInterpretation(sighting, count, isFirstCatch, profile, userId);
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
  profile?: UserProfileContext,
  userId?: string
): Promise<InterpretResult> {
  // Fetch resonance summary for tone calibration
  let resonance: ResonanceSummary | undefined;
  if (userId) {
    try {
      resonance = await getResonanceSummary(userId);
    } catch {
      // Gracefully degrade - resonance is optional
    }
  }

  const claudeContext: InterpretationContext = {
    sightingId: sighting.id,
    number: sighting.number,
    note: sighting.note,
    moodTags: sighting.moodTags,
    count,
    isFirstCatch,
    profile,
    resonance,
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
  source: "ai" | "template" | "synthesis"
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
// Synthesis Interpretation (deterministic, no AI)
// =============================================================================

/**
 * Generate a deterministic interpretation from the synthesis knowledge graph.
 * Used when AI is disabled and templates fail to meet quality threshold.
 * Enhanced with context-aware sentences for mood, notes, count, and moon phase.
 */
async function generateSynthesisInterpretation(
  sighting: SightingData,
  count: number,
  isFirstCatch: boolean,
  profile?: UserProfileContext,
  userId?: string
): Promise<InterpretResult> {
  const paragraphs: string[] = [];

  // Paragraph 1: Core angel number meaning
  const baseMeaning = getBaseMeaning(sighting.number);
  paragraphs.push(baseMeaning);

  // Paragraph 2: Planetary energy and geometry
  const meta = getPatternPlanetaryMeta(sighting.number);
  if (meta.energyDescription) {
    let energyParagraph = meta.energyDescription;
    if (meta.geometry) {
      energyParagraph += ` This pattern resonates with the ${meta.geometry}, grounding its energy in sacred form.`;
    }
    paragraphs.push(energyParagraph);
  }

  // Paragraph 3: Personal resonance from synthesis graph (if profile available)
  const graph = getSynthesisGraph();
  const synthesis = getPatternSynthesis(graph, {
    pattern: sighting.number,
    profile: profile
      ? {
          sunSign: profile.sunSign as Parameters<typeof getPatternSynthesis>[1]["profile"] extends { sunSign?: infer T } ? T : never,
          moonSign: profile.moonSign as Parameters<typeof getPatternSynthesis>[1]["profile"] extends { moonSign?: infer T } ? T : never,
          risingSign: profile.risingSign as Parameters<typeof getPatternSynthesis>[1]["profile"] extends { risingSign?: infer T } ? T : never,
          dominantElement: profile.dominantElement as Parameters<typeof getPatternSynthesis>[1]["profile"] extends { dominantElement?: infer T } ? T : never,
        }
      : undefined,
  });

  if (synthesis.personalConnections) {
    const alignment = synthesis.personalConnections.elementAlignment;
    const alignmentText =
      alignment === "harmonious"
        ? "This number flows naturally with your elemental nature."
        : alignment === "complementary"
          ? "This number brings a complementary energy to your chart."
          : "This number invites growth through creative tension with your elemental makeup.";
    paragraphs.push(alignmentText);
  } else {
    paragraphs.push(
      "Take a moment to notice what drew your attention to this number. The patterns you recognize often reflect what you're ready to understand."
    );
  }

  // Context-aware sentences: mood, note, count, moon phase
  if (sighting.moodTags && sighting.moodTags.length > 0) {
    const primaryMood = sighting.moodTags[0];
    if (primaryMood && MOOD_SENTENCES[primaryMood]) {
      paragraphs.push(pickVariant(sighting.id, MOOD_SENTENCES[primaryMood]!));
    }
  }

  if (sighting.note && sighting.note.trim().length > 0) {
    paragraphs.push(pickVariant(sighting.id, NOTE_SENTENCES));
  }

  if (isFirstCatch) {
    paragraphs.push(pickVariant(sighting.id, FIRST_CATCH_SENTENCES));
  } else if (count > 2) {
    paragraphs.push(pickVariant(sighting.id, REPEAT_SIGHTING_SENTENCES));
  }

  const moonPhase = sighting.cosmicContext?.moon?.phase;
  if (moonPhase && MOON_SENTENCES[moonPhase]) {
    paragraphs.push(pickVariant(sighting.id, MOON_SENTENCES[moonPhase]!));
  }

  // Closing paragraph: vary tone based on resonance feedback
  let resonance: ResonanceSummary | undefined;
  if (userId) {
    try {
      resonance = await getResonanceSummary(userId);
    } catch {
      // Gracefully degrade
    }
  }

  if (resonance && resonance.totalResponses >= 5) {
    if (resonance.resonanceRate < 50) {
      // Low resonance — more practical, grounded closing
      paragraphs.push(
        "Consider what's happening in your day right now. This number often appears when there's a practical step waiting to be taken — something concrete you can act on today."
      );
    } else if (resonance.resonanceRate >= 75) {
      // High resonance — lean into the mystical
      paragraphs.push(
        "Trust what you're sensing. The fact that this number caught your eye says something about where your awareness is right now — stay open to what unfolds."
      );
    }
    // 50-74%: no extra paragraph, the existing content stands on its own
  }

  const content = paragraphs.join("\n\n");

  await saveInterpretation(sighting.id, content, "synthesis", "synthesis");

  return {
    content,
    source: "synthesis",
    fallback: false,
  };
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
  if (!isAIEnabled()) {
    return generateSynthesisInterpretation(sighting, count, isFirstCatch, profile);
  }

  return generateInterpretation(sighting, count, isFirstCatch, {
    forceAI: true,
    userId: "", // Not needed for regeneration
    profile,
  });
}
