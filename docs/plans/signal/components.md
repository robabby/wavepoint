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
| `MoodSelector` | Mood tag selection | 4 |
| `InterpretationCard` | Display AI interpretation | 4 |
| `SightingCard` | Collection item display | 4 |
| `CollectionGrid` | Grid of sightings | 4 |
| `FirstCatchCelebration` | First-catch particle animation | 4 |
| `SacredSpinner` | Loading indicator | 4 |
| `SacredNumberWheel` | Circular digit input (ritual experience) | 7 |
| `InputModeToggle` | Switch between input modes | 7 |

## Design Direction: "Refined Observatory"

**Concept:** A precision instrument for receiving cosmic signals. Think brass astrolabe meets modern radio telescope.

**Visual Identity:**
- Sacred geometry patterns as subtle background textures
- Gold glows that feel earned, not excessive
- Numbers materialize at the center like signals arriving
- Animations that are satisfying but not distracting

**Core Principle:** Quiet Confidence — if everything glows, nothing feels special.

---

## NumberPad

Traditional grid input optimized for quick entry.

### Functional Spec

```tsx
// src/components/signal/number-pad.tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      <NumberDisplay value={value} />

      {/* Quick select */}
      <QuickSelectChips
        numbers={QUICK_NUMBERS}
        currentValue={value}
        onSelect={handleQuickSelect}
        disabled={disabled}
      />

      {/* Number pad grid */}
      <div className="relative rounded-2xl border border-[var(--border-gold)]/20 p-4 bg-[var(--color-warm-charcoal)]/30">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />

        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <DigitButton
              key={digit}
              digit={String(digit)}
              onClick={() => handleDigit(String(digit))}
              disabled={disabled}
            />
          ))}
          <UtilityButton onClick={handleClear} disabled={disabled}>
            Clear
          </UtilityButton>
          <DigitButton digit="0" onClick={() => handleDigit("0")} disabled={disabled} />
          <UtilityButton onClick={handleBackspace} disabled={disabled}>
            ←
          </UtilityButton>
        </div>
      </div>

      {/* Submit */}
      <SubmitButton
        onClick={handleSubmit}
        disabled={disabled || value.length === 0}
      />
    </div>
  );
}
```

### Design Notes

**Number Display (focal point):**
- Add radial gradient backdrop when value exists (signal materialization)
- Animated placeholder dots (breathing effect, suggests awaiting signal)
- Digit entry animation: subtle scale + fade on each character
- Use `tabular-nums` for consistent digit width
- Add subtle `text-shadow: 0 0 40px var(--glow-gold)` for depth

```tsx
function NumberDisplay({ value }: { value: string }) {
  return (
    <div className="relative text-center py-4">
      {/* Ambient glow - only visible when value exists */}
      {value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
            transform: 'scale(2)',
          }}
        />
      )}
      <AnimatePresence mode="wait">
        {value ? (
          <motion.span
            key={value}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="font-display text-6xl text-[var(--color-gold)] tabular-nums tracking-wide"
            style={{ textShadow: '0 0 40px var(--glow-gold)' }}
          >
            {value}
          </motion.span>
        ) : (
          <PlaceholderDots />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderDots() {
  return (
    <span className="inline-flex gap-1.5 text-[var(--color-dim)] text-4xl">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        >
          ·
        </motion.span>
      ))}
    </span>
  );
}
```

**Digit Buttons:**
- Press animation: `whileTap={{ scale: 0.95 }}` with 100ms duration
- Hover: border brightens, subtle gold tint on background
- Use `rounded-xl` for softer feel

```tsx
function DigitButton({ digit, onClick, disabled }: { digit: string; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={cn(
        "h-16 text-2xl font-display rounded-xl",
        "border border-[var(--border-gold)]/30",
        "text-[var(--color-cream)] bg-transparent",
        "hover:border-[var(--color-gold)]/60 hover:bg-[var(--color-gold)]/5",
        "active:bg-[var(--color-gold)]/10",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {digit}
    </motion.button>
  );
}
```

**Utility Buttons (Clear/Backspace):**
- Copper accent instead of gold to differentiate
- Smaller text, dimmer color

```tsx
function UtilityButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={cn(
        "h-16 text-sm rounded-xl",
        "border border-[var(--border-copper)]/30",
        "text-[var(--color-dim)]",
        "hover:border-[var(--color-copper)]/50 hover:text-[var(--color-warm-gray)]",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {children}
    </motion.button>
  );
}
```

