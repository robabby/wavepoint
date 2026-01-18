import { env } from "@/env";

/**
 * Check if the auth feature is enabled.
 *
 * In production (Vercel), this defaults to false unless NEXT_PUBLIC_AUTH_ENABLED=true is set.
 * In local development, set NEXT_PUBLIC_AUTH_ENABLED=true in .env.local.
 */
export function isAuthEnabled(): boolean {
  return env.NEXT_PUBLIC_AUTH_ENABLED;
}
