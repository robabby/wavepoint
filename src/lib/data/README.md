# Sacred Geometry Data Model

This module provides a comprehensive data model for sacred geometry relationships and helper functions for querying these connections.

## Overview

The data model includes:
- **5 Platonic Solids**: Tetrahedron, Hexahedron (Cube), Octahedron, Dodecahedron, Icosahedron
- **6 Main Sacred Patterns**: Flower of Life, Seed of Life, Metatron's Cube, Sri Yantra, Merkaba, Golden Ratio
- **Additional Geometries**: Vesica Piscis, Star Tetrahedron, Triangle, Tree of Life, Pentagram, Fibonacci Spiral

## Data Structure

### Types

```typescript
type GeometryCategory = 'platonic' | 'pattern';

interface Geometry {
  id: string;
  name: string;
  slug: string;
  category: GeometryCategory;
  description?: string;
  dual?: string; // geometry id (for Platonic solids)
  contains?: string[]; // geometries found within this one
  appearsIn?: string[]; // geometries where this appears
  relatedBy?: {
    element?: 'fire' | 'earth' | 'air' | 'water' | 'ether';
    chakra?: string;
    property?: string[];
  };
}
```

## Usage Examples

### Basic Queries

```typescript
import {
  getGeometryById,
  getGeometryBySlug,
  getPlatonicSolids,
  getPatterns
} from "@/lib/data";

// Get a specific geometry by ID
const tetrahedron = getGeometryById('tetrahedron');

// Get a geometry by slug (useful for dynamic routes)
const geometry = getGeometryBySlug('flower-of-life');

// Get all Platonic Solids
const solids = getPlatonicSolids();

// Get all Sacred Patterns
const patterns = getPatterns();
```

### Relationship Queries

```typescript
import {
  getDual,
  getRelatedGeometries,
  getContainedGeometries
} from "@/lib/data";

// Get the dual of a Platonic solid
const dual = getDual('hexahedron'); // Returns octahedron

// Get all related geometries
const relations = getRelatedGeometries('metatrons-cube');
// Returns: {
//   dual: undefined,
//   contains: [tetrahedron, hexahedron, octahedron, dodecahedron, icosahedron],
//   appearsIn: [flower-of-life]
// }

// Get contained geometries
const contained = getContainedGeometries('star-tetrahedron');
// Returns: [tetrahedron]
```

### Filter by Properties

```typescript
import {
  getGeometriesByElement,
  getGeometriesByCategory,
  searchGeometries
} from "@/lib/data";

// Get geometries by element
const fireGeometries = getGeometriesByElement('fire');
// Returns: [tetrahedron]

// Get geometries by category
const patterns = getGeometriesByCategory('pattern');
// Returns: [flower-of-life, seed-of-life, metatrons-cube, sri-yantra, star-tetrahedron, golden-ratio, ...]

// Search geometries
const results = searchGeometries('creation');
// Returns all geometries with "creation" in name, description, or properties
```

### Direct Access

```typescript
import { GEOMETRIES } from "@/lib/data";

// Direct access to the complete catalog
const allGeometries = GEOMETRIES;

// Access a specific geometry
const cube = GEOMETRIES['hexahedron'];
```

## Relationship Types

### Platonic Solid Duality

Each Platonic solid has a dual:
- **Tetrahedron** ↔ Tetrahedron (self-dual)
- **Hexahedron (Cube)** ↔ Octahedron
- **Dodecahedron** ↔ Icosahedron

### Contains Relationship

Indicates geometries found within another:
- **Metatron's Cube** contains all 5 Platonic Solids
- **Merkaba** contains Tetrahedron and Star Tetrahedron
- **Flower of Life** contains Seed of Life, Vesica Piscis, Tree of Life

### Appears In Relationship

Indicates where a geometry appears:
- All **Platonic Solids** appear in Metatron's Cube
- **Tetrahedron** appears in Metatron's Cube, Merkaba, and Star Tetrahedron
- **Golden Ratio** appears in Fibonacci Spiral, Pentagram, and Dodecahedron

### Element Associations

