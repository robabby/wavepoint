/**
 * Astrological House data - 12 houses of the natal chart.
 *
 * Houses represent the sectors of life experience, each governing
 * specific domains from identity to transcendence.
 */

import type { HouseNumber, HousePageData, HouseType } from "./types";

/**
 * House numbers as ordered array
 */
export const HOUSE_NUMBERS: readonly HouseNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
] as const;

/**
 * Roman numeral representations
 */
export const ROMAN_NUMERALS: Record<HouseNumber, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
};

/**
 * House type by house number
 */
export const HOUSE_TYPES: Record<HouseNumber, HouseType> = {
  1: "angular",
  2: "succedent",
  3: "cadent",
  4: "angular",
  5: "succedent",
  6: "cadent",
  7: "angular",
  8: "succedent",
  9: "cadent",
  10: "angular",
  11: "succedent",
  12: "cadent",
};

/**
 * Complete data for all 12 astrological houses.
 */
export const HOUSE_DATA: Record<HouseNumber, HousePageData> = {
  1: {
    number: 1,
    name: "House of Self",
    glyph: ROMAN_NUMERALS[1],
    type: "angular",
    naturalSign: "aries",
    naturalRuler: "mars",
    oppositeHouse: 7,
    axisName: "Self-Other Axis",
    archetype: "The Threshold of Being",
    motto: "Who am I?",
    keywords: [
      "identity",
      "self-image",
      "appearance",
      "beginnings",
      "vitality",
      "first impressions",
    ],
    lifeAreas: [
      "Physical appearance and body",
      "Self-identity and persona",
      "First impressions you make",
      "New beginnings and initiatives",
      "General outlook on life",
      "Early childhood environment",
    ],
    description:
      "The First House marks the eastern horizon at the moment of birth, the precise point where the soul crosses the threshold from potential into manifestation. As the Ascendant, it represents the dawn of individual existence—the mask we wear, the lens through which we perceive and are perceived by the world.\n\nThis is the house of pure selfhood, governing not just physical appearance but the very essence of how we project ourselves into existence. It shapes our instinctive responses, our physical vitality, and the immediate impression we make before a single word is spoken. The First House is where being begins.",
    traditionalMeaning:
      "In classical astrology, the First House (or Horoskopos) was considered the most important house, as it marks the beginning of the chart and the native's life force. Traditional astrologers viewed it as governing the body, health, temperament, and overall life direction. The condition of the Ascendant and its ruler determined the quality of the native's constitution and early life circumstances.",
    modernMeaning:
      "Modern psychological astrology sees the First House as the developing ego and personal identity. It represents how we consciously present ourselves versus our true nature, the persona we construct to navigate the world. The Ascendant becomes a gateway to self-discovery, revealing both our authentic self-expression and the protective masks we wear.",
    traits: {
      strengths: [
        "Strong sense of personal identity",
        "Natural leadership presence",
        "Quick to initiate action",
        "Authentic self-expression",
        "Physical vitality and resilience",
        "Ability to make strong first impressions",
      ],
      challenges: [
        "Excessive self-focus or narcissism",
        "Difficulty seeing others' perspectives",
        "Impulsive reactions",
        "Over-identification with appearance",
        "Struggle to balance self with relationships",
        "Tendency to dominate interactions",
      ],
    },
    metaDescription:
      "Explore the First House in astrology, the House of Self. Learn about identity, appearance, first impressions, and how the Ascendant shapes your life path.",
    seoKeywords: [
      "first house astrology",
      "house of self",
      "ascendant meaning",
      "1st house natal chart",
      "rising sign house",
      "angular house",
    ],
  },

  2: {
    number: 2,
    name: "House of Values",
    glyph: ROMAN_NUMERALS[2],
    type: "succedent",
    naturalSign: "taurus",
    naturalRuler: "venus",
    oppositeHouse: 8,
    axisName: "Resource Axis",
    archetype: "The Treasury of Worth",
    motto: "What do I have?",
    keywords: [
      "possessions",
      "values",
      "self-worth",
      "money",
      "resources",
      "security",
    ],
    lifeAreas: [
      "Personal finances and income",
      "Material possessions and property",
      "Self-worth and values",
      "Natural talents and abilities",
      "Earning capacity",
      "Relationship with money",
    ],
    description:
      "The Second House follows the emergence of self with the fundamental question of sustenance: what resources do I need to survive and thrive? This is the domain of material security, but also of deeper values—what we truly treasure, both tangible and intangible.\n\nBeyond mere possessions, the Second House reveals our relationship with self-worth. How we earn, spend, and save money reflects our inner sense of value. Our natural talents, the gifts we bring into the world, and our capacity to build lasting security all reside here. This house teaches that true wealth begins with knowing what genuinely matters.",
    traditionalMeaning:
      "Classical astrology viewed the Second House as the house of moveable property, possessions, and livelihood. It governed money that could be earned through personal effort, as opposed to inherited wealth. The condition of this house and its ruler indicated the native's ability to accumulate resources and their relationship with material goods.",
    modernMeaning:
      "Contemporary astrology expands the Second House to encompass self-esteem and personal values. It reveals our inner sense of worth independent of external validation, and how that self-perception shapes our ability to attract and maintain resources. The house speaks to what we value deeply and how those values guide our choices.",
    traits: {
      strengths: [
        "Strong sense of personal worth",
        "Natural ability to attract resources",
        "Practical financial skills",
        "Appreciation for quality and beauty",
        "Reliable and trustworthy",
        "Patient approach to building wealth",
      ],
      challenges: [
        "Materialism or greed",
        "Tying self-worth to possessions",
        "Resistance to change or sharing",
        "Possessiveness in relationships",
        "Fear of scarcity",
        "Difficulty recognizing non-material value",
      ],
    },
    metaDescription:
      "Explore the Second House in astrology, the House of Values. Learn about money, possessions, self-worth, and how this house shapes your relationship with resources.",
    seoKeywords: [
      "second house astrology",
      "house of values",
      "2nd house money",
      "natal chart finances",
      "self-worth astrology",
      "succedent house",
    ],
  },

  3: {
    number: 3,
    name: "House of Communication",
    glyph: ROMAN_NUMERALS[3],
    type: "cadent",
    naturalSign: "gemini",
    naturalRuler: "mercury",
    oppositeHouse: 9,
    axisName: "Knowledge Axis",
    archetype: "The Crossroads of Mind",
    motto: "How do I connect?",
    keywords: [
      "communication",
      "siblings",
      "learning",
      "short journeys",
      "neighbors",
      "everyday mind",
    ],
    lifeAreas: [
      "Communication and writing",
      "Siblings and extended family",
      "Early education",
      "Local travel and transportation",
      "Neighbors and neighborhood",
      "Mental processes and curiosity",
    ],
    description:
      "The Third House governs the restless mind's first explorations of the world immediately surrounding us. Here we learn to name things, to communicate our needs, and to understand the web of connections that link us to our immediate environment—siblings, neighbors, and the familiar pathways of daily life.\n\nThis is the house of the everyday mind, governing how we process information, express our thoughts, and engage in the constant exchange of ideas that shapes our reality. From the first words we speak to the countless messages we send, the Third House reflects our fundamental need to communicate, connect, and understand.",
    traditionalMeaning:
      "In traditional astrology, the Third House was the house of siblings, short journeys, and communications. It governed letters, messengers, and local travel within one's immediate region. The house also ruled early education, neighbors, and the immediate environment one navigated daily.",
    modernMeaning:
      "Modern astrology expands the Third House to encompass all forms of communication technology, from phones to social media. It reflects our cognitive style, learning preferences, and how we process and share information. The house reveals our relationship with immediate community and the mental patterns that shape our daily interactions.",
    traits: {
      strengths: [
        "Excellent communication skills",
        "Quick and adaptable thinking",
        "Curiosity and love of learning",
        "Ability to connect diverse ideas",
        "Good with siblings and neighbors",
        "Skilled at multitasking",
      ],
      challenges: [
        "Mental restlessness or anxiety",
        "Superficial understanding",
        "Gossip or miscommunication",
        "Difficulty with deep focus",
        "Sibling rivalry or estrangement",
        "Information overload",
      ],
    },
    metaDescription:
      "Explore the Third House in astrology, the House of Communication. Learn about siblings, learning, local travel, and how this house shapes your mental world.",
    seoKeywords: [
      "third house astrology",
      "house of communication",
      "3rd house siblings",
      "mercury house",
      "mental astrology",
      "cadent house",
    ],
  },

  4: {
    number: 4,
    name: "House of Home",
    glyph: ROMAN_NUMERALS[4],
    type: "angular",
    naturalSign: "cancer",
    naturalRuler: "moon",
    oppositeHouse: 10,
    axisName: "Private-Public Axis",
    archetype: "The Root of Being",
    motto: "Where do I belong?",
    keywords: [
      "home",
      "family",
      "roots",
      "foundation",
      "ancestry",
      "emotional security",
    ],
    lifeAreas: [
      "Home and domestic life",
      "Family of origin",
      "Ancestral heritage",
      "Real estate and property",
      "Private inner life",
      "End of matters and final years",
    ],
    description:
      "The Fourth House marks the deepest point of the chart, the Imum Coeli or 'bottom of the sky.' Here, at the midnight position, we find our roots—the family, heritage, and emotional foundation upon which our entire life is built. This is the private self, hidden from the world.\n\nBeyond physical home, the Fourth House represents our psychological home: the internalized sense of belonging, security, and emotional nourishment we carry within. Our relationship with family, particularly the nurturing parent, echoes throughout life in how we create sanctuary and what we need to feel truly safe.",
    traditionalMeaning:
      "Classical astrology assigned the Fourth House to the father, home, land, and hidden things. It governed real property, ancestral inheritance, and the final years of life. As an angular house at the nadir, it represented the foundation upon which all else was built, including the grave as the final home.",
    modernMeaning:
      "Contemporary astrology sees the Fourth House as the seat of our emotional foundation and psychological roots. It reveals our relationship with home—both the family we came from and the domestic environment we create. The house speaks to our innermost private self, our need for emotional security, and the unconscious patterns inherited from family.",
    traits: {
      strengths: [
        "Deep connection to family and roots",
        "Ability to create nurturing environments",
        "Strong emotional intelligence",
        "Loyalty to loved ones",
        "Intuitive understanding of others' needs",
        "Talent for making spaces feel like home",
      ],
      challenges: [
        "Over-attachment to the past",
        "Difficulty leaving family patterns",
        "Moodiness and emotional reactivity",
        "Clinginess or codependency",
        "Unresolved family trauma",
        "Fear of leaving comfort zone",
      ],
    },
    metaDescription:
      "Explore the Fourth House in astrology, the House of Home. Learn about family, roots, emotional foundation, and how this angular house shapes your inner world.",
    seoKeywords: [
      "fourth house astrology",
      "house of home",
      "IC astrology",
      "4th house family",
      "imum coeli meaning",
      "angular house",
    ],
  },

  5: {
    number: 5,
    name: "House of Pleasure",
    glyph: ROMAN_NUMERALS[5],
    type: "succedent",
    naturalSign: "leo",
    naturalRuler: "sun",
    oppositeHouse: 11,
    axisName: "Creative Axis",
    archetype: "The Stage of Joy",
    motto: "What brings me joy?",
    keywords: [
      "creativity",
      "romance",
      "children",
      "pleasure",
      "self-expression",
      "play",
    ],
    lifeAreas: [
      "Creative self-expression",
      "Romance and dating",
      "Children and fertility",
      "Hobbies and recreation",
      "Gambling and speculation",
      "Performance and drama",
    ],
    description:
      "The Fifth House is where the soul comes out to play. After establishing roots and security, we are free to express ourselves creatively, to fall in love, and to experience the pure joy of being alive. This is the house of the heart's authentic expression, uncensored by duty or expectation.\n\nHere we find romance (the intoxicating early stages of love), children (our creative progeny), and all forms of artistic expression. The Fifth House asks what genuinely delights us, what we would do simply for the love of doing it. It is the domain of play, performance, and the radiant self that shines when we are truly happy.",
    traditionalMeaning:
      "Traditional astrology associated the Fifth House with children, pleasure, and 'good fortune.' It governed love affairs, entertainment, gambling, and creative arts. As a succedent house following the angular Fourth, it represented the fruits and enjoyments that stable foundations allow.",
    modernMeaning:
      "Modern astrology emphasizes the Fifth House as the arena of creative self-expression and authentic joy. It reveals how we play, create, and fall in love—the activities that connect us with our inner child. The house speaks to our relationship with pleasure, risk-taking, and the courage to put our hearts on display.",
    traits: {
      strengths: [
        "Natural creativity and artistic talent",
        "Warm and generous heart",
        "Ability to inspire and entertain",
        "Genuine connection with children",
        "Playful and fun-loving nature",
        "Courage to express authentically",
      ],
      challenges: [
        "Drama and attention-seeking",
        "Irresponsibility or recklessness",
        "Gambling or risky behavior",
        "Self-centered romantic patterns",
        "Difficulty with commitment",
        "Creative blocks from fear of judgment",
      ],
    },
    metaDescription:
      "Explore the Fifth House in astrology, the House of Pleasure. Learn about creativity, romance, children, and how this house reveals your path to joy.",
    seoKeywords: [
      "fifth house astrology",
      "house of pleasure",
      "5th house creativity",
      "romance astrology",
      "children natal chart",
      "succedent house",
    ],
  },

  6: {
    number: 6,
    name: "House of Health",
    glyph: ROMAN_NUMERALS[6],
    type: "cadent",
    naturalSign: "virgo",
    naturalRuler: "mercury",
    oppositeHouse: 12,
    axisName: "Service Axis",
    archetype: "The Temple of Craft",
    motto: "How do I serve?",
    keywords: [
      "health",
      "service",
      "work",
      "routine",
      "improvement",
      "daily habits",
    ],
    lifeAreas: [
      "Physical health and wellness",
      "Daily work and employment",
      "Service to others",
      "Daily routines and habits",
      "Pets and small animals",
      "Skills and self-improvement",
    ],
    description:
      "The Sixth House brings us back to earth after the expansive joy of the Fifth. Here we encounter the sacred discipline of daily life: the routines, habits, and humble acts of service that maintain health and create meaning through useful work. This is where dreams meet the grindstone of reality.\n\nHealth is central to this house—not as an abstraction but as the sum of daily choices. Work here means not career glory but the actual labor we perform, the skills we develop, and the service we render. The Sixth House teaches that enlightenment is found in attention to the small, repeated actions that compose a life.",
    traditionalMeaning:
      "Classical astrology designated the Sixth House as governing servants, small animals, and illness. It was considered a 'cadent' house of moderate difficulty, associated with the need to work and serve. Health afflictions and the relationship with those who serve were traditional concerns.",
    modernMeaning:
      "Contemporary astrology reframes the Sixth House as the domain of wellness, self-improvement, and meaningful work. It reveals our relationship with daily routines, physical health practices, and the satisfaction found in skilled service. The house speaks to how we refine ourselves through discipline and attention to craft.",
    traits: {
      strengths: [
        "Excellent organizational skills",
        "Dedication to health and wellness",
        "Strong work ethic",
        "Attention to detail and quality",
        "Genuine desire to help others",
        "Ability to improve and refine",
      ],
      challenges: [
        "Perfectionism and self-criticism",
        "Workaholism or overwork",
        "Anxiety about health",
        "Difficulty relaxing or playing",
        "Critical of others' efforts",
        "Martyrdom through excessive service",
      ],
    },
    metaDescription:
      "Explore the Sixth House in astrology, the House of Health. Learn about wellness, daily work, service, and how this house shapes your routines and habits.",
    seoKeywords: [
      "sixth house astrology",
      "house of health",
      "6th house work",
      "daily routine astrology",
      "service natal chart",
      "cadent house",
    ],
  },

  7: {
    number: 7,
    name: "House of Partnership",
    glyph: ROMAN_NUMERALS[7],
    type: "angular",
    naturalSign: "libra",
    naturalRuler: "venus",
    oppositeHouse: 1,
    axisName: "Self-Other Axis",
    archetype: "The Mirror of Relationship",
    motto: "Who completes me?",
    keywords: [
      "partnership",
      "marriage",
      "contracts",
      "open enemies",
      "cooperation",
      "balance",
    ],
    lifeAreas: [
      "Marriage and committed partnerships",
      "Business partnerships",
      "Contracts and legal agreements",
      "Open enemies and opponents",
      "Consultants and advisors",
      "One-on-one relationships",
    ],
    description:
      "The Seventh House sits directly opposite the First, marking the western horizon where the sun sets. If the First House is 'I,' the Seventh is 'You'—the other person we meet in relationship, whether through marriage, partnership, or even opposition. Here we discover ourselves through the mirror of another.\n\nThis house governs all binding agreements between equals: marriage, business partnerships, and legal contracts. It also rules 'open enemies'—those who oppose us directly and honestly. The Seventh House reveals what we seek in others, often the qualities we haven't yet integrated within ourselves, making relationships powerful catalysts for growth.",
    traditionalMeaning:
      "Traditional astrology associated the Seventh House with marriage, partnerships, and known enemies. The Descendant (cusp of the Seventh) described the spouse or partner, while the house governed all formal agreements and legal matters. Open adversaries—as opposed to hidden enemies—were also assigned here.",
    modernMeaning:
      "Modern astrology sees the Seventh House as revealing our patterns in close relationships and what we project onto partners. It shows how we balance self and other, independence and cooperation. The house speaks to our capacity for true intimacy and the shadow qualities we unconsciously seek in others.",
    traits: {
      strengths: [
        "Natural talent for partnership",
        "Ability to see others' perspectives",
        "Skilled at negotiation and diplomacy",
        "Fair and balanced in dealings",
        "Attracts quality relationships",
        "Graceful social presence",
      ],
      challenges: [
        "Over-dependence on partners",
        "Difficulty being alone",
        "People-pleasing tendencies",
        "Projecting issues onto others",
        "Avoiding conflict at personal cost",
        "Idealizing partners unrealistically",
      ],
    },
    metaDescription:
      "Explore the Seventh House in astrology, the House of Partnership. Learn about marriage, relationships, contracts, and how this angular house shapes your bonds.",
    seoKeywords: [
      "seventh house astrology",
      "house of partnership",
      "7th house marriage",
      "descendant meaning",
      "relationships natal chart",
      "angular house",
    ],
  },

  8: {
    number: 8,
    name: "House of Transformation",
    glyph: ROMAN_NUMERALS[8],
    type: "succedent",
    naturalSign: "scorpio",
    naturalRuler: "pluto",
    oppositeHouse: 2,
    axisName: "Resource Axis",
    archetype: "The Chamber of Mysteries",
    motto: "What must I release?",
    keywords: [
      "transformation",
      "shared resources",
      "death",
      "rebirth",
      "intimacy",
      "occult",
    ],
    lifeAreas: [
      "Shared finances and resources",
      "Inheritance and legacies",
      "Death, rebirth, and transformation",
      "Deep intimacy and sexuality",
      "Psychology and the unconscious",
      "Occult and hidden knowledge",
    ],
    description:
      "The Eighth House takes us into the depths where the ego must surrender. Opposite the Second House of personal resources, here we encounter shared resources—what we receive through others, including inheritance, joint finances, and the intimate merging of souls in deep relationship.\n\nThis is the house of death and regeneration, both literal and metaphorical. Here we face the shadows, the taboos, and the transformative crises that strip away what is false. The Eighth House governs sexuality at its most intimate, the occult mysteries, and the profound psychological processes that lead to rebirth.",
    traditionalMeaning:
      "Classical astrology assigned the Eighth House to death, legacies, and 'the substance of the dead.' It governed inheritance, dowries, and resources gained through others. The house was also associated with fear, anxiety, and matters relating to death and the afterlife.",
    modernMeaning:
      "Contemporary astrology emphasizes the Eighth House as the arena of psychological transformation and deep intimacy. It reveals our relationship with power, vulnerability, and the merging that happens in truly intimate bonds. The house speaks to how we handle crisis, loss, and the continual cycles of death and rebirth that mark a deeply lived life.",
    traits: {
      strengths: [
        "Psychological depth and insight",
        "Ability to transform and regenerate",
        "Comfortable with life's mysteries",
        "Powerful intimate connections",
        "Skilled at managing shared resources",
        "Resilience through crisis",
      ],
      challenges: [
        "Power struggles in relationships",
        "Obsessive or controlling tendencies",
        "Difficulty with trust and vulnerability",
        "Fear of loss or abandonment",
        "Manipulation or secrecy",
        "Attachment to intensity over peace",
      ],
    },
    metaDescription:
      "Explore the Eighth House in astrology, the House of Transformation. Learn about shared resources, intimacy, death, rebirth, and deep psychological change.",
    seoKeywords: [
      "eighth house astrology",
      "house of transformation",
      "8th house death",
      "pluto house",
      "shared resources astrology",
      "succedent house",
    ],
  },

  9: {
    number: 9,
    name: "House of Philosophy",
    glyph: ROMAN_NUMERALS[9],
    type: "cadent",
    naturalSign: "sagittarius",
    naturalRuler: "jupiter",
    oppositeHouse: 3,
    axisName: "Knowledge Axis",
    archetype: "The Horizon of Wisdom",
    motto: "What do I believe?",
    keywords: [
      "philosophy",
      "higher education",
      "travel",
      "religion",
      "meaning",
      "expansion",
    ],
    lifeAreas: [
      "Higher education and academia",
      "Long-distance travel",
      "Religion and spirituality",
      "Philosophy and worldview",
      "Publishing and broadcasting",
      "Legal and ethical matters",
    ],
    description:
      "The Ninth House expands our horizons beyond the familiar. Where the Third House governs the local and known, the Ninth reaches toward the distant and unexplored—foreign lands, higher education, philosophy, and the great questions of meaning that give life direction.\n\nThis is the house of the seeker, the pilgrim, the student of life. Here we develop our worldview, our personal philosophy, and our relationship with truth itself. Long journeys, both physical and intellectual, belong to this house, as do religion, law, and all systems of thought that attempt to explain the cosmos.",
    traditionalMeaning:
      "Traditional astrology associated the Ninth House with long journeys, religion, and prophecy. It governed higher learning, philosophy, and matters related to foreign countries and cultures. The house also ruled dreams, divination, and the clergy.",
    modernMeaning:
      "Modern astrology sees the Ninth House as the domain of personal meaning-making and the expansion of consciousness. It reveals how we construct our worldview, pursue higher knowledge, and find purpose through belief. The house speaks to our relationship with truth, faith, and the adventure of exploring beyond known boundaries.",
    traits: {
      strengths: [
        "Broad-minded and philosophical",
        "Love of learning and growth",
        "Adventurous and optimistic",
        "Strong sense of meaning and purpose",
        "Ability to see the big picture",
        "Natural teaching and mentoring skills",
      ],
      challenges: [
        "Self-righteousness about beliefs",
        "Escapism through travel or study",
        "Preachiness or dogmatism",
        "Restlessness and over-extension",
        "Neglecting practical details",
        "Imposing worldview on others",
      ],
    },
    metaDescription:
      "Explore the Ninth House in astrology, the House of Philosophy. Learn about higher education, travel, spirituality, and how this house shapes your worldview.",
    seoKeywords: [
      "ninth house astrology",
      "house of philosophy",
      "9th house travel",
      "jupiter house",
      "higher education astrology",
      "cadent house",
    ],
  },

  10: {
    number: 10,
    name: "House of Career",
    glyph: ROMAN_NUMERALS[10],
    type: "angular",
    naturalSign: "capricorn",
    naturalRuler: "saturn",
    oppositeHouse: 4,
    axisName: "Private-Public Axis",
    archetype: "The Summit of Achievement",
    motto: "What is my calling?",
    keywords: [
      "career",
      "reputation",
      "achievement",
      "authority",
      "public role",
      "legacy",
    ],
    lifeAreas: [
      "Career and profession",
      "Public reputation and status",
      "Authority figures and bosses",
      "Achievements and accomplishments",
      "Social standing and honors",
      "Legacy and contribution",
    ],
    description:
      "The Tenth House marks the highest point of the chart, the Midheaven or 'middle of the sky.' Here, at the noon position, we stand most visible to the world. This is the house of career, public reputation, and the legacy we build through sustained effort and achievement.\n\nOpposite the private Fourth House, the Tenth represents our public face, our professional calling, and our relationship with authority. It governs not just what we do for work, but how we are seen and remembered—our contribution to the world and the mark we leave upon it.",
    traditionalMeaning:
      "Classical astrology associated the Tenth House with career, honors, and the native's standing in society. It governed kings, authorities, and matters of public reputation. The Midheaven described one's profession and the heights one might achieve through sustained effort.",
    modernMeaning:
      "Contemporary astrology sees the Tenth House as revealing our authentic vocation and how we pursue recognition and achievement. It shows our relationship with authority, both as subject and leader. The house speaks to our ambitions, our calling, and the contribution we feel compelled to make to the world.",
    traits: {
      strengths: [
        "Strong sense of purpose and ambition",
        "Natural leadership abilities",
        "Disciplined and hardworking",
        "Good relationship with authority",
        "Builds lasting achievements",
        "Commands respect and credibility",
      ],
      challenges: [
        "Workaholism and neglecting personal life",
        "Excessive concern with status",
        "Difficulty with authority figures",
        "Fear of failure or exposure",
        "Sacrificing values for success",
        "Coldness in pursuit of goals",
      ],
    },
    metaDescription:
      "Explore the Tenth House in astrology, the House of Career. Learn about profession, reputation, achievement, and how this angular house shapes your public life.",
    seoKeywords: [
      "tenth house astrology",
      "house of career",
      "midheaven meaning",
      "10th house profession",
      "MC astrology",
      "angular house",
    ],
  },

  11: {
    number: 11,
    name: "House of Community",
    glyph: ROMAN_NUMERALS[11],
    type: "succedent",
    naturalSign: "aquarius",
    naturalRuler: "uranus",
    oppositeHouse: 5,
    axisName: "Creative Axis",
    archetype: "The Circle of Vision",
    motto: "What is my contribution?",
    keywords: [
      "community",
      "friends",
      "hopes",
      "groups",
      "humanitarian",
      "future",
    ],
    lifeAreas: [
      "Friendships and social networks",
      "Groups and organizations",
      "Hopes, wishes, and dreams",
      "Humanitarian causes",
      "Technology and innovation",
      "Social reform and progress",
    ],
    description:
      "The Eleventh House extends beyond personal achievement to collective endeavor. Where the Fifth House celebrates individual creativity, the Eleventh asks how we contribute to something larger than ourselves—through friendships, groups, and shared visions of a better future.\n\nThis is the house of hopes and wishes, but also of the communities and networks that help us realize them. It governs friendships based on shared ideals, involvement in groups and organizations, and our capacity to envision and work toward a better world. Here personal dreams merge with collective aspiration.",
    traditionalMeaning:
      "Traditional astrology associated the Eleventh House with friends, hopes, and the 'good spirit.' It was considered a fortunate house, governing beneficial relationships, patrons, and the fulfillment of wishes. The house also ruled groups, guilds, and associations of like-minded individuals.",
    modernMeaning:
      "Modern astrology emphasizes the Eleventh House as the arena of social consciousness and collective belonging. It reveals how we participate in communities, contribute to causes, and envision future possibilities. The house speaks to our relationship with technology, innovation, and the progressive impulse to improve society.",
    traits: {
      strengths: [
        "Strong sense of community",
        "Loyal and supportive friend",
        "Visionary and forward-thinking",
        "Commitment to causes and ideals",
        "Ability to network and connect",
        "Open-minded and accepting",
      ],
      challenges: [
        "Emotional detachment from individuals",
        "Idealism disconnected from reality",
        "Difficulty with intimate one-on-one bonds",
        "Rebellion for its own sake",
        "Lost in causes while neglecting self",
        "Utopian thinking without practical action",
      ],
    },
    metaDescription:
      "Explore the Eleventh House in astrology, the House of Community. Learn about friendships, groups, hopes, and how this house connects you to collective purpose.",
    seoKeywords: [
      "eleventh house astrology",
      "house of community",
      "11th house friends",
      "uranus house",
      "hopes and wishes astrology",
      "succedent house",
    ],
  },

  12: {
    number: 12,
    name: "House of the Unconscious",
    glyph: ROMAN_NUMERALS[12],
    type: "cadent",
    naturalSign: "pisces",
    naturalRuler: "neptune",
    oppositeHouse: 6,
    axisName: "Service Axis",
    archetype: "The Ocean of Mystery",
    motto: "What lies beyond?",
    keywords: [
      "unconscious",
      "spirituality",
      "solitude",
      "hidden",
      "karma",
      "transcendence",
    ],
    lifeAreas: [
      "The unconscious and hidden patterns",
      "Spirituality and transcendence",
      "Solitude and retreat",
      "Hidden enemies and self-undoing",
      "Institutions and confinement",
      "Compassion and sacrifice",
    ],
    description:
      "The Twelfth House completes the journey around the wheel, representing the dissolution of boundaries before the new cycle begins at the Ascendant. This is the house of endings, of what is hidden from view, of the vast unconscious realm that underlies conscious existence.\n\nHere we find both the prison and the monastery—places of confinement but also of spiritual transcendence. The Twelfth governs what we keep hidden, including self-undoing patterns and secret enemies. Yet it also rules compassion, sacrifice, and the mystical union with something greater than the ego. It is where the personal dissolves into the universal.",
    traditionalMeaning:
      "Classical astrology designated the Twelfth House as the house of 'bad spirit,' governing enemies, imprisonment, and misfortune. It ruled hidden matters, self-undoing, large animals, and places of confinement. The house was associated with loss, sorrow, and the conditions that limit freedom.",
    modernMeaning:
      "Contemporary astrology reframes the Twelfth House as the gateway to the unconscious and the spiritual dimension. It reveals our relationship with the invisible realms—dreams, intuition, karma, and the collective unconscious. The house speaks to how we find meaning through transcendence, surrender, and service to something beyond the ego.",
    traits: {
      strengths: [
        "Deep spiritual awareness",
        "Powerful intuition and psychic gifts",
        "Compassion for suffering",
        "Ability to heal and counsel",
        "Access to creative inspiration",
        "Comfort with solitude and mystery",
      ],
      challenges: [
        "Escapism and avoidance",
        "Victim mentality or martyrdom",
        "Self-destructive patterns",
        "Difficulty with boundaries",
        "Confusion between self and other",
        "Hidden enemies or self-sabotage",
      ],
    },
    metaDescription:
      "Explore the Twelfth House in astrology, the House of the Unconscious. Learn about spirituality, hidden patterns, karma, and the transcendent mysteries of this final house.",
    seoKeywords: [
      "twelfth house astrology",
      "house of unconscious",
      "12th house spirituality",
      "neptune house",
      "karma astrology",
      "cadent house",
    ],
  },
};

/**
 * Get all houses as an array (in order 1-12)
 */
export function getAllHouses(): HousePageData[] {
  return HOUSE_NUMBERS.map((num) => HOUSE_DATA[num]);
}

/**
 * Get a house by number
 */
export function getHouseByNumber(num: number): HousePageData | undefined {
  if (num >= 1 && num <= 12) {
    return HOUSE_DATA[num as HouseNumber];
  }
  return undefined;
}
