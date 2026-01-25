"use client";

import Link from "next/link";
import type { ZodiacSignPageData } from "@/lib/astrology/signs";
import {
  ELEMENT_STYLES,
  DEFAULT_ELEMENT_STYLE,
} from "@/lib/theme/element-styles";

interface ZodiacTableProps {
  signs: ZodiacSignPageData[];
}

/**
 * Planetary ruler display names
 */
const PLANET_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

/**
 * Quick reference table displaying all zodiac signs
 * with their properties.
 */
export function ZodiacTable({ signs }: ZodiacTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-gold)]/20">
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Sign
            </th>
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Element
            </th>
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Modality
            </th>
            <th className="hidden px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)] sm:table-cell">
              Ruler
            </th>
            <th className="hidden px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)] md:table-cell">
              Dates
            </th>
          </tr>
        </thead>
        <tbody>
          {signs.map((sign) => {
            const styles = ELEMENT_STYLES[sign.element] ?? DEFAULT_ELEMENT_STYLE;
            const planetName = PLANET_NAMES[sign.ruler] ?? sign.ruler;

            return (
              <tr
                key={sign.id}
                className="group border-b border-[var(--color-gold)]/10 transition-colors hover:bg-card/30"
              >
                {/* Sign name with glyph */}
                <td className="px-3 py-3">
                  <Link
                    href={`/astrology/signs/${sign.id}`}
                    className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-[var(--color-gold)]"
                  >
                    <span
                      className="text-lg"
                      style={{
                        color: "var(--color-gold)",
                        filter: styles.symbolGlow,
                      }}
                    >
                      {sign.glyph}
                    </span>
                    <span className="font-body">{sign.name}</span>
                  </Link>
                </td>

                {/* Element with color indicator */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 capitalize text-muted-foreground"
                    style={{
                      color: styles.accentBorder.replace("0.4)", "0.9)").replace("0.35)", "0.9)"),
                    }}
                  >
                    {sign.element}
                  </span>
                </td>

                {/* Modality */}
                <td className="px-3 py-3">
                  <span className="capitalize text-muted-foreground">
                    {sign.modality}
                  </span>
                </td>

                {/* Ruler (hidden on mobile) */}
                <td className="hidden px-3 py-3 text-muted-foreground sm:table-cell">
                  {planetName}
                </td>

                {/* Dates (hidden on mobile/tablet) */}
                <td className="hidden px-3 py-3 text-muted-foreground/70 md:table-cell">
                  {sign.dateRange.formatted}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
