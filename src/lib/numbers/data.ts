/**
 * Number pattern definitions.
 * This is the single source of truth for all pattern data.
 */

import type { NumberPattern, NumberPatternId } from "./types";

/**
 * All 20 launch patterns with full definitions.
 * Order within each category determines display order.
 */
export const PATTERNS: Record<NumberPatternId, NumberPattern> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // TRIPLES (9)
  // ═══════════════════════════════════════════════════════════════════════════

  "111": {
    id: "111",
    slug: "111",
    category: "triple",
    title: "New Beginnings & Manifestation",
    essence: "New cycles",
    meaning:
      "When 111 appears, you're at a threshold. This pattern signals fresh starts and the power of your thoughts to shape reality. Pay attention to what you're focusing on—your mental energy is particularly potent right now. It's an invitation to align your intentions with your actions and trust that new opportunities are forming.",
    keywords: ["manifestation", "new beginnings", "alignment", "intention", "focus"],
    related: ["11", "1111"],
    featured: true,
    excludeFromFeatured: false,
    order: 1,
  },

  "222": {
    id: "222",
    slug: "222",
    category: "triple",
    title: "Balance & Trust",
    essence: "Balance & trust",
    meaning:
      "The appearance of 222 suggests a time of balance and patience. Partnerships, whether romantic, professional, or creative, are highlighted. This pattern encourages you to trust the process even when results aren't immediately visible. The seeds you've planted are growing—give them time. Harmony in relationships and inner equilibrium are within reach.",
    keywords: ["balance", "harmony", "trust", "patience", "partnerships"],
    related: ["22", "2222"],
    featured: true,
    excludeFromFeatured: false,
    order: 2,
  },

  "333": {
    id: "333",
    slug: "333",
    category: "triple",
    title: "Growth & Expression",
    essence: "Growth & help",
    meaning:
      "Seeing 333 is often interpreted as encouragement to embrace your creativity and self-expression. This pattern suggests support is available—whether from your own inner wisdom, your community, or forces you can't quite name. It's a reminder that growth happens in stages, and you're being called to expand beyond familiar boundaries.",
    keywords: ["creativity", "growth", "expression", "support", "expansion"],
    related: ["33"],
    featured: true,
    excludeFromFeatured: false,
    order: 3,
  },

  "444": {
    id: "444",
    slug: "444",
    category: "triple",
    title: "Stability & Foundation",
    essence: "Stable ground",
    meaning:
      "When 444 shows up repeatedly, it speaks to foundations—the structures in your life that provide stability. This pattern often appears during times when you're building something significant or need reassurance that your efforts are supported. It's a signal to trust your path and recognize the solid ground beneath your feet.",
    keywords: ["stability", "foundation", "protection", "hard work", "persistence"],
    related: ["44"],
    featured: true,
    excludeFromFeatured: false,
    order: 4,
  },

  "555": {
    id: "555",
    slug: "555",
    category: "triple",
    title: "Change & Transformation",
    essence: "Major changes",
    meaning:
      "The 555 pattern heralds significant change. Transitions are coming—or already underway—and this number encourages you to embrace them rather than resist. Change can feel destabilizing, but 555 suggests these shifts are clearing the way for something better aligned with your growth. Stay flexible and trust your ability to adapt.",
    keywords: ["change", "transformation", "freedom", "transition", "adventure"],
    related: [],
    featured: true,
    excludeFromFeatured: false,
    order: 5,
  },

  "666": {
    id: "666",
    slug: "666",
    category: "triple",
    title: "Material & Spiritual Balance",
    essence: "Find balance",
    meaning:
      "Despite its cultural baggage, 666 in numerology is about balance between material and spiritual concerns. When this pattern appears, it may be asking you to examine where you're placing your attention. Are material worries overshadowing inner peace? This is an invitation to recalibrate and remember that both realms deserve your care.",
    keywords: ["balance", "material", "spiritual", "reflection", "realignment"],
    related: [],
    featured: false,
    excludeFromFeatured: true,
    order: 6,
  },

  "777": {
    id: "777",
    slug: "777",
    category: "triple",
    title: "Wisdom & Inner Knowing",
    essence: "Divine wisdom",
    meaning:
      "Encountering 777 often signals a deepening of wisdom and spiritual awareness. This pattern suggests you're on a path of meaningful discovery, and your intuition is particularly sharp right now. Trust your inner knowing. You may be approaching a breakthrough in understanding—stay curious and receptive to insights that arrive unexpectedly.",
    keywords: ["wisdom", "spirituality", "luck", "intuition", "awakening"],
    related: [],
    featured: true,
    excludeFromFeatured: false,
    order: 7,
  },

  "888": {
    id: "888",
    slug: "888",
    category: "triple",
    title: "Abundance & Flow",
    essence: "Infinite flow",
    meaning:
      "The 888 pattern relates to abundance in its many forms—financial, relational, creative. It suggests that cycles of giving and receiving are in motion. This number often appears when prosperity is available to you, but it also reminds you that abundance flows best when shared. What you put out returns to you amplified.",
    keywords: ["abundance", "prosperity", "karma", "infinity", "success"],
    related: [],
    featured: true,
    excludeFromFeatured: false,
    order: 8,
  },

  "999": {
    id: "999",
    slug: "999",
    category: "triple",
    title: "Completion & Release",
    essence: "Endings & beginnings",
    meaning:
      "When 999 appears, a chapter is closing. This pattern marks endings that make space for new beginnings. It may be time to release what no longer serves you—relationships, habits, beliefs, or projects that have run their course. Honor what's passing while remaining open to what's emerging. Completion is its own form of growth.",
    keywords: ["completion", "endings", "release", "transformation", "closure"],
    related: ["111"],
    featured: true,
    excludeFromFeatured: false,
    order: 9,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUADS (2)
  // ═══════════════════════════════════════════════════════════════════════════

  "1111": {
    id: "1111",
    slug: "1111",
    category: "quad",
    title: "Manifestation Gateway",
    essence: "Powerful portal",
    meaning:
      "The 1111 pattern is often called a 'manifestation portal'—a moment when your thoughts and intentions carry extra weight. This quadruple one amplifies the energy of new beginnings and alignment. When you see 1111, pause and notice what you're thinking about. Your mental focus right now may be particularly influential in shaping what comes next.",
    keywords: ["manifestation", "portal", "alignment", "awakening", "synchronicity"],
    related: ["111", "11"],
    featured: true,
    excludeFromFeatured: false,
    order: 1,
  },

  "2222": {
    id: "2222",
    slug: "2222",
    category: "quad",
    title: "Deep Harmony",
    essence: "Profound balance",
    meaning:
      "The 2222 pattern amplifies themes of balance, partnership, and trust to their fullest expression. When this number appears, it suggests that harmony is not just possible but actively forming in your life. Patience has been rewarded—or will be soon. This is a time when relationships and collaborations can reach new depths of understanding.",
    keywords: ["harmony", "balance", "partnership", "patience", "cooperation"],
    related: ["222", "22"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEQUENTIAL (3)
  // ═══════════════════════════════════════════════════════════════════════════

  "123": {
    id: "123",
    slug: "123",
    category: "sequential",
    title: "Forward Motion",
    essence: "Step by step",
    meaning:
      "The 123 sequence embodies forward momentum—one step at a time. This pattern often appears when you need encouragement to begin something new without overthinking. Start where you are, use what you have, do what you can. Progress doesn't require perfection. Each small step builds on the last.",
    keywords: ["progress", "simplicity", "beginnings", "momentum", "steps"],
    related: ["1234", "12345"],
    featured: false,
    excludeFromFeatured: false,
    order: 1,
  },

  "1234": {
    id: "1234",
    slug: "1234",
    category: "sequential",
    title: "Progress & Direction",
    essence: "On track",
    meaning:
      "Seeing 1234 confirms that you're on the right track. This ascending sequence represents orderly progress and step-by-step advancement. Whatever path you're walking, this pattern suggests your direction is sound. Keep going—the logical progression of events is working in your favor. Trust the process and maintain your current course.",
    keywords: ["progress", "direction", "order", "advancement", "confirmation"],
    related: ["123", "12345"],
    featured: true,
    excludeFromFeatured: false,
    order: 2,
  },

  "12345": {
    id: "12345",
    slug: "12345",
    category: "sequential",
    title: "Accelerating Growth",
    essence: "Rapid progress",
    meaning:
      "The 12345 sequence signals accelerating momentum. Things are picking up speed, and you're moving through stages more quickly than before. This pattern often appears during periods of rapid growth or when multiple areas of life are progressing simultaneously. Stay grounded while embracing the forward motion.",
    keywords: ["acceleration", "growth", "momentum", "stages", "development"],
    related: ["123", "1234"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MIRRORED (2)
  // ═══════════════════════════════════════════════════════════════════════════

  "1212": {
    id: "1212",
    slug: "1212",
    category: "mirrored",
    title: "Positive Momentum",
    essence: "Stay positive",
    meaning:
      "The 1212 pattern combines the energies of 1 and 2 in a repeating dance—new beginnings balanced with partnership and trust. This number often appears as encouragement to maintain a positive outlook even during uncertain times. Your thoughts are shaping your reality, and optimism serves you well. Spiritual growth is accelerating.",
    keywords: ["positivity", "growth", "balance", "optimism", "cycles"],
    related: ["1221", "111", "222"],
    featured: true,
    excludeFromFeatured: false,
    order: 1,
  },

  "1221": {
    id: "1221",
    slug: "1221",
    category: "mirrored",
    title: "Coming Full Circle",
    essence: "Full circle",
    meaning:
      "The palindrome 1221 speaks to cycles completing and beginning again. What starts returns to its origin, transformed. This pattern often appears when past efforts are coming to fruition or when you're integrating lessons learned. The mirror structure reminds you that endings and beginnings are connected—each contains the seed of the other.",
    keywords: ["cycles", "reflection", "integration", "completion", "renewal"],
    related: ["1212"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOUBLES (4)
  // ═══════════════════════════════════════════════════════════════════════════

  "11": {
    id: "11",
    slug: "11",
    category: "double",
    title: "Intuition & Awakening",
    essence: "Intuition",
    meaning:
      "The number 11 is considered a 'master number' in numerology, associated with intuition, spiritual insight, and heightened awareness. When 11 appears, pay attention to your inner voice—it's likely offering valuable guidance. This pattern signals a time of awakening, when the veil between conscious and unconscious mind is thin.",
    keywords: ["intuition", "master number", "awakening", "insight", "awareness"],
    related: ["111", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 1,
  },

  "22": {
    id: "22",
    slug: "22",
    category: "double",
    title: "Master Builder",
    essence: "Build dreams",
    meaning:
      "Known as the 'Master Builder' in numerology, 22 combines vision with practical action. This pattern appears when you have the ability to turn dreams into reality through careful, sustained effort. The foundation you're building now can support significant achievements. Trust your capacity to create something lasting.",
    keywords: ["building", "master number", "dreams", "manifestation", "structure"],
    related: ["222", "2222"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  "33": {
    id: "33",
    slug: "33",
    category: "double",
    title: "Master Teacher",
    essence: "Guide others",
    meaning:
      "The 'Master Teacher' number 33 relates to guidance, compassion, and uplifting others. When this pattern appears, you may be called to share your wisdom or support someone's growth. Equally, it can signal that a teacher or mentor is entering your life. The emphasis is on spiritual service and the expansion that comes from helping others.",
    keywords: ["teaching", "guidance", "compassion", "master number", "service"],
    related: ["333"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "44": {
    id: "44",
    slug: "44",
    category: "double",
    title: "Strong Foundation",
    essence: "Solid roots",
    meaning:
      "The 44 pattern emphasizes structure, stability, and the importance of a solid foundation. This number often appears when you're building something significant—a project, a relationship, a new phase of life. Your efforts to create security and order are supported. Trust the groundwork you're laying; it will hold.",
    keywords: ["foundation", "stability", "structure", "security", "persistence"],
    related: ["444"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },
};

/**
 * Get the base meaning for a number pattern.
 * This function is exported for use by Signal's interpretation system.
 * Returns a generic message for patterns not in our dataset.
 */
export function getBaseMeaning(number: string): string {
  const pattern = PATTERNS[number as NumberPatternId];
  if (pattern) {
    return pattern.meaning;
  }
  return `The number ${number} carries unique significance for you`;
}

/**
 * Get the essence (short description) for a number pattern.
 * Returns undefined for patterns not in our dataset.
 */
export function getEssence(number: string): string | undefined {
  const pattern = PATTERNS[number as NumberPatternId];
  return pattern?.essence;
}
