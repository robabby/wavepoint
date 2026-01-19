# Phase 5: Pages

**Linear:** [SG-290](https://linear.app/sherpagg/issue/SG-290)
**Branch:** `sg-290-signal-phase-5-pages`

> **PRD Reference:** [`docs/prds/signal.md`](../../../prds/signal.md) — User journeys, edge cases

## Overview

Create Signal pages: layout with guards, dashboard, capture flow, and sighting detail.

## Tasks

### 1. Signal Layout (Auth + Feature Guard)

Create `src/app/signal/layout.tsx`:

```typescript
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

export default async function SignalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirect=/signal");
  }

  // Check feature flag
  if (!isSignalEnabled()) {
    notFound();
  }

  return <>{children}</>;
}
```

### 2. Dashboard Page (`/signal`)

Create `src/app/signal/page.tsx`:

Features:
- Stats summary (total sightings, unique numbers)
- Collection grid with recent sightings
- Filter by number
- Link to capture page
- Empty state for new users

```tsx
import { CollectionGrid } from "@/components/signal/collection-grid";
import { useSightings, useStats } from "@/hooks/signal";

export default function SignalDashboard() {
  // ... implementation using hooks and components
}
```

### 3. Capture Page (`/signal/capture`)

Create `src/app/signal/capture/page.tsx`:

Multi-step flow:
1. Number input (NumberPad or SacredNumberWheel)
2. Mood selection (optional)
3. Note input (optional)
4. Submit → show interpretation + celebration

### 4. Sighting Detail Page (`/signal/sighting/[id]`)

Create `src/app/signal/sighting/[id]/page.tsx`:

Features:
- Full sighting display
- Interpretation card
- Regenerate interpretation button
- Delete sighting action
- Back to collection link

Edge cases (from PRD):
- Invalid ID → 404
- Other user's sighting → 404
- Own sighting → show detail

## Page Structure

```
src/app/signal/
├── layout.tsx                 # Auth + feature flag guard
├── page.tsx                   # Dashboard/collection
├── capture/
│   └── page.tsx               # Capture flow
└── sighting/
    └── [id]/
        └── page.tsx           # Single sighting detail
```

## User Journeys to Implement

From [PRD](../../../prds/signal.md#user-journeys):

1. **First Sighting:** Dashboard → Capture → Input → Mood → Submit → Celebration
2. **Quick Repeat:** Dashboard → Capture → Input → Submit (skip mood)
3. **Reflection:** Dashboard → Filter by number → View history

## Verification

- [ ] Layout redirects unauthenticated users to `/login?redirect=/signal`
- [ ] Layout returns 404 when feature flag is off
- [ ] Dashboard shows stats and collection
- [ ] Dashboard shows empty state for new users
- [ ] Capture flow completes successfully
- [ ] First-catch celebration shows for new numbers
- [ ] Sighting detail loads correct sighting
- [ ] Sighting detail returns 404 for invalid/other's sightings
- [ ] `pnpm check` passes

## Dependencies

**Install:** None

**Requires:** Phase 4 complete (all components)

## Next Phase

[Phase 6: Integration](./6-integration.md) — Add Signal to navigation, verify guards
