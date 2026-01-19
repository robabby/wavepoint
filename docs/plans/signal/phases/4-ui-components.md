# Phase 4: UI Components

**Linear:** [SG-289](https://linear.app/sherpagg/issue/SG-289)
**Branch:** `sg-289-signal-phase-4-ui-components`

> **UX Guidelines:**
> - [`docs/ux/interaction-patterns.md`](../../../ux/interaction-patterns.md) — Empty states, loading, celebrations
> - [`docs/ux/voice-and-tone.md`](../../../ux/voice-and-tone.md) — UI copy style
> - [`docs/ux/design-principles.md`](../../../ux/design-principles.md) — Visual decisions

## Overview

Create core UI components for Signal. SacredNumberWheel and InputModeToggle are deferred to Phase 7.

## Tasks

### 1. NumberPad (Quick Entry)

Create `src/components/signal/number-pad.tsx`

See [components.md](../components.md#numberpad) for implementation.

Key features:
- Traditional 3x3 + 0 grid layout
- Quick-select buttons for common numbers (111, 222, 333, etc.)
- Display area showing entered number
- Clear and backspace controls
- Submit button

### 2. MoodSelector

Create `src/components/signal/mood-selector.tsx`

See [components.md](../components.md#moodselector) for implementation.

Key features:
- 6 mood options with emoji icons
- Multi-select (up to 3)
- Visual feedback for selection
- Optional (can skip)

### 3. InterpretationCard

Create `src/components/signal/interpretation-card.tsx`

Display AI interpretation with:
- Interpretation text
- Regenerate button with loading state
- "Receiving..." state during generation
- Fallback indicator (if AI failed)

### 4. SightingCard

Create `src/components/signal/sighting-card.tsx`

Collection item card showing:
- Number (prominent, gold accent)
- Count badge (e.g., "3rd sighting")
- Timestamp (relative: "2 hours ago")
- Mood tags (if present)
- Click to view detail

### 5. CollectionGrid

Create `src/components/signal/collection-grid.tsx`

Grid of SightingCards with:
- Stats summary header (total sightings, unique numbers)
- Empty state (see UX guidelines)
- Filter by number (dropdown or chips)
- Responsive grid layout

### 6. FirstCatchCelebration

Create `src/components/signal/first-catch-celebration.tsx`

Celebration overlay for first-time number catches:
- Full-screen dismissible overlay
- Gold particle burst animation
- "First Catch" badge with the number
- Brief pause before revealing interpretation
- Tap anywhere to continue

### 7. SacredSpinner

Create `src/components/signal/sacred-spinner.tsx`

Loading indicator with sacred geometry styling:
- Rotating geometric form (e.g., Seed of Life)
- Optional "Receiving..." text
- Sized variants (sm, md, lg)

## Component Checklist

| Component | File | Status |
|-----------|------|--------|
| NumberPad | `number-pad.tsx` | ☐ |
| MoodSelector | `mood-selector.tsx` | ☐ |
| InterpretationCard | `interpretation-card.tsx` | ☐ |
| SightingCard | `sighting-card.tsx` | ☐ |
| CollectionGrid | `collection-grid.tsx` | ☐ |
| FirstCatchCelebration | `first-catch-celebration.tsx` | ☐ |
| SacredSpinner | `sacred-spinner.tsx` | ☐ |

**Deferred to Phase 7:**
- SacredNumberWheel
- InputModeToggle

## Verification

- [ ] All components render without errors
- [ ] NumberPad accepts digit input correctly
- [ ] NumberPad quick-select buttons work
- [ ] MoodSelector limits to 3 selections
- [ ] InterpretationCard shows loading and content states
- [ ] SightingCard displays all required info
- [ ] CollectionGrid shows empty state when no sightings
- [ ] CollectionGrid filter works correctly
- [ ] FirstCatchCelebration animates smoothly
- [ ] SacredSpinner renders at all sizes
- [ ] Components follow UX guidelines
- [ ] `pnpm check` passes

## Dependencies

**Install:** None (Motion already installed)

**Requires:** Phase 3 complete (hooks for data)

## Next Phase

[Phase 5: Pages](./5-pages.md) — Create Signal pages (capture, collection, detail)
