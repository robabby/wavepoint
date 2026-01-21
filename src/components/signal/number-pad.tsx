"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";
import { digitInteraction, SIGNAL_TIMING } from "./animation-config";

const QUICK_NUMBERS = ["111", "222", "333", "444", "555", "1111", "1212"];
const MAX_DIGITS = 10;

export interface NumberPadProps {
  onSubmit: (number: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Number pad for quick angel number entry.
 * Features a 3x3 grid, quick-select chips, and a prominent display.
 */
export function NumberPad({ onSubmit, disabled, isLoading }: NumberPadProps) {
  const [value, setValue] = useState("");

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
        numbers={QUICK_NUMBERS}
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
    <div className="flex flex-wrap justify-center gap-2">
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
