import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ConstellationEntry,
  ConstellationResponse,
  ConstellationSystem,
  ConstellationStatus,
} from "@/lib/constellation";
import { constellationKeys } from "./query-keys";

interface UpdateStatusInput {
  system: ConstellationSystem;
  identifier: string;
  status: ConstellationStatus;
}

interface AddInput {
  system: ConstellationSystem;
  identifier: string;
}

async function fetchConstellation(): Promise<ConstellationResponse> {
  const res = await fetch("/api/profile/constellation");
  if (!res.ok) throw new Error("Failed to fetch constellation");
  return res.json() as Promise<ConstellationResponse>;
}

async function updateStatus(
  input: UpdateStatusInput
): Promise<{ entry: ConstellationEntry }> {
  const res = await fetch("/api/profile/constellation", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to update constellation");
  }
  return res.json() as Promise<{ entry: ConstellationEntry }>;
}

async function addEntry(
  input: AddInput
): Promise<{ entry: ConstellationEntry }> {
  const res = await fetch("/api/profile/constellation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Failed to add constellation entry");
  }
  return res.json() as Promise<{ entry: ConstellationEntry }>;
}

/**
 * Hook to get all constellation entries for the current user.
 */
export function useConstellation() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: constellationKeys.entries(),
    queryFn: fetchConstellation,
  });

  return {
    entries: data?.entries ?? [],
    isLoading,
    isError: !!error,
    error,
    refetch,
  };
}

/**
 * Hook to update a constellation entry's status with optimistic UI.
 */
export function useUpdateConstellationStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateStatus,
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: constellationKeys.entries(),
      });

      const previousData = queryClient.getQueryData<ConstellationResponse>(
        constellationKeys.entries()
      );

      queryClient.setQueryData<ConstellationResponse>(
        constellationKeys.entries(),
        (old) => {
          if (!old) return { entries: [] };
          return {
            entries: old.entries.map((entry) =>
              entry.system === input.system &&
              entry.identifier === input.identifier
                ? { ...entry, status: input.status, updatedAt: new Date() }
                : entry
            ),
          };
        }
      );

      return { previousData };
    },
    onError: (_error, _input, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          constellationKeys.entries(),
          context.previousData
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: constellationKeys.entries(),
      });
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook to add a user-chosen constellation entry with optimistic UI.
 */
export function useAddConstellation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addEntry,
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: constellationKeys.entries(),
      });

      const previousData = queryClient.getQueryData<ConstellationResponse>(
        constellationKeys.entries()
      );

      queryClient.setQueryData<ConstellationResponse>(
        constellationKeys.entries(),
        (old) => {
          if (!old) return { entries: [] };

          // Check if already exists (may be re-activating a dismissed one)
          const existing = old.entries.find(
            (e) =>
              e.system === input.system && e.identifier === input.identifier
          );
          if (existing) {
            return {
              entries: old.entries.map((e) =>
                e.system === input.system && e.identifier === input.identifier
                  ? { ...e, status: "active" as const, updatedAt: new Date() }
                  : e
              ),
            };
          }

          const newEntry: ConstellationEntry = {
            id: `temp-${input.identifier}`,
            userId: "",
            system: input.system,
            identifier: input.identifier as ConstellationEntry["identifier"],
            source: "user_added",
            status: "active",
            derivedFrom: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return { entries: [...old.entries, newEntry] };
        }
      );

      return { previousData };
    },
    onError: (_error, _input, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          constellationKeys.entries(),
          context.previousData
        );
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: constellationKeys.entries(),
      });
    },
  });

  return {
    addEntry: mutation.mutateAsync,
    isAdding: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
