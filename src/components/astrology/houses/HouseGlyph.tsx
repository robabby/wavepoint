import { cn } from "@/lib/utils";
import type { HouseNumber, HouseType } from "@/lib/astrology/houses";
import { ROMAN_NUMERALS, HOUSE_TYPES } from "@/lib/astrology/houses";
import {
  HOUSE_TYPE_STYLES,
  DEFAULT_HOUSE_TYPE_STYLE,
} from "@/lib/theme/house-styles";

interface HouseGlyphProps {
  /** The house number (1-12) */
  number: HouseNumber;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  /** Optional className */
  className?: string;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
  hero: "text-5xl sm:text-6xl",
};

const frameSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  hero: "h-32 w-32 sm:h-40 sm:w-40",
};

const ringWidths = {
  sm: "border",
  md: "border-2",
  lg: "border-2",
  xl: "border-[3px]",
  hero: "border-[3px]",
};

/**
 * Reusable house glyph display with architectural circular frame.
 * Uses Roman numerals (I-XII) with double-ring treatment.
 * Style varies by house type (Angular/Succedent/Cadent).
 */
export function HouseGlyph({
  number,
  size = "md",
  className,
}: HouseGlyphProps) {
  const type: HouseType = HOUSE_TYPES[number];
  const styles = HOUSE_TYPE_STYLES[type] ?? DEFAULT_HOUSE_TYPE_STYLE;
  const numeral = ROMAN_NUMERALS[number];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full",
        "bg-gradient-to-br from-card/80 to-card/40",
        frameSizes[size],
        className
      )}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          ringWidths[size]
        )}
        style={{
          borderColor: styles.accentBorder,
          boxShadow: `0 0 20px ${styles.glowColor}`,
        }}
      />

      {/* Inner ring (subtle) */}
      <div
        className={cn(
          "absolute rounded-full border",
          size === "sm" && "inset-1",
          size === "md" && "inset-1.5",
          size === "lg" && "inset-2",
          size === "xl" && "inset-3",
          size === "hero" && "inset-4"
        )}
        style={{
          borderColor: styles.accentBorder.replace(/[\d.]+\)$/, "0.2)"),
        }}
      />

      {/* Roman numeral */}
      <span
        className={cn(
          "font-display text-[var(--color-gold)]",
          sizeClasses[size],
          styles.numberStyle
        )}
        style={{
          filter: styles.symbolGlow,
        }}
      >
        {numeral}
      </span>
    </div>
  );
}
