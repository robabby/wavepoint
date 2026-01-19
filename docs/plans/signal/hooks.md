# Signal React Hooks

React Query (TanStack Query) hooks for data fetching in Signal.

> **Related:** [api.md](./api.md) | [components.md](./components.md) | [README.md](./README.md)

## Install

```bash
pnpm add @tanstack/react-query
```

## Provider Setup

Add to root layout or Signal layout:

```typescript
// src/app/signal/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function SignalProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

## Hooks Overview

| Hook | Purpose |
|------|---------|
| `useSightings` | List sightings with filtering |
| `useCreateSighting` | Create new sighting mutation |
| `useDeleteSighting` | Delete sighting mutation |
| `useStats` | Get user statistics |
| `useRegenerateInterpretation` | Regenerate interpretation mutation |

## Query Keys

Centralized query keys for cache management:

```typescript
// src/hooks/signal/query-keys.ts
export const signalKeys = {
  all: ["signal"] as const,
  sightings: () => [...signalKeys.all, "sightings"] as const,
  sightingsList: (filters?: { number?: string }) =>
    [...signalKeys.sightings(), filters] as const,
  sighting: (id: string) => [...signalKeys.sightings(), id] as const,
  stats: () => [...signalKeys.all, "stats"] as const,
};
```

## useSightings

List sightings with optional number filter.

```typescript
// src/hooks/signal/use-sightings.ts
import { useQuery } from "@tanstack/react-query";
import type { SignalSighting, SignalInterpretation } from "@/lib/db/schema";
import { signalKeys } from "./query-keys";

interface SightingWithInterpretation extends SignalSighting {
  interpretation: SignalInterpretation | null;
}

interface SightingsResponse {
  sightings: SightingWithInterpretation[];
  total: number;
}

interface UseSightingsOptions {
  number?: string;
  limit?: number;
  offset?: number;
}

async function fetchSightings(options?: UseSightingsOptions): Promise<SightingsResponse> {
  const params = new URLSearchParams();
  if (options?.number) params.set("number", options.number);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const res = await fetch(`/api/signal/sightings?${params}`);
  if (!res.ok) throw new Error("Failed to fetch sightings");
  return res.json();
}

export function useSightings(options?: UseSightingsOptions) {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.sightingsList({ number: options?.number }),
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
```

## useCreateSighting

Create a new sighting with cache invalidation.

```typescript
// src/hooks/signal/use-sightings.ts (continued)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSightingInput } from "@/lib/signal/schemas";

interface CreateSightingResponse {
  sighting: SignalSighting;
  interpretation: string;
  isFirstCatch: boolean;
  count: number;
}

async function createSighting(input: CreateSightingInput): Promise<CreateSightingResponse> {
  const res = await fetch("/api/signal/sightings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create sighting");
  }
  return res.json();
}

export function useCreateSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSighting,
    onSuccess: () => {
      // Invalidate both sightings and stats caches
      queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
      queryClient.invalidateQueries({ queryKey: signalKeys.stats() });
    },
  });

  return {
    createSighting: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
```

## useDeleteSighting

Delete a sighting with cache invalidation.

```typescript
// src/hooks/signal/use-sightings.ts (continued)
async function deleteSighting(id: string): Promise<void> {
  const res = await fetch(`/api/signal/sightings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete sighting");
}

export function useDeleteSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSighting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
      queryClient.invalidateQueries({ queryKey: signalKeys.stats() });
    },
  });

  return {
    deleteSighting: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}
```

## useStats

Get user statistics.

```typescript
// src/hooks/signal/use-stats.ts
import { useQuery } from "@tanstack/react-query";
import type { SignalUserNumberStats } from "@/lib/db/schema";
import { signalKeys } from "./query-keys";

interface StatsResponse {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: SignalUserNumberStats[];
}

async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch("/api/signal/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export function useStats() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: signalKeys.stats(),
    queryFn: fetchStats,
  });

  return {
    totalSightings: data?.totalSightings ?? 0,
    uniqueNumbers: data?.uniqueNumbers ?? 0,
    numberCounts: data?.numberCounts ?? [],
    isLoading,
    isError: !!error,
    refetch,
  };
}
```

## useRegenerateInterpretation

Regenerate interpretation for a sighting.

```typescript
// src/hooks/signal/use-interpretation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signalKeys } from "./query-keys";

interface RegenerateResponse {
  interpretation: string;
}

async function regenerateInterpretation(sightingId: string): Promise<RegenerateResponse> {
  const res = await fetch("/api/signal/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sightingId }),
  });
  if (!res.ok) throw new Error("Failed to regenerate interpretation");
  return res.json();
}

export function useRegenerateInterpretation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: regenerateInterpretation,
    onSuccess: (_, sightingId) => {
      // Invalidate the specific sighting and the list
      queryClient.invalidateQueries({ queryKey: signalKeys.sighting(sightingId) });
      queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
    },
  });

  return {
    regenerate: mutation.mutateAsync,
    isRegenerating: mutation.isPending,
    error: mutation.error,
  };
}
```

## Barrel Export

```typescript
// src/hooks/signal/index.ts
export { signalKeys } from "./query-keys";
export { useSightings, useCreateSighting, useDeleteSighting } from "./use-sightings";
export { useStats } from "./use-stats";
export { useRegenerateInterpretation } from "./use-interpretation";
```

## Usage Example

```tsx
"use client";

import { useSightings, useCreateSighting, useStats } from "@/hooks/signal";

export function CaptureFlow() {
  const { sightings } = useSightings();
  const { totalSightings } = useStats();
  const { createSighting, isCreating } = useCreateSighting();

  const handleCapture = async (number: string, moodTags?: string[]) => {
    try {
      const result = await createSighting({ number, moodTags });

      // Cache invalidation happens automatically via onSuccess

      if (result.isFirstCatch) {
        // Show celebration!
      }

      return result;
    } catch (error) {
      // Handle error
      console.error("Failed to capture:", error);
    }
  };

  return (
    // ...
  );
}
```

## Optimistic Updates (Optional)

For instant UI feedback, add optimistic updates to mutations:

```typescript
export function useCreateSighting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSighting,
    onMutate: async (newSighting) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: signalKeys.sightings() });

      // Snapshot previous value
      const previousSightings = queryClient.getQueryData(signalKeys.sightingsList());

      // Optimistically add the new sighting
      // (implementation depends on desired UX)

      return { previousSightings };
    },
    onError: (err, newSighting, context) => {
      // Rollback on error
      if (context?.previousSightings) {
        queryClient.setQueryData(signalKeys.sightingsList(), context.previousSightings);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: signalKeys.sightings() });
      queryClient.invalidateQueries({ queryKey: signalKeys.stats() });
    },
  });

  return {
    createSighting: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| React Query over SWR | Better mutation handling, explicit cache invalidation, superior TypeScript DX |
| Centralized query keys | Consistent cache management, easy invalidation patterns |
| `mutateAsync` over `mutate` | Allows awaiting results in handlers, better error handling |
| Automatic invalidation | Mutations invalidate related queries via `onSuccess` callbacks |
| 1-minute stale time | Balance freshness with API efficiency |
