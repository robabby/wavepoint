import { env } from "@/env";

/**
 * Check if the Calendar feature is enabled.
 *
 * In production (Vercel), this defaults to false unless NEXT_PUBLIC_CALENDAR_ENABLED=true is set.
 * In local development, set NEXT_PUBLIC_CALENDAR_ENABLED=true in .env.local.
 */
export function isCalendarEnabled(): boolean {
  return env.NEXT_PUBLIC_CALENDAR_ENABLED;
}
