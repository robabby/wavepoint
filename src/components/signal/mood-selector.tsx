"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SIGNAL_TIMING } from "./animation-config";
import type { ActivityOption } from "@/lib/signal/schemas";

const ACTIVITIES = [
  { id: "working", emoji: "💼", label: "Working" },
  { id: "transit", emoji: "🚗", label: "Transit" },
  { id: "resting", emoji: "🛋️", label: "Resting" },
  { id: "socializing", emoji: "👥", label: "Socializing" },
  { id: "other", emoji: "✨", label: "Other" },
] as const;

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

const MAX_MOOD_SELECTIONS = 3;

export interface MoodSelectorProps {
  selected: string[];
  onChange: (moods: string[]) => void;
  activity?: ActivityOption;
  onActivityChange?: (activity: ActivityOption | undefined) => void;
  onSkip?: () => void;
  disabled?: boolean;
}

/**
 * Mood tag selector for Signal capture flow.
 * Includes optional activity selection (single-select) above mood tags (multi-select up to 3).
 */
export function MoodSelector({
  selected,
  onChange,
  activity,
  onActivityChange,
  onSkip,
  disabled,
}: MoodSelectorProps) {
  const toggleMood = (moodId: string) => {
    if (selected.includes(moodId)) {
      onChange(selected.filter((m) => m !== moodId));
    } else if (selected.length < MAX_MOOD_SELECTIONS) {
      onChange([...selected, moodId]);
    }
  };

  const toggleActivity = (activityId: ActivityOption) => {
    if (onActivityChange) {
      // Toggle off if already selected, otherwise select
      onActivityChange(activity === activityId ? undefined : activityId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Activity section (single-select) */}
      {onActivityChange && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="font-heading text-lg text-foreground">
              What were you doing?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select one (optional)
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {ACTIVITIES.map((act, index) => (
              <ActivityChip
                key={act.id}
                activity={act}
                isSelected={activity === act.id}
                isDisabled={disabled}
                index={index}
                onToggle={() => toggleActivity(act.id as ActivityOption)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mood section (multi-select) */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="font-heading text-lg text-foreground">
            What energy surrounds this moment?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Select up to {MAX_MOOD_SELECTIONS} (optional)
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
                (!selected.includes(mood.id) && selected.length >= MAX_MOOD_SELECTIONS)
              }
              index={index}
              onToggle={() => toggleMood(mood.id)}
            />
          ))}
        </div>
      </div>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            disabled={disabled}
            className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors disabled:opacity-50"
          >
            Continue without context
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityChip({
  activity,
  isSelected,
  isDisabled,
  index,
  onToggle,
}: {
  activity: { id: string; emoji: string; label: string };
  isSelected: boolean;
  isDisabled?: boolean;
  index: number;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={isDisabled}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * SIGNAL_TIMING.stagger }}
      aria-pressed={isSelected}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full",
        "border transition-all duration-300",
        isSelected
          ? "bg-[var(--color-gold)]/10 border-[var(--color-gold)]"
          : "border-border/50 hover:border-border hover:bg-card/50",
        "disabled:cursor-not-allowed disabled:opacity-40"
      )}
    >
      <span className="text-lg" role="img" aria-hidden="true">
        {activity.emoji}
      </span>
      <span
        className={cn(
          "text-sm font-heading tracking-wide",
          isSelected ? "text-[var(--color-gold)]" : "text-muted-foreground"
        )}
      >
        {activity.label}
      </span>
    </motion.button>
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
