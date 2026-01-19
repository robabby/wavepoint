# Phase 3: Hooks & State

**Linear:** [SG-288](https://linear.app/sherpagg/issue/SG-288)
**Branch:** `sg-288-signal-phase-3-hooks-state`

## Overview

Install React Query (TanStack Query) and create hooks for data fetching and mutations.

## Tasks

### 1. Install React Query

```bash
pnpm add @tanstack/react-query
```

### 2. Create Query Provider

Create `src/app/signal/providers.tsx`:

```typescript
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

Update `src/app/signal/layout.tsx` to wrap children with `SignalProviders`.

### 3. Create Query Keys

Create `src/hooks/signal/query-keys.ts`:

```typescript
export const signalKeys = {
  all: ["signal"] as const,
  sightings: () => [...signalKeys.all, "sightings"] as const,
  sightingsList: (filters?: { number?: string }) =>
    [...signalKeys.sightings(), filters] as const,
  sighting: (id: string) => [...signalKeys.sightings(), id] as const,
  stats: () => [...signalKeys.all, "stats"] as const,
};
```

### 4. Create Hooks

Create the following hooks. See [hooks.md](../hooks.md) for full implementations.

| File | Exports |
|------|---------|
| `src/hooks/signal/query-keys.ts` | `signalKeys` |
| `src/hooks/signal/use-sightings.ts` | `useSightings`, `useCreateSighting`, `useDeleteSighting` |
| `src/hooks/signal/use-stats.ts` | `useStats` |
| `src/hooks/signal/use-interpretation.ts` | `useRegenerateInterpretation` |

### 5. Create Barrel Export

Create `src/hooks/signal/index.ts`:

```typescript
export { signalKeys } from "./query-keys";
export { useSightings, useCreateSighting, useDeleteSighting } from "./use-sightings";
export { useStats } from "./use-stats";
export { useRegenerateInterpretation } from "./use-interpretation";
```

## Verification

- [ ] React Query installed
- [ ] `SignalProviders` wraps Signal layout
- [ ] `useSightings()` returns sightings list
- [ ] `useCreateSighting()` creates sightings and invalidates cache
- [ ] `useDeleteSighting()` removes sightings and invalidates cache
- [ ] `useStats()` returns user statistics
- [ ] `useRegenerateInterpretation()` regenerates interpretations
- [ ] All hooks handle loading and error states
- [ ] `pnpm check` passes

## Usage Test

Create a simple test component:

```tsx
"use client";

import { useSightings, useStats } from "@/hooks/signal";

export function SignalTest() {
  const { sightings, isLoading } = useSightings();
  const { totalSightings } = useStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>Total: {totalSightings}</p>
      <ul>
        {sightings.map((s) => (
          <li key={s.id}>{s.number}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Dependencies

**Install:** `pnpm add @tanstack/react-query`

**Requires:** Phase 2 complete (API routes)

## Next Phase

[Phase 4: UI Components](./4-ui-components.md) — Create Signal components (NumberPad and core UI)