Platonic solids are associated with classical elements:
- **Fire**: Tetrahedron
- **Earth**: Hexahedron (Cube)
- **Air**: Octahedron
- **Water**: Icosahedron
- **Ether**: Dodecahedron

## Helper Functions Reference

| Function | Description | Returns |
|----------|-------------|---------|
| `getGeometryById(id)` | Get a geometry by ID | `Geometry \| undefined` |
| `getGeometryBySlug(slug)` | Get a geometry by slug (for URL routing) | `Geometry \| undefined` |
| `getGeometriesByCategory(category)` | Get all geometries in a category | `Geometry[]` |
| `getDual(geometryId)` | Get the dual of a Platonic solid | `Geometry \| undefined` |
| `getContainedGeometries(geometryId)` | Get geometries contained within | `Geometry[]` |
| `getAppearsInGeometries(geometryId)` | Get geometries where this appears | `Geometry[]` |
| `getRelatedGeometries(geometryId)` | Get all relationships | `{ dual?, contains, appearsIn }` |
| `getGeometriesByElement(element)` | Get geometries by element | `Geometry[]` |
| `getPlatonicSolids()` | Get all Platonic solids | `Geometry[]` |
| `getPatterns()` | Get all sacred patterns | `Geometry[]` |
| `getAllGeometries()` | Get all geometries | `Geometry[]` |
| `searchGeometries(query)` | Search by name/description/properties | `Geometry[]` |

## Example: Dynamic Route with Slug

This is the recommended pattern for creating dynamic geometry pages:

```typescript
// File: app/platonic-solids/[slug]/page.tsx

import { getGeometryBySlug, getRelatedGeometries } from "@/lib/data";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function GeometryPage({ params }: PageProps) {
  const geometry = getGeometryBySlug(params.slug);

  if (!geometry) {
    notFound();
  }

  const { dual, contains, appearsIn } = getRelatedGeometries(geometry.id);

  return (
    <div>
      <h1>{geometry.name}</h1>
      <p>{geometry.description}</p>

      {geometry.relatedBy?.element && (
        <div>Element: {geometry.relatedBy.element}</div>
      )}

      {dual && (
        <section>
          <h2>Dual Geometry</h2>
          <a href={`/platonic-solids/${dual.slug}`}>{dual.name}</a>
        </section>
      )}

      {contains.length > 0 && (
        <section>
          <h2>Contains</h2>
          <ul>
            {contains.map(g => (
              <li key={g.id}>
                <a href={`/${g.category === 'platonic' ? 'platonic-solids' : 'patterns'}/${g.slug}`}>
                  {g.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

## Example: Building a Related Content Component

```typescript
import { getRelatedGeometries, getGeometryBySlug } from "@/lib/data";

function RelatedGeometries({ slug }: { slug: string }) {
  const geometry = getGeometryBySlug(slug);
  if (!geometry) return null;

  const { dual, contains, appearsIn } = getRelatedGeometries(geometry.id);

  return (
    <div>
      <h2>Related to {geometry.name}</h2>

      {dual && (
        <section>
          <h3>Dual</h3>
          <p>{dual.name}</p>
        </section>
      )}

      {contains.length > 0 && (
        <section>
          <h3>Contains</h3>
          <ul>
            {contains.map(g => <li key={g.id}>{g.name}</li>)}
          </ul>
        </section>
      )}

      {appearsIn.length > 0 && (
        <section>
          <h3>Appears In</h3>
          <ul>
            {appearsIn.map(g => <li key={g.id}>{g.name}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
```

## Extending the Data Model

To add new geometries:

1. Add the geometry to the `GEOMETRIES` object in `geometries.ts`
2. Include all required fields: `id`, `name`, `slug`, `category`
3. Add optional relationships: `dual`, `contains`, `appearsIn`, `relatedBy`
4. Update related geometries to reference the new one

Example:

```typescript
'new-geometry': {
  id: 'new-geometry',
  name: 'New Geometry',
  slug: 'new-geometry',
  category: 'pattern',
  description: 'Description here',
  appearsIn: ['metatrons-cube'],
  relatedBy: {
    property: ['property1', 'property2']
  }
}
```
