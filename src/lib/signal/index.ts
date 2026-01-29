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
  buildDashboardContext,
  calculateDashboardCosmicContext,
  calculateMoonPhase,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getMoonPhaseGlow,
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
  type MoonPhase,
  type PlanetContext,
  type CosmicAspect,
  type CosmicContext,
  type SignTransition,
  type DashboardCosmicContext,
} from "./cosmic-context";

// Sign transitions
export { calculateNextSignTransition } from "./sign-transitions";

// TypeScript interfaces
export type {
  SightingWithInterpretation,
  UserStats,
  NumberCount,
} from "./types";

// Base meanings
export { getBaseMeaning } from "./meanings";

// Claude API integration (AI fallback)
export {
  generateInterpretation as generateAIInterpretation,
  type InterpretationContext,
  type InterpretationResult as AIInterpretationResult,
  type UserProfileContext,
} from "./claude";

// Interpretation orchestrator (templates + AI fallback)
export {
  generateInterpretation,
  regenerateInterpretation,
  type InterpretOptions,
  type SightingData,
  type InterpretResult,
} from "./interpret";

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
