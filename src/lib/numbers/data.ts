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

  "3333": {
    id: "3333",
    slug: "3333",
    category: "quad",
    title: "Creative Explosion",
    essence: "Express freely",
    meaning:
      "The 3333 pattern represents creative energy at its peak—a quadruple amplification of expression, joy, and expansion. This number appears when your creative potential is ready to overflow into the world. Don't hold back. The universe is supporting bold self-expression and artistic endeavors. Whatever you've been hesitating to share, now is the time.",
    keywords: ["creativity", "expression", "joy", "expansion", "communication"],
    related: ["333", "33"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "4444": {
    id: "4444",
    slug: "4444",
    category: "quad",
    title: "Unshakeable Foundation",
    essence: "Rock solid",
    meaning:
      "When 4444 appears, the message about foundations becomes absolute. This quadruple four signals maximum stability and protection. Whatever you're building is supported by forces seen and unseen. Your hard work has created something lasting. Trust the structure you've established—it will weather any storm. Persistence has paid off.",
    keywords: ["stability", "protection", "foundation", "persistence", "security"],
    related: ["444", "44"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },

  "5555": {
    id: "5555",
    slug: "5555",
    category: "quad",
    title: "Revolutionary Change",
    essence: "Total transformation",
    meaning:
      "The 5555 pattern signals transformation on every level—a complete reconfiguration of your reality. This is not subtle change but revolutionary shift. Life as you've known it is reorganizing. While this may feel overwhelming, trust that every piece falling away makes room for something more aligned. Surrender to the process; fighting it only prolongs the transition.",
    keywords: ["transformation", "revolution", "freedom", "upheaval", "renewal"],
    related: ["555", "55"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "6666": {
    id: "6666",
    slug: "6666",
    category: "quad",
    title: "Profound Rebalancing",
    essence: "Deep recalibration",
    meaning:
      "The 6666 pattern amplifies the need to examine your relationship with material and domestic concerns. This quadruple six asks for profound rebalancing—where have your priorities drifted? Despite any unsettling associations, this number invites honest self-reflection about what truly matters. Home, family, and inner peace deserve your attention.",
    keywords: ["balance", "reflection", "home", "priorities", "recalibration"],
    related: ["666", "66"],
    featured: false,
    excludeFromFeatured: true,
    order: 6,
  },

  "7777": {
    id: "7777",
    slug: "7777",
    category: "quad",
    title: "Divine Alignment",
    essence: "Perfect path",
    meaning:
      "The 7777 pattern represents the highest expression of spiritual alignment and good fortune. This quadruple seven indicates you're exactly where you need to be. Your path, choices, and timing are divinely orchestrated. Trust the process completely. Miracles and synchronicities accelerate. Wisdom downloads are coming faster now—stay receptive.",
    keywords: ["luck", "alignment", "miracles", "wisdom", "perfection"],
    related: ["777", "77"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "8888": {
    id: "8888",
    slug: "8888",
    category: "quad",
    title: "Infinite Abundance",
    essence: "Unlimited flow",
    meaning:
      "The 8888 pattern represents abundance without limits—four infinity symbols stacked together. This number appears when the floodgates of prosperity are opening fully. Financial, relational, and creative abundance flows in equal measure. What you've invested returns multiplied. The karmic scales are balancing in your favor. Receive with gratitude.",
    keywords: ["abundance", "infinity", "prosperity", "karma", "reward"],
    related: ["888", "88"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "9999": {
    id: "9999",
    slug: "9999",
    category: "quad",
    title: "Ultimate Completion",
    essence: "Grand finale",
    meaning:
      "The 9999 pattern signals the ultimate completion—an entire era or chapter reaching its conclusion. This quadruple nine indicates major life cycles ending simultaneously. What's passing has served its purpose fully. Honor the endings with gratitude while keeping your heart open to what's emerging. A profound new beginning awaits on the other side.",
    keywords: ["completion", "endings", "transformation", "cycles", "release"],
    related: ["999", "99"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEQUENTIAL (13)
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

  "234": {
    id: "234",
    slug: "234",
    category: "sequential",
    title: "Building Momentum",
    essence: "Keep going",
    meaning:
      "The 234 sequence picks up where the beginning leaves off—you've started and now momentum is building. This pattern appears when initial steps have been taken and progress is becoming visible. Don't stop now; the middle of the journey is where perseverance matters most. Each step forward builds on the last.",
    keywords: ["momentum", "progress", "continuation", "building", "perseverance"],
    related: ["123", "345"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },

  "345": {
    id: "345",
    slug: "345",
    category: "sequential",
    title: "Expanding Through Change",
    essence: "Grow forward",
    meaning:
      "The 345 sequence combines growth energy with transformative change. The stability of 4 is bookended by expansion (3) and change (5), suggesting that your solid foundation is ready to evolve. Growth is happening, and change is coming—but both are part of your forward trajectory. Embrace the evolution.",
    keywords: ["growth", "change", "evolution", "expansion", "transformation"],
    related: ["234", "456"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "456": {
    id: "456",
    slug: "456",
    category: "sequential",
    title: "Practical Progress",
    essence: "Steady advance",
    meaning:
      "The 456 sequence represents practical, methodical advancement. Foundation (4) leads to change (5) leads to balance (6). This pattern appears when you're navigating transitions in a grounded way. Your approach is working—steady progress through changing circumstances while maintaining equilibrium. Trust your practical wisdom.",
    keywords: ["practical", "progress", "balance", "transition", "grounded"],
    related: ["345", "567"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "567": {
    id: "567",
    slug: "567",
    category: "sequential",
    title: "Change Brings Wisdom",
    essence: "Learn & grow",
    meaning:
      "The 567 sequence links transformation to spiritual growth. Change (5) creates space for nurturing (6) which leads to wisdom (7). This pattern suggests that current transitions are teaching you something important. Pay attention to the lessons embedded in your experiences. What's shifting is making you wiser.",
    keywords: ["wisdom", "transformation", "learning", "growth", "insight"],
    related: ["456", "678"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "678": {
    id: "678",
    slug: "678",
    category: "sequential",
    title: "Wisdom Creates Abundance",
    essence: "Reap rewards",
    meaning:
      "The 678 sequence flows from balance through wisdom to abundance. Nurturing care (6) combined with inner knowing (7) manifests as prosperity (8). This pattern appears when your efforts are beginning to bear fruit. The wisdom you've cultivated is translating into tangible results. Continue tending to what you've planted.",
    keywords: ["abundance", "wisdom", "reward", "prosperity", "fruition"],
    related: ["567", "789"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "789": {
    id: "789",
    slug: "789",
    category: "sequential",
    title: "Prosperous Completion",
    essence: "Abundant endings",
    meaning:
      "The 789 sequence culminates in completion through abundance. Spiritual insight (7) leads to material manifestation (8) which reaches fulfillment (9). This pattern signals that you're approaching the successful conclusion of a cycle. What you've built through wisdom and effort is reaching its natural completion. Celebrate the harvest.",
    keywords: ["completion", "prosperity", "culmination", "success", "fulfillment"],
    related: ["678", "999"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  "321": {
    id: "321",
    slug: "321",
    category: "sequential",
    title: "Countdown to Launch",
    essence: "Ready to begin",
    meaning:
      "The 321 sequence is a countdown—preparation meeting readiness. This descending pattern appears when you're gathering energy before a launch. Like a rocket countdown, everything is aligning for ignition. The waiting period is almost over. Final preparations are being made. Get ready to move when the signal comes.",
    keywords: ["countdown", "preparation", "launch", "readiness", "anticipation"],
    related: ["123", "432"],
    featured: false,
    excludeFromFeatured: false,
    order: 10,
  },

  "432": {
    id: "432",
    slug: "432",
    category: "sequential",
    title: "Grounding Into Foundation",
    essence: "Build stability",
    meaning:
      "The 432 sequence moves from stability through growth to partnership. This descending pattern suggests a process of consolidation—establishing foundations (4), nurturing growth (3), and creating balance (2). You may be simplifying or focusing your energies. Sometimes progress means narrowing down to what truly matters.",
    keywords: ["consolidation", "foundation", "focus", "simplification", "grounding"],
    related: ["321", "4321"],
    featured: false,
    excludeFromFeatured: false,
    order: 11,
  },

  "4321": {
    id: "4321",
    slug: "4321",
    category: "sequential",
    title: "The Grand Countdown",
    essence: "Major launch coming",
    meaning:
      "The 4321 sequence is an extended countdown—a clear signal that something significant is about to begin. This pattern appears when major initiatives are reaching their launch point. All systems are being checked, foundations verified. The longer countdown indicates a bigger undertaking. Patience through final preparations will be rewarded.",
    keywords: ["countdown", "launch", "preparation", "anticipation", "beginning"],
    related: ["321", "54321"],
    featured: false,
    excludeFromFeatured: false,
    order: 12,
  },

  "54321": {
    id: "54321",
    slug: "54321",
    category: "sequential",
    title: "Full Countdown Initiated",
    essence: "Liftoff imminent",
    meaning:
      "The 54321 sequence is the complete countdown—transformation (5) through stability (4), growth (3), partnership (2), to new beginning (1). This pattern appears at pivotal moments when everything aligns for a major launch. Whatever you've been preparing is ready. The runway is clear. This is your moment to take off.",
    keywords: ["launch", "transformation", "beginning", "readiness", "pivotal moment"],
    related: ["4321", "12345"],
    featured: false,
    excludeFromFeatured: false,
    order: 13,
  },

  "122": {
    id: "122",
    slug: "122",
    category: "sequential",
    title: "Initiative to Partnership",
    essence: "Solo to duo",
    meaning:
      "The 122 pattern marks a transition from individual effort to meaningful collaboration. The leading 1 represents your initiative—the spark that began something. The doubled 2 that follows signals that partnership or balance is calling. This pattern often appears when independent projects are ready for collaboration, or when personal growth leads naturally to deeper connections. Trust that your individual foundation is strong enough to support what you're about to build with others.",
    keywords: ["cooperation", "initiative", "partnership", "transition", "collaboration"],
    related: ["22", "222", "123"],
    featured: false,
    excludeFromFeatured: false,
    order: 14,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MIRRORED (9)
  // ═══════════════════════════════════════════════════════════════════════════

  "1001": {
    id: "1001",
    slug: "1001",
    category: "mirrored",
    title: "New Beginnings Reflected",
    essence: "Fresh start cycles",
    meaning:
      "The 1001 palindrome bookends emptiness (0) with new beginnings (1), creating a powerful cycle of renewal. This pattern often appears when you're called to start fresh while honoring the void—the pause between chapters. The zeros in the center represent potential, space for what's coming. Creation emerges from stillness.",
    keywords: ["renewal", "cycles", "potential", "creation", "stillness"],
    related: ["1111", "0000"],
    featured: false,
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
    related: ["1212", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  "1331": {
    id: "1331",
    slug: "1331",
    category: "mirrored",
    title: "Creative Self-Reflection",
    essence: "Express & reflect",
    meaning:
      "The 1331 palindrome frames creative energy (3) within new beginnings (1). This pattern invites you to examine how you express yourself and how that expression shapes your path forward. Growth and creativity are mirrored—what you create reflects who you're becoming. Let your authentic voice emerge.",
    keywords: ["creativity", "self-expression", "reflection", "authenticity", "growth"],
    related: ["333", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "1441": {
    id: "1441",
    slug: "1441",
    category: "mirrored",
    title: "Foundations in Balance",
    essence: "Stable cycles",
    meaning:
      "The 1441 palindrome places foundation energy (4) at the center of new beginnings (1). This pattern appears when you're establishing stability that will support future growth. The mirror structure suggests that what you're building now will come back around—investments in solid foundations create lasting cycles of security.",
    keywords: ["foundation", "stability", "security", "cycles", "building"],
    related: ["444", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },

  "1551": {
    id: "1551",
    slug: "1551",
    category: "mirrored",
    title: "Transformative Cycles",
    essence: "Change & return",
    meaning:
      "The 1551 palindrome wraps change energy (5) in new beginnings (1). This pattern suggests that transformation is cyclical—what changes now prepares you for future cycles of growth. The changes you're experiencing are not random but part of a larger pattern of evolution. Trust the spiral of transformation.",
    keywords: ["transformation", "cycles", "evolution", "change", "growth"],
    related: ["555", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "1661": {
    id: "1661",
    slug: "1661",
    category: "mirrored",
    title: "Nurturing Reflection",
    essence: "Care cycles",
    meaning:
      "The 1661 palindrome places nurturing energy (6) at the heart of new beginnings (1). This pattern appears when home, family, and care are central to your path forward. The mirror structure reminds you that what you nurture returns to nurture you. Investment in relationships and domestic harmony creates cycles of support.",
    keywords: ["nurturing", "family", "home", "care", "cycles"],
    related: ["666", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "1771": {
    id: "1771",
    slug: "1771",
    category: "mirrored",
    title: "Wisdom Cycles",
    essence: "Learn & grow",
    meaning:
      "The 1771 palindrome frames spiritual wisdom (7) within new beginnings (1). This pattern appears when insights are flowing and your spiritual understanding is expanding. The mirror structure suggests that wisdom gained now will cycle back to support future growth. What you learn becomes the foundation for what comes next.",
    keywords: ["wisdom", "spirituality", "insight", "growth", "learning"],
    related: ["777", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "1881": {
    id: "1881",
    slug: "1881",
    category: "mirrored",
    title: "Abundant Reflection",
    essence: "Prosperity cycles",
    meaning:
      "The 1881 palindrome places abundance energy (8) at the center of new beginnings (1). This pattern signals that prosperity flows in cycles—what you invest now returns multiplied. The mirror structure amplifies the karmic nature of 8: your generosity and effort create waves that come back to you. Trust the abundance cycle.",
    keywords: ["abundance", "prosperity", "karma", "cycles", "generosity"],
    related: ["888", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "1991": {
    id: "1991",
    slug: "1991",
    category: "mirrored",
    title: "Completion & Renewal",
    essence: "End to begin",
    meaning:
      "The 1991 palindrome frames completion (9) within new beginnings (1). This powerful pattern appears at major transitions when endings and beginnings are inseparable. What's concluding makes space for what's starting. The mirror structure emphasizes that release is the gateway to renewal. Honor both the ending and the fresh start.",
    keywords: ["completion", "renewal", "transition", "cycles", "release"],
    related: ["999", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CLOCK (15)
  // ═══════════════════════════════════════════════════════════════════════════

  "0000": {
    id: "0000",
    slug: "0000",
    category: "clock",
    title: "Infinite Potential",
    essence: "Pure possibility",
    meaning:
      "The 0000 pattern represents pure potential—the void before creation, the pause before the first breath. This quadruple zero appears at moments of profound possibility when anything could emerge. It's the blank canvas, the silence before music, the moment before the big bang. What you focus on now has unlimited potential to manifest.",
    keywords: ["potential", "infinity", "void", "creation", "possibility"],
    related: ["1111", "0101"],
    featured: false,
    excludeFromFeatured: false,
    order: 1,
  },

  "0101": {
    id: "0101",
    slug: "0101",
    category: "clock",
    title: "Emerging Beginnings",
    essence: "Start emerging",
    meaning:
      "The 0101 pattern alternates between potential (0) and new beginnings (1), like a pulse of creation. This number often appears in the early morning hours, signaling that something is trying to emerge from the void into manifestation. Pay attention to what's beginning to take form. The pattern of nothing-something-nothing-something shows creation in action.",
    keywords: ["emergence", "creation", "beginnings", "potential", "pulse"],
    related: ["0000", "1010", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  "1010": {
    id: "1010",
    slug: "1010",
    category: "clock",
    title: "Binary Awakening",
    essence: "On & off",
    meaning:
      "The 1010 pattern creates a binary rhythm—on, off, on, off. This number appears when you're navigating between action and rest, speaking and listening, doing and being. The pattern suggests finding balance in the oscillation itself. Life isn't just action or pause but the dance between them. Trust your natural rhythm.",
    keywords: ["balance", "rhythm", "cycles", "duality", "awareness"],
    related: ["0101", "1111"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "1212": {
    id: "1212",
    slug: "1212",
    category: "clock",
    title: "Positive Momentum",
    essence: "Stay positive",
    meaning:
      "The 1212 pattern combines the energies of 1 and 2 in a repeating dance—new beginnings balanced with partnership and trust. This number often appears as encouragement to maintain a positive outlook even during uncertain times. Your thoughts are shaping your reality, and optimism serves you well. Spiritual growth is accelerating.",
    keywords: ["positivity", "growth", "balance", "optimism", "cycles"],
    related: ["1221", "111", "222"],
    featured: true,
    excludeFromFeatured: false,
    order: 4,
  },

  "1313": {
    id: "1313",
    slug: "1313",
    category: "clock",
    title: "Creative Manifestation",
    essence: "Create boldly",
    meaning:
      "The 1313 pattern alternates between new beginnings (1) and creative expression (3). This clock time appears when your creative powers are heightened and ready to manifest. The repetition emphasizes that creation is an ongoing cycle—start, express, start again, express again. Your creative ideas are ready to take form. Don't hold back.",
    keywords: ["creativity", "manifestation", "expression", "cycles", "boldness"],
    related: ["333", "111", "1331"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "1414": {
    id: "1414",
    slug: "1414",
    category: "clock",
    title: "Grounded New Starts",
    essence: "Build & begin",
    meaning:
      "The 1414 pattern weaves new beginnings (1) with foundation building (4). This clock time appears when you're starting something that requires solid groundwork. The alternating pattern suggests that new initiatives and practical building go hand in hand. Each new start needs structure; each structure enables new beginnings. Build as you begin.",
    keywords: ["foundation", "beginnings", "building", "practicality", "structure"],
    related: ["444", "111", "1441"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "1515": {
    id: "1515",
    slug: "1515",
    category: "clock",
    title: "Changes & Beginnings",
    essence: "Transform & start",
    meaning:
      "The 1515 pattern alternates between new beginnings (1) and change (5). This clock time signals that transformation and fresh starts are intertwined. You can't have one without the other. The pattern appears when life is asking you to embrace both—let go and begin again, release and initiate. Change is your launchpad.",
    keywords: ["change", "beginnings", "transformation", "release", "initiation"],
    related: ["555", "111", "1551"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "1616": {
    id: "1616",
    slug: "1616",
    category: "clock",
    title: "Home & Manifestation",
    essence: "Nurture dreams",
    meaning:
      "The 1616 pattern weaves new beginnings (1) with nurturing energy (6). This clock time appears when your focus on home, family, or self-care is supporting your ability to manifest new things. The pattern suggests that what you're nurturing is becoming real. Tend to both your dreams and your foundations. Care creates manifestation.",
    keywords: ["nurturing", "manifestation", "home", "care", "beginnings"],
    related: ["666", "111", "1661"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "1717": {
    id: "1717",
    slug: "1717",
    category: "clock",
    title: "Spiritual Awakening",
    essence: "Awaken & begin",
    meaning:
      "The 1717 pattern alternates between new beginnings (1) and spiritual wisdom (7). This clock time appears during periods of spiritual awakening when insights are translating into fresh starts. Your intuition is guiding you toward new paths. The pattern suggests that wisdom and action are dancing together. Let your inner knowing lead.",
    keywords: ["awakening", "spirituality", "wisdom", "intuition", "beginnings"],
    related: ["777", "111", "1771"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  "1818": {
    id: "1818",
    slug: "1818",
    category: "clock",
    title: "Prosperity Beginnings",
    essence: "Manifest abundance",
    meaning:
      "The 1818 pattern weaves new beginnings (1) with abundance energy (8). This clock time appears when financial or material prosperity is connected to new initiatives. What you're starting has the potential for significant returns. The pattern suggests that abundance follows aligned action. Your efforts are creating prosperity cycles.",
    keywords: ["abundance", "prosperity", "beginnings", "manifestation", "success"],
    related: ["888", "111", "1881"],
    featured: false,
    excludeFromFeatured: false,
    order: 10,
  },

  "1919": {
    id: "1919",
    slug: "1919",
    category: "clock",
    title: "Endings & Beginnings",
    essence: "Close & open",
    meaning:
      "The 1919 pattern alternates between new beginnings (1) and completion (9). This clock time appears at threshold moments when endings and starts are simultaneous. You're closing one door while opening another. The pattern suggests that this transition is natural and supported. Honor both movements—the release and the initiation are one.",
    keywords: ["transition", "completion", "beginnings", "cycles", "release"],
    related: ["999", "111", "1991"],
    featured: false,
    excludeFromFeatured: false,
    order: 11,
  },

  "2020": {
    id: "2020",
    slug: "2020",
    category: "clock",
    title: "Clear Vision",
    essence: "Perfect sight",
    meaning:
      "The 2020 pattern combines partnership energy (2) with potential (0) in a rhythm associated with perfect vision. This clock time appears when clarity about relationships and balance is available. You can see things clearly now—trust what you perceive. The pattern suggests that balanced perspective leads to unlimited potential.",
    keywords: ["clarity", "vision", "balance", "partnership", "potential"],
    related: ["222", "0000", "2222"],
    featured: false,
    excludeFromFeatured: false,
    order: 12,
  },

  "2112": {
    id: "2112",
    slug: "2112",
    category: "clock",
    title: "Partnership Portal",
    essence: "Unite & manifest",
    meaning:
      "The 2112 pattern frames new beginnings (11) within partnership energy (2). This clock time appears when collaboration is key to manifestation. Your connections with others are opening portals of possibility. The pattern suggests that what you create together exceeds what you could create alone. Unite forces for powerful results.",
    keywords: ["partnership", "collaboration", "manifestation", "unity", "portal"],
    related: ["1111", "222", "1212"],
    featured: false,
    excludeFromFeatured: false,
    order: 13,
  },

  "2121": {
    id: "2121",
    slug: "2121",
    category: "clock",
    title: "Balanced Beginnings",
    essence: "Partner & start",
    meaning:
      "The 2121 pattern alternates between partnership (2) and new beginnings (1). This clock time appears when balance and fresh starts are interweaving. Relationships support your new initiatives; new initiatives strengthen relationships. The pattern suggests finding harmony between independence and cooperation. Both energies are needed now.",
    keywords: ["balance", "partnership", "beginnings", "harmony", "cooperation"],
    related: ["1212", "111", "222"],
    featured: false,
    excludeFromFeatured: false,
    order: 14,
  },

  "2323": {
    id: "2323",
    slug: "2323",
    category: "clock",
    title: "Harmonious Growth",
    essence: "Balance & expand",
    meaning:
      "The 2323 pattern alternates between partnership (2) and creative expression (3). This clock time appears when relationships and creativity are feeding each other. Collaboration sparks inspiration; creative work deepens connections. The pattern suggests that harmony and growth are dancing together. Let both energies flow freely.",
    keywords: ["harmony", "creativity", "partnership", "growth", "expression"],
    related: ["222", "333", "2121"],
    featured: false,
    excludeFromFeatured: false,
    order: 15,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SANDWICH (12)
  // ═══════════════════════════════════════════════════════════════════════════

  "101": {
    id: "101",
    slug: "101",
    category: "sandwich",
    title: "Beginnings From Nothing",
    essence: "Create from void",
    meaning:
      "The 101 sandwich pattern frames emptiness (0) between new beginnings (1). This three-digit pattern appears when you're creating something from nothing—the zero represents the blank slate from which manifestation emerges. It's the basic unit of creation: intention, void, intention. From nothingness, beginnings arise. Trust the creative void.",
    keywords: ["creation", "void", "beginnings", "manifestation", "potential"],
    related: ["1001", "0000", "111"],
    featured: false,
    excludeFromFeatured: false,
    order: 1,
  },

  "202": {
    id: "202",
    slug: "202",
    category: "sandwich",
    title: "Partnership Through Space",
    essence: "Connect across gaps",
    meaning:
      "The 202 sandwich pattern places the void (0) between partnership energy (2). This pattern appears when relationships require space—the gap between is what allows connection to breathe. Sometimes the best thing for balance is letting emptiness exist at the center. Healthy partnerships need room. Trust the space between.",
    keywords: ["partnership", "space", "balance", "connection", "breathing room"],
    related: ["222", "0000", "2020"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  "303": {
    id: "303",
    slug: "303",
    category: "sandwich",
    title: "Creative Void",
    essence: "Inspire from nothing",
    meaning:
      "The 303 sandwich pattern frames the void (0) with creative expression (3). This pattern appears when creativity needs the emptiness to emerge—the blank page, the silence before music, the pause before words. Your creative energy is supported by making space for it. Let the void be your canvas. Inspiration needs room.",
    keywords: ["creativity", "void", "inspiration", "space", "expression"],
    related: ["333", "0000", "1331"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "404": {
    id: "404",
    slug: "404",
    category: "sandwich",
    title: "Foundation Through Emptiness",
    essence: "Build on space",
    meaning:
      "The 404 sandwich pattern places potential (0) between stability (4). Like the infamous error code, this pattern appears when something seems missing from your foundation—but that emptiness is the point. Sometimes stability requires letting go of what's not essential. The void at the center makes the structure stronger. Less is foundation.",
    keywords: ["foundation", "simplicity", "structure", "emptiness", "strength"],
    related: ["444", "0000", "1441"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },

  "505": {
    id: "505",
    slug: "505",
    category: "sandwich",
    title: "Change Through Stillness",
    essence: "Transform via pause",
    meaning:
      "The 505 sandwich pattern frames the void (0) with change energy (5). This pattern appears when transformation requires pause—the stillness between states, the breath between changes. You're in the middle of something shifting, and the void at the center is where the real transformation happens. Change needs stillness to complete.",
    keywords: ["change", "stillness", "transformation", "pause", "transition"],
    related: ["555", "0000", "1551"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "606": {
    id: "606",
    slug: "606",
    category: "sandwich",
    title: "Nurturing Through Space",
    essence: "Care with distance",
    meaning:
      "The 606 sandwich pattern places the void (0) between nurturing energy (6). This pattern appears when care requires space—sometimes the most loving thing is to step back. Healthy nurturing includes room to grow. The emptiness at the center isn't absence of care but wisdom about how care works. Love sometimes means space.",
    keywords: ["nurturing", "space", "care", "boundaries", "love"],
    related: ["666", "0000", "1661"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "707": {
    id: "707",
    slug: "707",
    category: "sandwich",
    title: "Wisdom From Void",
    essence: "Know through emptiness",
    meaning:
      "The 707 sandwich pattern frames the void (0) with spiritual wisdom (7). This pattern appears when insight comes through emptiness—meditation, silence, the gap between thoughts. True knowing often emerges from not-knowing. The void at the center is where wisdom lives. Empty your mind to fill it with understanding.",
    keywords: ["wisdom", "meditation", "silence", "insight", "emptiness"],
    related: ["777", "0000", "1771"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "717": {
    id: "717",
    slug: "717",
    category: "sandwich",
    title: "Wisdom Embracing Intuition",
    essence: "Inner knowing",
    meaning:
      "The 717 sandwich pattern wraps intuition (1) within spiritual wisdom (7). This pattern appears when your inner knowing is supported by deeper understanding. The singular truth at the center is held by wisdom on both sides. Trust what you know intuitively—it's grounded in something greater. Your hunches have spiritual backing.",
    keywords: ["intuition", "wisdom", "inner knowing", "trust", "spirituality"],
    related: ["777", "111", "1717"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "808": {
    id: "808",
    slug: "808",
    category: "sandwich",
    title: "Abundance From Nothing",
    essence: "Prosper from void",
    meaning:
      "The 808 sandwich pattern places the void (0) between abundance energy (8). This pattern appears when prosperity emerges from emptiness—often after a period of apparent lack. The infinity symbols on either side of zero suggest that unlimited abundance surrounds potential. What looks like nothing is actually infinite possibility. Lack precedes abundance.",
    keywords: ["abundance", "potential", "prosperity", "infinity", "emergence"],
    related: ["888", "0000", "1881"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  "818": {
    id: "818",
    slug: "818",
    category: "sandwich",
    title: "Abundance Supports Beginnings",
    essence: "Prosperity enables",
    meaning:
      "The 818 sandwich pattern wraps new beginnings (1) within abundance energy (8). This pattern appears when prosperity supports your initiatives. The infinite potential of 8 surrounds your new start. Financial or material resources are available to fuel what you're beginning. Abundance is the context for your fresh start. You're supported.",
    keywords: ["abundance", "beginnings", "support", "prosperity", "resources"],
    related: ["888", "111", "1818"],
    featured: false,
    excludeFromFeatured: false,
    order: 10,
  },

  "909": {
    id: "909",
    slug: "909",
    category: "sandwich",
    title: "Completion Through Void",
    essence: "End in emptiness",
    meaning:
      "The 909 sandwich pattern frames the void (0) with completion energy (9). This pattern appears when endings create space—the emptiness after something concludes. It's the breath after release, the quiet after the storm. What's completing returns to potential, ready to become something new. Endings don't just stop; they open into possibility.",
    keywords: ["completion", "void", "endings", "potential", "release"],
    related: ["999", "0000", "1991"],
    featured: false,
    excludeFromFeatured: false,
    order: 11,
  },

  "919": {
    id: "919",
    slug: "919",
    category: "sandwich",
    title: "Completion Enables Beginnings",
    essence: "End to start",
    meaning:
      "The 919 sandwich pattern wraps new beginnings (1) within completion energy (9). This pattern appears when what's ending is creating space for what's starting. The completion on either side of your new beginning shows that release supports initiation. You're not just ending or starting—you're doing both at once. Let go to begin.",
    keywords: ["completion", "beginnings", "transition", "release", "initiation"],
    related: ["999", "111", "1919"],
    featured: false,
    excludeFromFeatured: false,
    order: 12,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPOUND (14)
  // ═══════════════════════════════════════════════════════════════════════════

  "1122": {
    id: "1122",
    slug: "1122",
    category: "compound",
    title: "Intuition Meets Mastery",
    essence: "Know & build",
    meaning:
      "The 1122 compound pattern joins intuition (11) with building mastery (22). These two master numbers together signal that your inner knowing is ready to be built into reality. Trust your instincts as you construct something significant. The doubling shows amplified potential—spiritual insight guiding practical creation. Your vision can become structure.",
    keywords: ["intuition", "mastery", "building", "insight", "creation"],
    related: ["11", "22", "1111", "2222"],
    featured: false,
    excludeFromFeatured: false,
    order: 1,
  },

  "1133": {
    id: "1133",
    slug: "1133",
    category: "compound",
    title: "Awakening Through Expression",
    essence: "Awaken & express",
    meaning:
      "The 1133 compound pattern joins awakening (11) with teaching mastery (33). This combination signals that your spiritual insights are meant to be shared. Your awakening becomes complete through creative expression. The doubled energies suggest that what you're learning is ready to be taught. Your growth serves others' growth.",
    keywords: ["awakening", "expression", "teaching", "sharing", "growth"],
    related: ["11", "33", "1111", "333"],
    featured: false,
    excludeFromFeatured: false,
    order: 2,
  },

  "1144": {
    id: "1144",
    slug: "1144",
    category: "compound",
    title: "Intuition Building Foundations",
    essence: "Trust & build",
    meaning:
      "The 1144 compound pattern combines intuition (11) with doubled foundation energy (44). This pattern appears when your inner knowing is guiding you to build something lasting. Trust the structures emerging from your insights. The compound suggests that spiritual perception and practical building are aligned. Your foundations are divinely guided.",
    keywords: ["intuition", "foundation", "building", "trust", "structure"],
    related: ["11", "44", "1111", "444"],
    featured: false,
    excludeFromFeatured: false,
    order: 3,
  },

  "1155": {
    id: "1155",
    slug: "1155",
    category: "compound",
    title: "Awakening Through Change",
    essence: "Transform & awaken",
    meaning:
      "The 1155 compound pattern joins awakening (11) with amplified change (55). This powerful combination signals that transformation is accelerating your spiritual growth. The changes happening aren't random—they're catalyzing awareness. Embrace the upheaval as the path to awakening. Your transformation serves your highest evolution.",
    keywords: ["awakening", "transformation", "change", "evolution", "growth"],
    related: ["11", "55", "1111", "555"],
    featured: false,
    excludeFromFeatured: false,
    order: 4,
  },

  "1166": {
    id: "1166",
    slug: "1166",
    category: "compound",
    title: "Spiritual Nurturing",
    essence: "Awaken through care",
    meaning:
      "The 1166 compound pattern combines awakening (11) with amplified nurturing (66). This pattern appears when your spiritual path leads through caring for others and home. Your awakening is connected to domestic harmony and service. The compound suggests that tending to the material supports the spiritual. Care is the path.",
    keywords: ["nurturing", "awakening", "care", "home", "service"],
    related: ["11", "66", "1111", "666"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "1177": {
    id: "1177",
    slug: "1177",
    category: "compound",
    title: "Double Awakening",
    essence: "Profound insight",
    meaning:
      "The 1177 compound pattern joins awakening (11) with amplified wisdom (77). This is an extraordinarily spiritual combination—intuition meets deep knowing. Your inner guidance system is fully online. Insights are flowing rapidly. The doubled spiritual energy suggests a peak moment of awareness. Trust everything you're perceiving.",
    keywords: ["awakening", "wisdom", "insight", "spirituality", "intuition"],
    related: ["11", "77", "1111", "777"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "1188": {
    id: "1188",
    slug: "1188",
    category: "compound",
    title: "Abundant Awakening",
    essence: "Prosper spiritually",
    meaning:
      "The 1188 compound pattern combines awakening (11) with amplified abundance (88). This pattern signals that spiritual growth and material prosperity are aligned. Your intuition is guiding you toward both. The compound suggests that awakening and abundance aren't separate—each feeds the other. Trust the flow of both.",
    keywords: ["abundance", "awakening", "prosperity", "alignment", "flow"],
    related: ["11", "88", "1111", "888"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "1199": {
    id: "1199",
    slug: "1199",
    category: "compound",
    title: "Awakening Into Completion",
    essence: "Release & awaken",
    meaning:
      "The 1199 compound pattern joins awakening (11) with amplified completion (99). This pattern appears when endings are triggering profound awareness. What's completing is waking you up. The compound suggests that release and insight are inseparable right now. Let go to see clearly. Completion is your teacher.",
    keywords: ["awakening", "completion", "release", "insight", "endings"],
    related: ["11", "99", "1111", "999"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "1224": {
    id: "1224",
    slug: "1224",
    category: "compound",
    title: "Partnered Building",
    essence: "Build together",
    meaning:
      "The 1224 compound pattern multiplies partnership (12 × 2 = 24, or 12 and 24). This mathematical relationship emphasizes that collaboration amplifies results. What you build with others becomes twice as significant. The pattern suggests that your partnerships are producing tangible outcomes. Together you're creating something greater than the sum.",
    keywords: ["partnership", "building", "collaboration", "multiplication", "creation"],
    related: ["1212", "22", "44", "2222"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
  },

  "1236": {
    id: "1236",
    slug: "1236",
    category: "compound",
    title: "Tripled Progress",
    essence: "Grow threefold",
    meaning:
      "The 1236 compound pattern shows multiplication (12 × 3 = 36). This mathematical relationship suggests that your progress is being multiplied by creative expression. Growth is accelerating through expansion. The sequential feel (1-2-3-6) adds momentum to the pattern. Your forward motion is gathering power exponentially.",
    keywords: ["progress", "multiplication", "growth", "expansion", "momentum"],
    related: ["123", "333", "1234"],
    featured: false,
    excludeFromFeatured: false,
    order: 10,
  },

  "1248": {
    id: "1248",
    slug: "1248",
    category: "compound",
    title: "Exponential Growth",
    essence: "Double & double",
    meaning:
      "The 1248 compound pattern shows doubling (1, 2, 4, 8—each number doubles the previous). This is the pattern of exponential growth. What starts small multiplies rapidly. The pattern appears when your efforts are compounding. Small consistent actions create massive results over time. Trust the exponential curve.",
    keywords: ["growth", "exponential", "doubling", "multiplication", "compounding"],
    related: ["1234", "888", "8888"],
    featured: false,
    excludeFromFeatured: false,
    order: 11,
  },

  "1326": {
    id: "1326",
    slug: "1326",
    category: "compound",
    title: "Doubled Creative Partnership",
    essence: "Create in pairs",
    meaning:
      "The 1326 compound pattern shows multiplication (13 × 2 = 26). The creative energy of 3 combined with partnership (2) produces balanced nurturing results (6). This pattern suggests that collaborative creativity leads to harmony. Working with others on creative projects brings results that serve everyone. Partner to create.",
    keywords: ["creativity", "partnership", "collaboration", "harmony", "creation"],
    related: ["333", "666", "1133"],
    featured: false,
    excludeFromFeatured: false,
    order: 12,
  },

  "1339": {
    id: "1339",
    slug: "1339",
    category: "compound",
    title: "Creative Completion Tripled",
    essence: "Express to complete",
    meaning:
      "The 1339 compound pattern shows multiplication (13 × 3 = 39). Creative energy tripled leads to completion with purpose. This pattern suggests that full creative expression brings cycles to meaningful conclusion. What you're creating is reaching its natural fulfillment. Let your expression complete what needs completing.",
    keywords: ["creativity", "completion", "expression", "fulfillment", "purpose"],
    related: ["333", "999", "1133"],
    featured: false,
    excludeFromFeatured: false,
    order: 13,
  },

  "1428": {
    id: "1428",
    slug: "1428",
    category: "compound",
    title: "Foundation Doubled Into Abundance",
    essence: "Build to prosper",
    meaning:
      "The 1428 compound pattern shows multiplication (14 × 2 = 28). Foundation energy (4) combined with partnership (2) doubles into abundance (8). This pattern suggests that building together creates prosperity. Your collaborative foundations are generating returns. The structure you've created with others is producing abundant results.",
    keywords: ["foundation", "partnership", "abundance", "building", "prosperity"],
    related: ["444", "888", "1144"],
    featured: false,
    excludeFromFeatured: false,
    order: 14,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DOUBLES (9)
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

  "55": {
    id: "55",
    slug: "55",
    category: "double",
    title: "Dynamic Change",
    essence: "Embrace shifts",
    meaning:
      "The 55 pattern signals that change is not just coming—it's accelerating. This master number amplifies the transformative energy of 5, suggesting multiple shifts happening simultaneously. Rather than resist, lean into the movement. Flexibility is your greatest asset now. The changes unfolding are clearing space for something more aligned with who you're becoming.",
    keywords: ["change", "freedom", "adventure", "transformation", "flexibility"],
    related: ["555", "5555"],
    featured: false,
    excludeFromFeatured: false,
    order: 5,
  },

  "66": {
    id: "66",
    slug: "66",
    category: "double",
    title: "Nurturing Balance",
    essence: "Heart & home",
    meaning:
      "When 66 appears, the focus turns to home, family, and nurturing relationships. This pattern asks you to examine where you're placing your care and attention. Are you giving enough to yourself while tending to others? The doubled six emphasizes finding equilibrium between service to others and self-care. Domestic harmony is highlighted.",
    keywords: ["home", "family", "nurturing", "responsibility", "harmony"],
    related: ["666", "6666"],
    featured: false,
    excludeFromFeatured: false,
    order: 6,
  },

  "77": {
    id: "77",
    slug: "77",
    category: "double",
    title: "Spiritual Insight",
    essence: "Inner wisdom",
    meaning:
      "The 77 pattern amplifies spiritual awareness and introspection. This master number indicates a time of deep inner work and heightened intuition. Trust the insights that come through quiet reflection. You may be receiving guidance from sources beyond the rational mind. Analytical thinking combined with spiritual perception creates profound understanding.",
    keywords: ["wisdom", "spirituality", "introspection", "intuition", "analysis"],
    related: ["777", "7777"],
    featured: false,
    excludeFromFeatured: false,
    order: 7,
  },

  "88": {
    id: "88",
    slug: "88",
    category: "double",
    title: "Material Mastery",
    essence: "Abundant flow",
    meaning:
      "The 88 pattern represents mastery over material and financial realms. This powerful number suggests abundant energy flowing through your life, particularly in matters of resources and achievement. The infinity symbol doubled indicates unlimited potential. What you've built through discipline and effort is now generating returns. Cycles of prosperity are in motion.",
    keywords: ["abundance", "prosperity", "achievement", "karma", "mastery"],
    related: ["888", "8888"],
    featured: false,
    excludeFromFeatured: false,
    order: 8,
  },

  "99": {
    id: "99",
    slug: "99",
    category: "double",
    title: "Humanitarian Calling",
    essence: "Serve & release",
    meaning:
      "The 99 pattern carries the energy of completion amplified—endings that serve the greater good. This number often appears when you're being called to release old patterns and embrace a larger purpose. Service to others and humanitarian concerns come into focus. What's completing now makes space for a more purposeful chapter to begin.",
    keywords: ["completion", "service", "humanitarianism", "release", "purpose"],
    related: ["999", "9999"],
    featured: false,
    excludeFromFeatured: false,
    order: 9,
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
