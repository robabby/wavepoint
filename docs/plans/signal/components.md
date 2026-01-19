# Signal UI Components

UI components for Signal feature.

> **Related:** [hooks.md](./hooks.md) | [README.md](./README.md)
>
> **UX Guidelines:**
> - [`docs/ux/interaction-patterns.md`](../../ux/interaction-patterns.md) — Empty states, loading, celebrations
> - [`docs/ux/voice-and-tone.md`](../../ux/voice-and-tone.md) — UI copy style
> - [`docs/ux/design-principles.md`](../../ux/design-principles.md) — Visual design decisions

## Components Overview

| Component | Purpose | Phase |
|-----------|---------|-------|
| `NumberPad` | Traditional grid input (quick entry) | 4 |
| `SacredNumberWheel` | Circular digit input (ritual experience) | 4 |
| `InputModeToggle` | Switch between input modes | 4 |
| `MoodSelector` | Mood tag selection | 4 |
| `InterpretationCard` | Display AI interpretation | 4 |
| `SightingCard` | Collection item display | 4 |
| `CollectionGrid` | Grid of sightings | 4 |
| `FirstCatchCelebration` | First-catch particle animation | 4 |
| `SacredSpinner` | Loading indicator | 4 |

## Design Direction: "Celestial Observatory"

**Concept:** Receiving signals from the cosmos. The interface feels like a personal divination tool.

**Visual Identity:**
- Sacred geometry patterns as subtle background textures
- Ethereal gold glows emanating from interactive elements
- Numbers materialize at the center like visions appearing
- Soft particle effects for celebrations

**Memorable Element:** The **Sacred Number Wheel** — circular digit arrangement evoking ancient divination tools.

---

## NumberPad

Traditional grid input optimized for quick entry.

```tsx
// src/components/signal/number-pad.tsx
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_NUMBERS = ["111", "222", "333", "444", "555", "1111", "1212"];

interface NumberPadProps {
  onSubmit: (number: string) => void;
  disabled?: boolean;
}

export function NumberPad({ onSubmit, disabled }: NumberPadProps) {
  const [value, setValue] = useState("");

  const handleDigit = useCallback((digit: string) => {
    setValue((prev) => (prev.length < 10 ? prev + digit : prev));
  }, []);

  const handleClear = useCallback(() => setValue(""), []);
  const handleBackspace = useCallback(() => setValue((prev) => prev.slice(0, -1)), []);
  const handleQuickSelect = useCallback((number: string) => setValue(number), []);

  const handleSubmit = useCallback(() => {
    if (value.length > 0) onSubmit(value);
  }, [value, onSubmit]);

  return (
    <div className="space-y-6">
      {/* Display */}
      <div className="text-center">
        <span className="font-display text-6xl text-[var(--color-gold)]">
          {value || "..."}
        </span>
      </div>

      {/* Quick select */}
      <div className="flex flex-wrap justify-center gap-2">
        {QUICK_NUMBERS.map((num) => (
          <Button
            key={num}
            variant="outline"
            size="sm"
            onClick={() => handleQuickSelect(num)}
            disabled={disabled}
            className={cn(
              "border-[var(--border-gold)]/30 text-[var(--color-cream)]",
              "hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
            )}
          >
            {num}
          </Button>
        ))}
      </div>

      {/* Number pad grid */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Button
            key={digit}
            variant="outline"
            size="lg"
            onClick={() => handleDigit(String(digit))}
            disabled={disabled}
            className={cn(
              "h-16 text-2xl font-display",
              "border-[var(--border-gold)]/30 text-[var(--color-cream)]",
              "hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
            )}
          >
            {digit}
          </Button>
        ))}
        <Button variant="outline" size="lg" onClick={handleClear} disabled={disabled}
          className="h-16 text-sm border-[var(--border-gold)]/30 text-[var(--color-dim)]">
          Clear
        </Button>
        <Button variant="outline" size="lg" onClick={() => handleDigit("0")} disabled={disabled}
          className="h-16 text-2xl font-display border-[var(--border-gold)]/30 text-[var(--color-cream)]">
          0
        </Button>
        <Button variant="outline" size="lg" onClick={handleBackspace} disabled={disabled}
          className="h-16 text-sm border-[var(--border-gold)]/30 text-[var(--color-dim)]">
          ←
        </Button>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={disabled || value.length === 0}
        className={cn(
          "w-full h-14 text-lg",
          "bg-[var(--color-gold)] text-[var(--color-obsidian)]",
          "hover:bg-[var(--color-gold-bright)]"
        )}
      >
        Continue
      </Button>
    </div>
  );
}
```

