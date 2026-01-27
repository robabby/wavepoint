import type { CoreNumberType } from "@/lib/numerology";
import { formatPositionList } from "@/lib/numerology";

interface NumerologyPersonalizationCalloutProps {
  /** Array of positions where this digit appears in user's profile */
  positions: CoreNumberType[];
  /** Optional className for additional styling */
  className?: string;
}

/**
 * "This is YOUR number" callout badge.
 * Displays when viewing a digit that appears in the user's numerology profile.
 * Shows which positions match (e.g., "This is YOUR Life Path & Birthday number").
 */
export function NumerologyPersonalizationCallout({
  positions,
  className,
}: NumerologyPersonalizationCalloutProps) {
  if (positions.length === 0) return null;

  const formattedPositions = formatPositionList(positions);

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/10 px-4 py-2 text-sm">
        <span className="text-[var(--color-gold)]">✦</span>
        <span className="text-foreground">
          This is your{" "}
          <span className="font-medium text-[var(--color-gold)]">
            {formattedPositions}
          </span>{" "}
          number
        </span>
        <span className="text-[var(--color-gold)]">✦</span>
      </div>
    </div>
  );
}
