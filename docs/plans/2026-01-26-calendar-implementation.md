# Calendar Feature Implementation Plan

**Date:** 2026-01-26
**Status:** Phase 6 ~90% Complete (Final QA remaining)
**Evaluated:** feature-dev + frontend-design skill validation complete

---

## Session Progress (2026-01-26)

### Completed This Session
- **Phase 4**: Personal transits with `personal-transits.tsx`, reusable `ProfilePromptCard`, sidebar nav link
- **Phase 5**: Full journal CRUD (API routes, hooks, `journal-section.tsx` with type selector, month indicators)
- **Phase 6 (partial)**: Mobile swipe gestures, accessibility audit

### Bug Fixes Applied
1. **Ephemeris 400 error**: Reduced date range buffer in `month-view.tsx` (7+14 days → 6+7 days) to stay under 45-day API limit
2. **Sightings infinite refetch**: Added `useMemo` to `sightings-section.tsx` to stabilize the `since` Date object for React Query

### Accessibility Improvements (Session 2)
1. **`day-cell.tsx`**: Human-readable aria-label with date format, moon phase name, and context indicators
2. **`journal-section.tsx`**: aria-labels on edit/delete buttons, aria-pressed on type selector, aria-describedby for character count, focus-visible rings
3. **`day-view-content.tsx`**: aria-label and focus-visible on back link
4. **`month-view.tsx`**: Touch swipe gestures with velocity detection (50px threshold or 0.3px/ms velocity)

### Files Created/Modified This Session
```
Created:
- src/components/calendar/personal-transits.tsx
- src/components/calendar/journal-section.tsx
- src/app/api/calendar/journal/route.ts
- src/app/api/calendar/journal/[id]/route.ts
- src/hooks/calendar/use-journal.ts

Modified:
- src/components/signal/profile-prompt-card.tsx (added title/description/linkText props)
- src/components/sidebar/sidebar-nav.tsx (added Calendar to PRACTICE_SECTION)
- src/components/calendar/index.ts (exports)
- src/components/calendar/month-view.tsx (journal indicators, date range fix)
- src/components/calendar/sightings-section.tsx (useMemo fix)
- src/hooks/calendar/index.ts (journal hook exports)
- src/app/calendar/day/[date]/day-view-content.tsx (PersonalTransits + JournalSection)
```

---

## Executive Summary

A multi-scale cosmic calendar that synthesizes astrology, numerology, and sacred geometry into a unified temporal view. Users see universal cosmic weather, personal transits against their natal chart, their angel number sightings, and manually logged journal entries — all layered on a single timeline.

**Key Discovery:** The `spiritualProfiles` table and `calculateChart()` function already exist. This feature builds on existing infrastructure, not greenfield.

---

## Scope Decision: MVP First

Based on agent evaluation, **defer Week view** to reduce scope:

| View | MVP (Phases 1-4) | Post-MVP |
|------|------------------|----------|
| Month | Yes | - |
| Day | Yes | - |
| Week | No | Phase 5+ |

**Rationale:** Users typically want either the big picture (month) or immediate context (day). Week view adds development effort without proportional UX value.

---

## Architecture

### Existing Infrastructure (No Changes Needed)

| Component | Location | Status |
|-----------|----------|--------|
| Birth data storage | `spiritualProfiles` table | Exists |
| Chart calculation | `src/lib/astrology/chart.ts` | Exists |
| Ephemeris library | `circular-natal-horoscope-js` | Installed |
| Timezone lookup | `geo-tz` | Installed |
| Cosmic context | `src/lib/signal/cosmic-context.ts` | Exists (reusable) |

### New Database Table

**`calendar_journal_entries`** — One entry per user per day

```typescript
// In src/lib/db/schema.ts
export const calendarJournalEntries = pgTable(
  "calendar_journal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    entryDate: date("entry_date", { mode: "date" }).notNull(),
    tz: text("tz"), // IANA timezone at creation
    content: text("content"), // 500 char max
    eventType: text("event_type").notNull().default("note"), // 'reflection' | 'milestone' | 'note'
    cosmicSnapshot: jsonb("cosmic_snapshot"), // { moonPhase, moonSign, sunSign }
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  },
  (table) => [
    unique("calendar_journal_user_date_unique").on(table.userId, table.entryDate),
    index("calendar_journal_user_id_idx").on(table.userId),
    index("calendar_journal_entry_date_idx").on(table.entryDate),
  ]
);

export type CalendarJournalEntry = typeof calendarJournalEntries.$inferSelect;
export type NewCalendarJournalEntry = typeof calendarJournalEntries.$inferInsert;
```

