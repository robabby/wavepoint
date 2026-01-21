"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/animation-constants";

/**
 * Animated button wrapper with enhanced hover/tap/focus states.
 * Provides smooth scale, glow, and shadow transitions.
 * Use as a wrapper around Radix UI Button or any button element.
 */
interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
}

export function AnimatedButton({
  children,
  className,
  variant = "primary",
}: AnimatedButtonProps) {
  const variantStyles = {
    primary: {
      whileHover: {
        scale: 1.02,
        boxShadow: "0 0 24px var(--glow-gold)",
      },
      whileTap: {
        scale: 0.98,
      },
    },
    outline: {
      whileHover: {
        scale: 1.02,
        boxShadow: "0 0 16px var(--glow-gold)",
      },
      whileTap: {
        scale: 0.98,
      },
    },
    ghost: {
      whileHover: {
        scale: 1.02,
      },
      whileTap: {
        scale: 0.98,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "inline-block rounded-md transition-shadow focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--color-gold)] focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      whileHover={variantStyles[variant].whileHover}
      whileTap={variantStyles[variant].whileTap}
      transition={{
        duration: 0.2,
        ease: EASE_STANDARD,
      }}
    >
      {children}
    </motion.div>
  );
}
