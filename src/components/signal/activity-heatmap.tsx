"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { fadeUpVariants } from "./animation-config";

interface DailyCount {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

export interface ActivityHeatmapProps {
  dailyCounts: DailyCount[];
  isLoading?: boolean;
}

/**
 * Get intensity level from count
 * 0: no sightings
 * 1: 1 sighting
 * 2: 2-3 sightings
 * 3: 4-6 sightings
 * 4: 7+ sightings
 */
function getIntensity(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

/**
 * Format date for display: "Jan 15"
 */
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Generate array of dates for past N days in local timezone
 * Uses toLocaleDateString with en-CA locale for YYYY-MM-DD format
 */
function generateDateRange(days: number): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Use en-CA locale for YYYY-MM-DD format in local timezone
    dates.push(date.toLocaleDateString("en-CA"));
  }

  return dates;
}

/**
 * GitHub-style activity heatmap for Signal sightings.
 * Shows 52 weeks of daily activity with intensity levels.
 */
export function ActivityHeatmap({
  dailyCounts,
  isLoading,
}: ActivityHeatmapProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Build a map of date -> count for O(1) lookups
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const { date, count } of dailyCounts) {
      map.set(date, count);
    }
    return map;
  }, [dailyCounts]);

  // Generate 364 days (52 weeks) of dates ending today
  const dates = useMemo(() => generateDateRange(364), []);

  // Group dates into weeks (columns)
  const weeks = useMemo(() => {
    const result: string[][] = [];
    let currentWeek: string[] = [];

    // Find the day of week for the first date (0 = Sunday)
    const firstDate = new Date(dates[0] + "T00:00:00");
    const startDayOfWeek = firstDate.getDay();

    // Add empty cells for days before the first date
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push("");
    }

    for (const date of dates) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days as last week
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [dates]);

  // Get month labels for the heatmap
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = "";

    weeks.forEach((week, weekIndex) => {
      const firstValidDate = week.find((d) => d !== "");
      if (firstValidDate) {
        const date = new Date(firstValidDate + "T00:00:00");
        const month = date.toLocaleDateString("en-US", { month: "short" });
        if (month !== lastMonth) {
          labels.push({ month, weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  const handleMouseEnter = (
    date: string,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDate(date);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDate(null);
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto pb-2">
        <div className="animate-pulse">
          <div className="h-4 mb-2" />
          <div className="flex gap-[3px]">
            {[...Array(52)].map((_, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {[...Array(7)].map((_, j) => (
                  <div
                    key={j}
                    className="h-[11px] w-[11px] rounded-sm bg-card"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const intensityClasses = [
    "bg-[var(--color-gold)]/5", // 0 - empty
    "bg-[var(--color-gold)]/25", // 1 - light
    "bg-[var(--color-gold)]/45", // 2 - medium-light
    "bg-[var(--color-gold)]/65", // 3 - medium
    "bg-[var(--color-gold)]/90", // 4 - bright
  ];

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Month labels */}
      <div className="relative h-4 mb-1 text-[10px] text-muted-foreground overflow-x-auto">
        <div className="flex" style={{ minWidth: weeks.length * 14 }}>
          {monthLabels.map(({ month, weekIndex }) => (
            <span
              key={`${month}-${weekIndex}`}
              className="absolute"
              style={{ left: weekIndex * 14 }}
            >
              {month}
            </span>
          ))}
        </div>
      </div>

      {/* Heatmap grid - horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-[3px]" style={{ minWidth: weeks.length * 14 }}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((date, dayIndex) => {
                if (date === "") {
                  return (
                    <div
                      key={`empty-${dayIndex}`}
                      className="h-[11px] w-[11px]"
                    />
                  );
                }

                const count = countMap.get(date) ?? 0;
                const intensity = getIntensity(count);

                return (
                  <div
                    key={date}
                    className={`h-[11px] w-[11px] rounded-sm cursor-pointer transition-colors ${intensityClasses[intensity]}`}
                    onMouseEnter={(e) => handleMouseEnter(date, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDate && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-card border border-[var(--border-gold)]/30 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <span className="font-medium">{formatDateShort(hoveredDate)}</span>
          <span className="text-muted-foreground">
            : {countMap.get(hoveredDate) ?? 0}{" "}
            {(countMap.get(hoveredDate) ?? 0) === 1 ? "sighting" : "sightings"}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        {intensityClasses.map((cls, i) => (
          <div key={i} className={`h-[11px] w-[11px] rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}
