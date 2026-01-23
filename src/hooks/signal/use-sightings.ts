import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SightingWithInterpretation } from "@/lib/signal/types";
import type { CreateSightingInput, UpdateSightingInput } from "@/lib/signal/schemas";
import type { DelightMoment } from "@/lib/signal/delight";
import type { PatternInsight } from "@/lib/signal/insights";
import { signalKeys } from "./query-keys";

interface SightingsResponse {
  sightings: SightingWithInterpretation[];
  total: number;
}

interface UseSightingsOptions {
  number?: string;
  limit?: number;
  offset?: number;
  since?: Date | null;
}

async function fetchSightings(
  options?: UseSightingsOptions
): Promise<SightingsResponse> {
  const params = new URLSearchParams();
  if (options?.number) params.set("number", options.number);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));
  if (options?.since) params.set("since", options.since.toISOString());

  const res = await fetch(`/api/signal/sightings?${params}`);
  if (!res.ok) throw new Error("Failed to fetch sightings");
  return res.json() as Promise<SightingsResponse>;
}

export function useSightings(options?: UseSightingsOptions) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.sightingsList({
      number: options?.number,
      since: options?.since?.toISOString(),
    }),
    queryFn: () => fetchSightings(options),
  });

  return {
    sightings: data?.sightings ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

// Create sighting mutation

interface CreateSightingResponse {
  sighting: SightingWithInterpretation;
  interpretation: string;
  isFirstCatch: boolean;
  count: number;
  insight: PatternInsight | null;
  delight: DelightMoment | null;
  tier?: "free" | "insight";
}

async function createSighting(
  input: CreateSightingInput
): Promise<CreateSightingResponse> {
  const res = await fetch("/api/signal/sightings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to create sighting");
  }
  return res.json() as Promise<CreateSightingResponse>;
}

export function useCreateSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSighting,
    onSuccess: () => {
      // Invalidate sightings, stats, and heatmap caches
      void queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
      void queryClient.invalidateQueries({ queryKey: signalKeys.stats() });
      void queryClient.invalidateQueries({ queryKey: signalKeys.heatmap() });
    },
  });

  return {
    createSighting: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

// Delete sighting mutation

async function deleteSighting(id: string): Promise<void> {
  const res = await fetch(`/api/signal/sightings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete sighting");
}

export function useDeleteSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSighting,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
      void queryClient.invalidateQueries({ queryKey: signalKeys.stats() });
    },
  });

  return {
    deleteSighting: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

// Update sighting mutation

interface UpdateSightingParams {
  id: string;
  input: UpdateSightingInput;
}

async function updateSighting({
  id,
  input,
}: UpdateSightingParams): Promise<SightingWithInterpretation> {
  const res = await fetch(`/api/signal/sightings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to update sighting");
  }
  const data = (await res.json()) as { sighting: SightingWithInterpretation };
  return data.sighting;
}

export function useUpdateSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSighting,
    onSuccess: (sighting) => {
      // Update the specific sighting in cache
      queryClient.setQueryData(signalKeys.sighting(sighting.id), sighting);
      // Invalidate sightings list to reflect changes
      void queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
    },
  });

  return {
    updateSighting: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

// Single sighting fetch

async function fetchSighting(id: string): Promise<SightingWithInterpretation> {
  const res = await fetch(`/api/signal/sightings/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Sighting not found");
    throw new Error("Failed to fetch sighting");
  }
  const data = (await res.json()) as { sighting: SightingWithInterpretation };
  return data.sighting;
}

export function useSighting(id: string) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.sighting(id),
    queryFn: () => fetchSighting(id),
    enabled: !!id,
  });

  return {
    sighting: data,
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

// Adjacent sightings (prev/next navigation)

interface AdjacentSightings {
  prevId: string | null;
  nextId: string | null;
}

async function fetchAdjacentSightings(id: string): Promise<AdjacentSightings> {
  const res = await fetch(`/api/signal/sightings/${id}/adjacent`);
  if (!res.ok) {
    throw new Error("Failed to fetch adjacent sightings");
  }
  return res.json() as Promise<AdjacentSightings>;
}

export function useAdjacentSightings(id: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [...signalKeys.sighting(id), "adjacent"],
    queryFn: () => fetchAdjacentSightings(id),
    enabled: !!id,
  });

  return {
    prevId: data?.prevId ?? null,
    nextId: data?.nextId ?? null,
    isLoading,
    isError: !!error,
    error,
  };
}
