# Spiritual Fingerprint: Track A - Core Infrastructure + Dashboard

**Date:** 2026-01-26
**Status:** Not Started
**Parallel Track:** `docs/plans/2026-01-26-fingerprint-templates.md` (Track B: Templates)
**Worktree:** `~/Workbench/.worktrees/wavepoint/feature/fingerprint-core`

---

## Pickup Prompt

```
I'm implementing Track A of the Spiritual Fingerprint feature for WavePoint.

Read docs/plans/2026-01-26-fingerprint-core.md for the full plan.

This track covers:
- A1: Schema changes + enhanced capture (activity field)
- A2: Resonance feedback system
- A3: Pattern detection + caching
- A4: Unified 5-section dashboard
- A5: Profile as Spiritual Fingerprint

Track B (templates) is being developed in parallel in a separate worktree. We'll integrate at the end when templates are ready.

Start with A1: Schema + Enhanced Capture. Check the verification boxes as you complete each item.
```

---

## Vision

Transform WavePoint from discrete features into a unified **Spiritual Fingerprint** system. This track builds the core infrastructure: schema, capture enhancements, pattern detection, and the unified dashboard experience.

---

## Phase A1: Schema + Enhanced Capture

**Goal:** Add activity field to capture flow, create new tables

### Schema Changes

Add to `src/lib/db/schema.ts`:

```sql
-- Add activity column to signalSightings
ALTER TABLE signal_sightings ADD COLUMN activity TEXT;
-- Values: 'working' | 'transit' | 'resting' | 'socializing' | 'other'

-- Resonance tracking (NEW)
CREATE TABLE interpretation_resonance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sighting_id UUID NOT NULL REFERENCES signal_sightings(id) ON DELETE CASCADE,
  resonated BOOLEAN, -- true = yes, false = no, null = "not sure yet"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sighting_id)
);
CREATE INDEX interpretation_resonance_user_id_idx ON interpretation_resonance(user_id);

-- Geometry affinities (NEW)
CREATE TABLE geometry_affinities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  geometry_slug TEXT NOT NULL,
  affinity_score INTEGER NOT NULL DEFAULT 3, -- 1-5
  source TEXT NOT NULL DEFAULT 'self_reported', -- 'self_reported' | 'inferred'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, geometry_slug)
);
CREATE INDEX geometry_affinities_user_id_idx ON geometry_affinities(user_id);

-- Pattern insights cache (NEW)
CREATE TABLE user_pattern_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL, -- 'time_distribution' | 'mood_correlation' | 'activity_correlation' | 'lunar_correlation' | 'frequency_trend'
  insight_key TEXT NOT NULL, -- e.g., 'peak_hour', 'top_mood_444'
  insight_value JSONB NOT NULL,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  sighting_count_at_computation INTEGER,
  UNIQUE(user_id, insight_type, insight_key)
);
CREATE INDEX user_pattern_insights_user_id_idx ON user_pattern_insights(user_id);
```

### Capture Flow Changes

