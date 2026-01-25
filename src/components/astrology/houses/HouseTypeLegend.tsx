"use client";

import { cn } from "@/lib/utils";
import {
  HOUSE_TYPE_ORDER,
  getHouseTypeDisplayInfo,
  getHousesByType,
} from "@/lib/astrology/houses";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

/**
 * Glyphs for each house type - architectural/structural metaphor
 * - Angular: solid diamond (◈) - strong, prominent
 * - Succedent: open diamond (◇) - stable, grounded
 * - Cadent: circle (○) - flowing, transitional
 */
const TYPE_GLYPHS: Record<string, string> = {
  angular: "◈",
  succedent: "◇",
  cadent: "○",
};

/**
 * Short descriptions for the legend (more concise than full descriptions)
 */
const TYPE_SUMMARIES: Record<string, string> = {
  angular: "Initiate action at the cardinal angles of life",
  succedent: "Stabilize & build resources through sustained effort",
  cadent: "Adapt & process through learning and reflection",
};

interface HouseTypeLegendProps {
  className?: string;
}

/**
 * Compact legend showing house types with their associated house numbers.
 * Architectural treatment with glyphs, type names, and house numbers.
 */
export function HouseTypeLegend({ className }: HouseTypeLegendProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Top decorative line */}
      <div
        className="mb-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 168, 75, 0.3), transparent)",
        }}
      />

      {/* Three-column grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4">
        {HOUSE_TYPE_ORDER.map((type) => {
          const typeInfo = getHouseTypeDisplayInfo(type);
          const houses = getHousesByType(type);
          const styles = HOUSE_TYPE_STYLES[type] ?? DEFAULT_HOUSE_TYPE_STYLE;
          const glyph = TYPE_GLYPHS[type] ?? "◇";
          const summary = TYPE_SUMMARIES[type] ?? typeInfo.quality;

          // Format house numbers with dot separators
          const houseNumbers = houses
            .map((h) => h.number)
            .sort((a, b) => a - b)
            .join(" · ");

          return (
            <div
              key={type}
              className={cn(
                "group relative flex flex-col items-center text-center",
                "rounded-lg p-4 transition-colors duration-300",
                "hover:bg-card/20"
              )}
            >
              {/* Glyph with type-specific glow on hover */}
              <div
                className={cn(
                  "mb-2 text-2xl transition-all duration-300",
                  "group-hover:scale-110"
                )}
                style={{
                  color: styles.accentBorder.replace(/[\d.]+\)$/, "0.9)"),
                  filter: "none",
                }}
              >
                <span
                  className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]"
                >
                  {glyph}
                </span>
              </div>

              {/* Type name */}
              <h3
                className={cn(
                  "mb-1 font-display text-xs uppercase tracking-[0.25em]",
                  "transition-colors duration-300"
                )}
                style={{
                  color: styles.accentBorder.replace(/[\d.]+\)$/, "0.8)"),
                }}
              >
                {typeInfo.name}
              </h3>

              {/* House numbers */}
              <p className="mb-3 font-mono text-sm text-muted-foreground/70">
                {houseNumbers}
              </p>

              {/* Short description */}
              <p className="text-xs leading-relaxed text-muted-foreground">
                {summary}
              </p>

              {/* Border style indicator - subtle visual hint */}
              <div
                className="mt-3 h-px w-12 transition-all duration-300 group-hover:w-16"
                style={{
                  borderTopWidth: "2px",
                  borderTopStyle: styles.borderStyle,
                  borderTopColor: styles.accentBorder,
                }}
              />

              {/* Hover glow effect */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 rounded-lg opacity-0",
                  "transition-opacity duration-300 group-hover:opacity-100"
                )}
                style={{
                  background: `radial-gradient(ellipse at center, ${styles.glowColor} 0%, transparent 70%)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom decorative line */}
      <div
        className="mt-6 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212, 168, 75, 0.3), transparent)",
        }}
      />
    </div>
  );
}
