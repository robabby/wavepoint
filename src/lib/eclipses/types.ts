/**
 * Eclipse Portal Types
 *
 * Type definitions for eclipse events and portal periods.
 * Eclipses are paired into "portals" - the ~2-week windows between
 * lunar and solar eclipses that occur in the same eclipse season.
 */

import type { ZodiacSign } from "@/lib/astrology/constants";

/**
 * Eclipse category - solar or lunar
 */
export type EclipseCategory = "solar" | "lunar";

/**
 * Specific eclipse type
 */
export type EclipseType =
  | "total_solar"
  | "annular_solar"
  | "partial_solar"
  | "hybrid_solar"
  | "total_lunar"
  | "partial_lunar"
  | "penumbral_lunar";

/**
 * Position within an eclipse portal
 */
export type PortalPosition = "opener" | "middle" | "closer";

/**
 * An individual eclipse event.
 *
 * Contains astronomical data plus rich astrological interpretations.
 */
export interface Eclipse {
  /** Unique ID using date (YYYY-MM-DD) */
  id: string;
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Peak time in UTC (HH:MM) */
  timeUtc: string;
  /** Specific eclipse type */
  type: EclipseType;
  /** Solar or lunar */
  category: EclipseCategory;
  /** Zodiac sign where eclipse occurs */
  sign: ZodiacSign;
  /** Degree within the sign (0-29) */
  degree: number;
  /** Saros cycle number */
  saros: number;
  /** Whether this is a penumbral lunar eclipse (lighter visual treatment) */
  isPenumbral: boolean;
  /** Display title (e.g., "Total Solar Eclipse in Aries") */
  title: string;
  /** Short 2-3 word theme essence */
  essence: string;
  /** Rich astrological interpretation (1-2 paragraphs) */
  interpretation: string;
  /** Theme keywords */
  themes: string[];
  /** Associated portal ID (null if not in a portal) */
  portalId: string | null;
  /** Position within the portal */
  portalPosition: PortalPosition | null;
}

/**
 * An eclipse portal - the window between paired eclipses.
 *
 * Portals are liminal periods of accelerated change and fate.
 * Most portals have 2 eclipses; some seasons have 3 (extended portals).
 */
export interface EclipsePortal {
  /** Unique ID (e.g., "2024-spring") */
  id: string;
  /** Display name (e.g., "Spring 2024 Eclipse Portal") */
  name: string;
  /** First day of portal (opening eclipse date) */
  openingDate: string;
  /** Last day of portal (closing eclipse date) */
  closingDate: string;
  /** Eclipse IDs in chronological order (2-3 eclipses) */
  eclipseIds: string[];
  /** True if this is a 3-eclipse extended portal */
  isExtended: boolean;
  /** Zodiac axis being activated (e.g., "Aries-Libra") */
  axis: string;
  /** Short essence of the portal's theme */
  essence: string;
  /** Rich interpretation of the portal period */
  interpretation: string;
  /** Theme keywords */
  themes: string[];
}

/**
 * Eclipse context for a specific date.
 *
 * This is the primary API for calendar integration.
 */
export interface EclipseContext {
  /** Eclipse on this exact date (null if no eclipse) */
  eclipse: Eclipse | null;
  /** Active portal period (null if not within a portal) */
  activePortal: EclipsePortal | null;
  /** Next upcoming eclipse (null if none in data range) */
  nextEclipse: Eclipse | null;
  /** Days until next eclipse (null if no upcoming eclipse) */
  daysUntilNext: number | null;
}

/**
 * Month eclipse context for calendar month view.
 *
 * Pre-computed eclipse data for an entire month's display.
 */
export interface MonthEclipseContext {
  /** Map of date -> Eclipse for eclipse days */
  eclipsesByDate: Map<string, Eclipse>;
  /** Map of date -> EclipsePortal for portal days */
  portalsByDate: Map<string, EclipsePortal>;
  /** Set of dates that are within a portal but not eclipse days */
  portalDates: Set<string>;
}
