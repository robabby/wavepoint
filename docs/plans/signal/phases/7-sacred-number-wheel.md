# Phase 7: SacredNumberWheel

**Linear:** *NEW — Create issue SG-XXX*
**Branch:** `sg-XXX-signal-phase-7-sacred-number-wheel`

> **UX Guidelines:**
> - [`docs/ux/design-principles.md`](../../../ux/design-principles.md) — "Quiet Confidence" principle
> - [`docs/ux/interaction-patterns.md`](../../../ux/interaction-patterns.md) — Celebration tiers

## Overview

Add the ritual input mode: SacredNumberWheel. This is the "memorable element" of Signal — a circular digit arrangement evoking ancient divination tools.

**Prerequisites:** Phases 1-6 complete. Signal is fully functional with NumberPad.

## Design Direction

**Concept:** "Celestial Observatory" — receiving signals from the cosmos.

**Visual Identity:**
- Sacred geometry pattern as subtle background texture
- Ethereal gold glow emanating from interactive elements
- Numbers materialize at center like visions appearing
- Digits arranged in a circle (1-9 around, 0 at bottom)

## Tasks

### 1. SacredNumberWheel Component

Create `src/components/signal/sacred-number-wheel.tsx`

Key features:
- Circular digit arrangement (1-9 in circle, 0 at bottom center)
- Sacred geometry SVG background (subtle, non-distracting)
- Center display showing entered number with ethereal glow
- Quick-select chips for common numbers
- Gold glow effect on digit hover/press
- Motion animations for selection feedback

```tsx
// Structure outline
<div className="relative">
  {/* Background sacred geometry SVG */}
  <svg className="absolute inset-0 opacity-10">...</svg>

  {/* Center display */}
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-6xl text-gold glow-effect">{value || "..."}</span>
  </div>

  {/* Circular digit buttons */}
  {digits.map((digit, i) => (
    <button
      key={digit}
      style={{ transform: `rotate(${i * 36}deg) translateY(-120px)` }}
      className="absolute digit-button"
    >
      {digit}
    </button>
  ))}

  {/* Zero at bottom */}
  <button className="absolute bottom-0">0</button>

  {/* Quick select chips */}
  <div className="mt-4 flex gap-2">
    {QUICK_NUMBERS.map(num => (
      <button key={num}>{num}</button>
    ))}
  </div>
</div>
```

See [original planning doc](../../2026-01-18-signal-angel-number-tracking.md#sacred-number-wheel-capture-input) for full implementation reference.

### 2. InputModeToggle Component

Create `src/components/signal/input-mode-toggle.tsx`

Toggle between NumberPad and SacredNumberWheel:
- Two-option toggle (NumberPad | Wheel)
- Subtle styling (not prominent)
- localStorage persistence for user preference

```tsx
"use client";

import { useState, useEffect } from "react";

const INPUT_MODE_KEY = "signal-input-mode";
type InputMode = "pad" | "wheel";

export function useInputMode() {
  const [mode, setMode] = useState<InputMode>("wheel");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(INPUT_MODE_KEY) as InputMode | null;
    if (stored) setMode(stored);
    setIsHydrated(true);
  }, []);

  const setInputMode = (newMode: InputMode) => {
    setMode(newMode);
    localStorage.setItem(INPUT_MODE_KEY, newMode);
  };

  return { mode, setInputMode, isHydrated };
}

export function InputModeToggle() {
  const { mode, setInputMode } = useInputMode();

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => setInputMode("pad")}
        className={mode === "pad" ? "text-gold" : "text-dim"}
      >
        NumberPad
      </button>
      <span className="text-dim">|</span>
      <button
        onClick={() => setInputMode("wheel")}
        className={mode === "wheel" ? "text-gold" : "text-dim"}
      >
        Wheel
      </button>
    </div>
  );
}
```

### 3. Update Capture Page

Update `src/app/signal/capture/page.tsx` to:
- Import InputModeToggle and both input components
- Render toggle at top of capture area
- Conditionally render NumberPad or SacredNumberWheel based on mode

```tsx
"use client";

import { useInputMode, InputModeToggle } from "@/components/signal/input-mode-toggle";
import { NumberPad } from "@/components/signal/number-pad";
import { SacredNumberWheel } from "@/components/signal/sacred-number-wheel";

export function CaptureInput({ onSubmit }: { onSubmit: (number: string) => void }) {
  const { mode, isHydrated } = useInputMode();

  if (!isHydrated) return <SacredSpinner />;

  return (
    <div>
      <InputModeToggle />
      {mode === "pad" ? (
        <NumberPad onSubmit={onSubmit} />
      ) : (
        <SacredNumberWheel onSubmit={onSubmit} />
      )}
    </div>
  );
}
```

## Component Checklist

| Component | File | Status |
|-----------|------|--------|
| SacredNumberWheel | `sacred-number-wheel.tsx` | ☐ |
| InputModeToggle | `input-mode-toggle.tsx` | ☐ |

## Verification

- [ ] SacredNumberWheel renders with circular digit layout
- [ ] Sacred geometry background SVG displays correctly
- [ ] Center display shows entered number with glow
- [ ] Quick-select chips work
- [ ] Digit buttons are clickable and provide feedback
- [ ] InputModeToggle switches between modes
- [ ] Mode preference persists across page refreshes
- [ ] Animations are smooth (no jank)
- [ ] Component follows "Quiet Confidence" principle
- [ ] `pnpm check` passes

## Animation Guidelines

Follow [interaction-patterns.md](../../../ux/interaction-patterns.md) for animation:
- **Micro (button states):** 100-150ms
- **Small (reveals):** 200-300ms
- **Easing:** ease-out for entrances

Avoid:
- Bounce effects (too playful)
- Long delays
- Motion that blocks interaction

## Dependencies

**Install:** None (Motion already installed)

**Requires:** Phase 6 complete (full working Signal with NumberPad)

## Next Phase

[Phase 8: Testing & Polish](./8-testing-polish.md) — Tests and final verification
