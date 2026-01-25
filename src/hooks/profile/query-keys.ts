/**
 * Query key factory for Profile React Query hooks.
 * Following the same pattern as Numbers and Archetypes hooks.
 */

export const profileKeys = {
  all: ["profile"] as const,

  // Current user's profile
  current: () => [...profileKeys.all, "current"] as const,

  // Chart calculation (for optimistic updates)
  chart: () => [...profileKeys.all, "chart"] as const,
};
