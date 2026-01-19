# Phase 4: UI Components

**Linear:** [SG-289](https://linear.app/sherpagg/issue/SG-289)
**Branch:** `sg-289-signal-phase-4-ui-components`

> **UX Guidelines:**
> - [`docs/ux/interaction-patterns.md`](../../../ux/interaction-patterns.md) — Empty states, loading, celebrations
> - [`docs/ux/voice-and-tone.md`](../../../ux/voice-and-tone.md) — UI copy style
> - [`docs/ux/design-principles.md`](../../../ux/design-principles.md) — Visual decisions

## Overview

Create all UI components for Signal. This is the largest phase.

## Tasks

### 1. NumberPad (Quick Entry)

Create `src/components/signal/number-pad.tsx`

See [components.md](../components.md#numberpad) for implementation.

### 2. SacredNumberWheel (Ritual Experience)

Create `src/components/signal/sacred-number-wheel.tsx`

See [components.md](../components.md#sacrednumberwheel) for implementation reference.

Key features:
- Circular digit arrangement
- Sacred geometry SVG background
- Glow effects on interaction
- Motion animations

### 3. InputModeToggle

Create `src/components/signal/input-mode-toggle.tsx`

Toggle between NumberPad and SacredNumberWheel with localStorage persistence.

### 4. MoodSelector

Create `src/components/signal/mood-selector.tsx`

See [components.md](../components.md#moodselector) for implementation.

### 5. InterpretationCard

Create `src/components/signal/interpretation-card.tsx`

Display AI interpretation with:
- Typing animation effect
- Regenerate button
- Model indicator (for debugging)

### 6. SightingCard

Create `src/components/signal/sighting-card.tsx`

Collection item card showing:
- Number (prominent)
- Count badge
- Timestamp
- Mood tags (if present)

### 7. CollectionGrid

Create `src/components/signal/collection-grid.tsx`

Grid of SightingCards with:
- Stats summary header
- Empty state (see UX guidelines)
- Filter by number

### 8. FirstCatchCelebration

Create `src/components/signal/first-catch-celebration.tsx`

Particle animation for first-time number catches:
- Gold particles
- Confetti effect
- Auto-dismiss after animation

### 9. SacredSpinner

Create `src/components/signal/sacred-spinner.tsx`

Loading indicator with sacred geometry styling.

## Component Checklist

| Component | File | Status |
|-----------|------|--------|
| NumberPad | `number-pad.tsx` | ☐ |
| SacredNumberWheel | `sacred-number-wheel.tsx` | ☐ |
| InputModeToggle | `input-mode-toggle.tsx` | ☐ |
| MoodSelector | `mood-selector.tsx` | ☐ |
| InterpretationCard | `interpretation-card.tsx` | ☐ |
| SightingCard | `sighting-card.tsx` | ☐ |
| CollectionGrid | `collection-grid.tsx` | ☐ |
| FirstCatchCelebration | `first-catch-celebration.tsx` | ☐ |
| SacredSpinner | `sacred-spinner.tsx` | ☐ |

## Verification

- [ ] All components render without errors
- [ ] NumberPad accepts digit input correctly
- [ ] SacredNumberWheel has proper circular layout
- [ ] Input mode toggle persists to localStorage
- [ ] MoodSelector limits to 3 selections
- [ ] CollectionGrid shows empty state when no sightings
- [ ] FirstCatchCelebration animates smoothly
- [ ] Components follow UX guidelines
- [ ] `pnpm check` passes

## Dependencies

**Install:** None (Motion already installed)

**Requires:** Phase 3 complete (hooks for data)

## Next Phase

[Phase 5: Pages](./5-pages.md) — Create Signal pages
