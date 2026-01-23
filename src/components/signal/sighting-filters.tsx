"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIGNAL_TIMING } from "./animation-config";

const DATE_RANGES = [
  { id: "week", label: "This week", days: 7 },
  { id: "month", label: "This month", days: 30 },
  { id: "all", label: "All time", days: null },
] as const;

export type DateRangeId = (typeof DATE_RANGES)[number]["id"];

export interface SightingFiltersProps {
  className?: string;
}

/**
 * Search and filter bar for sightings on the dashboard.
 * Keeps filter state in URL params for shareability.
 */
export function SightingFilters({ className }: SightingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const numberFilter = searchParams.get("number") ?? "";
  const dateRange = (searchParams.get("range") as DateRangeId) ?? "all";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const queryString = params.toString();
      router.push(queryString ? `/signal?${queryString}` : "/signal", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateParams({ number: e.target.value || null });
    },
    [updateParams]
  );

  const handleDateRangeChange = useCallback(
    (rangeId: DateRangeId) => {
      updateParams({ range: rangeId === "all" ? null : rangeId });
    },
    [updateParams]
  );

  const handleClearAll = useCallback(() => {
    router.push("/signal", { scroll: false });
  }, [router]);

  const hasFilters = numberFilter || dateRange !== "all";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: SIGNAL_TIMING.small }}
      className={cn("space-y-3", className)}
    >
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={numberFilter}
          onChange={handleNumberChange}
          placeholder="Search by number..."
          className={cn(
            "w-full rounded-lg border border-[var(--border-gold)]/20 bg-card/50",
            "py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
            "focus:border-[var(--color-gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/20",
            "transition-colors duration-200"
          )}
        />
      </div>

      {/* Date range chips and clear button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {DATE_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => handleDateRangeChange(range.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-heading uppercase tracking-wide",
                "border transition-all duration-200",
                dateRange === range.id
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                  : "border-[var(--border-gold)]/20 text-muted-foreground hover:border-[var(--color-gold)]/30 hover:text-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Get the date range start date from a range ID.
 * Returns null for "all" (no date filter).
 */
export function getDateRangeStart(rangeId: DateRangeId | null): Date | null {
  const range = DATE_RANGES.find((r) => r.id === rangeId);
  if (!range || range.days === null) return null;

  const start = new Date();
  start.setDate(start.getDate() - range.days);
  start.setHours(0, 0, 0, 0);
  return start;
}
