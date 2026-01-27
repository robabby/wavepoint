import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Resonance, ResonanceValue } from "@/lib/resonance";
import { resonanceKeys } from "./query-keys";

interface ResonanceResponse {
  resonance: Resonance | null;
}

async function fetchResonance(sightingId: string): Promise<ResonanceResponse> {
  const res = await fetch(`/api/signal/resonance?sightingId=${sightingId}`);
  if (!res.ok) throw new Error("Failed to fetch resonance");
  return res.json() as Promise<ResonanceResponse>;
}

/**
 * Hook to get the user's resonance feedback for a specific sighting.
 */
export function useResonance(sightingId: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: resonanceKeys.bySighting(sightingId),
    queryFn: () => fetchResonance(sightingId),
    enabled: !!sightingId,
  });

  return {
    resonance: data?.resonance ?? null,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

// Record resonance mutation

interface RecordResonanceInput {
  sightingId: string;
  resonated: ResonanceValue;
}

interface RecordResonanceResponse {
  resonance: Resonance;
}

async function recordResonance(
  input: RecordResonanceInput
): Promise<RecordResonanceResponse> {
  const res = await fetch("/api/signal/resonance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to record resonance");
  }
  return res.json() as Promise<RecordResonanceResponse>;
}

/**
 * Hook to record resonance feedback for a sighting.
 * Handles the upsert behavior (one resonance per user per sighting).
 */
export function useRecordResonance() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: recordResonance,
    onSuccess: (data) => {
      // Update the cache for this sighting's resonance
      queryClient.setQueryData(
        resonanceKeys.bySighting(data.resonance.sightingId),
        { resonance: data.resonance }
      );
    },
  });

  return {
    recordResonance: mutation.mutateAsync,
    isRecording: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
