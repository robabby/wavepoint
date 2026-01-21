# Numbers Section Implementation Plan

Implementation plan for the `/numbers` public content hub using Clean Architecture.

**Status:** Ready for Implementation
**Date:** 2026-01-20
**Architecture:** Clean (Four-Layer)
**Branch:** `sg-numbers-section-design`

**Related Documents:**
- PRD: [`docs/prds/numbers.md`](../prds/numbers.md)
- Design: [`docs/plans/2026-01-20-numbers-section-design.md`](./2026-01-20-numbers-section-design.md)

---

## Architecture Overview

Four distinct layers with clear boundaries:

```
┌─────────────────────────────────────────────────────────────────┐
│                  PRESENTATION                                   │
│  Pages + Components (Server + Client)                          │
│  - /numbers (landing)                                          │
│  - /numbers/[pattern] (detail pages)                           │
│  - Client components for personalization                       │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                  API ROUTES                                     │
│  Public HTTP endpoints for iOS + future clients                │
│  - GET /api/numbers (list patterns)                            │
│  - GET /api/numbers/[pattern] (single pattern)                 │
│  - GET /api/numbers/stats (user stats, authed)                 │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│               BUSINESS LOGIC                                    │
│  Pure functions, domain logic, orchestration                   │
│  - src/lib/numbers/ (core module)                              │
│  - src/lib/content/numbers.ts (MDX loader)                     │
│  - src/hooks/numbers/ (React Query hooks)                      │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                     │
│  Database queries + Signal integration                         │
│  - src/lib/db/queries/numbers.ts                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Feature flag | None — always public | Content hub, no gating needed |
| Hero input | New `NumberHeroInput` component | Different UX from Signal's NumberPad |
| Browse interface | Static sections | Better SEO than tabs |
| Data-only pages | Allowed | Ship fast, add MDX progressively |
| Personalization | Client-side, behind Signal flag | Keeps pages static |
| Signal meanings | Numbers exports `getBaseMeaning()` | Single source of truth |
| 666 handling | Include with reframe, exclude from featured | Complete coverage, mature voice |

---

## File Structure

```
src/lib/numbers/                      # Core module (framework-agnostic)
├── index.ts                          # Public exports
├── types.ts                          # All interfaces + NumberPatternId union
├── data.ts                           # 20 pattern definitions + getBaseMeaning()
├── helpers.ts                        # Query functions
├── categories.ts                     # Category taxonomy
└── component-breakdown.ts            # Fallback logic

src/lib/content/
└── numbers.ts                        # MDX loader

src/lib/db/queries/
└── numbers.ts                        # User stats queries

src/app/api/numbers/
├── route.ts                          # GET /api/numbers
├── [pattern]/route.ts                # GET /api/numbers/[pattern]
└── stats/route.ts                    # GET /api/numbers/stats

src/app/numbers/
├── page.tsx                          # Landing page
└── [pattern]/page.tsx                # Pattern detail page

src/components/numbers/
├── NumberHeroInput.tsx               # Hero input
├── PatternCard.tsx                   # Grid card
├── ComponentBreakdown.tsx            # Fallback UI
└── PersonalizationBadge.tsx          # Client-side stats

src/hooks/numbers/
├── use-patterns.ts                   # React Query hooks
└── use-number-stats.ts               # User stats hook

src/content/numbers/                  # MDX files (progressive)
├── 111.mdx
├── 444.mdx
└── ...
```

---

## Type Definitions

### Core Types (`src/lib/numbers/types.ts`)

```typescript
export const NUMBER_PATTERN_IDS = [
  // Triples
  "111", "222", "333", "444", "555", "666", "777", "888", "999",
  // Quads
  "1111", "2222",
  // Sequential
  "123", "1234", "12345",
  // Mirrored
  "1212", "1221",
  // Doubles
  "11", "22", "33", "44",
] as const;

export type NumberPatternId = (typeof NUMBER_PATTERN_IDS)[number];

