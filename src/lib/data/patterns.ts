/**
 * Patterns Data
 *
 * Sacred geometric patterns found throughout nature, art, and spiritual traditions.
 * These patterns represent fundamental principles of creation and universal structure.
 */

import type { Geometry } from "./geometries.types";
import { getPatternHeroImage } from "./image-paths";

export const PATTERNS: Record<string, Geometry> = {
  "circle-dot": {
    id: "circle-dot",
    name: "Circle Dot",
    slug: "circle-dot",
    category: "pattern",
    title: "Circle Dot",
    description:
      "The primordial symbol of unity and creation, representing the divine spark and the beginning of all form",
    relatedBy: {
      property: [
        "unity",
        "creation point",
        "divine spark",
        "zero point",
        "source",
        "monad",
        "bindu",
        "cosmic egg",
      ],
    },
    images: getPatternHeroImage("circle-dot"),
    featured: true,
    order: 1,
  },

  "vesica-piscis": {
    id: "vesica-piscis",
    name: "Vesica Piscis",
    slug: "vesica-piscis",
    category: "pattern",
    title: "Vesica Piscis",
    description:
      "The intersection of two circles, representing duality and the portal of creation",
    relatedBy: {
      property: [
        "duality",
        "creation portal",
        "divine feminine",
        "sacred geometry foundation",
        "vesica",
        "almond shape",
      ],
    },
    images: getPatternHeroImage("vesica-piscis"),
    featured: true,
    order: 2,
  },

  "germ-of-life": {
    id: "germ-of-life",
    name: "Germ of Life",
    slug: "germ-of-life",
    category: "pattern",
    title: "Germ of Life",
    description:
      "Seven circles forming a six-petaled flower, representing the first rotation of creation and the foundation of growth",
    relatedBy: {
      property: [
        "rotation",
        "hexagonal symmetry",
        "first day of creation",
        "foundation pattern",
        "growth principle",
      ],
    },
    images: getPatternHeroImage("germ-of-life"),
    featured: true,
    order: 2.5,
  },

  "seed-of-life": {
    id: "seed-of-life",
    name: "Seed of Life",
    slug: "seed-of-life",
    category: "pattern",
    title: "Seed of Life",
    description:
      "Seven circles in perfect symmetry, representing the seven days of creation",
    relatedBy: {
      property: ["creation", "genesis", "foundation", "divine feminine"],
    },
    images: getPatternHeroImage("seed-of-life"),
    featured: true,
    order: 3,
  },

  "egg-of-life": {
    id: "egg-of-life",
    name: "Egg of Life",
    slug: "egg-of-life",
    category: "pattern",
    title: "Egg of Life",
    description:
      "Eight spheres forming the shape of an egg, representing the embryonic cell division and the blueprint of all living things",
    relatedBy: {
      property: [
        "embryonic development",
        "cell division",
        "organic forms",
        "life blueprint",
        "transition pattern",
      ],
    },
    images: getPatternHeroImage("egg-of-life"),
    featured: true,
    order: 3.5,
  },

  "fruit-of-life": {
    id: "fruit-of-life",
    name: "Fruit of Life",
    slug: "fruit-of-life",
    category: "pattern",
    title: "Fruit of Life",
    description:
      "Thirteen circles extracted from the Flower of Life, representing the blueprint of the universe",
    relatedBy: {
      property: [
        "cosmic blueprint",
        "metatron's cube foundation",
        "universe structure",
        "sacred grid",
        "dimensional keys",
      ],
    },
    images: getPatternHeroImage("fruit-of-life"),
    featured: true,
    order: 4,
  },

  "flower-of-life": {
    id: "flower-of-life",
    name: "Flower of Life",
    slug: "flower-of-life",
    category: "pattern",
    title: "Flower of Life",
    description:
      "Ancient symbol of creation consisting of overlapping circles representing the fundamental forms of space and time",
    relatedBy: {
      property: ["creation", "unity", "infinite", "sacred blueprint"],
    },
    images: getPatternHeroImage("flower-of-life"),
    featured: true,
    order: 5,
  },

  "metatrons-cube": {
    id: "metatrons-cube",
    name: "Metatron's Cube",
    slug: "metatrons-cube",
    category: "pattern",
    title: "Metatron's Cube",
    description:
      "Contains all five Platonic Solids and represents the geometric pattern of the universe",
    relatedBy: {
      property: [
        "all platonic solids",
        "universal pattern",
        "archangel metatron",
        "sacred geometry map",
      ],
    },
    images: getPatternHeroImage("metatrons-cube"),
    featured: true,
    order: 6,
  },

  "sri-yantra": {
    id: "sri-yantra",
    name: "Sri Yantra",
    slug: "sri-yantra",
    category: "pattern",
    title: "Sri Yantra",
    description:
      "Sacred Hindu geometry representing the union of divine masculine and feminine energies",
    relatedBy: {
      property: [
        "shiva-shakti",
        "cosmic union",
        "tantric",
        "creation and manifestation",
      ],
    },
    images: getPatternHeroImage("sri-yantra"),
    featured: true,
    order: 7,
  },

  "star-tetrahedron": {
    id: "star-tetrahedron",
    name: "Star Tetrahedron",
    slug: "star-tetrahedron",
    category: "pattern",
    title: "Star Tetrahedron",
    description:
      "Two interlocking tetrahedrons forming a three-dimensional Star of David, representing the union of spirit and matter",
    aliases: ["Merkaba", "Merkavah", "Light Body"],
    relatedBy: {
      property: [
        "3D star of david",
        "masculine-feminine balance",
        "dimensional gateway",
        "light body",
        "vehicle of ascension",
        "spirit-matter union",
        "counter-rotating fields",
      ],
    },
    images: getPatternHeroImage("star-tetrahedron"),
    featured: true,
    order: 8,
  },

  "golden-ratio": {
    id: "golden-ratio",
    name: "Golden Ratio",
    slug: "golden-ratio",
    category: "pattern",
    title: "Golden Ratio",
    description:
      "Divine proportion (φ ≈ 1.618) that appears throughout nature and sacred architecture",
    relatedBy: {
      property: [
        "phi φ ≈ 1.618",
        "divine proportion",
        "fibonacci",
        "natural growth",
        "harmony",
        "beauty",
      ],
    },
    images: {
      heroImage: `/images/geometries/patterns/golden-ratio/golden-ratio-spiral.svg`,
    },
    featured: true,
    order: 9,
  },

  "philosophers-stone": {
    id: "philosophers-stone",
    name: "Philosopher's Stone",
    slug: "philosophers-stone",
    category: "pattern",
    title: "Philosopher's Stone",
    description:
      "Ancient alchemical symbol representing spiritual transformation and the union of opposites",
    relatedBy: {
      property: [
        "alchemy",
        "transformation",
        "union of opposites",
        "spiritual transmutation",
        "squared circle",
        "matter and spirit",
        "magnum opus",
      ],
    },
    images: getPatternHeroImage("philosophers-stone"),
    featured: true,
    order: 10,
  },

  pentagram: {
    id: "pentagram",
    name: "Pentagram",
    slug: "pentagram",
    category: "pattern",
    title: "Pentagram",
    description:
      "Five-pointed star embodying the golden ratio and representing the human form",
    relatedBy: {
      property: [
        "golden ratio",
        "microcosm",
        "human form",
        "protection",
        "pentacle",
        "phi ratio",
      ],
    },
    images: getPatternHeroImage("pentagram"),
    featured: true,
    order: 11,
  },

  torus: {
    id: "torus",
    name: "Torus",
    slug: "torus",
    category: "pattern",
    title: "Torus",
    description:
      "The fundamental pattern of energy flow in the universe, a self-sustaining donut-shaped vortex found from atoms to galaxies",
    relatedBy: {
      property: [
        "energy flow",
        "toroidal field",
        "self-sustaining",
        "vortex dynamics",
        "universal pattern",
        "circulation",
        "zero point",
        "magnetic field",
      ],
    },
    images: getPatternHeroImage("torus"),
    featured: true,
    order: 12,
  },

  "tree-of-life": {
    id: "tree-of-life",
    name: "Tree of Life",
    slug: "tree-of-life",
    category: "pattern",
    title: "Tree of Life",
    description:
      "Ancient Kabbalistic diagram of ten spheres and twenty-two paths representing the structure of creation and the path of spiritual ascent",
    relatedBy: {
      property: [
        "kabbalah",
        "spiritual ascent",
        "divine emanations",
        "four worlds",
        "pillars of creation",
      ],
    },
    images: getPatternHeroImage("tree-of-life"),
    featured: true,
    order: 13,
  },

  "vector-equilibrium": {
    id: "vector-equilibrium",
    name: "Vector Equilibrium",
    slug: "vector-equilibrium",
    category: "pattern",
    title: "Vector Equilibrium",
    description:
      "The only geometry where the radius equals the edge length, representing perfect equilibrium and the balance of forces in the universe",
    relatedBy: {
      property: [
        "cuboctahedron",
        "perfect equilibrium",
        "isotropic vector matrix",
        "buckminster fuller",
        "zero point",
        "balanced forces",
        "equal vectors",
      ],
    },
    images: {
      heroImage: `/images/geometries/patterns/vector-equilibrum/vector-equilibrum-primary.svg`,
    },
    featured: true,
    order: 14,
  },

  "64-tetrahedron": {
    id: "64-tetrahedron",
    name: "64 Tetrahedron Grid",
    slug: "64-tetrahedron",
    category: "pattern",
    title: "64 Tetrahedron Grid",
    description:
      "A fractal geometric structure of 64 interlocking tetrahedra forming a perfect stellated sphere, representing the fundamental pattern of the quantum vacuum and the geometry of consciousness",
    relatedBy: {
      property: [
        "fractal structure",
        "quantum vacuum",
        "zero-point field",
        "consciousness geometry",
        "I Ching",
        "DNA codons",
        "merkaba field",
        "nassim haramein",
      ],
    },
    images: getPatternHeroImage("64-tetrahedron"),
    featured: true,
    order: 15,
  },

  // ============================================================================
  // ADDITIONAL GEOMETRIES (for completeness of relationships)
  // ============================================================================

  triangle: {
    id: "triangle",
    name: "Triangle",
    slug: "triangle",
    category: "pattern",
    description:
      "The fundamental polygon, representing trinity and stability",
    relatedBy: {
      property: [
        "trinity",
        "stability",
        "fundamental shape",
        "divine masculine/feminine",
      ],
    },
  },

  "fibonacci-spiral": {
    id: "fibonacci-spiral",
    name: "Fibonacci Spiral",
    slug: "fibonacci-spiral",
    category: "pattern",
    description: "Logarithmic spiral based on the Fibonacci sequence",
    relatedBy: {
      property: [
        "fibonacci sequence",
        "golden ratio",
        "natural growth",
        "phi spiral",
        "expansion",
      ],
    },
  },
};
