"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignalBackground } from "./signal-background";
import { WaitlistModal } from "./waitlist-modal";

// Dynamic import with ssr: false to avoid hydration mismatch from Math.random()
const FloatingNumbers = dynamic(
  () => import("./floating-numbers").then((mod) => mod.FloatingNumbers),
  { ssr: false }
);

/**
 * Signal Marketing Page
 *
 * Hero-only landing page for Signal feature when disabled.
 * Design concept: "The Moment of Noticing" - embodies synchronicity.
 */
export function SignalMarketingPage() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Layered backgrounds */}
      <SignalBackground pulse />
      <FloatingNumbers />

      {/* Hero Section - Full screen centered */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Coming Soon badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-gold)]/40 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-[var(--color-gold)]" />
            Coming Soon
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl"
          style={{ textShadow: "0 0 60px var(--glow-gold)" }}
        >
          Notice the{" "}
          <span className="text-[var(--color-gold)]">Numbers</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 max-w-md text-lg text-muted-foreground"
        >
          The patterns that find you, remembered.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => setWaitlistOpen(true)}
            className={cn(
              "rounded-lg px-8 py-3 font-medium",
              "bg-[var(--color-gold)] text-primary-foreground",
              "transition-all duration-300",
              "hover:scale-[1.02] hover:bg-[var(--color-gold-bright)]",
              "hover:shadow-[0_0_30px_var(--glow-gold)]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            )}
          >
            Join the Waitlist
          </button>
        </motion.div>
      </section>

      {/* Waitlist Modal */}
      <WaitlistModal
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
        source="signal"
      />
    </div>
  );
}
