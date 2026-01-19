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
