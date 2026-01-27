/**
 * Eclipse Portal Module
 *
 * Public API for eclipse data and calendar integration.
 *
 * @example
 * ```ts
 * import { getEclipseContext, getMonthEclipseContext } from "@/lib/eclipses";
 *
 * // Get context for a specific day
 * const context = getEclipseContext("2024-04-08");
 * if (context.eclipse) {
 *   console.log(context.eclipse.title); // "Total Solar Eclipse in Aries"
 * }
 *
 * // Get context for a month view
 * const monthContext = getMonthEclipseContext(2024, 3); // April 2024
 * ```
 */

// Types
export type {
  EclipseCategory,
  EclipseType,
  PortalPosition,
  Eclipse,
  EclipsePortal,
  EclipseContext,
  MonthEclipseContext,
} from "./types";

// Data (for direct access if needed)
export { ECLIPSES, PORTALS } from "./data";

// Query functions
export {
  // Eclipse queries
  getAllEclipses,
  getEclipseByDate,
  getEclipsesInRange,
  getEclipsesByYear,
  getNextEclipse,
  getPreviousEclipse,
  // Portal queries
  getAllPortals,
  getPortalById,
  getActivePortal,
  getPortalEclipses,
  // Calendar integration (primary API)
  getEclipseContext,
  getMonthEclipseContext,
  // Utility functions
  isWithinEclipseWindow,
  isEclipseDay,
  isPortalDay,
  // Display utilities
  formatEclipseType,
  getEclipseGlyph,
} from "./helpers";