**Quick Select Chips:**
- Staggered entrance animation (50ms delay between chips)
- Selection state: gold border + subtle gold background
- `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`

```tsx
function QuickSelectChips({ numbers, currentValue, onSelect, disabled }: {
  numbers: string[];
  currentValue: string;
  onSelect: (num: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {numbers.map((num, i) => (
        <motion.button
          key={num}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(num)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm",
            "border transition-all duration-200",
            currentValue === num
              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              : "border-[var(--border-gold)]/30 text-[var(--color-cream)] hover:border-[var(--color-gold)]/50"
          )}
        >
          {num}
        </motion.button>
      ))}
    </div>
  );
}
```

---

## MoodSelector

Mood tag selection with emoji orbs. Optional step in the capture flow.

### Functional Spec

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
  onSkip?: () => void;
  disabled?: boolean;
}

export function MoodSelector({ selected, onChange, onSkip, disabled }: MoodSelectorProps) {
  const toggleMood = (moodId: string) => {
    if (selected.includes(moodId)) {
      onChange(selected.filter((m) => m !== moodId));
    } else if (selected.length < 3) {
      onChange([...selected, moodId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-heading text-lg text-[var(--color-cream)]">
          What energy surrounds this moment?
        </p>
        <p className="mt-1 text-sm text-[var(--color-dim)]">
          Select up to 3 (optional)
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood, index) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selected.includes(mood.id)}
            isDisabled={disabled || (!selected.includes(mood.id) && selected.length >= 3)}
            index={index}
            onToggle={() => toggleMood(mood.id)}
          />
        ))}
      </div>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-sm text-[var(--color-dim)] hover:text-[var(--color-warm-gray)] transition-colors"
          >
            Continue without mood
          </button>
        </div>
      )}
    </div>
  );
}
```

### Design Notes

**Mood Button:**
- Staggered entrance (50ms delay per button)
- Selection indicated by animated ring (not checkmark badge)
- Labels use `font-heading tracking-wide uppercase text-xs`
- Emoji at 3xl size

```tsx
function MoodButton({ mood, isSelected, isDisabled, index, onToggle }: {
  mood: { id: string; emoji: string; label: string };
  isSelected: boolean;
  isDisabled: boolean;
  index: number;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={isDisabled}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-2xl",
        "border border-transparent",
        "transition-all duration-300",
        isSelected
          ? "bg-[var(--color-gold)]/10"
          : "hover:bg-[var(--color-warm-charcoal)]/50",
        "disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      <span className="text-3xl">{mood.emoji}</span>
      <span className={cn(
        "text-xs font-heading tracking-wide uppercase",
        isSelected ? "text-[var(--color-gold)]" : "text-[var(--color-dim)]"
      )}>
        {mood.label}
      </span>

      {/* Selection ring */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 rounded-2xl border-2 border-[var(--color-gold)] pointer-events-none"
        />
      )}
    </motion.button>
  );
}
```

**Skip Option:**
- Positioned below mood grid
- Dimmer color, understated — feels legitimate, not like failure
- Simple text button, no visual weight

---

## SacredSpinner

Loading indicator with sacred geometry styling.

### Functional Spec

```tsx
// src/components/signal/sacred-spinner.tsx
"use client";

import { motion } from "motion/react";

interface SacredSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function SacredSpinner({ size = "md", label }: SacredSpinnerProps) {
  const sizes = { sm: 16, md: 24, lg: 40 };
  const dim = sizes[size];

  return (
    <span className="inline-flex items-center gap-2">
      <motion.svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer ring */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        {/* Orbiting dot */}
        <circle cx="12" cy="2" r="2" fill="var(--color-gold)" />
      </motion.svg>
      {label && (
        <span className="text-sm text-[var(--color-dim)]">{label}</span>
      )}
    </span>
  );
}
```

### Design Notes

- 3-second rotation (slow, meditative, not anxious)
- Simple geometric form — outer ring with orbiting dot
- Use `ease: "linear"` for smooth continuous rotation
- Label uses dim color, matches "Receiving..." tone

---

## SubmitButton

Primary action button used across capture flow.

### Design Notes

```tsx
function SubmitButton({ onClick, disabled, isLoading, children = "Continue" }: {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        "w-full h-14 rounded-xl text-lg font-heading tracking-wide",
        "transition-all duration-200",
        disabled || isLoading
          ? "bg-[var(--color-warm-charcoal)] text-[var(--color-dim)] cursor-not-allowed"
          : "bg-[var(--color-gold)] text-[var(--color-obsidian)] hover:bg-[var(--color-gold-bright)]"
      )}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <SacredSpinner size="sm" />
          Receiving...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
