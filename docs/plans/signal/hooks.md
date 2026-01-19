# Signal React Hooks

SWR hooks for data fetching in Signal.

> **Related:** [api.md](./api.md) | [components.md](./components.md) | [README.md](./README.md)

## Install

```bash
pnpm add swr
```

## Hooks Overview

| Hook | Purpose |
|------|---------|
| `useSightings` | List sightings with filtering |
| `useCreateSighting` | Create new sighting mutation |
| `useDeleteSighting` | Delete sighting mutation |
| `useStats` | Get user statistics |
| `useRegenerateInterpretation` | Regenerate interpretation mutation |

## useSightings

List sightings with optional number filter.

```typescript
// src/hooks/signal/use-sightings.ts
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import type { SignalSighting, SignalInterpretation } from "@/lib/db/schema";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface SightingWithInterpretation extends SignalSighting {
  interpretation: SignalInterpretation | null;
}

interface UseSightingsOptions {
  number?: string;
  limit?: number;
  offset?: number;
}

export function useSightings(options?: UseSightingsOptions) {
  const params = new URLSearchParams();
  if (options?.number) params.set("number", options.number);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));

  const { data, error, isLoading, mutate } = useSWR<{
    sightings: SightingWithInterpretation[];
    total: number;
  }>(`/api/signal/sightings?${params}`, fetcher);

  return {
    sightings: data?.sightings ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
```

## useCreateSighting

Create a new sighting.

```typescript
// src/hooks/signal/use-sightings.ts (continued)
import type { CreateSightingInput } from "@/lib/signal/schemas";

interface CreateSightingResponse {
  sighting: SignalSighting;
  interpretation: string;
  isFirstCatch: boolean;
  count: number;
}

export function useCreateSighting() {
  const { trigger, isMutating, error } = useSWRMutation<
    CreateSightingResponse,
    Error,
    string,
    CreateSightingInput
  >(
    "/api/signal/sightings",
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create sighting");
      }
      return res.json();
    }
  );

  return {
    createSighting: trigger,
    isCreating: isMutating,
    error,
  };
}
```

## useDeleteSighting

Delete a sighting.

```typescript
// src/hooks/signal/use-sightings.ts (continued)
export function useDeleteSighting() {
  const { trigger, isMutating } = useSWRMutation(
    "/api/signal/sightings",
    async (url, { arg: id }: { arg: string }) => {
      const res = await fetch(`${url}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sighting");
      return res.json();
    }
  );

  return {
    deleteSighting: trigger,
    isDeleting: isMutating,
  };
}
```

## useStats

Get user statistics.

```typescript
// src/hooks/signal/use-stats.ts
import useSWR from "swr";
import type { SignalUserNumberStats } from "@/lib/db/schema";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface StatsResponse {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: SignalUserNumberStats[];
}

export function useStats() {
  const { data, error, isLoading, mutate } = useSWR<StatsResponse>(
    "/api/signal/stats",
    fetcher
  );

  return {
    totalSightings: data?.totalSightings ?? 0,
    uniqueNumbers: data?.uniqueNumbers ?? 0,
    numberCounts: data?.numberCounts ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
```

## useRegenerateInterpretation

Regenerate interpretation for a sighting.

```typescript
// src/hooks/signal/use-interpretation.ts
import useSWRMutation from "swr/mutation";

export function useRegenerateInterpretation() {
  const { trigger, isMutating } = useSWRMutation(
    "/api/signal/interpret",
    async (url, { arg: sightingId }: { arg: string }) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sightingId }),
      });
      if (!res.ok) throw new Error("Failed to regenerate interpretation");
      return res.json();
    }
  );

  return {
    regenerate: trigger,
    isRegenerating: isMutating,
  };
}
```

## Barrel Export

```typescript
// src/hooks/signal/index.ts
export { useSightings, useCreateSighting, useDeleteSighting } from "./use-sightings";
export { useStats } from "./use-stats";
export { useRegenerateInterpretation } from "./use-interpretation";
```

## Usage Example

```tsx
"use client";

import { useSightings, useCreateSighting, useStats } from "@/hooks/signal";

export function CaptureFlow() {
  const { sightings, mutate: mutateSightings } = useSightings();
  const { mutate: mutateStats } = useStats();
  const { createSighting, isCreating } = useCreateSighting();

  const handleCapture = async (number: string, moodTags?: string[]) => {
    const result = await createSighting({ number, moodTags });

    // Revalidate both sightings and stats
    await Promise.all([mutateSightings(), mutateStats()]);

    if (result.isFirstCatch) {
      // Show celebration!
    }
  };

  return (
    // ...
  );
}
```
