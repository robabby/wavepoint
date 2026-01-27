"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResonance, useRecordResonance } from "@/hooks/resonance";
import type { ResonanceValue } from "@/lib/resonance";

interface ResonanceFeedbackProps {
  sightingId: string;
}

const OPTIONS: Array<{
  value: ResonanceValue;
  label: string;
  icon: typeof Check;
}> = [
  { value: true, label: "Yes", icon: Check },
  { value: false, label: "No", icon: X },
  { value: null, label: "Not sure yet", icon: HelpCircle },
];

/**
 * Resonance feedback component for sighting detail view.
 * Allows users to indicate if an interpretation resonated with them.
 */
export function ResonanceFeedback({ sightingId }: ResonanceFeedbackProps) {
  const { resonance, isLoading } = useResonance(sightingId);
  const { recordResonance, isRecording } = useRecordResonance();

  const handleSelect = useCallback(
    async (value: ResonanceValue) => {
      await recordResonance({ sightingId, resonated: value });
    },
    [recordResonance, sightingId]
  );

  // Don't render while loading initial state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
      </div>
    );
  }

  const hasResponded = resonance !== null;
  const currentValue = resonance?.resonated;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4"
    >
      <p className="mb-3 text-center text-sm text-muted-foreground">
        Did this interpretation resonate?
      </p>

      <div className="flex justify-center gap-2">
        {OPTIONS.map((option) => {
          const isSelected = hasResponded && currentValue === option.value;
          const Icon = option.icon;

          return (
            <button
              key={String(option.value)}
              onClick={() => handleSelect(option.value)}
              disabled={isRecording}
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2",
                "border transition-all duration-200",
                "text-sm font-medium",
                isSelected
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "border-border/50 text-muted-foreground hover:border-border hover:bg-card/50",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {hasResponded && (
        <p className="mt-3 text-center text-xs text-muted-foreground/70">
          You can update your response anytime
        </p>
      )}
    </motion.div>
  );
}
