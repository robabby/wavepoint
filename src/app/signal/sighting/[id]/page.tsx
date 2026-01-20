"use client";

import { use, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  useSighting,
  useDeleteSighting,
  useRegenerateInterpretation,
} from "@/hooks/signal";
import {
  InterpretationCard,
  SignalBackground,
  SacredSpinner,
  DeleteDialog,
} from "@/components/signal";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SightingDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { sighting, isLoading, isError } = useSighting(id);
  const { deleteSighting, isDeleting } = useDeleteSighting();
  const { regenerate, isRegenerating } = useRegenerateInterpretation();

  const handleRegenerate = useCallback(async () => {
    await regenerate(id);
  }, [regenerate, id]);

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
        <p className="text-[var(--color-dim)]">Sighting not found</p>
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
      <header className="sticky top-0 z-20 border-b border-[var(--border-gold)]/20 bg-[var(--color-obsidian)]/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            href="/signal"
            className="flex items-center gap-2 text-[var(--color-dim)] transition-colors hover:text-[var(--color-cream)]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="rounded-lg p-2 text-[var(--color-dim)] transition-colors hover:bg-[var(--color-warm-charcoal)]/50 hover:text-[var(--color-gold)] disabled:opacity-50"
              aria-label="Regenerate interpretation"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRegenerating ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg p-2 text-[var(--color-dim)] transition-colors hover:bg-red-500/10 hover:text-red-400"
              aria-label="Delete sighting"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="container relative z-10 mx-auto max-w-2xl px-4 py-8">
        {/* Number Display */}
        <div className="mb-8 text-center">
          <span
            className="font-display text-6xl text-[var(--color-gold)]"
            style={{ textShadow: "0 0 40px var(--glow-gold)" }}
          >
            {sighting.number}
          </span>
          <p className="mt-2 text-sm text-[var(--color-dim)]">
            {formatDistanceToNow(new Date(sighting.timestamp), {
              addSuffix: true,
            })}
          </p>
        </div>

        {/* Mood tags */}
        {sighting.moodTags && sighting.moodTags.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {sighting.moodTags.map((mood) => (
              <span
                key={mood}
                className="rounded-full border border-[var(--border-gold)]/30 px-3 py-1 text-sm text-[var(--color-warm-gray)]"
              >
                {mood}
              </span>
            ))}
          </div>
        )}

        {/* Note */}
        {sighting.note && (
          <div className="mb-6 rounded-xl border border-[var(--border-gold)]/20 bg-[var(--color-warm-charcoal)]/30 p-4">
            <p className="italic text-[var(--color-cream)]">
              &ldquo;{sighting.note}&rdquo;
            </p>
          </div>
        )}

        {/* Interpretation */}
        <section>
          <h2 className="mb-4 font-heading text-lg text-[var(--color-cream)]">
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
