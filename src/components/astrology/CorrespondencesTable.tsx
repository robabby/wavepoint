import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PlanetPageData } from "@/lib/astrology/planets";

interface CorrespondencesTableProps {
  /** List of planets to display */
  planets: PlanetPageData[];
  /** Optional className */
  className?: string;
}

/**
 * Quick reference table for planet correspondences.
 * Shows all planets with their key associations at a glance.
 */
export function CorrespondencesTable({
  planets,
  className,
}: CorrespondencesTableProps) {
  if (planets.length === 0) return null;

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-[var(--border-gold)]/30">
            <th className="pb-3 text-left font-heading text-[var(--color-gold)]">
              Planet
            </th>
            <th className="pb-3 text-center font-heading text-[var(--color-gold)]">
              Glyph
            </th>
            <th className="pb-3 text-center font-heading text-[var(--color-gold)]">
              Number
            </th>
            <th className="pb-3 text-center font-heading text-[var(--color-gold)]">
              Element
            </th>
            <th className="pb-3 text-center font-heading text-[var(--color-gold)]">
              Day
            </th>
            <th className="pb-3 text-center font-heading text-[var(--color-gold)]">
              Metal
            </th>
            <th className="pb-3 text-left font-heading text-[var(--color-gold)]">
              Rules
            </th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => (
            <tr
              key={planet.id}
              className="border-b border-[var(--border-gold)]/10 transition-colors hover:bg-card/30"
            >
              {/* Planet name (linked) */}
              <td className="py-3">
                <Link
                  href={`/astrology/planets/${planet.id}`}
                  className="font-medium text-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  {planet.name}
                </Link>
              </td>

              {/* Glyph */}
              <td className="py-3 text-center font-display text-lg text-[var(--color-gold)]">
                {planet.glyph}
              </td>

              {/* Number */}
              <td className="py-3 text-center">
                {planet.numerology.digit !== null ? (
                  <Link
                    href={`/numbers/${planet.numerology.digit}`}
                    className="text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                  >
                    {planet.numerology.digit}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>

              {/* Element */}
              <td className="py-3 text-center capitalize text-muted-foreground">
                {planet.element}
              </td>

              {/* Day */}
              <td className="py-3 text-center text-muted-foreground">
                {planet.dayOfWeek ?? "—"}
              </td>

              {/* Metal */}
              <td className="py-3 text-center text-muted-foreground">
                {planet.metal ?? "—"}
              </td>

              {/* Signs ruled */}
              <td className="py-3 text-muted-foreground">
                {planet.rulerships.length > 0
                  ? planet.rulerships.map((r, index) => (
                      <span key={r.sign}>
                        <Link
                          href={`/astrology/signs/${r.sign.toLowerCase()}`}
                          className="transition-colors hover:text-[var(--color-gold)]"
                        >
                          {r.sign}
                        </Link>
                        {index < planet.rulerships.length - 1 && ", "}
                      </span>
                    ))
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
