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
 * Invalid Invite Component
 *
 * Shown when the invite code doesn't exist in the database.
 */
export function InvalidInvite() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Subtle radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--glow-gold) 0%, transparent 50%)",
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
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 font-display text-page-title tracking-wide text-foreground"
        >
          Not Found
        </motion.h1>

        {/* Message */}
        <motion.p
          variants={itemVariants}
          className="mb-10 text-lg text-muted-foreground"
        >
          This invitation doesn&apos;t exist or has expired.
        </motion.p>

        {/* Return home button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-gold)]/30 bg-transparent px-8 py-3 font-medium text-foreground transition-all duration-300 hover:border-[var(--color-gold)]/60 hover:bg-[var(--color-gold)]/5"
          >
            Return Home
          </Link>
        </motion.div>

        {/* Decorative line */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent" />
        </motion.div>
      </motion.div>
    </main>
  );
}
