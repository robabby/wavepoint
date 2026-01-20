# Content Directory

This directory contains MDX content files for sacred geometry pages. Content is separated from the core geometry data model to allow for flexible, maintainable page-specific content.

The project uses a **unified MDX content system** for both Platonic Solids and Sacred Patterns, providing rich narrative content with React components.

## Structure

```
src/content/
├── platonic-solids/   # MDX content for the 5 Platonic Solids
│   ├── tetrahedron.mdx
│   ├── hexahedron.mdx
│   ├── octahedron.mdx
│   ├── dodecahedron.mdx
│   └── icosahedron.mdx
└── patterns/   # MDX content for 17+ Patterns
    ├── circle-dot.mdx
    ├── vesica-piscis.mdx
    ├── flower-of-life.mdx
    ├── seed-of-life.mdx
    ├── fruit-of-life.mdx
    ├── egg-of-life.mdx
    ├── germ-of-life.mdx
    ├── pentagram.mdx
    ├── philosophers-stone.mdx
    ├── sri-yantra.mdx
    ├── star-tetrahedron.mdx
    ├── metatrons-cube.mdx
    ├── tree-of-life.mdx
    ├── torus.mdx
    ├── vector-equilibrium.mdx
    ├── 64-tetrahedron.mdx
    └── golden-ratio.mdx
```

## MDX Schema for Platonic Solids

### Basic Structure

```mdx
---
slug: tetrahedron        # Must match geometry slug from data model
---

<Section>
## Symbolic Properties

In the language of sacred geometry, the tetrahedron speaks of **fire and transformation**. With only four faces, it represents the minimum number of surfaces needed to enclose space.

**Key Associations:**

- **Fire and transformation**, the spark of creation
- **Stability through tension**, like a tripod that never wobbles
- **The Solar Plexus Chakra**, our center of personal power
- **The number 4**, representing foundation and structure
</Section>

<Section>
## Mathematical Insights

The tetrahedron embodies the principle of **minimal complexity**. With its 4 faces, 4 vertices, and 6 edges, it is the simplest possible polyhedron.

Every vertex connects to every other vertex—a complete graph in three dimensions.
</Section>

<Section>
## In Nature and Culture

The tetrahedral form appears throughout nature:

- **Chemistry:** The carbon atom in methane (CH₄) forms a perfect tetrahedron
- **Crystals:** Diamond's crystal structure is based on tetrahedral geometry
- **Engineering:** The pyramid form provides maximum strength with minimum material
- **Symbolism:** Represents the element of fire in Greek philosophy
</Section>
```

### Content Sections

Platonic Solid MDX files typically contain three sections:

1. **Symbolic Properties**: Spiritual/symbolic meaning, chakra associations, element associations
2. **Mathematical Insights**: Geometric properties, duality, mathematical significance
3. **In Nature and Culture**: Real-world examples, applications, cultural significance

## MDX Schema for Sacred Patterns

### Basic Structure

```mdx
---
slug: flower-of-life   # Must match geometry slug from data model
sections:              # Optional: table of contents metadata
  - title: "Construction & Geometry"
    id: "construction"
  - title: "The Patterns Within"
    id: "patterns"
---

<Section>
## Construction & Geometry

The Flower of Life is created through a simple yet profound geometric process:

1. **The First Circle:** Begin with a single circle representing unity
2. **The Vesica Piscis:** Draw a second circle of equal size
3. **The Seed of Life:** Continue adding circles in the pattern

This pattern is composed of perfect circles in a hexagonal arrangement.
</Section>

<Section>
## The Patterns Within

The Flower of Life contains numerous other sacred geometric patterns:

- **Seed of Life:** The first seven circles
- **Fruit of Life:** Thirteen circles forming Metatron's Cube
- **Tree of Life:** The Kabbalistic diagram of divine emanation
- **Platonic Solids:** All five perfect solids can be derived from the pattern
</Section>
```

## MDX Components

Both content systems use custom MDX components defined in `src/components/mdx-components.tsx`:

