"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Check, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NUMBER_PATTERN_IDS } from "@/lib/numbers/types";
import { getPatternByNumber } from "@/lib/numbers/helpers";

/**
 * Represents a number with its capture count.
 */
interface NumberCount {
  number: string;
  count: number;
}

/**
 * A suggestion item with scoring metadata.
 */
interface Suggestion {
  number: string;
  count?: number;
  label?: string;
  source: "user" | "pattern" | "valid";
  score: number;
}

export interface InlineCaptureInputProps {
  /** User's logged numbers with counts from useStats() */
  userNumbers: NumberCount[];
  /** Callback when a number is captured */
  onCapture: (number: string) => Promise<void>;
  /** Whether a capture is in progress */
  isCapturing: boolean;
}

/** Maximum digits allowed */
const MAX_DIGITS = 10;
/** Maximum suggestions to show */
const MAX_SUGGESTIONS = 6;

/** Popular patterns for new users (curated selection) */
const POPULAR_PATTERNS = ["111", "222", "333", "444", "555", "1111", "1234", "777", "888"] as const;

/**
 * Generate suggestions based on input and user history.
 */
function generateSuggestions(
  input: string,
  userNumbers: NumberCount[]
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const seen = new Set<string>();

  // Empty input: show user's top numbers or popular patterns
  if (!input) {
    if (userNumbers.length > 0) {
      // User has history: show top 5 by count
      const sorted = [...userNumbers].sort((a, b) => b.count - a.count);
      for (const item of sorted.slice(0, MAX_SUGGESTIONS)) {
        suggestions.push({
          number: item.number,
          count: item.count,
          source: "user",
          score: 1000 + item.count,
        });
        seen.add(item.number);
      }
    } else {
      // New user: show popular patterns
      for (const num of POPULAR_PATTERNS.slice(0, MAX_SUGGESTIONS)) {
        const pattern = getPatternByNumber(num);
        suggestions.push({
          number: num,
          label: pattern?.essence,
          source: "pattern",
          score: 500,
        });
        seen.add(num);
      }
    }
    return suggestions;
  }

  // With input: strict prefix matching

  // 1. User's numbers (highest priority)
  for (const item of userNumbers) {
    if (item.number.startsWith(input) && !seen.has(item.number)) {
      suggestions.push({
        number: item.number,
        count: item.count,
        source: "user",
        score: 1000 + item.count * 0.8 + (item.number === input ? 100 : 0),
      });
      seen.add(item.number);
    }
  }

  // 2. Known patterns (from NUMBER_PATTERN_IDS)
  for (const patternId of NUMBER_PATTERN_IDS) {
    if (patternId.startsWith(input) && !seen.has(patternId)) {
      const pattern = getPatternByNumber(patternId);
      suggestions.push({
        number: patternId,
        label: pattern?.essence,
        source: "pattern",
        score: 500 + (patternId === input ? 50 : 0),
      });
      seen.add(patternId);
    }
  }

  // 3. Valid completions (repeating digits, sequences) - only if few matches
  if (suggestions.length < 3 && input.length >= 1 && input.length < 5) {
    // Repeating completion (e.g., "4" -> "44", "444", "4444")
    const digit = input[0];
    if (digit && /^\d$/.test(digit)) {
      const repeats = [
        digit!.repeat(2),
        digit!.repeat(3),
        digit!.repeat(4),
      ].filter((n) => n.startsWith(input) && !seen.has(n));

      for (const num of repeats) {
        suggestions.push({
          number: num,
          source: "valid",
          score: 200,
        });
        seen.add(num);
      }
    }
  }

  // Sort by score descending and limit
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SUGGESTIONS);
}

/**
 * Inline capture input for quick number logging.
 * Shows autocomplete suggestions based on user history and known patterns.
 */
