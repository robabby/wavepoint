import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  GeometryAffinity,
  PlatonicSolidSlug,
  AffinityScore,
} from "@/lib/geometry";
import { geometryKeys } from "./query-keys";

interface AffinitiesResponse {
  affinities: GeometryAffinity[];
}

interface UpdateAffinityResponse {
  affinity: GeometryAffinity | null;
}

interface UpdateAffinityInput {
  geometrySlug: PlatonicSolidSlug;
  affinityScore: AffinityScore | null;
}

async function fetchAffinities(): Promise<AffinitiesResponse> {
  const res = await fetch("/api/profile/geometry-affinities");
  if (!res.ok) throw new Error("Failed to fetch geometry affinities");
  return res.json() as Promise<AffinitiesResponse>;
}

async function updateAffinity(
  input: UpdateAffinityInput
): Promise<UpdateAffinityResponse> {
  const res = await fetch("/api/profile/geometry-affinities", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to update geometry affinity");
  }
  return res.json() as Promise<UpdateAffinityResponse>;
}

/**
 * Hook to get all geometry affinities for the current user.
 */
export function useGeometryAffinities() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: geometryKeys.affinities(),
    queryFn: fetchAffinities,
  });

  return {
    affinities: data?.affinities ?? [],
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

/**
 * Hook to update a geometry affinity with optimistic UI.
 * Pass affinityScore: null to remove an affinity.
 */
export function useUpdateGeometryAffinity() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateAffinity,
    onMutate: async (input) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: geometryKeys.affinities() });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<AffinitiesResponse>(
        geometryKeys.affinities()
      );

      // Optimistically update the cache
      queryClient.setQueryData<AffinitiesResponse>(
        geometryKeys.affinities(),
        (old) => {
          if (!old) return { affinities: [] };

          const { geometrySlug, affinityScore } = input;

          // If removing affinity, filter it out
          if (affinityScore === null) {
            return {
              affinities: old.affinities.filter(
                (a) => a.geometrySlug !== geometrySlug
              ),
            };
          }

          // Check if affinity already exists
          const existingIndex = old.affinities.findIndex(
            (a) => a.geometrySlug === geometrySlug
          );

          if (existingIndex >= 0) {
            // Update existing affinity
            const updated = [...old.affinities];
            const existing = updated[existingIndex];
            if (existing) {
              updated[existingIndex] = {
                ...existing,
                affinityScore,
                source: "self_reported",
                updatedAt: new Date(),
              };
            }
            return { affinities: updated };
          }

          // Add new affinity (optimistic placeholder)
          const newAffinity: GeometryAffinity = {
            id: `temp-${geometrySlug}`,
            userId: "",
            geometrySlug,
            affinityScore,
            source: "self_reported",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return { affinities: [...old.affinities, newAffinity] };
        }
      );

      return { previousData };
    },
    onError: (_error, _input, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          geometryKeys.affinities(),
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation to ensure server state
      void queryClient.invalidateQueries({
        queryKey: geometryKeys.affinities(),
      });
    },
  });

  return {
    updateAffinity: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
