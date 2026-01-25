import { cn } from "@/lib/utils";

interface PlanetGlyphProps {
  /** The Unicode glyph symbol (e.g., "♄") */
  glyph: string;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  /** Optional className */
  className?: string;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
  hero: "text-7xl sm:text-8xl",
};

const frameSizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  hero: "h-32 w-32 sm:h-40 sm:w-40",
};

/**
 * Reusable planet glyph display with circular frame.
 * Follows "Celestial Observatory" aesthetic with gold ring border.
 */
export function PlanetGlyph({
  glyph,
  size = "md",
  className,
}: PlanetGlyphProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        "border-2 border-[var(--color-gold)]/40",
        "bg-gradient-to-br from-card/80 to-card/40",
        // Subtle planetary aura effect
        "shadow-[0_0_20px_rgba(212,168,75,0.1)]",
        frameSizes[size],
        className
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "font-display text-[var(--color-gold)]",
          sizeClasses[size]
        )}
      >
        {glyph}
      </span>
    </div>
  );
}
