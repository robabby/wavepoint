/**
 * React Query hooks for managing spiritual profiles.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfileResponse, ProfileInput, ChartCalculationInput, ChartCalculationResponse } from "@/lib/profile";
import { profileKeys } from "./query-keys";

// ============================================================================
// Fetch Functions
// ============================================================================

async function fetchProfile(): Promise<ProfileResponse> {
  const res = await fetch("/api/profile");
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated");
    }
    throw new Error("Failed to fetch profile");
  }
  return res.json() as Promise<ProfileResponse>;
}

async function updateProfile(input: ProfileInput): Promise<ProfileResponse> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated");
    }
    const error = await res.json().catch(() => ({ error: "Failed to update profile" }));
    throw new Error((error as { error?: string }).error ?? "Failed to update profile");
  }
  return res.json() as Promise<ProfileResponse>;
}

async function calculateChart(input: ChartCalculationInput): Promise<ChartCalculationResponse> {
  const res = await fetch("/api/profile/chart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to calculate chart" }));
    throw new Error((error as { error?: string }).error ?? "Failed to calculate chart");
  }
  return res.json() as Promise<ChartCalculationResponse>;
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Fetch the current user's spiritual profile.
 *
 * @example
 * ```tsx
 * const { profile, bigThree, elementBalance, isLoading } = useProfile();
 *
 * if (profile) {
 *   console.log(`Sun in ${bigThree?.sun.sign}`);
 * }
 * ```
 */
export function useProfile(options?: { enabled?: boolean }) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: profileKeys.current(),
    queryFn: fetchProfile,
    enabled: options?.enabled ?? true,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error.message === "Not authenticated") return false;
      return failureCount < 2;
    },
  });

  return {
    profile: data?.profile ?? null,
    bigThree: data?.bigThree ?? null,
    elementBalance: data?.elementBalance ?? null,
    modalityBalance: data?.modalityBalance ?? null,
    hasProfile: !!data?.profile,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

/**
 * Update the current user's spiritual profile.
 *
 * @example
 * ```tsx
 * const { updateProfile, isUpdating } = useUpdateProfile();
 *
 * const handleSubmit = async (data: ProfileInput) => {
 *   await updateProfile(data);
 * };
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(profileKeys.current(), data);
    },
  });

  return {
    updateProfile: mutateAsync,
    isUpdating: isPending,
    error,
    reset,
  };
}

/**
 * Calculate a chart preview without saving.
 * Useful for showing results before the user commits.
 *
 * @example
 * ```tsx
 * const { calculateChart, isCalculating, chartResult } = useCalculateChart();
 *
 * const handlePreview = async (data: ProfileInput) => {
 *   const result = await calculateChart(data);
 *   console.log(`Sun: ${result.bigThree.sun.sign}`);
 * };
 * ```
 */
export function useCalculateChart() {
  const { mutateAsync, isPending, data, error, reset } = useMutation({
    mutationFn: calculateChart,
  });

  return {
    calculateChart: mutateAsync,
    isCalculating: isPending,
    chartResult: data ?? null,
    error,
    reset,
  };
}
