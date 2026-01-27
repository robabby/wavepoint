/**
 * Eclipse Helper Functions
 *
 * Query functions for eclipse data and calendar integration.
 */

import { ECLIPSES, PORTALS } from "./data";
import type {
  Eclipse,
  EclipsePortal,
  EclipseContext,
  MonthEclipseContext,
} from "./types";

// =============================================================================
// Date Utilities
// =============================================================================

/**
 * Calculate days between two dates (date strings in YYYY-MM-DD format).
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1 + "T00:00:00Z");
  const d2 = new Date(date2 + "T00:00:00Z");
  const diffMs = d2.getTime() - d1.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date falls within a range (inclusive).
 */
function isDateInRange(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

// =============================================================================
// Eclipse Queries
// =============================================================================

/**
 * Get all eclipses sorted by date.
 */
export function getAllEclipses(): Eclipse[] {
  return [...ECLIPSES];
}

/**
 * Get eclipse by exact date.
 *
 * @param date - Date in YYYY-MM-DD format
 */
export function getEclipseByDate(date: string): Eclipse | undefined {
  return ECLIPSES.find((e) => e.date === date);
}

/**
 * Get all eclipses within a date range.
 *
 * @param start - Start date (YYYY-MM-DD), inclusive
 * @param end - End date (YYYY-MM-DD), inclusive
 */
export function getEclipsesInRange(start: string, end: string): Eclipse[] {
  return ECLIPSES.filter((e) => isDateInRange(e.date, start, end));
}

/**
 * Get eclipses for a specific year.
 *
 * @param year - Year (e.g., 2024)
 */
export function getEclipsesByYear(year: number): Eclipse[] {
  const yearStr = String(year);
  return ECLIPSES.filter((e) => e.date.startsWith(yearStr));
}

/**
 * Get the next eclipse after a given date.
 *
 * @param date - Reference date (YYYY-MM-DD)
 * @returns Next eclipse or undefined if none in data range
 */
export function getNextEclipse(date: string): Eclipse | undefined {
  return ECLIPSES.find((e) => e.date > date);
}

/**
 * Get the previous eclipse before a given date.
 *
 * @param date - Reference date (YYYY-MM-DD)
 * @returns Previous eclipse or undefined if none in data range
 */
export function getPreviousEclipse(date: string): Eclipse | undefined {
  const reversed = [...ECLIPSES].reverse();
  return reversed.find((e) => e.date < date);
}

// =============================================================================
// Portal Queries
// =============================================================================

/**
 * Get all eclipse portals sorted by opening date.
 */
export function getAllPortals(): EclipsePortal[] {
  return [...PORTALS];
}

/**
 * Get portal by ID.
 *
 * @param id - Portal ID (e.g., "2024-spring")
 */
export function getPortalById(id: string): EclipsePortal | undefined {
  return PORTALS.find((p) => p.id === id);
}

/**
 * Get the active portal for a given date (if any).
 *
 * A date is within a portal if it falls between the opening and closing dates,
 * inclusive.
 *
 * @param date - Date to check (YYYY-MM-DD)
 * @returns Active portal or null if not within a portal
 */
export function getActivePortal(date: string): EclipsePortal | null {
  const portal = PORTALS.find((p) =>
    isDateInRange(date, p.openingDate, p.closingDate)
  );
  return portal ?? null;
}

/**
 * Get the eclipses within a portal.
 *
 * @param portalId - Portal ID
 * @returns Object with opener, closer, and optional middle eclipse
 */
export function getPortalEclipses(portalId: string): {
  opener: Eclipse | undefined;
  closer: Eclipse | undefined;
  middle: Eclipse | undefined;
} {
  const portal = getPortalById(portalId);
  if (!portal) {
    return { opener: undefined, closer: undefined, middle: undefined };
  }

  const eclipses = portal.eclipseIds.map((id) => getEclipseByDate(id));

  return {
    opener: eclipses[0],
    closer: eclipses[eclipses.length - 1],
    middle: portal.isExtended ? eclipses[1] : undefined,
  };
}

// =============================================================================
// Calendar Integration (Primary API)
// =============================================================================

/**
 * Get complete eclipse context for a specific date.
 *
 * This is the primary API for calendar integration, providing all relevant
 * eclipse information for a given date.
 *
 * @param date - Date to check (YYYY-MM-DD)
 * @returns Eclipse context with eclipse, portal, and next eclipse info
 */
export function getEclipseContext(date: string): EclipseContext {
  const eclipse = getEclipseByDate(date) ?? null;
  const activePortal = getActivePortal(date);
  const nextEclipse = getNextEclipse(date) ?? null;

  let daysUntilNext: number | null = null;
  if (nextEclipse) {
    daysUntilNext = daysBetween(date, nextEclipse.date);
  }

  return {
    eclipse,
    activePortal,
    nextEclipse,
    daysUntilNext,
  };
}

/**
 * Get eclipse context for an entire month (for month view calendar).
 *
 * Pre-computes eclipse and portal data for all dates that might be displayed
 * in a month view (including overflow from adjacent months).
 *
 * @param year - Year
 * @param month - Month (0-11, JavaScript convention)
 * @returns MonthEclipseContext with maps for eclipse and portal days
 */
export function getMonthEclipseContext(
  year: number,
  month: number
): MonthEclipseContext {
  // Calculate date range that covers a 6-week calendar view
  const start = new Date(year, month, 1);
  start.setDate(start.getDate() - 6); // Buffer for prev month
  const end = new Date(year, month + 1, 0);
  end.setDate(end.getDate() + 7); // Buffer for next month

  const startStr = start.toISOString().split("T")[0]!;
  const endStr = end.toISOString().split("T")[0]!;

  // Build eclipse lookup map
  const eclipsesByDate = new Map<string, Eclipse>();
  const eclipsesInRange = getEclipsesInRange(startStr, endStr);
  for (const eclipse of eclipsesInRange) {
    eclipsesByDate.set(eclipse.date, eclipse);
  }

  // Build portal lookup map and set of all portal dates
  const portalsByDate = new Map<string, EclipsePortal>();
  const portalDates = new Set<string>();

  // Find all portals that overlap with our date range
  for (const portal of PORTALS) {
    // Check if portal overlaps with our range
    if (portal.closingDate >= startStr && portal.openingDate <= endStr) {
      // Add all dates in the portal to our maps
      const portalStart = new Date(portal.openingDate + "T00:00:00Z");
      const portalEnd = new Date(portal.closingDate + "T00:00:00Z");

      for (
        let d = new Date(portalStart);
        d <= portalEnd;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0]!;

        // Only include dates within our calendar range
        if (dateStr >= startStr && dateStr <= endStr) {
          portalsByDate.set(dateStr, portal);

          // Only add to portalDates if it's NOT an eclipse day
          if (!eclipsesByDate.has(dateStr)) {
            portalDates.add(dateStr);
          }
        }
      }
    }
  }

  return {
    eclipsesByDate,
    portalsByDate,
    portalDates,
  };
}

