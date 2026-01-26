// Feature flags
export { isSignalEnabled } from "./feature-flags";

// Zod schemas and types
export {
  MOOD_OPTIONS,
  createSightingSchema,
  type MoodOption,
  type CreateSightingInput,
} from "./schemas";

// Cosmic context
export {
  calculateCosmicContext,
  calculateMoonPhase,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
  type MoonPhase,
  type PlanetContext,
  type CosmicAspect,
  type CosmicContext,
} from "./cosmic-context";

// TypeScript interfaces
export type {
  SightingWithInterpretation,
  UserStats,
  NumberCount,
} from "./types";

// Base meanings
export { getBaseMeaning } from "./meanings";

// Claude API integration
export {
  generateInterpretation,
  type InterpretationContext,
  type InterpretationResult,
} from "./claude";

// Rate limiting
export { checkRateLimit } from "./rate-limit";

// Subscriptions
export {
  hasInsightAccess,
  getSubscriptionTier,
  canRegenerate,
  incrementRegenerations,
  SUBSCRIPTION_TIERS,
  type CanRegenerateResult,
} from "./subscriptions";
