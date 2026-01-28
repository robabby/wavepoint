"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEphemerisRange } from "@/hooks/calendar";
import {
  getMoonPhaseEmoji,
  type MoonPhase,
} from "@/lib/signal/cosmic-context";

interface DayNavigationProps {
  /** Current date in YYYY-MM-DD format */
  date: string;
  /** Optional className for the container */
  className?: string;
}

/**
 * Day-to-day navigation with moon phase previews.
 *
 * Shows previous/next day navigation pills with the day number and moon emoji,
 * creating a "temporal flow" navigation experience. Supports keyboard navigation
 * with left/right arrow keys.
 */
export function DayNavigation({ date, className }: DayNavigationProps) {
  const router = useRouter();
  const parsedDate = parseISO(date);

  // Calculate adjacent dates
  const prevDate = addDays(parsedDate, -1);
  const nextDate = addDays(parsedDate, 1);
  const prevDateStr = format(prevDate, "yyyy-MM-dd");
  const nextDateStr = format(nextDate, "yyyy-MM-dd");

  // Fetch ephemeris for the 3-day range (prev, current, next)
  const { ephemeris } = useEphemerisRange(prevDateStr, nextDateStr);

  // Get moon phases for adjacent days
  const prevMoonPhase = ephemeris?.days[prevDateStr]?.moon?.phase as MoonPhase | undefined;
  const nextMoonPhase = ephemeris?.days[nextDateStr]?.moon?.phase as MoonPhase | undefined;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't navigate if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Don't intercept browser shortcuts (CMD+Arrow for back/forward)
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        router.push(`/calendar/day/${prevDateStr}`);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        router.push(`/calendar/day/${nextDateStr}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, prevDateStr, nextDateStr]);

  return (
    <nav
      className={cn("flex items-center gap-2", className)}
      aria-label="Day navigation"
    >
      <NavPill
        href={`/calendar/day/${prevDateStr}`}
        direction="prev"
        dayNumber={prevDate.getDate()}
        moonPhase={prevMoonPhase}
        label={format(prevDate, "MMM d")}
      />

      <NavPill
        href={`/calendar/day/${nextDateStr}`}
        direction="next"
        dayNumber={nextDate.getDate()}
        moonPhase={nextMoonPhase}
        label={format(nextDate, "MMM d")}
      />
    </nav>
  );
}

interface NavPillProps {
  href: string;
  direction: "prev" | "next";
  dayNumber: number;
  moonPhase?: MoonPhase;
  label: string;
}

/**
 * Individual navigation pill with moon phase preview.
 */
function NavPill({ href, direction, dayNumber, moonPhase, label }: NavPillProps) {
  const isFullMoon = moonPhase === "full_moon";
  const isNewMoon = moonPhase === "new_moon";
  const isPrev = direction === "prev";

  // Determine glow color based on moon phase
  const glowStyle = isFullMoon
    ? "hover:shadow-[0_0_16px_rgba(212,168,75,0.4)] hover:border-[var(--color-gold)]/50"
    : isNewMoon
      ? "hover:shadow-[0_0_16px_rgba(148,163,184,0.3)] hover:border-slate-400/40"
      : "hover:shadow-[0_0_12px_rgba(212,168,75,0.2)] hover:border-[var(--border-gold)]/40";

  return (
    <Link
      href={href}
      aria-label={`Go to ${label}`}
      className={cn(
        "group relative flex items-center gap-1.5 px-3 py-1.5",
        "rounded-full border border-white/10 bg-card/30",
        "text-sm text-muted-foreground",
        "transition-all duration-200 ease-out",
        "hover:bg-card/50 hover:text-foreground hover:scale-105",
        glowStyle,
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
      )}
    >
      {/* Chevron - left side for prev */}
      {isPrev && (
        <ChevronLeft
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
      )}

      {/* Day number */}
      <span className="font-medium tabular-nums">{dayNumber}</span>

      {/* Moon phase emoji with glow */}
      {moonPhase && (
        <span
          className="text-sm transition-transform duration-200 group-hover:scale-110"
          style={{
            filter: isFullMoon
              ? "drop-shadow(0 0 6px rgba(232, 192, 104, 0.6))"
              : isNewMoon
                ? "drop-shadow(0 0 5px rgba(148, 163, 184, 0.4))"
                : "drop-shadow(0 0 4px rgba(200, 200, 200, 0.3))",
          }}
          aria-hidden="true"
        >
          {getMoonPhaseEmoji(moonPhase)}
        </span>
      )}

      {/* Chevron - right side for next */}
      {!isPrev && (
        <ChevronRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}

      {/* Hover tooltip showing full date */}
      <span
        className={cn(
          "pointer-events-none absolute -bottom-8 whitespace-nowrap",
          "rounded bg-card/90 px-2 py-1 text-xs text-muted-foreground",
          "border border-white/10 backdrop-blur-sm",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          isPrev ? "left-0" : "right-0"
        )}
        aria-hidden="true"
      >
        {label}
      </span>
    </Link>
  );
}
