# Phase 4: UI Components

**Linear:** [SG-289](https://linear.app/sherpagg/issue/SG-289)
**Branch:** `sg-289-signal-phase-4-ui-components`

> **UX Guidelines:**
> - [`docs/ux/interaction-patterns.md`](../../../ux/interaction-patterns.md) — Empty states, loading, celebrations
> - [`docs/ux/voice-and-tone.md`](../../../ux/voice-and-tone.md) — UI copy style
> - [`docs/ux/design-principles.md`](../../../ux/design-principles.md) — Visual decisions

## Overview

Create core UI components for Signal. SacredNumberWheel and InputModeToggle are deferred to Phase 7.

**Design Direction:** "Refined Observatory" — a precision instrument for receiving cosmic signals. See [components.md](../components.md) for full specs with integrated design notes.

## Tasks

### 1. NumberPad (Quick Entry)

Create `src/components/signal/number-pad.tsx`

See [components.md](../components.md#numberpad) for full implementation with design notes.

**Functional requirements:**
- Traditional 3x3 + 0 grid layout
- Quick-select buttons for common numbers (111, 222, 333, etc.)
- Display area showing entered number
- Clear and backspace controls
- Submit button

**Design requirements:**
- [ ] Number display with radial gradient glow when value exists
- [ ] Animated placeholder dots (breathing effect)
- [ ] Digit entry animation (scale + fade)
- [ ] `tabular-nums` for consistent digit width
- [ ] Grid container with subtle gold border frame
- [ ] Digit buttons: `whileTap={{ scale: 0.95 }}` press animation
- [ ] Quick-select chips: staggered entrance, selection glow state
- [ ] Utility buttons (Clear/Backspace): copper accent, dimmer styling

### 2. MoodSelector

Create `src/components/signal/mood-selector.tsx`

See [components.md](../components.md#moodselector) for full implementation.

**Functional requirements:**
- 6 mood options with emoji icons
- Multi-select (up to 3)
- Visual feedback for selection
- Optional (can skip)

**Design requirements:**
- [ ] Staggered entrance animation (50ms delay)
- [ ] Selection ring animation (not checkmark badge)
- [ ] Labels: `font-heading tracking-wide uppercase text-xs`
- [ ] Skip option: understated text button below grid

### 3. SacredSpinner

Create `src/components/signal/sacred-spinner.tsx`

See [components.md](../components.md#sacredspinner) for implementation.

**Design requirements:**
- [ ] 3-second rotation (slow, meditative)
- [ ] Simple geometric form: outer ring with orbiting dot
- [ ] Size variants: sm (16px), md (24px), lg (40px)
- [ ] Optional label in dim color

### 4. SubmitButton

Create `src/components/signal/submit-button.tsx`

See [components.md](../components.md#submitbutton) for implementation.

**Design requirements:**
- [ ] Loading state: SacredSpinner + "Receiving..." text
- [ ] Disabled: warm charcoal background, dim text
- [ ] Active: full gold, hover brightens to gold-bright
- [ ] Subtle scale: `whileHover={{ scale: 1.01 }}`, `whileTap={{ scale: 0.98 }}`

### 5. InterpretationCard

Create `src/components/signal/interpretation-card.tsx`

See [components.md](../components.md#interpretationcard) for implementation.

**Design requirements:**
- [ ] Loading: centered SacredSpinner with "Receiving..." below
- [ ] Content entrance: fade + upward motion (y: 10 → 0)
- [ ] Fallback indicator: subtle dim text
- [ ] Regenerate: text button, not prominent CTA

### 6. SightingCard

Create `src/components/signal/sighting-card.tsx`

See [components.md](../components.md#sightingcard) for implementation.

**Design requirements:**
- [ ] Hover scale (1.02) and press (0.98)
- [ ] Number in gold display font
- [ ] Count badge only for repeat sightings (count > 1)
- [ ] Border brightens on hover

### 7. CollectionGrid

Create `src/components/signal/collection-grid.tsx`

See [components.md](../components.md#collectiongrid) for implementation.

**Design requirements:**
- [ ] Staggered card entrance (50ms delay)
- [ ] Empty state with faint SeedOfLife icon
- [ ] Empty state copy: "No signals captured yet" / "The universe is patient."

### 8. FirstCatchCelebration

Create `src/components/signal/first-catch-celebration.tsx`

See [components.md](../components.md#firstcatchcelebration) for implementation.

**Design requirements:**
- [ ] 24 particles with palette colors (gold, gold-bright, copper, bronze)
- [ ] Particles burst outward, fade while drifting down
- [ ] Badge reveals after 800ms with spring animation
- [ ] "First Catch" badge + number + "Tap anywhere to continue"
- [ ] Full-screen overlay, dismissible on tap

### 9. Step Transitions (Capture Flow)

Implement step transitions in capture page (Phase 5), but prepare pattern here.

**Design requirements:**
- [ ] AnimatePresence with `mode="wait"`
- [ ] Enter: `opacity: 0, x: 20` → `opacity: 1, x: 0`
- [ ] Exit: `opacity: 0, x: -20`
- [ ] Duration: 250ms with easeInOut
- [ ] StepIndicator component with expanding dot for current step

### 10. Background Treatment

Create `src/components/signal/signal-background.tsx`

**Design requirements:**
- [ ] Faint SeedOfLife at 2% opacity, centered
- [ ] "Receiving" variant: slow pulse animation (0.02 → 0.04 → 0.02 over 4s)

## Component Checklist

| Component | File | Functional | Design |
|-----------|------|------------|--------|
| NumberPad | `number-pad.tsx` | ☐ | ☐ |
| MoodSelector | `mood-selector.tsx` | ☐ | ☐ |
| SacredSpinner | `sacred-spinner.tsx` | ☐ | ☐ |
| SubmitButton | `submit-button.tsx` | ☐ | ☐ |
| InterpretationCard | `interpretation-card.tsx` | ☐ | ☐ |
| SightingCard | `sighting-card.tsx` | ☐ | ☐ |
| CollectionGrid | `collection-grid.tsx` | ☐ | ☐ |
| FirstCatchCelebration | `first-catch-celebration.tsx` | ☐ | ☐ |
| StepIndicator | `step-indicator.tsx` | ☐ | ☐ |
| SignalBackground | `signal-background.tsx` | ☐ | ☐ |

**Deferred to Phase 7:**
- SacredNumberWheel
- InputModeToggle

## Animation Guidelines

| Transition Type | Duration |
|-----------------|----------|
| Micro (buttons) | 100-150ms |
| Small (reveals) | 200-300ms |
| Medium (modals) | 300-400ms |
| Stagger delay | 50ms between items |

**Easing:**
- Entrances: `easeOut`
- Exits: `easeIn`
- Movement: `easeInOut`

## Verification

**Functional:**
- [ ] All components render without errors
- [ ] NumberPad accepts digit input correctly
- [ ] NumberPad quick-select buttons work
- [ ] MoodSelector limits to 3 selections
- [ ] InterpretationCard shows loading and content states
- [ ] SightingCard displays all required info
- [ ] CollectionGrid shows empty state when no sightings
- [ ] FirstCatchCelebration animates and dismisses

**Design:**
- [ ] Number display glows when value present
- [ ] Placeholder dots animate smoothly
- [ ] Button press animations feel responsive (100ms)
- [ ] Staggered entrances complete within 350ms for 7 items
- [ ] MoodSelector ring appears smoothly on selection
- [ ] FirstCatch particles use palette colors only
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Components follow UX guidelines
- [ ] `pnpm check` passes

## Dependencies

**Install:** None (Motion already installed)

**Requires:** Phase 3 complete (hooks for data)

## Next Phase

[Phase 5: Pages](./5-pages.md) — Create Signal pages (capture, collection, detail)
