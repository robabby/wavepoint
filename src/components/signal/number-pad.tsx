"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import { digitInteraction, SIGNAL_TIMING } from "./animation-config";

const DEFAULT_QUICK_NUMBERS = [
  "111", "222", "333", "444", "555", "666",
  "777", "888", "999", "1111", "1212", "1234",
];
const MAX_DIGITS = 10;

export interface NumberPadProps {
  onSubmit: (number: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  /** User's personalized top numbers (from stats). Will be merged with defaults. */
  userTopNumbers?: string[];
}

/**
 * Number pad for quick angel number entry.
 * Features a 3x3 grid, quick-select chips, and a prominent display.
 *
 * When userTopNumbers is provided, shows a mix of user's frequent numbers
 * and common patterns. Falls back to defaults if no user data.
 */
export function NumberPad({
  onSubmit,
  disabled,
  isLoading,
  userTopNumbers,
}: NumberPadProps) {
  const [value, setValue] = useState("");

  // Compute personalized quick-select numbers
  // Take user's top 7 (if available), then fill remaining slots with defaults
  const quickNumbers = (() => {
    if (!userTopNumbers || userTopNumbers.length === 0) {
      return DEFAULT_QUICK_NUMBERS;
    }

    const userNumbers = userTopNumbers.slice(0, 7);
    const userNumberSet = new Set(userNumbers);

    // Fill remaining slots with defaults not in user's list
    const remainingDefaults = DEFAULT_QUICK_NUMBERS.filter(
      (n) => !userNumberSet.has(n)
    );

    return [
      ...userNumbers,
      ...remainingDefaults.slice(0, 12 - userNumbers.length),
    ];
  })();

  const handleDigit = useCallback((digit: string) => {
    setValue((prev) => (prev.length < MAX_DIGITS ? prev + digit : prev));
  }, []);

  const handleClear = useCallback(() => setValue(""), []);
  const handleBackspace = useCallback(
    () => setValue((prev) => prev.slice(0, -1)),
    []
  );
  const handleQuickSelect = useCallback(
    (number: string) => setValue(number),
    []
  );

  const handleSubmit = useCallback(() => {
    if (value.length > 0) {
      onSubmit(value);
    }
  }, [value, onSubmit]);

  return (
    <div className="space-y-6">
      {/* Display */}
      <NumberDisplay value={value} />

      {/* Quick select */}
      <QuickSelectChips
        numbers={quickNumbers}
        currentValue={value}
        onSelect={handleQuickSelect}
        disabled={disabled}
      />

      {/* Number pad grid */}
      <div className="relative rounded-2xl border border-[var(--border-gold)]/20 p-4 bg-card/30">
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
          <DigitButton
            digit="0"
            onClick={() => handleDigit("0")}
            disabled={disabled}
          />
          <UtilityButton onClick={handleBackspace} disabled={disabled}>
            ←
          </UtilityButton>
        </div>
      </div>

      {/* Submit */}
      <SubmitButton
        onClick={handleSubmit}
        disabled={disabled || value.length === 0}
        isLoading={isLoading}
      />
    </div>
  );
}

// --- Sub-components ---

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
            background:
              "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
            transform: "scale(2)",
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
            style={{ textShadow: "0 0 40px var(--glow-gold)" }}
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
    <span className="inline-flex gap-1.5 text-muted-foreground text-4xl">
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

function DigitButton({
  digit,
  onClick,
  disabled,
}: {
  digit: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      {...digitInteraction}
      className={cn(
        "h-16 text-2xl font-display rounded-xl",
        "border border-[var(--border-gold)]/30",
        "text-foreground bg-transparent",
        "hover:border-[var(--color-gold)]/60 hover:bg-[var(--color-gold)]/5",
        "active:bg-[var(--color-gold)]/10",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
      aria-label={`Digit ${digit}`}
    >
      {digit}
    </motion.button>
  );
}

function UtilityButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      {...digitInteraction}
      className={cn(
        "h-16 text-sm rounded-xl",
        "border border-[var(--border-copper)]/30",
        "text-muted-foreground",
        "hover:border-[var(--color-copper)]/50 hover:text-muted-foreground",
        "transition-colors duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {children}
    </motion.button>
  );
}

function QuickSelectChips({
  numbers,
  currentValue,
  onSelect,
  disabled,
}: {
  numbers: string[];
  currentValue: string;
  onSelect: (num: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 justify-items-center">
      {numbers.map((num, i) => (
        <motion.button
          key={num}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * SIGNAL_TIMING.stagger, duration: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(num)}
          disabled={disabled}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm",
            "border transition-all duration-200",
            currentValue === num
              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              : "border-[var(--border-gold)]/30 text-foreground hover:border-[var(--color-gold)]/50"
          )}
        >
          {num}
        </motion.button>
      ))}
    </div>
  );
}
