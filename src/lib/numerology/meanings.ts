/**
 * Number meanings and archetypes for numerology.
 *
 * Voice & Tone: Grounded, not grandiose. Invitation over instruction.
 * Following WavePoint's "modern mystic" identity.
 */

import type { NumberMeaning, NumerologyDigit, NumberType, ContextualMeaning } from "./types";

/**
 * Base meanings for each numerology digit
 */
export const NUMBER_MEANINGS: Record<NumerologyDigit, NumberMeaning> = {
  1: {
    digit: 1,
    name: "The Pioneer",
    keywords: ["independence", "initiative", "originality", "leadership", "courage"],
    brief:
      "One embodies new beginnings and self-reliance. You might find yourself naturally taking the lead and forging your own path.",
    extended: `The energy of One is that of the seed breaking through soil—pure potential meeting action. Those who carry this number often feel a deep drive toward independence and self-expression. There's an innate understanding that authentic leadership comes not from controlling others, but from the courage to be fully yourself.

One invites you to trust your instincts and take initiative. You may find that your greatest growth comes through solo ventures and original thinking. This isn't about isolation, but about knowing your own mind before joining with others.

The shadow of One can manifest as stubbornness or self-centeredness. The invitation is to channel pioneering energy in service of something larger while maintaining your essential self-trust.`,
  },
  2: {
    digit: 2,
    name: "The Diplomat",
    keywords: ["harmony", "partnership", "sensitivity", "intuition", "cooperation"],
    brief:
      "Two carries the wisdom of relationship and balance. You may have a natural gift for seeing multiple perspectives and creating harmony.",
    extended: `Two holds the medicine of receptivity and connection. Where One moves forward alone, Two recognizes that the deepest truths emerge in the space between—in dialogue, partnership, and the dance of give and take. Those who carry this number often possess heightened sensitivity to emotional undercurrents.

This energy invites patience and trust in timing. Two understands that not everything needs to be forced or rushed; sometimes the most powerful action is attentive listening. You may find yourself naturally mediating conflicts or sensing what others need before they speak.

The challenge of Two is learning to maintain boundaries while staying open. Your sensitivity is a gift, but it requires discernment. The invitation is to honor your need for partnership while not losing yourself in others.`,
  },
  3: {
    digit: 3,
    name: "The Communicator",
    keywords: ["expression", "creativity", "joy", "optimism", "inspiration"],
    brief:
      "Three radiates creative expression and social warmth. You likely have a natural ability to uplift others and give form to ideas.",
    extended: `Three is the number of creative synthesis—the child born from the union of One and Two. It carries the energy of expression, art, and the joy of bringing inner visions into the world. Those who resonate with Three often have an infectious enthusiasm and a gift for making others feel seen and inspired.

This energy invites playfulness and authentic self-expression. Whether through words, art, movement, or simply how you move through the world, Three asks you to share your unique perspective. Your optimism isn't naivety—it's a form of creative power.

The shadow of Three can scatter into superficiality or avoid depth through constant motion. The invitation is to channel your creative fire with focus, allowing your natural joy to be grounded in meaning.`,
  },
  4: {
    digit: 4,
    name: "The Builder",
    keywords: ["stability", "structure", "discipline", "practicality", "dedication"],
    brief:
      "Four provides the foundation for lasting achievement. You may have a natural talent for creating systems and bringing order to chaos.",
    extended: `Four is the architect of the numerological spectrum—the energy that transforms inspiration into lasting form. Like the four corners of a foundation, this number brings stability, reliability, and the patience to build something that endures. Those who carry Four often find satisfaction in methodical work and tangible results.

This energy invites you to honor process over shortcuts. Four understands that anything worthwhile takes time and consistent effort. You may find yourself naturally organizing, planning, and creating structures that serve others.

The challenge of Four is avoiding rigidity. Structure serves life, not the other way around. The invitation is to build with flexibility, creating foundations strong enough to support growth and change rather than restrict it.`,
  },
  5: {
    digit: 5,
    name: "The Adventurer",
    keywords: ["freedom", "change", "curiosity", "versatility", "experience"],
    brief:
      "Five embodies the spirit of freedom and exploration. You may feel called to variety, travel, and the wisdom that comes through direct experience.",
    extended: `Five sits at the center of the single digits, bridging what came before with what comes next. It carries the restless energy of curiosity—the drive to taste, touch, and experience life in all its variety. Those who resonate with Five often feel confined by routine and are energized by change and new horizons.

This energy invites embrace of life's inherent impermanence. Five understands that wisdom comes through experience, not just study. You may find yourself drawn to travel, diverse relationships, or work that offers constant novelty.

The shadow of Five can manifest as scattered energy or avoidance of commitment. The invitation is to find freedom within form—to recognize that deep exploration of any path reveals the same infinite territory.`,
  },
  6: {
    digit: 6,
    name: "The Nurturer",
    keywords: ["responsibility", "care", "harmony", "service", "beauty"],
    brief:
      "Six carries the warmth of home and heart. You may feel drawn to caring for others and creating spaces of beauty and belonging.",
    extended: `Six is the heart of the number spectrum—the energy of love made practical through service and care. It resonates with home, family, and the quiet heroism of showing up for others day after day. Those who carry Six often create environments where people feel nurtured and safe.

This energy invites devotion without martyrdom. Six understands that genuine care includes caring for yourself, and that the most sustainable service flows from fullness rather than depletion. You may find yourself naturally drawn to healing work, teaching, or creating beauty.

The challenge of Six is avoiding over-responsibility and perfectionism. Your desire to help can become controlling if not held lightly. The invitation is to offer care with open hands, trusting others' capacity to find their own way.`,
  },
  7: {
    digit: 7,
    name: "The Seeker",
    keywords: ["introspection", "analysis", "wisdom", "spirituality", "depth"],
    brief:
      "Seven seeks truth beneath the surface. You may have a natural inclination toward study, solitude, and understanding life's deeper mysteries.",
    extended: `Seven carries the energy of the philosopher and mystic—the drive to look beyond appearances and find the pattern beneath. It seeks not just knowledge but understanding, not just answers but the right questions. Those who resonate with Seven often need significant solitude and find their deepest nourishment in contemplation.

This energy invites trust in your inner knowing. Seven understands that some truths cannot be taught, only discovered through patient inquiry and direct experience. You may find yourself drawn to research, spiritual practice, or any field requiring depth over breadth.

The shadow of Seven can become isolation or intellectual arrogance. The invitation is to share your insights while remaining a student, to balance inner exploration with meaningful connection.`,
  },
  8: {
    digit: 8,
    name: "The Achiever",
    keywords: ["ambition", "authority", "abundance", "manifestation", "power"],
    brief:
      "Eight embodies mastery of the material world. You may have a natural capacity for leadership, wealth creation, and bringing visions into reality.",
    extended: `Eight is the number of manifestation and material mastery. Its shape—the lemniscate turned upright—suggests the infinite flow between the spiritual and material realms. Those who carry Eight often have natural business acumen and the capacity to create abundance and influence.

This energy invites responsible use of power. Eight understands that true authority is earned through competence and integrity, and that wealth is a tool for creating impact, not an end in itself. You may find yourself in leadership positions or drawn to entrepreneurship.

The challenge of Eight is avoiding the trap of power for its own sake. Material success means nothing without purpose. The invitation is to use your capacity for achievement in service of something beyond personal gain.`,
  },
  9: {
    digit: 9,
    name: "The Humanitarian",
    keywords: ["compassion", "completion", "wisdom", "service", "universality"],
    brief:
      "Nine holds the wisdom of all numbers before it. You may feel called to serve humanity and find meaning through giving back.",
    extended: `Nine is the completion of the single-digit cycle, containing within it the essence of all numbers that came before. It carries the energy of universal love, humanitarian concern, and the wisdom that comes from lived experience. Those who resonate with Nine often feel connected to something larger than personal concerns.

This energy invites letting go and giving back. Nine understands that the deepest fulfillment comes through contribution, and that endings are necessary for new beginnings. You may find yourself drawn to charitable work, teaching, or any field that serves the collective good.

The shadow of Nine can manifest as martyrdom or difficulty with closure. The invitation is to serve from wisdom rather than obligation, and to trust that releasing what's complete creates space for what's next.`,
  },
  11: {
    digit: 11,
    name: "The Intuitive",
    keywords: ["vision", "inspiration", "illumination", "sensitivity", "idealism"],
    brief:
      "Eleven carries heightened intuition and visionary capacity. You may sense things others miss and feel called to inspire and illuminate.",
    extended: `Eleven is the first master number—a doubling of One's initiative with the sensitivity of Two woven through. It carries the energy of the visionary, the channel, the one who receives insight from beyond ordinary perception. Those who carry this master number often have intensified intuition and idealism.

This energy invites trust in your visions while staying grounded. Eleven understands that inspiration means nothing without expression, that the channel must care for itself to remain clear. You may find yourself drawn to spiritual teaching, counseling, or any work that bridges the seen and unseen.

The challenge of Eleven is managing heightened sensitivity and avoiding the paralysis of perfectionism. The practical expression of Eleven often looks like Two—cooperation and patience. The invitation is to honor both the vision and the incremental work of bringing it to earth.`,
  },
  22: {
    digit: 22,
    name: "The Master Builder",
    keywords: ["practical idealism", "large-scale creation", "discipline", "vision", "legacy"],
    brief:
      "Twenty-Two combines vision with practical mastery. You may be called to create structures and systems that serve many.",
    extended: `Twenty-Two is the master builder—the marriage of Eleven's vision with Four's practical foundation. It carries the potential to manifest grand ideas in concrete form, to create institutions, systems, and works that serve humanity across generations. Those who carry this master number often feel the weight of large-scale purpose.

This energy invites patience with your own unfolding. Twenty-Two's potential cannot be rushed; the foundation must be solid before the tower rises. You may find yourself drawn to architecture, organizational leadership, or any field where lasting structures serve collective needs.

The challenge of Twenty-Two is the gap between vision and reality. The practical expression often looks like Four—methodical, patient, focused on what's in front of you. The invitation is to trust that mastery is built one brick at a time, and that grand visions are realized through humble daily work.`,
  },
  33: {
    digit: 33,
    name: "The Master Teacher",
    keywords: ["healing", "selfless service", "upliftment", "compassion", "mastery"],
    brief:
      "Thirty-Three embodies the highest form of nurturing and teaching. You may feel called to heal and uplift through pure service.",
    extended: `Thirty-Three is the rarest master number—a doubling of Six's nurturing energy elevated to mastery. It carries the potential for profound healing and teaching, the capacity to uplift others through example and compassion. Those who carry this master number often feel an almost overwhelming call to service.

This energy invites surrender to something larger. Thirty-Three understands that the highest teaching happens through being, not just doing, and that true healing flows through the healer rather than from them. You may find yourself in roles of spiritual leadership, healing arts, or devoted service.

The challenge of Thirty-Three is managing the intensity of the call without burning out. The practical expression often looks like Six—focused care for those directly in your sphere. The invitation is to trust that serving one person fully is as valuable as dreaming of saving the world.`,
  },
};

