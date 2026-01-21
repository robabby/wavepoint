"use client";

import { cn } from "@/lib/utils";
import { SubmitButton } from "./submit-button";

const MAX_LENGTH = 500;

export interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
}

/**
 * Note input for Signal capture flow.
 * Optional textarea for users to add context about their sighting.
 */
export function NoteInput({
  value,
  onChange,
  onSubmit,
  onSkip,
  isLoading,
  disabled,
  error,
}: NoteInputProps) {
  const handleSubmit = () => {
    if (!isLoading && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="font-heading text-lg text-foreground">
          Add a note (optional)
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          What were you doing? What came to mind?
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="The number appeared on..."
        maxLength={MAX_LENGTH}
        rows={4}
        disabled={disabled || isLoading}
        className={cn(
          "w-full rounded-xl p-4",
          "bg-card/30 border border-[var(--border-gold)]/20",
          "text-foreground placeholder:text-muted-foreground",
          "focus:border-[var(--color-gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/30",
          "resize-none transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {value.length}/{MAX_LENGTH}
        </span>
        {error && <span className="text-red-400">{error}</span>}
      </div>

      <SubmitButton onClick={handleSubmit} isLoading={isLoading} disabled={disabled}>
        Capture
      </SubmitButton>

      {onSkip && (
        <div className="text-center">
          <button
            onClick={onSkip}
            disabled={disabled || isLoading}
            className="text-sm text-muted-foreground hover:text-muted-foreground transition-colors disabled:opacity-50"
          >
            Skip note
          </button>
        </div>
      )}
    </div>
  );
}
