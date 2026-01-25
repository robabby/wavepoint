# Synthesis Framework Design v1

**Purpose**: Define the knowledge graph architecture connecting Sacred Geometry, Numerology, and Astrology for WavePoint's personalized interpretation engine.

**Audience**: Development team implementing `src/lib/synthesis/`

**Last Updated**: 2026-01-24

---

## Table of Contents

1. [Overview](#overview)
2. [Knowledge Graph Structure](#knowledge-graph-structure)
3. [Node Definitions](#node-definitions)
4. [Edge Definitions](#edge-definitions)
5. [TypeScript Interface Design](#typescript-interface-design)
6. [Query Interface Design](#query-interface-design)
7. [Extension Points](#extension-points)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

### The Synthesis Vision

WavePoint connects three ancient systems through their shared foundation: **Elements**.

```
Sacred Geometry          Numerology              Astrology
     |                       |                       |
     v                       v                       v
 Platonic Solids -----> Elements <----- Zodiac Signs
     |                       |                       |
     v                       v                       v
  Tetrahedron  <-----> Fire <-----> Aries/Leo/Sagittarius
      Cube     <-----> Earth <----> Taurus/Virgo/Capricorn
  Octahedron   <-----> Air <-----> Gemini/Libra/Aquarius
  Icosahedron  <-----> Water <---> Cancer/Scorpio/Pisces
 Dodecahedron  <-----> Ether <----> (Transcendence)
```

### Design Principles

1. **Element-Centric**: Elements are the universal bridge between all three systems
2. **Confidence-Aware**: Every edge has a confidence level based on traditional agreement
3. **Extensible**: New edges can be added without restructuring
4. **Queryable**: Support complex queries for interpretation context
5. **Learnable**: Framework can incorporate user resonance feedback over time

---

## Knowledge Graph Structure

### Node Types

The graph contains six primary node types:

| Node Type | Count | Source | Example |
|-----------|-------|--------|---------|
| `Geometry` | 5 | Static | Tetrahedron, Cube |
| `Element` | 5 | Static | Fire, Earth, Air, Water, Ether |
| `Planet` | 9 | Static | Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune |
| `Number` | 10 | Static | 0-9 (base digits) |
| `ZodiacSign` | 12 | Static | Aries through Pisces |
| `House` | 12 | Static | 1st House through 12th House |

**Phase 2 Node Types** (future):
- `Aspect`: Conjunction, Opposition, Trine, Square, Sextile
- `Pattern`: Number patterns (111, 222, etc.) as first-class nodes
- `Transit`: Time-bound planetary events

### Edge Overview

Edges connect nodes with typed, weighted relationships:

```
┌─────────────┐         rules          ┌─────────────┐
│   Planet    │ ───────────────────>   │ ZodiacSign  │
└─────────────┘                        └─────────────┘
      │                                       │
      │ resonates_with (digit)                │ belongs_to (element)
      │                                       │
      v                                       v
┌─────────────┐     expresses_as       ┌─────────────┐
│   Number    │ <───────────────────>  │   Element   │
└─────────────┘                        └─────────────┘
                                              │
                                              │ manifests_as
                                              v
                                       ┌─────────────┐
                                       │  Geometry   │
                                       └─────────────┘
```

---

## Node Definitions

### Geometry Nodes

```typescript
type GeometryNode = {
  type: "geometry";
  id: "tetrahedron" | "cube" | "octahedron" | "icosahedron" | "dodecahedron";
  name: string;
  faces: number;
  element: ElementId;
  properties: string[]; // ["transformation", "spark", "will"]
};
```

**Static Data** (from `src/lib/numbers/planetary.ts`):

| ID | Name | Faces | Element |
|----|------|-------|---------|
| `tetrahedron` | Tetrahedron | 4 | Fire |
| `cube` | Cube (Hexahedron) | 6 | Earth |
| `octahedron` | Octahedron | 8 | Air |
| `icosahedron` | Icosahedron | 20 | Water |
| `dodecahedron` | Dodecahedron | 12 | Ether |

### Element Nodes

```typescript
type ElementNode = {
  type: "element";
  id: "fire" | "earth" | "air" | "water" | "ether";
  name: string;
  quality: string;
  direction: string;
  geometryId: GeometryId;
};
```

**Static Data**:

| ID | Name | Quality | Direction | Geometry |
|----|------|---------|-----------|----------|
| `fire` | Fire | Transformation, will, action | South | Tetrahedron |
| `earth` | Earth | Stability, manifestation, grounding | North | Cube |
| `air` | Air | Intellect, communication, movement | East | Octahedron |
| `water` | Water | Emotion, intuition, flow | West | Icosahedron |
| `ether` | Ether (Spirit) | Transcendence, unity, cosmos | Center | Dodecahedron |

### Planet Nodes

```typescript
type PlanetNode = {
  type: "planet";
  id: Planet; // from planetary.ts
  name: string;
  symbol: string;
  element: ElementId;
  digit: number; // Primary associated digit
  dayOfWeek?: string;
  archetype: string;
  beneficMalefic: "benefic" | "malefic" | "variable";
};
```

**Static Data** (from `PLANET_META` in `planetary.ts`):

| ID | Symbol | Element | Digit | Day | Archetype | Nature |
|----|--------|---------|-------|-----|-----------|--------|
| `sun` | ☉ | Fire | 1 | Sunday | The King/Leader | Variable |
| `moon` | ☽ | Water | 2 | Monday | The Mother/Intuitive | Variable |
| `jupiter` | ♃ | Ether | 3 | Thursday | The Sage/Benefactor | Benefic |
| `uranus` | ⛢ | Air | 4 | - | The Revolutionary/Awakener | Variable |
| `mercury` | ☿ | Air | 5 | Wednesday | The Messenger/Trickster | Variable |
| `venus` | ♀ | Earth | 6 | Friday | The Lover/Artist | Benefic |
| `neptune` | ♆ | Water | 7 | - | The Mystic/Dreamer | Variable |
| `saturn` | ♄ | Earth | 8 | Saturday | The Elder/Teacher | Malefic |
| `mars` | ♂ | Fire | 9 | Tuesday | The Warrior/Champion | Malefic |

### Number Nodes

```typescript
type NumberNode = {
  type: "number";
  id: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  planetId: Planet | null; // null for 0
  element: ElementId;
  traits: string[];
  confidence: ConfidenceLevel;
};
```

**Static Data** (from `DIGIT_PLANETARY_META`):

| Digit | Planet | Element | Confidence | Traits |
|-------|--------|---------|------------|--------|
| 0 | - | Ether | - | potential, void, infinity, source |
| 1 | Sun | Fire | Very High | leadership, initiative, individuality |
| 2 | Moon | Water | Very High | intuition, emotion, receptivity |
| 3 | Jupiter | Ether | High | expansion, wisdom, optimism |
| 4 | Uranus | Earth | Moderate | disruption, innovation, structure |
| 5 | Mercury | Air | High | communication, adaptability, intellect |
| 6 | Venus | Earth | High | love, beauty, harmony |
| 7 | Neptune | Water | Moderate | spirituality, mysticism, transcendence |
| 8 | Saturn | Earth | Very High | discipline, karma, time |
| 9 | Mars | Fire | Very High | action, courage, energy |

### Zodiac Sign Nodes

```typescript
type ZodiacSignNode = {
  type: "zodiacSign";
  id: ZodiacSign;
  name: string;
  symbol: string;
  element: ElementId;
  modality: "cardinal" | "fixed" | "mutable";
  rulingPlanet: Planet;
  traditionalRuler?: Planet; // For signs with modern/traditional split
};
```

**Static Data**:

| ID | Symbol | Element | Modality | Ruler | Traditional |
|----|--------|---------|----------|-------|-------------|
| `aries` | ♈ | Fire | Cardinal | Mars | - |
| `taurus` | ♉ | Earth | Fixed | Venus | - |
| `gemini` | ♊ | Air | Mutable | Mercury | - |
| `cancer` | ♋ | Water | Cardinal | Moon | - |
| `leo` | ♌ | Fire | Fixed | Sun | - |
| `virgo` | ♍ | Earth | Mutable | Mercury | - |
| `libra` | ♎ | Air | Cardinal | Venus | - |
| `scorpio` | ♏ | Water | Fixed | Mars | Pluto (modern) |
| `sagittarius` | ♐ | Fire | Mutable | Jupiter | - |
| `capricorn` | ♑ | Earth | Cardinal | Saturn | - |
| `aquarius` | ♒ | Air | Fixed | Saturn | Uranus (modern) |
| `pisces` | ♓ | Water | Mutable | Jupiter | Neptune (modern) |

### House Nodes

```typescript
type HouseNode = {
  type: "house";
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  name: string; // "1st House", "2nd House"
  lifeArea: string;
  keywords: string[];
  naturalSign: ZodiacSign; // Sign that "naturally" rules this house
  element: ElementId; // Via natural sign
};
```

**Static Data**:

| House | Life Area | Keywords | Natural Sign | Element |
|-------|-----------|----------|--------------|---------|
| 1 | Self | Identity, appearance, first impressions | Aries | Fire |
| 2 | Resources | Money, possessions, values | Taurus | Earth |
| 3 | Communication | Siblings, learning, writing | Gemini | Air |
| 4 | Home | Family, roots, emotional security | Cancer | Water |
| 5 | Creativity | Romance, children, self-expression | Leo | Fire |
| 6 | Service | Health, daily work, routines | Virgo | Earth |
| 7 | Partnership | Marriage, contracts, one-on-one | Libra | Air |
| 8 | Transformation | Death/rebirth, intimacy, occult | Scorpio | Water |
| 9 | Philosophy | Higher education, travel, religion | Sagittarius | Fire |
| 10 | Career | Public image, achievement, authority | Capricorn | Earth |
| 11 | Community | Friends, groups, humanitarian ideals | Aquarius | Air |
| 12 | Transcendence | Unconscious, solitude, dreams | Pisces | Water |

---

## Edge Definitions

### Edge Type Overview

| Edge Type | Source | Target | Bidirectional | Weight Range |
|-----------|--------|--------|---------------|--------------|
| `resonates_with` | Number | Planet | Yes | 8-10 |
| `expresses_element` | Number | Element | Yes | 7-10 |
| `manifests_as` | Element | Geometry | Yes | 10 |
| `rules` | Planet | ZodiacSign | No | 10 |
| `exalts_in` | Planet | ZodiacSign | No | 8 |
| `detriment_in` | Planet | ZodiacSign | No | 6 |
| `falls_in` | Planet | ZodiacSign | No | 6 |
| `belongs_to_element` | ZodiacSign | Element | Yes | 10 |
| `has_modality` | ZodiacSign | Modality | No | 10 |
| `naturally_rules` | ZodiacSign | House | Yes | 8 |
| `activates` | Transit | Number | No | Variable |

### Edge: `resonates_with` (Number <-> Planet)

The foundational edge connecting numerology to astrology.

```typescript
type ResonatesWithEdge = {
  type: "resonates_with";
  sourceType: "number";
  targetType: "planet";
  sourceId: number; // 1-9
  targetId: Planet;
  bidirectional: true;
  confidence: ConfidenceLevel;
  weight: number; // 8-10
  traditions: string[]; // ["Vedic", "Chaldean", "Lo Shu"]
};
```

**Edge Instances**:

| Number | Planet | Confidence | Weight | Traditions |
|--------|--------|------------|--------|------------|
| 1 | Sun | Very High | 10 | Vedic, Chaldean, Lo Shu, Western |
| 2 | Moon | Very High | 10 | Vedic, Chaldean, Lo Shu, Kabbalah |
| 3 | Jupiter | High | 9 | Vedic, Chaldean, Lo Shu |
| 4 | Uranus | Moderate | 7 | Vedic (Rahu), Modern Western |
| 5 | Mercury | High | 9 | Vedic, Chaldean, Lo Shu center |
| 6 | Venus | High | 9 | Vedic, Chaldean, Lo Shu |
| 7 | Neptune | Moderate | 7 | Vedic (Ketu), Modern Western |
| 8 | Saturn | Very High | 10 | Vedic, Chaldean, Lo Shu, Kabbalah |
| 9 | Mars | Very High | 10 | Vedic, Chaldean, Lo Shu, Kabbalah |

### Edge: `expresses_element` (Number <-> Element)

Numbers express elemental qualities via their planetary association.

```typescript
type ExpressesElementEdge = {
  type: "expresses_element";
  sourceType: "number";
  targetType: "element";
  sourceId: number;
  targetId: ElementId;
  bidirectional: true;
  weight: number; // Derived from planet-element relationship
};
```

**Edge Instances**:

| Number | Element | Weight | Derivation |
|--------|---------|--------|------------|
| 0 | Ether | 8 | Pure potential, cosmic void |
| 1 | Fire | 10 | Sun = Fire |
| 2 | Water | 10 | Moon = Water |
| 3 | Ether | 9 | Jupiter = Ether |
| 4 | Earth | 8 | Uranus (modern) or Rahu = Earth/Air |
| 5 | Air | 10 | Mercury = Air |
| 6 | Earth | 10 | Venus = Earth |
| 7 | Water | 9 | Neptune = Water |
| 8 | Earth | 10 | Saturn = Earth |
| 9 | Fire | 10 | Mars = Fire |

### Edge: `manifests_as` (Element <-> Geometry)

The Platonic element-geometry correspondence.

```typescript
type ManifestsAsEdge = {
  type: "manifests_as";
  sourceType: "element";
  targetType: "geometry";
  sourceId: ElementId;
  targetId: GeometryId;
  bidirectional: true;
  weight: 10; // Always maximum - this is foundational
  source: "Platonic tradition";
};
```

**Edge Instances** (1:1 mapping):

| Element | Geometry | Note |
|---------|----------|------|
| Fire | Tetrahedron | 4 triangular faces, sharp, transformative |
| Earth | Cube | 6 square faces, stable, grounding |
| Air | Octahedron | 8 triangular faces, dual of cube |
| Water | Icosahedron | 20 triangular faces, flowing |
| Ether | Dodecahedron | 12 pentagonal faces, cosmic |

### Edge: `rules` (Planet -> ZodiacSign)

Planetary rulership (domicile).

```typescript
type RulesEdge = {
  type: "rules";
  sourceType: "planet";
  targetType: "zodiacSign";
  sourceId: Planet;
  targetId: ZodiacSign;
  bidirectional: false;
  weight: 10;
  traditional: boolean; // Modern rulers have traditional=false
};
```

**Edge Instances**:

| Planet | Rules | Traditional |
|--------|-------|-------------|
| Sun | Leo | Yes |
| Moon | Cancer | Yes |
| Mercury | Gemini, Virgo | Yes |
| Venus | Taurus, Libra | Yes |
| Mars | Aries, Scorpio* | Yes (*traditional) |
| Jupiter | Sagittarius, Pisces* | Yes (*traditional) |
| Saturn | Capricorn, Aquarius* | Yes (*traditional) |
| Uranus | Aquarius | No (modern) |
| Neptune | Pisces | No (modern) |

### Edge: `exalts_in` (Planet -> ZodiacSign)

Exaltation dignities.

```typescript
type ExaltsInEdge = {
  type: "exalts_in";
  sourceType: "planet";
  targetType: "zodiacSign";
  sourceId: Planet;
  targetId: ZodiacSign;
  bidirectional: false;
  weight: 8;
};
```

**Edge Instances**:

| Planet | Exalts In |
|--------|-----------|
| Sun | Aries |
| Moon | Taurus |
| Mercury | Virgo |
| Venus | Pisces |
| Mars | Capricorn |
| Jupiter | Cancer |
| Saturn | Libra |

### Edge: `detriment_in` / `falls_in` (Planet -> ZodiacSign)

Challenging dignities (lower weight, still relevant for interpretation).

**Detriment Instances** (opposite of domicile):

| Planet | Detriment In |
|--------|--------------|
| Sun | Aquarius |
| Moon | Capricorn |
| Mercury | Sagittarius, Pisces |
| Venus | Aries, Scorpio |
| Mars | Taurus, Libra |
| Jupiter | Gemini, Virgo |
| Saturn | Cancer, Leo |

**Fall Instances** (opposite of exaltation):

| Planet | Falls In |
|--------|----------|
| Sun | Libra |
| Moon | Scorpio |
| Mercury | Pisces |
| Venus | Virgo |
| Mars | Cancer |
| Jupiter | Capricorn |
| Saturn | Aries |

### Edge: `belongs_to_element` (ZodiacSign <-> Element)

Sign-element correspondence.

```typescript
type BelongsToElementEdge = {
  type: "belongs_to_element";
  sourceType: "zodiacSign";
  targetType: "element";
  sourceId: ZodiacSign;
  targetId: ElementId;
  bidirectional: true;
  weight: 10;
};
```

**Edge Instances**:

| Element | Signs |
|---------|-------|
| Fire | Aries, Leo, Sagittarius |
| Earth | Taurus, Virgo, Capricorn |
| Air | Gemini, Libra, Aquarius |
| Water | Cancer, Scorpio, Pisces |

### Edge: `naturally_rules` (ZodiacSign <-> House)

Natural house rulership (Aries = 1st, Taurus = 2nd, etc.).

```typescript
type NaturallyRulesEdge = {
  type: "naturally_rules";
  sourceType: "zodiacSign";
  targetType: "house";
  sourceId: ZodiacSign;
  targetId: number; // 1-12
  bidirectional: true;
  weight: 8;
};
```

**Edge Instances** (sequential):

| Sign | House |
|------|-------|
| Aries | 1 |
| Taurus | 2 |
| Gemini | 3 |
| Cancer | 4 |
| Leo | 5 |
| Virgo | 6 |
| Libra | 7 |
| Scorpio | 8 |
| Sagittarius | 9 |
| Capricorn | 10 |
| Aquarius | 11 |
| Pisces | 12 |

---

## TypeScript Interface Design

### Core Interfaces

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// NODE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NodeType =
  | "geometry"
  | "element"
  | "planet"
  | "number"
  | "zodiacSign"
  | "house";

export type ConfidenceLevel = "very-high" | "high" | "moderate" | "low";

export interface BaseNode {
  type: NodeType;
  id: string;
  name: string;
}

export interface GeometryNode extends BaseNode {
  type: "geometry";
  id: GeometryId;
  faces: number;
  elementId: ElementId;
  properties: string[];
}

export interface ElementNode extends BaseNode {
  type: "element";
  id: ElementId;
  quality: string;
  direction: string;
  geometryId: GeometryId;
}

export interface PlanetNode extends BaseNode {
  type: "planet";
  id: Planet;
  symbol: string;
  elementId: ElementId;
  digit: number;
  dayOfWeek?: string;
  archetype: string;
  nature: "benefic" | "malefic" | "variable";
}

export interface NumberNode extends BaseNode {
  type: "number";
  id: number; // 0-9
  planetId: Planet | null;
  elementId: ElementId;
  traits: string[];
  confidence: ConfidenceLevel;
}

export interface ZodiacSignNode extends BaseNode {
  type: "zodiacSign";
  id: ZodiacSign;
  symbol: string;
  elementId: ElementId;
  modality: "cardinal" | "fixed" | "mutable";
  rulingPlanetId: Planet;
  traditionalRulerId?: Planet;
}

export interface HouseNode extends BaseNode {
  type: "house";
  id: number; // 1-12
  lifeArea: string;
  keywords: string[];
  naturalSignId: ZodiacSign;
  elementId: ElementId;
}

export type SynthesisNode =
  | GeometryNode
  | ElementNode
  | PlanetNode
  | NumberNode
  | ZodiacSignNode
  | HouseNode;

// ═══════════════════════════════════════════════════════════════════════════
// EDGE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type EdgeType =
  | "resonates_with"
  | "expresses_element"
  | "manifests_as"
  | "rules"
  | "exalts_in"
  | "detriment_in"
  | "falls_in"
  | "belongs_to_element"
  | "has_modality"
  | "naturally_rules"
  | "activates"; // For transits (Phase 2)

export interface SynthesisEdge {
  /** Unique identifier for this edge */
  id: string;
  /** Edge type */
  type: EdgeType;
  /** Source node type */
  sourceType: NodeType;
  /** Source node ID */
  sourceId: string;
  /** Target node type */
  targetType: NodeType;
  /** Target node ID */
  targetId: string;
  /** Whether traversal works both directions */
  bidirectional: boolean;
  /** Edge weight (0-10, higher = stronger connection) */
  weight: number;
  /** Confidence in this relationship */
  confidence?: ConfidenceLevel;
  /** Supporting traditions/sources */
  traditions?: string[];
  /** Additional context for interpretation */
  context?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// GRAPH STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════

export interface SynthesisGraph {
  /** All nodes indexed by composite key (type:id) */
  nodes: Map<string, SynthesisNode>;
  /** All edges indexed by ID */
  edges: Map<string, SynthesisEdge>;
  /** Adjacency list: nodeKey -> [edgeIds] */
  adjacency: Map<string, string[]>;
  /** Reverse adjacency for bidirectional traversal */
  reverseAdjacency: Map<string, string[]>;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUERY TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SynthesisQuery {
  /** Starting nodes for the query */
  seeds: Array<{ type: NodeType; id: string }>;
  /** Maximum traversal depth */
  maxDepth?: number;
  /** Edge types to follow */
  edgeTypes?: EdgeType[];
  /** Minimum edge weight to traverse */
  minWeight?: number;
  /** Node types to include in results */
  targetTypes?: NodeType[];
}

export interface SynthesisResult {
  /** Nodes discovered during traversal */
  nodes: SynthesisNode[];
  /** Edges traversed */
  edges: SynthesisEdge[];
  /** Paths from seeds to each result node */
  paths: Array<{
    node: SynthesisNode;
    path: SynthesisEdge[];
    totalWeight: number;
  }>;
  /** Synthesis narrative (for Claude prompts) */
  narrative: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PATTERN-LEVEL QUERIES
// ═══════════════════════════════════════════════════════════════════════════

export interface PatternSynthesisQuery {
  /** The number pattern (e.g., "444", "1111") */
  pattern: string;
  /** User's spiritual profile (optional) */
  profile?: SpiritualProfile;
  /** Current transits (optional) */
  transits?: Transit[];
  /** Query context */
  context?: "interpretation" | "pattern_page" | "dashboard";
}

export interface PatternSynthesisResult extends SynthesisResult {
  /** Pattern-specific analysis */
  patternMeta: {
    /** Dominant digit */
    dominantDigit: number;
    /** Primary planet */
    primaryPlanet: Planet;
    /** Primary element */
    primaryElement: ElementId;
    /** Associated geometry */
    geometry?: GeometryId;
    /** All elements present */
    elements: ElementId[];
    /** All planets present */
    planets: Planet[];
  };
  /** User-specific connections (if profile provided) */
  personalConnections?: {
    /** Signs in user's chart that relate to this pattern */
    relatedSigns: ZodiacSign[];
    /** Houses activated by this pattern's planets */
    activatedHouses: number[];
    /** How pattern element aligns with user's element balance */
    elementAlignment: "harmonious" | "complementary" | "challenging";
    /** Specific transit activations */
    transitActivations: Transit[];
  };
}
```

### Spiritual Profile Interface

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// SPIRITUAL PROFILE (from astrology-domain-guide.md)
// ═══════════════════════════════════════════════════════════════════════════

export type ZodiacSign =
  | "aries" | "taurus" | "gemini" | "cancer"
  | "leo" | "virgo" | "libra" | "scorpio"
  | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  house?: number; // Only if birth time known
  retrograde: boolean;
}

export interface ElementBalance {
  fire: number;   // Count of planets in fire signs
  earth: number;
  air: number;
  water: number;
  dominant: ElementId;
  lacking: ElementId | null;
}

export interface Transit {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  aspectsToNatal: Array<{
    natalPlanet: Planet;
    aspectType: "conjunction" | "opposition" | "trine" | "square" | "sextile";
    orb: number;
  }>;
}

export interface SpiritualProfile {
  userId: string;

  // Birth data
  birthDate: Date;
  birthTime?: string; // HH:mm
  birthTimeApproximate: boolean;
  birthLocation: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };

  // Calculated chart
  chart: {
    sunSign: ZodiacSign;
    sunDegree: number;
    moonSign: ZodiacSign;
    moonDegree: number;
    risingSign?: ZodiacSign;
    risingDegree?: number;
    planets: PlanetPosition[];
    houses?: number[]; // Degree of each house cusp
  };

  // Analysis
  analysis: {
    elementBalance: ElementBalance;
    modalityBalance: {
      cardinal: number;
      fixed: number;
      mutable: number;
    };
    dominantPlanets: Planet[];
  };

  // User feedback (Phase 3)
  resonanceHistory?: Array<{
    pattern: string;
    resonanceScore: number; // 1-5
    timestamp: Date;
  }>;
}
```

---

## Query Interface Design

### Query Functions

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// SYNTHESIS SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export interface SynthesisService {
  /**
   * Get synthesis context for a number pattern.
   * Primary use case for Signal interpretations.
   *
   * @example
   * const result = await synthesis.getPatternSynthesis({
   *   pattern: "444",
   *   profile: userProfile,
   *   transits: currentTransits,
   * });
   */
  getPatternSynthesis(query: PatternSynthesisQuery): PatternSynthesisResult;

  /**
   * Find nodes connected to given seeds.
   * General-purpose graph traversal.
   *
   * @example
   * const result = synthesis.findConnected({
   *   seeds: [{ type: "element", id: "fire" }],
   *   targetTypes: ["zodiacSign", "number"],
   *   maxDepth: 2,
   * });
   */
  findConnected(query: SynthesisQuery): SynthesisResult;

  /**
   * Get resonant patterns for a spiritual profile.
   * Used for "Your Numbers" recommendations.
   *
   * @example
   * const patterns = synthesis.getResonantPatterns(profile);
   * // Returns patterns that align with user's chart
   */
  getResonantPatterns(profile: SpiritualProfile): string[];

  /**
   * Get activated patterns for current transits.
   * Used for "Today's Numbers" features.
   *
   * @example
   * const activated = synthesis.getTransitActivatedPatterns(transits, profile);
   */
  getTransitActivatedPatterns(
    transits: Transit[],
    profile?: SpiritualProfile
  ): Array<{
    pattern: string;
    activatingTransit: Transit;
    resonanceStrength: number;
  }>;

  /**
   * Generate Claude prompt context from synthesis.
   * Used by Signal interpretation engine.
   */
  generatePromptContext(result: PatternSynthesisResult): string;
}
```

### Query Examples

#### Example 1: "Given number 444 and Sun in Capricorn, what synthesis?"

```typescript
const result = synthesis.getPatternSynthesis({
  pattern: "444",
  profile: {
    chart: {
      sunSign: "capricorn",
      // ... other chart data
    },
    analysis: {
      elementBalance: {
        fire: 2,
        earth: 5,  // Heavy earth
        air: 2,
        water: 1,
        dominant: "earth",
        lacking: "water",
      },
    },
  },
});

// Result includes:
// - 4 → Uranus/Rahu → Earth element → Cube geometry
// - Capricorn = Earth sign, ruled by Saturn (8)
// - Personal connection: 444's earth energy deeply resonates with
//   Capricorn Sun + heavy earth element balance
// - Narrative: "444 amplifies the earthy, structural energy you already
//   embody as a Capricorn. This is a message about foundations..."
```

#### Example 2: "Given element imbalance (heavy Earth), what patterns resonate?"

```typescript
const patterns = synthesis.getResonantPatterns({
  analysis: {
    elementBalance: {
      fire: 1,
      earth: 6,  // Heavy earth
      air: 2,
      water: 1,
      dominant: "earth",
      lacking: "fire",
    },
  },
});

// Returns earth-heavy patterns: 444, 666, 888, 4444, 6666, 8888
// Plus complementary fire patterns to balance: 111, 999
// With weights based on how well they serve the balance
```

#### Example 3: "Given Saturn transit, what numbers are activated?"

```typescript
const activated = synthesis.getTransitActivatedPatterns(
  [
    {
      planet: "saturn",
      sign: "pisces",
      degree: 15,
      aspectsToNatal: [
        { natalPlanet: "sun", aspectType: "square", orb: 2 },
      ],
    },
  ],
  userProfile
);

// Returns:
// - 888 (Saturn's number) - high activation
// - 8888 - very high activation (quadruple Saturn)
// - Numbers with 8 in them get Saturn transit activation
// - Profile-specific: if natal Sun is being squared, Sun-related
//   patterns (111) are also activated but with "challenging" flavor
```

### Prompt Context Generation

```typescript
/**
 * Generate interpretation context for Claude.
 * This is the key output for Signal integration.
 */
function generatePromptContext(result: PatternSynthesisResult): string {
  const lines: string[] = [];

  // Pattern fundamentals
  lines.push(`## Pattern: ${result.patternMeta.pattern}`);
  lines.push(`- Primary Planet: ${result.patternMeta.primaryPlanet}`);
  lines.push(`- Primary Element: ${result.patternMeta.primaryElement}`);
  if (result.patternMeta.geometry) {
    lines.push(`- Sacred Geometry: ${result.patternMeta.geometry}`);
  }

  // Personal connections (if profile provided)
  if (result.personalConnections) {
    lines.push(`\n## Personal Resonance`);

    const alignment = result.personalConnections.elementAlignment;
    if (alignment === "harmonious") {
      lines.push(`- This pattern's ${result.patternMeta.primaryElement} energy harmonizes with your chart.`);
    } else if (alignment === "complementary") {
      lines.push(`- This pattern offers balancing energy for your chart.`);
    } else {
      lines.push(`- This pattern presents growth opportunities through its ${result.patternMeta.primaryElement} energy.`);
    }

    if (result.personalConnections.relatedSigns.length > 0) {
      lines.push(`- Related to your placements in: ${result.personalConnections.relatedSigns.join(", ")}`);
    }

    if (result.personalConnections.activatedHouses.length > 0) {
      lines.push(`- Life areas activated: Houses ${result.personalConnections.activatedHouses.join(", ")}`);
    }
  }

  // Transit context
  if (result.personalConnections?.transitActivations.length) {
    lines.push(`\n## Current Transit Context`);
    for (const transit of result.personalConnections.transitActivations) {
      lines.push(`- ${transit.planet} transit amplifies this pattern's significance`);
    }
  }

  return lines.join("\n");
}
```

---

## Extension Points

### 1. User Resonance Feedback

The framework supports learning from user feedback to strengthen personal edges.

```typescript
interface ResonanceFeedback {
  userId: string;
  pattern: string;
  interpretationId: string;
  resonanceScore: 1 | 2 | 3 | 4 | 5;
  resonantElements?: string[]; // Which parts landed
  timestamp: Date;
}

interface PersonalEdgeWeight {
  userId: string;
  edgeId: string;
  baseWeight: number;
  personalModifier: number; // Learned from feedback
  effectiveWeight: number;  // base * modifier
  feedbackCount: number;
}

// Phase 3: Apply personalized weights
function getPersonalizedEdgeWeight(
  userId: string,
  edge: SynthesisEdge
): number {
  const personal = getPersonalEdgeWeight(userId, edge.id);
  if (personal && personal.feedbackCount >= 5) {
    return personal.effectiveWeight;
  }
  return edge.weight;
}
```

### 2. New Edge Discovery

The graph structure allows adding new edges without restructuring.

```typescript
// Example: Adding aspect edges (Phase 2)
const aspectEdge: SynthesisEdge = {
  id: "aspect_trine_fire",
  type: "harmonizes",
  sourceType: "zodiacSign",
  sourceId: "aries",
  targetType: "zodiacSign",
  targetId: "leo",
  bidirectional: true,
  weight: 8,
  context: "Trine aspect - natural flow between fire signs",
};

// Example: Adding pattern-to-pattern edges
const patternEdge: SynthesisEdge = {
  id: "pattern_111_999",
  type: "complements",
  sourceType: "pattern",
  sourceId: "111",
  targetType: "pattern",
  targetId: "999",
  bidirectional: true,
  weight: 9,
  context: "Beginning (1) and completion (9) in fire element",
};
```

### 3. Phase 2+ Additions

#### Houses (Phase 2)

```typescript
// Add house nodes and natural rulership edges
for (let i = 1; i <= 12; i++) {
  graph.addNode(houseNodes[i]);
  graph.addEdge({
    type: "naturally_rules",
    sourceType: "zodiacSign",
    sourceId: HOUSE_SIGN_MAP[i],
    targetType: "house",
    targetId: i,
    bidirectional: true,
    weight: 8,
  });
}

// House-based queries
function getPatternsForHouse(house: number): string[] {
  // 10th house (career) → Capricorn → Saturn → 8
  // Returns: 888, 8888, patterns with 8
}
```

#### Aspects (Phase 2)

```typescript
type AspectType =
  | "conjunction"
  | "opposition"
  | "trine"
  | "square"
  | "sextile";

interface AspectNode {
  type: "aspect";
  id: AspectType;
  angle: number;
  nature: "harmonious" | "challenging" | "neutral";
  orb: number;
}

// Aspect edges connect aspects to their interpretive qualities
// conjunction → fusion, intensification
// opposition → awareness, polarity
// trine → ease, natural talent
// square → tension, growth
// sextile → opportunity, cooperation
```

#### Transits (Phase 2)

```typescript
interface TransitEvent {
  planet: Planet;
  aspectType: AspectType;
  natalTarget: Planet | "ascendant" | "midheaven";
  startDate: Date;
  exactDate: Date;
  endDate: Date;
  orb: number;
}

// Transit-activated number queries
function getTransitActivatedNumbers(
  transits: TransitEvent[]
): Array<{
  number: number;
  activatingTransit: TransitEvent;
  strength: number;
}> {
  // Saturn transit → 8 patterns activated
  // Jupiter transit → 3 patterns activated
  // etc.
}
```

### 4. Machine Learning Integration (Phase 3+)

```typescript
interface LearnedEdge {
  sourceNodeKey: string;
  targetNodeKey: string;
  learnedWeight: number;
  confidence: number;
  trainingExamples: number;
  lastUpdated: Date;
}

// Aggregate resonance patterns to discover new edges
function discoverEdges(
  resonanceData: ResonanceFeedback[]
): LearnedEdge[] {
  // Analyze: "Users with Scorpio Sun who see 777 often rate high resonance"
  // Create learned edge: Scorpio → 7 with higher weight
}
```

---

## Implementation Roadmap

### Phase 1: Core Graph (Week 5-6)

1. **Define static data** (`src/lib/synthesis/data/`)
   - Export all node definitions
   - Export all edge definitions
   - Validate against existing `planetary.ts`

2. **Build graph structure** (`src/lib/synthesis/graph.ts`)
   - `SynthesisGraph` class with add/get methods
   - Adjacency list management
   - Node/edge indexing

3. **Implement core queries** (`src/lib/synthesis/queries.ts`)
   - `findConnected()` - BFS/DFS traversal
   - `getPatternSynthesis()` - pattern-specific synthesis
   - `generatePromptContext()` - Claude prompt generation

### Phase 1: Integration (Week 7-8)

4. **Integrate with Signal** (`src/lib/signal/claude.ts`)
   - Add synthesis context to interpretation prompts
   - A/B test synthesis-enhanced vs. base prompts

5. **Integrate with Numbers pages** (`src/app/numbers/[pattern]/`)
   - Display synthesis connections on pattern pages
   - Show element, geometry, planetary associations

### Phase 2: Astrology Integration (Week 11-14)

6. **Add house nodes and edges**
7. **Implement transit queries**
8. **Build spiritual profile integration**
9. **Enhanced personalization in interpretations**

### Phase 3: Learning Layer (Week 17-20)

10. **Implement resonance feedback collection**
11. **Build personal edge weight system**
12. **Create edge discovery pipeline**
13. **A/B test personalized vs. base weights**

---

## Testing Strategy

```typescript
// Unit tests for graph operations
describe("SynthesisGraph", () => {
  it("should traverse from number to geometry via element", () => {
    const result = graph.findConnected({
      seeds: [{ type: "number", id: "1" }],
      targetTypes: ["geometry"],
      maxDepth: 2,
    });
    expect(result.nodes).toContainEqual(
      expect.objectContaining({ id: "tetrahedron" })
    );
  });

  it("should find all fire-related nodes", () => {
    const result = graph.findConnected({
      seeds: [{ type: "element", id: "fire" }],
      maxDepth: 1,
    });
    // Should include: tetrahedron, sun, mars, 1, 9, aries, leo, sagittarius
    expect(result.nodes.length).toBe(8);
  });
});

// Integration tests for pattern synthesis
describe("getPatternSynthesis", () => {
  it("should synthesize 444 correctly", () => {
    const result = synthesis.getPatternSynthesis({ pattern: "444" });
    expect(result.patternMeta.primaryPlanet).toBe("uranus");
    expect(result.patternMeta.primaryElement).toBe("earth");
    expect(result.patternMeta.geometry).toBe("cube");
  });

  it("should include personal connections when profile provided", () => {
    const result = synthesis.getPatternSynthesis({
      pattern: "888",
      profile: capricornProfile,
    });
    expect(result.personalConnections?.elementAlignment).toBe("harmonious");
    expect(result.personalConnections?.relatedSigns).toContain("capricorn");
  });
});
```

---

## File Structure

```
src/lib/synthesis/
├── index.ts              # Public exports
├── types.ts              # All type definitions
├── graph.ts              # SynthesisGraph class
├── queries.ts            # Query implementations
├── prompt.ts             # Claude prompt generation
├── data/
│   ├── nodes/
│   │   ├── geometry.ts   # Geometry node data
│   │   ├── element.ts    # Element node data
│   │   ├── planet.ts     # Planet node data (from planetary.ts)
│   │   ├── number.ts     # Number node data
│   │   ├── zodiac.ts     # Zodiac sign node data
│   │   └── house.ts      # House node data
│   └── edges/
│       ├── number-planet.ts      # resonates_with edges
│       ├── element-geometry.ts   # manifests_as edges
│       ├── planet-sign.ts        # rules, exalts_in, etc.
│       └── sign-element.ts       # belongs_to_element edges
└── __tests__/
    ├── graph.test.ts
    ├── queries.test.ts
    └── integration.test.ts
```

---

## Summary

This Synthesis Framework provides:

1. **A typed knowledge graph** connecting Sacred Geometry, Numerology, and Astrology
2. **Element-centric bridging** as the universal connector between systems
3. **Confidence-aware edges** based on traditional agreement
4. **Queryable structure** for Signal interpretation context
5. **Extensible design** for Phase 2+ additions (houses, aspects, transits)
6. **Learning capability** for user resonance feedback

The framework transforms WavePoint from a simple angel number tracker into a personalized spiritual intelligence system with a defensible synthesis moat.

---

## Next Steps

1. **Review this document** with any questions or refinements
2. **Create `src/lib/synthesis/types.ts`** with the interface definitions
3. **Extract data** from existing `planetary.ts` into synthesis data files
4. **Implement `SynthesisGraph`** with basic traversal
5. **Integrate** with Signal interpretation prompts
