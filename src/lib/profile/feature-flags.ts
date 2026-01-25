/**
 * Feature flags for the Profile module.
 */

import { env } from "@/env";

/**
 * Check if the Profile feature is enabled.
 *
 * Profile requires auth to be enabled since profiles are tied to users.
 */
export function isProfileEnabled(): boolean {
  // Profile requires auth
  if (!env.NEXT_PUBLIC_AUTH_ENABLED) {
    return false;
  }

  // Profile is enabled when auth is enabled
  // In the future, we might add NEXT_PUBLIC_PROFILE_ENABLED
  return true;
}
