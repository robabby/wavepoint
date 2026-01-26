/**
 * Major Arcana tarot card data.
 *
 * Content focuses on psychological/Jungian interpretation,
 * avoiding Golden Dawn, Kabbalistic, or divinatory frameworks.
 * Written in WavePoint's "modern mystic" voice.
 */

import type { MajorArcanaCard, MajorArcanaSlug, TarotCardNumber } from "./types";
import { getRomanNumeral } from "./types";
import { TAROT_ARCHETYPE_MAP } from "./correspondences";

/** Helper to create a card with proper typing */
function numeral(n: TarotCardNumber): string {
  return getRomanNumeral(n);
}

/**
 * Complete data for all 22 Major Arcana cards
 */
export const MAJOR_ARCANA: Record<MajorArcanaSlug, MajorArcanaCard> = {
  "the-fool": {
    slug: "the-fool",
    number: 0,
    romanNumeral: numeral(0),
    name: "The Fool",
    imagePath: "/images/tarot/trumps/00-the-fool.png",
    keywords: ["beginnings", "innocence", "spontaneity", "leap of faith", "potential"],
    archetype: "The eternal beginner, standing at the threshold of infinite possibility",
    uprightMeaning:
      "The Fool represents the part of us unconditioned by experience—pure potential before it takes form. This is the psyche in its original state of openness, ready to step into the unknown without the weight of accumulated fears. When The Fool appears, you're being called to embrace beginner's mind: to approach something with fresh eyes, to trust the journey even when the destination is unclear, and to find courage in not-knowing.",
    reversedMeaning:
      "In shadow, The Fool becomes recklessness without awareness, naivety that refuses to learn from experience, or paralysis at the threshold—wanting to leap but unable to trust. The reversed Fool may indicate self-sabotage through impulsive decisions, or the opposite: playing it so safe that nothing new can enter your life.",
    symbolism:
      "The precipice represents the boundary between the known and unknown. The small dog symbolizes instinct—the animal wisdom that accompanies us on the journey. The white rose speaks to purity of intention. The Fool's upward gaze suggests trust in something beyond the visible, while the bundle on the staff carries only what's truly essential.",
    description:
      "Numbered zero, The Fool exists outside the sequential journey of the Major Arcana while also encompassing it entirely. Zero contains infinite potential—every number that could be. This is the archetypal image of beginning itself, the leap that precedes every meaningful journey.\n\nThe Fool teaches us that wisdom isn't the absence of unknowing but the courage to act despite it. Every hero's journey begins with a step into mystery. The Fool doesn't know what awaits, but steps forward anyway—not from ignorance, but from a deeper knowing that the path reveals itself only to those who walk it.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-fool"],
  },

  "the-magician": {
    slug: "the-magician",
    number: 1,
    romanNumeral: numeral(1),
    name: "The Magician",
    imagePath: "/images/tarot/trumps/01-the-magician.png",
    keywords: ["willpower", "manifestation", "skill", "concentration", "resourcefulness"],
    archetype: "The conscious will that transforms intention into reality",
    uprightMeaning:
      "The Magician represents the first act of consciousness: the recognition that we can shape reality through focused intention and skilled action. This is the archetype of the directed will—the understanding that thought, properly channeled, becomes creative force. When The Magician appears, you possess the tools and abilities needed to manifest your vision. The question is whether you will use them.",
    reversedMeaning:
      "In shadow, The Magician becomes the manipulator—using knowledge of how things work to deceive rather than create. The reversed Magician may indicate untapped potential being wasted, skills unused, or the misuse of personal power for ego gratification rather than genuine creation.",
    symbolism:
      "The gesture of 'as above, so below' shows the Magician as conduit between spiritual and material realms. The four elemental tools on the table represent the complete resources of manifestation: wands (fire/will), cups (water/emotion), swords (air/intellect), and pentacles (earth/material). The infinity symbol above the head indicates connection to unlimited potential.",
    description:
      "The Magician is the first numbered card—the primal One from which all multiplicity emerges. This is consciousness awakening to its own power: the moment we realize we are not merely passive recipients of experience but active participants in its creation.\n\nUnlike the Fool's unconscious potential, The Magician represents conscious capability. Here is the archetype of the adept who has gathered tools and developed skills. The Magician teaches that manifestation requires both vision and craft—not just dreaming, but channeling dreams into disciplined action.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-magician"],
  },

  "the-high-priestess": {
    slug: "the-high-priestess",
    number: 2,
    romanNumeral: numeral(2),
    name: "The High Priestess",
    imagePath: "/images/tarot/trumps/02-the-high-priestess.png",
    keywords: ["intuition", "mystery", "inner wisdom", "the unconscious", "patience"],
    archetype: "The guardian of hidden knowledge and the wisdom of the deep unconscious",
    uprightMeaning:
      "The High Priestess represents the wisdom that cannot be grasped by rational mind alone—the deep knowing that emerges from stillness, dreams, and the receptive unconscious. She is the archetype of intuition: the subtle voice that speaks in symbols, feelings, and sudden knowing. When she appears, trust what you sense beneath the surface. Not everything reveals itself to active seeking.",
    reversedMeaning:
      "In shadow, The High Priestess becomes secrets kept from oneself—the refusal to acknowledge what intuition clearly shows. The reversed Priestess may indicate disconnection from inner wisdom, over-reliance on external validation, or the fear of looking within because of what might be found.",
    symbolism:
      "The veil between the pillars represents the threshold between conscious and unconscious realms. The crescent moon at her feet shows rulership over the hidden, cyclical, and mysterious. The scroll marked TORA suggests the inner law—wisdom that must be discovered rather than taught. The pomegranates speak to the fertility of the unconscious mind.",
    description:
      "Where The Magician acts, The High Priestess waits. She represents the receptive principle—the understanding that some knowledge comes only to those who cease striving for it. This is the archetype of the inner oracle, the part of psyche that knows what the conscious mind has not yet grasped.\n\nThe High Priestess teaches the paradox of knowing through not-knowing. She guards the mysteries not to withhold them but because some truths cannot be told—only discovered through direct experience. Her wisdom emerges in silence, in dreams, in the space between thoughts.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-high-priestess"],
  },

  "the-empress": {
    slug: "the-empress",
    number: 3,
    romanNumeral: numeral(3),
    name: "The Empress",
    imagePath: "/images/tarot/trumps/03-the-empress.png",
    keywords: ["abundance", "nurturing", "creativity", "nature", "fertility"],
    archetype: "The great mother who creates and sustains all life",
    uprightMeaning:
      "The Empress embodies creative fertility in all its forms—the ability to bring forth, nurture, and sustain new life, whether children, projects, relationships, or artistic works. She represents the embrace of embodied experience: pleasure, sensuality, and the wisdom of the body. When The Empress appears, creation wants to flow through you. Open to abundance; nurture what is growing.",
    reversedMeaning:
      "In shadow, The Empress becomes the smothering mother—nurturing that controls, or creative energy blocked by self-neglect. The reversed Empress may indicate disconnection from the body, creative barrenness, or the inability to receive abundance because of underlying beliefs of unworthiness.",
    symbolism:
      "The abundant garden represents nature's generosity and the fertile unconscious. The stream flowing nearby speaks to emotional nourishment and the waters of the creative psyche. The twelve stars in her crown suggest completion and the cycles of manifestation. The heart-shaped shield marked with Venus connects her to love, beauty, and the receptive feminine principle.",
    description:
      "The Empress is the archetype of the fertile feminine—the creative matrix from which all forms emerge. She is nature in its most abundant aspect: generous, sensual, and endlessly productive. Unlike the contained mystery of The High Priestess, The Empress's wisdom spills over into manifest creation.\n\nThe Empress teaches us that creation is natural—that we are meant to bring forth, to nurture, to make things grow. She reminds us that the body is sacred, pleasure is holy, and that receiving is as important as giving. Her abundance is not hoarded but shared freely, knowing that more will always come.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-empress"],
  },

  "the-emperor": {
    slug: "the-emperor",
    number: 4,
    romanNumeral: numeral(4),
    name: "The Emperor",
    imagePath: "/images/tarot/trumps/04-the-emperor.png",
    keywords: ["authority", "structure", "stability", "leadership", "boundaries"],
    archetype: "The sovereign will that creates order from chaos",
    uprightMeaning:
      "The Emperor represents the principle of conscious order—the ability to establish structure, set boundaries, and exercise authority with wisdom. He is the archetype of the benevolent ruler: protective, decisive, and willing to take responsibility for outcomes. When The Emperor appears, it's time to step into your authority, create necessary structures, or establish clearer boundaries.",
    reversedMeaning:
      "In shadow, The Emperor becomes the tyrant—rigid, controlling, and threatened by anything outside his rule. The reversed Emperor may indicate abuse of power, excessive rigidity that prevents growth, or the avoidance of necessary authority and responsibility.",
    symbolism:
      "The stone throne suggests permanence and the power of established order. The rams' heads connect to Aries—cardinal fire, the initiating force. The orb and ankh represent worldly power and the key to life. The barren mountains behind him show that structure sometimes requires sacrifice of the wild and spontaneous.",
    description:
      "The Emperor establishes the kingdoms that The Empress populates. He is the masculine principle of form-giving—the power that creates containers, sets limits, and maintains order. Without this archetypal energy, creativity remains chaotic and unfocused; with it, vision becomes actualized in stable form.\n\nThe Emperor teaches that healthy authority protects rather than dominates. True sovereignty means taking responsibility for one's domain—creating structures that allow others to flourish. His power lies not in control but in the wisdom to know when to direct and when to allow.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-emperor"],
  },

  "the-hierophant": {
    slug: "the-hierophant",
    number: 5,
    romanNumeral: numeral(5),
    name: "The Hierophant",
    imagePath: "/images/tarot/trumps/05-the-hierophant.png",
    keywords: ["tradition", "teaching", "institutions", "spiritual wisdom", "conformity"],
    archetype: "The bridge between the sacred and the everyday",
    uprightMeaning:
      "The Hierophant represents the structures through which spiritual wisdom is transmitted—traditions, teachings, and institutions that preserve and share knowledge across generations. He is the archetype of the teacher, the spiritual guide, the keeper of sacred forms. When The Hierophant appears, consider what traditions serve you, what teachings you need, or what wisdom you're called to transmit.",
    reversedMeaning:
      "In shadow, The Hierophant becomes empty ritual—form without spirit, dogma that restricts rather than liberates. The reversed Hierophant may indicate blind conformity, questioning of inherited beliefs, or the need to find your own spiritual path outside established structures.",
    symbolism:
      "The crossed keys represent the power to bind and loose—to reveal or conceal spiritual knowledge. The triple crown suggests mastery of three realms: spiritual, intellectual, and material. The raised hand in blessing transmits spiritual authority. The two acolytes show the hierarchical nature of traditional teaching.",
    description:
      "Where The High Priestess holds esoteric secrets, The Hierophant teaches exoteric doctrine—the outer forms that point toward inner truth. He represents the value of tradition: the accumulated wisdom of those who came before, preserved in teachings, rituals, and sacred texts.\n\nThe Hierophant teaches that we don't always need to reinvent the wheel. Some wisdom has been tested across generations and can save us from errors others have already made. Yet his lesson cuts both ways: tradition serves when it illuminates, constrains when it becomes an end in itself.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-hierophant"],
  },

  "the-lovers": {
    slug: "the-lovers",
    number: 6,
    romanNumeral: numeral(6),
    name: "The Lovers",
    imagePath: "/images/tarot/trumps/06-the-lovers.png",
    keywords: ["union", "choice", "values", "relationship", "integration"],
    archetype: "The sacred union of opposites that creates wholeness",
    uprightMeaning:
      "The Lovers represents choice and union—the conscious decision to align with what we truly value, whether in partnership, work, or life direction. Beyond romantic love, this is the archetype of integration: bringing together aspects of self that seem opposed. When The Lovers appears, a meaningful choice approaches, or a union is forming that reflects your deepest values.",
    reversedMeaning:
      "In shadow, The Lovers becomes misalignment—choices made from obligation rather than love, or unions that fragment rather than integrate. The reversed Lovers may indicate values in conflict, difficulty committing, or partnerships that no longer reflect who you've become.",
    symbolism:
      "The angel Raphael oversees the union, suggesting divine blessing on authentic connection. The tree of knowledge behind the woman and tree of life behind the man represent the integration of wisdom and vitality. The serpent indicates the presence of transformative desire. The mountain in the background suggests the heights that union makes possible.",
    description:
      "The Lovers is not primarily about romance but about the power of conscious choice to shape destiny. Every significant decision is a kind of marriage—a commitment that closes some doors while opening others. The Lovers asks: What do you truly value? What union will help you become who you're meant to be?\n\nAt a deeper level, The Lovers represents the inner marriage Jung called the coniunctio—the integration of opposing aspects of psyche into greater wholeness. This is the union of conscious and unconscious, masculine and feminine, light and shadow.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-lovers"],
  },

  "the-chariot": {
    slug: "the-chariot",
    number: 7,
    romanNumeral: numeral(7),
    name: "The Chariot",
    imagePath: "/images/tarot/trumps/07-the-chariot.png",
    keywords: ["willpower", "determination", "victory", "control", "direction"],
    archetype: "The conquering will that moves through obstacles by mastering opposing forces",
    uprightMeaning:
      "The Chariot represents the triumph of directed will over inertia and opposition. This is the archetype of the conqueror—not through brute force, but through the integration of conflicting energies toward a single purpose. When The Chariot appears, victory is possible through focused determination. Gather your forces, choose your direction, and move forward without hesitation.",
    reversedMeaning:
      "In shadow, The Chariot becomes the ego out of control—willpower turned to aggression, or the inability to direct conflicting drives. The reversed Chariot may indicate feeling stuck, goals unclear, or the misuse of determination in pursuit of unworthy ends.",
    symbolism:
      "The two sphinxes (one black, one white) represent opposing forces that must be directed rather than eliminated. The charioteer wears armor but carries no reins—control comes through will, not force. The starry canopy connects earthly victory to celestial purpose. The city behind him shows what's been mastered; the open road ahead, what remains to be conquered.",
    description:
      "The Chariot depicts the moment of triumph—the point where accumulated effort achieves breakthrough. But this is no passive victory. The charioteer must continuously hold opposing forces in dynamic tension, directing their combined power toward the goal.\n\nThe Chariot teaches that true willpower isn't about suppressing parts of ourselves but orchestrating them. The opposing sphinxes might be reason and emotion, discipline and desire, fear and ambition. Mastery means harnessing both—not eliminating either—in service of forward movement.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-chariot"],
  },

  "strength": {
    slug: "strength",
    number: 8,
    romanNumeral: numeral(8),
    name: "Strength",
    imagePath: "/images/tarot/trumps/08-strength.png",
    keywords: ["courage", "patience", "compassion", "inner strength", "gentle power"],
    archetype: "The quiet power that tames the beast through love rather than force",
    uprightMeaning:
      "Strength represents power that doesn't need to prove itself—the quiet courage that comes from self-mastery rather than domination. This is the archetype of spiritual fortitude: the ability to face our inner beasts with compassion, transforming raw instinct into refined energy. When Strength appears, the situation calls for patience and gentle persistence, not force.",
    reversedMeaning:
      "In shadow, Strength becomes either brutal suppression of natural impulses or complete surrender to them. The reversed Strength may indicate self-doubt, loss of nerve, or the fear of confronting the wilder parts of oneself.",
    symbolism:
      "The woman taming the lion shows the relationship between conscious awareness and instinctual force. Her white robe speaks to purity of intention; the infinity symbol above her head connects to unlimited inner resources. The lack of struggle suggests mastery through relationship, not conflict. The flowers in her hair represent the beauty that emerges from this integration.",
    description:
      "Strength offers a radical reframe of power. The lion is not being defeated but befriended—not caged but gently guided. This is the strength that comes after we've exhausted force: the recognition that our inner beasts respond to love and patience better than violence and shame.\n\nStrength teaches that our most primitive drives contain vital energy that, properly channeled, becomes our greatest resource. The lion's passion, aggression, and hunger aren't enemies to be destroyed but powers to be integrated. True strength means no longer fearing what lives within us.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["strength"],
  },

  "the-hermit": {
    slug: "the-hermit",
    number: 9,
    romanNumeral: numeral(9),
    name: "The Hermit",
    imagePath: "/images/tarot/trumps/09-the-hermit.png",
    keywords: ["introspection", "solitude", "guidance", "wisdom", "inner search"],
    archetype: "The wise elder who seeks truth through solitary contemplation",
    uprightMeaning:
      "The Hermit represents the wisdom that comes only through solitude and self-reflection. This is the archetype of the seeker who withdraws from the noise of the world to find deeper truth. When The Hermit appears, it's time for introspection—to step back from external concerns and listen to the still, small voice within.",
    reversedMeaning:
      "In shadow, The Hermit becomes isolation without purpose—withdrawal from life rather than retreat for renewal. The reversed Hermit may indicate loneliness, excessive introversion, or the fear of returning to the world with what one has learned.",
    symbolism:
      "The lantern illuminates only the next few steps—wisdom that lights the immediate path rather than revealing the entire journey. The six-pointed star within suggests the integration of opposites that solitary work achieves. The mountain peak represents the height of spiritual attainment. The staff of experience supports the seeker on difficult terrain.",
    description:
      "The Hermit has climbed above the world not to escape it but to see it more clearly. This is the archetype of conscious withdrawal—the recognition that some truths cannot be found in the marketplace of opinions and must be sought in the silence of the inner landscape.\n\nThe Hermit teaches that solitude is not loneliness but relationship with self. In the quiet, we can finally hear what the noise drowns out. The light he carries isn't borrowed from others but generated from within—the hard-won illumination that comes from facing ourselves honestly.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-hermit"],
  },

  "wheel-of-fortune": {
    slug: "wheel-of-fortune",
    number: 10,
    romanNumeral: numeral(10),
    name: "Wheel of Fortune",
    imagePath: "/images/tarot/trumps/10-wheel-of-fortune.png",
    keywords: ["cycles", "fate", "change", "turning points", "destiny"],
    archetype: "The eternal dance of rising and falling, the cycles that shape all existence",
    uprightMeaning:
      "The Wheel of Fortune represents the principle of cyclical change—the recognition that all conditions are temporary and that fortune revolves according to laws beyond individual will. When the Wheel appears, circumstances are shifting. What was stuck begins to move; what seemed permanent reveals its impermanence. Align with the turning rather than resisting it.",
    reversedMeaning:
      "In shadow, the Wheel becomes bad luck blamed on fate—using cosmic forces as excuse to avoid responsibility. The reversed Wheel may indicate resistance to necessary change, feeling victimized by circumstance, or the failure to recognize one's role in creating conditions.",
    symbolism:
      "The wheel itself represents the cycles of existence—rising and falling, fortune and misfortune, life and death. The four fixed creatures in the corners suggest stability amid change. The sphinx at the top holds the sword of discernment; the descending and ascending figures show that everyone on the wheel is in motion. The letters TARO intertwined with ROTA (wheel) suggest the pattern within apparent randomness.",
    description:
      "The Wheel of Fortune is the first card beyond the initial journey of self-development (0-9), introducing the recognition that we exist within larger patterns we didn't create and cannot fully control. This is the wisdom of impermanence: the understanding that everything changes, nothing lasts, and resistance to this truth creates suffering.\n\nThe Wheel teaches that what rises will fall and what falls will rise—not to induce fatalism but to cultivate detachment from outcome. At the center of the wheel, where the axis doesn't move, there is stillness. The wise learn to rest there, watching the wheel turn without being turned by it.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["wheel-of-fortune"],
  },

  "justice": {
    slug: "justice",
    number: 11,
    romanNumeral: numeral(11),
    name: "Justice",
    imagePath: "/images/tarot/trumps/11-justice.png",
    keywords: ["fairness", "truth", "karma", "accountability", "balance"],
    archetype: "The impartial weigher of actions and consequences",
    uprightMeaning:
      "Justice represents the principle of cause and effect—the understanding that actions have consequences and that truth will ultimately be revealed. This is the archetype of cosmic law: impersonal, impartial, and inescapable. When Justice appears, honesty is required—with yourself and others. What's been hidden will come to light. What's been avoided must be faced.",
    reversedMeaning:
      "In shadow, Justice becomes either harsh judgment or the avoidance of accountability. The reversed Justice may indicate unfairness, dishonesty, or the refusal to accept responsibility for one's choices and their consequences.",
    symbolism:
      "The scales represent the weighing of actions against standards—the measurement of what is true and fair. The sword points upward, suggesting that justice cuts through confusion to reveal truth. The square crown indicates order and structure. The veil behind suggests that perfect justice requires seeing beyond appearances.",
    description:
      "Justice sits between the pillars, as did The High Priestess, but where she guarded mystery, Justice demands clarity. This is the archetype of accountability—the recognition that we reap what we sow, that the universe keeps accurate records, that truth cannot be permanently suppressed.\n\nJustice teaches that there's a moral order to existence beyond human laws. Not karma as punishment, but as simple cause and effect. Every action ripples outward, creating consequences that eventually return. Understanding this, we become more conscious of what we put into motion.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["justice"],
  },

  "the-hanged-man": {
    slug: "the-hanged-man",
    number: 12,
    romanNumeral: numeral(12),
    name: "The Hanged Man",
    imagePath: "/images/tarot/trumps/12-the-hanged-man.png",
    keywords: ["surrender", "new perspective", "sacrifice", "letting go", "suspension"],
    archetype: "The willing sacrifice that gains vision through surrender",
    uprightMeaning:
      "The Hanged Man represents the paradox of gaining through giving up—the wisdom that comes when we stop struggling and allow ourselves to be suspended in not-knowing. This is the archetype of conscious sacrifice: releasing attachment to outcome in order to see the situation from an entirely new angle. When The Hanged Man appears, action may not be the answer. Sometimes we must hang in the uncertainty.",
    reversedMeaning:
      "In shadow, The Hanged Man becomes meaningless suffering or the inability to let go. The reversed Hanged Man may indicate stalling, martyrdom without purpose, or resistance to the sacrifice that circumstances require.",
    symbolism:
      "The inverted position shows a complete reversal of normal perspective—seeing the world upside-down. The calm expression suggests peace within suspension. The crossed legs form a figure four, symbol of structure achieved through unconventional means. The halo indicates spiritual illumination gained through this unusual posture. The living tree suggests this is a temporary state of growth.",
    description:
      "The Hanged Man appears to be in a terrible position, yet his face is serene, even illuminated. This is the mystery of willing surrender—the discovery that what looks like defeat from one angle is liberation from another. The Hanged Man has stopped fighting gravity and, in doing so, has found a different kind of freedom.\n\nThe Hanged Man teaches that ego's way isn't the only way. Sometimes we must surrender our agenda, our timeline, our expectations—let ourselves hang in the uncertainty—before clarity can come. This is not passive resignation but active acceptance, not giving up but opening up.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-hanged-man"],
  },

  "death": {
    slug: "death",
    number: 13,
    romanNumeral: numeral(13),
    name: "Death",
    imagePath: "/images/tarot/trumps/13-death.png",
    keywords: ["transformation", "endings", "transition", "release", "renewal"],
    archetype: "The great transformer who clears away the old to make way for the new",
    uprightMeaning:
      "Death represents the principle of transformation through ending—the recognition that some things must die so others can be born. This is the archetype of necessary transition: the ego's attachments being stripped away, the old self being composted to nourish the new. When Death appears, something is completing its cycle. Resist if you will, but the old form cannot be maintained.",
    reversedMeaning:
      "In shadow, Death becomes stagnation—the refusal to let go of what's already dying, the attempt to keep alive what needs to pass. The reversed Death may indicate fear of change, prolonged endings, or the inability to grieve and release.",
    symbolism:
      "The skeletal rider shows what remains when all else is stripped away—the essential structure beneath appearances. The white rose on the black flag speaks to the purity and beauty that emerge from darkness. The setting sun suggests ending, while the rising sun between the towers promises new dawn. The river flows ever onward—life continues through all transformations.",
    description:
      "Death is perhaps the most feared and most misunderstood card. It rarely indicates physical death but rather the psychic experience of dying: the end of a way of being, a relationship, an identity, a chapter of life. Death comes not as punishment but as necessity—the only path to what wants to be born.\n\nDeath teaches that we cannot hold on to anything forever. Grasping creates suffering; releasing creates space. What dies isn't truly lost but transformed—composted into the soil from which new life springs. The invitation is not to welcome death but to cease resisting the transformations that life requires.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["death"],
  },

  "temperance": {
    slug: "temperance",
    number: 14,
    romanNumeral: numeral(14),
    name: "Temperance",
    imagePath: "/images/tarot/trumps/14-temperance.png",
    keywords: ["balance", "moderation", "patience", "synthesis", "alchemy"],
    archetype: "The alchemist who creates gold through the patient blending of opposites",
    uprightMeaning:
      "Temperance represents the art of integration—the patient work of combining seemingly incompatible elements into something new and valuable. This is the archetype of the alchemist: not avoiding extremes but transcending them through synthesis. When Temperance appears, balance is needed—not the static balance of avoidance, but the dynamic balance of ongoing adjustment and blending.",
    reversedMeaning:
      "In shadow, Temperance becomes imbalance—excess in one direction or another, or the failure to integrate. The reversed Temperance may indicate lack of moderation, incompatible elements forced together, or impatience with the slow work of true synthesis.",
    symbolism:
      "The angel pours water between cups in defiance of gravity—suggesting the miraculous results of proper blending. One foot in water, one on land shows integration of emotional and practical realms. The path winding toward the distant sun indicates the long journey of integration. The irises symbolize the beauty that emerges from this alchemical work.",
    description:
      "Temperance follows Death as healing follows surgery. After the old form has been dissolved, new integration becomes possible. The angel of Temperance pours essence back and forth between vessels, slowly blending what was separated into something new—the alchemical work of creating gold from base materials.\n\nTemperance teaches the virtue of moderation, but not as repression of desire. True temperance is the art of synthesis—holding opposites in creative tension, allowing them to blend into something neither could become alone. This takes time and patience. The alchemical work cannot be rushed.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["temperance"],
  },

  "the-devil": {
    slug: "the-devil",
    number: 15,
    romanNumeral: numeral(15),
    name: "The Devil",
    imagePath: "/images/tarot/trumps/15-the-devil.png",
    keywords: ["shadow", "bondage", "materialism", "addiction", "illusion"],
    archetype: "The shadow that binds us through our unacknowledged desires and fears",
    uprightMeaning:
      "The Devil represents whatever binds us through our own unconsciousness—addictions, compulsions, toxic attachments, and the shadow material we refuse to acknowledge. This is the archetype of bondage that appears to be imposed from outside but is actually self-created. When The Devil appears, examine what chains you. The links may be looser than they appear.",
    reversedMeaning:
      "In shadow (or rather, as the shadow becomes conscious), The Devil indicates the breaking of bonds—liberation from what once seemed inescapable. The reversed Devil may indicate freedom from addiction, the reclaiming of personal power, or the beginning of shadow work.",
    symbolism:
      "The chains around the figures are loose enough to remove—suggesting bondage is chosen, not imposed. The inverted pentagram represents spirit dominated by matter. The torch points downward, indicating light (awareness) suppressed. The half-human figures show the dehumanizing effect of unconscious bondage. Yet the darkness itself contains the seeds of transformation.",
    description:
      "The Devil is our shadow—not evil incarnate, but the repository of everything we've rejected, denied, and refused to integrate. What we won't face owns us. What we project onto others controls us from within. The Devil is the face of our own unconsciousness staring back.\n\nThe Devil teaches that liberation begins with acknowledgment. The chains that bind us are often of our own forging—habits, beliefs, and attachments we've mistaken for necessities. Seeing the bondage clearly is the first step toward freedom. The Devil's gift, paradoxically, is the opportunity to know our darkness and, through knowing, reclaim the power trapped within it.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-devil"],
  },

  "the-tower": {
    slug: "the-tower",
    number: 16,
    romanNumeral: numeral(16),
    name: "The Tower",
    imagePath: "/images/tarot/trumps/16-the-tower.png",
    keywords: ["upheaval", "revelation", "liberation", "crisis", "breakthrough"],
    archetype: "The lightning strike that shatters false structures built on unstable foundations",
    uprightMeaning:
      "The Tower represents sudden, often shocking change—the moment when structures built on false foundations come crashing down. This is the archetype of necessary destruction: the crisis that, however painful, reveals truth and clears ground for more authentic building. When The Tower appears, brace for impact. What's collapsing needed to fall.",
    reversedMeaning:
      "In shadow, The Tower may indicate the fear of necessary change, the attempt to shore up what's already falling, or the slow crumbling of structures rather than sudden collapse. The reversed Tower suggests the crisis is being prolonged rather than faced.",
    symbolism:
      "The lightning bolt represents sudden illumination—truth striking with undeniable force. The crown being knocked off suggests the toppling of false ego structures. The falling figures show the disorientation of having one's world shattered. Yet the fire also purifies, and the 22 flames (Hebrew Yods) suggest divine presence even in destruction.",
    description:
      "The Tower is perhaps the most feared card after Death, yet it serves a similar function: removing what no longer serves life. Where Death works gradually, The Tower strikes suddenly. What's been built on lies, denial, or ego inflation cannot stand when truth arrives.\n\nThe Tower teaches that some structures must fall. We build towers of identity, relationship, and belief that protect us for a time but eventually become prisons. The lightning of revelation—whether from within or without—shatters these towers not to punish but to liberate. After The Tower, we can finally see what is.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-tower"],
  },

  "the-star": {
    slug: "the-star",
    number: 17,
    romanNumeral: numeral(17),
    name: "The Star",
    imagePath: "/images/tarot/trumps/17-the-star.png",
    keywords: ["hope", "inspiration", "serenity", "healing", "renewal"],
    archetype: "The celestial guide who restores hope and connection to the divine",
    uprightMeaning:
      "The Star represents the renewal that follows crisis—the return of hope, inspiration, and sense of guidance after the darkness of The Tower. This is the archetype of celestial blessing: the moment when, having lost everything, we discover we are still held by something vaster than ourselves. When The Star appears, trust is being restored. Healing is underway.",
    reversedMeaning:
      "In shadow, The Star becomes despair or false hope—the inability to recover faith after crisis, or the substitution of fantasy for genuine renewal. The reversed Star may indicate disconnection from inspiration, blocked healing, or the fear that the light will not return.",
    symbolism:
      "The central star represents the soul's guiding light—the inner truth that remains when outer structures fall. The seven smaller stars suggest the chakras or the classical planets—the complete system of human potential. The nude figure shows vulnerability and authenticity. The water poured on land and sea represents the nourishment of conscious and unconscious realms.",
    description:
      "The Star appears after The Tower like dawn after darkest night. When everything we built has fallen, what remains? The Star answers: connection to something eternal, something that cannot be destroyed because it was never constructed. The Star is the discovery that even after complete devastation, we are still guided, still held, still becoming.\n\nThe Star teaches that hope is not naive optimism but deep trust in the larger pattern. The kneeling figure pours water endlessly—representing the inexhaustible nature of spiritual resources. We are never truly alone, never without guidance. The Star we follow is also the star within.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-star"],
  },

  "the-moon": {
    slug: "the-moon",
    number: 18,
    romanNumeral: numeral(18),
    name: "The Moon",
    imagePath: "/images/tarot/trumps/18-the-moon.png",
    keywords: ["illusion", "intuition", "dreams", "the unconscious", "fear"],
    archetype: "The realm of dreams and shadows where nothing is as it appears",
    uprightMeaning:
      "The Moon represents the mysterious territory of the unconscious—the realm of dreams, intuitions, and projections where clear seeing becomes difficult. This is the archetype of the night journey: the passage through inner darkness where fears magnify and imagination creates both wonders and terrors. When The Moon appears, trust your intuition but question your perceptions. Things may not be what they seem.",
    reversedMeaning:
      "In shadow, The Moon becomes overwhelming confusion, anxiety, or self-deception. The reversed Moon may indicate repressed fears surfacing, the clarification of previously murky situations, or the need to distinguish genuine intuition from projection.",
    symbolism:
      "The moon itself holds a face within a face—suggesting the deceptions of reflected light. The path winding between towers into unknown territory represents the journey through unconscious realms. The dog and wolf show domesticated and wild aspects of instinct. The crayfish emerging from the pool represents contents rising from the deepest unconscious.",
    description:
      "The Moon follows The Star's clarity with a return to darkness—but this is intentional descent into unconscious realms. The Moon teaches that we must pass through this shadowy territory to complete the journey. What rises from the depths must be faced; what haunts our dreams must be acknowledged.\n\nThe Moon teaches discernment in the land of shadows. Not everything that appears in the unconscious is true—some is projection, some is fear, some is wishful thinking. Yet the journey through lunar realms is necessary. Only by passing through the night do we earn the right to the day that follows.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-moon"],
  },

  "the-sun": {
    slug: "the-sun",
    number: 19,
    romanNumeral: numeral(19),
    name: "The Sun",
    imagePath: "/images/tarot/trumps/19-the-sun.png",
    keywords: ["joy", "success", "vitality", "clarity", "celebration"],
    archetype: "The radiant source of life and consciousness that illuminates all it touches",
    uprightMeaning:
      "The Sun represents the return of full consciousness after the journey through darkness—the joy, clarity, and vitality that come when truth is no longer obscured. This is the archetype of illumination: the moment when confusion dissolves, when what was hidden becomes visible, when life energy flows freely. When The Sun appears, celebrate. Clarity and success are present or approaching.",
    reversedMeaning:
      "In shadow, The Sun becomes blocked vitality or the inability to enjoy success. The reversed Sun may indicate temporary setbacks, clouded joy, or the need to find one's own inner sun rather than depending on external circumstances for happiness.",
    symbolism:
      "The sun itself radiates in all directions—consciousness illuminating everything equally. The child rides naked and confident—representing the innocence regained through experience. The sunflowers turn toward the light, showing the natural orientation toward consciousness. The white horse represents purified instinct, now in harmony with awareness.",
    description:
      "The Sun is the card of achieved consciousness—what the journey has been building toward. After The Moon's confusion, the sun rises with undeniable clarity. What was mysterious becomes known; what was frightening dissolves in the light. This is the archetype of illumination, success, and vital joy.\n\nThe Sun teaches that consciousness itself is transformative. What we can truly see, we can master. The darkness was never as powerful as it seemed—it was simply the absence of light. In the full radiance of awareness, the journey's hardships reveal their purpose: each trial was preparation for the capacity to hold this much light.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-sun"],
  },

  "judgement": {
    slug: "judgement",
    number: 20,
    romanNumeral: numeral(20),
    name: "Judgement",
    imagePath: "/images/tarot/trumps/20-judgement.png",
    keywords: ["rebirth", "calling", "reckoning", "absolution", "awakening"],
    archetype: "The final awakening that calls the soul to its highest purpose",
    uprightMeaning:
      "Judgement represents the call to ultimate awakening—the moment when everything we've been through culminates in a fundamental shift in identity. This is the archetype of resurrection: not physical death and rebirth, but the death of the old self and the emergence of one who has integrated the journey's lessons. When Judgement appears, hear the call. Something is asking you to rise to a higher version of yourself.",
    reversedMeaning:
      "In shadow, Judgement becomes self-judgment that condemns rather than liberates, or the refusal to heed the call to transformation. The reversed Judgement may indicate missing the moment of awakening, lingering self-doubt, or the fear of stepping fully into one's purpose.",
    symbolism:
      "The angel's trumpet represents the call that penetrates all barriers—the summons that cannot be ignored. The rising figures show the dead coming back to life—old selves transformed. The child represents the new consciousness emerging. The mountains in the background suggest the obstacles that have been overcome. The flag with the cross indicates the integration of opposites.",
    description:
      "Judgement is the penultimate card—the culmination before completion. Everything that has died rises again, transformed. Everything that was separated reunites. The journey's disparate experiences are revealed as parts of a coherent whole, and the traveler is called to step into the identity that all of it was preparing.\n\nJudgement teaches that life has been preparing us for something—a calling, a purpose, a version of ourselves we are meant to become. The call comes not from outside but from within: the deepest self summoning the everyday self to awaken. How we answer determines whether we live as sleepwalkers or as those who have truly woken up.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["judgement"],
  },

  "the-world": {
    slug: "the-world",
    number: 21,
    romanNumeral: numeral(21),
    name: "The World",
    imagePath: "/images/tarot/trumps/21-the-world.png",
    keywords: ["completion", "integration", "accomplishment", "wholeness", "fulfillment"],
    archetype: "The dancer in the center of all things, having integrated every aspect of the journey",
    uprightMeaning:
      "The World represents the successful completion of the major journey—the integration of all experiences into a coherent, dancing whole. This is the archetype of individuation: the achievement of a self that contains and harmonizes all opposites. When The World appears, a cycle is completing. Celebrate what has been accomplished before the new cycle begins.",
    reversedMeaning:
      "In shadow, The World becomes incompletion—the journey left unfinished, the loose ends that prevent true closure. The reversed World may indicate delay of fulfillment, near-completion frustrated, or the need to attend to what remains undone.",
    symbolism:
      "The dancing figure at the center represents the integrated self—moving effortlessly, fully alive. The wreath forms an oval or zero—completion that is also potential for new beginning. The four fixed creatures represent the elements, seasons, and evangelists—the complete pattern of manifestation. The two wands suggest the dance between opposites that no longer conflict.",
    description:
      "The World completes the Major Arcana, but completion is not ending. The dancing figure suggests perpetual motion—a wholeness that is dynamic, not static. This is the archetype of successful individuation: the self that has integrated its journey's lessons into a coherent, joyful presence.\n\nThe World teaches that the goal of the journey was never a destination but a way of being. The dancer has not arrived somewhere but has become someone—a self capable of holding all opposites in creative tension, of moving with life rather than against it. And the wreath forms a zero, suggesting that every ending is also a new beginning at a higher level of the spiral.",
    relatedJungianArchetype: TAROT_ARCHETYPE_MAP["the-world"],
  },
};

/**
 * Get all Major Arcana cards as an array (in numeric order)
 */
export function getAllMajorArcana(): MajorArcanaCard[] {
  return Object.values(MAJOR_ARCANA).sort((a, b) => a.number - b.number);
}

/**
 * Get a Major Arcana card by slug
 */
export function getMajorArcanaBySlug(slug: string): MajorArcanaCard | undefined {
  return MAJOR_ARCANA[slug as MajorArcanaSlug];
}

/**
 * Get a Major Arcana card by number (0-21)
 */
export function getMajorArcanaByNumber(number: number): MajorArcanaCard | undefined {
  return Object.values(MAJOR_ARCANA).find((card) => card.number === number);
}