export type NumberCategory =
  | "triple"
  | "quad"
  | "sequential"
  | "mirrored"
  | "double";

export interface NumberPattern {
  id: NumberPatternId;
  slug: string;
  category: NumberCategory;
  title: string;              // "New Beginnings & Manifestation"
  essence: string;            // 2-3 words for cards
  meaning: string;            // One paragraph
  keywords: string[];
  related?: NumberPatternId[];
  featured?: boolean;
  excludeFromFeatured?: boolean;
  order: number;
}

export interface CategoryMeta {
  id: NumberCategory;
  label: string;
  pluralLabel: string;
  description: string;
  order: number;
}

export interface ComponentBreakdown {
  number: string;
  components: Array<{
    digit: string;
    meaning: string;
    patternId?: NumberPatternId;
  }>;
  synthesizedMeaning: string;
}
```

---

## Launch Set (20 Patterns)

| Category | Patterns | Count |
|----------|----------|-------|
| Triples | 111, 222, 333, 444, 555, 666, 777, 888, 999 | 9 |
| Quads | 1111, 2222 | 2 |
| Sequential | 123, 1234, 12345 | 3 |
| Mirrored | 1212, 1221 | 2 |
| Doubles | 11, 22, 33, 44 | 4 |

---

## API Endpoints

### GET /api/numbers
List all patterns with optional category filter.

```typescript
// Request
GET /api/numbers?category=triple

// Response
{
  "patterns": [NumberPattern, ...],
  "total": 9
}
```

### GET /api/numbers/[pattern]
Get single pattern with related patterns.

```typescript
// Request
GET /api/numbers/444

// Response
{
  "pattern": NumberPattern,
  "related": [NumberPattern, ...]
}

// 404 if not found
{ "error": "Pattern not found" }
```

### GET /api/numbers/stats (Authenticated)
Get user's personalization stats.

```typescript
// Request
GET /api/numbers/stats
Authorization: Session cookie

