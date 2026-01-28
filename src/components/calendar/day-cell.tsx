"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getMoonPhaseEmoji,
  getMoonPhaseGlow,
  getMoonPhaseName,
  type MoonPhase,
} from "@/lib/signal/cosmic-context";
import type { EclipseCategory } from "@/lib/eclipses";

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
  /** Whether this is the peak full moon day (closest to 180° elongation) */
  isPeakFullMoon?: boolean;
  /** Whether this is the peak new moon day (closest to 0° elongation) */
  isPeakNewMoon?: boolean;
  /** Whether user has sightings on this day */
  hasSightings: boolean;
  /** Whether user has journal entry on this day */
  hasJournal: boolean;
  /** Whether this day is within an Eclipse Portal (but not an eclipse day) */
  isInEclipsePortal?: boolean;
  /** Eclipse on this day (if any) */
  eclipse?: { category: EclipseCategory; isPenumbral: boolean } | null;
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
 * - Violet indicator dot and treatment for eclipse portal days
 * - Eclipse badge for eclipse days
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
  isPeakFullMoon = false,
  isPeakNewMoon = false,
  hasSightings,
  hasJournal,
  isInEclipsePortal = false,
  eclipse = null,
  onClick,
  onKeyDown,
  tabIndex = 0,
}: DayCellProps) {
  const phaseGlow = moonPhase ? getMoonPhaseGlow(moonPhase) : "transparent";
  // Visual treatment for all days in full/new moon phase
  const isFullMoon = moonPhase === "full_moon";
  const isNewMoon = moonPhase === "new_moon";

  // Eclipse states
  const isEclipseDay = eclipse !== null;
  const isPenumbral = eclipse?.isPenumbral ?? false;

  // Build accessible label with human-readable date and context
  const parsedDate = parseISO(date);
  const readableDate = format(parsedDate, "EEEE, MMMM d, yyyy");
  const ariaLabel = [
    readableDate,
    isEclipseDay
      ? `${eclipse.category} eclipse`
      : isInEclipsePortal
        ? "eclipse portal"
        : null,
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
        "group relative flex w-full flex-col items-center justify-center",
        "h-16 md:h-20 rounded-lg cursor-pointer",
        "transition-all duration-200 ease-out",
        // Base state
        "bg-card/40 border border-white/5",

        // === ECLIPSE DAY STYLES (actual eclipse) ===
        isEclipseDay &&
          !isPenumbral &&
          "border-[var(--color-eclipse-muted)]/40 bg-[var(--color-eclipse)]/12 shadow-[inset_0_0_20px_var(--glow-eclipse),0_0_12px_var(--glow-eclipse)]",
        isEclipseDay &&
          isPenumbral &&
          "border-[var(--color-eclipse-muted)]/25 bg-[var(--color-eclipse)]/8 shadow-[inset_0_0_16px_var(--glow-eclipse)]",

        // === ECLIPSE PORTAL + MOON PHASE BLENDED STYLES ===
        // Portal + Full Moon: violet atmosphere with golden border accent
        !isEclipseDay &&
          isInEclipsePortal &&
          isFullMoon &&
          "border-[var(--color-gold)]/30 bg-[var(--color-eclipse)]/8 shadow-[inset_0_0_12px_var(--glow-eclipse),0_0_8px_rgba(212,168,75,0.15)]",
        // Portal + New Moon: violet atmosphere with silver border accent
        !isEclipseDay &&
          isInEclipsePortal &&
          isNewMoon &&
          "border-slate-400/20 bg-[var(--color-eclipse)]/8 shadow-[inset_0_0_14px_var(--glow-eclipse)]",
        // Portal only (regular days): subtle violet atmosphere
        !isEclipseDay &&
          isInEclipsePortal &&
          !isFullMoon &&
          !isNewMoon &&
          "border-[var(--color-eclipse-muted)]/15 bg-[var(--color-eclipse)]/6 shadow-[inset_0_0_12px_var(--glow-eclipse)]",

        // === STANDALONE MOON PHASE STYLES (outside portal) ===
        // Full moon - radiant golden border and tint
        !isEclipseDay &&
          !isInEclipsePortal &&
          isFullMoon &&
          "border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5",
        // New moon - subtle silver/dark border
        !isEclipseDay &&
          !isInEclipsePortal &&
          isNewMoon &&
          "border-slate-400/30 bg-slate-900/30",
        // Today - prominent ring
        isToday && "ring-2 ring-[var(--color-gold)]/60",
        // Selected - stronger gold tint
        isSelected && "bg-[var(--color-gold)]/15 border-[var(--border-gold)]/50",
        // Other month (grayed out)
        !isCurrentMonth && "opacity-40",
        // Hover - additive effects that enhance existing styles
        "hover:scale-[1.02] hover:brightness-110",
        // Hover border glow - contextual to eclipse/moon phase
        // Eclipse day hover
        isEclipseDay &&
          "hover:border-[var(--color-eclipse-muted)]/50 hover:shadow-[inset_0_0_24px_var(--glow-eclipse),0_0_16px_var(--glow-eclipse)]",
        // Portal + Full Moon hover: enhanced gold + violet
        !isEclipseDay &&
          isInEclipsePortal &&
          isFullMoon &&
          "hover:border-[var(--color-gold)]/50 hover:shadow-[inset_0_0_16px_var(--glow-eclipse),0_0_12px_rgba(212,168,75,0.25)]",
        // Portal + New Moon hover: enhanced silver + violet
        !isEclipseDay &&
          isInEclipsePortal &&
          isNewMoon &&
          "hover:border-slate-400/35 hover:shadow-[inset_0_0_18px_var(--glow-eclipse),0_0_10px_rgba(148,163,184,0.2)]",
        // Portal only hover
        !isEclipseDay &&
          isInEclipsePortal &&
          !isFullMoon &&
          !isNewMoon &&
          "hover:border-[var(--color-eclipse-muted)]/25 hover:bg-[var(--color-eclipse)]/10 hover:shadow-[inset_0_0_18px_var(--glow-eclipse),0_0_10px_var(--glow-eclipse)]",
        // Standalone full moon hover
        !isEclipseDay &&
          !isInEclipsePortal &&
          isFullMoon &&
          "hover:border-[var(--color-gold)]/60 hover:shadow-[0_0_12px_rgba(212,168,75,0.25)]",
        // Standalone new moon hover
        !isEclipseDay &&
          !isInEclipsePortal &&
          isNewMoon &&
          "hover:border-slate-400/50 hover:shadow-[0_0_12px_rgba(148,163,184,0.2)]",
        // Regular day hover
        !isEclipseDay &&
          !isInEclipsePortal &&
          !isFullMoon &&
          !isNewMoon &&
          "hover:border-[var(--border-gold)]/40 hover:shadow-[0_0_8px_rgba(212,168,75,0.15)]",
        // Focus visible
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/80"
      )}
    >
      {/* Eclipse day pulsing aura - only for non-penumbral eclipses */}
      {isEclipseDay && !isPenumbral && (
        <span
          className={cn(
            "pointer-events-none absolute inset-0 rounded-lg",
            "animate-eclipse-pulse",
            "bg-[radial-gradient(ellipse_at_center,var(--color-eclipse)/20_0%,transparent_70%)]"
          )}
          aria-hidden="true"
        />
      )}

      {/* Hover overlay - subtle radial gradient that enhances existing treatment */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100",
          isEclipseDay &&
            "bg-[radial-gradient(ellipse_at_center,var(--color-eclipse)/20_0%,transparent_70%)]",
          !isEclipseDay &&
            isInEclipsePortal &&
            "bg-[radial-gradient(ellipse_at_center,var(--color-eclipse)/15_0%,transparent_70%)]",
          !isEclipseDay &&
            !isInEclipsePortal &&
            isFullMoon &&
            "bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.12)_0%,transparent_70%)]",
          !isEclipseDay &&
            !isInEclipsePortal &&
            isNewMoon &&
            "bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.1)_0%,transparent_70%)]",
          !isEclipseDay &&
            !isInEclipsePortal &&
            !isFullMoon &&
            !isNewMoon &&
            "bg-[radial-gradient(ellipse_at_center,rgba(212,168,75,0.08)_0%,transparent_70%)]"
        )}
        aria-hidden="true"
      />

      {/* Eclipse badge - top position */}
      {isEclipseDay && (
        <span
          className={cn(
            "absolute top-1 text-[10px] font-medium",
            isPenumbral
              ? "text-[var(--color-eclipse)]/60"
              : "text-[var(--color-eclipse)]"
          )}
          style={{
            filter: isPenumbral
              ? undefined
              : "drop-shadow(0 0 4px var(--glow-eclipse))",
          }}
          aria-hidden="true"
        >
          {eclipse.category === "solar" ? "☉" : "☽"}
        </span>
      )}

      {/* Full/New Moon label - only on peak days, hidden if eclipse badge shown */}
      {!isEclipseDay && (isPeakFullMoon || isPeakNewMoon) && (
        <span
          className={cn(
            "absolute top-1 text-[8px] font-medium uppercase tracking-[0.1em]",
            isPeakFullMoon && "text-[var(--color-gold)]",
            isPeakNewMoon && "text-slate-400"
          )}
          aria-hidden="true"
        >
          {isPeakFullMoon ? "Full" : "New"}
        </span>
      )}

      {/* Moon phase with glow - enhanced for full/new moon, intensifies on hover */}
      {moonPhase && (
        <span
          className={cn(
            "text-lg md:text-xl transition-transform duration-200",
            // Larger emoji for full/new moon
            (isFullMoon || isNewMoon) && "text-xl md:text-2xl",
            // Subtle lift on hover
            "group-hover:scale-110"
          )}
          style={{
            filter: isFullMoon
              ? "drop-shadow(0 0 12px rgba(232, 192, 104, 0.8)) drop-shadow(0 0 20px rgba(232, 192, 104, 0.4))"
              : isNewMoon
                ? "drop-shadow(0 0 10px rgba(148, 163, 184, 0.5)) drop-shadow(0 0 16px rgba(100, 116, 139, 0.3))"
                : `drop-shadow(0 0 8px ${phaseGlow})`,
          }}
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
          isToday
            ? "text-[var(--color-gold)] font-medium"
            : isEclipseDay
              ? "text-[var(--color-eclipse-text)]"
              : "text-muted-foreground"
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
        {/* Eclipse portal indicator - shown for portal days without an eclipse */}
        {isInEclipsePortal && !isEclipseDay && (
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-eclipse)]"
            style={{ boxShadow: "0 0 4px var(--color-eclipse)" }}
            aria-hidden="true"
          />
        )}
      </div>
    </button>
  );
}
