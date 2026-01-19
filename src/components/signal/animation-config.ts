/**
 * Signal-specific animation configuration.
 * Extends the codebase animation patterns for Signal UI components.
 */
import { type Variants } from "motion/react";
import { EASE_STANDARD } from "@/lib/animation-constants";

// Timing constants (aligned with docs/ux/interaction-patterns.md)
export const SIGNAL_TIMING = {
  micro: 0.1, // 100ms - button presses
  small: 0.25, // 250ms - reveals, cards
  medium: 0.35, // 350ms - modals, overlays
  stagger: 0.05, // 50ms - between items
  celebration: 3, // 3s - first-catch duration
  spinner: 3, // 3s - meditative rotation
} as const;

// Particle colors for celebrations
export const PARTICLE_COLORS = [
  "var(--color-gold)",
  "var(--color-gold-bright)",
  "var(--color-copper)",
  "var(--color-bronze)",
] as const;

// Reusable entrance variants
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: SIGNAL_TIMING.small, ease: EASE_STANDARD },
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: SIGNAL_TIMING.small, ease: EASE_STANDARD },
  },
};

// Stagger container variant
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: SIGNAL_TIMING.stagger,
    },
  },
};

// Button interaction config
export const buttonInteraction = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: SIGNAL_TIMING.micro },
};

// Digit button interaction (quicker feedback)
export const digitInteraction = {
  whileTap: { scale: 0.95 },
  transition: { duration: SIGNAL_TIMING.micro },
};

// Step transition variants (wizard flow)
export const stepTransitionVariants: Variants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const stepTransition = {
  duration: SIGNAL_TIMING.small,
  ease: "easeInOut" as const,
};

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? s[0] ?? "th";
}
