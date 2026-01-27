"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { getPortalEclipses } from "@/lib/eclipses";
import type { EclipsePortal } from "@/lib/eclipses";

interface PortalBannerProps {
  /** Portal data */
  portal: EclipsePortal;
  /** Current date (to show position in portal) */
  currentDate: string;
  /** Optional className */
  className?: string;
}

/**
 * Eclipse portal banner for day view.
 *
 * Displays when viewing a date within an eclipse portal (but not on an eclipse day).
 * Shows portal name, axis, essence, and links to opening/closing eclipse dates.
 *
 * Uses a "gateway" visual metaphor with vertical pillar accents.
 */
export function PortalBanner({ portal, currentDate, className }: PortalBannerProps) {
  const { opener, closer } = getPortalEclipses(portal.id);

  // Format dates for display
  const formatEclipseDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    return format(date, "MMM d");
  };

  // Calculate portal progress (rough percentage through the portal)
  const portalStart = new Date(portal.openingDate + "T00:00:00Z");
  const portalEnd = new Date(portal.closingDate + "T00:00:00Z");
  const current = new Date(currentDate + "T00:00:00Z");
  const totalDays = Math.max(1, (portalEnd.getTime() - portalStart.getTime()) / (1000 * 60 * 60 * 24));
  const daysIn = (current.getTime() - portalStart.getTime()) / (1000 * 60 * 60 * 24);
  const progressPercent = Math.min(100, Math.max(0, (daysIn / totalDays) * 100));

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "border border-[var(--border-eclipse)]/40",
        "bg-gradient-to-r from-[var(--color-eclipse)]/8 via-transparent to-[var(--color-eclipse)]/8",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Vertical "pillar" accents on edges - gateway aesthetic */}
      <div
        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--color-eclipse)]/40 via-[var(--color-eclipse)]/60 to-[var(--color-eclipse)]/40"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-[var(--color-eclipse)]/40 via-[var(--color-eclipse)]/60 to-[var(--color-eclipse)]/40"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="px-6 py-4">
        {/* Header */}
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-eclipse)]">
          Eclipse Portal Active
        </p>

        <h3 className="font-heading text-lg text-foreground mt-1">
          {portal.name}
        </h3>

        <p className="text-sm text-muted-foreground mt-0.5">
          {portal.axis} Axis
        </p>

        {/* Essence */}
        <p className="text-xs text-[var(--color-eclipse)]/80 mt-2 italic">
          &ldquo;{portal.essence}&rdquo;
        </p>

        {/* Portal progress bar */}
        <div className="mt-4">
          <div className="h-1 rounded-full bg-[var(--color-eclipse)]/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-eclipse)]/50 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Eclipse links */}
        <div className="mt-4 flex items-center justify-between text-sm">
          {opener && (
            <Link
              href={`/calendar/day/${opener.date}`}
              className={cn(
                "flex flex-col items-start",
                "text-muted-foreground transition-colors",
                "hover:text-[var(--color-eclipse)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-eclipse)]/60 focus-visible:rounded"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Opens
              </span>
              <span className="font-medium">
                {formatEclipseDate(opener.date)}
              </span>
              <span className="text-xs text-muted-foreground/70 mt-0.5">
                {opener.category === "solar" ? "☉" : "☽"}{" "}
                {opener.sign.charAt(0).toUpperCase() + opener.sign.slice(1)}
              </span>
            </Link>
          )}

          {/* Center divider */}
          <div className="h-8 w-px bg-[var(--border-eclipse)]/30" aria-hidden="true" />

          {closer && (
            <Link
              href={`/calendar/day/${closer.date}`}
              className={cn(
                "flex flex-col items-end",
                "text-muted-foreground transition-colors",
                "hover:text-[var(--color-eclipse)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-eclipse)]/60 focus-visible:rounded"
              )}
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60">
                Closes
              </span>
              <span className="font-medium">
                {formatEclipseDate(closer.date)}
              </span>
              <span className="text-xs text-muted-foreground/70 mt-0.5">
                {closer.category === "solar" ? "☉" : "☽"}{" "}
                {closer.sign.charAt(0).toUpperCase() + closer.sign.slice(1)}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