### API Routes

```
GET  /api/calendar/ephemeris?date=YYYY-MM-DD
GET  /api/calendar/ephemeris?start=YYYY-MM-DD&end=YYYY-MM-DD
GET  /api/calendar/transits?date=YYYY-MM-DD
GET  /api/calendar/journal?start=YYYY-MM-DD&end=YYYY-MM-DD&tz=IANA
POST /api/calendar/journal
PATCH /api/calendar/journal/[id]
DELETE /api/calendar/journal/[id]
```

### Feature Flag

Add to `src/env.js`:
```typescript
NEXT_PUBLIC_CALENDAR_ENABLED: z
  .string()
  .transform((val) => val === "true")
  .default("false"),
```

---

## Frontend Design Specification

### Design Philosophy

**Aesthetic Direction:** Celestial Observatory — A refined, atmospheric interface that feels like gazing through an ancient brass telescope into the night sky. The calendar should evoke contemplation, not urgency.

**Key Differentiators:**
- Moon as visual anchor (not just data)
- Atmospheric depth through layered glows and subtle grain
- Temporal rhythm through golden-ratio animations
- Sacred geometry undertones in grid proportions

### Design System Integration

Follow established WavePoint patterns from `globals.css` and existing components:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gold` | `#d4a84b` | Primary accents, active states |
| `--color-copper` | `#b87333` | Secondary accents, journal indicators |
| `--border-gold` | `rgba(212, 168, 75, 0.3)` | Card borders |
| `--glow-gold` | `rgba(212, 168, 75, 0.2)` | Atmospheric effects |
| Font: Display | Cinzel Decorative | Month title |
| Font: Heading | Cormorant Garamond | Day titles, section headers |
| Font: Body | Crimson Pro | Content, labels |

### Month View Design (`/calendar`)

**Layout Structure:**
```
┌─────────────────────────────────────────────┐
│  ◀  JANUARY 2026  ▶           [Today]       │  ← Cinzel Decorative, gold glow
├─────────────────────────────────────────────┤
│  SUN   MON   TUE   WED   THU   FRI   SAT    │  ← Uppercase, tracking-[0.15em]
├─────────────────────────────────────────────┤
│                                             │
│   🌑    🌒    🌒    🌒    🌓    🌓    🌓    │
│   29    30    31     1     2     3     4    │
│         ●                   ●               │  ← Gold/copper indicator dots
│                                             │
│   🌔    🌔    🌕    🌕    🌖    🌖    🌗    │
│    5     6     7     8     9    10    11    │
│   ●●                             ●          │
│                                             │
│   ...                                       │
└─────────────────────────────────────────────┘
```

**Cell Component Styling:**
- Base: `bg-card/20 border border-transparent`
- Hover: `hover:bg-card/40 hover:border-[var(--border-gold)]/20`
- Today: `ring-1 ring-[var(--color-gold)]/40`
- Selected: `bg-[var(--color-gold)]/10 border-[var(--border-gold)]/40`
- Other month: `opacity-40`
- Moon phase with glow: `drop-shadow(0 0 8px ${getMoonPhaseGlow(phase)})`

**Navigation Animation:**
- Month transitions: slide left/right with 0.3s duration
- Use `fadeUpVariants` from animation-config for initial load
- Golden-ratio easing: `[0.4, 0, 0.2, 1]`

### Day View Design (`/calendar/day/[date]`)

**Hero Section (Moon Phase):**
Reuse exact pattern from `dashboard-cosmic-context-card.tsx`:
- Large emoji (text-7xl md:text-8xl)
- Dynamic glow via `getMoonPhaseGlow()`
- Pulsing atmospheric background layers
- Phase name in `font-heading text-xl uppercase tracking-[0.2em] text-[var(--color-gold-bright)]`

