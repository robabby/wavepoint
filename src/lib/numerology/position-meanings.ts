/**
 * Position-specific meanings for numerology digits.
 *
 * Each digit (1-9, 11, 22, 33) has different significance depending on
 * which position it appears in. These 72 contextual meanings (6 positions × 12 digits)
 * provide the specific interpretation for each combination.
 *
 * Voice & Tone: Grounded, not grandiose. Invitation over instruction.
 * Following WavePoint's "modern mystic" identity.
 */

import type { CoreNumberType, NumerologyDigit } from "./types";

/**
 * A contextual meaning for a digit in a specific position
 */
export interface PositionMeaning {
  /** The digit this meaning applies to */
  digit: NumerologyDigit;
  /** The position context (lifePath, expression, etc.) */
  context: CoreNumberType;
  /** Title for this combination (e.g., "Life Path 7: The Seeker's Journey") */
  title: string;
  /** Brief description (1-2 sentences) */
  description: string;
  /** Extended meaning (2-3 paragraphs) */
  extended: string;
}

/**
 * All position-specific meanings organized by position type then digit
 */
export const POSITION_MEANINGS: Record<CoreNumberType, Record<NumerologyDigit, PositionMeaning>> = {
  lifePath: {
    1: {
      digit: 1,
      context: "lifePath",
      title: "Life Path 1: The Pioneer's Journey",
      description:
        "Your life journey invites you to develop independence, self-reliance, and original thinking. Major lessons come through leading and initiating new ventures.",
      extended: `As a Life Path 1, you're here to discover and express your individuality. Your journey is about learning to trust yourself, to take initiative, and to lead—not necessarily others, but your own life with conviction. You may find that circumstances continually push you toward self-reliance.

The lessons of this path often come through experiences that require you to stand alone, make decisions independently, and forge new ground. You might feel frustrated by dependence on others or situations that don't allow you to express your originality.

Your greatest growth comes through embracing leadership roles, starting new projects, and having the courage to be different. The invitation is to pioneer your own path while remaining open to collaboration when it serves your vision.`,
    },
    2: {
      digit: 2,
      context: "lifePath",
      title: "Life Path 2: The Diplomat's Journey",
      description:
        "Your life journey centers on partnership, harmony, and the subtle art of cooperation. Major lessons emerge through relationships and learning to balance give and take.",
      extended: `As a Life Path 2, you're here to master the art of relationship—with others and with yourself. Your journey involves developing patience, diplomacy, and the ability to create harmony in your environment. You possess heightened sensitivity that, when developed, becomes profound intuition.

The lessons of this path often come through partnerships—romantic, business, and creative. You may struggle with codependency or find yourself mediating others' conflicts. Learning healthy boundaries while maintaining your natural gift for connection is key.

Your greatest growth comes through supporting roles that allow your receptive wisdom to shine. You don't need to lead from the front; your power lies in the space between—in the connections you foster and the peace you create.`,
    },
    3: {
      digit: 3,
      context: "lifePath",
      title: "Life Path 3: The Communicator's Journey",
      description:
        "Your life journey is one of creative expression, joy, and inspiring others. Major lessons come through finding and sharing your unique voice.",
      extended: `As a Life Path 3, you're here to express, create, and bring joy. Your journey involves learning to channel your natural creativity into forms that inspire and uplift. You have a gift for communication in all its forms—words, art, performance, or simply the way you light up a room.

The lessons of this path often come through creative blocks, self-doubt, or scattering your talents too thin. You may struggle with taking your gifts seriously or fear that your lightheartedness isn't "enough." Yet your ability to find beauty and share it is precisely what the world needs.

Your greatest growth comes through committing to your creative expression while maintaining the playfulness that makes it authentic. The invitation is to share your unique perspective without needing validation, trusting that your natural joy is a genuine contribution.`,
    },
    4: {
      digit: 4,
      context: "lifePath",
      title: "Life Path 4: The Builder's Journey",
      description:
        "Your life journey is one of creating lasting structures and foundations. Major lessons come through discipline, patience, and the satisfaction of tangible achievement.",
      extended: `As a Life Path 4, you're here to build something that endures. Your journey involves learning to work with the material world—creating systems, structures, and processes that serve practical needs. You have a natural talent for organization and an innate understanding that meaningful achievements require consistent effort.

The lessons of this path often come through experiences that test your patience and discipline. You may struggle with rigidity, feeling boxed in, or the frustration of slow progress. Yet your ability to create order from chaos is genuinely valuable.

Your greatest growth comes through embracing process over shortcuts, finding flexibility within structure, and creating foundations strong enough to support both stability and growth. The invitation is to build with purpose while remembering that structures serve life, not the other way around.`,
    },
    5: {
      digit: 5,
      context: "lifePath",
      title: "Life Path 5: The Adventurer's Journey",
      description:
        "Your life journey is one of freedom, change, and learning through direct experience. Major lessons come through embracing variety while finding deeper freedom within.",
      extended: `As a Life Path 5, you're here to experience life in its full variety. Your journey involves learning through direct encounter with the world—travel, diverse relationships, and the wisdom that comes from tasting many aspects of existence. You have a natural restlessness that, properly channeled, becomes a gift for adaptation.

The lessons of this path often come through restriction or the consequences of scattered energy. You may struggle with commitment or find yourself constantly seeking the next new thing. Yet your ability to embrace change is a genuine strength in a world that demands flexibility.

Your greatest growth comes through finding freedom within form—discovering that deep exploration of any path reveals infinite territory. The invitation is to use your love of variety to gain wisdom rather than merely accumulating experiences.`,
    },
    6: {
      digit: 6,
      context: "lifePath",
      title: "Life Path 6: The Nurturer's Journey",
      description:
        "Your life journey centers on love, responsibility, and creating spaces of beauty and belonging. Major lessons come through service to family, community, and those in your care.",
      extended: `As a Life Path 6, you're here to nurture and create harmony. Your journey involves learning to care for others while maintaining care for yourself—a balance that often proves more challenging than it sounds. You have a natural ability to create environments where people feel safe, loved, and beautiful.

The lessons of this path often come through over-responsibility, perfectionism, or martyrdom. You may struggle with controlling tendencies born from genuine care, or find yourself depleted by giving too much. Learning to serve from fullness rather than obligation is essential.

Your greatest growth comes through offering care with open hands—helping without controlling, loving without conditions. The invitation is to create beauty and harmony while trusting others' capacity to find their own way.`,
    },
    7: {
      digit: 7,
      context: "lifePath",
      title: "Life Path 7: The Seeker's Journey",
      description:
        "Your life journey is one of deep inquiry, wisdom, and spiritual understanding. Major lessons come through solitude, study, and trusting your inner knowing.",
      extended: `As a Life Path 7, you're here to seek truth beneath the surface. Your journey involves developing the wisdom that comes from looking deeper—through analysis, introspection, and spiritual exploration. You have a natural need for solitude and an innate distrust of superficial answers.

The lessons of this path often come through isolation, intellectual pride, or difficulty connecting emotionally with others. You may struggle with skepticism that blocks receptivity, or find that your inner life feels more real than outer circumstances.

Your greatest growth comes through balancing inner exploration with meaningful connection, sharing your insights while remaining a student. The invitation is to trust your intuition while staying open to wisdom from unexpected sources.`,
    },
    8: {
      digit: 8,
      context: "lifePath",
      title: "Life Path 8: The Achiever's Journey",
      description:
        "Your life journey is one of mastering the material world—power, abundance, and creating lasting impact. Major lessons come through authority, success, and responsible use of resources.",
      extended: `As a Life Path 8, you're here to learn the lessons of power and manifestation. Your journey involves developing the ability to create abundance, lead effectively, and translate vision into material reality. You have natural business acumen and an understanding of how the world of commerce and influence operates.

The lessons of this path often come through challenges with money, authority, or the consequences of misused power. You may struggle with workaholism, materialism, or difficulty accepting help. Yet your capacity for achievement is a genuine gift when used consciously.

Your greatest growth comes through using power in service of something beyond personal gain—creating businesses that serve, leading with integrity, manifesting abundance that benefits many. The invitation is to master the material world without being mastered by it.`,
    },
    9: {
      digit: 9,
      context: "lifePath",
      title: "Life Path 9: The Humanitarian's Journey",
      description:
        "Your life journey is one of universal love, completion, and service to humanity. Major lessons come through letting go, giving back, and finding meaning through contribution.",
      extended: `As a Life Path 9, you're here to complete a cycle and contribute to the whole. Your journey involves developing the compassion and wisdom that come from lived experience—you often feel you've seen much of what life has to offer. You have a natural connection to universal concerns that transcend personal interest.

The lessons of this path often come through difficulty with endings, attachment to the past, or martyrdom in service. You may struggle with feeling misunderstood or with the tension between personal needs and humanitarian ideals.

Your greatest growth comes through letting go gracefully, serving from wisdom rather than obligation, and trusting that release creates space for new beginnings. The invitation is to give back generously while honoring your own needs for rest and renewal.`,
    },
    11: {
      digit: 11,
      context: "lifePath",
      title: "Master Life Path 11: The Illuminator's Journey",
      description:
        "Your life journey carries heightened spiritual purpose—to receive and transmit inspiration. Major lessons involve channeling vision while staying grounded in practical reality.",
      extended: `As a Life Path 11, you walk a master path of illumination. Your journey involves developing the ability to receive intuitive insight and share it with others—you're meant to be a channel for higher wisdom. You likely experience heightened sensitivity, vivid dreams, and an awareness of subtler dimensions of reality.

The lessons of this path often come through nervous tension, impracticality, or the paralysis of perfectionism. You may struggle with self-doubt despite your gifts, or find the intensity of your perceptions overwhelming. Learning to ground your visions in practical action is essential.

Your greatest growth comes through trusting your intuition while doing the mundane work of bringing inspiration to earth. The practical expression of 11 often looks like 2—patience, cooperation, and building bridges. The invitation is to illuminate while remaining humble, to inspire while staying grounded.`,
    },
    22: {
      digit: 22,
      context: "lifePath",
      title: "Master Life Path 22: The Master Builder's Journey",
      description:
        "Your life journey carries the potential for large-scale creation—building structures and systems that serve humanity. Major lessons involve manifesting grand visions through patient, practical work.",
      extended: `As a Life Path 22, you walk the master path of the builder. Your journey involves developing the ability to manifest ambitious visions in concrete form—to create institutions, systems, or works that serve humanity across generations. The potential of this path is enormous, but so is the responsibility.

The lessons of this path often come through the gap between vision and reality, frustration with slow progress, or the weight of large-scale purpose. You may struggle with impracticality, overwhelm, or the temptation to settle for smaller achievements than you're capable of.

Your greatest growth comes through patient, methodical work that builds solid foundations for your visions. The practical expression of 22 often looks like 4—disciplined, consistent, focused on what's in front of you. The invitation is to trust that mastery is built one brick at a time.`,
    },
    33: {
      digit: 33,
      context: "lifePath",
      title: "Master Life Path 33: The Master Teacher's Journey",
      description:
        "Your life journey carries the highest form of nurturing potential—to heal and uplift through selfless service and embodied wisdom. Major lessons involve serving without martyrdom.",
      extended: `As a Life Path 33, you walk the rarest master path—that of the cosmic teacher and healer. Your journey involves developing the capacity for profound compassion and the wisdom to channel it effectively. You may feel an almost overwhelming call to serve, to heal, to lift others up.

The lessons of this path often come through the intensity of the service calling, difficulty maintaining boundaries, or burnout from giving too much. You may struggle with the weight of sensitivity or the challenge of caring for yourself while caring for the world.

Your greatest growth comes through recognizing that embodied wisdom—being the change—is as important as active service. The practical expression of 33 often looks like 6—devoted care for those in your immediate sphere. The invitation is to trust that serving one person fully is as valuable as dreaming of saving the world.`,
    },
  },
  birthday: {
    1: {
      digit: 1,
      context: "birthday",
      title: "Birthday 1: Natural Leader",
      description:
        "Born on a day of 1 energy, you carry an extra spark of independence and pioneering spirit. This gift supports any Life Path with initiative and original thinking.",
      extended: `The 1 Birthday brings a natural leadership quality to your personality. Even if your Life Path number suggests a more collaborative or receptive approach, you carry this spark of individuality that supports starting new things and trusting your own instincts.

This gift manifests as courage when facing the unknown, ability to make decisions independently, and comfort with standing out from the crowd. You may find that others look to you to take the first step or break new ground.

The invitation of the 1 Birthday is to use this pioneering energy in service of your larger life purpose, whatever that may be. It's a tool, not a destination—a way of moving through the world that can support many different paths.`,
    },
    2: {
      digit: 2,
      context: "birthday",
      title: "Birthday 2: Natural Diplomat",
      description:
        "Born on a day of 2 energy, you carry an extra gift for sensitivity and cooperation. This supports any Life Path with intuition and the ability to create harmony.",
      extended: `The 2 Birthday brings a natural diplomatic quality to your personality. Regardless of your Life Path, you carry this gift of sensitivity—the ability to sense what others need and create connections that bring people together.

This gift manifests as strong intuition, the ability to work well in partnerships, and a natural understanding of timing and nuance. You may find that you're often the one who smooths over conflicts or helps others feel understood.

The invitation of the 2 Birthday is to trust your sensitivity as a genuine strength while developing the discernment to know when to use it. It's a gift that supports relationship-building in service of whatever your larger purpose may be.`,
    },
    3: {
      digit: 3,
      context: "birthday",
      title: "Birthday 3: Natural Communicator",
      description:
        "Born on a day of 3 energy, you carry an extra gift for expression and creative communication. This supports any Life Path with the ability to inspire and uplift.",
      extended: `The 3 Birthday brings a natural expressive quality to your personality. Whatever your Life Path suggests as your core purpose, you carry this additional gift for communication—the ability to share ideas, create beauty, and bring joy to interactions.

This gift manifests as verbal or creative facility, natural charisma, and the ability to find the bright side. You may find that you naturally lift the energy of any room you enter or that others are drawn to your optimistic perspective.

The invitation of the 3 Birthday is to use your communicative gifts in service of your larger purpose, whatever that may be. Your ability to inspire and express can support many different paths and goals.`,
    },
    4: {
      digit: 4,
      context: "birthday",
      title: "Birthday 4: Natural Organizer",
      description:
        "Born on a day of 4 energy, you carry an extra gift for structure and practical implementation. This supports any Life Path with the ability to build and organize.",
      extended: `The 4 Birthday brings a natural organizational quality to your personality. Regardless of your Life Path's direction, you carry this gift for creating structure—the ability to turn ideas into practical reality and bring order to chaos.

This gift manifests as reliability, attention to detail, and the patience to work through step-by-step processes. You may find that others depend on you to follow through and create systems that work.

The invitation of the 4 Birthday is to use your building gifts in service of your larger purpose. Your ability to create practical foundations can support any dream, making the abstract concrete and the visionary achievable.`,
    },
    5: {
      digit: 5,
      context: "birthday",
      title: "Birthday 5: Natural Adventurer",
      description:
        "Born on a day of 5 energy, you carry an extra gift for adaptability and embracing change. This supports any Life Path with versatility and openness to experience.",
      extended: `The 5 Birthday brings a natural adaptability to your personality. Whatever your Life Path suggests as your core journey, you carry this gift for flexibility—the ability to embrace change, learn quickly, and thrive in variety.

This gift manifests as curiosity, quick learning, and comfort with the unknown. You may find that you adapt more easily than others to new situations and that routine feels more confining to you than it does to most.

The invitation of the 5 Birthday is to use your adventurous spirit in service of your larger purpose. Your ability to embrace change and gather diverse experiences can enrich whatever path you're walking.`,
    },
    6: {
      digit: 6,
      context: "birthday",
      title: "Birthday 6: Natural Nurturer",
      description:
        "Born on a day of 6 energy, you carry an extra gift for caregiving and creating harmony. This supports any Life Path with the ability to nurture and beautify.",
      extended: `The 6 Birthday brings a natural nurturing quality to your personality. Regardless of your Life Path's direction, you carry this gift for caring—the ability to create beautiful, harmonious environments and support others' wellbeing.

This gift manifests as domestic talent, aesthetic sense, and the ability to make others feel cared for. You may find that people naturally come to you when they need comfort or that you have an eye for creating beauty.

The invitation of the 6 Birthday is to use your nurturing gifts in service of your larger purpose while maintaining care for yourself. Your ability to create harmony can support many different paths and goals.`,
    },
    7: {
      digit: 7,
      context: "birthday",
      title: "Birthday 7: Natural Analyst",
      description:
        "Born on a day of 7 energy, you carry an extra gift for depth and introspection. This supports any Life Path with the ability to look beneath the surface.",
      extended: `The 7 Birthday brings a natural analytical quality to your personality. Whatever your Life Path suggests as your core purpose, you carry this gift for depth—the ability to see beyond appearances, analyze situations thoroughly, and trust inner knowing.

This gift manifests as intuition, research ability, and comfort with solitude. You may find that you naturally question surface explanations and seek deeper understanding in any area you engage with.

The invitation of the 7 Birthday is to use your seeking nature in service of your larger purpose. Your ability to find wisdom and truth beneath the surface can enrich whatever path you're walking.`,
    },
    8: {
      digit: 8,
      context: "birthday",
      title: "Birthday 8: Natural Executive",
      description:
        "Born on a day of 8 energy, you carry an extra gift for achievement and material mastery. This supports any Life Path with the ability to manifest and lead.",
      extended: `The 8 Birthday brings a natural executive quality to your personality. Regardless of your Life Path's direction, you carry this gift for achievement—the ability to organize resources, lead effectively, and create tangible results.

This gift manifests as business sense, leadership ability, and understanding of how power and resources flow. You may find that you naturally take charge of practical matters and have a talent for making things happen.

The invitation of the 8 Birthday is to use your manifesting gifts in service of your larger purpose. Your ability to achieve and create material results can support many different paths and visions.`,
    },
    9: {
      digit: 9,
      context: "birthday",
      title: "Birthday 9: Natural Humanitarian",
      description:
        "Born on a day of 9 energy, you carry an extra gift for compassion and universal perspective. This supports any Life Path with wisdom and broad vision.",
      extended: `The 9 Birthday brings a natural humanitarian quality to your personality. Whatever your Life Path suggests as your core purpose, you carry this gift for broad vision—the ability to see the bigger picture, feel compassion for many, and bring wisdom to any situation.

This gift manifests as natural wisdom, artistic or healing abilities, and concern for the greater good. You may find that you naturally see beyond personal concerns to universal themes and that you're moved by others' suffering.

The invitation of the 9 Birthday is to use your compassionate perspective in service of your larger purpose. Your ability to see the whole picture and care for many can enrich whatever path you're walking.`,
    },
    11: {
      digit: 11,
      context: "birthday",
      title: "Birthday 11: Intuitive Illuminator",
      description:
        "Born on the 11th or 29th, you carry a master gift for intuition and inspiration. This supports any Life Path with heightened sensitivity and visionary capacity.",
      extended: `The 11 Birthday brings a heightened intuitive quality to your personality. This master number birthday gifts you with unusual sensitivity—the ability to receive insight, sense subtle energies, and inspire others through your vision.

This gift manifests as strong hunches, creative or spiritual insights, and the ability to illuminate truth for others. You may experience vivid dreams, synchronicities, or a sense of connection to something larger than yourself.

The invitation of the 11 Birthday is to trust your intuitive gifts while developing practical grounding. Your visionary capacity can support many different life purposes when channeled through patient, consistent action.`,
    },
    22: {
      digit: 22,
      context: "birthday",
      title: "Birthday 22: Practical Visionary",
      description:
        "Born on the 22nd, you carry a master gift for manifesting large-scale visions. This supports any Life Path with the ability to build something significant.",
      extended: `The 22 Birthday brings a master builder quality to your personality. This powerful number gifts you with the rare combination of vision and practical ability—the capacity to see what could be and actually create it in the material world.

This gift manifests as the ability to think big while handling details, to organize complex projects, and to create lasting structures. You may find that you're drawn to ambitious undertakings and have unusual patience for the work required to achieve them.

The invitation of the 22 Birthday is to use your manifesting potential in service of your larger purpose. Your ability to build on a grand scale can support whatever your Life Path indicates as your core journey.`,
    },
    33: {
      digit: 33,
      context: "birthday",
      title: "Birthday 33: Master Healer",
      description:
        "Born with 33 energy, you carry the master gift of healing presence. This rare vibration supports any Life Path with profound compassion and uplifting influence.",
      extended: `The 33 Birthday is exceptionally rare and brings a master healing quality to your personality. This highest master number gifts you with the capacity for profound compassion—the ability to uplift others simply through your presence and embodied wisdom.

This gift manifests as a calming influence on others, natural teaching or healing ability, and deep sensitivity to suffering. You may find that people are drawn to you in times of need and that you have an unusual capacity for selfless service.

The invitation of the 33 Birthday is to care for yourself as devotedly as you care for others. Your healing presence can support any life purpose when you maintain the energy and boundaries needed for sustainable service.`,
    },
  },
  expression: {
    1: {
      digit: 1,
      context: "expression",
      title: "Expression 1: The Independent Creator",
      description:
        "Your natural talents flow toward originality and leadership. You work best when given autonomy to develop and implement your own ideas.",
      extended: `With an Expression 1, your name encodes the energy of the pioneer. Your natural way of engaging with the world involves independence, innovation, and the courage to do things your own way. Your talents shine brightest when you're given creative freedom.

This expression manifests as entrepreneurial ability, original thinking, and the capacity to initiate new projects. You may find that you work best alone or in leadership positions where your vision can guide the direction.

The invitation of Expression 1 is to develop your unique talents while learning when collaboration serves your goals. Your natural independence is a gift, but so is the ability to inspire and work with others when needed.`,
    },
    2: {
      digit: 2,
      context: "expression",
      title: "Expression 2: The Collaborative Partner",
      description:
        "Your natural talents flow toward cooperation and relationship-building. You work best in partnerships where your diplomatic gifts can shine.",
      extended: `With an Expression 2, your name encodes the energy of the diplomat. Your natural way of engaging with the world involves sensitivity, cooperation, and the ability to create harmony between different parties. Your talents shine brightest in collaborative settings.

This expression manifests as negotiation skills, emotional intelligence, and the ability to support others' success. You may find that you work best in partnerships, counseling roles, or positions that require bringing people together.

The invitation of Expression 2 is to value your cooperative nature while developing the confidence to express your own needs. Your gift for relationship is genuine and needed; the world requires bridge-builders as much as pioneers.`,
    },
    3: {
      digit: 3,
      context: "expression",
      title: "Expression 3: The Creative Communicator",
      description:
        "Your natural talents flow toward creative expression and inspiring communication. You work best when you can share ideas and bring joy to others.",
      extended: `With an Expression 3, your name encodes the energy of the communicator. Your natural way of engaging with the world involves creative expression, verbal facility, and the ability to inspire and entertain. Your talents shine brightest when you have an audience or creative outlet.

This expression manifests as writing, speaking, performing, or artistic ability. You may find that you work best in roles that allow self-expression and that involve communication in some form—teaching, media, arts, or any field where your natural charisma can flow.

The invitation of Expression 3 is to take your creative gifts seriously while maintaining the playfulness that makes them authentic. Your joy is not frivolous—it's a genuine contribution to the world.`,
    },
    4: {
      digit: 4,
      context: "expression",
      title: "Expression 4: The Systematic Builder",
      description:
        "Your natural talents flow toward organization and practical implementation. You work best when creating systems and structures that serve real needs.",
      extended: `With an Expression 4, your name encodes the energy of the builder. Your natural way of engaging with the world involves practical application, systematic thinking, and the satisfaction of creating something tangible and lasting.

This expression manifests as organizational ability, technical skill, and the capacity to turn abstract ideas into working systems. You may find that you work best in roles that require attention to detail, process development, or physical creation.

The invitation of Expression 4 is to value your practical gifts while maintaining flexibility within structure. Your ability to build is essential—the world needs people who can make visions real.`,
    },
    5: {
      digit: 5,
      context: "expression",
      title: "Expression 5: The Dynamic Communicator",
      description:
        "Your natural talents flow toward versatility and connecting diverse ideas. You work best when engaging with variety and facilitating change.",
      extended: `With an Expression 5, your name encodes the energy of the adventurer. Your natural way of engaging with the world involves adaptability, communication, and the ability to synthesize diverse experiences into wisdom. Your talents shine in dynamic, changing environments.

This expression manifests as versatility, sales or promotional ability, and comfort with change. You may find that you work best in roles involving travel, variety, or helping others adapt to new situations.

The invitation of Expression 5 is to channel your versatility into focused contribution while honoring your need for variety. Your ability to adapt and connect dots across different domains is genuinely valuable.`,
    },
    6: {
      digit: 6,
      context: "expression",
      title: "Expression 6: The Responsible Caregiver",
      description:
        "Your natural talents flow toward nurturing and creating harmony. You work best when caring for others and beautifying environments.",
      extended: `With an Expression 6, your name encodes the energy of the nurturer. Your natural way of engaging with the world involves responsibility, care, and the ability to create environments where people and beauty thrive.

This expression manifests as domestic arts, counseling ability, and talent for creating harmony. You may find that you work best in roles involving care—healthcare, education, hospitality, design, or any field where your nurturing nature can serve.

The invitation of Expression 6 is to channel your caring gifts while maintaining boundaries and self-care. Your ability to nurture is essential—the world needs people who create spaces of beauty and belonging.`,
    },
    7: {
      digit: 7,
      context: "expression",
      title: "Expression 7: The Analytical Specialist",
      description:
        "Your natural talents flow toward research, analysis, and deep understanding. You work best when exploring subjects in depth and sharing your findings.",
      extended: `With an Expression 7, your name encodes the energy of the seeker. Your natural way of engaging with the world involves depth rather than breadth—the ability to specialize, research, and develop true expertise in your areas of focus.

This expression manifests as analytical ability, research skills, and comfort with solitary work. You may find that you work best in roles requiring expertise—science, technology, analysis, writing, or any field that rewards deep thinking.

The invitation of Expression 7 is to share your knowledge while continuing to learn. Your ability to go deep is needed—the world benefits from those who truly understand rather than just skim surfaces.`,
    },
    8: {
      digit: 8,
      context: "expression",
      title: "Expression 8: The Executive Organizer",
      description:
        "Your natural talents flow toward leadership and material manifestation. You work best when organizing resources and creating tangible success.",
      extended: `With an Expression 8, your name encodes the energy of the achiever. Your natural way of engaging with the world involves organization, leadership, and the ability to create material success. You have innate understanding of how power and resources flow.

This expression manifests as business acumen, executive ability, and talent for making things happen. You may find that you work best in leadership positions or entrepreneurial roles where you can direct resources toward goals.

The invitation of Expression 8 is to use your achievement abilities in service of something meaningful. Your capacity to manifest material results is needed—the question is only what you choose to build.`,
    },
    9: {
      digit: 9,
      context: "expression",
      title: "Expression 9: The Universal Artist",
      description:
        "Your natural talents flow toward artistic expression and humanitarian service. You work best when creating for or serving the greater good.",
      extended: `With an Expression 9, your name encodes the energy of the humanitarian. Your natural way of engaging with the world involves broad vision, artistic sensitivity, and the ability to serve causes larger than yourself.

This expression manifests as artistic talent, healing ability, and natural wisdom. You may find that you work best in roles serving the greater good—arts, healing, teaching, nonprofit work, or any field that contributes to human welfare.

The invitation of Expression 9 is to give generously while maintaining your own renewal. Your ability to see the whole picture and serve the many is needed—the world benefits from those who can transcend narrow self-interest.`,
    },
    11: {
      digit: 11,
      context: "expression",
      title: "Expression 11: The Inspired Channel",
      description:
        "Your natural talents flow toward intuitive insight and inspiring communication. You work best when channeling vision into forms that illuminate.",
      extended: `With an Expression 11, your name encodes master energy of illumination. Your natural way of engaging with the world involves receiving and transmitting inspiration—acting as a channel for insights that can guide and uplift others.

This expression manifests as visionary thinking, inspirational communication, and heightened intuition. You may find that you work best in roles involving teaching, counseling, media, or any field where your intuitive gifts can reach many.

The invitation of Expression 11 is to ground your visions in practical form while trusting their value. Your illuminating capacity is needed—the world benefits from those who can make the invisible visible.`,
    },
    22: {
      digit: 22,
      context: "expression",
      title: "Expression 22: The Architect of Dreams",
      description:
        "Your natural talents flow toward manifesting grand visions. You work best when building systems and structures that serve humanity at scale.",
      extended: `With an Expression 22, your name encodes the master energy of the great builder. Your natural way of engaging with the world involves the rare combination of grand vision and practical capability—the ability to dream big and actually build it.

This expression manifests as organizational genius, systems thinking, and the capacity to create lasting institutions or works. You may find that you work best on ambitious projects with broad impact—businesses, organizations, or creations that serve many.

The invitation of Expression 22 is to trust your capacity while exercising patience with the time required. Your building gifts are needed—the world benefits from those who can create structures that serve generations.`,
    },
    33: {
      digit: 33,
      context: "expression",
      title: "Expression 33: The Master Healer",
      description:
        "Your natural talents flow toward healing and teaching through embodied wisdom. You work best when serving others through your presence and example.",
      extended: `With an Expression 33, your name encodes the master energy of the cosmic teacher. Your natural way of engaging with the world involves healing and uplifting through who you are, not just what you do—your very presence carries teaching.

This expression manifests as healing ability, profound compassion, and the capacity to elevate others through example. You may find that you work best in roles of service—healing arts, spiritual teaching, counseling, or any form of devoted care.

The invitation of Expression 33 is to sustain your service through radical self-care. Your healing presence is needed—but it flows most clearly through a vessel that is itself nurtured and whole.`,
    },
  },
  soulUrge: {
    1: {
      digit: 1,
      context: "soulUrge",
      title: "Soul Urge 1: Heart Craves Independence",
      description:
        "At your core, you yearn for autonomy and self-determination. You feel most fulfilled when directing your own path and expressing your unique identity.",
      extended: `With Soul Urge 1, your deepest motivation is independence. Beneath any outer personality, your heart craves the freedom to be yourself, make your own choices, and pioneer your own way forward. This is the desire that moves you at the most fundamental level.

This soul urge manifests as restlessness when controlled, joy in new beginnings, and a deep need to be recognized as an individual. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 1 is to honor your need for autonomy while recognizing that true independence includes the freedom to connect when you choose. Your soul seeks not isolation, but authentic self-expression.`,
    },
    2: {
      digit: 2,
      context: "soulUrge",
      title: "Soul Urge 2: Heart Craves Connection",
      description:
        "At your core, you yearn for partnership and harmony. You feel most fulfilled when in meaningful relationships and creating peace.",
      extended: `With Soul Urge 2, your deepest motivation is connection. Beneath any outer personality, your heart craves harmonious relationships, peace, and the sense of being truly understood and valued by another. This is the desire that moves you at the most fundamental level.

This soul urge manifests as discomfort with conflict, deep satisfaction in partnership, and the need to feel emotionally connected. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 2 is to honor your need for connection while developing inner wholeness. Your soul seeks not codependence, but the beautiful dance of two complete beings choosing to walk together.`,
    },
    3: {
      digit: 3,
      context: "soulUrge",
      title: "Soul Urge 3: Heart Craves Expression",
      description:
        "At your core, you yearn to create and express yourself. You feel most fulfilled when sharing your unique vision and bringing joy to others.",
      extended: `With Soul Urge 3, your deepest motivation is creative expression. Beneath any outer personality, your heart craves the joy of sharing your unique perspective—through words, art, performance, or simply the way you engage with life.

This soul urge manifests as restlessness when unable to create, deep satisfaction in artistic expression, and the need to feel that your unique voice matters. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 3 is to honor your need to express while developing the discipline to give your creativity form. Your soul seeks not just expression, but the completion of bringing inner vision into outer reality.`,
    },
    4: {
      digit: 4,
      context: "soulUrge",
      title: "Soul Urge 4: Heart Craves Security",
      description:
        "At your core, you yearn for stability and solid foundations. You feel most fulfilled when building something lasting and creating order.",
      extended: `With Soul Urge 4, your deepest motivation is security and structure. Beneath any outer personality, your heart craves the peace that comes from solid foundations—knowing that you've built something real and lasting.

This soul urge manifests as anxiety in chaos, deep satisfaction in completing projects, and the need to feel that your work has tangible results. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 4 is to honor your need for security while remaining flexible within structure. Your soul seeks not rigidity, but the freedom that comes from standing on solid ground.`,
    },
    5: {
      digit: 5,
      context: "soulUrge",
      title: "Soul Urge 5: Heart Craves Freedom",
      description:
        "At your core, you yearn for variety, adventure, and the freedom to explore. You feel most fulfilled when life offers new experiences.",
      extended: `With Soul Urge 5, your deepest motivation is freedom and experience. Beneath any outer personality, your heart craves adventure—the stimulation of new places, people, and possibilities. Routine feels like a slow death to your soul.

This soul urge manifests as restlessness with repetition, deep satisfaction in travel and variety, and the need to feel that life remains fresh and full of potential. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 5 is to honor your need for freedom while finding the deeper adventure within any circumstance. Your soul seeks not just outer variety, but the freedom that comes from inner flexibility.`,
    },
    6: {
      digit: 6,
      context: "soulUrge",
      title: "Soul Urge 6: Heart Craves Harmony",
      description:
        "At your core, you yearn to nurture and create beauty. You feel most fulfilled when caring for others and cultivating peaceful environments.",
      extended: `With Soul Urge 6, your deepest motivation is love and harmony. Beneath any outer personality, your heart craves the satisfaction of caring for others and creating environments of beauty and peace. You want to make things right.

This soul urge manifests as discomfort with ugliness or discord, deep satisfaction in nurturing, and the need to feel that your love makes a difference. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 6 is to honor your need to nurture while including yourself in that care. Your soul seeks not martyrdom, but the harmony that includes your own wellbeing alongside others'.`,
    },
    7: {
      digit: 7,
      context: "soulUrge",
      title: "Soul Urge 7: Heart Craves Understanding",
      description:
        "At your core, you yearn for truth and deep understanding. You feel most fulfilled when exploring life's mysteries and finding wisdom.",
      extended: `With Soul Urge 7, your deepest motivation is understanding and truth. Beneath any outer personality, your heart craves knowledge that goes beyond the surface—you want to understand why things are as they are, to find the patterns beneath appearances.

This soul urge manifests as discomfort with superficiality, deep satisfaction in moments of insight, and the need for significant solitude. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 7 is to honor your need for depth while remaining open to wisdom from unexpected sources. Your soul seeks not just intellectual understanding, but the lived truth that transforms.`,
    },
    8: {
      digit: 8,
      context: "soulUrge",
      title: "Soul Urge 8: Heart Craves Achievement",
      description:
        "At your core, you yearn for accomplishment and recognition. You feel most fulfilled when achieving meaningful goals and being acknowledged for your success.",
      extended: `With Soul Urge 8, your deepest motivation is achievement and influence. Beneath any outer personality, your heart craves the satisfaction of material accomplishment—not for greed, but for the sense of having made your mark on the world.

This soul urge manifests as drive for success, deep satisfaction in reaching goals, and the need to feel that your efforts have tangible results and recognition. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 8 is to honor your need for achievement while ensuring your goals serve something meaningful. Your soul seeks not empty success, but accomplishment that reflects your deepest values.`,
    },
    9: {
      digit: 9,
      context: "soulUrge",
      title: "Soul Urge 9: Heart Craves Universal Love",
      description:
        "At your core, you yearn to make a difference in the world. You feel most fulfilled when contributing to the greater good.",
      extended: `With Soul Urge 9, your deepest motivation is universal love and service. Beneath any outer personality, your heart craves the satisfaction of contributing to something larger than yourself—of knowing that your existence has helped heal the world in some way.

This soul urge manifests as concern for global issues, deep satisfaction in service, and the need to feel connected to humanity as a whole. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 9 is to honor your humanitarian heart while tending to your immediate life as well. Your soul seeks not escape from personal concerns, but the integration of universal love with daily living.`,
    },
    11: {
      digit: 11,
      context: "soulUrge",
      title: "Soul Urge 11: Heart Craves Inspiration",
      description:
        "At your core, you yearn for spiritual connection and the ability to inspire. You feel most fulfilled when receiving and sharing illuminating insights.",
      extended: `With Soul Urge 11, your deepest motivation is spiritual inspiration. Beneath any outer personality, your heart craves connection to something higher—moments of illumination and the ability to channel that light for others.

This soul urge manifests as sensitivity to spiritual dimensions, deep satisfaction in inspirational moments, and the need to feel that your intuitive gifts serve a purpose. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 11 is to honor your need for spiritual connection while grounding your visions in practical expression. Your soul seeks not escape from the world, but illumination that transforms it.`,
    },
    22: {
      digit: 22,
      context: "soulUrge",
      title: "Soul Urge 22: Heart Craves Manifestation",
      description:
        "At your core, you yearn to build something significant. You feel most fulfilled when manifesting grand visions into tangible reality.",
      extended: `With Soul Urge 22, your deepest motivation is large-scale creation. Beneath any outer personality, your heart craves the satisfaction of bringing ambitious visions to life—of creating something that will serve many and endure.

This soul urge manifests as frustration with small projects, deep satisfaction in meaningful building, and the need to feel that your work has lasting impact. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 22 is to honor your need to build big while accepting the patient work required. Your soul seeks not instant manifestation, but the profound satisfaction of creating something worthy of your vision.`,
    },
    33: {
      digit: 33,
      context: "soulUrge",
      title: "Soul Urge 33: Heart Craves Healing",
      description:
        "At your core, you yearn to heal and uplift humanity. You feel most fulfilled when alleviating suffering through love and compassion.",
      extended: `With Soul Urge 33, your deepest motivation is cosmic healing. Beneath any outer personality, your heart craves the satisfaction of easing suffering—not just individual pain, but the deeper healing of humanity's wounds through love.

This soul urge manifests as profound sensitivity to suffering, deep satisfaction in service, and the need to feel that your compassion makes a difference. You may not always show this need outwardly, but it shapes your choices and colors your satisfaction with life.

The invitation of Soul Urge 33 is to honor your healing heart while maintaining the boundaries and self-care that sustain it. Your soul seeks not self-sacrifice, but the sustainable flow of love through a vessel that is itself loved.`,
    },
  },
  personality: {
    1: {
      digit: 1,
      context: "personality",
      title: "Personality 1: The Confident Individual",
      description:
        "Others perceive you as independent, confident, and original. Your first impression conveys strength and self-assurance.",
      extended: `With Personality 1, you project an image of independence and self-confidence. Before others truly know you, they perceive someone who is self-reliant, perhaps even a bit aloof—someone who knows their own mind and isn't easily swayed by others' opinions.

This personality manifests as an appearance of leadership, originality, and strength. People may expect you to take charge or assume you're more confident than you feel. Your outer presentation attracts those who value independence.

The invitation of Personality 1 is to let others past your confident exterior to see more of who you truly are inside. Your strong outer presentation serves you well, but deeper connections require letting down the guard.`,
    },
    2: {
      digit: 2,
      context: "personality",
      title: "Personality 2: The Approachable Diplomat",
      description:
        "Others perceive you as gentle, cooperative, and understanding. Your first impression conveys warmth and receptivity.",
      extended: `With Personality 2, you project an image of gentleness and cooperation. Before others truly know you, they perceive someone who is approachable, understanding, and easy to talk to—someone who will listen and not judge.

This personality manifests as an appearance of warmth, patience, and emotional availability. People may confide in you quickly or assume you're more agreeable than you actually feel. Your outer presentation attracts those seeking connection and understanding.

The invitation of Personality 2 is to express your own needs and opinions even when your gentle exterior might suggest you'll go along with anything. Being approachable doesn't mean being a doormat.`,
    },
    3: {
      digit: 3,
      context: "personality",
      title: "Personality 3: The Charming Entertainer",
      description:
        "Others perceive you as friendly, creative, and optimistic. Your first impression conveys warmth and a touch of sparkle.",
      extended: `With Personality 3, you project an image of friendliness and creative charm. Before others truly know you, they perceive someone who is social, optimistic, and easy to be around—someone who brings energy and lightness to any interaction.

This personality manifests as an appearance of wit, social ease, and artistic flair. People may expect you to entertain or uplift them, even when you don't feel particularly light-hearted. Your outer presentation attracts those drawn to warmth and creativity.

The invitation of Personality 3 is to let others see your depth as well as your sparkle. Your charming exterior opens doors, but lasting connection requires showing the more serious side of who you are.`,
    },
    4: {
      digit: 4,
      context: "personality",
      title: "Personality 4: The Reliable Pillar",
      description:
        "Others perceive you as dependable, practical, and grounded. Your first impression conveys stability and trustworthiness.",
      extended: `With Personality 4, you project an image of reliability and practicality. Before others truly know you, they perceive someone who is steady, organized, and responsible—someone they can count on to follow through.

This personality manifests as an appearance of groundedness, common sense, and hard work. People may depend on you immediately or assume you're more conventional than you actually are. Your outer presentation attracts those seeking stability.

The invitation of Personality 4 is to show your creative and spontaneous side even when your reliable exterior suggests you're all business. Being dependable doesn't mean you lack imagination or playfulness.`,
    },
    5: {
      digit: 5,
      context: "personality",
      title: "Personality 5: The Magnetic Free Spirit",
      description:
        "Others perceive you as dynamic, versatile, and exciting. Your first impression conveys energy and a sense of adventure.",
      extended: `With Personality 5, you project an image of energy and versatility. Before others truly know you, they perceive someone who is dynamic, interesting, and perhaps a bit unpredictable—someone who brings excitement to any situation.

This personality manifests as an appearance of charm, adaptability, and social magnetism. People may expect constant entertainment or assume you're more restless than you actually feel. Your outer presentation attracts those seeking adventure and novelty.

The invitation of Personality 5 is to reveal your depth and constancy beneath the dynamic exterior. Being exciting doesn't mean you lack the capacity for depth, commitment, or stillness.`,
    },
    6: {
      digit: 6,
      context: "personality",
      title: "Personality 6: The Nurturing Presence",
      description:
        "Others perceive you as caring, responsible, and harmonious. Your first impression conveys warmth and a desire to help.",
      extended: `With Personality 6, you project an image of nurturing care. Before others truly know you, they perceive someone who is warm, responsible, and genuinely interested in their wellbeing—someone who creates comfort and harmony.

This personality manifests as an appearance of domesticity, aesthetic sense, and supportiveness. People may quickly seek your help or assume you're more available than you actually are. Your outer presentation attracts those seeking care and stability.

The invitation of Personality 6 is to show your independent side even when your nurturing exterior suggests you exist to serve. Being caring doesn't mean you lack your own needs, ambitions, and boundaries.`,
    },
    7: {
      digit: 7,
      context: "personality",
      title: "Personality 7: The Mysterious Thinker",
      description:
        "Others perceive you as reserved, intelligent, and somewhat mysterious. Your first impression conveys depth and quiet contemplation.",
      extended: `With Personality 7, you project an image of intelligence and reserve. Before others truly know you, they perceive someone who is thoughtful, perhaps hard to read—someone with depth beneath a quiet exterior.

This personality manifests as an appearance of intelligence, discernment, and need for privacy. People may find you intriguing but slightly intimidating or assume you're more distant than you actually feel. Your outer presentation attracts those who value depth.

The invitation of Personality 7 is to let others past your reserved exterior more quickly. Being private doesn't mean you have to remain mysterious to those who genuinely want to know you.`,
    },
    8: {
      digit: 8,
      context: "personality",
      title: "Personality 8: The Powerful Executive",
      description:
        "Others perceive you as capable, authoritative, and successful. Your first impression conveys competence and material confidence.",
      extended: `With Personality 8, you project an image of power and capability. Before others truly know you, they perceive someone who is competent, perhaps wealthy or ambitious—someone who knows how to get things done in the material world.

This personality manifests as an appearance of authority, business sense, and material success. People may expect you to take charge or assume you're more interested in money and status than you actually are. Your outer presentation attracts those seeking leadership.

The invitation of Personality 8 is to show your softer, more vulnerable side beneath the powerful exterior. Being capable doesn't mean you don't have doubts, fears, or need for emotional connection.`,
    },
    9: {
      digit: 9,
      context: "personality",
      title: "Personality 9: The Sophisticated Idealist",
      description:
        "Others perceive you as wise, worldly, and compassionate. Your first impression conveys breadth of experience and humanitarian concern.",
      extended: `With Personality 9, you project an image of wisdom and broad perspective. Before others truly know you, they perceive someone who is sophisticated, perhaps artistic or spiritual—someone with experience and compassion beyond the ordinary.

This personality manifests as an appearance of refinement, idealism, and universal concern. People may seek your wisdom or assume you're more detached from personal concerns than you actually are. Your outer presentation attracts those drawn to depth and meaning.

The invitation of Personality 9 is to show your need for personal connection beneath the wise exterior. Being compassionate toward humanity doesn't mean you don't have immediate, personal needs for love and belonging.`,
    },
    11: {
      digit: 11,
      context: "personality",
      title: "Personality 11: The Inspiring Visionary",
      description:
        "Others perceive you as intuitive, idealistic, and somewhat otherworldly. Your first impression conveys sensitivity and spiritual depth.",
      extended: `With Personality 11, you project an image of heightened sensitivity and inspiration. Before others truly know you, they perceive someone who is intuitive, perhaps psychic or spiritually attuned—someone who seems to operate on a different wavelength.

This personality manifests as an appearance of idealism, artistic sensitivity, and visionary capacity. People may expect profound insights or assume you're more mystical than practical. Your outer presentation attracts those seeking inspiration and guidance.

The invitation of Personality 11 is to show your practical, grounded side beneath the visionary exterior. Being spiritually sensitive doesn't mean you lack the ability to function in the everyday world.`,
    },
    22: {
      digit: 22,
      context: "personality",
      title: "Personality 22: The Powerful Visionary",
      description:
        "Others perceive you as ambitious, capable, and destined for significant achievement. Your first impression conveys both vision and practical power.",
      extended: `With Personality 22, you project an image of powerful capability combined with grand vision. Before others truly know you, they perceive someone who is ambitious and able to achieve on a large scale—someone destined to build something significant.

This personality manifests as an appearance of strength, determination, and practical idealism. People may expect great things or feel intimidated by your apparent potential. Your outer presentation attracts those drawn to power and purpose.

The invitation of Personality 22 is to show your human vulnerabilities beneath the powerful exterior. Having large-scale potential doesn't mean you don't have doubts, struggles, or need for simple human connection.`,
    },
    33: {
      digit: 33,
      context: "personality",
      title: "Personality 33: The Radiant Healer",
      description:
        "Others perceive you as nurturing, wise, and spiritually elevated. Your first impression conveys profound compassion and healing presence.",
      extended: `With Personality 33, you project an image of elevated nurturing and spiritual wisdom. Before others truly know you, they perceive someone who radiates compassion—someone whose very presence seems to offer healing and comfort.

This personality manifests as an appearance of saintliness, self-sacrifice, and universal love. People may seek your counsel or place you on a pedestal you may not feel you deserve. Your outer presentation attracts those in need of healing.

The invitation of Personality 33 is to show your human needs and limitations beneath the radiant exterior. Being a healing presence doesn't mean you don't need care, boundaries, and rest for yourself.`,
    },
  },
  maturity: {
    1: {
      digit: 1,
      context: "maturity",
      title: "Maturity 1: Growing into Independence",
      description:
        "As you mature, you're growing into greater self-reliance and original expression. Your later years favor leadership and pioneering endeavors.",
      extended: `With Maturity 1, your later life is an invitation to greater independence. Whatever your younger years emphasized, you're growing toward a life of more self-direction, original thinking, and leadership. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased confidence in your own ideas, less concern with others' approval, and more willingness to forge your own path. You may start new ventures or finally express your unique vision.

The invitation of Maturity 1 is to embrace this growing independence while maintaining meaningful connections. Your later years are for becoming more fully yourself, not for isolation or stubbornness.`,
    },
    2: {
      digit: 2,
      context: "maturity",
      title: "Maturity 2: Growing into Partnership",
      description:
        "As you mature, you're growing into deeper partnership and cooperation. Your later years favor collaboration and the development of your intuitive gifts.",
      extended: `With Maturity 2, your later life is an invitation to deeper relationship. Whatever your younger years emphasized, you're growing toward a life of more meaningful partnership, cooperation, and emotional intelligence. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased sensitivity, more satisfying relationships, and greater patience with others. You may find yourself in more supportive or counseling roles.

The invitation of Maturity 2 is to embrace this growing capacity for partnership while maintaining your individual identity. Your later years are for deepening connection, not losing yourself in others.`,
    },
    3: {
      digit: 3,
      context: "maturity",
      title: "Maturity 3: Growing into Expression",
      description:
        "As you mature, you're growing into fuller creative expression. Your later years favor artistic endeavors, joyful connection, and sharing your accumulated wisdom.",
      extended: `With Maturity 3, your later life is an invitation to creative expression. Whatever your younger years emphasized, you're growing toward a life of more joyful creativity, social connection, and the sharing of your unique perspective. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased artistic expression, more playfulness, and the ability to inspire others with your joy. You may finally pursue creative dreams deferred.

The invitation of Maturity 3 is to embrace this growing expressiveness while giving your creativity meaningful form. Your later years are for sharing your light, not scattering it in all directions.`,
    },
    4: {
      digit: 4,
      context: "maturity",
      title: "Maturity 4: Growing into Mastery",
      description:
        "As you mature, you're growing into practical mastery and the satisfaction of completed work. Your later years favor building lasting legacy.",
      extended: `With Maturity 4, your later life is an invitation to practical mastery. Whatever your younger years emphasized, you're growing toward a life of more tangible accomplishment, satisfied expertise, and the pleasure of building something lasting. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased focus, patient dedication to worthy projects, and the satisfaction of work well done. You may finally build the foundation you've long envisioned.

The invitation of Maturity 4 is to embrace this growing mastery while remaining flexible. Your later years are for building something real, not becoming trapped by rigid routines.`,
    },
    5: {
      digit: 5,
      context: "maturity",
      title: "Maturity 5: Growing into Freedom",
      description:
        "As you mature, you're growing into greater freedom and adventure. Your later years favor exploration, new experiences, and sharing hard-won wisdom about change.",
      extended: `With Maturity 5, your later life is an invitation to freedom. Whatever your younger years emphasized, you're growing toward a life of more adventure, variety, and the wisdom that comes from embracing change. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased travel or variety, more comfort with change, and the ability to help others adapt. You may finally break free of limiting circumstances.

The invitation of Maturity 5 is to embrace this growing freedom while finding depth within variety. Your later years are for experiencing life fully, not running from commitment or depth.`,
    },
    6: {
      digit: 6,
      context: "maturity",
      title: "Maturity 6: Growing into Nurturing Wisdom",
      description:
        "As you mature, you're growing into deeper capacity for love and responsibility. Your later years favor family connection, mentoring, and creating beauty.",
      extended: `With Maturity 6, your later life is an invitation to nurturing wisdom. Whatever your younger years emphasized, you're growing toward a life of more meaningful care—for family, community, or those who need your guidance. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased domestic satisfaction, more fulfilling relationships with family, and the joy of creating beautiful, harmonious environments.

The invitation of Maturity 6 is to embrace this growing capacity for love while maintaining healthy boundaries. Your later years are for nurturing wisely, not for martyrdom or over-responsibility.`,
    },
    7: {
      digit: 7,
      context: "maturity",
      title: "Maturity 7: Growing into Wisdom",
      description:
        "As you mature, you're growing into deeper understanding and spiritual insight. Your later years favor reflection, teaching, and sharing accumulated wisdom.",
      extended: `With Maturity 7, your later life is an invitation to wisdom. Whatever your younger years emphasized, you're growing toward a life of deeper understanding—more time for reflection, study, and the spiritual insights that come from a lifetime of experience. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased interest in spiritual matters, more comfort with solitude, and the respect that comes from accumulated expertise.

The invitation of Maturity 7 is to embrace this growing wisdom while sharing it with others who seek. Your later years are for becoming a sage, not for withdrawing into isolation.`,
    },
    8: {
      digit: 8,
      context: "maturity",
      title: "Maturity 8: Growing into Mastery",
      description:
        "As you mature, you're growing into material mastery and the responsible use of power. Your later years favor achievement, philanthropy, and leaving a legacy.",
      extended: `With Maturity 8, your later life is an invitation to material mastery. Whatever your younger years emphasized, you're growing toward a life of greater achievement, authority, and the satisfaction of manifesting your vision in the world. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased success, more comfort with power, and the opportunity to use resources for meaningful impact. Late-life achievement is favored.

The invitation of Maturity 8 is to embrace this growing capacity for achievement while using power wisely. Your later years are for manifesting meaningful legacy, not for empty accumulation.`,
    },
    9: {
      digit: 9,
      context: "maturity",
      title: "Maturity 9: Growing into Universal Love",
      description:
        "As you mature, you're growing into broader compassion and humanitarian contribution. Your later years favor service, artistic expression, and sharing wisdom.",
      extended: `With Maturity 9, your later life is an invitation to universal perspective. Whatever your younger years emphasized, you're growing toward a life of broader compassion, more meaningful service, and the wisdom that comes from seeing the larger picture. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased humanitarian concern, artistic or healing pursuits, and the satisfaction of contributing to something larger than yourself.

The invitation of Maturity 9 is to embrace this growing compassion while tending to your immediate life as well. Your later years are for serving humanity, not for neglecting personal relationships and health.`,
    },
    11: {
      digit: 11,
      context: "maturity",
      title: "Maturity 11: Growing into Illumination",
      description:
        "As you mature, you're growing into heightened intuition and the ability to inspire. Your later years favor spiritual teaching and sharing visionary insights.",
      extended: `With Maturity 11, your later life is an invitation to illumination. Whatever your younger years emphasized, you're growing toward a life of heightened intuition, spiritual teaching, and the ability to channel inspiration for others. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increased psychic sensitivity, more meaningful spiritual practice, and the ability to inspire others through your insights.

The invitation of Maturity 11 is to embrace this growing visionary capacity while staying grounded. Your later years are for becoming an illuminating presence, not for losing touch with practical reality.`,
    },
    22: {
      digit: 22,
      context: "maturity",
      title: "Maturity 22: Growing into Legacy",
      description:
        "As you mature, you're growing into the potential for significant building. Your later years favor creating structures that serve humanity and leave lasting impact.",
      extended: `With Maturity 22, your later life is an invitation to master building. Whatever your younger years emphasized, you're growing toward a life of more significant creation—the ability to manifest grand visions that serve many and endure beyond your lifetime. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increasing ambition for meaningful impact, the patience to build properly, and the satisfaction of creating lasting contribution.

The invitation of Maturity 22 is to embrace this growing capacity for significant achievement while remaining patient. Your later years are for building your masterwork, not for rushing the foundation.`,
    },
    33: {
      digit: 33,
      context: "maturity",
      title: "Maturity 33: Growing into Healing Mastery",
      description:
        "As you mature, you're growing into your highest healing potential. Your later years favor spiritual teaching, compassionate service, and embodied wisdom.",
      extended: `With Maturity 33, your later life is an invitation to master healing. Whatever your younger years emphasized, you're growing toward a life of profound compassion and the ability to heal and teach through your very presence. This energy typically becomes more pronounced after age 40-50.

This maturity number suggests that your wisdom years will be marked by increasing capacity for selfless service, deeper spiritual understanding, and the satisfaction of uplifting others through who you've become.

The invitation of Maturity 33 is to embrace this growing healing capacity while sustaining yourself. Your later years are for becoming a blessing to others, not for burning yourself out in service.`,
    },
  },
};

/**
 * Get the position-specific meaning for a digit
 */
export function getPositionMeaning(
  position: CoreNumberType,
  digit: number
): PositionMeaning | null {
  const positionMeanings = POSITION_MEANINGS[position];
  if (!positionMeanings) return null;

  return positionMeanings[digit as NumerologyDigit] ?? null;
}

/**
 * Get all meanings for a specific digit across all positions
 */
export function getAllMeaningsForDigit(digit: number): PositionMeaning[] {
  const meanings: PositionMeaning[] = [];

  for (const position of Object.keys(POSITION_MEANINGS) as CoreNumberType[]) {
    const meaning = POSITION_MEANINGS[position][digit as NumerologyDigit];
    if (meaning) {
      meanings.push(meaning);
    }
  }

  return meanings;
}

/**
 * Get all meanings for a specific position
 */
export function getAllMeaningsForPosition(position: CoreNumberType): PositionMeaning[] {
  return Object.values(POSITION_MEANINGS[position] ?? {});
}
