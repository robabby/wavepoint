"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SourceCategory } from "@/lib/astrology/planets";

interface SourceBadgeProps {
  /** The source category for styling */
  category: SourceCategory;
  /** Short label shown in badge */
  label?: string;
  /** Full citation text shown on hover */
  fullCitation?: string;
  /** Optional className */
  className?: string;
}

/**
 * Inline citation badge with color-coded styling by source category.
 *
 * Color coding:
 * - Scholarly: muted (most credible, least flashy)
 * - Traditional: copper (practitioner knowledge)
 * - Practitioner: copper/muted
 * - WavePoint: gold (our synthesis, clearly labeled)
 */
export function SourceBadge({
  category,
  label,
  fullCitation,
  className,
}: SourceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Default labels by category
  const defaultLabels: Record<SourceCategory, string> = {
    scholarly: "Scholarly",
    traditional: "Traditional",
    practitioner: "Modern",
    wavepoint: "WavePoint",
  };

  const displayLabel = label ?? defaultLabels[category];

  // Color classes by category
  const colorClasses: Record<SourceCategory, string> = {
    scholarly: "text-muted-foreground border-muted-foreground/30",
    traditional: "text-[var(--color-copper)] border-[var(--color-copper)]/30",
    practitioner: "text-muted-foreground border-muted-foreground/30",
    wavepoint: "text-[var(--color-gold)]/70 border-[var(--color-gold)]/30",
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className={cn(
          "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium",
          "transition-colors duration-150",
          "hover:bg-card/50",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-gold)]",
          colorClasses[category],
          className
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={fullCitation ?? `Source: ${displayLabel}`}
      >
        {displayLabel}
      </button>

      {/* Tooltip */}
      {showTooltip && fullCitation && (
        <span
          role="tooltip"
          className={cn(
            "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2",
            "whitespace-normal rounded-md border border-[var(--border-gold)]/30 bg-card px-3 py-2",
            "text-xs text-muted-foreground shadow-lg",
            "max-w-[280px] sm:max-w-[320px]"
          )}
        >
          {fullCitation}
          {/* Arrow */}
          <span
            className={cn(
              "absolute left-1/2 top-full -translate-x-1/2",
              "border-4 border-transparent border-t-card"
            )}
          />
        </span>
      )}
    </span>
  );
}
