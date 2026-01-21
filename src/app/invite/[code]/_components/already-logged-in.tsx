"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { motion, type Variants } from "motion/react";
import type { Session } from "next-auth";
import type { Invite } from "@/lib/db/schema";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface AlreadyLoggedInProps {
  invite: Invite;
  session: Session;
}

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
 * Already Logged In Component
 *
 * Handles two cases:
 * 1. User's email matches invite email - show "You're already in"
 * 2. User's email doesn't match - offer sign out option
 */
export function AlreadyLoggedIn({ invite, session }: AlreadyLoggedInProps) {
  const userEmail = session.user?.email?.toLowerCase();
  const inviteEmail = invite.email.toLowerCase();
  const emailsMatch = userEmail === inviteEmail;

  // Case 1: Email matches - user already has access
  if (emailsMatch) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
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
              className="object-contain opacity-[0.06] svg-gold-muted"
              priority
            />
          </motion.div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, transparent 30%, color-mix(in srgb, var(--background) 60%, transparent) 70%, color-mix(in srgb, var(--background) 90%, transparent) 100%)",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 w-full max-w-md px-6 py-16 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative line */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent" />
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            variants={itemVariants}
            className="mb-4 font-heading text-sm uppercase tracking-[0.3em] text-[var(--color-gold)]"
          >
            Welcome Back
          </motion.p>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display text-page-title tracking-wide text-foreground"
          >
            You&apos;re Already In
          </motion.h1>

          {/* Message */}
          <motion.p
            variants={itemVariants}
            className="mb-10 text-lg text-muted-foreground"
          >
            Signed in as{" "}
            <span className="text-foreground">{session.user?.email}</span>
          </motion.p>

          {/* Continue button */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-10 py-4 text-lg font-medium text-primary-foreground transition-all duration-300 hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_30px_rgba(212,168,75,0.4)]"
            >
              Continue
            </Link>
          </motion.div>

          {/* Decorative line */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-gold)]/60 to-transparent" />
          </motion.div>
        </motion.div>
      </main>
    );
  }

  // Case 2: Email mismatch - offer to sign out
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
          <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 font-display text-page-title tracking-wide text-foreground"
        >
          Different Account
        </motion.h1>

        {/* Message */}
        <motion.div variants={itemVariants} className="mb-10">
          <p className="mb-2 text-muted-foreground">
            This invitation was sent to
          </p>
          <p className="mb-4 font-medium text-[var(--color-gold)]">
            {invite.email}
          </p>
          <p className="text-muted-foreground">
            You&apos;re signed in as{" "}
            <span className="text-foreground">{session.user?.email}</span>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <button
            onClick={() =>
              signOut({
                callbackUrl: `/invite/${invite.code}`,
              })
            }
            className="inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-8 py-3 font-medium text-primary-foreground transition-all duration-300 hover:bg-[var(--color-gold-bright)] hover:shadow-[0_0_20px_rgba(212,168,75,0.3)]"
          >
            Sign Out to Use Invite
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--color-gold)]/30 bg-transparent px-8 py-3 font-medium text-foreground transition-all duration-300 hover:border-[var(--color-gold)]/60 hover:bg-[var(--color-gold)]/5"
          >
            Continue as {session.user?.email?.split("@")[0]}
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
