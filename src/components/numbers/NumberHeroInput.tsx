"use client";

import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberHeroInputProps {
  className?: string;
  placeholder?: string;
  /** Controlled value (optional - uncontrolled mode if not provided) */
  value?: string;
  /** Controlled onChange handler (optional - uncontrolled mode if not provided) */
  onChange?: (value: string) => void;
  /** Called when clear button is clicked (controlled mode only) */
  onClear?: () => void;
}

/**
 * Hero input for the Numbers landing page.
 * Supports both controlled and uncontrolled modes.
 * - Uncontrolled: Manages own state, navigates on Enter
 * - Controlled: Parent manages state via value/onChange
 */
export function NumberHeroInput({
  className,
  placeholder = "Enter a number sequence...",
  value: controlledValue,
  onChange: controlledOnChange,
  onClear,
}: NumberHeroInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Determine if controlled or uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const digits = e.target.value.replace(/\D/g, "");

    if (isControlled && controlledOnChange) {
      controlledOnChange(digits);
    } else {
      setInternalValue(digits);
    }
    setError(null);
  };

  const handleClear = () => {
    if (isControlled && onClear) {
      onClear();
    } else if (isControlled && controlledOnChange) {
      controlledOnChange("");
    } else {
      setInternalValue("");
    }
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value) {
      e.preventDefault();

      if (value.length < 2) {
        setError("Enter at least 2 digits");
        return;
      }

      if (value.length > 5) {
        setError("Maximum 5 digits");
        return;
      }

      router.push(`/numbers/${value}`);
    }
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={5}
          aria-label="Number sequence"
          aria-describedby={error ? "number-input-error" : undefined}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-xl border px-6 py-4 text-center",
            "font-display text-3xl tracking-widest",
            "bg-[var(--color-warm-charcoal)]/50 backdrop-blur-sm",
            "placeholder:text-[var(--color-dim)] placeholder:text-xl placeholder:tracking-normal placeholder:font-sans",
            "text-[var(--color-gold)]",
            "transition-all duration-200",
            // Default border
            "border-[var(--border-gold)]/30",
            // Focus state
            "focus:outline-none focus:border-[var(--color-gold)]/60",
            "focus:ring-2 focus:ring-[var(--color-gold)]/20",
            // Error state
            error && "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
          )}
        />
        {value.length > 0 && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-[var(--color-dim)] hover:text-[var(--color-gold)] hover:bg-[var(--color-warm-charcoal)] transition-colors"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
            <span className="text-sm text-[var(--color-dim)]">Enter</span>
          </div>
        )}
      </div>
      {error && (
        <p
          id="number-input-error"
          className="mt-2 text-center text-sm text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
