/**
 * Sensitive point category-based visual styles for use across components.
 *
 * These styles provide consistent theming for node cards, heroes, and
 * other components based on category (lunar, asteroid, arabic-part, angle).
 *
 * Sensitive points represent hidden forces (karma, wounds, fate) so the
 * visual language emphasizes cooler, more ethereal tones than planets:
 * - Lunar: Silver/moonlight - cold, ethereal
 * - Asteroid: Violet/healing - transformation
 * - Arabic Part: Amber/fortune - golden luck
 * - Angle: Indigo/cosmic - fate/destiny
 */

import type { SensitivePointCategory } from "@/lib/astrology/nodes";

/**
 * Node category style configuration
 */
export interface NodeCategoryStyle {
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
 * Default style (lunar) used as fallback
 */
export const DEFAULT_NODE_CATEGORY_STYLE: NodeCategoryStyle = {
  gradient: "from-[#0a0c10] via-[#141820] to-[#0c0e14]",
  glowColor: "rgba(200, 210, 230, 0.15)",
  accentBorder: "rgba(200, 210, 230, 0.35)",
  symbolGlow: "drop-shadow(0 0 30px rgba(200, 210, 230, 0.4))",
  textGlow: "drop-shadow(0 0 8px rgba(200, 210, 230, 0.5))",
};

/**
 * Node category-based visual configurations.
 *
 * - Lunar (North Node, South Node, Lilith): Silver/moonlight - cold, ethereal
 * - Asteroid (Chiron): Violet/healing - transformation
 * - Arabic Part (Part of Fortune): Amber/fortune - golden luck
 * - Angle (Vertex): Indigo/cosmic - fate/destiny
 */
export const NODE_CATEGORY_STYLES: Record<SensitivePointCategory, NodeCategoryStyle> = {
  lunar: {
    // Lunar = cold, ethereal - silver/moonlight
    gradient: "from-[#0a0c10] via-[#141820] to-[#0c0e14]",
    glowColor: "rgba(200, 210, 230, 0.15)",
    accentBorder: "rgba(200, 210, 230, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(200, 210, 230, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(200, 210, 230, 0.5))",
  },
  asteroid: {
    // Asteroid = transformation, healing - violet
    gradient: "from-[#100a14] via-[#1a1224] to-[#120c18]",
    glowColor: "rgba(180, 140, 220, 0.15)",
    accentBorder: "rgba(180, 140, 220, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(180, 140, 220, 0.45))",
    textGlow: "drop-shadow(0 0 8px rgba(180, 140, 220, 0.5))",
  },
  "arabic-part": {
    // Arabic Part = golden luck, fortune - amber
    gradient: "from-[#12100a] via-[#1f1a10] to-[#181408]",
    glowColor: "rgba(232, 192, 104, 0.18)",
    accentBorder: "rgba(232, 192, 104, 0.4)",
    symbolGlow: "drop-shadow(0 0 35px rgba(232, 192, 104, 0.5))",
    textGlow: "drop-shadow(0 0 10px rgba(232, 192, 104, 0.6))",
  },
  angle: {
    // Angle = fate, destiny - indigo/cosmic
    gradient: "from-[#080a12] via-[#101424] to-[#0a0c18]",
    glowColor: "rgba(120, 140, 220, 0.15)",
    accentBorder: "rgba(120, 140, 220, 0.35)",
    symbolGlow: "drop-shadow(0 0 30px rgba(120, 140, 220, 0.4))",
    textGlow: "drop-shadow(0 0 8px rgba(120, 140, 220, 0.5))",
  },
};

/**
 * Get the node category style for a given category.
 * Returns default lunar style if category is not found.
 */
export function getNodeCategoryStyle(category: SensitivePointCategory | string): NodeCategoryStyle {
  return NODE_CATEGORY_STYLES[category as SensitivePointCategory] ?? DEFAULT_NODE_CATEGORY_STYLE;
}
