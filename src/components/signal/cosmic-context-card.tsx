"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { fadeUpVariants } from "./animation-config";
import {
  type CosmicContext,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
} from "@/lib/signal/cosmic-context";
import type { ZodiacSign } from "@/lib/astrology/constants";

export interface CosmicContextCardProps {
  /** The cosmic context data to display */
  cosmicContext: CosmicContext;
  /** Display variant - compact for capture result, expanded for sighting detail */
  variant?: "compact" | "expanded";
  /** Optional className for the container */
  className?: string;
}

/**
 * Displays the cosmic sky at a moment in time.
 *
 * Shows planetary positions, moon phase, and tight aspects.
 * Used on capture result screen (compact) and sighting detail (expanded).
 */
export function CosmicContextCard({
  cosmicContext,
  variant = "compact",
  className,
}: CosmicContextCardProps) {
  const { sun, moon, mercury, venus, mars, jupiter, saturn, aspects } = cosmicContext;

  if (variant === "compact") {
    return (
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "rounded-xl p-5",
          "border border-[var(--border-gold)]/20 bg-card/40",
          "backdrop-blur-sm",
          className
        )}
      >
        {/* Moon Phase Hero */}
        <div className="mb-4 flex flex-col items-center">
          <span
            className="text-4xl"
            style={{ filter: "drop-shadow(0 0 12px rgba(212, 168, 75, 0.4))" }}
            role="img"
            aria-label={getMoonPhaseName(moon.phase)}
          >
            {getMoonPhaseEmoji(moon.phase)}
          </span>
          <span className="mt-1 font-heading text-sm tracking-wide text-[var(--color-gold-bright)]">
            {getMoonPhaseName(moon.phase)}
          </span>
        </div>

        {/* Luminaries Row */}
        <div className="mb-3 flex justify-center gap-6 text-sm">
          <PlanetDisplay
            glyph={getPlanetGlyph("sun")}
            sign={sun.sign}
            degree={sun.degree}
          />
          <PlanetDisplay
            glyph={getPlanetGlyph("moon")}
            sign={moon.sign}
            degree={moon.degree}
          />
        </div>

        {/* Personal Planets Row */}
        <div className="mb-3 flex justify-center gap-4 text-sm">
          <PlanetDisplay
            glyph={getPlanetGlyph("mercury")}
            sign={mercury.sign}
            degree={mercury.degree}
            isRetrograde={mercury.isRetrograde}
          />
          <PlanetDisplay
            glyph={getPlanetGlyph("venus")}
            sign={venus.sign}
            degree={venus.degree}
            isRetrograde={venus.isRetrograde}
          />
          <PlanetDisplay
            glyph={getPlanetGlyph("mars")}
            sign={mars.sign}
            degree={mars.degree}
            isRetrograde={mars.isRetrograde}
          />
        </div>

        {/* Tight Aspects */}
        {aspects.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {aspects.slice(0, 4).map((aspect, i) => (
              <AspectBadge key={i} aspect={aspect} />
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // Expanded variant
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "rounded-xl",
        "border border-[var(--border-gold)]/20 bg-card/40",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-[var(--border-gold)]/10 px-5 py-3">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cosmic Context
        </h3>
      </div>

      <div className="p-5">
        {/* Moon Phase Hero */}
        <div className="mb-5 flex flex-col items-center">
          <span
            className="text-5xl"
            style={{ filter: "drop-shadow(0 0 16px rgba(212, 168, 75, 0.5))" }}
            role="img"
            aria-label={getMoonPhaseName(moon.phase)}
          >
            {getMoonPhaseEmoji(moon.phase)}
          </span>
          <span className="mt-2 font-heading text-base tracking-wide text-[var(--color-gold-bright)]">
            {getMoonPhaseName(moon.phase)}
          </span>
          <span className="text-sm text-muted-foreground">
            Moon in {capitalizeSign(moon.sign)}
          </span>
        </div>

        {/* Luminaries Section */}
        <section className="mb-4">
          <SectionHeader>Luminaries</SectionHeader>
          <div className="space-y-2">
            <PlanetRow
              glyph={getPlanetGlyph("sun")}
              name="Sun"
              sign={sun.sign}
              degree={sun.degree}
            />
            <PlanetRow
              glyph={getPlanetGlyph("moon")}
              name="Moon"
              sign={moon.sign}
              degree={moon.degree}
            />
          </div>
        </section>

        {/* Personal Planets Section */}
        <section className="mb-4">
          <SectionHeader>Personal Planets</SectionHeader>
          <div className="space-y-2">
            <PlanetRow
              glyph={getPlanetGlyph("mercury")}
              name="Mercury"
              sign={mercury.sign}
              degree={mercury.degree}
              isRetrograde={mercury.isRetrograde}
            />
            <PlanetRow
              glyph={getPlanetGlyph("venus")}
              name="Venus"
              sign={venus.sign}
              degree={venus.degree}
              isRetrograde={venus.isRetrograde}
            />
            <PlanetRow
              glyph={getPlanetGlyph("mars")}
              name="Mars"
              sign={mars.sign}
              degree={mars.degree}
              isRetrograde={mars.isRetrograde}
            />
          </div>
        </section>

        {/* Social Planets Section */}
        <section className="mb-4">
          <SectionHeader>Social Planets</SectionHeader>
          <div className="space-y-2">
            <PlanetRow
              glyph={getPlanetGlyph("jupiter")}
              name="Jupiter"
              sign={jupiter.sign}
              signOnly
            />
            <PlanetRow
              glyph={getPlanetGlyph("saturn")}
              name="Saturn"
              sign={saturn.sign}
              signOnly
            />
          </div>
        </section>

        {/* Aspects Section */}
        {aspects.length > 0 && (
          <section>
            <SectionHeader>Active Aspects (within 2°)</SectionHeader>
            <div className="flex flex-wrap gap-2">
              {aspects.map((aspect, i) => (
                <AspectBadge key={i} aspect={aspect} showOrb />
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
      {children}
    </h4>
  );
}

interface PlanetDisplayProps {
  glyph: string;
  sign: ZodiacSign;
  degree: number;
  isRetrograde?: boolean;
}

/** Compact inline planet display for compact variant */
function PlanetDisplay({ glyph, sign, degree, isRetrograde }: PlanetDisplayProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[var(--color-gold)]">{glyph}</span>
      <span className="text-muted-foreground">
        {getSignGlyph(sign)} {Math.floor(degree)}°
      </span>
      {isRetrograde && (
        <span className="text-xs text-[var(--color-copper)]" title="Retrograde">
          ℞
        </span>
      )}
    </div>
  );
}

interface PlanetRowProps {
  glyph: string;
  name: string;
  sign: ZodiacSign;
  degree?: number;
  isRetrograde?: boolean;
  signOnly?: boolean;
}

/** Full row planet display for expanded variant */
function PlanetRow({ glyph, name, sign, degree, isRetrograde, signOnly }: PlanetRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="w-5 text-center text-[var(--color-gold)]">{glyph}</span>
        <span className="text-foreground">{name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {signOnly ? (
          <span>
            in {capitalizeSign(sign)}
          </span>
        ) : (
          <span>
            {formatDegree(degree ?? 0)} {getSignGlyph(sign)} {capitalizeSign(sign)}
          </span>
        )}
        {isRetrograde && (
          <span className="text-[var(--color-copper)]" title="Retrograde">
            ℞
          </span>
        )}
      </div>
    </div>
  );
}

interface AspectBadgeProps {
  aspect: {
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  };
  showOrb?: boolean;
}

/** Badge pill for displaying an aspect */
function AspectBadge({ aspect, showOrb }: AspectBadgeProps) {
  const p1Glyph = getPlanetGlyph(aspect.planet1);
  const p2Glyph = getPlanetGlyph(aspect.planet2);
  const aspectSymbol = getAspectSymbol(aspect.type as Parameters<typeof getAspectSymbol>[0]);

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2.5 py-1 text-xs text-muted-foreground">
      <span className="text-[var(--color-gold)]">{p1Glyph}</span>
      <span>{aspectSymbol}</span>
      <span className="text-[var(--color-gold)]">{p2Glyph}</span>
      {showOrb && (
        <span className="ml-0.5 text-muted-foreground/60">{aspect.orb}°</span>
      )}
    </span>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function capitalizeSign(sign: string): string {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
}
