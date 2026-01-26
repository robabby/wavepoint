"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeUpVariants } from "./animation-config";
// Import directly from cosmic-context to avoid pulling in server-side modules
import {
  type DashboardCosmicContext,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getMoonPhaseGlow,
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
} from "@/lib/signal/cosmic-context";
import { ASPECT_META, PLANET_META, type ZodiacSign, type AspectType } from "@/lib/astrology/constants";

// =============================================================================
// Types
// =============================================================================

export interface DashboardCosmicContextCardProps {
  /** The cosmic context data to display */
  cosmicContext: DashboardCosmicContext | null;
  /** Loading state */
  isLoading: boolean;
  /** Fetching state (for refresh indicator) */
  isFetching?: boolean;
  /** Error state */
  isError: boolean;
  /** Error message */
  error?: string | null;
  /** Refresh callback */
  onRefresh: () => void;
  /** Optional className */
  className?: string;
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Cosmic Context Card for Signal Dashboard.
 *
 * Displays the current state of the sky with Moon as the visual hero.
 * Features atmospheric glow effects, sign transitions, and all planetary positions.
 */
export function DashboardCosmicContextCard({
  cosmicContext,
  isLoading,
  isFetching = false,
  isError,
  error,
  onRefresh,
  className,
}: DashboardCosmicContextCardProps) {
  // Loading state
  if (isLoading) {
    return <CosmicContextSkeleton className={className} />;
  }

  // Error state
  if (isError || !cosmicContext) {
    return (
      <div
        className={cn(
          "rounded-xl border border-[var(--border-gold)]/20 bg-card/40",
          "backdrop-blur-sm p-6 md:p-8",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-4">
            {error ?? "Unable to load cosmic context"}
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-[var(--color-gold)]/50 hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, aspects, transitions, calculatedAt } = cosmicContext;
  const phaseGlow = getMoonPhaseGlow(moon.phase);

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative overflow-hidden rounded-xl",
        "border border-[var(--border-gold)]/20 bg-card/40",
        "backdrop-blur-sm",
        className
      )}
    >
      {/* Atmospheric Background Layers */}
      <div className="pointer-events-none absolute inset-0">
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

      <div className="relative z-10 p-6 md:p-8">
        {/* Moon Hero Section */}
        <MoonHero
          moon={moon}
          phaseGlow={phaseGlow}
          transition={transitions.moon}
        />

        {/* Sun + Personal Planets Row */}
        <div className="mt-6 grid gap-6 border-t border-[var(--border-gold)]/10 pt-6 md:grid-cols-2">
          <SunSection sun={sun} transition={transitions.sun} />
          <PersonalPlanetsSection mercury={mercury} venus={venus} mars={mars} />
        </div>

        {/* Social + Generational + Aspects Row */}
        <div className="mt-6 grid gap-6 border-t border-[var(--border-gold)]/10 pt-6 md:grid-cols-3">
          <SocialPlanetsSection jupiter={jupiter} saturn={saturn} />
          <GenerationalPlanetsSection uranus={uranus} neptune={neptune} pluto={pluto} />
          <AspectsSection aspects={aspects} />
        </div>

        {/* Footer */}
        <Footer
          calculatedAt={calculatedAt}
          isFetching={isFetching}
          onRefresh={onRefresh}
        />
      </div>
    </motion.div>
  );
}

// =============================================================================
// Moon Hero Section
// =============================================================================

interface MoonHeroProps {
  moon: DashboardCosmicContext["moon"];
  phaseGlow: string;
  transition: DashboardCosmicContext["transitions"]["moon"];
}

function MoonHero({ moon, phaseGlow, transition }: MoonHeroProps) {
  return (
    <div className="flex flex-col items-center py-4 md:py-6">
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
        aria-label={getMoonPhaseName(moon.phase)}
      >
        {getMoonPhaseEmoji(moon.phase)}
      </motion.span>

      {/* Phase name */}
      <motion.span
        className="mt-3 font-heading text-xl uppercase tracking-[0.2em] text-[var(--color-gold-bright)] md:text-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
      >
        {getMoonPhaseName(moon.phase)}
      </motion.span>

      {/* Moon sign + degree */}
      <motion.span
        className="mt-1.5 text-base tracking-wide text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      >
        Moon in {getSignGlyph(moon.sign)} {capitalizeSign(moon.sign)} · {formatDegree(moon.degree)}
      </motion.span>

      {/* Transition pill */}
      {transition && (
        <TransitionPill
          label="Enters"
          nextSign={transition.nextSign}
          timestamp={transition.timestamp}
          className="mt-3"
        />
      )}
    </div>
  );
}

// =============================================================================
// Sun Section
// =============================================================================

interface SunSectionProps {
  sun: DashboardCosmicContext["sun"];
  transition: DashboardCosmicContext["transitions"]["sun"];
}

function SunSection({ sun, transition }: SunSectionProps) {
  return (
    <div>
      <SectionHeader>Sun</SectionHeader>
      <div className="flex items-center gap-3">
        {/* Sun glyph with golden glow */}
        <span
          className="text-5xl text-[var(--color-gold)]"
          style={{
            filter: "drop-shadow(0 0 12px rgba(212, 168, 75, 0.6))",
          }}
        >
          {getPlanetGlyph("sun")}
        </span>
        <div>
          <div className="font-heading text-lg text-foreground">
            {getSignGlyph(sun.sign)} {capitalizeSign(sun.sign)} {formatDegree(sun.degree)}
          </div>
          {transition && (
            <TransitionPill
              label="Enters"
              nextSign={transition.nextSign}
              timestamp={transition.timestamp}
              className="mt-1.5"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Personal Planets Section
// =============================================================================

interface PersonalPlanetsSectionProps {
  mercury: DashboardCosmicContext["mercury"];
  venus: DashboardCosmicContext["venus"];
  mars: DashboardCosmicContext["mars"];
}

function PersonalPlanetsSection({ mercury, venus, mars }: PersonalPlanetsSectionProps) {
  return (
    <div>
      <SectionHeader>Personal Planets</SectionHeader>
      <div className="flex flex-col gap-2">
        <PlanetWithName planet="mercury" sign={mercury.sign} degree={mercury.degree} isRetrograde={mercury.isRetrograde} />
        <PlanetWithName planet="venus" sign={venus.sign} degree={venus.degree} isRetrograde={venus.isRetrograde} />
        <PlanetWithName planet="mars" sign={mars.sign} degree={mars.degree} isRetrograde={mars.isRetrograde} />
      </div>
    </div>
  );
}

// =============================================================================
// Social Planets Section
// =============================================================================

interface SocialPlanetsSectionProps {
  jupiter: DashboardCosmicContext["jupiter"];
  saturn: DashboardCosmicContext["saturn"];
}

function SocialPlanetsSection({ jupiter, saturn }: SocialPlanetsSectionProps) {
  return (
    <div>
      <SectionHeader>Social</SectionHeader>
      <div className="flex flex-col gap-2">
        <PlanetWithName planet="jupiter" sign={jupiter.sign} degree={jupiter.degree} isRetrograde={jupiter.isRetrograde} />
        <PlanetWithName planet="saturn" sign={saturn.sign} degree={saturn.degree} isRetrograde={saturn.isRetrograde} />
      </div>
    </div>
  );
}

// =============================================================================
// Generational Planets Section
// =============================================================================

interface GenerationalPlanetsSectionProps {
  uranus: DashboardCosmicContext["uranus"];
  neptune: DashboardCosmicContext["neptune"];
  pluto: DashboardCosmicContext["pluto"];
}

function GenerationalPlanetsSection({ uranus, neptune, pluto }: GenerationalPlanetsSectionProps) {
  return (
    <div>
      <SectionHeader>Generational</SectionHeader>
      <div className="flex flex-col gap-2">
        <PlanetWithName planet="uranus" sign={uranus.sign} compact />
        <PlanetWithName planet="neptune" sign={neptune.sign} compact />
        <PlanetWithName planet="pluto" sign={pluto.sign} compact />
      </div>
    </div>
  );
}

// =============================================================================
// Aspects Section
// =============================================================================

interface AspectsSectionProps {
  aspects: DashboardCosmicContext["aspects"];
}

function AspectsSection({ aspects }: AspectsSectionProps) {
  if (aspects.length === 0) {
    return (
      <div>
        <SectionHeader>Active Aspects</SectionHeader>
        <p className="text-xs text-muted-foreground/60">No exact aspects right now</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader>Active Aspects</SectionHeader>
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none md:overflow-visible">
        {aspects.slice(0, 6).map((aspect, i) => (
          <AspectBadge key={i} aspect={aspect} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Footer
// =============================================================================

interface FooterProps {
  calculatedAt: string;
  isFetching: boolean;
  onRefresh: () => void;
}

function Footer({ calculatedAt, isFetching, onRefresh }: FooterProps) {
  const timeAgo = useRelativeTime(calculatedAt);

  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--border-gold)]/10 pt-4">
      <span className="text-[10px] text-muted-foreground/40">
        Updated {timeAgo}
      </span>
      <button
        onClick={onRefresh}
        disabled={isFetching}
        className="group inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-1 text-xs text-muted-foreground/60 transition-all hover:border-[var(--color-gold)]/20 hover:text-muted-foreground disabled:cursor-not-allowed"
        aria-label="Refresh cosmic context"
      >
        <RefreshCw
          className={cn(
            "h-3 w-3 transition-transform group-hover:text-[var(--color-gold)]",
            isFetching && "animate-spin"
          )}
        />
      </button>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
      {children}
    </h4>
  );
}

interface PlanetWithNameProps {
  planet: string;
  sign: ZodiacSign;
  degree?: number;
  isRetrograde?: boolean;
  compact?: boolean;
}

/**
 * Planet display with glyph + name + "in" + sign glyph + sign name + optional degree
 * Format: ♃ Jupiter in ♋ Cancer 15°
 */
function PlanetWithName({ planet, sign, degree, isRetrograde, compact }: PlanetWithNameProps) {
  const glyph = getPlanetGlyph(planet);
  const signGlyph = getSignGlyph(sign);
  const planetMeta = PLANET_META[planet as keyof typeof PLANET_META];
  const planetName = planetMeta?.name ?? capitalizeSign(planet);

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5",
      compact ? "text-xs" : "text-sm"
    )}>
      <span className="text-[var(--color-gold)]">{glyph}</span>
      <span className="text-muted-foreground">{planetName}</span>
      <span className="text-muted-foreground/60">in</span>
      <span className="text-[var(--color-gold)]">{signGlyph}</span>
      <span className="text-muted-foreground">
        {capitalizeSign(sign)}
        {degree !== undefined && ` ${Math.floor(degree)}°`}
      </span>
      {isRetrograde && (
        <span className="text-xs text-[var(--color-copper)]" title="Retrograde">
          ℞
        </span>
      )}
    </span>
  );
}

interface AspectBadgeProps {
  aspect: {
    planet1: string;
    planet2: string;
    type: string;
    orb: number;
  };
}

function AspectBadge({ aspect }: AspectBadgeProps) {
  const p1Glyph = getPlanetGlyph(aspect.planet1);
  const p2Glyph = getPlanetGlyph(aspect.planet2);
  const aspectSymbol = getAspectSymbol(aspect.type as AspectType);
  const aspectMeta = ASPECT_META[aspect.type as AspectType];

  // Get planet names for tooltip
  const p1Meta = PLANET_META[aspect.planet1 as keyof typeof PLANET_META];
  const p2Meta = PLANET_META[aspect.planet2 as keyof typeof PLANET_META];
  const p1Name = p1Meta?.name ?? capitalizeSign(aspect.planet1);
  const p2Name = p2Meta?.name ?? capitalizeSign(aspect.planet2);

  // Color based on aspect nature
  const borderColor = useMemo(() => {
    switch (aspectMeta?.nature) {
      case "harmonious":
        return "border-emerald-500/30";
      case "challenging":
        return "border-[var(--color-copper)]/30";
      default:
        return "border-[var(--color-gold)]/30";
    }
  }, [aspectMeta?.nature]);

  const tooltipText = `${p1Name} ${aspectMeta?.name ?? aspect.type} ${p2Name} (${aspect.orb}° orb)`;

  return (
    <span className="group relative inline-block">
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs",
          "bg-card/50 text-muted-foreground transition-all cursor-default",
          "group-hover:translate-y-[-1px] group-hover:shadow-sm",
          borderColor
        )}
      >
        <span className="text-[var(--color-gold)]">{p1Glyph}</span>
        <span>{aspectSymbol}</span>
        <span className="text-[var(--color-gold)]">{p2Glyph}</span>
      </span>
      {/* Custom tooltip */}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {tooltipText}
        {/* Arrow */}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-popover" />
      </span>
    </span>
  );
}

interface TransitionPillProps {
  label: string;
  nextSign: ZodiacSign;
  timestamp: string;
  className?: string;
}

function TransitionPill({ label, nextSign, timestamp, className }: TransitionPillProps) {
  const formattedTime = useFormattedTransitionTime(timestamp);
  const isImminent = useIsImminent(timestamp, 2 * 60 * 60 * 1000); // 2 hours

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20",
        "text-xs font-medium text-muted-foreground",
        isImminent && "animate-pulse border-[var(--color-gold)]/40",
        className
      )}
    >
      <span className="text-[var(--color-gold)]">→</span>
      {label} {capitalizeSign(nextSign)}
      <span className="text-muted-foreground/70">·</span>
      {formattedTime}
    </motion.span>
  );
}