```

- Loading state shows `SacredSpinner` with "Receiving..." text
- Disabled state: warm charcoal background, dim text
- Active state: full gold, hover brightens
- Subtle scale on hover/tap (1.01 / 0.98)

---

## InterpretationCard

Display AI interpretation with regenerate option.

### Functional Spec

```tsx
// src/components/signal/interpretation-card.tsx
"use client";

import { motion } from "motion/react";
import { SacredSpinner } from "./sacred-spinner";

interface InterpretationCardProps {
  content: string | null;
  isLoading: boolean;
  isFallback?: boolean;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}

export function InterpretationCard({
  content,
  isLoading,
  isFallback,
  onRegenerate,
  canRegenerate,
}: InterpretationCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <SacredSpinner size="lg" />
        <p className="mt-4 text-[var(--color-dim)]">Receiving...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="prose prose-invert prose-gold">
        <p className="text-[var(--color-cream)] leading-relaxed">
          {content}
        </p>
      </div>

      {isFallback && (
        <p className="text-xs text-[var(--color-dim)]">
          Using base interpretation
        </p>
      )}

      {canRegenerate && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="text-sm text-[var(--color-dim)] hover:text-[var(--color-gold)] transition-colors"
        >
          Regenerate interpretation
        </button>
      )}
    </motion.div>
  );
}
```

### Design Notes

- Loading: centered spinner with "Receiving..." below
- Content enters with fade + slight upward motion (y: 10 → 0)
- Fallback indicator is subtle (dim text, small)
- Regenerate is a text button, not a prominent CTA

---

## SightingCard

Collection item card for the grid view.

### Functional Spec

```tsx
// src/components/signal/sighting-card.tsx
"use client";

import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SightingCardProps {
  number: string;
  count: number;
  lastSeenAt: Date;
  moods?: string[];
  onClick: () => void;
}

export function SightingCard({ number, count, lastSeenAt, moods, onClick }: SightingCardProps) {
  const ordinal = getOrdinal(count);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "w-full p-4 rounded-xl text-left",
        "border border-[var(--border-gold)]/20",
        "bg-[var(--color-warm-charcoal)]/30",
        "hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-warm-charcoal)]/50",
        "transition-all duration-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-display text-2xl text-[var(--color-gold)]">
            {number}
          </span>
          <p className="mt-1 text-xs text-[var(--color-dim)]">
            {count}{ordinal} sighting · {formatDistanceToNow(lastSeenAt, { addSuffix: true })}
          </p>
        </div>
        {count > 1 && (
          <span className="px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-xs text-[var(--color-gold)]">
            ×{count}
          </span>
        )}
      </div>

      {moods && moods.length > 0 && (
        <div className="mt-2 flex gap-1">
          {moods.slice(0, 3).map((mood) => (
            <span key={mood} className="text-sm">
              {getMoodEmoji(mood)}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}
```

### Design Notes

- Card has subtle hover scale (1.02) and press (0.98)
- Number is prominent in gold display font
- Count badge only shows for repeat sightings (count > 1)
- Mood emojis shown small at bottom
- Border brightens on hover

---

## CollectionGrid

Grid of SightingCards with empty state.

### Functional Spec

```tsx
// src/components/signal/collection-grid.tsx
"use client";

import { motion } from "motion/react";
import { SightingCard } from "./sighting-card";
import type { UserNumberStats } from "@/lib/signal/types";

interface CollectionGridProps {
  stats: UserNumberStats[];
  onSelectNumber: (number: string) => void;
}

export function CollectionGrid({ stats, onSelectNumber }: CollectionGridProps) {
  if (stats.length === 0) {
    return <EmptyCollection />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.number}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        >
          <SightingCard
            number={stat.number}
            count={stat.count}
            lastSeenAt={stat.lastSeenAt}
            onClick={() => onSelectNumber(stat.number)}
          />
        </motion.div>
      ))}
    </div>
  );
}
```

### Design Notes

**Empty State:**
Per UX guidelines — spacious, inviting, not broken or accusatory.

```tsx
function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Faint sacred geometry icon */}
      <div className="mb-6 opacity-20">
        <SeedOfLifeIcon className="w-20 h-20 text-[var(--color-gold)]" />
      </div>
      <h3 className="font-heading text-xl text-[var(--color-cream)]">
        No signals captured yet
      </h3>
      <p className="mt-2 max-w-sm text-[var(--color-dim)]">
        The universe is patient.
      </p>
    </div>
  );
}
```

**Grid Animation:**
- Staggered entrance (50ms delay between cards)
- Fade + slight upward motion

---

## FirstCatchCelebration

Full-screen celebration for first-time number catches.

### Functional Spec

```tsx
// src/components/signal/first-catch-celebration.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface FirstCatchCelebrationProps {
  number: string;
  onDismiss: () => void;
}

