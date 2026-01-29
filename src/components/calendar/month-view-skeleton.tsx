import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/**
 * Skeleton loading state for the month view calendar grid.
 * Matches DayCell dimensions (h-16 md:h-20).
 */
export function MonthViewSkeleton() {
  return (
    <div>
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

      {/* 6×7 skeleton grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-16 md:h-20 rounded-lg",
              "animate-pulse bg-card/20 border border-white/5"
            )}
          />
        ))}
      </div>
    </div>
  );
}