// =============================================================================
// Loading Skeleton
// =============================================================================

function CosmicContextSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border-gold)]/20 bg-card/40 p-6 md:p-8",
        className
      )}
    >
      {/* Moon hero skeleton */}
      <div className="flex flex-col items-center py-4 md:py-6">
        <div className="h-20 w-20 animate-pulse rounded-full bg-card" />
        <div className="mt-4 h-6 w-36 animate-pulse rounded bg-card" />
        <div className="mt-2 h-4 w-44 animate-pulse rounded bg-card" />
      </div>

      {/* Sun + Personal planets skeleton */}
      <div className="mt-6 grid gap-6 border-t border-[var(--border-gold)]/10 pt-6 md:grid-cols-2">
        <div>
          <div className="mb-2 h-3 w-12 animate-pulse rounded bg-card" />
          <div className="h-6 w-32 animate-pulse rounded bg-card" />
        </div>
        <div>
          <div className="mb-2 h-3 w-24 animate-pulse rounded bg-card" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-5 w-20 animate-pulse rounded bg-card"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Social + Generational + Aspects skeleton */}
      <div className="mt-6 grid gap-6 border-t border-[var(--border-gold)]/10 pt-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mb-2 h-3 w-16 animate-pulse rounded bg-card" />
            <div className="flex gap-3">
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="h-5 w-16 animate-pulse rounded bg-card"
                  style={{ animationDelay: `${(i * 2 + j) * 75}ms` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Format timestamp relative to now (e.g., "2m ago", "1h ago")
 */
function useRelativeTime(timestamp: string): string {
  const [timeAgo, setTimeAgo] = useState(() => getRelativeTime(timestamp));

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTimeAgo(getRelativeTime(timestamp));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return timeAgo;
}

function getRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / (60 * 1000));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Format transition timestamp for user's timezone.
 * Computes directly without state to avoid effect issues.
 */
function useFormattedTransitionTime(timestamp: string): string {
  return useMemo(() => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = diffMs / (24 * 60 * 60 * 1000);

    if (diffDays < 0) {
      return "Soon";
    }

    if (diffDays < 1) {
      return `Today, ${formatTime(date)}`;
    } else if (diffDays < 2) {
      return `Tomorrow, ${formatTime(date)}`;
    } else if (diffDays < 7) {
      const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
      return `${dayName}, ${formatTime(date)}`;
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  }, [timestamp]);
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Check if a timestamp is within a threshold from now
 */
function useIsImminent(timestamp: string, thresholdMs: number): boolean {
  const [isImminent, setIsImminent] = useState(false);

  useEffect(() => {
    const check = () => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      setIsImminent(diffMs > 0 && diffMs < thresholdMs);
    };

    check();
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, [timestamp, thresholdMs]);

  return isImminent;
}

// =============================================================================
// Helpers
// =============================================================================

function capitalizeSign(sign: string): string {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
}