export function FirstCatchCelebration({ number, onDismiss }: FirstCatchCelebrationProps) {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Show badge after particles settle
    const timer = setTimeout(() => setShowBadge(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-obsidian)]/90 cursor-pointer"
    >
      {/* Particle burst */}
      <ParticleBurst />

      {/* Badge reveal */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)] text-[var(--color-gold)] text-sm font-heading tracking-widest uppercase">
              First Catch
            </span>
            <p className="mt-6 text-5xl font-display text-[var(--color-cream)]">
              {number}
            </p>
            <p className="mt-4 text-sm text-[var(--color-dim)]">
              Tap anywhere to continue
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

### Design Notes

**Particle Burst:**
- 20-30 particles max (not overwhelming)
- Colors from palette: gold, gold-bright, copper, bronze
- Burst outward, then fade while drifting down
- Total duration: 2-3 seconds

```tsx
const PARTICLE_COLORS = [
  'var(--color-gold)',
  'var(--color-gold-bright)',
  'var(--color-copper)',
  'var(--color-bronze)',
];

function ParticleBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    angle: (i / 24) * 360,
    distance: 100 + Math.random() * 100,
    size: 4 + Math.random() * 4,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance + 50,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
```

**Badge Reveal:**
- Appears after particles (800ms delay)
- Spring animation for satisfying "pop"
- "First Catch" badge + number + tap hint

---

## Step Transitions

Capture flow moves through: Number → Mood → Submitting → Result

### Design Notes

Use AnimatePresence for smooth step changes:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentStep}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
  >
    {/* Step content */}
  </motion.div>
</AnimatePresence>
```

**Progress Dots:**
Subtle indication of current step:

```tsx
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, step) => (
        <div
          key={step}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            currentStep === step
              ? "w-6 bg-[var(--color-gold)]"
              : currentStep > step
                ? "w-1.5 bg-[var(--color-gold)]/50"
                : "w-1.5 bg-[var(--color-dim)]/30"
          )}
        />
      ))}
    </div>
  );
}
```

---

## Background Treatment

Subtle sacred geometry reinforces brand without competing.

### Design Notes

Add to capture page layout:

```tsx
<div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none">
  <SeedOfLifeIcon className="w-[500px] h-[500px] text-[var(--color-gold)] opacity-[0.02]" />
</div>
```

**"Receiving" State:**
When waiting for interpretation, background geometry pulses slowly:

```tsx
<motion.div
  animate={{ opacity: [0.02, 0.04, 0.02] }}
  transition={{ duration: 4, repeat: Infinity }}
  className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none"
>
  <SeedOfLifeIcon className="w-[500px] h-[500px] text-[var(--color-gold)]" />
</motion.div>
```

---

## SacredNumberWheel

> **Deferred to Phase 7**

Full implementation in [phases/7-sacred-number-wheel.md](./phases/7-sacred-number-wheel.md).

Key features:
- Digits 1-9 arranged in circle, 0 at bottom
- Center display with ethereal glow
- Quick-select chips for common numbers
- Sacred geometry SVG background pattern

---

## Animation Guidelines

Follow `docs/ux/interaction-patterns.md`:

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

**Reduced Motion:**
Already handled in globals.css — all animations respect `prefers-reduced-motion`.

---

## Input Mode Persistence

Store user preference in localStorage (for when Phase 7 adds SacredNumberWheel):

```typescript
const INPUT_MODE_KEY = "signal-input-mode";

export function useInputMode() {
  const [mode, setMode] = useState<"pad" | "wheel">(() => {
    if (typeof window === "undefined") return "pad";
    return (localStorage.getItem(INPUT_MODE_KEY) as "pad" | "wheel") || "pad";
  });

  const setInputMode = (newMode: "pad" | "wheel") => {
    setMode(newMode);
    localStorage.setItem(INPUT_MODE_KEY, newMode);
  };

  return { mode, setInputMode };
}
```
