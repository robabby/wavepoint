# Phase 1: Foundation

**Linear:** [SG-286](https://linear.app/sherpagg/issue/SG-286)
**Branch:** `sg-286-signal-phase-1-foundation`

## Overview

Set up the foundational infrastructure: environment variables, feature flag, database schema, and validation.

## Tasks

### 1. Environment Variables

Add to `src/env.js`:

```javascript
server: {
  // ... existing vars
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
},
client: {
  // ... existing vars
  NEXT_PUBLIC_SIGNAL_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
},
runtimeEnv: {
  // ... existing vars
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  NEXT_PUBLIC_SIGNAL_ENABLED: process.env.NEXT_PUBLIC_SIGNAL_ENABLED,
},
```

### 2. Feature Flag

Create `src/lib/signal/feature-flags.ts`:

```typescript
import { env } from "@/env";

export function isSignalEnabled(): boolean {
  return env.NEXT_PUBLIC_SIGNAL_ENABLED === true;
}
```

### 3. Database Schema

Add Signal tables to `src/lib/db/schema.ts`. See [schema.md](../schema.md) for full implementation.

Tables to add:
- `signalSightings`
- `signalInterpretations`
- `signalUserNumberStats`

Plus relations for Drizzle's relational queries.

### 4. Run Migration

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 5. Zod Schemas

Create `src/lib/signal/schemas.ts`:

```typescript
import { z } from "zod";

export const MOOD_OPTIONS = [
  "calm", "energized", "reflective", "anxious", "grateful", "inspired",
] as const;

export const createSightingSchema = z.object({
  number: z.string().min(1).max(10).regex(/^\d+$/, "Must contain only digits"),
  note: z.string().max(500).optional(),
  moodTags: z.array(z.enum(MOOD_OPTIONS)).max(3).optional(),
});

export type CreateSightingInput = z.infer<typeof createSightingSchema>;
```

### 6. TypeScript Types

Create `src/lib/signal/types.ts`:

```typescript
export interface SightingWithInterpretation {
  id: string;
  userId: string;
  number: string;
  note: string | null;
  moodTags: string[] | null;
  timestamp: Date;
  createdAt: Date;
  interpretation: {
    id: string;
    content: string;
    model: string;
    createdAt: Date;
  } | null;
}

export interface UserStats {
  totalSightings: number;
  uniqueNumbers: number;
  numberCounts: {
    number: string;
    count: number;
    firstSeen: Date;
    lastSeen: Date;
  }[];
}
```

## Verification

- [ ] `ANTHROPIC_API_KEY` and `NEXT_PUBLIC_SIGNAL_ENABLED` in env
- [ ] Feature flag function works (`isSignalEnabled()`)
- [ ] Database migration runs without errors
- [ ] Tables exist in database
- [ ] Zod schemas validate correctly
- [ ] `pnpm check` passes

## Dependencies

**Install:** None (no new packages in this phase)

## Next Phase

[Phase 2: Data Layer](./2-data-layer.md) — Install Anthropic SDK, create API routes
