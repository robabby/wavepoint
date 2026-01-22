"use client";

import { cn } from "@/lib/utils";
import {
  type NumberRelationshipType,
  getNumberRelationshipCategory,
  getRelationshipLabel,
} from "@/lib/numbers";

interface NumberRelationshipBadgeProps {
  type: NumberRelationshipType;
  className?: string;
}

/**
 * Color-coded badge for number relationship types.
 * Subtle mystical character with decorative accent.
 */
const CATEGORY_STYLES = {
  family:
    "bg-[var(--color-gold)]/15 text-[var(--color-gold)] border-[var(--color-gold)]/25",
  sequential:
    "bg-amber-500/15 text-amber-400 border-amber-500/25",
  structural:
    "bg-[var(--color-bronze)]/15 text-[var(--color-bronze)] border-[var(--color-bronze)]/25",
  thematic:
    "bg-[var(--color-gold-bright)]/10 text-[var(--color-cream)] border-[var(--color-gold-bright)]/20",
};

export function NumberRelationshipBadge({
  type,
  className,
}: NumberRelationshipBadgeProps) {
  const category = getNumberRelationshipCategory(type);
  const label = getRelationshipLabel(type);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-medium",
        "transition-all",
        CATEGORY_STYLES[category],
        className
      )}
    >
      <span className="opacity-60">✧</span>
      {label}
    </span>
  );
}
