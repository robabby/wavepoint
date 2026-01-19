# Phase 3: Hooks & State

**Linear:** [SG-288](https://linear.app/sherpagg/issue/SG-288)
**Branch:** `sg-288-signal-phase-3-hooks-state`

## Overview

Install SWR and create React hooks for data fetching and mutations.

## Tasks

### 1. Install SWR

```bash
pnpm add swr
```

### 2. Create Hooks

Create the following hooks. See [hooks.md](../hooks.md) for implementations.

| File | Exports |
|------|---------|
| `src/hooks/signal/use-sightings.ts` | `useSightings`, `useCreateSighting`, `useDeleteSighting` |
| `src/hooks/signal/use-stats.ts` | `useStats` |
| `src/hooks/signal/use-interpretation.ts` | `useRegenerateInterpretation` |

### 3. Create Barrel Export

Create `src/hooks/signal/index.ts`:

```typescript
export { useSightings, useCreateSighting, useDeleteSighting } from "./use-sightings";
export { useStats } from "./use-stats";
export { useRegenerateInterpretation } from "./use-interpretation";
```

## Verification

- [ ] SWR installed
- [ ] `useSightings()` returns sightings list
- [ ] `useCreateSighting()` creates sightings with optimistic updates
- [ ] `useDeleteSighting()` removes sightings
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

**Install:** `pnpm add swr`

**Requires:** Phase 2 complete (API routes)

## Next Phase

[Phase 4: UI Components](./4-ui-components.md) — Create all Signal components