- **`<Section>`** - Wraps content in styled Card components (blue gradient with amber border)
- **`h2`, `h3`** - Styled headings (amber colors, responsive sizing)
- **`p`** - Styled paragraphs (blue text, proper spacing)
- **`ul`, `ol`, `li`** - Styled lists (blue text with spacing)
- **`strong`** - Bold text (amber color for emphasis)

## Loading Content

### Platonic Solids

```typescript
import { getPlatonicSolidContent } from '@/lib/content';

// Load MDX content for a Platonic Solid
const content = await getPlatonicSolidContent('tetrahedron');
// Returns: { slug: string, content: React.ReactElement }
```

### Sacred Patterns

```typescript
import { getPatternContent } from '@/lib/content';

// Load MDX content for a Sacred Pattern
const content = await getPatternContent('flower-of-life');
// Returns: { slug: string, sections?: Array, content: React.ReactElement }
```

## Rendering Content

Both content types are rendered the same way:

```typescript
export default async function Page({ params }: { params: { slug: string } }) {
  const geometry = getGeometryBySlug(params.slug);
  const mdxContent = await getPlatonicSolidContent(params.slug);
  // or: await getPatternContent(params.slug)

  if (!geometry) notFound();

  return (
    <main>
      <h1>{geometry.title}</h1>
      <p>{geometry.description}</p>

      {/* Render MDX content */}
      {mdxContent?.content}
    </main>
  );
}
```

## Editing Guidelines

### General Guidelines (Both Systems)

- **Slug consistency**: Must match geometry slug from data model (`src/lib/data/`)
- **Markdown formatting**: Use `**bold**`, *italic*, lists, links
- **Section components**: Wrap major content sections in `<Section>`
- **Natural language**: Write engaging, narrative content
- **Frontmatter**: Always include `slug` field

### Platonic Solid Content Guidelines

- **Consistent structure**: Use the three-section format (Symbolic, Mathematical, Nature)
- **Concise content**: Keep sections focused and readable
- **Key associations**: Use bulleted lists with bold keywords
- **Real-world examples**: Provide specific, concrete examples

### Sacred Pattern Content Guidelines

- **Longer narrative**: More detailed, exploratory content
- **Multiple sections**: 3-5 sections per pattern typical
- **Section metadata**: Optionally include `sections` array in frontmatter for navigation
- **Rich formatting**: Use ordered lists, nested bullets, internal links

## Content vs Data Model

### Data Model (`src/lib/data/`)
Contains structural geometry data:
- Names, descriptions, slugs
- Mathematical properties (faces, vertices, edges)
- Relationships (contains, appearsIn, dual)
- Element associations
- Image paths
- `order: number` - Integer for sorting (1, 2, 3...)

### Content Files (MDX)
Contains presentational narrative content:
- Symbolic meanings and associations
- Mathematical insights and explanations
- Historical and cultural context
- Natural examples and applications
- Teaching and exploration narratives

This separation allows:
- ✅ Geometry structure changes without touching content
- ✅ Content updates without code deployments
- ✅ Version control for both structure and narrative
- ✅ Unified, maintainable MDX system

## Adding New Content

### 1. Add geometry to data model
```typescript
// src/lib/data/platonic-solids.ts or sacred-patterns.ts
{
  id: "new-geometry",
  slug: "new-geometry",
  name: "New Geometry",
  // ... other properties
}
```

### 2. Create MDX content file
```bash
# Create file matching slug
touch src/content/platonic-solids/new-geometry.mdx
# or
touch src/content/patterns/new-geometry.mdx
```

### 3. Write content
Follow the schema and guidelines above for your content type.

### 4. Test
```bash
pnpm dev
# Navigate to /platonic-solids/new-geometry or /patterns/new-geometry
```

## Additional Resources

- **Content loading**: `src/lib/content/`
- **MDX components**: `src/components/mdx-components.tsx`
- **Section wrapper**: `src/components/mdx-section.tsx`
- **Data model**: `src/lib/data/`
- **Page templates**: `src/app/[category]/[slug]/page.tsx`
