/**
 * Template assembly engine.
 *
 * Combines base templates with modifiers and pattern injections
 * to create personalized, deterministic interpretations.
 *
 * @module templates/assemble
 */

import type { AssemblyContext, AssembledInterpretation } from "./types";
import {
  getMoonModifier,
  getMoodModifier,
  getActivityModifier,
  getElementModifier,
} from "./load";
import { selectBaseTemplate } from "./select";
import { renderPatternInjections } from "./inject";

// =============================================================================
// Quality Threshold
// =============================================================================

/** Minimum interpretation length to consider quality sufficient */
const MIN_INTERPRETATION_LENGTH = 100;

/** Minimum number of template IDs for a complete assembly */
const MIN_TEMPLATE_IDS = 1;

/**
 * Check if an assembled interpretation meets quality threshold.
 *
 * Used to decide whether to fall back to AI generation.
 */
export function meetsQualityThreshold(
  assembled: AssembledInterpretation | undefined
): assembled is AssembledInterpretation {
  if (!assembled) {
    return false;
  }

  // Check interpretation length
  if (assembled.interpretation.length < MIN_INTERPRETATION_LENGTH) {
    return false;
  }

  // Check that we have at least a base template
  if (assembled.templateIds.length < MIN_TEMPLATE_IDS) {
    return false;
  }

  // Check essence exists
  if (!assembled.essence || assembled.essence.length === 0) {
    return false;
  }

  return true;
}

// =============================================================================
// Assembly
// =============================================================================

/**
 * Assemble an interpretation from templates.
 *
 * Process:
 * 1. Select base template for number
 * 2. Build interpretation parts starting with expanded text
 * 3. Apply modifiers (moon, mood, activity, element)
 * 4. Inject pattern insights
 * 5. Return assembled interpretation
 *
 * @param number - The number pattern to interpret
 * @param context - Context for personalization
 * @returns Assembled interpretation or undefined if no template found
 */
export function assembleInterpretation(
  number: string,
  context: AssemblyContext
): AssembledInterpretation | undefined {
  // 1. Select base template
  const base = selectBaseTemplate(number);
  if (!base) {
    return undefined;
  }

  // Track template IDs used
  const templateIds: string[] = [base.number];

  // 2. Start with expanded interpretation
  const parts: string[] = [base.expanded];

  // 3. Apply modifiers
  applyMoonModifier(context, parts, templateIds);
  applyMoodModifier(context, parts, templateIds);
  applyActivityModifier(context, parts, templateIds);
  applyElementModifier(context, parts, templateIds);

  // 4. Inject pattern insights
  if (context.patterns && context.patterns.length > 0) {
    const injectedParts = renderPatternInjections(context.patterns);
    for (const part of injectedParts) {
      parts.push(part);
      // Track injection type in templateIds
      templateIds.push(`injection:${context.patterns.find((p) => part.includes(p.value.toString()))?.type ?? "unknown"}`);
    }
  }

  // 5. Assemble final interpretation
  return {
    essence: base.essence,
    interpretation: parts.join("\n\n"),
    source: "template",
    templateIds,
  };
}

// =============================================================================
// Modifier Application
// =============================================================================

/**
 * Apply moon phase modifier if present in context.
 */
function applyMoonModifier(
  context: AssemblyContext,
  parts: string[],
  templateIds: string[]
): void {
  if (!context.moonPhase) {
    return;
  }

  const modifier = getMoonModifier(context.moonPhase);
  if (!modifier) {
    return;
  }

  // Add transition + suffix
  const modifierText = modifier.transition
    ? `${modifier.transition} ${modifier.suffix}`
    : modifier.suffix;

  parts.push(modifierText);
  templateIds.push(`moon:${modifier.key}`);
}

/**
 * Apply mood modifier if present in context.
 *
 * Only applies primary mood to avoid over-modification.
 */
function applyMoodModifier(
  context: AssemblyContext,
  parts: string[],
  templateIds: string[]
): void {
  if (!context.moodTags || context.moodTags.length === 0) {
    return;
  }

  // Use only primary mood
  const primaryMood = context.moodTags[0];
  if (!primaryMood) {
    return;
  }
  const modifier = getMoodModifier(primaryMood);
  if (!modifier) {
    return;
  }

  const modifierText = modifier.transition
    ? `${modifier.transition} ${modifier.suffix}`
    : modifier.suffix;

  parts.push(modifierText);
  templateIds.push(`mood:${modifier.key}`);
}

/**
 * Apply activity modifier if present in context.
 */
function applyActivityModifier(
  context: AssemblyContext,
  parts: string[],
  templateIds: string[]
): void {
  if (!context.activity) {
    return;
  }

  const modifier = getActivityModifier(context.activity);
  if (!modifier) {
    return;
  }

  const modifierText = modifier.transition
    ? `${modifier.transition} ${modifier.suffix}`
    : modifier.suffix;

  parts.push(modifierText);
  templateIds.push(`activity:${modifier.key}`);
}

/**
 * Apply element modifier if present in context.
 */
function applyElementModifier(
  context: AssemblyContext,
  parts: string[],
  templateIds: string[]
): void {
  if (!context.userElement) {
    return;
  }

  const modifier = getElementModifier(context.userElement);
  if (!modifier) {
    return;
  }

  const modifierText = modifier.transition
    ? `${modifier.transition} ${modifier.suffix}`
    : modifier.suffix;

  parts.push(modifierText);
  templateIds.push(`element:${modifier.key}`);
}
