/**
 * Content loading and formatting utilities
 * Loads MDX content files for both Platonic Solids and Patterns
 */

// Shared types
export { type SectionInfo, type ContentWithSections } from "./types";

// Platonic Solids (MDX)
export {
  getPlatonicSolidContent,
  getAllPlatonicSolidContentSlugs,
  platonicSolidContentExists,
  type PlatonicSolidContent,
} from "./platonic-solids";

// Patterns (MDX)
export {
  getPatternContent,
  getAllPatternContentSlugs,
  patternContentExists,
  type PatternContent,
} from "./patterns";
