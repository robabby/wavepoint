"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayCell } from "./day-cell";
import { useEphemerisRange, useJournalEntries, createJournalEntriesMap } from "@/hooks/calendar";
import { useHeatmap } from "@/hooks/signal";
import { getMonthEclipseContext } from "@/lib/eclipses";
import type { MoonPhase } from "@/lib/signal/cosmic-context";

// =============================================================================
// Swipe Gesture Config
// =============================================================================

const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger swipe
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity (px/ms) for quick swipes

// =============================================================================
// Types
// =============================================================================

interface MonthDay {
  date: string; // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  moonPhase: MoonPhase | null;
  isPeakFullMoon: boolean;
  isPeakNewMoon: boolean;
}

interface MonthViewProps {
  /** Optional initial month (YYYY-MM format) */
  initialMonth?: string;
  /** Optional className */
  className?: string;
}

// =============================================================================
// Constants
// =============================================================================

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Animation variants for month transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

// =============================================================================
// Helpers
// =============================================================================

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatDateString(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getMonthDays(year: number, month: number): MonthDay[] {
  const days: MonthDay[] = [];
  const today = new Date();
  const todayStr = formatDateString(today);

  // First day of the month
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();

  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Add days from previous month to fill the first week
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    days.push({
      date: formatDateString(date),
      day,
      isCurrentMonth: false,
      isToday: formatDateString(date) === todayStr,
      moonPhase: null,
      isPeakFullMoon: false,
      isPeakNewMoon: false,
    });
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      date: formatDateString(date),
      day,
      isCurrentMonth: true,
      isToday: formatDateString(date) === todayStr,
      moonPhase: null,
      isPeakFullMoon: false,
      isPeakNewMoon: false,
    });
  }

  // Add days from next month to complete the grid (6 rows = 42 days)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date: formatDateString(date),
      day,
      isCurrentMonth: false,
      isToday: formatDateString(date) === todayStr,
      moonPhase: null,
      isPeakFullMoon: false,
      isPeakNewMoon: false,
    });
  }

  return days;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Month view calendar grid.
 *
 * Features:
 * - 6-week grid with moon phases
 * - Month navigation with slide animations
 * - Keyboard navigation (arrow keys, Home/End)
 * - Today button to jump to current date
 * - Sighting and journal indicator dots
 */
