"use client";

import { cn } from "@/lib/utils";
import {
  getPlanetGlyph,
  getSignGlyph,
  getAspectSymbol,
  formatDegree,
  type DashboardCosmicContext,
} from "@/lib/signal/cosmic-context";
import type { ZodiacSign } from "@/lib/astrology/constants";

interface CosmicWeatherProps {
  /** Cosmic context data */
  context: DashboardCosmicContext;
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
 * Shows planetary positions and tight aspects for the day.
 */
export function CosmicWeather({ context, className }: CosmicWeatherProps) {
  const { sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, aspects } =
    context;

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
    </div>
  );
}
