/**
 * FAQ Data Model
 *
 * Frequently asked questions about sacred geometry, organized by category.
 * Answers include internal links to related geometry pages.
 */

export type FAQCategory =
  | "general"
  | "platonic-solids"
  | "patterns"
  | "practice";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  order: number;
}

export interface FAQCategoryMeta {
  id: FAQCategory;
  name: string;
  description: string;
  order: number;
}

export const FAQ_CATEGORIES: FAQCategoryMeta[] = [
  {
    id: "general",
    name: "General",
    description: "Foundational questions about sacred geometry",
    order: 1,
  },
  {
    id: "platonic-solids",
    name: "Platonic Solids",
    description: "Questions about the five perfect three-dimensional forms",
    order: 2,
  },
  {
    id: "patterns",
    name: "Patterns",
    description: "Questions about geometric patterns and symbols",
    order: 3,
  },
  {
    id: "practice",
    name: "Practice & Application",
    description: "How to work with sacred geometry in daily life",
    order: 4,
  },
];

export const FAQ_DATA: FAQItem[] = [
  // ============================================================================
  // GENERAL (7 questions)
  // ============================================================================
  {
    id: "what-is-sacred-geometry",
    question: "What is sacred geometry?",
    answer:
      'Sacred geometry is the study of geometric patterns that appear throughout nature, art, and architecture. These patterns are considered "sacred" because they reveal the mathematical principles underlying creation itself—from the spiral of galaxies to the structure of DNA. Ancient cultures worldwide recognized these patterns as expressions of universal harmony and divine order.',
    category: "general",
    order: 1,
  },
  {
    id: "why-called-sacred",
    question: "Why is it called 'sacred' geometry?",
    answer:
      "The term \"sacred\" reflects the belief that these geometric patterns represent fundamental truths about reality and creation. Ancient civilizations—from Egypt to Greece to India—incorporated these forms into their temples, art, and spiritual practices, viewing them as bridges between the physical and divine realms. The mathematics of these shapes was seen as the language of the cosmos.",
    category: "general",
    order: 2,
  },
  {
    id: "where-found-in-nature",
    question: "Where can sacred geometry be found in nature?",
    answer:
      'Sacred geometric patterns appear everywhere in the natural world: the hexagonal cells of honeycombs, the spiral of nautilus shells and hurricanes, the branching of trees and rivers, the structure of crystals and snowflakes, and even the proportions of the human body. The <a href="/sacred-patterns/golden-ratio">Golden Ratio</a> (φ ≈ 1.618) appears in flower petals, seed arrangements, and spiral galaxies.',
    category: "general",
    order: 3,
  },
  {
    id: "history-sacred-geometry",
    question: "What is the history of sacred geometry?",
    answer:
      'Sacred geometry has roots in ancient Egypt, where it informed pyramid construction, and ancient Greece, where Pythagoras and Plato studied these forms. The <a href="/platonic-solids">Platonic Solids</a> were named after Plato, who associated them with the classical elements. Renaissance artists like Leonardo da Vinci studied the <a href="/sacred-patterns/flower-of-life">Flower of Life</a> and applied geometric principles to their masterworks.',
    category: "general",
    order: 4,
  },
  {
    id: "sacred-geometry-science",
    question: "Is sacred geometry scientific?",
    answer:
      "Sacred geometry bridges mathematics and spirituality. The geometric patterns themselves are mathematically precise—the Platonic Solids, Golden Ratio, and Fibonacci sequence are well-established mathematical concepts studied in crystallography, biology, and physics. The \"sacred\" interpretation adds symbolic and spiritual meaning to these mathematical realities.",
    category: "general",
    order: 5,
  },
  {
    id: "why-study-sacred-geometry",
    question: "Why should I study sacred geometry?",
    answer:
      'Studying sacred geometry develops spatial reasoning, reveals patterns in nature, and connects mathematics to art and spirituality. Many find it enhances creativity, provides meditation frameworks, and offers a deeper appreciation for the underlying order of the universe. Whether you approach it mathematically or spiritually, these patterns offer insights into the structure of reality.',
    category: "general",
    order: 6,
  },
  {
    id: "sacred-geometry-religion",
    question: "Is sacred geometry tied to a specific religion?",
    answer:
      'Sacred geometry transcends any single religion or culture. The <a href="/sacred-patterns/flower-of-life">Flower of Life</a> appears in Egyptian, Chinese, and European contexts. The <a href="/sacred-patterns/sri-yantra">Sri Yantra</a> comes from Hindu tradition. The <a href="/sacred-patterns/tree-of-life">Tree of Life</a> appears in Kabbalah. These universal patterns have been discovered independently across cultures, suggesting they reflect fundamental truths rather than cultural inventions.',
    category: "general",
    order: 7,
  },

  // ============================================================================
  // PLATONIC SOLIDS (6 questions)
  // ============================================================================
  {
    id: "what-are-platonic-solids",
    question: "What are the Platonic Solids?",
    answer:
      'The <a href="/platonic-solids">Platonic Solids</a> are the only five three-dimensional shapes where every face is an identical regular polygon and every vertex has the same number of faces meeting. They are: the <a href="/platonic-solids/tetrahedron">Tetrahedron</a> (4 triangular faces), <a href="/platonic-solids/hexahedron">Hexahedron/Cube</a> (6 square faces), <a href="/platonic-solids/octahedron">Octahedron</a> (8 triangular faces), <a href="/platonic-solids/dodecahedron">Dodecahedron</a> (12 pentagonal faces), and <a href="/platonic-solids/icosahedron">Icosahedron</a> (20 triangular faces).',
    category: "platonic-solids",
    order: 1,
  },
  {
    id: "why-only-five",
    question: "Why are there only five Platonic Solids?",
    answer:
      "Mathematics proves that only five such forms can exist. For a regular polyhedron, at least three faces must meet at each vertex, and the angles at each vertex must sum to less than 360°. Only three regular polygons (triangle, square, pentagon) can satisfy these constraints, and they can only combine in five unique ways. This mathematical limitation makes the Platonic Solids fundamental to three-dimensional geometry.",
    category: "platonic-solids",
    order: 2,
  },
  {
    id: "platonic-solids-elements",
    question: "How do the Platonic Solids relate to the classical elements?",
    answer:
      'Ancient Greek philosophers associated each solid with an element: the <a href="/platonic-solids/tetrahedron">Tetrahedron</a> with Fire (sharp, penetrating), the <a href="/platonic-solids/hexahedron">Cube</a> with Earth (stable, grounded), the <a href="/platonic-solids/octahedron">Octahedron</a> with Air (light, balanced), the <a href="/platonic-solids/icosahedron">Icosahedron</a> with Water (flowing, adaptable), and the <a href="/platonic-solids/dodecahedron">Dodecahedron</a> with Ether/Spirit (cosmic, transcendent).',
    category: "platonic-solids",
    order: 3,
  },
  {
    id: "what-are-duals",
    question: "What are 'dual' Platonic Solids?",
    answer:
      'Dual solids are pairs where one solid\'s vertices correspond to the other\'s face centers. The <a href="/platonic-solids/hexahedron">Cube</a> and <a href="/platonic-solids/octahedron">Octahedron</a> are duals—connecting the center of each cube face creates an octahedron, and vice versa. Similarly, the <a href="/platonic-solids/dodecahedron">Dodecahedron</a> and <a href="/platonic-solids/icosahedron">Icosahedron</a> are duals. The <a href="/platonic-solids/tetrahedron">Tetrahedron</a> is unique: it is self-dual.',
    category: "platonic-solids",
    order: 4,
  },
  {
    id: "tetrahedron-special",
    question: "What makes the Tetrahedron special?",
    answer:
      'The <a href="/platonic-solids/tetrahedron">Tetrahedron</a> is the simplest possible three-dimensional shape—the minimum number of faces needed to enclose space. It is self-dual (its dual is another tetrahedron), and every vertex connects to every other vertex. In chemistry, tetrahedral geometry forms the basis for carbon bonds, making it literally the structural foundation of organic life.',
    category: "platonic-solids",
    order: 5,
  },
  {
    id: "platonic-solids-modern-science",
    question: "Do Platonic Solids appear in modern science?",
    answer:
      'Yes! Molecular geometry relies heavily on these forms—methane (CH₄) is tetrahedral, salt crystals are cubic. Viruses often have icosahedral shells. The <a href="/platonic-solids/dodecahedron">Dodecahedron</a> appears in quasicrystals. Some physicists theorize the universe itself may have dodecahedral geometry. These ancient forms remain fundamental to understanding physical reality.',
    category: "platonic-solids",
    order: 6,
  },

  // ============================================================================
  // PATTERNS (8 questions)
  // ============================================================================
  {
    id: "what-are-sacred-patterns",
    question: "What are sacred patterns?",
    answer:
      '<a href="/sacred-patterns">Sacred patterns</a> are geometric designs that appear repeatedly throughout nature, art, and spiritual traditions. Unlike the three-dimensional <a href="/platonic-solids">Platonic Solids</a>, these are primarily two-dimensional patterns—circles, spirals, and their combinations—that encode mathematical relationships considered fundamental to creation. From the <a href="/sacred-patterns/flower-of-life">Flower of Life</a> to the <a href="/sacred-patterns/golden-ratio">Golden Ratio</a>, these patterns reveal the hidden order underlying the visible world.',
    category: "patterns",
    order: 1,
  },
  {
    id: "what-is-flower-of-life",
    question: "What is the Flower of Life?",
    answer:
      'The <a href="/sacred-patterns/flower-of-life">Flower of Life</a> is a geometric pattern of overlapping circles arranged in a hexagonal flower-like pattern. Starting from a single circle, each new circle is drawn with its center on the circumference of existing circles. This simple process generates a pattern containing all five Platonic Solids, the <a href="/sacred-patterns/seed-of-life">Seed of Life</a>, the <a href="/sacred-patterns/fruit-of-life">Fruit of Life</a>, and <a href="/sacred-patterns/metatrons-cube">Metatron\'s Cube</a>.',
    category: "patterns",
    order: 2,
  },
  {
    id: "what-is-metatrons-cube",
    question: "What is Metatron's Cube?",
    answer:
      '<a href="/sacred-patterns/metatrons-cube">Metatron\'s Cube</a> is created by connecting the centers of the 13 circles in the <a href="/sacred-patterns/fruit-of-life">Fruit of Life</a>. Remarkably, this single pattern contains all five Platonic Solids within it. Named after the archangel Metatron, it represents the geometric blueprint underlying physical creation—a kind of cosmic template from which all forms emerge.',
    category: "patterns",
    order: 3,
  },
  {
    id: "what-is-golden-ratio",
    question: "What is the Golden Ratio?",
    answer:
      'The <a href="/sacred-patterns/golden-ratio">Golden Ratio</a> (φ ≈ 1.618) is a mathematical proportion where the ratio of the whole to the larger part equals the ratio of the larger part to the smaller. It appears throughout nature—in spiral shells, flower petals, and human proportions—and has been used in art and architecture from the Parthenon to modern design. It\'s closely related to the Fibonacci sequence.',
    category: "patterns",
    order: 4,
  },
  {
    id: "what-is-vesica-piscis",
    question: "What is the Vesica Piscis?",
    answer:
      'The <a href="/sacred-patterns/vesica-piscis">Vesica Piscis</a> is the almond-shaped intersection created when two circles of equal size overlap so that the center of each lies on the circumference of the other. This fundamental shape is considered the "womb of creation" in sacred geometry—from it, all other forms can be generated. It contains the proportions for the square root of 2, 3, and 5.',
    category: "patterns",
    order: 5,
  },
  {
    id: "what-is-star-tetrahedron",
    question: "What is the Star Tetrahedron (Merkaba)?",
    answer:
      'The <a href="/sacred-patterns/star-tetrahedron">Star Tetrahedron</a>, also called the Merkaba, is formed by two interlocking tetrahedrons—one pointing up, one pointing down. It represents the union of opposites: masculine and feminine, heaven and earth, spirit and matter. Some traditions teach it as the geometric structure of the human energy field and a vehicle for spiritual ascension.',
    category: "patterns",
    order: 6,
  },
  {
    id: "what-is-seed-of-life",
    question: "What is the Seed of Life?",
    answer:
      'The <a href="/sacred-patterns/seed-of-life">Seed of Life</a> consists of seven circles—one central circle surrounded by six circles of equal size. It represents the seven days of creation and is the foundational pattern from which the <a href="/sacred-patterns/flower-of-life">Flower of Life</a> grows. The pattern mirrors the first stages of cell division (mitosis) in biological organisms.',
    category: "patterns",
    order: 7,
  },
  {
    id: "what-is-sri-yantra",
    question: "What is the Sri Yantra?",
    answer:
      'The <a href="/sacred-patterns/sri-yantra">Sri Yantra</a> is a sacred Hindu diagram consisting of nine interlocking triangles surrounding a central point (bindu). Four triangles point upward (representing masculine/Shiva), five point downward (feminine/Shakti). It represents the union of divine energies and is used for meditation and manifestation practices. Creating it with precise proportions is mathematically complex.',
    category: "patterns",
    order: 8,
  },

  // ============================================================================
  // PRACTICE (5 questions)
  // ============================================================================
  {
    id: "how-to-draw-sacred-geometry",
    question: "How do I start drawing sacred geometry?",
    answer:
      'Begin with a compass and straightedge—the traditional tools. Start with the <a href="/sacred-patterns/vesica-piscis">Vesica Piscis</a>: draw one circle, then a second with its center on the first\'s edge. From there, expand to the <a href="/sacred-patterns/seed-of-life">Seed of Life</a> by adding circles at each intersection point. This meditative practice develops precision and reveals how complex patterns emerge from simple beginnings.',
    category: "practice",
    order: 1,
  },
  {
    id: "meditation-with-geometry",
    question: "How can I meditate with sacred geometry?",
    answer:
      'Several approaches work well: gaze softly at a pattern like the <a href="/sacred-patterns/flower-of-life">Flower of Life</a>, allowing your vision to relax and the pattern to reveal its depth. Visualize geometric forms at your chakra centers. Trace patterns with your finger or eyes, following the lines meditatively. Or simply contemplate the meaning of a shape, letting insights arise naturally.',
    category: "practice",
    order: 2,
  },
  {
    id: "sacred-geometry-daily-life",
    question: "How can I apply sacred geometry in daily life?",
    answer:
      "Notice geometric patterns in your environment—architecture, plants, art. Use geometric principles in creative projects or home design. Wear or display sacred geometric symbols as reminders of interconnection. Apply the Golden Ratio to compositions in photography or design. The practice is about developing awareness of the patterns underlying reality.",
    category: "practice",
    order: 3,
  },
  {
    id: "crystals-and-geometry",
    question: "How do crystals relate to sacred geometry?",
    answer:
      'Crystals naturally form according to geometric principles. Their atomic structures create the Platonic Solid shapes: salt crystals are cubic (<a href="/platonic-solids/hexahedron">Hexahedron</a>), fluorite forms octahedrons, and pyrite can form dodecahedrons. Many practitioners use crystals in conjunction with sacred geometry for meditation and energy work, believing the geometric structure amplifies the crystal\'s properties.',
    category: "practice",
    order: 4,
  },
  {
    id: "sacred-geometry-art",
    question: "How is sacred geometry used in art and architecture?",
    answer:
      'Sacred geometry has informed art and architecture for millennia. The Egyptian pyramids embody tetrahedral geometry. Gothic cathedrals use the <a href="/sacred-patterns/vesica-piscis">Vesica Piscis</a> in their arches. Islamic art features intricate geometric patterns. Renaissance artists applied the <a href="/sacred-patterns/golden-ratio">Golden Ratio</a> to compositions. Modern architects continue using these proportions to create harmonious, aesthetically pleasing spaces.',
    category: "practice",
    order: 5,
  },
];

/**
 * Get all FAQs for a specific category, sorted by order
 */
export function getFAQsByCategory(category: FAQCategory): FAQItem[] {
  return FAQ_DATA.filter((faq) => faq.category === category).sort(
    (a, b) => a.order - b.order
  );
}

/**
 * Get all FAQs sorted by category order then item order
 */
export function getAllFAQs(): FAQItem[] {
  return [...FAQ_DATA].sort((a, b) => {
    const catA = FAQ_CATEGORIES.find((c) => c.id === a.category)?.order ?? 0;
    const catB = FAQ_CATEGORIES.find((c) => c.id === b.category)?.order ?? 0;
    if (catA !== catB) return catA - catB;
    return a.order - b.order;
  });
}