export function MonthView({ initialMonth, className }: MonthViewProps) {
  const router = useRouter();

  // Parse initial month or default to current
  const getInitialDate = () => {
    if (initialMonth) {
      const [year, month] = initialMonth.split("-").map(Number);
      if (year && month) {
        return new Date(year, month - 1, 1);
      }
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  // Swipe gesture tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthKey = getMonthKey(currentDate);

  // Calculate date range for ephemeris query (include buffer for prev/next month days)
  // Calendar grid shows 42 days (6 weeks), so we need at most 6 days before and after
  const dateRange = useMemo(() => {
    const start = new Date(year, month, 1);
    start.setDate(start.getDate() - 6); // Buffer for prev month (max 6 days visible)
    const end = new Date(year, month + 1, 0);
    end.setDate(end.getDate() + 7); // Buffer for next month (max 7 days visible)
    return {
      start: formatDateString(start),
      end: formatDateString(end),
    };
  }, [year, month]);

  // Fetch ephemeris data for the month range
  const { ephemeris, isLoading: ephemerisLoading } = useEphemerisRange(
    dateRange.start,
    dateRange.end
  );

  // Fetch heatmap data for sighting indicators
  const { dailyCounts } = useHeatmap();

  // Fetch journal entries for the month range
  const { entries: journalEntries } = useJournalEntries(
    dateRange.start,
    dateRange.end
  );

  // Build lookup map for sighting counts
  const sightingsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const { date, count } of dailyCounts) {
      map.set(date, count);
    }
    return map;
  }, [dailyCounts]);

  // Build lookup map for journal entries
  const journalByDate = useMemo(
    () => createJournalEntriesMap(journalEntries),
    [journalEntries]
  );

  // Get eclipse context for the month (static data, no API call)
  const eclipseContext = useMemo(
    () => getMonthEclipseContext(year, month),
    [year, month]
  );

  // Generate days with moon phase data and peak moon indicators
  const days = useMemo(() => {
    const baseDays = getMonthDays(year, month);

    if (!ephemeris?.days) {
      return baseDays;
    }

    // Find peak days for each distinct run of full/new moon phases
    // This handles cases where two lunar cycles are visible in the same month view
    const peakDates = new Set<string>();

    // Group consecutive days by phase to find distinct lunar cycles
    let currentRun: { phase: string; days: { date: string; elongation: number }[] } | null = null;

    const processRun = (run: { phase: string; days: { date: string; elongation: number }[] }) => {
      if (run.days.length === 0) return;

      let peakDate = run.days[0]!.date;
      let bestDistance = Infinity;

      for (const day of run.days) {
        let distance: number;
        if (run.phase === "full_moon") {
          distance = Math.abs(180 - day.elongation);
        } else {
          // new_moon: distance from 0° (handle wrap-around)
          distance = Math.min(day.elongation, 360 - day.elongation);
        }

        if (distance < bestDistance) {
          bestDistance = distance;
          peakDate = day.date;
        }
      }

      peakDates.add(peakDate);
    };

    for (const day of baseDays) {
      const dayData = ephemeris.days[day.date];
      const phase = dayData?.moon?.phase;
      const elongation = dayData?.lunarElongation ?? 0;

      if (phase === "full_moon" || phase === "new_moon") {
        if (currentRun && currentRun.phase === phase) {
          // Continue current run
          currentRun.days.push({ date: day.date, elongation });
        } else {
          // End previous run and start new one
          if (currentRun) processRun(currentRun);
          currentRun = { phase, days: [{ date: day.date, elongation }] };
        }
      } else {
        // Not a full/new moon day - end current run if any
        if (currentRun) {
          processRun(currentRun);
          currentRun = null;
        }
      }
    }
    // Process final run if any
    if (currentRun) processRun(currentRun);

    // Enrich days with moon phase data and peak indicators
    return baseDays.map((day) => {
      const phase = ephemeris.days[day.date]?.moon?.phase as MoonPhase | undefined;
      return {
        ...day,
        moonPhase: phase ?? null,
        isPeakFullMoon: phase === "full_moon" && peakDates.has(day.date),
        isPeakNewMoon: phase === "new_moon" && peakDates.has(day.date),
      };
    });
  }, [year, month, ephemeris]);

  // Navigation handlers
  const goToPrevMonth = useCallback(() => {
    setDirection(-1);
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    const todayMonth = getMonthKey(today);
    const currentMonth = getMonthKey(currentDate);

    if (todayMonth !== currentMonth) {
      setDirection(todayMonth > currentMonth ? 1 : -1);
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
    setSelectedDate(formatDateString(today));
  }, [currentDate]);

  // Day click handler
  const handleDayClick = useCallback(
    (date: string) => {
      setSelectedDate(date);
      router.push(`/calendar/day/${date}`);
    },
    [router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let newIndex = index;
      const totalDays = days.length;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          newIndex = index > 0 ? index - 1 : totalDays - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          newIndex = index < totalDays - 1 ? index + 1 : 0;
          break;
        case "ArrowUp":
          e.preventDefault();
          newIndex = index >= 7 ? index - 7 : index + totalDays - 7;
          break;
        case "ArrowDown":
          e.preventDefault();
          newIndex = index < totalDays - 7 ? index + 7 : index - totalDays + 7;
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = totalDays - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleDayClick(days[index]!.date);
          return;
        default:
          return;
      }

      // Focus the new cell
      const grid = e.currentTarget.closest('[role="grid"]');
      const cells = grid?.querySelectorAll('[role="gridcell"] button');
      const targetCell = cells?.[newIndex] as HTMLButtonElement | undefined;
      targetCell?.focus();
    },
    [days, handleDayClick]
  );

  // Touch gesture handlers for mobile swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      const velocity = Math.abs(deltaX) / deltaTime;

      // Only trigger if horizontal swipe is dominant (not scrolling vertically)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

      // Trigger on distance threshold OR velocity threshold (for quick flicks)
      const meetsThreshold =
        Math.abs(deltaX) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD;

      if (isHorizontalSwipe && meetsThreshold) {
        if (deltaX > 0) {
          goToPrevMonth(); // Swipe right → previous month
        } else {
          goToNextMonth(); // Swipe left → next month
        }
      }

      touchStartRef.current = null;
    },
    [goToPrevMonth, goToNextMonth]
  );

  // Update URL when month changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("month", monthKey);
    window.history.replaceState({}, "", url.toString());
  }, [monthKey]);

  return (
    <div className={cn("w-full", className)}>
      {/* Header: Navigation */}
      <div className="mb-6 flex items-center justify-between">
        {/* Prev/Next controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "text-muted-foreground transition-colors",
              "hover:bg-card/60 hover:text-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            aria-label="Next month"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              "text-muted-foreground transition-colors",
              "hover:bg-card/60 hover:text-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Month title */}
        <h2
          className="font-display text-2xl md:text-3xl text-foreground tracking-tight"
          style={{ textShadow: "0 0 40px var(--glow-gold)" }}
        >
          {getMonthName(currentDate).toUpperCase()}
        </h2>

        {/* Today button */}
        <button
          onClick={goToToday}
          className={cn(
            "rounded-lg px-4 py-2 text-sm",
            "border border-[var(--border-gold)]/30 bg-card/40",
            "text-muted-foreground transition-colors",
            "hover:border-[var(--color-gold)]/50 hover:text-foreground",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
          )}
        >
          Today
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid with animations and touch swipe support */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={monthKey}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          role="grid"
          aria-label={`Calendar for ${getMonthName(currentDate)}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const eclipse = eclipseContext.eclipsesByDate.get(day.date);
              const isInPortal = eclipseContext.portalDates.has(day.date);

              return (
                <div key={day.date} role="gridcell">
                  <DayCell
                    date={day.date}
                    day={day.day}
                    isCurrentMonth={day.isCurrentMonth}
                    isToday={day.isToday}
                    isSelected={selectedDate === day.date}
                    moonPhase={day.moonPhase}
                    isPeakFullMoon={day.isPeakFullMoon}
                    isPeakNewMoon={day.isPeakNewMoon}
                    hasSightings={(sightingsByDate.get(day.date) ?? 0) > 0}
                    hasJournal={journalByDate.has(day.date)}
                    isInEclipsePortal={isInPortal}
                    eclipse={
                      eclipse
                        ? { category: eclipse.category, isPenumbral: eclipse.isPenumbral }
                        : null
                    }
                    onClick={() => handleDayClick(day.date)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    tabIndex={index === 0 ? 0 : -1}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Loading overlay */}
      {ephemerisLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-gold)]/30 border-t-[var(--color-gold)]" />
        </div>
      )}
    </div>
  );
}
