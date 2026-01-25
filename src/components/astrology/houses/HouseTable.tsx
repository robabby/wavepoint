"use client";

import Link from "next/link";
import type { HousePageData } from "@/lib/astrology/houses";
import { ZODIAC_META, PLANET_META } from "@/lib/astrology/constants";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseTableProps {
  houses: HousePageData[];
}

/**
 * Quick reference table displaying all houses
 * with their properties.
 */
export function HouseTable({ houses }: HouseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-gold)]/20">
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              House
            </th>
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Name
            </th>
            <th className="px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)]">
              Type
            </th>
            <th className="hidden px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)] sm:table-cell">
              Sign
            </th>
            <th className="hidden px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)] md:table-cell">
              Ruler
            </th>
            <th className="hidden px-3 py-3 text-left font-display text-xs uppercase tracking-widest text-[var(--color-gold)] lg:table-cell">
              Keywords
            </th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => {
            const styles =
              HOUSE_TYPE_STYLES[house.type] ?? DEFAULT_HOUSE_TYPE_STYLE;
            const signMeta = ZODIAC_META[house.naturalSign];
            const planetMeta = PLANET_META[house.naturalRuler];

            return (
              <tr
                key={house.number}
                className="group border-b border-[var(--color-gold)]/10 transition-colors hover:bg-card/30"
              >
                {/* House number (Roman numeral) */}
                <td className="px-3 py-3">
                  <Link
                    href={`/astrology/houses/${house.number}`}
                    className="inline-flex items-center text-foreground transition-colors hover:text-[var(--color-gold)]"
                  >
                    <span
                      className="font-display text-lg"
                      style={{
                        color: "var(--color-gold)",
                        filter: styles.symbolGlow,
                      }}
                    >
                      {house.glyph}
                    </span>
                  </Link>
                </td>

                {/* House name */}
                <td className="px-3 py-3">
                  <Link
                    href={`/astrology/houses/${house.number}`}
                    className="font-body text-foreground transition-colors hover:text-[var(--color-gold)]"
                  >
                    {house.name}
                  </Link>
                </td>

                {/* Type with color indicator */}
                <td className="px-3 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 capitalize"
                    style={{
                      color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
                    }}
                  >
                    {house.type}
                  </span>
                </td>

                {/* Natural sign (hidden on mobile) */}
                <td className="hidden px-3 py-3 sm:table-cell">
                  <Link
                    href={`/astrology/signs/${house.naturalSign}`}
                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
                  >
                    <span className="text-[var(--color-gold)]">
                      {signMeta?.glyph}
                    </span>
                    <span className="capitalize">{house.naturalSign}</span>
                  </Link>
                </td>

                {/* Natural ruler (hidden on mobile/tablet) */}
                <td className="hidden px-3 py-3 text-muted-foreground md:table-cell">
                  <Link
                    href={`/astrology/planets/${house.naturalRuler}`}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--color-gold)]"
                  >
                    <span className="text-[var(--color-gold)]">
                      {planetMeta?.glyph}
                    </span>
                    <span>{planetMeta?.name}</span>
                  </Link>
                </td>

                {/* Keywords (hidden on smaller screens) */}
                <td className="hidden px-3 py-3 text-muted-foreground/70 lg:table-cell">
                  {house.keywords.slice(0, 3).join(", ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
