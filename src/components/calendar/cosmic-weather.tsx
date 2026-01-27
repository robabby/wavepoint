"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
  type DashboardCosmicContext,
} from "@/lib/signal/cosmic-context";
import { getEclipseContext } from "@/lib/eclipses";
import type { ZodiacSign } from "@/lib/astrology/constants";

interface CosmicWeatherProps {
  /** Cosmic context data */
  context: DashboardCosmicContext;
  /** Date in YYYY-MM-DD format (for eclipse countdown) */
  date: string;
  /** Optional className */
  className?: string;
}

interface PlanetRowProps {
  glyph: string;
  name: string;
  sign: ZodiacSign;
  degree?: number;
  isRetrograde?: boolean;
}

function PlanetRow({ glyph, name, sign, degree, isRetrograde }: PlanetRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[var(--color-gold)] text-sm">{glyph}</span>
        <span className="text-sm text-foreground">{name}</span>
        {isRetrograde && (
          <span className="text-[10px] text-muted-foreground/60">℞</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="text-[var(--color-gold)]">{getSignGlyph(sign)}</span>
        <span>{sign.charAt(0).toUpperCase() + sign.slice(1)}</span>
        {degree !== undefined && (
          <span className="text-muted-foreground/60">{formatDegree(degree)}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Cosmic weather display for day view.
 *
 * Shows planetary positions, tight aspects, and approaching eclipse countdown.
 */
export function CosmicWeather({ context, date, className }: CosmicWeatherProps) {
  const { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, aspects } =
    context;

  // Get eclipse context for countdown (only show within 30 days)
  const eclipseContext = getEclipseContext(date);
  const { nextEclipse, daysUntilNext } = eclipseContext;
  const showEclipseCountdown = daysUntilNext !== null && daysUntilNext <= 30 && daysUntilNext > 0;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Luminaries */}
      <section>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Luminaries
        </h3>
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
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

      {/* Personal Planets */}
      <section>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Personal Planets
        </h3>
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
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

      {/* Social Planets */}
      <section>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Social Planets
        </h3>
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
          <PlanetRow
            glyph={getPlanetGlyph("jupiter")}
            name="Jupiter"
            sign={jupiter.sign}
            degree={jupiter.degree}
            isRetrograde={jupiter.isRetrograde}
          />
          <PlanetRow
            glyph={getPlanetGlyph("saturn")}
            name="Saturn"
            sign={saturn.sign}
            degree={saturn.degree}
            isRetrograde={saturn.isRetrograde}
          />
        </div>
      </section>

      {/* Generational Planets */}
      <section>
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Generational Planets
        </h3>
        <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
          <PlanetRow
            glyph={getPlanetGlyph("uranus")}
            name="Uranus"
            sign={uranus.sign}
          />
          <PlanetRow
            glyph={getPlanetGlyph("neptune")}
            name="Neptune"
            sign={neptune.sign}
          />
          <PlanetRow
            glyph={getPlanetGlyph("pluto")}
            name="Pluto"
            sign={pluto.sign}
          />
        </div>
      </section>

      {/* Tight Aspects */}
      {aspects.length > 0 && (
        <section>
          <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
            Active Aspects
          </h3>
          <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/40 backdrop-blur-sm p-4">
            {aspects.map((aspect, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--color-gold)]">
                    {getPlanetGlyph(aspect.planet1)}
                  </span>
                  <span className="text-muted-foreground">
                    {getAspectSymbol(aspect.type)}
                  </span>
                  <span className="text-[var(--color-gold)]">
                    {getPlanetGlyph(aspect.planet2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground/60">
                  {aspect.orb.toFixed(1)}° orb
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Approaching Eclipse Countdown */}
      {showEclipseCountdown && nextEclipse && (
        <section>
          <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
            Approaching Eclipse
          </h3>
          <Link
            href={`/calendar/day/${nextEclipse.date}`}
            className={cn(
              "group block rounded-xl",
              "border border-[var(--border-eclipse)]/30 bg-[var(--color-eclipse)]/5",
              "p-4 transition-all duration-200",
              "hover:border-[var(--border-eclipse)]/50 hover:bg-[var(--color-eclipse)]/10",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-eclipse)]/60"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[var(--color-eclipse)]"
                    style={{ filter: "drop-shadow(0 0 4px var(--glow-eclipse))" }}
                  >
                    {nextEclipse.category === "solar" ? "☉" : "☽"}
                  </span>
                  <span className="text-sm text-foreground group-hover:text-[var(--color-eclipse-bright)] transition-colors">
                    {nextEclipse.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(nextEclipse.date), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "text-2xl font-display tabular-nums",
                    "text-[var(--color-eclipse)]",
                    daysUntilNext !== null && daysUntilNext <= 7 && "animate-pulse"
                  )}
                >
                  {daysUntilNext}
                </span>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {daysUntilNext === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