**Section Cards:**
```tsx
<div className={cn(
  "rounded-xl border border-[var(--border-gold)]/20 bg-card/40",
  "backdrop-blur-sm p-4 md:p-6"
)}>
  <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
    {sectionTitle}
  </h3>
  {/* Content */}
</div>
```

**Journal Entry Types Visual Styling:**

| Type | Color | Icon | Background |
|------|-------|------|------------|
| Reflection | Purple/Violet | `Sparkles` | `bg-violet-500/10` |
| Milestone | Gold | `Trophy` | `bg-[var(--color-gold)]/10` |
| Note | Muted | `StickyNote` | `bg-card/60` |

### Responsive Behavior

**Breakpoints:**
- Mobile (<640px): Compact cells, emoji only, swipe navigation
- Tablet (640-1024px): Full cells with indicators
- Desktop (>1024px): Generous spacing, hover previews

---

## Navigation Integration

### Sidebar Addition

In `src/components/sidebar/sidebar-nav.tsx`, update PRACTICE_SECTION:
```typescript
import { Radio, Calendar } from "lucide-react";

const PRACTICE_SECTION: NavSection = {
  title: "PRACTICE",
  items: [
    { label: "Signal", href: "/signal", icon: Radio },
    { label: "Calendar", href: "/calendar", icon: Calendar },
  ],
};
```

### URL Structure

```
/calendar                    → Month view (current month)
/calendar?month=2026-01      → Month view (specific month)
/calendar/day/2026-01-26     → Day detail view
```

---

## Transit Calculation Architecture

**New module:** `src/lib/transits/`

### Types

```typescript
export interface Transit {
  transitingPlanet: CelestialBodyId;
  natalPoint: CelestialBodyId | AngleId;
  aspectType: AspectType;
  orb: number;           // Actual orb in degrees
  isExact: boolean;      // Within 1 degree (MVP simplification)
}

export const DEFAULT_TRANSIT_ORBS: TransitOrbs = {
  conjunction: 8,  // Professional astrology standard
  opposition: 8,
  trine: 6,
  square: 6,
  sextile: 4,
  quincunx: 3,
};
```

**Key design decisions:**
- Reuses `calculateCosmicContext()` for current positions
- Uses stored `chartData` from `spiritualProfiles`
- MVP omits `isApplying` and `exactDate` (deferred complexity)
- `isExact: boolean` (orb ≤ 1°) provides "happening now" signal

---

## Implementation Phases

### Phase 1: Foundation ✅

- [x] Add `NEXT_PUBLIC_CALENDAR_ENABLED` to `src/env.js`
- [x] Create `src/lib/calendar/` module (feature-flags, types, schemas)
- [x] Add `calendarJournalEntries` table to schema
- [x] Run `drizzle-kit push`
- [x] Add `canAccessCalendar` to `src/lib/features/access.ts`
- [x] Create `/api/calendar/ephemeris` route
- [x] Create `/calendar` page with marketing fallback

**Verification:** Feature flag works, ephemeris API returns cosmic data ✅

### Phase 2: Month View ✅

- [x] Create `month-view.tsx` grid component
- [x] Create `day-cell.tsx` with indicator dots
- [x] Implement month navigation (prev/next/today)
- [x] Query Signal sightings for indicator dots
- [x] Add moon phase emoji with glow
- [x] Add keyboard navigation

**Verification:** Month renders, moon phases match timeanddate.com ✅

### Phase 3: Day View ✅

- [x] Create `/calendar/day/[date]` page
- [x] Implement `moon-phase-hero.tsx` (reuse dashboard pattern)
- [x] Implement `cosmic-weather.tsx` section
- [x] Implement `sightings-section.tsx`
- [x] Add day cell click → day view navigation

**Verification:** Click any day → see full cosmic context + sightings ✅

### Phase 4: Personal Transits ✅

- [x] Create `src/lib/transits/` module
- [x] Create `/api/calendar/transits` route
- [x] Create `useTransits` hook
- [x] Add `personal-transits.tsx` section
- [x] Add `ProfilePromptCard` for users without profile (made existing component reusable)
- [x] Add sidebar navigation link

