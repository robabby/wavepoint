/**
 * Signal UI Components
 *
 * Core components for the Signal (angel number tracking) feature.
 * See docs/plans/signal/phases/4-ui-components.md for specs.
 */

// Atomic components
export { SacredSpinner, type SacredSpinnerProps } from "./sacred-spinner";
export { SubmitButton, type SubmitButtonProps } from "./submit-button";
export { StepIndicator, type StepIndicatorProps } from "./step-indicator";
export {
  SignalBackground,
  type SignalBackgroundProps,
} from "./signal-background";

// Input components
export { NumberPad, type NumberPadProps } from "./number-pad";
export { MoodSelector, type MoodSelectorProps } from "./mood-selector";

// Display components
export {
  InterpretationCard,
  type InterpretationCardProps,
} from "./interpretation-card";
export { SightingCard, type SightingCardProps } from "./sighting-card";
export { CollectionGrid, type CollectionGridProps } from "./collection-grid";

// Celebration
export {
  FirstCatchCelebration,
  type FirstCatchCelebrationProps,
} from "./first-catch-celebration";

// Page-level components
export { NoteInput, type NoteInputProps } from "./note-input";
export { StatsSummary, type StatsSummaryProps } from "./stats-summary";
export { RecentSightings, type RecentSightingsProps } from "./recent-sightings";
export { DeleteDialog, type DeleteDialogProps } from "./delete-dialog";

// Marketing components
// Note: FloatingNumbers must be dynamically imported with ssr: false
// Use: dynamic(() => import("./floating-numbers").then(m => m.FloatingNumbers), { ssr: false })
export type { FloatingNumbersProps } from "./floating-numbers";
export { SignalMarketingPage } from "./signal-marketing-page";

// Animation config (for page-level transitions)
export {
  SIGNAL_TIMING,
  PARTICLE_COLORS,
  fadeUpVariants,
  scaleVariants,
  staggerContainerVariants,
  buttonInteraction,
  digitInteraction,
  stepTransitionVariants,
  stepTransition,
  getOrdinal,
} from "./animation-config";
