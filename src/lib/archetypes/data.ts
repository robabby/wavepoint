/**
 * Jungian Archetype data - 12 core psychological archetypes.
 *
 * Based on Carl Jung's archetypal psychology and the 12-archetype
 * framework popularized by Carol Pearson in "Awakening the Heroes Within."
 *
 * Planetary correspondences follow Jungian alchemical psychology.
 */

import type { Archetype, ArchetypeSlug } from "./types";

/**
 * Complete data for all 12 Jungian archetypes
 */
export const ARCHETYPES: Record<ArchetypeSlug, Archetype> = {
  "the-innocent": {
    slug: "the-innocent",
    name: "The Innocent",
    planet: "moon",
    element: "water",
    motto: "Free to be you and me",
    coreDesire: "To experience paradise",
    goal: "To be happy",
    greatestFear: "Doing something wrong or bad that will provoke punishment",
    strategy: "Do things right, follow the rules, stay optimistic",
    weakness: "Naivety, denial, and tendency to repress problems",
    talent: "Faith, optimism, and the ability to inspire hope in others",
    keywords: ["purity", "optimism", "faith", "trust", "simplicity", "wonder"],
    description:
      "The Innocent archetype embodies the pure, unburdened self before the wounds of experience. Like the Moon reflecting the Sun's light without distortion, the Innocent sees the world through eyes of wonder and trust. This archetype believes in the essential goodness of life and seeks to return to paradise—whether through spiritual practice, nostalgic remembrance, or creating safe havens.\n\nThe Innocent teaches us about the power of faith and positive thinking. Their optimism is not naive denial but rather a deep knowing that goodness exists even when hidden. In their highest expression, Innocents become beacons of hope, reminding others that renewal and redemption are always possible.",
    shadow:
      "When wounded, the Innocent may become a victim, unable to see danger or take responsibility. The shadow Innocent clings to unrealistic expectations, refuses to grow up, or falls into chronic disappointment when the world fails to match their idealized vision. They may also become dependent on others to protect them from life's harsh realities.",
    imagePath: "/images/archetypes/the-innocent.jpg",
  },

  "the-orphan": {
    slug: "the-orphan",
    name: "The Orphan",
    planet: "saturn",
    element: "earth",
    motto: "All people are created equal",
    coreDesire: "To belong and connect with others",
    goal: "To find a place in the world, to fit in",
    greatestFear: "Being left out, abandoned, or exploited",
    strategy: "Develop ordinary, solid virtues; be down to earth and real",
    weakness: "Cynicism, tendency to play the victim, chronic disappointment",
    talent: "Realism, empathy, resilience, and unpretentious authenticity",
    keywords: ["belonging", "realism", "empathy", "resilience", "equality", "solidarity"],
    description:
      "The Orphan archetype emerges from the fall from innocence—the moment we realize the world is not the safe paradise we imagined. Under Saturn's influence, the Orphan learns hard truths about limitation, loss, and the need for genuine connection. This archetype understands suffering because they have known it intimately.\n\nFar from being purely wounded, the mature Orphan develops profound empathy and the wisdom that comes from lived experience. They become advocates for the underdog, building bridges between people through their understanding that everyone struggles. The Orphan teaches us that true belonging comes not from perfection but from authentic vulnerability.",
    shadow:
      "The shadow Orphan becomes the perpetual victim, manipulating others through their wounds and refusing to take responsibility for their healing. They may develop cynical worldviews, sabotage their own success to maintain their victim identity, or become exploiters themselves, believing they deserve special treatment because of past suffering.",
    imagePath: "/images/archetypes/the-orphan.jpg",
  },

  "the-hero": {
    slug: "the-hero",
    name: "The Hero",
    planet: "mars",
    element: "fire",
    motto: "Where there's a will, there's a way",
    coreDesire: "To prove one's worth through courageous action",
    goal: "To use strength and competence to improve the world",
    greatestFear: "Weakness, vulnerability, being seen as a coward",
    strategy: "Become as strong and competent as possible",
    weakness: "Arrogance, ruthlessness, and seeing enemies everywhere",
    talent: "Courage, discipline, and the ability to persevere against odds",
    keywords: ["courage", "competence", "achievement", "discipline", "strength", "victory"],
    description:
      "The Hero archetype channels the fiery energy of Mars to overcome obstacles and prove their worth. This is the warrior within—the part of us that rises to meet challenges, develops skills through discipline, and refuses to surrender when the path grows difficult. The Hero's journey is the classic narrative of transformation through trial.\n\nTrue heroism is not about defeating enemies but about mastering oneself. The Hero teaches us that courage is not the absence of fear but action in spite of it. In their highest expression, Heroes become protectors and champions of those who cannot fight for themselves, using their strength in service of justice.",
    shadow:
      "The shadow Hero becomes the villain—using power to dominate rather than protect, creating enemies where none exist, or becoming so identified with the warrior role that they cannot rest or receive help. They may also become ruthless competitors, sacrificing relationships and ethics in pursuit of victory.",
    imagePath: "/images/archetypes/the-hero.jpg",
  },

  "the-caregiver": {
    slug: "the-caregiver",
    name: "The Caregiver",
    planet: "moon",
    element: "water",
    motto: "Love your neighbor as yourself",
    coreDesire: "To protect and care for others",
    goal: "To help others through generosity and compassion",
    greatestFear: "Selfishness and ingratitude",
    strategy: "Anticipate needs, sacrifice for others, nurture with devotion",
    weakness: "Martyrdom, enabling, and being exploited",
    talent: "Compassion, generosity, and the gift of nurturing",
    keywords: ["compassion", "generosity", "nurturing", "protection", "service", "selflessness"],
    description:
      "The Caregiver archetype embodies the nurturing aspect of the lunar feminine—the capacity to hold, protect, and support life. Like the Moon that governs the tides and rhythms of nature, the Caregiver attunes to the needs of others and responds with unconditional care. This archetype is the parent, healer, and guardian in us all.\n\nThe Caregiver teaches us that love is action—not merely feeling, but consistent, dedicated presence. They demonstrate the power of service and the deep fulfillment that comes from contributing to others' wellbeing. In their highest expression, Caregivers create environments where growth and healing can occur.",
    shadow:
      "The shadow Caregiver becomes the martyr or suffocating parent—giving to control, sacrificing to create guilt, or enabling harmful behaviors. They may neglect their own needs until bitterness erupts, or use caretaking as a way to avoid facing their own inner work. The shadow Caregiver can also manipulate through guilt.",
    imagePath: "/images/archetypes/the-caregiver.jpg",
  },

  "the-explorer": {
    slug: "the-explorer",
    name: "The Explorer",
    planet: "jupiter",
    element: "fire",
    motto: "Don't fence me in",
    coreDesire: "The freedom to find out who you are through exploring the world",
    goal: "To experience a more authentic, fulfilling life",
    greatestFear: "Being trapped, conformity, inner emptiness",
    strategy: "Journey forth, seek new experiences, escape boredom",
    weakness: "Aimless wandering, becoming a misfit, chronic dissatisfaction",
    talent: "Autonomy, ambition, and the ability to be true to one's soul",
    keywords: ["freedom", "discovery", "autonomy", "adventure", "authenticity", "independence"],
    description:
      "The Explorer archetype is fueled by Jupiter's expansive energy—the drive to go beyond known boundaries in search of meaning, truth, and authentic selfhood. Whether the journey is physical, intellectual, or spiritual, the Explorer refuses to accept the confines of convention. They are the pioneers and seekers, eternally drawn to horizons.\n\nThe Explorer teaches us that growth requires leaving comfort zones and risking the unknown. They demonstrate that authenticity is discovered through experience, not inherited from tradition. In their highest expression, Explorers become pathfinders who return from their journeys bearing gifts of wisdom and expanded possibility for others.",
    shadow:
      "The shadow Explorer becomes the eternal wanderer who can never commit, always believing fulfillment lies somewhere else. They may become alienated outsiders, too independent to connect meaningfully, or perfectionists who can never settle because nothing measures up to their idealized vision. The shadow Explorer runs from rather than toward.",
    imagePath: "/images/archetypes/the-explorer.jpg",
  },

  "the-rebel": {
    slug: "the-rebel",
    name: "The Rebel",
    planet: "mars",
    element: "fire",
    motto: "Rules are made to be broken",
    coreDesire: "Revenge or revolution—to overturn what isn't working",
    goal: "To destroy or transform what is not serving life",
    greatestFear: "Being powerless, ineffectual, or ordinary",
    strategy: "Disrupt, destroy, or shock; break the rules",
    weakness: "Crossing over to the dark side, crime, addiction",
    talent: "Radical freedom, willingness to challenge the status quo",
    keywords: ["liberation", "disruption", "revolution", "transformation", "radical", "change"],
    description:
      "The Rebel archetype channels Mars' destructive-creative fire to break down structures that have become oppressive or obsolete. This is the revolutionary spirit that refuses to accept injustice, the iconoclast who tears away illusions, and the catalyst who initiates necessary change even at great personal cost.\n\nThe Rebel teaches us that destruction is sometimes required for renewal—that saying no to what harms us is an act of self-respect. They demonstrate that conformity in the face of wrongness is its own kind of violence. In their highest expression, Rebels become liberators and reformers who clear the ground for new, more life-affirming structures.",
    shadow:
      "The shadow Rebel becomes the destroyer without purpose—addicted to chaos, rebellion for its own sake, or becoming the very tyranny they opposed. They may engage in self-destructive behavior, turn their rage inward, or become so identified with opposition that they cannot participate constructively in anything.",
    imagePath: "/images/archetypes/the-rebel.jpg",
  },

  "the-lover": {
    slug: "the-lover",
    name: "The Lover",
    planet: "venus",
    element: "water",
    motto: "You're the only one",
    coreDesire: "To attain intimacy and experience sensual pleasure",
    goal: "To be in relationship with people, experiences, and surroundings",
    greatestFear: "Being alone, unwanted, or unloved",
    strategy: "Become ever more attractive—physically, emotionally, and otherwise",
    weakness: "Outward-directed desire to please at risk of losing identity",
    talent: "Passion, gratitude, appreciation, and commitment",
    keywords: ["passion", "connection", "intimacy", "beauty", "devotion", "pleasure"],
    description:
      "The Lover archetype is governed by Venus, goddess of beauty, love, and the magnetic pull between souls. This archetype experiences life through the heart, seeking union with what is beautiful, meaningful, and beloved. The Lover is not limited to romantic love—they fall in love with ideas, causes, art, nature, and life itself.\n\nThe Lover teaches us about the transformative power of passion and the courage required for true intimacy. They demonstrate that connection—whether to a person, a calling, or the divine—is what makes life worth living. In their highest expression, Lovers become artists of relationship, creating beauty and depth wherever they engage.",
    shadow:
      "The shadow Lover becomes obsessed with the object of desire to the point of losing themselves. They may become jealous, possessive, or willing to compromise all values for love. The shadow Lover can also become promiscuous, seeking intensity without depth, or using attractiveness to manipulate others.",
    imagePath: "/images/archetypes/the-lover.jpg",
  },

  "the-creator": {
    slug: "the-creator",
    name: "The Creator",
    planet: "mercury",
    element: "air",
    motto: "If you can imagine it, it can be done",
    coreDesire: "To create enduring value and give form to vision",
    goal: "To realize a vision in a concrete form",
    greatestFear: "Mediocre vision or execution; inauthenticity",
    strategy: "Develop artistic control and skill; be a perfectionist",
    weakness: "Perfectionism, living in imagination rather than reality",
    talent: "Creativity, imagination, and the ability to express vision",
    keywords: ["innovation", "imagination", "expression", "vision", "artistry", "originality"],
    description:
      "The Creator archetype channels Mercury's quicksilver intelligence into the act of bringing new things into being. This is the artist, inventor, and visionary within—the part of us that cannot rest until what we imagine takes form in the world. The Creator understands that making things is how we participate in the ongoing creation of reality.\n\nThe Creator teaches us that everyone is inherently creative and that authentic self-expression is a spiritual necessity. They demonstrate that the universe is not finished but continually emerging through our contributions. In their highest expression, Creators become channels for something larger than themselves, producing work that inspires and transforms others.",
    shadow:
      "The shadow Creator becomes the perfectionist tortured by the gap between vision and execution, or the mad artist who sacrifices relationships and wellbeing for their work. They may produce creatively but destroy in their personal lives, or become so absorbed in imagination that they lose touch with reality. The shadow Creator can also steal or plagiarize, having lost faith in their own originality.",
    imagePath: "/images/archetypes/the-creator.jpg",
  },

  "the-jester": {
    slug: "the-jester",
    name: "The Jester",
    planet: "mercury",
    element: "air",
    motto: "You only live once",
    coreDesire: "To live in the moment with full enjoyment",
    goal: "To have a great time and lighten up the world",
    greatestFear: "Being bored or boring others",
    strategy: "Play, make jokes, be funny, use humor to reframe reality",
    weakness: "Frivolity, wasting time, and using humor to avoid truth",
    talent: "Joy, lightness, and the ability to reveal truth through humor",
    keywords: ["joy", "humor", "playfulness", "lightness", "presence", "wit"],
    description:
      "The Jester archetype expresses Mercury's trickster aspect—the quicksilver wit that dances at the edges of propriety and reveals truth through laughter. The Jester knows that life is too important to be taken seriously all the time, and that play is not the opposite of work but its necessary complement.\n\nThe Jester teaches us that humor is a form of wisdom and that joy is not frivolous but essential to psychological and spiritual health. They demonstrate that the ability to laugh at ourselves is liberating, and that the holy fool often speaks truths that the wise dare not utter. In their highest expression, Jesters become sacred clowns who use levity to heal and transform.",
    shadow:
      "The shadow Jester uses humor to wound, manipulate, or avoid dealing with serious matters. They may become cruel comics, using wit as a weapon, or slackers who waste their potential in endless diversions. The shadow Jester can also mask depression or despair beneath a constant performance of cheerfulness.",
    imagePath: "/images/archetypes/the-jester.jpg",
  },

  "the-sage": {
    slug: "the-sage",
    name: "The Sage",
    planet: "saturn",
    element: "earth",
    motto: "The truth will set you free",
    coreDesire: "To find the truth and understand reality",
    goal: "To use intelligence and analysis to understand the world",
    greatestFear: "Being deceived, misled, or remaining ignorant",
    strategy: "Seek out information, knowledge, and self-reflection",
    weakness: "Coldness, intellectual arrogance, endless study without action",
    talent: "Wisdom, intelligence, and the ability to see patterns",
    keywords: ["wisdom", "knowledge", "understanding", "truth", "objectivity", "insight"],
    description:
      "The Sage archetype embodies Saturn's gift of wisdom gained through time, discipline, and deep reflection. This is the philosopher, scholar, and mentor within—the part of us that seeks not just information but genuine understanding. The Sage knows that knowledge without wisdom is dangerous, and that true understanding requires both intellectual rigor and life experience.\n\nThe Sage teaches us that the examined life is worth living and that the pursuit of truth is among the highest human callings. They demonstrate that wisdom is not the accumulation of facts but the ability to discern what matters and see the deeper patterns beneath surface appearances. In their highest expression, Sages become teachers who illuminate the path for others.",
    shadow:
      "The shadow Sage becomes the cold analyst disconnected from feeling, or the ivory tower intellectual contemptuous of those less educated. They may use knowledge as power, withholding information to maintain superiority, or become paralyzed by endless analysis, never acting because they never know enough. The shadow Sage can also become dogmatic, confusing their current understanding with absolute truth.",
    imagePath: "/images/archetypes/the-sage.jpg",
  },

  "the-magician": {
    slug: "the-magician",
    name: "The Magician",
    planet: "sun",
    element: "fire",
    motto: "I make things happen",
    coreDesire: "To understand the fundamental laws of the universe",
    goal: "To make dreams come true and transform reality",
    greatestFear: "Unintended negative consequences; manipulation",
    strategy: "Develop a vision and live it; align with cosmic principles",
    weakness: "Manipulation, shadow magic, becoming corrupted by power",
    talent: "Transforming reality by channeling higher principles into form",
    keywords: ["transformation", "vision", "power", "manifestation", "alchemy", "consciousness"],
    description:
      "The Magician archetype channels the Sun's radiant consciousness—the awareness that can transform reality through aligned intention. This is the alchemist and shaman within, the part of us that understands the connection between inner states and outer manifestations. The Magician knows that consciousness is creative and that mastery of self leads to mastery of circumstances.\n\nThe Magician teaches us about the power of vision, belief, and alignment with universal principles. They demonstrate that we are not passive recipients of reality but active participants in its creation. In their highest expression, Magicians become healers and transformers, using their understanding of cosmic laws to serve evolution.",
    shadow:
      "The shadow Magician becomes the manipulator—using knowledge of how reality works to deceive, control, or harm others. They may become addicted to power, convinced that the ends justify the means, or use their gifts for ego inflation rather than service. The shadow Magician can also become the charlatan, performing empty rituals without real understanding.",
    imagePath: "/images/archetypes/the-magician.jpg",
  },

  "the-ruler": {
    slug: "the-ruler",
    name: "The Ruler",
    planet: "sun",
    element: "fire",
    motto: "Power isn't everything, it's the only thing",
    coreDesire: "Control and sovereignty over one's domain",
    goal: "To create a prosperous, successful family, company, or community",
    greatestFear: "Chaos, being overthrown, loss of control",
    strategy: "Exercise power through leadership and taking responsibility",
    weakness: "Authoritarianism, inability to delegate, being out of touch",
    talent: "Responsibility, leadership, and the ability to create order from chaos",
    keywords: ["control", "responsibility", "leadership", "order", "authority", "sovereignty"],
    description:
      "The Ruler archetype expresses the Sun's principle of centralized radiance—the conscious will that organizes, directs, and takes responsibility for an entire domain. This is the king, queen, CEO, and head of household within, the part of us that must exercise authority and be accountable for results. The Ruler knows that power is responsibility and that leadership is service.\n\nThe Ruler teaches us about the necessity of order, the dignity of authority well-exercised, and the fulfillment that comes from creating and maintaining prosperous systems. They demonstrate that someone must take charge and that avoiding power is its own kind of irresponsibility. In their highest expression, Rulers become benevolent sovereigns who use their position to create conditions where all can flourish.",
    shadow:
      "The shadow Ruler becomes the tyrant—controlling through fear, refusing to share power, or prioritizing their position over the wellbeing of those they lead. They may become rigid and out of touch, making rules that serve their comfort rather than the community's needs. The shadow Ruler can also be the politician who seeks power for its own sake, without genuine care for those they govern.",
    imagePath: "/images/archetypes/the-ruler.jpg",
  },
};

/**
 * Get all archetypes as an array (alphabetically by name)
 */
export function getAllArchetypes(): Archetype[] {
  return Object.values(ARCHETYPES).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get an archetype by slug
 */
export function getArchetypeBySlug(slug: string): Archetype | undefined {
  return ARCHETYPES[slug as ArchetypeSlug];
}
