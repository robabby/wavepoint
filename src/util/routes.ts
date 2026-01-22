export const ROUTES = {
  home: {
    name: "Home",
    path: "/",
    description: "Welcome to the world of sacred geometry",
    order: 0,
  },
  geometries: {
    name: "Geometries",
    path: "/geometries",
    description: "Explore sacred geometry patterns and forms",
    order: 2,
  },
  platonicSolids: {
    name: "Platonic Solids",
    path: "/geometries/platonic-solids",
    description: "The five perfect forms from which all matter emerges",
    order: 2,
    children: {
      tetrahedron: {
        name: "Tetrahedron",
        path: "/geometries/platonic-solids/tetrahedron",
        description:
          "The simplest Platonic solid, symbolizing fire and balance.",
        order: 1,
      },
      hexahedron: {
        name: "Hexahedron (Cube)",
        path: "/geometries/platonic-solids/hexahedron",
        description: "Represents earth, stability, and groundedness.",
        order: 2,
      },
      octahedron: {
        name: "Octahedron",
        path: "/geometries/platonic-solids/octahedron",
        description: "Symbolizes air, intellect, and communication.",
        order: 3,
      },
      dodecahedron: {
        name: "Dodecahedron",
        path: "/geometries/platonic-solids/dodecahedron",
        description:
          "Associated with the universe, spirit, and higher consciousness.",
        order: 4,
      },
      icosahedron: {
        name: "Icosahedron",
        path: "/geometries/platonic-solids/icosahedron",
        description: "Represents water, emotion, and fluidity.",
        order: 5,
      },
    },
  },
  numbers: {
    name: "Numbers",
    path: "/numbers",
    description: "Explore the meanings behind repeating number patterns",
    order: 1,
  },
  patterns: {
    name: "Patterns",
    path: "/geometries/patterns",
    description: "Infinite geometries that encode universal principles",
    order: 3,
    children: {
      circleDot: {
        name: "Circle Dot",
        path: "/geometries/patterns/circle-dot",
        description:
          "The primordial symbol of unity and creation, representing the divine spark and the beginning of all form",
        order: 1,
      },
      vesicaPiscis: {
        name: "Vesica Piscis",
        path: "/geometries/patterns/vesica-piscis",
        description:
          "The intersection of two circles, representing duality and the portal of creation",
        order: 2,
      },
      seedOfLife: {
        name: "Seed of Life",
        path: "/geometries/patterns/seed-of-life",
        description:
          "Seven circles in perfect symmetry, representing the seven days of creation",
        order: 3,
      },
      fruitOfLife: {
        name: "Fruit of Life",
        path: "/geometries/patterns/fruit-of-life",
        description:
          "Thirteen circles extracted from the Flower of Life, representing the blueprint of the universe",
        order: 4,
      },
      flowerOfLife: {
        name: "Flower of Life",
        path: "/geometries/patterns/flower-of-life",
        description:
          "Ancient symbol of creation consisting of overlapping circles representing the fundamental forms of space and time",
        order: 5,
      },
      metatronsCube: {
        name: "Metatron's Cube",
        path: "/geometries/patterns/metatrons-cube",
        description:
          "Contains all five Platonic Solids and represents the geometric pattern of the universe",
        order: 6,
      },
      sriYantra: {
        name: "Sri Yantra",
        path: "/geometries/patterns/sri-yantra",
        description:
          "Sacred Hindu geometry representing the union of divine masculine and feminine energies",
        order: 7,
      },
      starTetrahedron: {
        name: "Star Tetrahedron",
        path: "/geometries/patterns/star-tetrahedron",
        description:
          "Two interlocking tetrahedrons forming a three-dimensional Star of David, representing the union of spirit and matter",
        order: 8,
      },
      goldenRatio: {
        name: "Golden Ratio",
        path: "/geometries/patterns/golden-ratio",
        description:
          "Divine proportion (φ ≈ 1.618) that appears throughout nature and sacred architecture",
        order: 9,
      },
      philosophersStone: {
        name: "Philosopher's Stone",
        path: "/geometries/patterns/philosophers-stone",
        description:
          "Ancient alchemical symbol representing spiritual transformation and the union of opposites",
        order: 10,
      },
      pentagram: {
        name: "Pentagram",
        path: "/geometries/patterns/pentagram",
        description:
          "Five-pointed star embodying the golden ratio and representing the human form",
        order: 11,
      },
    },
  },
  faq: {
    name: "FAQ",
    path: "/faq",
    description: "Frequently asked questions about sacred geometry",
    order: 4,
  },
  contact: {
    name: "Contact",
    path: "/contact",
    description: "Get in touch with the WavePoint team",
    order: 5,
  },
};
