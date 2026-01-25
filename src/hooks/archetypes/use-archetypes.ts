/**
 * React Query hooks for fetching archetypes.
 */

import { useQuery } from "@tanstack/react-query";

import type {
  ArchetypesListResponse,
  ArchetypeDetailResponse,
} from "@/lib/archetypes";
import { archetypesKeys } from "./query-keys";

// ============================================================================
// Fetch Functions
// ============================================================================

async function fetchArchetypes(): Promise<ArchetypesListResponse> {
  const res = await fetch("/api/archetypes");
  if (!res.ok) {
    throw new Error("Failed to fetch archetypes");
  }
  return res.json() as Promise<ArchetypesListResponse>;
}

async function fetchArchetype(slug: string): Promise<ArchetypeDetailResponse> {
  const res = await fetch(`/api/archetypes/${slug}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Archetype not found");
    }
    throw new Error("Failed to fetch archetype");
  }
  return res.json() as Promise<ArchetypeDetailResponse>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all archetypes.
 *
 * @example
 * ```tsx
 * const { archetypes, isLoading } = useArchetypes();
 * ```
 */
export function useArchetypes() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: archetypesKeys.archetypesList(),
    queryFn: () => fetchArchetypes(),
  });

  return {
    archetypes: data?.archetypes ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

/**
 * Fetch a single archetype by its slug.
 * Returns the archetype with all relations populated.
 *
 * @example
 * ```tsx
 * const { archetype, isLoading } = useArchetype("the-hero");
 * ```
 */
export function useArchetype(slug: string, options?: { enabled?: boolean }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: archetypesKeys.archetype(slug),
    queryFn: () => fetchArchetype(slug),
    enabled: options?.enabled ?? !!slug,
  });

  return {
    archetype: data?.archetype ?? null,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
