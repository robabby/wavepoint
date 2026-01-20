"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useCreateSighting } from "@/hooks/signal";
import type { MoodOption } from "@/lib/signal/schemas";
import {
  NumberPad,
  MoodSelector,
  NoteInput,
  StepIndicator,
  InterpretationCard,
  FirstCatchCelebration,
  SignalBackground,
  SubmitButton,
  stepTransition,
  getOrdinal,
} from "@/components/signal";

type WizardStep = "number" | "mood" | "note" | "result";

interface WizardState {
  number: string;
  moods: MoodOption[];
  note: string;
}

interface CaptureResult {
  sightingId: string;
  interpretation: string;
  isFirstCatch: boolean;
  count: number;
}

const stepTransitionVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function CapturePage() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("number");
  const [state, setState] = useState<WizardState>({
    number: "",
    moods: [],
    note: "",
  });
  const [result, setResult] = useState<CaptureResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const { createSighting, isCreating, error } = useCreateSighting();

  const handleNumberSubmit = useCallback((number: string) => {
    setState((prev) => ({ ...prev, number }));
    setStep("mood");
  }, []);

  const handleMoodChange = useCallback((moods: string[]) => {
    // MoodSelector returns string[], but we know they're valid MoodOptions
    setState((prev) => ({ ...prev, moods: moods as MoodOption[] }));
  }, []);

  const handleMoodContinue = useCallback(() => {
    setStep("note");
  }, []);

  const handleMoodSkip = useCallback(() => {
    setState((prev) => ({ ...prev, moods: [] }));
    setStep("note");
  }, []);

  const handleNoteChange = useCallback((note: string) => {
    setState((prev) => ({ ...prev, note }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await createSighting({
        number: state.number,
        moodTags: state.moods.length > 0 ? state.moods : undefined,
        note: state.note || undefined,
      });

      const captureResult: CaptureResult = {
        sightingId: response.sighting.id,
        interpretation: response.interpretation,
        isFirstCatch: response.isFirstCatch,
        count: response.count,
      };

      setResult(captureResult);

      if (response.isFirstCatch) {
        setShowCelebration(true);
      } else {
        setStep("result");
      }
    } catch {
      // Error is handled by hook
    }
  }, [createSighting, state]);

  const handleCelebrationDismiss = useCallback(() => {
    setShowCelebration(false);
    setStep("result");
  }, []);

  const handleViewCollection = useCallback(() => {
    router.push("/signal");
  }, [router]);

  const handleViewSighting = useCallback(() => {
    if (result?.sightingId) {
      router.push(`/signal/sighting/${result.sightingId}`);
    }
  }, [router, result]);

  const stepNumber = {
    number: 0,
    mood: 1,
    note: 2,
    result: 3,
  }[step];

  return (
    <div className="relative min-h-screen">
      <SignalBackground pulse={isCreating} />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[var(--border-gold)]/20 bg-[var(--color-obsidian)]/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link
            href="/signal"
            aria-label="Back to Signal dashboard"
            className="text-[var(--color-dim)] transition-colors hover:text-[var(--color-cream)]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="font-heading text-lg text-[var(--color-cream)]">
            Capture Signal
          </h1>
        </div>
        <div className="pb-4">
          <StepIndicator currentStep={stepNumber} totalSteps={4} />
        </div>
      </header>

      <main className="container relative z-10 mx-auto max-w-md px-4 py-8">
        <AnimatePresence mode="wait">
          {step === "number" && (
            <motion.div
              key="number"
              variants={stepTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              <NumberPad onSubmit={handleNumberSubmit} disabled={isCreating} />
            </motion.div>
          )}

          {step === "mood" && (
            <motion.div
              key="mood"
              variants={stepTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              <MoodSelector
                selected={state.moods}
                onChange={handleMoodChange}
                onSkip={handleMoodSkip}
              />
              {state.moods.length > 0 && (
                <div className="mt-6">
                  <SubmitButton onClick={handleMoodContinue}>
                    Continue
                  </SubmitButton>
                </div>
              )}
            </motion.div>
          )}

          {step === "note" && (
            <motion.div
              key="note"
              variants={stepTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
            >
              <NoteInput
                value={state.note}
                onChange={handleNoteChange}
                onSubmit={handleSubmit}
                isLoading={isCreating}
                error={error?.message}
              />
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              variants={stepTransitionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="space-y-6"
            >
              {/* Number display */}
              <div className="text-center">
                <span
                  className="font-display text-5xl text-[var(--color-gold)]"
                  style={{ textShadow: "0 0 40px var(--glow-gold)" }}
                >
                  {state.number}
                </span>
                <p className="mt-2 text-sm text-[var(--color-dim)]">
                  {result.count > 1
                    ? `This is your ${result.count}${getOrdinal(result.count)} time seeing this number`
                    : "Your first encounter with this number"}
                </p>
              </div>

              {/* Interpretation */}
              <InterpretationCard
                content={result.interpretation}
                isLoading={false}
                canRegenerate={false}
              />

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <SubmitButton onClick={handleViewCollection}>
                  View Collection
                </SubmitButton>
                <button
                  onClick={handleViewSighting}
                  className="w-full text-center text-sm text-[var(--color-dim)] transition-colors hover:text-[var(--color-cream)]"
                >
                  View this sighting
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* First Catch Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <FirstCatchCelebration
            number={state.number}
            onDismiss={handleCelebrationDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
