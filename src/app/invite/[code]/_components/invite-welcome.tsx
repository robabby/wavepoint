"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import type { Invite } from "@/lib/db/schema";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface InviteWelcomeProps {
  invite: Invite;
}

// Staggered entrance animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_STANDARD,
    },
  },
};

// Subtle pulse animation for the invite code glow
const glowVariants: Variants = {
  initial: {
    boxShadow: "0 0 20px rgba(212, 168, 75, 0.15), inset 0 0 20px rgba(212, 168, 75, 0.05)",
  },
  animate: {
    boxShadow: [
      "0 0 20px rgba(212, 168, 75, 0.15), inset 0 0 20px rgba(212, 168, 75, 0.05)",
      "0 0 40px rgba(212, 168, 75, 0.25), inset 0 0 30px rgba(212, 168, 75, 0.1)",
      "0 0 20px rgba(212, 168, 75, 0.15), inset 0 0 20px rgba(212, 168, 75, 0.05)",
    ],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

/**
 * Invite Welcome Component
 *
 * Ceremonial welcome design for valid invites.
 * Uses brand-aligned animations and atmospheric effects
 * to create a memorable first impression.
 */
export function InviteWelcome({ invite }: InviteWelcomeProps) {
  const signUpUrl = `/?auth=sign-up&invite=${encodeURIComponent(invite.code)}&email=${encodeURIComponent(invite.email)}`;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-obsidian)]">
      {/* Animated Seed of Life background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "min(140vw, 900px)",
            height: "min(140vw, 900px)",
            x: "-50%",
            y: "-50%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 180,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <Image
            src="/images/geometries/patterns/seed-of-life/seed-of-life-primary.svg"
            alt=""
            fill
            className="object-contain opacity-[0.06]"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(76%) sepia(30%) saturate(500%) hue-rotate(5deg) brightness(95%) contrast(90%)",
            }}
            priority
          />
        </motion.div>

        {/* Radial gradient overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(12, 12, 12, 0.6) 70%, rgba(12, 12, 12, 0.9) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-xl px-6 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative line above */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent" />
        </motion.div>

        {/* Eyebrow text */}
        <motion.p
          variants={itemVariants}
          className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-[var(--color-gold)]"
        >
          Private Access
        </motion.p>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 font-display text-hero tracking-wide text-[var(--color-cream)]"
        >
          You&apos;re In
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-12 font-heading text-xl text-[var(--color-warm-gray)] sm:text-2xl"
        >
          Welcome to WavePoint
        </motion.p>

        {/* Invite code display */}
        <motion.div variants={itemVariants} className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--color-dim)]">
            Your access code
          </p>
          <motion.div
            className="inline-block rounded-xl border border-[var(--color-gold)]/20 bg-[var(--color-warm-charcoal)]/40 px-8 py-4 backdrop-blur-sm"
            variants={glowVariants}
            initial="initial"
            animate="animate"
          >
            <span className="font-mono text-2xl tracking-[0.4em] text-[var(--color-gold)] sm:text-3xl">
              {invite.code}
            </span>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={itemVariants}>
          <Link
            href={signUpUrl}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-[var(--color-gold)] px-10 py-4 text-lg font-medium text-[var(--color-obsidian)] transition-all duration-300 hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_30px_rgba(212,168,75,0.4)]"
          >
            <span className="relative z-10">Accept Invitation</span>
          </Link>
        </motion.div>

        {/* Email hint */}
        <motion.div variants={itemVariants} className="mt-12">
          <p className="text-sm text-[var(--color-dim)]">
            This invitation was sent to
          </p>
          <p className="mt-1 font-medium text-[var(--color-warm-gray)]">
            {invite.email}
          </p>
        </motion.div>

        {/* Decorative line below */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent" />
        </motion.div>
      </motion.div>
    </main>
  );
}
