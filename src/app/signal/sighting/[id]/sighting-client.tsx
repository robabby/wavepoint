"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2, Pencil, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { MoodOption } from "@/lib/signal/schemas";
import {
  useSighting,
  useDeleteSighting,
  useUpdateSighting,
  useRegenerateInterpretation,
  useAdjacentSightings,
} from "@/hooks/signal";
import {
  InterpretationCard,
  SignalBackground,
  SacredSpinner,
  DeleteDialog,
} from "@/components/signal";

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

interface SightingClientProps {
  params: Promise<{ id: string }>;
}

export function SightingClient({ params }: SightingClientProps) {
  const { id } = use(params);
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNote, setEditNote] = useState("");
  const [editMoods, setEditMoods] = useState<string[]>([]);

  const { sighting, isLoading, isError } = useSighting(id);
  const { deleteSighting, isDeleting } = useDeleteSighting();
  const { updateSighting, isUpdating } = useUpdateSighting();
  const { regenerate, isRegenerating } = useRegenerateInterpretation();
  const { prevId, nextId } = useAdjacentSightings(id);

  const handleRegenerate = useCallback(async () => {
    await regenerate(id);
  }, [regenerate, id]);

  const handleStartEdit = useCallback(() => {
    if (!sighting) return;
    setEditNote(sighting.note ?? "");
    setEditMoods(sighting.moodTags ?? []);
    setIsEditing(true);
  }, [sighting]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditNote("");
    setEditMoods([]);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    await updateSighting({
      id,
      input: {
        note: editNote || undefined,
        moodTags: editMoods.length > 0 ? (editMoods as MoodOption[]) : undefined,
      },
    });
    setIsEditing(false);
  }, [updateSighting, id, editNote, editMoods]);

  const handleToggleMood = useCallback((moodId: string) => {
    setEditMoods((prev) => {
      if (prev.includes(moodId)) {
        return prev.filter((m) => m !== moodId);
      }
      if (prev.length < MAX_MOOD_SELECTIONS) {
        return [...prev, moodId];
      }
      return prev;
    });
  }, []);

  const handleDelete = useCallback(async () => {
    try {
      await deleteSighting(id);
      router.push("/signal");
    } catch {
      // Error is exposed via hook's error state
      // Dialog remains open so user can retry or cancel
    }
  }, [deleteSighting, id, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SacredSpinner size="lg" label="Loading sighting..." />
      </div>
    );
  }

  if (isError || !sighting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Sighting not found</p>
        <Link
          href="/signal"
          className="text-[var(--color-gold)] hover:underline"
        >
          Return to Signal
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <SignalBackground />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border-gold)]/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Link
              href="/signal"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Prev/Next navigation */}
            <div className="ml-4 flex items-center gap-1 border-l border-[var(--border-gold)]/20 pl-4">
              {prevId ? (
                <Link
                  href={`/signal/sighting/${prevId}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground"
                  aria-label="Previous sighting"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              ) : (
                <span className="rounded-lg p-1.5 text-muted-foreground/30">
                  <ChevronLeft className="h-5 w-5" />
                </span>
              )}
              {nextId ? (
                <Link
                  href={`/signal/sighting/${nextId}`}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground"
                  aria-label="Next sighting"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              ) : (
                <span className="rounded-lg p-1.5 text-muted-foreground/30">
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card/50 hover:text-foreground disabled:opacity-50"
                  aria-label="Cancel editing"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] disabled:opacity-50"
                  aria-label="Save changes"
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleStartEdit}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card/50 hover:text-[var(--color-gold)]"
                  aria-label="Edit sighting"
                >
                  <Pencil className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-card/50 hover:text-[var(--color-gold)] disabled:opacity-50"
                  aria-label="Regenerate interpretation"
                >
                  <RefreshCw
                    className={`h-5 w-5 ${isRegenerating ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete sighting"
                >
                  <Trash2 className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Number Display */}
        <div className="mb-8 text-center">
          <Link
            href={`/numbers/${sighting.number}`}
            className="font-display text-6xl text-[var(--color-gold)] transition-all duration-300 hover:text-[var(--color-gold-bright)]"
            style={{ textShadow: "0 0 40px var(--glow-gold)" }}
          >
            {sighting.number}
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(sighting.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* Mood tags */}
        {isEditing ? (
          <div className="mb-6">
            <p className="mb-2 text-center text-sm text-muted-foreground">
              Select up to {MAX_MOOD_SELECTIONS} moods
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {MOODS.map((mood) => {
                const isSelected = editMoods.includes(mood.id);
                const isDisabled =
                  !isSelected && editMoods.length >= MAX_MOOD_SELECTIONS;

                return (
                  <button
                    key={mood.id}
                    onClick={() => handleToggleMood(mood.id)}
                    disabled={isDisabled || isUpdating}
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
          </div>
        ) : (
          sighting.moodTags &&
          sighting.moodTags.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {sighting.moodTags.map((mood) => (
                <span
                  key={mood}
                  className="rounded-full border border-[var(--border-gold)]/30 px-3 py-1 text-sm text-muted-foreground"
                >
                  {mood}
                </span>
              ))}
            </div>
          )
        )}

        {/* Note */}
        {isEditing ? (
          <div className="mb-6">
            <label className="mb-2 block text-sm text-muted-foreground">
              Note (optional)
            </label>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              disabled={isUpdating}
              placeholder="Add a note about this moment..."
              maxLength={500}
              rows={3}
              className={cn(
                "w-full rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4",
                "text-foreground placeholder:text-muted-foreground",
                "focus:border-[var(--color-gold)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-gold)]/20",
                "disabled:opacity-50"
              )}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {editNote.length}/500
            </p>
          </div>
        ) : (
          sighting.note && (
            <div className="mb-6 rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
              <p className="italic text-foreground">
                &ldquo;{sighting.note}&rdquo;
              </p>
            </div>
          )
        )}

        {/* Interpretation */}
        <section>
          <h2 className="mb-4 font-heading text-lg text-foreground">
            Interpretation
          </h2>
          <InterpretationCard
            content={sighting.interpretation?.content ?? null}
            isLoading={isRegenerating}
            isFallback={sighting.interpretation?.model === "fallback"}
            onRegenerate={handleRegenerate}
            canRegenerate={!isRegenerating}
          />
        </section>
      </main>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Sighting"
        description={`Are you sure you want to delete this sighting of ${sighting.number}? This action cannot be undone.`}
      />
    </div>
  );
}
