"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
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

// Gold color palette for moon theming
const MOON_GOLD = "#d4a84b";
const MOON_GOLD_BRIGHT = "#e8c068";

/**
 * Large moon phase hero display for day view.
 *
 * Atmospheric card with breathing golden glow that matches the Eclipse card's
 * visual presence. Self-contained card with border, background, and effects.
 */
export function MoonPhaseHero({ phase, sign, degree, className }: MoonPhaseHeroProps) {
  const phaseGlow = getMoonPhaseGlow(phase);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-md",
        className
      )}
      style={{
        border: `1px solid ${MOON_GOLD}50`,
        backgroundColor: `${MOON_GOLD}12`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 50px ${MOON_GOLD}20`,
      }}
    >
      {/* Atmospheric Background Layers - breathing animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow - large, soft, breathing */}
        <motion.div
          className="absolute left-1/2 top-0 h-80 w-96 -translate-x-1/2 -translate-y-1/4 rounded-full blur-[120px]"
          style={{ backgroundColor: phaseGlow }}
          animate={{
            opacity: [0.35, 0.55, 0.35],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {/* Secondary glow - brighter core, offset timing */}
        <motion.div
          className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl"
          style={{ backgroundColor: MOON_GOLD_BRIGHT }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.5,
          }}
        />
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${MOON_GOLD}18 0%, transparent 50%, ${MOON_GOLD}08 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-8 md:py-12">
        {/* Moon emoji with glow */}
        <motion.span
          className="text-7xl md:text-8xl"
          style={{
            filter: `drop-shadow(0 0 30px ${phaseGlow}) drop-shadow(0 0 60px ${phaseGlow})`,
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
          className="mt-4 font-heading text-xl uppercase tracking-[0.2em]"
          style={{ color: MOON_GOLD_BRIGHT }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {getMoonPhaseName(phase)}
        </motion.h2>

        {/* Sign and degree */}
        <motion.p
          className="mt-2 text-sm"
          style={{ color: MOON_GOLD }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span>{getSignGlyph(sign)}</span>{" "}
          {sign.charAt(0).toUpperCase() + sign.slice(1)} {formatDegree(degree)}
        </motion.p>
      </div>
    </div>
  );
}
