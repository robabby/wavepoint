# Signal Implementation Plan

Angel number logging with AI-powered interpretations.

> **PRD:** [`docs/prds/signal.md`](../../prds/signal.md) — Scope, decisions, user journeys, success metrics
>
> **UX Guidelines:** [`docs/ux/`](../../ux/) — Personas, voice & tone, interaction patterns

## Status

**Ready for Implementation**

| Phase | Linear Issue | Status |
|-------|--------------|--------|
| 1. Foundation | [SG-286](https://linear.app/sherpagg/issue/SG-286) | Not Started |
| 2. Data Layer | [SG-287](https://linear.app/sherpagg/issue/SG-287) | Not Started |
| 3. Hooks & State | [SG-288](https://linear.app/sherpagg/issue/SG-288) | Not Started |
| 4. UI Components | [SG-289](https://linear.app/sherpagg/issue/SG-289) | Not Started |
| 5. Pages | [SG-290](https://linear.app/sherpagg/issue/SG-290) | Not Started |
| 6. Integration | [SG-291](https://linear.app/sherpagg/issue/SG-291) | Not Started |
| 7. Testing & Polish | [SG-292](https://linear.app/sherpagg/issue/SG-292) | Not Started |

**Epic:** [SG-285](https://linear.app/sherpagg/issue/SG-285)

## Overview

Signal lets authenticated users capture angel number sightings and receive AI-powered interpretations. Integrated as a feature module within the existing sacred-geometry application.

**Core Value:** Transform fleeting angel number moments into a personal spiritual record with meaningful AI interpretations.

## Architecture

### File Structure

```
src/
├── app/
│   ├── api/signal/
│   │   ├── sightings/
│   │   │   ├── route.ts           # POST (create), GET (list)
│   │   │   └── [id]/route.ts      # GET (single), DELETE
│   │   ├── interpret/route.ts     # POST (regenerate interpretation)
│   │   └── stats/route.ts         # GET (user stats)
│   └── signal/
│       ├── layout.tsx             # Auth + feature flag guard
│       ├── page.tsx               # Dashboard/collection
│       ├── capture/page.tsx       # Capture flow
│       └── sighting/[id]/page.tsx # Single sighting detail
├── components/signal/
│   ├── number-pad.tsx             # Traditional grid input (quick entry)
│   ├── sacred-number-wheel.tsx    # Circular digit input (ritual experience)
│   ├── input-mode-toggle.tsx      # Toggle between NumberPad/Wheel
│   ├── mood-selector.tsx          # Mood tag chips
│   ├── interpretation-card.tsx    # AI interpretation display
│   ├── sighting-card.tsx          # Collection item card
│   ├── collection-grid.tsx        # Grid of sightings
│   ├── first-catch-celebration.tsx # First-catch particle animation
│   └── sacred-spinner.tsx         # Loading indicator
├── hooks/signal/
│   ├── index.ts                   # Barrel export
│   ├── use-sightings.ts           # SWR: list + mutations
│   ├── use-stats.ts               # SWR: user statistics
│   └── use-interpretation.ts      # SWR: regenerate mutation
└── lib/signal/
    ├── schemas.ts                 # Zod validation (mood whitelist)
    ├── types.ts                   # TypeScript interfaces
    ├── meanings.ts                # Base angel number meanings
    ├── feature-flags.ts           # isSignalEnabled()
    └── claude.ts                  # Claude API client (timeout/fallback)
```

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | MC feature module | Shares auth, infrastructure |
| Database | Drizzle + Neon | Aligns with existing auth/address tables |
| AI | Claude API (Anthropic SDK) | Haiku for speed, Sonnet for depth |
| Feature Flag | `NEXT_PUBLIC_SIGNAL_ENABLED` | Consistent with shop feature flag pattern |
| URL Structure | `/signal` (top-level) | Simple, memorable, like `/shop` |
| Navigation | User menu dropdown | Only visible to authenticated users |
| Animations | Motion (v12) | Already installed; full animation support |
| Input modes | Both NumberPad + SacredNumberWheel | Quick entry AND ritual experience |
| Interpretation regeneration | Upsert (overwrite) | Simpler schema, history not needed for v1 |

## Environment Variables

Add to `src/env.js`:

```javascript
server: {
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
},
client: {
  NEXT_PUBLIC_SIGNAL_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
},
```

## Dependencies

| Dependency | Purpose | Phase |
|------------|---------|-------|
| `@anthropic-ai/sdk` | Claude API client | Phase 2 |
| `swr` | Data fetching hooks | Phase 3 |

**Blocking Dependencies:**
- Auth system ✅ (complete)
- Invite system (optional - gates account creation, not Signal access)

## Documentation Index

### Reference Docs (What to Build)

| Doc | Contents |
|-----|----------|
| [schema.md](./schema.md) | Database tables, indexes, relations |
| [api.md](./api.md) | API endpoints with full implementations |
| [components.md](./components.md) | UI component specifications and code |
| [hooks.md](./hooks.md) | SWR hooks for data fetching |
| [claude.md](./claude.md) | Claude API integration, prompts, fallbacks |

### Phase Docs (How to Build It)

| Phase | Doc | Linear |
|-------|-----|--------|
| 1 | [phases/1-foundation.md](./phases/1-foundation.md) | [SG-286](https://linear.app/sherpagg/issue/SG-286) |
| 2 | [phases/2-data-layer.md](./phases/2-data-layer.md) | [SG-287](https://linear.app/sherpagg/issue/SG-287) |
| 3 | [phases/3-hooks-state.md](./phases/3-hooks-state.md) | [SG-288](https://linear.app/sherpagg/issue/SG-288) |
| 4 | [phases/4-ui-components.md](./phases/4-ui-components.md) | [SG-289](https://linear.app/sherpagg/issue/SG-289) |
| 5 | [phases/5-pages.md](./phases/5-pages.md) | [SG-290](https://linear.app/sherpagg/issue/SG-290) |
| 6 | [phases/6-integration.md](./phases/6-integration.md) | [SG-291](https://linear.app/sherpagg/issue/SG-291) |
| 7 | [phases/7-testing-polish.md](./phases/7-testing-polish.md) | [SG-292](https://linear.app/sherpagg/issue/SG-292) |

## v1 Scope Summary

**In Scope:**
- Quick number capture (3-tap flow)
- Optional context: mood tags + brief note
- Base AI interpretation with context awareness
- Simple collection view (grid of captured numbers)
- First-catch celebration
- Sighting count per number

**Deferred to v2+:**
- Pattern reports / deep analysis
- Advanced gamification (streaks, achievements)
- Push notifications
- PWA offline support
- Public sighting sharing

---

**Historical Reference:** The original monolithic plan is preserved at [`../2026-01-18-signal-angel-number-tracking.md`](../2026-01-18-signal-angel-number-tracking.md)
