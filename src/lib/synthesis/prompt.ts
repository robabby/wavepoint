/**
 * Generate Claude prompt context from synthesis results.
 */

import type { PatternSynthesisResult } from "./types";
import { MAX_SYNTHESIS_PROMPT_TOKENS } from "./constants";

/**
 * Build synthesis context for a Signal interpretation prompt.
 *
 * @param result - Pattern synthesis result
 * @returns Context string (max ~300 tokens)
 */
export function buildSynthesisContext(result: PatternSynthesisResult): string {
  const lines: string[] = [];

  // Pattern header
  lines.push(`Synthesis context for ${result.patternMeta.pattern}:`);

  // Planet and element
  lines.push(`- ${result.patternMeta.primaryPlanet} energy (${result.patternMeta.primaryElement})`);

  // Geometry if present
  if (result.patternMeta.geometry) {
    lines.push(`- Sacred geometry: ${result.patternMeta.geometry}`);
  }

  // Archetypes if present
  if (result.patternMeta.archetypes.length > 0) {
    const archetypeNames = result.patternMeta.archetypes
      .slice(0, 2) // Limit to 2 for brevity
      .map((slug) => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    lines.push(`- Archetypes: ${archetypeNames.join(", ")}`);
  }

  // Personal connections (concise)
  if (result.personalConnections) {
    const { elementAlignment, relatedSigns } = result.personalConnections;

    if (elementAlignment === "harmonious") {
      lines.push(`- Chart alignment: harmonious (same element)`);
    } else if (elementAlignment === "challenging") {
      lines.push(`- Chart alignment: growth opportunity (opposing element)`);
    }

    if (relatedSigns.length > 0) {
      lines.push(`- User placements: ${relatedSigns.slice(0, 3).join(", ")}`);
    }
  }

  return lines.join("\n");
}

/**
 * Build full synthesis narrative for pattern pages.
 *
 * @param result - Pattern synthesis result
 * @returns Full narrative (can be longer)
 */
export function buildSynthesisNarrative(result: PatternSynthesisResult): string {
  return result.narrative;
}

/**
 * Check if synthesis context exceeds token budget.
 * Rough estimate: 1 token ≈ 4 characters.
 */
export function isWithinTokenBudget(context: string): boolean {
  const estimatedTokens = Math.ceil(context.length / 4);
  return estimatedTokens <= MAX_SYNTHESIS_PROMPT_TOKENS;
}