---

## MoodSelector

Mood tag selection with ethereal orb styling.

```tsx
// src/components/signal/mood-selector.tsx
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const MOODS = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "energized", emoji: "⚡", label: "Energized" },
  { id: "reflective", emoji: "🤔", label: "Reflective" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "inspired", emoji: "✨", label: "Inspired" },
];

interface MoodSelectorProps {
  selected: string[];
  onChange: (moods: string[]) => void;
  disabled?: boolean;
}

export function MoodSelector({ selected, onChange, disabled }: MoodSelectorProps) {
  const toggleMood = (moodId: string) => {
    if (selected.includes(moodId)) {
      onChange(selected.filter((m) => m !== moodId));
    } else if (selected.length < 3) {
      onChange([...selected, moodId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-heading text-lg text-[var(--color-cream)]">
          What energy surrounds this moment?
        </p>
        <p className="mt-1 text-sm text-[var(--color-dim)]">
          Select up to 3 (optional)
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood, index) => {
          const isSelected = selected.includes(mood.id);
          return (
            <motion.button
              key={mood.id}
              onClick={() => toggleMood(mood.id)}
              disabled={disabled || (!isSelected && selected.length >= 3)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative flex flex-col items-center gap-1 rounded-2xl p-3",
                "transition-all duration-300",
                isSelected ? "bg-[var(--color-gold)]/10" : "hover:bg-[var(--color-warm-charcoal)]",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className={cn(
                "text-xs transition-colors",
                isSelected ? "text-[var(--color-gold)]" : "text-[var(--color-dim)]"
              )}>
                {mood.label}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] text-[var(--color-obsidian)]"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
```

---

## CollectionGrid Empty State

> **Pattern Reference:** See [`docs/ux/interaction-patterns.md`](../../ux/interaction-patterns.md) for empty state guidelines

```tsx
// Empty state within CollectionGrid
if (stats.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 text-6xl opacity-30">✨</div>
      <h3 className="font-heading text-xl text-[var(--color-cream)]">
        No signals captured yet
      </h3>
      <p className="mt-2 max-w-sm text-[var(--color-dim)]">
        The universe is waiting to send you messages.
        Capture your first angel number to begin your journey.
      </p>
    </div>
  );
}
```

---

## SacredNumberWheel

Full implementation in [original planning doc](../2026-01-18-signal-angel-number-tracking.md#sacred-number-wheel-capture-input) — circular digit arrangement with sacred geometry background, glow effects, and animation.

Key features:
- Digits 1-9 arranged in circle, 0 at bottom
- Center display with ethereal glow
- Quick-select chips for common numbers
- Sacred geometry SVG background pattern

---

## Additional Components

See the [original planning doc](../2026-01-18-signal-angel-number-tracking.md#uiux-design---iteration-1) for full implementations of:

- **InterpretationCard** — Displays AI interpretation with typing animation
- **SightingCard** — Collection item with number, count badge, timestamp
- **CollectionGrid** — Full grid with stats summary and filtering
- **FirstCatchCelebration** — Particle animation for first-time number catches
- **SacredSpinner** — Loading indicator with sacred geometry styling

## Input Mode Persistence

Store user preference in localStorage:

```typescript
const INPUT_MODE_KEY = "signal-input-mode";

export function useInputMode() {
  const [mode, setMode] = useState<"pad" | "wheel">(() => {
    if (typeof window === "undefined") return "wheel";
    return (localStorage.getItem(INPUT_MODE_KEY) as "pad" | "wheel") || "wheel";
  });

  const setInputMode = (newMode: "pad" | "wheel") => {
    setMode(newMode);
    localStorage.setItem(INPUT_MODE_KEY, newMode);
  };

  return { mode, setInputMode };
}
```
