"use client";

import { type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { MetatronsCube } from "@/components/geometry/metatrons-cube";
import { EASE_EMERGENCE, TIMING } from "@/lib/animation-constants";
import { cn } from "@/lib/utils";

/**
 * AboutHero - Split layout hero with animated Metatron's Cube
 *
 * Left side: Headline text staggered word-by-word
 * Right side: Animated Metatron's Cube with slow rotation
 * Includes parallax scroll effect and responsive behavior
 */

interface AboutHeroProps {
  className?: string;
}

// Word animation variants for staggered entrance
const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_EMERGENCE,
    },
  },
};

// Container variants for stagger coordination
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

// Tagline variants
const taglineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: EASE_EMERGENCE,
    },
  },
};

// Geometry container variants
const geometryVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.emergence,
      ease: EASE_EMERGENCE,
    },
  },
};

// Animated word component
function AnimatedWord({ children }: { children: ReactNode }) {
  return (
    <motion.span
      variants={wordVariants}
      className="block"
    >
      {children}
    </motion.span>
  );
}

export function AboutHero({ className }: AboutHeroProps) {
  const { scrollY } = useScroll();

  // Parallax effects
  const textY = useTransform(scrollY, [0, 500], [0, 50]);
  const geometryY = useTransform(scrollY, [0, 500], [0, 30]);
  const geometryScale = useTransform(scrollY, [0, 500], [1, 0.85]);
  const geometryOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  return (
    <section
      className={cn(
        "relative min-h-[85vh] overflow-hidden",
        className
      )}
    >
      {/* Gold gradient divider - diagonal line */}
      <div
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 opacity-20 max-lg:hidden"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--color-gold), transparent)",
        }}
      />

      <div className="container mx-auto flex min-h-[85vh] flex-col items-center px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8 lg:py-24">
        {/* Left side: Text content */}
        <motion.div
          className="relative z-10 flex flex-1 flex-col justify-center text-center lg:text-left"
          style={{ y: textY }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Headline - stacked words */}
          <h1 className="font-display text-hero tracking-tight">
            <AnimatedWord>
              <span className="text-foreground">GEOMETRY</span>
            </AnimatedWord>
            <AnimatedWord>
              <span className="text-foreground">IS A</span>
            </AnimatedWord>
            <AnimatedWord>
              <span className="text-[var(--color-gold)]">LANGUAGE.</span>
            </AnimatedWord>
          </h1>

          {/* Tagline */}
          <motion.p
            className="mt-6 font-heading text-xl text-muted-foreground sm:text-2xl lg:mt-8"
            variants={taglineVariants}
          >
            We&apos;re learning to listen.
          </motion.p>
        </motion.div>

        {/* Right side: Animated Metatron's Cube */}
        <motion.div
          className="relative flex flex-1 items-center justify-center py-12 lg:py-0"
          style={{
            y: geometryY,
            scale: geometryScale,
            opacity: geometryOpacity,
          }}
          initial="hidden"
          animate="visible"
          variants={geometryVariants}
        >
          {/* Slow rotation wrapper */}
          <motion.div
            className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 120,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <MetatronsCube />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade for transition */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(to top, var(--background), transparent)",
        }}
      />
    </section>
  );
}

export default AboutHero;
