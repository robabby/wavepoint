import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlanetGlyph } from "./PlanetGlyph";
import type { PlanetPageData } from "@/lib/astrology/planets";

interface PlanetHeroProps {
  /** Planet data */
  planet: PlanetPageData;
  /** Optional className */
  className?: string;
}

/**
 * Hero section for planet detail page.
 * Large glyph with radial aura and quick facts bar.
 */
export function PlanetHero({ planet, className }: PlanetHeroProps) {
  return (
    <header
      className={cn(
        "relative mb-12 flex flex-col items-center text-center",
        className
      )}
    >
      {/* Back link */}
      <Link
        href="/astrology/planets"
        className="mb-6 text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
      >
        ← Planets
      </Link>

      {/* Glyph with radial glow */}
      <div className="relative mb-6">
        {/* Radial gradient aura */}
        <div
          className={cn(
            "absolute inset-0 -m-8 rounded-full opacity-30",
            "bg-[radial-gradient(circle,var(--color-gold)_0%,transparent_70%)]"
          )}
          aria-hidden="true"
        />
        <PlanetGlyph glyph={planet.glyph} size="hero" />
      </div>

      {/* Planet name */}
      <h1 className="mb-2 font-display text-4xl tracking-widest text-[var(--color-gold)] sm:text-5xl">
        {planet.name.toUpperCase()}
      </h1>

      {/* Archetype */}
      <p className="mb-6 font-heading text-lg text-[var(--color-gold-bright)]">
        {planet.archetype}
      </p>

      {/* Quick facts bar */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* Digit */}
        <QuickFactBadge label="Number" value={planet.numerology.digit.toString()} />

        {/* Element */}
        <QuickFactBadge label="Element" value={planet.element} />

        {/* Day (if classical) */}
        {planet.dayOfWeek && (
          <QuickFactBadge label="Day" value={planet.dayOfWeek} />
        )}

        {/* Metal (if classical) */}
        {planet.metal && (
          <QuickFactBadge label="Metal" value={planet.metal} />
        )}

        {/* Signs ruled */}
        {planet.rulerships.length > 0 && (
          <QuickFactBadge
            label="Rules"
            value={planet.rulerships.map((r) => r.sign).join(", ")}
          />
        )}
      </div>
    </header>
  );
}

interface QuickFactBadgeProps {
  label: string;
  value: string;
}

function QuickFactBadge({ label, value }: QuickFactBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full",
        "border border-[var(--color-gold)]/20 bg-card/30 px-3 py-1.5"
      )}
    >
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium capitalize text-foreground">
        {value}
      </span>
    </div>
  );
}
