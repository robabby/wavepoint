"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/animation-constants";

/**
 * Animated card wrapper with enhanced hover and focus states.
 * Provides smooth scale, glow, and border transitions.
 * Use with GeometryImage for coordinated geometry rotation.
 */
interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-lg border border-[var(--border-gold)] bg-card",
        // Focus-visible styles for when card is wrapped in a focusable element
        "transition-shadow focus-within:ring-2 focus-within:ring-[var(--color-gold)] focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      whileHover={{
        scale: 1.02,
        borderColor: "var(--border-gold)",
        boxShadow: "0 0 20px var(--glow-gold)",
      }}
      transition={{
        duration: 0.3,
        ease: EASE_STANDARD,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Geometry image wrapper that rotates on parent card hover.
 * Uses CSS group-hover for coordination with AnimatedCard.
 */
interface GeometryImageProps {
  children: ReactNode;
  className?: string;
}

export function GeometryImage({ children, className }: GeometryImageProps) {
  return (
    <div
      className={cn(
        "transition-transform duration-400 ease-out group-hover:rotate-[15deg]",
        className
      )}
    >
      {children}
    </div>
  );
}
