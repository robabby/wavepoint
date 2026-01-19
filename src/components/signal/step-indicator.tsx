"use client";

import { cn } from "@/lib/utils";

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

/**
 * Progress dots for wizard/capture flow.
 * Current step is wider with gold fill, completed steps are gold-tinted,
 * upcoming steps are dim.
 */
export function StepIndicator({
  currentStep,
  totalSteps,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, step) => (
        <div
          key={step}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            currentStep === step
              ? "w-6 bg-[var(--color-gold)]"
              : currentStep > step
                ? "w-1.5 bg-[var(--color-gold)]/50"
                : "w-1.5 bg-[var(--color-dim)]/30"
          )}
        />
      ))}
    </div>
  );
}
