/**
 * Template system for deterministic interpretation assembly.
 *
 * This module provides a template-based interpretation engine that
 * assembles personalized angel number interpretations from pre-authored
 * templates, eliminating AI cost for most interpretations.
 *
 * @module templates
 */

// =============================================================================
// Types
// =============================================================================

export type {
  Activity,
  Element,
  ModifierType,
  TemplateCategory,
  BaseTemplate,
  MoonModifier,
  MoodModifier,
  ActivityModifier,
  ElementModifier,
  Modifier,
  PatternInjection,
  PatternInsight,
  AssemblyContext,
  AssembledInterpretation,
  TemplateStore,
} from "./types";

// =============================================================================
// Schemas (for validation)
// =============================================================================

export {
  baseTemplateSchema,
  moonModifierSchema,
  moodModifierSchema,
  activityModifierSchema,
  elementModifierSchema,
  patternInjectionSchema,
  type BaseTemplateInput,
  type MoonModifierInput,
  type MoodModifierInput,
  type ActivityModifierInput,
  type ElementModifierInput,
  type PatternInjectionInput,
} from "./schemas";

// =============================================================================
// Template Loading
// =============================================================================

export {
  getTemplateStore,
  clearTemplateCache,
  getBaseTemplate,
  getMoonModifier,
  getMoodModifier,
  getActivityModifier,
  getElementModifier,
  getPatternInjection,
  getTemplateStats,
} from "./load";

// =============================================================================
// Template Selection
// =============================================================================

export {
  detectCategory,
  selectBaseTemplate,
  hasTemplate,
  getAvailableNumbers,
} from "./select";

// =============================================================================
// Pattern Injection
// =============================================================================

export {
  renderInjection,
  renderPatternInjection,
  renderPatternInjections,
} from "./inject";

// =============================================================================
// Assembly
// =============================================================================

export { assembleInterpretation, meetsQualityThreshold } from "./assemble";
