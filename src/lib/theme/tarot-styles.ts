/**
 * Tarot-specific visual styles for "Gilded Arcanum" aesthetic.
 *
 * Warm gold/copper palette designed to complement the
 * illustrated Rider-Waite-Smith card images.
 */

/**
 * Tarot visual configuration
 */
export const TAROT_STYLES = {
  /**
   * Card styling - warm gold palette for grid cards
   */
  card: {
    /** Background gradient for card container */
    gradient: "from-[#1a1408] via-[#252015] to-[#1a1408]",
    /** Glow color for radial gradients */
    glowColor: "rgba(212, 168, 75, 0.2)",
    /** Accent border color for hover states */
    accentBorder: "rgba(232, 192, 104, 0.5)",
    /** Normal shadow */
    shadowNormal: "0 4px 12px rgba(0, 0, 0, 0.3)",
    /** Hover shadow with gold glow */
    shadowHover: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 168, 75, 0.15)",
  },

  /**
   * Animation timings for "dealt cards" feel
   */
  animation: {
    /** Hover transition duration in seconds */
    hoverDuration: 0.3,
    /** Hover scale multiplier */
    hoverScale: 1.05,
    /** 3D hover rotation effect */
    hoverRotate: "rotateY(2deg) rotateX(-2deg)",
    /** Stagger delay between cards (slightly longer than Jungian for dealt feel) */
    staggerDelay: 0.06,
  },

  /**
   * Detail page hero styling
   */
  hero: {
    /** Background gradient for hero section */
    gradient: "from-[#0d0a05] via-[#1a1408] to-[#0d0a05]",
    /** Frame glow effect */
    frameGlow: "0 0 60px rgba(212, 168, 75, 0.25)",
  },

  /**
   * Color palette
   */
  colors: {
    /** Primary gold */
    gold: "rgb(212, 168, 75)",
    /** Bright gold for highlights */
    goldBright: "rgb(232, 192, 104)",
    /** Muted gold for subtle elements */
    goldMuted: "rgb(168, 134, 60)",
    /** Copper accent */
    copper: "rgb(184, 115, 51)",
  },

  /**
   * Frame border styling
   */
  frame: {
    /** Outer border width */
    borderWidth: 2,
    /** Corner radius */
    borderRadius: 12,
    /** Inner border opacity */
    innerBorderOpacity: 0.3,
  },
} as const;

/**
 * CSS custom properties for tarot cards (can be applied via style prop)
 */
export const TAROT_CSS_VARS = {
  "--tarot-gold": TAROT_STYLES.colors.gold,
  "--tarot-gold-bright": TAROT_STYLES.colors.goldBright,
  "--tarot-gold-muted": TAROT_STYLES.colors.goldMuted,
  "--tarot-copper": TAROT_STYLES.colors.copper,
  "--tarot-glow": TAROT_STYLES.card.glowColor,
  "--tarot-border": TAROT_STYLES.card.accentBorder,
} as const;

/**
 * Get tarot card aspect ratio style
 * Tarot cards are traditionally 2:3 aspect ratio (portrait)
 */
export function getTarotAspectRatio(): { aspectRatio: string } {
  return { aspectRatio: "2 / 3" };
}
