/**
 * Pattern injection rendering.
 *
 * Renders pattern injection templates with user-specific data.
 *
 * @module templates/inject
 */

import type { PatternInjection, PatternInsight } from "./types";
import { getPatternInjection } from "./load";

// =============================================================================
// Template Rendering
// =============================================================================

/**
 * Render a pattern injection template with data.
 *
 * Replaces {{placeholders}} with actual values from the insight.
 */
export function renderInjection(
  injection: PatternInjection,
  insight: PatternInsight
): string | undefined {
  // Check minimum data points
  if (insight.dataPoints < injection.minDataPoints) {
    return undefined;
  }

  // Replace placeholders in template
  let rendered = injection.template;

  for (const [key, value] of Object.entries(insight.value)) {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, "g"), String(value));
  }

  // Check for unreplaced placeholders (missing data)
  if (/\{\{[\w]+\}\}/.test(rendered)) {
    return undefined;
  }

  return rendered;
}

/**
 * Render an injection for a pattern type with insight data.
 *
 * Looks up the injection template and renders it if valid.
 */
export function renderPatternInjection(insight: PatternInsight): string | undefined {
  const injection = getPatternInjection(insight.type);
  if (!injection) {
    return undefined;
  }

  return renderInjection(injection, insight);
}

/**
 * Render multiple pattern injections.
 *
 * Returns only successfully rendered injections.
 */
export function renderPatternInjections(insights: PatternInsight[]): string[] {
  const rendered: string[] = [];

  for (const insight of insights) {
    const result = renderPatternInjection(insight);
    if (result) {
      rendered.push(result);
    }
  }

  return rendered;
}
