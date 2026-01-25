/**
 * Element-based visual styles for use across components.
 *
 * These styles provide consistent elemental theming for cards,
 * heroes, and other components that need element-based styling.
 */

import type { Element } from "@/lib/numbers/planetary";

/**
 * Element style configuration
 */
export interface ElementStyle {
  /** Background gradient classes (from-[x] via-[y] to-[z]) */
  gradient: string;
  /** Glow color for radial gradients and box shadows */
  glowColor: string;
  /** Border accent color for hover states */
  accentBorder: string;
  /** Drop shadow filter for symbol/glyph elements */
  symbolGlow: string;
  /** Drop shadow filter for text elements */
  textGlow: string;
}

/**
 * Default style (ether) used as fallback
 */
export const DEFAULT_ELEMENT_STYLE: ElementStyle = {
  gradient: "from-[#0a0510] via-[#18102a] to-[#100a1a]",
  glowColor: "rgba(160, 100, 200, 0.12)",
  accentBorder: "rgba(180, 140, 220, 0.35)",
  symbolGlow: "drop-shadow(0 0 30px rgba(160, 120, 200, 0.4))",
  textGlow: "drop-shadow(0 0 8px rgba(180, 140, 220, 0.4))",
};

/**
 * Element-based visual configurations.
 * Each element has distinct gradient, glow, and accent colors.
 *
 * - Fire: Warm reds and oranges
 * - Water: Cool blues and cyans
 * - Air: Soft purples and lavenders
 * - Earth: Warm browns and coppers
 * - Ether: Mystical purples (default)
 */
export const ELEMENT_STYLES: Record<Element, ElementStyle> = {
  fire: {
    gradient: "from-[#1a0505] via-[#3d1810] to-[#2a0a08]",
    glowColor: "rgba(255, 100, 50, 0.15)",
    accentBorder: "rgba(255, 140, 80, 0.4)",
    symbolGlow: "drop-shadow(0 0 30px rgba(255, 120, 50, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(255, 140, 80, 0.5))",
  },
  water: {
    gradient: "from-[#050a14] via-[#0a1a2e] to-[#061220]",
    glowColor: "rgba(100, 180, 255, 0.12)",
    accentBorder: "rgba(140, 200, 255, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(120, 180, 255, 0.35))",
    textGlow: "drop-shadow(0 0 8px rgba(140, 200, 255, 0.4))",
  },
  air: {
    gradient: "from-[#0a0a12] via-[#151522] to-[#0f0f1a]",
    glowColor: "rgba(180, 160, 220, 0.1)",
    accentBorder: "rgba(200, 180, 240, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(180, 160, 220, 0.35))",
    textGlow: "drop-shadow(0 0 8px rgba(200, 180, 240, 0.4))",
  },
  earth: {
    gradient: "from-[#0d0a05] via-[#1f1810] to-[#15100a]",
    glowColor: "rgba(184, 115, 51, 0.12)",
    accentBorder: "rgba(200, 140, 80, 0.4)",
    symbolGlow: "drop-shadow(0 0 30px rgba(184, 130, 70, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(200, 140, 80, 0.5))",
  },
  ether: DEFAULT_ELEMENT_STYLE,
};

/**
 * Get the element style for a given element.
 * Returns default ether style if element is not found.
 */
export function getElementStyle(element: Element | string): ElementStyle {
  return ELEMENT_STYLES[element as Element] ?? DEFAULT_ELEMENT_STYLE;
}
