"use client";

import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface NumberHeroInputProps {
  className?: string;
  placeholder?: string;
}

/**
 * Hero input for the Numbers landing page.
 * Accepts 2-5 digit number sequences and navigates to the pattern page on Enter.
 */
export function NumberHeroInput({
  className,
  placeholder = "Enter a number sequence...",
}: NumberHeroInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const digits = e.target.value.replace(/\D/g, "");
    setValue(digits);
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
            "placeholder:text-[var(--color-dim)] placeholder:text-lg placeholder:tracking-normal placeholder:font-sans",
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
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-dim)]">
            Press Enter
          </span>
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
