"use client";

import { motion } from "motion/react";
import { SacredSpinner } from "./sacred-spinner";
import { fadeUpVariants } from "./animation-config";

export interface InterpretationCardProps {
  content: string | null;
  isLoading: boolean;
  isFallback?: boolean;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}

/**
 * Display component for AI-generated interpretations.
 * Shows loading state with spinner, content with fade-in animation,
 * and optional regenerate button.
 */
export function InterpretationCard({
  content,
  isLoading,
  isFallback,
  onRegenerate,
  canRegenerate,
}: InterpretationCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SacredSpinner size="lg" />
        <p className="mt-4 text-[var(--color-dim)]">Receiving...</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="prose prose-invert prose-gold max-w-none">
        {content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-[var(--color-cream)] leading-relaxed mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {isFallback && (
        <p className="text-xs text-[var(--color-dim)]">
          Using base interpretation
        </p>
      )}

      {canRegenerate && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
        >
          Regenerate interpretation
        </button>
      )}
    </motion.div>
  );
}
