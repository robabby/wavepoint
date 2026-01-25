/**
 * Timezone utilities for location-based timezone lookup.
 */

import { find } from "geo-tz";

/**
 * Get the timezone for a given latitude/longitude coordinate.
 * Returns the first matching timezone or "UTC" as fallback.
 *
 * @param latitude - Latitude coordinate (-90 to 90)
 * @param longitude - Longitude coordinate (-180 to 180)
 * @returns IANA timezone string (e.g., "America/Los_Angeles")
 */
export function getTimezone(latitude: number, longitude: number): string {
  const zones = find(latitude, longitude);
  return zones[0] ?? "UTC";
}
