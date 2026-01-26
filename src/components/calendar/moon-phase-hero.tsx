"use client";

import { motion } from "motion/react";
import {
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getMoonPhaseGlow,
  getSignGlyph,
  formatDegree,
  type MoonPhase,
} from "@/lib/signal/cosmic-context";
import type { ZodiacSign } from "@/lib/astrology/constants";

interface MoonPhaseHeroProps {
  /** Moon phase */
  phase: MoonPhase;
  /** Moon's zodiac sign */
  sign: ZodiacSign;
  /** Moon's degree within sign */
  degree: number;
  /** Optional className */
  className?: string;
}

/**
 * Large moon phase hero display for day view.
 *
 * Reuses the atmospheric glow pattern from dashboard cosmic context card.
 */
export function MoonPhaseHero({ phase, sign, degree, className }: MoonPhaseHeroProps) {
  const phaseGlow = getMoonPhaseGlow(phase);

  return (
    <div className={className}>
      {/* Atmospheric Background Layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Moon glow - large, soft */}
        <motion.div
          className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
          style={{ background: phaseGlow }}
          animate={{
            opacity: [0.4, 0.5, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {/* Secondary glow - smaller, brighter core */}
        <motion.div
          className="absolute left-1/2 top-8 h-32 w-32 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: phaseGlow }}
          animate={{
            opacity: [0.5, 0.65, 0.5],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-8 md:py-12">
        {/* Moon emoji with glow */}
        <motion.span
          className="text-7xl md:text-8xl"
          style={{
            filter: `drop-shadow(0 0 30px ${phaseGlow})`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          role="img"
          aria-label={getMoonPhaseName(phase)}
        >
          {getMoonPhaseEmoji(phase)}
        </motion.span>

        {/* Phase name */}
        <motion.h2
          className="mt-4 font-heading text-xl uppercase tracking-[0.2em] text-[var(--color-gold-bright)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {getMoonPhaseName(phase)}
        </motion.h2>

        {/* Sign and degree */}
        <motion.p
          className="mt-2 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="text-[var(--color-gold)]">{getSignGlyph(sign)}</span>{" "}
          {sign.charAt(0).toUpperCase() + sign.slice(1)} {formatDegree(degree)}
        </motion.p>
      </div>
    </div>
  );
}