Merge activity into mood step (single-select chips above mood tags):
- Activity options: working, transit, resting, socializing, other
- Optional, can skip with existing "Continue without context"
- Activity row appears ABOVE mood tags

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/db/schema.ts` | Add 4 tables, activity column |
| `src/lib/signal/schemas.ts` | Add `activity` field, `ACTIVITY_OPTIONS` const |
| `src/components/signal/mood-selector.tsx` | Add activity chip row above mood tags |
| `src/app/api/signal/sightings/route.ts` | Accept activity field |

### Verification

- [ ] `activity` column exists on `signal_sightings` table
- [ ] `interpretation_resonance` table created with UNIQUE constraint
- [ ] `geometry_affinities` table created
- [ ] `user_pattern_insights` table created
- [ ] Capture flow shows activity chips above mood tags
- [ ] Activity is single-select (not multi-select like moods)
- [ ] Sighting POST accepts and persists activity
- [ ] `pnpm check` passes

---

## Phase A2: Resonance Feedback

**Goal:** Let users indicate if interpretations resonate (detail view only)

### UI Design

On sighting detail page, below interpretation:
```
Did this interpretation resonate?
[Yes] [No] [Not sure yet]
```

Behavior:
- One-time selection, persists
- Subtle styling, no celebration on select
- "Not sure yet" = null in DB (respects that meaning takes time)
- Already-selected state shows which option was chosen

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/resonance/index.ts` | Module exports |
| `src/lib/resonance/types.ts` | Resonance types |
| `src/lib/resonance/schemas.ts` | Zod schemas |
| `src/hooks/resonance/index.ts` | Hook exports |
| `src/hooks/resonance/use-resonance.ts` | useResonance, useRecordResonance hooks |
| `src/app/api/signal/resonance/route.ts` | POST endpoint |
| `src/components/signal/resonance-feedback.tsx` | UI component |

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/signal/sighting/[id]/sighting-client.tsx` | Add ResonanceFeedback below interpretation |

### Verification

- [ ] Resonance feedback appears on sighting detail view
- [ ] Three options work: Yes, No, Not sure yet
- [ ] Selection persists and is retrievable
- [ ] Cannot submit multiple resonances for same sighting
- [ ] Loading state while submitting
- [ ] Selected state clearly shows chosen option
- [ ] `pnpm check` passes

---

## Phase A3: Pattern Detection + Caching

**Goal:** Surface insights from accumulated data

### Pattern Types

| Type | Key Examples | Description |
|------|--------------|-------------|
| `time_distribution` | `peak_hour`, `day_of_week` | When sightings occur |
| `mood_correlation` | `top_mood_444`, `anxious_numbers` | Which moods appear with which numbers |
| `activity_correlation` | `work_numbers`, `rest_numbers` | Number patterns by activity |
| `frequency_trend` | `444_weekly_trend`, `overall_trend` | Current vs baseline frequency |

### Computation Strategy (Hybrid)

1. **Write-time counters:** Increment simple stats on each sighting (O(1))
2. **Background computation:** Complex aggregations run after sighting create, cached
3. **Staleness detection:** `sighting_count_at_computation` field, recompute if 5+ new sightings

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/patterns/index.ts` | Module exports |
| `src/lib/patterns/types.ts` | PatternInsight types |
| `src/lib/patterns/time.ts` | Time distribution analysis |
| `src/lib/patterns/mood.ts` | Mood correlation analysis |
| `src/lib/patterns/activity.ts` | Activity correlation analysis |
| `src/lib/patterns/trends.ts` | Frequency trend analysis |
| `src/lib/patterns/compute.ts` | Orchestrates all pattern computation |
| `src/lib/patterns/cache.ts` | Read/write to user_pattern_insights |
| `src/hooks/patterns/index.ts` | Hook exports |
| `src/hooks/patterns/use-patterns.ts` | usePatterns hook |
| `src/app/api/signal/patterns/route.ts` | GET patterns, triggers recompute if stale |

### Verification

- [ ] Pattern computation runs after sighting creation
- [ ] Time distribution pattern computed correctly
- [ ] Mood correlation pattern computed (needs 5+ sightings with moods)
- [ ] Activity correlation pattern computed (needs 5+ sightings with activities)
- [ ] Frequency trend pattern computed
- [ ] Staleness detection triggers recomputation after 5+ new sightings
- [ ] API returns cached patterns in <100ms
- [ ] `pnpm check` passes

---

## Phase A4: Unified Dashboard (5 Sections)

**Goal:** Create integrated Layer 1 home at `/signal`

### Section 1: Today's Cosmic Context
- Current moon phase with icon + glow
- Sun sign, key planetary positions
- Any active retrogrades
- Uses existing ephemeris API

### Section 2: Personal Focus
- If profile exists: Top 2 transits affecting user today
- If no profile: Prompt to add birth info (reuse ProfilePromptCard)
- Pattern-based guidance: "You tend to see [number] during [activity]—notice it today?"

### Section 3: Quick Actions
- Capture sighting (existing)
- Add journal entry (link to calendar day)
- Set intention (placeholder, deferred to Layer 1.5)

### Section 4: Recent Activity
- Unified feed: sightings + journal entries (interleaved by date)
- Each item shows: type, date, preview
- Sightings: number badge + first line of interpretation
- Journal: entry type badge + first line

### Section 5: Fingerprint Summary
- Top 3 numbers with counts
- Dominant element (computed from number resonances)
- Streak/activity stats (existing)
- Link to full /profile fingerprint view

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/dashboard/cosmic-context-section.tsx` | Section 1 |
| `src/components/dashboard/personal-focus-section.tsx` | Section 2 |
| `src/components/dashboard/quick-actions-section.tsx` | Section 3 |
| `src/components/dashboard/recent-activity-section.tsx` | Section 4 |
| `src/components/dashboard/fingerprint-summary-section.tsx` | Section 5 |
| `src/components/dashboard/index.ts` | Component exports |

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/signal/dashboard-content.tsx` | Major restructure to use 5 sections |

