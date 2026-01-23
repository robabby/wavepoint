"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X } from "lucide-react";
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

const MAX_MOOD_SELECTIONS = 3;

interface TopNumber {
  number: string;
  count: number;
}

export interface QuickCaptureBarProps {
  topNumbers: TopNumber[];
  onCapture: (number: string, moods?: string[]) => Promise<void>;
  isCapturing: boolean;
}

/**
 * Quick capture bar for dashboard.
 * Shows user's top numbers as chips with optional inline mood selector.
 */
export function QuickCaptureBar({
  topNumbers,
  onCapture,
  isCapturing,
}: QuickCaptureBarProps) {
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const handleNumberClick = useCallback((number: string) => {
    setSelectedNumber((prev) => (prev === number ? null : number));
    setSelectedMoods([]);
  }, []);

  const handleMoodToggle = useCallback((moodId: string) => {
    setSelectedMoods((prev) => {
      if (prev.includes(moodId)) {
        return prev.filter((m) => m !== moodId);
      }
      if (prev.length < MAX_MOOD_SELECTIONS) {
        return [...prev, moodId];
      }
      return prev;
    });
  }, []);

  const handleCapture = useCallback(
    async (withMoods: boolean) => {
      if (!selectedNumber) return;
      await onCapture(
        selectedNumber,
        withMoods && selectedMoods.length > 0 ? selectedMoods : undefined
      );
      setSelectedNumber(null);
      setSelectedMoods([]);
    },
    [selectedNumber, selectedMoods, onCapture]
  );

  const handleCancel = useCallback(() => {
    setSelectedNumber(null);
    setSelectedMoods([]);
  }, []);

  if (topNumbers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Quick capture</p>

      {/* Number chips - horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {topNumbers.slice(0, 5).map((item, i) => (
          <motion.button
            key={item.number}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * SIGNAL_TIMING.stagger }}
            onClick={() => handleNumberClick(item.number)}
            disabled={isCapturing}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-display",
              "border transition-all duration-200",
              selectedNumber === item.number
                ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
                : "border-[var(--border-gold)]/30 text-foreground hover:border-[var(--color-gold)]/50",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {item.number}
            <span className="ml-1.5 text-xs text-muted-foreground">
              ({item.count})
            </span>
          </motion.button>
        ))}
      </div>

      {/* Inline mood selector - expands when number is selected */}
      <AnimatePresence>
        {selectedNumber && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: SIGNAL_TIMING.small }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/50 p-4 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Add mood? (optional)
              </p>

              {/* Compact mood grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {MOODS.map((mood) => {
                  const isSelected = selectedMoods.includes(mood.id);
                  const isDisabled =
                    !isSelected && selectedMoods.length >= MAX_MOOD_SELECTIONS;

                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodToggle(mood.id)}
                      disabled={isDisabled || isCapturing}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg",
                        "border transition-all duration-200",
                        isSelected
                          ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10"
                          : "border-transparent hover:bg-card/80",
                        "disabled:opacity-40 disabled:cursor-not-allowed"
                      )}
                    >
                      <span className="text-xl">{mood.emoji}</span>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wide",
                          isSelected
                            ? "text-[var(--color-gold)]"
                            : "text-muted-foreground"
                        )}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleCancel}
                  disabled={isCapturing}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={() => handleCapture(false)}
                  disabled={isCapturing}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Skip mood
                </button>
                <button
                  onClick={() => handleCapture(true)}
                  disabled={isCapturing}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-heading uppercase tracking-wide",
                    "bg-[var(--color-gold)] text-primary-foreground",
                    "hover:bg-[var(--color-gold-bright)] transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Check className="h-4 w-4" />
                  Log
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