/**
 * Get the meaning for a numerology number
 */
export function getNumberMeaning(digit: number): NumberMeaning | null {
  if (digit in NUMBER_MEANINGS) {
    return NUMBER_MEANINGS[digit as NumerologyDigit];
  }
  return null;
}

/**
 * Context-specific meanings for numbers in different positions
 */
const CONTEXTUAL_MEANINGS: Partial<Record<NumberType, Partial<Record<NumerologyDigit, ContextualMeaning>>>> = {
  lifePath: {
    1: {
      digit: 1,
      context: "lifePath",
      title: "Life Path of Independence",
      description:
        "Your life journey invites you to develop self-reliance and original thinking. Major lessons come through leading and initiating.",
    },
    7: {
      digit: 7,
      context: "lifePath",
      title: "Life Path of the Seeker",
      description:
        "Your life journey invites deep inquiry and spiritual development. Major lessons come through solitude, study, and trusting your inner knowing.",
    },
    11: {
      digit: 11,
      context: "lifePath",
      title: "Master Path of Illumination",
      description:
        "Your life journey carries heightened spiritual purpose. Major lessons involve channeling inspiration while staying grounded in practical reality.",
    },
  },
  personalYear: {
    1: {
      digit: 1,
      context: "personalYear",
      title: "Year of New Beginnings",
      description:
        "A year for planting seeds and starting fresh. Initiative and independence are favored. What you begin now sets the tone for the next nine years.",
    },
    9: {
      digit: 9,
      context: "personalYear",
      title: "Year of Completion",
      description:
        "A year for endings and release. Clear out what no longer serves to make space for the new cycle beginning next year.",
    },
  },
  expression: {
    3: {
      digit: 3,
      context: "expression",
      title: "Natural Communicator",
      description:
        "Your talents naturally flow toward creative expression. You work best when you can inspire, entertain, or bring joy to others.",
    },
    8: {
      digit: 8,
      context: "expression",
      title: "Natural Executive",
      description:
        "Your talents naturally flow toward leadership and manifestation. You work best when building something of lasting value.",
    },
  },
  soulUrge: {
    5: {
      digit: 5,
      context: "soulUrge",
      title: "Heart Craves Freedom",
      description:
        "At your core, you yearn for variety, adventure, and the freedom to explore. You feel most fulfilled when life offers new experiences.",
    },
    6: {
      digit: 6,
      context: "soulUrge",
      title: "Heart Craves Harmony",
      description:
        "At your core, you yearn to nurture and create beauty. You feel most fulfilled when caring for others and cultivating peaceful environments.",
    },
  },
};

/**
 * Get contextual meaning for a number in a specific position
 */
export function getContextualMeaning(
  digit: number,
  context: NumberType
): ContextualMeaning | null {
  const contextMeanings = CONTEXTUAL_MEANINGS[context];
  if (!contextMeanings) return null;

  return contextMeanings[digit as NumerologyDigit] ?? null;
}

/**
 * Get both base and contextual meaning for a number
 */
export function getFullMeaning(
  digit: number,
  context?: NumberType
): { base: NumberMeaning; contextual: ContextualMeaning | null } | null {
  const base = getNumberMeaning(digit);
  if (!base) return null;

  const contextual = context ? getContextualMeaning(digit, context) : null;

  return { base, contextual };
}
