"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getMoonPhaseEmoji,
  getMoonPhaseGlow,
  getMoonPhaseName,
  type MoonPhase,
} from "@/lib/signal/cosmic-context";

export interface DayCellProps {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Day of month (1-31) */
  day: number;
  /** Whether this day is in the current displayed month */
  isCurrentMonth: boolean;
  /** Whether this is today */
  isToday: boolean;
  /** Whether this day is currently selected */
  isSelected: boolean;
  /** Moon phase for this day */
  moonPhase: MoonPhase | null;
  /** Whether user has sightings on this day */
  hasSightings: boolean;
  /** Whether user has journal entry on this day */
  hasJournal: boolean;
  /** Click handler */
  onClick: () => void;
  /** Keyboard focus handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
}

/**
 * Individual day cell for the month view calendar.
 *
 * Features:
 * - Moon phase emoji with atmospheric glow
 * - Gold indicator dot for sightings
 * - Copper indicator dot for journal entries
 * - Today ring highlight
 * - Selected state styling
 */
export function DayCell({
  date,
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  moonPhase,
  hasSightings,
  hasJournal,
  onClick,
  onKeyDown,
  tabIndex = 0,
}: DayCellProps) {
  const phaseGlow = moonPhase ? getMoonPhaseGlow(moonPhase) : "transparent";

  // Build accessible label with human-readable date and context
  const parsedDate = parseISO(date);
  const readableDate = format(parsedDate, "EEEE, MMMM d, yyyy");
  const ariaLabel = [
    readableDate,
    moonPhase ? getMoonPhaseName(moonPhase) : null,
    isToday ? "today" : null,
    isSelected ? "selected" : null,
    hasSightings ? "has sightings" : null,
    hasJournal ? "has journal entry" : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-current={isToday ? "date" : undefined}
      aria-pressed={isSelected}
      className={cn(
        "relative flex w-full flex-col items-center justify-center",
        "h-16 md:h-20 rounded-lg cursor-pointer",
        "transition-all duration-200",
        // Base state - more visible background
        "bg-card/40 border border-white/5",
        // Hover - brighter on hover
        "hover:bg-card/60 hover:border-[var(--border-gold)]/30",
        // Today - more prominent ring
        isToday && "ring-2 ring-[var(--color-gold)]/60",
        // Selected - stronger gold tint
        isSelected && "bg-[var(--color-gold)]/15 border-[var(--border-gold)]/50",
        // Other month (grayed out)
        !isCurrentMonth && "opacity-40",
        // Focus visible
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/80"
      )}
    >
      {/* Moon phase with subtle glow */}
      {moonPhase && (
        <span
          className="text-lg md:text-xl"
          style={{ filter: `drop-shadow(0 0 8px ${phaseGlow})` }}
          role="img"
          aria-hidden="true"
        >
          {getMoonPhaseEmoji(moonPhase)}
        </span>
      )}

      {/* Date number */}
      <span
        className={cn(
          "text-sm mt-0.5",
          isToday ? "text-[var(--color-gold)] font-medium" : "text-muted-foreground"
        )}
      >
        {day}
      </span>

      {/* Indicator dots */}
      <div className="absolute bottom-2 flex gap-1">
        {hasSightings && (
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-gold)]"
            style={{ boxShadow: "0 0 4px var(--color-gold)" }}
            aria-hidden="true"
          />
        )}
        {hasJournal && (
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-copper)]"
            style={{ boxShadow: "0 0 4px var(--color-copper)" }}
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
}
