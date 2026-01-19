import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signalKeys } from "./query-keys";

interface RegenerateResponse {
  interpretation: string;
}

async function regenerateInterpretation(
  sightingId: string
): Promise<RegenerateResponse> {
  const res = await fetch("/api/signal/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sightingId }),
  });
  if (!res.ok) throw new Error("Failed to regenerate interpretation");
  return res.json() as Promise<RegenerateResponse>;
}

export function useRegenerateInterpretation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: regenerateInterpretation,
    onSuccess: (_, sightingId) => {
      // Invalidate the specific sighting and the list
      void queryClient.invalidateQueries({
        queryKey: signalKeys.sighting(sightingId),
      });
      void queryClient.invalidateQueries({
        queryKey: signalKeys.sightings(),
      });
    },
  });

  return {
    regenerate: mutation.mutateAsync,
    isRegenerating: mutation.isPending,
    error: mutation.error,
  };
}