**Verification:** User with profile sees transits with professional orbs ✅

### Phase 5: Journal ✅

- [x] Create journal API routes (CRUD)
- [x] Create `useJournalEntries` hook (+ `useJournalEntry`, mutations, map utility)
- [x] Add `journal-section.tsx` to day view
- [x] Add journal indicators to month cells (copper dots)
- [x] Implement journal form with type selector
- [x] Add visual styling for entry types (reflection/milestone/note)

**Verification:** CRUD works; types display distinctly ✅

### Phase 6: Polish

- [x] Add loading skeletons (already in day-view-content, journal-section, personal-transits)
- [x] Add empty states with appropriate copy (sightings, journal, transits sections)
- [x] Add month navigation slide transitions (AnimatePresence in month-view.tsx)
- [x] Mobile swipe gestures for month navigation (touch events with velocity detection)
- [x] Accessibility audit (ARIA labels, keyboard nav, focus-visible rings)
- [ ] Final QA pass on all views

**Verification:** Full end-to-end flow works on all devices

---

## Files to Create

```
src/lib/calendar/
  index.ts                    # Public exports
  feature-flags.ts            # isCalendarEnabled()
  types.ts                    # TypeScript types
  schemas.ts                  # Zod validation

src/lib/transits/
  index.ts                    # Public exports
  types.ts                    # Transit interface, orb config
  calculate.ts                # Core calculation

src/hooks/calendar/
  index.ts                    # Export all hooks
  query-keys.ts               # React Query key factory
  use-ephemeris.ts            # useEphemeris(date), useEphemerisRange()
  use-transits.ts             # useTransits(date)
  use-journal.ts              # Journal CRUD hooks

src/app/calendar/
  page.tsx                    # Month view (or marketing page)
  day/[date]/page.tsx         # Day view
  layout.tsx                  # Auth gate + feature flag check

src/components/calendar/
  index.ts                    # Component exports
  month-view.tsx              # Month grid component
  day-cell.tsx                # Individual day cell
  moon-phase-hero.tsx         # Large moon display
  cosmic-weather.tsx          # Planetary positions section
  personal-transits.tsx       # Natal transit aspects
  journal-section.tsx         # Journal display + form
  sightings-section.tsx       # Day's sightings list
  calendar-marketing-page.tsx # Marketing page when disabled

src/app/api/calendar/
  ephemeris/route.ts          # GET ephemeris data
  transits/route.ts           # GET personal transits
  journal/route.ts            # GET list, POST create
  journal/[id]/route.ts       # PATCH update, DELETE
```

---

## Verification Plan

### Manual Testing

1. **Month View**
   - Navigate to `/calendar` → See current month
   - Moon phases match timeanddate.com
   - Click day → navigates to `/calendar/day/YYYY-MM-DD`
   - Prev/Next buttons change month
   - "Today" button returns to current day
   - Indicator dots appear for sightings/journal entries

2. **Day View**
   - Moon phase hero matches month cell
   - Atmospheric glow animates correctly
   - Planetary positions are reasonable
   - Sightings from Signal appear

3. **Personal Transits**
   - Without profile: Shows `ProfilePromptCard`
   - With profile: Shows relevant transits
   - Professional orbs applied (8° for conjunctions)
   - "Exact" badge appears for tight aspects

4. **Journal**
   - Can create entry with type selector
   - Entry types have distinct visual styling
   - Entry appears in day view
   - Indicator dot appears in month view
   - Can edit and delete

---

## Known Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Ephemeris slow for month range | Low | Pure math (microseconds). Add Redis later if needed. |
| Transit calculation complexity | Medium | MVP omits isApplying/exactDate. Simple orb comparison. |
| Timezone edge cases | Medium | Store `tz` column, use `AT TIME ZONE` in queries |
| Journal type styling | Low | Simple color/icon differentiation per type |

---

## Out of Scope (Future Phases)

- Week view
- Eclipse and retrograde period highlighting
- AI transit interpretations (could be Insight tier)
- Pattern detection ("You see 444 during Saturn transits")
- Push notifications for significant transits
- Calendar export (ICS)
- `isApplying` and `exactDate` for transits
