"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SIGNAL_TIMING } from "./animation-config";

const MOODS = [
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "energized", emoji: "⚡", label: "Energized" },
  { id: "reflective", emoji: "🤔", label: "Reflective" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "inspired", emoji: "✨", label: "Inspired" },
  { id: "curious", emoji: "🧐", label: "Curious" },
  { id: "hopeful", emoji: "🌱", label: "Hopeful" },
  { id: "peaceful", emoji: "🕊️", label: "Peaceful" },
  { id: "confused", emoji: "😕", label: "Confused" },
  { id: "excited", emoji: "🎉", label: "Excited" },
  { id: "uncertain", emoji: "🌫️", label: "Uncertain" },
] as const;

const MAX_SELECTIONS = 3;

export interface MoodSelectorProps {
  selected: string[];
  onChange: (moods: string[]) => void;
  onSkip?: () => void;
  disabled?: boolean;
}

/**
 * Mood tag selector for Signal capture flow.
 * Users can select up to 3 moods (optional step).
 */
export function MoodSelector({
  selected,
  onChange,
  onSkip,
  disabled,
}: MoodSelectorProps) {
  const toggleMood = (moodId: string) => {
    if (selected.includes(moodId)) {
      onChange(selected.filter((m) => m !== moodId));
    } else if (selected.length < MAX_SELECTIONS) {
      onChange([...selected, moodId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-heading text-lg text-foreground">
          What energy surrounds this moment?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Select up to {MAX_SELECTIONS} (optional)
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {MOODS.map((mood, index) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selected.includes(mood.id)}
            isDisabled={
              disabled ||
              (!selected.includes(mood.id) && selected.length >= MAX_SELECTIONS)
            }
            index={index}
            onToggle={() => toggleMood(mood.id)}
          />
        ))}
      </div>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            disabled={disabled}
            className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors disabled:opacity-50"
          >
            Continue without mood
          </button>
        </div>
      )}
    </div>
  );
}

function MoodButton({
  mood,
  isSelected,
  isDisabled,
  index,
  onToggle,
}: {
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
      transition={{ delay: index * SIGNAL_TIMING.stagger }}
      aria-pressed={isSelected}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-2xl",
        "border border-transparent",
        "transition-all duration-300",
        isSelected
          ? "bg-[var(--color-gold)]/10"
          : "hover:bg-card/50",
        "disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      <span className="text-3xl" role="img" aria-hidden="true">
        {mood.emoji}
      </span>
      <span
        className={cn(
          "text-xs font-heading tracking-wide uppercase",
          isSelected ? "text-[var(--color-gold)]" : "text-muted-foreground"
        )}
      >
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
