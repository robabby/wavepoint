/**
 * React Query hooks for fetching number patterns.
 */

import { useQuery } from "@tanstack/react-query";

import type {
  NumberPattern,
  NumberCategory,
  ComponentBreakdown,
} from "@/lib/numbers";
import { numbersKeys } from "./query-keys";

// ============================================================================
// Types
// ============================================================================

interface PatternsListResponse {
  patterns: NumberPattern[];
  total: number;
  category?: NumberCategory;
}

interface PatternDetailResponse {
  pattern: NumberPattern | null;
  related?: NumberPattern[];
  breakdown?: ComponentBreakdown;
}

interface UsePatternsOptions {
  category?: NumberCategory;
  featured?: boolean;
}

// ============================================================================
// Fetch Functions
// ============================================================================

async function fetchPatterns(
  options?: UsePatternsOptions
): Promise<PatternsListResponse> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.featured) params.set("featured", "true");

  const url = params.toString()
    ? `/api/numbers?${params.toString()}`
    : "/api/numbers";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch patterns");
  }
  return res.json() as Promise<PatternsListResponse>;
}

async function fetchPattern(pattern: string): Promise<PatternDetailResponse> {
  const res = await fetch(`/api/numbers/${pattern}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Pattern not found");
    }
    throw new Error("Failed to fetch pattern");
  }
  return res.json() as Promise<PatternDetailResponse>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch all patterns with optional filtering.
 *
 * @example
 * ```tsx
 * const { patterns, isLoading } = usePatterns();
 * const { patterns } = usePatterns({ category: "triple" });
 * const { patterns } = usePatterns({ featured: true });
 * ```
 */
export function usePatterns(options?: UsePatternsOptions) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: numbersKeys.patternsList(options),
    queryFn: () => fetchPatterns(options),
  });

  return {
    patterns: data?.patterns ?? [],
    total: data?.total ?? 0,
    category: data?.category,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

/**
 * Fetch a single pattern by its number.
 * Returns the pattern with related patterns if found.
 * Returns a component breakdown for uncovered patterns.
 *
 * @example
 * ```tsx
 * const { pattern, related, breakdown, isLoading } = usePattern("444");
 * ```
 */
export function usePattern(pattern: string, options?: { enabled?: boolean }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: numbersKeys.pattern(pattern),
    queryFn: () => fetchPattern(pattern),
    enabled: options?.enabled ?? !!pattern,
  });

  return {
    pattern: data?.pattern ?? null,
    related: data?.related ?? [],
    breakdown: data?.breakdown ?? null,
    isKnownPattern: !!data?.pattern,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}