export function InlineCaptureInput({
  userNumbers,
  onCapture,
  isCapturing,
}: InlineCaptureInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate suggestions
  const suggestions = useMemo(
    () => generateSuggestions(value, userNumbers),
    [value, userNumbers]
  );

  const showDropdown = isFocused && suggestions.length > 0 && !showSuccess;

  // Handle input change - strip non-digits and reset selection
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "").slice(0, MAX_DIGITS);
    setValue(digitsOnly);
    setSelectedIndex(-1);
    setError(null);
  }, []);

  // Submit the current value or selected suggestion
  const handleSubmit = useCallback(
    async (numberToSubmit?: string) => {
      const number = numberToSubmit ?? value;
      if (!number || isCapturing) return;

      try {
        setError(null);
        await onCapture(number);

        // Show success animation
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setValue("");
          inputRef.current?.blur();
        }, 400);
      } catch {
        setError("Couldn't save. Tap to retry.");
      }
    },
    [value, isCapturing, onCapture]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) {
        if (e.key === "Enter" && value) {
          e.preventDefault();
          handleSubmit();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSubmit(suggestions[selectedIndex].number);
          } else if (value) {
            handleSubmit();
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsFocused(false);
          inputRef.current?.blur();
          break;
      }
    },
    [showDropdown, selectedIndex, suggestions, value, handleSubmit]
  );

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (number: string) => {
      handleSubmit(number);
    },
    [handleSubmit]
  );

  return (
    <div className="relative mx-auto max-w-xs" ref={containerRef}>
      {/* Input container */}
      <div
        role="combobox"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        aria-controls="capture-suggestions"
        className={cn(
          "relative flex h-14 items-center rounded-full border px-4 transition-all duration-200",
          "bg-card/50 backdrop-blur-sm",
          error
            ? "border-[var(--color-copper)]"
            : isFocused || value
              ? "border-[var(--color-gold)] shadow-[0_0_12px_rgba(191,155,48,0.15)]"
              : "border-[var(--border-gold)]/30 hover:border-[var(--border-gold)]/50"
        )}
      >
        {/* Sparkles icon */}
        <Sparkles
          className={cn(
            "mr-2 h-5 w-5 flex-shrink-0 transition-colors",
            isFocused || value
              ? "text-[var(--color-gold)]"
              : "text-muted-foreground"
          )}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          disabled={isCapturing}
          placeholder="Type a number..."
          aria-autocomplete="list"
          aria-controls="capture-suggestions"
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
          }
          className={cn(
            "flex-1 bg-transparent font-display text-lg tracking-wide outline-none",
            "placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground",
            value && "text-[var(--color-gold)]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        {/* Submit button or loading spinner */}
        <AnimatePresence mode="wait">
          {isCapturing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-2"
            >
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-gold)]" />
            </motion.div>
          ) : showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="ml-2"
            >
              <Check className="h-5 w-5 text-[var(--color-gold)]" />
            </motion.div>
          ) : value ? (
            <motion.button
              key="submit"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSubmit()}
              disabled={isCapturing}
              aria-label="Capture number"
              className={cn(
                "ml-2 flex h-8 w-8 items-center justify-center rounded-full",
                "bg-[var(--color-gold)] text-primary-foreground",
                "transition-colors hover:bg-[var(--color-gold-bright)]"
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 text-center text-sm text-[var(--color-copper)]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success ripple overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 0 3px var(--color-gold), 0 0 20px rgba(191,155,48,0.3)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Autocomplete dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            id="capture-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-1/2 top-full z-50 mt-2 w-[280px] -translate-x-1/2",
              "rounded-xl border border-[var(--border-gold)]/20 bg-card/95 backdrop-blur-md",
              "shadow-lg overflow-hidden"
            )}
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion.number}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={selectedIndex === index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleSuggestionClick(suggestion.number)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-3 text-left",
                  "transition-colors duration-100",
                  selectedIndex === index
                    ? "bg-[var(--color-gold)]/10"
                    : "hover:bg-[var(--color-gold)]/5",
                  index !== suggestions.length - 1 &&
                    "border-b border-[var(--border-gold)]/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-[var(--color-gold)]">
                    {suggestion.number}
                  </span>
                  {suggestion.label && (
                    <span className="text-sm text-muted-foreground">
                      {suggestion.label}
                    </span>
                  )}
                </div>
                {suggestion.count !== undefined && (
                  <span className="rounded-full bg-[var(--color-gold)]/10 px-2 py-0.5 text-xs text-[var(--color-gold)]">
                    {suggestion.count}×
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
