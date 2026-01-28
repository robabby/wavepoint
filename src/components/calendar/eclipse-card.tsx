"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { getSignGlyph, formatDegree } from "@/lib/signal/cosmic-context";
import { formatEclipseType } from "@/lib/eclipses";
import type { Eclipse } from "@/lib/eclipses";

interface EclipseCardProps {
  /** Eclipse data */
  eclipse: Eclipse;
  /** Optional className */
  className?: string;
}

// Violet color palette for eclipse theming
const ECLIPSE_VIOLET = "#a78bcd";
const ECLIPSE_VIOLET_BRIGHT = "#c4a8e8";

/**
 * Eclipse details card for day view.
 *
 * "Twilight Threshold" design — dramatic, atmospheric presentation with:
 * - Breathing animated violet glow (like Moon Phase Hero)
 * - Zodiac glyph as hero element with prominent glow
 * - Type badge as subtle label
 * - Rich astrological interpretation
 * - Elevated theme tags with glass effect
 *
 * Penumbral eclipses receive lighter visual treatment.
 */
export function EclipseCard({ eclipse, className }: EclipseCardProps) {
  const isPenumbral = eclipse.isPenumbral;

  // Capitalize sign name
  const signName = eclipse.sign.charAt(0).toUpperCase() + eclipse.sign.slice(1);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        "border backdrop-blur-md",
        className
      )}
      style={{
        borderColor: isPenumbral
          ? `${ECLIPSE_VIOLET}40`
          : `${ECLIPSE_VIOLET}60`,
        backgroundColor: isPenumbral
          ? `${ECLIPSE_VIOLET}10`
          : `${ECLIPSE_VIOLET}18`,
        boxShadow: isPenumbral
          ? `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 40px ${ECLIPSE_VIOLET}15`
          : `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 60px ${ECLIPSE_VIOLET}25`,
      }}
    >
      {/* Atmospheric Background Layers - breathing animation */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow - large, soft, breathing */}
        <motion.div
          className={cn(
            "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 rounded-full",
            isPenumbral ? "h-64 w-80 blur-[100px]" : "h-80 w-96 blur-[120px]"
          )}
          style={{ backgroundColor: ECLIPSE_VIOLET }}
          animate={{
            opacity: isPenumbral ? [0.25, 0.35, 0.25] : [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          aria-hidden="true"
        />
        {/* Secondary glow - brighter core, offset timing */}
        <motion.div
          className={cn(
            "absolute left-1/2 top-8 -translate-x-1/2 rounded-full blur-3xl",
            isPenumbral ? "h-24 w-32" : "h-32 w-40"
          )}
          style={{ backgroundColor: ECLIPSE_VIOLET_BRIGHT }}
          animate={{
            opacity: isPenumbral ? [0.3, 0.45, 0.3] : [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 0.5,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: isPenumbral
            ? `linear-gradient(to bottom, ${ECLIPSE_VIOLET}15 0%, transparent 50%, ${ECLIPSE_VIOLET}08 100%)`
            : `linear-gradient(to bottom, ${ECLIPSE_VIOLET}20 0%, transparent 50%, ${ECLIPSE_VIOLET}10 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Content with staggered entry */}
      <div className="relative z-10">
        {/* Type badge - subtle label above glyph */}
        <motion.div
          className="pt-6 text-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.12em]"
            style={{
              backgroundColor: isPenumbral
                ? `${ECLIPSE_VIOLET}20`
                : `${ECLIPSE_VIOLET}30`,
              color: isPenumbral ? `${ECLIPSE_VIOLET}cc` : ECLIPSE_VIOLET_BRIGHT,
              border: `1px solid ${isPenumbral ? `${ECLIPSE_VIOLET}30` : `${ECLIPSE_VIOLET}50`}`,
            }}
          >
            <span
              className="text-xs"
              style={{
                filter: isPenumbral
                  ? undefined
                  : `drop-shadow(0 0 6px ${ECLIPSE_VIOLET})`,
              }}
            >
              {eclipse.category === "solar" ? "☉" : "☽"}
            </span>
            {formatEclipseType(eclipse.type)}
          </span>
        </motion.div>

        {/* Zodiac glyph - hero element */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span
            className="text-5xl md:text-6xl"
            style={{
              color: isPenumbral ? `${ECLIPSE_VIOLET}b0` : ECLIPSE_VIOLET_BRIGHT,
              filter: isPenumbral
                ? `drop-shadow(0 0 12px ${ECLIPSE_VIOLET}80)`
                : `drop-shadow(0 0 20px ${ECLIPSE_VIOLET}) drop-shadow(0 0 40px ${ECLIPSE_VIOLET})`,
            }}
          >
            {getSignGlyph(eclipse.sign)}
          </span>
          <p className="text-sm text-muted-foreground mt-2">
            {formatDegree(eclipse.degree)} {signName}
          </p>
        </motion.div>

        {/* Title and essence */}
        <motion.div
          className="px-6 py-4 mt-2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="font-heading text-lg text-foreground">
            {eclipse.title}
          </h3>
          <p
            className="text-xs uppercase tracking-[0.15em] mt-1.5"
            style={{
              color: isPenumbral ? `${ECLIPSE_VIOLET}99` : ECLIPSE_VIOLET,
            }}
          >
            {eclipse.essence}
          </p>
        </motion.div>

        {/* Rich interpretation */}
        <motion.div
          className="px-6 pb-4 pt-4"
          style={{
            borderTop: `1px solid ${ECLIPSE_VIOLET}25`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground/90 leading-relaxed">
            {eclipse.interpretation}
          </p>
        </motion.div>

        {/* Theme tags with glass effect */}
        <div className="px-6 pb-6 flex flex-wrap justify-center gap-2">
          {eclipse.themes.map((theme, index) => (
            <motion.span
              key={theme}
              className="px-3 py-1.5 rounded-full text-xs backdrop-blur-sm"
              style={{
                backgroundColor: isPenumbral
                  ? `${ECLIPSE_VIOLET}18`
                  : `${ECLIPSE_VIOLET}25`,
                border: `1px solid ${isPenumbral ? `${ECLIPSE_VIOLET}25` : `${ECLIPSE_VIOLET}40`}`,
                color: isPenumbral ? `${ECLIPSE_VIOLET}b0` : ECLIPSE_VIOLET,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + index * 0.05,
              }}
            >
              {theme}
            </motion.span>
          ))}
        </div>

        {/* Saros cycle info - centered footer with violet tint */}
        <motion.div
          className="px-6 pb-5 pt-3 text-center"
          style={{
            borderTop: `1px solid ${ECLIPSE_VIOLET}15`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.12em]"
            style={{ color: `${ECLIPSE_VIOLET}80` }}
          >
            Saros {eclipse.saros} · {eclipse.timeUtc} UTC
          </p>
        </motion.div>
      </div>
    </div>
  );
}
