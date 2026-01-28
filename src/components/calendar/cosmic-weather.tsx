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

// Violet color palette for eclipse theming (matches eclipse-card.tsx)
const ECLIPSE_VIOLET = "#a78bcd";
const ECLIPSE_VIOLET_BRIGHT = "#c4a8e8";

interface ApproachingEclipseCardProps {
  eclipse: {
    date: string;
    title: string;
    category: "solar" | "lunar";
    sign: ZodiacSign;
  };
  daysUntil: number;
}

/**
 * Approaching Eclipse countdown card.
 *
 * Atmospheric violet card that previews an upcoming eclipse with countdown.
 * Matches the Eclipse Card's visual language but in a more compact form.
 */
function ApproachingEclipseCard({ eclipse, daysUntil }: ApproachingEclipseCardProps) {
  const isImminent = daysUntil <= 7;

  return (
    <section>
      <h3 className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
        Approaching Eclipse
      </h3>
      <Link
        href={`/calendar/day/${eclipse.date}`}
        className="group relative block overflow-hidden rounded-xl backdrop-blur-md transition-all duration-300"
        style={{
          border: `1px solid ${ECLIPSE_VIOLET}50`,
          backgroundColor: `${ECLIPSE_VIOLET}15`,
          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 40px ${ECLIPSE_VIOLET}18`,
        }}
      >
        {/* Static atmospheric glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Primary glow - soft ambient */}
          <div
            className="absolute left-1/2 top-0 h-32 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
            style={{
              backgroundColor: ECLIPSE_VIOLET,
              opacity: 0.35,
            }}
          />
          {/* Secondary glow - brighter accent on right for countdown emphasis */}
          <div
            className="absolute right-0 top-1/2 h-24 w-24 -translate-y-1/2 translate-x-1/4 rounded-full blur-3xl"
            style={{
              backgroundColor: ECLIPSE_VIOLET_BRIGHT,
              opacity: isImminent ? 0.45 : 0.3,
            }}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${ECLIPSE_VIOLET}12 0%, transparent 50%, ${ECLIPSE_VIOLET}08 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between p-4">
          {/* Left: Eclipse info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-lg"
                style={{
                  color: ECLIPSE_VIOLET_BRIGHT,
                  filter: `drop-shadow(0 0 8px ${ECLIPSE_VIOLET})`,
                }}
              >
                {eclipse.category === "solar" ? "☉" : "☽"}
              </span>
              <span
                className="text-sm font-medium truncate transition-colors duration-200"
                style={{ color: "var(--foreground)" }}
              >
                {eclipse.title}
              </span>
            </div>
            <p
              className="text-xs mt-1.5"
              style={{ color: `${ECLIPSE_VIOLET}cc` }}
            >
              {format(parseISO(eclipse.date), "MMMM d, yyyy")}
            </p>
          </div>

          {/* Right: Countdown */}
          <div className="flex flex-col items-center ml-4 pl-4" style={{ borderLeft: `1px solid ${ECLIPSE_VIOLET}25` }}>
            <span
              className="text-3xl font-display tabular-nums leading-none"
              style={{
                color: isImminent ? ECLIPSE_VIOLET_BRIGHT : ECLIPSE_VIOLET,
                filter: isImminent ? `drop-shadow(0 0 12px ${ECLIPSE_VIOLET})` : `drop-shadow(0 0 6px ${ECLIPSE_VIOLET}80)`,
              }}
            >
              {daysUntil}
            </span>
            <p
              className="text-[9px] uppercase tracking-[0.15em] mt-1"
              style={{ color: `${ECLIPSE_VIOLET}99` }}
            >
              {daysUntil === 1 ? "day" : "days"}
            </p>
          </div>
        </div>

        {/* Hover enhancement overlay */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${ECLIPSE_VIOLET}08 0%, ${ECLIPSE_VIOLET}15 100%)`,
          }}
          aria-hidden="true"
        />
      </Link>
    </section>
  );
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
        <ApproachingEclipseCard
          eclipse={nextEclipse}
          daysUntil={daysUntilNext ?? 0}
        />
      )}
    </div>
  );
}
