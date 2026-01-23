/**
 * Feature Access Control
 *
 * Consolidated access checks for all features.
 * Combines environment-based feature flags with admin overrides.
 *
 * Pattern: Feature is accessible if globally enabled OR user is admin.
 *
 * Server-side: Use `canAccessX(session)` in layouts, API routes, server components
 * Client-side: Use `useCanAccessX()` hook in client components
 */

import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { isAuthEnabled } from "@/lib/auth/feature-flags";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

// =============================================================================
// Server-side access checks (for layouts, API routes, server components)
// =============================================================================

/**
 * Check if user can access auth features (sign in, account, etc.)
 */
export function canAccessAuth(session: Session | null): boolean {
  return isAuthEnabled() || (session?.user?.isAdmin ?? false);
}

/**
 * Check if user can access Signal (angel number tracking)
 */
export function canAccessSignal(session: Session | null): boolean {
  return isSignalEnabled() || (session?.user?.isAdmin ?? false);
}

// =============================================================================
// Client-side hooks (for client components)
// =============================================================================

/**
 * Hook to check if current user can access auth features
 */
export function useCanAccessAuth(): boolean {
  const { data: session } = useSession();
  return isAuthEnabled() || (session?.user?.isAdmin ?? false);
}

/**
 * Hook to check if current user can access Signal
 */
export function useCanAccessSignal(): boolean {
  const { data: session } = useSession();
  return isSignalEnabled() || (session?.user?.isAdmin ?? false);
}

// =============================================================================
// Re-export base flags for cases where admin override isn't needed
// =============================================================================

export { isAuthEnabled, isSignalEnabled };