/**
 * Check if a date is within a window of days from the next eclipse.
 *
 * Useful for showing "approaching eclipse" indicators.
 *
 * @param date - Date to check (YYYY-MM-DD)
 * @param windowDays - Number of days to look ahead (default: 30)
 * @returns True if there's an eclipse within the window
 */
export function isWithinEclipseWindow(
  date: string,
  windowDays: number = 30
): boolean {
  const context = getEclipseContext(date);
  return context.daysUntilNext !== null && context.daysUntilNext <= windowDays;
}

/**
 * Check if a date is an eclipse day.
 *
 * @param date - Date to check (YYYY-MM-DD)
 */
export function isEclipseDay(date: string): boolean {
  return getEclipseByDate(date) !== undefined;
}

/**
 * Check if a date is within an active portal (but not an eclipse day).
 *
 * @param date - Date to check (YYYY-MM-DD)
 */
export function isPortalDay(date: string): boolean {
  return !isEclipseDay(date) && getActivePortal(date) !== null;
}

// =============================================================================
// Display Utilities
// =============================================================================

/**
 * Format eclipse type for display.
 *
 * @param type - Eclipse type
 * @returns Human-readable type string
 */
export function formatEclipseType(type: Eclipse["type"]): string {
  const typeMap: Record<Eclipse["type"], string> = {
    total_solar: "Total Solar",
    annular_solar: "Annular Solar",
    partial_solar: "Partial Solar",
    hybrid_solar: "Hybrid Solar",
    total_lunar: "Total Lunar",
    partial_lunar: "Partial Lunar",
    penumbral_lunar: "Penumbral Lunar",
  };
  return typeMap[type];
}

/**
 * Get glyph for eclipse category.
 *
 * @param category - Solar or lunar
 * @returns Unicode glyph
 */
export function getEclipseGlyph(category: Eclipse["category"]): string {
  // Using distinct glyphs for eclipses (not the standard sun/moon glyphs)
  // Solar: Black sun with rays, Lunar: Last quarter moon
  return category === "solar" ? "\u2600" : "\u263E";
}

/**
 * Get sign glyph from zodiac sign.
 *
 * Re-export from astrology constants for convenience.
 */
export { ZODIAC_META } from "@/lib/astrology/constants";