// Response
{
  "stats": [
    { "number": "444", "count": 12, "firstSeen": "...", "lastSeen": "..." }
  ],
  "total": 2
}
```

---

## Implementation Phases

### Phase 1: Core Data Layer
**Files:** `src/lib/numbers/{index,types,data,helpers,categories,component-breakdown}.ts`

- [ ] Create `types.ts` with all interfaces and `NumberPatternId` union
- [ ] Create `categories.ts` with category metadata
- [ ] Create `data.ts` with 20 pattern definitions
- [ ] Create `helpers.ts` with query functions
- [ ] Create `component-breakdown.ts` with fallback logic
- [ ] Create `index.ts` with public exports
- [ ] Write unit tests for helpers

### Phase 2: Content Layer
**Files:** `src/lib/content/numbers.ts`

- [ ] Create MDX loader (mirror `patterns.ts` structure)
- [ ] Create `src/content/numbers/` directory
- [ ] Test with placeholder MDX file

### Phase 3: Database Queries
**Files:** `src/lib/db/queries/numbers.ts`

- [ ] Create `getUserNumberStats(userId, pattern)` function
- [ ] Create `getUserAllNumberStats(userId)` function
- [ ] Test queries against `signal_user_number_stats` table

### Phase 4: API Routes
**Files:** `src/app/api/numbers/{route,stats/route,[pattern]/route}.ts`

- [ ] Create GET /api/numbers endpoint
- [ ] Create GET /api/numbers/[pattern] endpoint
- [ ] Create GET /api/numbers/stats endpoint (authenticated)
- [ ] Test endpoints with curl/httpie

### Phase 5: Components
**Files:** `src/components/numbers/{NumberHeroInput,PatternCard,ComponentBreakdown,PersonalizationBadge}.tsx`

- [ ] Create `NumberHeroInput` (text input, Enter to navigate)
- [ ] Create `PatternCard` (reuse AnimatedCard wrapper)
- [ ] Create `ComponentBreakdown` (fallback UI)
- [ ] Create `PersonalizationBadge` (client component, feature-flagged)

### Phase 6: React Query Hooks
**Files:** `src/hooks/numbers/{use-patterns,use-number-stats}.ts`

- [ ] Create `usePatterns(category?)` hook
- [ ] Create `usePattern(pattern)` hook
- [ ] Create `useNumberStats()` hook
- [ ] Create `useNumberStat(pattern)` hook

### Phase 7: Landing Page
**Files:** `src/app/numbers/page.tsx`

- [ ] Hero section with NumberHeroInput
- [ ] Featured patterns grid (excludes 666)
- [ ] Static category sections
- [ ] Signal CTA at bottom
- [ ] SEO metadata

### Phase 8: Pattern Detail Page
**Files:** `src/app/numbers/[pattern]/page.tsx`

- [ ] `generateStaticParams()` for all 20 patterns
- [ ] `generateMetadata()` for SEO
- [ ] Hero with pattern number and title
- [ ] PersonalizationBadge (client island)
- [ ] MDX content OR data-only display
- [ ] Related patterns section
- [ ] Signal CTA
- [ ] ComponentBreakdown fallback for uncovered patterns

### Phase 9: Signal Integration
**Files:** `src/lib/signal/meanings.ts`

- [ ] Update to import `getBaseMeaning` from Numbers
- [ ] Keep fallback for patterns not in Numbers
- [ ] Test interpretation generation

### Phase 10: Initial Content
**Files:** `src/content/numbers/{111,444,555,1111,1234}.mdx`

- [ ] Write 5 high-traffic MDX files
- [ ] Follow template from design doc
- [ ] Test rendering on detail pages

### Phase 11: Navigation & Polish
- [ ] Add Numbers to site header navigation
- [ ] Update `src/util/routes.ts`
- [ ] Add structured data (JSON-LD)
- [ ] Test static generation (`pnpm build`)
- [ ] Accessibility audit

---

## Data Flow

### SEO Entry (Unauthenticated)
```
Google "444 meaning" → /numbers/444 (SSG)
  → getPatternByNumber("444") [server]
  → getNumberContent("444") [server, may be null]
  → Render page
  → PersonalizationBadge hydrates [client]
  → isSignalEnabled() → false → render nothing
```

### Authenticated with Signal
```
/numbers/444 with session
  → Server renders page
  → PersonalizationBadge hydrates [client]
  → isSignalEnabled() → true
  → useNumberStat("444") → fetch /api/numbers/stats
  → Show "You've logged this 5 times"
```

### Uncovered Pattern
```
/numbers/847
  → getPatternByNumber("847") → null
  → generateComponentBreakdown("847")
  → Render ComponentBreakdown
  → Links to /numbers/888, /numbers/44, etc.
```

---

## Testing Checklist

### Unit Tests
- [ ] `getPatternByNumber()` returns correct pattern
- [ ] `getPatternsByCategory()` filters correctly
- [ ] `getFeaturedPatterns()` excludes 666
- [ ] `generateComponentBreakdown()` handles edge cases
- [ ] `getBaseMeaning()` returns meaning or fallback

### Integration Tests
- [ ] API routes return correct responses
- [ ] 404 for invalid patterns
- [ ] Auth required for stats endpoint

### E2E Tests
- [ ] Landing page renders all sections
- [ ] Hero input navigates on Enter
- [ ] Pattern page shows personalization when authenticated
- [ ] ComponentBreakdown shows for uncovered patterns

---

## Success Criteria

- [ ] All 20 patterns accessible at `/numbers/[pattern]`
- [ ] Landing page loads < 2s
- [ ] API endpoints return valid JSON
- [ ] Personalization shows for authenticated Signal users
- [ ] ComponentBreakdown works for uncovered patterns
- [ ] `pnpm check` passes
- [ ] `pnpm build` succeeds
