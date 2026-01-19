"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SacredSpinner } from "./sacred-spinner";

export interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Primary action button for Signal capture flow.
 * Shows spinner and "Receiving..." text during loading state.
 */
export function SubmitButton({
  onClick,
  disabled,
  isLoading,
  children = "Continue",
  className,
}: SubmitButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.01 }}
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      className={cn(
        "w-full h-14 rounded-xl text-lg font-heading tracking-wide",
        "transition-all duration-200",
        isDisabled
          ? "bg-[var(--color-warm-charcoal)] text-[var(--color-dim)] cursor-not-allowed"
          : "bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]",
        className
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <SacredSpinner size="sm" />
          Receiving...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
