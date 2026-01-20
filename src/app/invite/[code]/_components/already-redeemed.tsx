"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { EASE_STANDARD } from "@/lib/animation-constants";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_STANDARD },
  },
};

/**
 * Already Redeemed Component
 *
 * Shown when the invite code has already been used.
 */
export function AlreadyRedeemed() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-obsidian)]">
      {/* Subtle radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(212, 168, 75, 0.03) 0%, transparent 50%)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md px-6 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative line */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 font-display text-page-title tracking-wide text-[var(--color-cream)]"
        >
          Already Used
        </motion.h1>

        {/* Message */}
        <motion.p
          variants={itemVariants}
          className="mb-10 text-lg text-[var(--color-warm-gray)]"
        >
          This invitation has already been redeemed.
        </motion.p>

        {/* Sign in button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/?auth=sign-in"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-8 py-3 font-medium text-[var(--color-obsidian)] transition-all duration-300 hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_20px_rgba(212,168,75,0.3)]"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Decorative line */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />
        </motion.div>
      </motion.div>
    </main>
  );
}
