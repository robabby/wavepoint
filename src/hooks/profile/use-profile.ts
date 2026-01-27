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

interface BirthNameResponse {
  birthName: string | null;
  numerology: ProfileResponse["numerology"];
}

async function updateBirthName(birthName: string | null): Promise<BirthNameResponse> {
  const res = await fetch("/api/profile/birth-name", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ birthName }),
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Not authenticated");
    }
    if (res.status === 404) {
      throw new Error("Please create a profile first");
    }
    const error = await res.json().catch(() => ({ error: "Failed to update birth name" }));
    throw new Error((error as { error?: string }).error ?? "Failed to update birth name");
  }
  return res.json() as Promise<BirthNameResponse>;
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
    numerology: data?.numerology ?? null,
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

/**
 * Update the current user's birth name for numerology calculations.
 * Updates the profile cache with new numerology data on success.
 *
 * @example
 * ```tsx
 * const { updateBirthName, isUpdating } = useUpdateBirthName();
 *
 * const handleSubmit = async (name: string) => {
 *   await updateBirthName(name);
 * };
 * ```
 */
export function useUpdateBirthName() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: updateBirthName,
    onSuccess: (data) => {
      // Update the profile cache with new numerology data
      queryClient.setQueryData(profileKeys.current(), (old: ProfileResponse | undefined) => {
        if (!old || !old.profile) return old;
        return {
          ...old,
          profile: {
            ...old.profile,
            birthName: data.birthName,
          },
          numerology: data.numerology,
        };
      });
    },
  });

  return {
    updateBirthName: mutateAsync,
    isUpdating: isPending,
    error,
    reset,
  };
}