### Verification

- [ ] Cosmic context section renders with real ephemeris data
- [ ] Moon phase glow effect works
- [ ] Personal focus shows transits (if profile exists)
- [ ] Personal focus shows ProfilePromptCard (if no profile)
- [ ] Pattern-based guidance appears when patterns exist
- [ ] Quick actions all navigate correctly
- [ ] Recent activity shows unified sightings + journal feed
- [ ] Fingerprint summary shows top 3 numbers
- [ ] Fingerprint summary links to /profile
- [ ] Mobile responsive layout works
- [ ] `pnpm check` passes

---

## Phase A5: Profile as Spiritual Fingerprint

**Goal:** Transform /profile into the fingerprint view

### New Sections

**Geometry Affinities:**
- Visual card grid of sacred geometries
- Tap to set affinity (1-5 scale via slider or star rating)
- Shows current affinity state

**Observed Patterns:**
- Top patterns from cache
- Examples: "You see 444 most during work", "Peak sighting time: 11am"

**Resonance Summary:**
- Aggregate feedback stats
- "X interpretations reviewed, Y resonated"
- Resonance rate percentage

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/profile/geometry-affinities.tsx` | Geometry card grid with affinity controls |
| `src/components/profile/patterns-section.tsx` | Pattern insights display |
| `src/components/profile/resonance-summary.tsx` | Aggregated resonance stats |
| `src/hooks/geometry/index.ts` | Hook exports |
| `src/hooks/geometry/use-geometry-affinities.ts` | useGeometryAffinities, useUpdateAffinity |
| `src/app/api/profile/geometry-affinities/route.ts` | GET/POST geometry affinities |

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/profile/page.tsx` | Add new fingerprint sections |

### Verification

- [ ] Geometry affinities section renders with geometry cards
- [ ] Can set affinity score (1-5) for any geometry
- [ ] Affinity persists and retrieves correctly
- [ ] Patterns section shows computed insights (when available)
- [ ] Resonance summary shows aggregate stats
- [ ] Sections gracefully handle empty state (no data yet)
- [ ] Mobile responsive layout works
- [ ] `pnpm check` passes

---

## Integration Point with Track B

When Track B (Templates) is ready:

1. Add `interpretation_source` column to `signalInterpretations`:
   ```sql
   ALTER TABLE signal_interpretations ADD COLUMN source TEXT DEFAULT 'ai';
   -- Values: 'ai' | 'template'
   ```

2. Update sighting creation to use template system as primary
3. Add A/B test flag for rollout control
4. Track resonance rates by source

**Coordination:** Track B will create `src/lib/templates/` and `src/lib/signal/interpret.ts`. Track A integrates by calling interpret.ts instead of direct Claude API.

---

## File Summary

### New Files (Track A)

```
src/lib/resonance/
  index.ts
  types.ts
  schemas.ts

src/hooks/resonance/
  index.ts
  use-resonance.ts

src/lib/patterns/
  index.ts
  types.ts
  time.ts
  mood.ts
  activity.ts
  trends.ts
  compute.ts
  cache.ts

src/hooks/patterns/
  index.ts
  use-patterns.ts

src/components/dashboard/
  index.ts
  cosmic-context-section.tsx
  personal-focus-section.tsx
  quick-actions-section.tsx
  recent-activity-section.tsx
  fingerprint-summary-section.tsx

src/components/profile/
  geometry-affinities.tsx
  patterns-section.tsx
  resonance-summary.tsx

src/hooks/geometry/
  index.ts
  use-geometry-affinities.ts

src/app/api/signal/resonance/route.ts
src/app/api/signal/patterns/route.ts
src/app/api/profile/geometry-affinities/route.ts
```

### Modified Files (Track A)

```
src/lib/db/schema.ts
src/lib/signal/schemas.ts
src/components/signal/mood-selector.tsx
src/components/signal/resonance-feedback.tsx (new)
src/app/api/signal/sightings/route.ts
src/app/signal/dashboard-content.tsx
src/app/signal/sighting/[id]/sighting-client.tsx
src/app/profile/page.tsx
```

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Pattern computation slow | Background async + caching; never block sighting creation |
| Dashboard too complex | Collapsible sections, progressive disclosure |
| Geometry affinity UX unclear | Clear 1-5 scale with labels, preview state |
| Integration timing with Track B | Core works without templates; AI fallback always available |
