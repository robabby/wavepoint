"use client";

import { useState } from "react";
import { Sparkles, Trophy, StickyNote, Pencil, Trash2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useJournalEntry,
  useCreateJournalEntry,
  useUpdateJournalEntry,
  useDeleteJournalEntry,
} from "@/hooks/calendar";
import type { JournalEntryType, CalendarJournalEntry } from "@/lib/calendar";

interface JournalSectionProps {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Optional className */
  className?: string;
}

// =============================================================================
// Entry Type Configuration
// =============================================================================

const ENTRY_TYPE_CONFIG: Record<
  JournalEntryType,
  {
    label: string;
    icon: typeof Sparkles;
    bgClass: string;
    iconClass: string;
  }
> = {
  reflection: {
    label: "Reflection",
    icon: Sparkles,
    bgClass: "bg-violet-500/10",
    iconClass: "text-violet-400",
  },
  milestone: {
    label: "Milestone",
    icon: Trophy,
    bgClass: "bg-[var(--color-gold)]/10",
    iconClass: "text-[var(--color-gold)]",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    bgClass: "bg-card/60",
    iconClass: "text-muted-foreground",
  },
};

// =============================================================================
// Components
// =============================================================================

/**
 * Entry type selector buttons.
 */
function EntryTypeSelector({
  value,
  onChange,
  disabled,
}: {
  value: JournalEntryType;
  onChange: (type: JournalEntryType) => void;
  disabled?: boolean;
}) {
  const types: JournalEntryType[] = ["note", "reflection", "milestone"];

  return (
    <div className="flex gap-2" role="group" aria-label="Entry type">
      {types.map((type) => {
        const config = ENTRY_TYPE_CONFIG[type];
        const Icon = config.icon;
        const isSelected = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5",
              "text-xs font-medium transition-all",
              "border border-transparent",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60",
              isSelected
                ? cn(config.bgClass, "border-[var(--border-gold)]/30")
                : "hover:bg-card/40",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", isSelected ? config.iconClass : "text-muted-foreground")} aria-hidden="true" />
            <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
              {config.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Journal entry display card.
 */
function EntryCard({
  entry,
  onEdit,
  onDelete,
  isDeleting,
}: {
  entry: CalendarJournalEntry;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const config = ENTRY_TYPE_CONFIG[entry.eventType];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--border-gold)]/20 p-4",
        config.bgClass
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", config.iconClass)} />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            aria-label="Edit journal entry"
            className={cn(
              "rounded-md p-1.5 transition-colors",
              "text-muted-foreground hover:text-foreground hover:bg-card/40",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60"
            )}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete journal entry"
            className={cn(
              "rounded-md p-1.5 transition-colors",
              "text-muted-foreground hover:text-red-400 hover:bg-red-500/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60",
              isDeleting && "opacity-50 cursor-not-allowed"
            )}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {entry.content}
      </p>

      {/* Cosmic snapshot */}
      {entry.cosmicSnapshot && (
        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground/60">
          <span>{entry.cosmicSnapshot.moonPhase}</span>
          <span className="text-[var(--color-gold)]">
            Moon in {entry.cosmicSnapshot.moonSign}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Journal entry form (create/edit).
 */
function EntryForm({
  initialContent,
  initialType,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  initialContent?: string;
  initialType?: JournalEntryType;
  onSubmit: (content: string, eventType: JournalEntryType) => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  const [content, setContent] = useState(initialContent ?? "");
  const [eventType, setEventType] = useState<JournalEntryType>(initialType ?? "note");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim(), eventType);
    }
  };

  const charCount = content.length;
  const maxChars = 500;
  const isOverLimit = charCount > maxChars;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type selector */}
      <EntryTypeSelector
        value={eventType}
        onChange={setEventType}
        disabled={isSubmitting}
      />

      {/* Content textarea */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          disabled={isSubmitting}
          aria-label="Journal entry content"
          aria-describedby="char-count"
          aria-invalid={isOverLimit}
          maxLength={maxChars + 50} // Allow typing a bit over for UX, validation still enforced
          className={cn(
            "w-full resize-none rounded-lg border bg-card/30 p-3",
            "text-sm text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30",
            "transition-colors",
            isOverLimit
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-[var(--border-gold)]/20",
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
          rows={4}
        />
        <div
          id="char-count"
          className={cn(
            "absolute bottom-2 right-2 text-[10px]",
            isOverLimit ? "text-red-400" : "text-muted-foreground/50"
          )}
          aria-live="polite"
        >
          {charCount}/{maxChars}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2",
              "text-sm text-muted-foreground transition-colors",
              "hover:text-foreground hover:bg-card/40",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim() || isOverLimit}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2",
            "text-sm font-medium transition-all",
            "bg-[var(--color-gold)]/20 text-[var(--color-gold)]",
            "border border-[var(--color-gold)]/30",
            "hover:bg-[var(--color-gold)]/30",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/60",
            (isSubmitting || !content.trim() || isOverLimit) &&
              "opacity-50 cursor-not-allowed"
          )}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

/**
 * Loading skeleton for journal section.
 */
function JournalSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-lg bg-card/30" />
        ))}
      </div>
      <div className="h-32 animate-pulse rounded-lg bg-card/30" />
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Journal section for the day view.
 *
 * Allows users to create, edit, and delete a single journal entry per day.
 */
export function JournalSection({ date, className }: JournalSectionProps) {
  const { entry, isLoading } = useJournalEntry(date);
  const createMutation = useCreateJournalEntry();
  const updateMutation = useUpdateJournalEntry();
  const deleteMutation = useDeleteJournalEntry();

  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = (content: string, eventType: JournalEntryType) => {
    createMutation.mutate(
      { entryDate: date, content, eventType },
      {
        onSuccess: () => {
          // Entry created, state will update via refetch
        },
      }
    );
  };

  const handleUpdate = (content: string, eventType: JournalEntryType) => {
    if (!entry) return;

    updateMutation.mutate(
      { id: entry.id, input: { content, eventType } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!entry) return;

    deleteMutation.mutate(entry.id, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  return (
    <section className={className}>
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
        Journal
      </h3>

      <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
        {/* Loading */}
        {isLoading && <JournalSkeleton />}

        {/* No entry - show create form */}
        {!isLoading && !entry && (
          <EntryForm
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            submitLabel="Save"
          />
        )}

        {/* Has entry - show card or edit form */}
        {!isLoading && entry && !isEditing && (
          <EntryCard
            entry={entry}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        )}

        {/* Editing entry */}
        {!isLoading && entry && isEditing && (
          <EntryForm
            initialContent={entry.content ?? ""}
            initialType={entry.eventType}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isSubmitting={updateMutation.isPending}
            submitLabel="Update"
          />
        )}

        {/* Error states */}
        {createMutation.isError && (
          <p className="mt-3 text-xs text-red-400">
            {createMutation.error?.message ?? "Failed to create entry"}
          </p>
        )}
        {updateMutation.isError && (
          <p className="mt-3 text-xs text-red-400">
            {updateMutation.error?.message ?? "Failed to update entry"}
          </p>
        )}
        {deleteMutation.isError && (
          <p className="mt-3 text-xs text-red-400">
            {deleteMutation.error?.message ?? "Failed to delete entry"}
          </p>
        )}
      </div>
    </section>
  );
}
