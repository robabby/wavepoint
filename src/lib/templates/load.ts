/**
 * Template loading from data files.
 *
 * Templates are stored in src/lib/templates/data/ as TypeScript modules.
 * This module loads and caches them for use by the assembly engine.
 *
 * @module templates/load
 */

import type {
  BaseTemplate,
  MoonModifier,
  MoodModifier,
  ActivityModifier,
  ElementModifier,
  PatternInjection,
  TemplateStore,
} from "./types";

// Static imports of template data
import repetitionTemplates from "./data/base/repetition";
import sequenceTemplates from "./data/base/sequence";
import mirrorTemplates from "./data/base/mirror";
import classicTemplates from "./data/base/classic";
import moonModifiers from "./data/modifiers/moon";
import moodModifiers from "./data/modifiers/mood";
import activityModifiers from "./data/modifiers/activity";
import elementModifiers from "./data/modifiers/element";
import patternInjections from "./data/injections";

// =============================================================================
// Template Cache
// =============================================================================

let templateStore: TemplateStore | null = null;

/**
 * Get the template store, loading if necessary.
 */
export function getTemplateStore(): TemplateStore {
  if (!templateStore) {
    templateStore = loadAllTemplates();
  }
  return templateStore;
}

/**
 * Clear the template cache (for testing).
 */
export function clearTemplateCache(): void {
  templateStore = null;
}

// =============================================================================
// Template Loading
// =============================================================================

/**
 * Load all templates from the data modules.
 */
function loadAllTemplates(): TemplateStore {
  const store: TemplateStore = {
    base: new Map(),
    moon: new Map(),
    mood: new Map(),
    activity: new Map(),
    element: new Map(),
    injections: new Map(),
  };

  // Load base templates
  for (const template of repetitionTemplates) {
    store.base.set(template.number, template);
  }
  for (const template of sequenceTemplates) {
    store.base.set(template.number, template);
  }
  for (const template of mirrorTemplates) {
    store.base.set(template.number, template);
  }
  for (const template of classicTemplates) {
    store.base.set(template.number, template);
  }

  // Load modifiers
  for (const mod of moonModifiers) {
    store.moon.set(mod.key, mod);
  }
  for (const mod of moodModifiers) {
    store.mood.set(mod.key, mod);
  }
  for (const mod of activityModifiers) {
    store.activity.set(mod.key, mod);
  }
  for (const mod of elementModifiers) {
    store.element.set(mod.key, mod);
  }

  // Load pattern injections
  for (const injection of patternInjections) {
    store.injections.set(injection.patternType, injection);
  }

  return store;
}

// =============================================================================
// Store Access Helpers
// =============================================================================

/**
 * Get a base template by number.
 */
export function getBaseTemplate(number: string): BaseTemplate | undefined {
  return getTemplateStore().base.get(number);
}

/**
 * Get a moon modifier by phase.
 */
export function getMoonModifier(phase: string): MoonModifier | undefined {
  return getTemplateStore().moon.get(phase);
}

/**
 * Get a mood modifier by mood name.
 */
export function getMoodModifier(mood: string): MoodModifier | undefined {
  return getTemplateStore().mood.get(mood);
}

/**
 * Get an activity modifier by activity.
 */
export function getActivityModifier(activity: string): ActivityModifier | undefined {
  return getTemplateStore().activity.get(activity);
}

/**
 * Get an element modifier by element.
 */
export function getElementModifier(element: string): ElementModifier | undefined {
  return getTemplateStore().element.get(element);
}

/**
 * Get a pattern injection by type.
 */
export function getPatternInjection(type: string): PatternInjection | undefined {
  return getTemplateStore().injections.get(type);
}

/**
 * Get count of loaded templates.
 */
export function getTemplateStats(): {
  base: number;
  moon: number;
  mood: number;
  activity: number;
  element: number;
  injections: number;
  total: number;
} {
  const store = getTemplateStore();
  const base = store.base.size;
  const moon = store.moon.size;
  const mood = store.mood.size;
  const activity = store.activity.size;
  const element = store.element.size;
  const injections = store.injections.size;

  return {
    base,
    moon,
    mood,
    activity,
    element,
    injections,
    total: base + moon + mood + activity + element + injections,
  };
}
