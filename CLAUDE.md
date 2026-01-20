# CLAUDE.md

## Project Overview

T3 Stack Next.js 16 app for sacred geometry. Uses App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (New York style), Radix UI Themes (dark default), MDX content via `next-mdx-remote`, React Query (server state), Vitest, Stripe (checkout), and Printful (print-on-demand).

## Commands

```bash
pnpm dev          # Dev server (Turbopack)
pnpm check        # Lint + typecheck
pnpm lint:fix     # ESLint auto-fix
pnpm test         # Vitest
pnpm build        # Production build
```

## Directory Structure

```
src/app/                    # App Router pages
src/app/shop/               # Shop pages (listing, [slug], success, cancel)
src/app/api/                # API routes (checkout, webhooks)
src/components/ui/          # shadcn/ui components
src/components/geometry/    # Geometry-specific components
src/components/shop/        # Shop UI components (cart, product cards, etc.)
src/components/signal/      # Signal UI components (NumberPad, cards, etc.)
src/lib/data/               # Data model (geometries + products)
src/lib/shop/               # Shop: Printful API, Stripe, cart, feature flags
src/lib/signal/             # Signal: Claude API, meanings, feature flags
src/hooks/signal/           # Signal React Query hooks
src/app/signal/             # Signal pages (dashboard, capture, sighting)
src/app/api/signal/         # Signal API routes (sightings, interpret, stats)
src/lib/content/            # MDX content loaders
src/content/                # MDX files (platonic-solids/, patterns/)
src/util/routes.ts          # Top-level routing only (NOT geometry links)
src/env.js                  # Env validation (Zod)
docs/plans/                 # Implementation plans (YYYY-MM-DD-<topic>.md)
docs/prds/                  # Product Requirements Documents (scope, decisions, journeys)
docs/ux/                    # UX guidelines (personas, patterns, voice & tone)
```

## Key Patterns

- **Imports**: Use `@/*` for `src/` (e.g., `import { cn } from "@/lib/utils"`)
- **Styling**: `cn()` merges classes via clsx + tailwind-merge
- **Theme**: `<Theme appearance="dark">` in root layout
- **Env vars**: Define in `src/env.js`, prefix client vars with `NEXT_PUBLIC_`

## Data Model (`src/lib/data/`)

Modular architecture with auto-computed relationships:

| File | Purpose |
|------|---------|
| `index.ts` | Main exports |
| `geometries.types.ts` | TypeScript interfaces |
| `platonic-solids.ts` | 5 Platonic solids |
| `patterns.ts` | 17+ patterns |
| `relationships.ts` | `CONTAINS_GRAPH` & `DUAL_GRAPH` (single source of truth) |
| `helpers.ts` | Query functions |

**Key Functions:**
- `getGeometryBySlug(slug)` - Primary for dynamic routes
- `getRelatedGeometries(id)` - Returns `{ dual, contains, appearsIn }`
- `getPlatonicSolids()` / `getPatterns()` - Sorted lists
- `getGeometryPath(geometry)` - Generate URL path
- `getNextGeometry(id, category)` / `getPreviousGeometry(id, category)`

**Adding Geometries:** Add to `platonic-solids.ts` or `patterns.ts`, then add relationships to `relationships.ts`. Inverse relationships auto-compute.

## Dynamic Routes

Both use same pattern:
- `app/platonic-solids/[slug]/page.tsx` - Uses `getGeometryBySlug()` + `getPlatonicSolidContent()`
- `app/patterns/[slug]/page.tsx` - Uses `getGeometryBySlug()` + `getPatternContent()`

## MDX Content

Content in `src/content/{platonic-solids,patterns}/`. Uses `<Section>` component for styling.

```mdx
---
slug: tetrahedron
---
<Section>
## Symbolic Properties
Content here...
</Section>
```

## Navigation

Use `<GeometryNavigation currentSlug={slug} category="platonic|pattern" />` at bottom of geometry pages.

## Shop Integration (`src/lib/shop/`)

| File | Purpose |
|------|---------|
| `printful.ts` | Printful API client with ISR caching (1hr revalidation) |
| `stripe.ts` | Stripe checkout session creation |
| `cart-context.tsx` | React Context for cart state + localStorage persistence |
| `feature-flags.ts` | `isShopEnabled()` for production feature gating |
| `types.ts` | TypeScript interfaces for products, variants, cart |

**Products** (`src/lib/data/products.ts`): Marketing data (name, tagline, description) mapped to Printful sync product IDs. Variant pricing/availability fetched from Printful at build time.

**Key Functions:**
- `getProductWithVariants(product)` - Hydrates product with Printful data
- `createCheckoutSession(items)` - Creates Stripe checkout session
- `useCart()` - Cart hook with add/remove/update/clear actions

## Product Images

**Directory Structure:**
```
mockups/                              # Source mockups from Printful (not committed)
public/images/shop/{product-slug}/    # Production images served by Next.js
```

**Image Naming Convention:**
```
thumbnail.png                    # Product card thumbnail
{size}-front-{n}.png            # Front view mockups (e.g., 3x3-front-1.png)
{size}-lifestyle-{n}.png        # Lifestyle mockups (e.g., 3x3-lifestyle-1.png)
{size}-detail-{n}.png           # Detail/close-up shots
```

**Local Images Config** (`products.ts`):
```typescript
localImages: {
  thumbnail: "/images/shop/product-slug/thumbnail.png",
  includeApiImage: true,  // Show Printful image first, then local images
  variants: {
    '3″×3″': [            // Use Unicode: ″ (U+2033) not " (U+0022)
      "/images/shop/product-slug/3x3-front-1.png",
      "/images/shop/product-slug/3x3-lifestyle-1.png",
    ],
  },
},
```

**Image Modes:**
| Mode | `includeApiImage` | Behavior |
|------|-------------------|----------|
| Replace | `false` / omitted | Local images replace Printful mockups entirely |
| Append | `true` | Printful image shown first, local images follow in gallery |

**Adding Product Images:**
1. Download mockups from Printful dashboard to `mockups/{product-type}/{geometry}/`
2. Create `public/images/shop/{product-slug}/` directory
3. Copy and rename images following naming convention
4. Add `localImages` config to product definition in `products.ts`
5. **Critical**: Variant keys must match Printful API exactly (use `″` and `×` Unicode characters)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PRINTFUL_API_KEY` | Printful API token |
| `STRIPE_SECRET_KEY` | Stripe server key (`sk_*`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification (`whsec_*`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client key (`pk_*`) |
| `NEXT_PUBLIC_SHOP_ENABLED` | Feature flag (`true`/`false`, default: `false`) |
| `NEXT_PUBLIC_SIGNAL_ENABLED` | Signal feature flag (`true`/`false`, default: `false`) |
| `ANTHROPIC_API_KEY` | Claude API key for Signal interpretations |
| `APP_URL` | Base URL for Stripe redirects (default: `http://localhost:3000`) |

## Signal Integration (`src/lib/signal/`)

| File | Purpose |
|------|---------|
| `index.ts` | Main exports |
| `feature-flags.ts` | `isSignalEnabled()` for feature gating |
| `schemas.ts` | Zod validation schemas |
| `claude.ts` | Claude API client with timeout/fallback |
| `meanings.ts` | Base angel number meanings |
| `rate-limit.ts` | Rate limiting for API routes |
| `types.ts` | TypeScript interfaces |

**Key Functions:**
- `isSignalEnabled()` - Feature flag check
- `getBaseMeaning(sequence)` - Get angel number meaning
- `generateInterpretation(...)` - Generate Claude interpretation with fallback

**Hooks** (`src/hooks/signal/`):
- `useSightings()` - List/create/delete sightings
- `useSighting(id)` - Single sighting query
- `useInterpretation()` - AI interpretation mutation
- `useStats()` - User statistics query

## Development Workflow

- **Feature implementations**: Use `/feature-dev:feature-dev` skill for guided feature development with codebase understanding and architecture focus
- **Prefer agents**: For multi-step implementations, use the Task tool with specialized agents (`feature-dev:code-architect`, `feature-dev:code-explorer`, `feature-dev:code-reviewer`) to parallelize work and maintain focus
- **Sub-agent model**: All sub-agents must use Claude Opus (`model: "opus"`)
- **Code review**: After implementations, use `feature-dev:code-reviewer` agent to review for bugs, security issues, and adherence to project conventions

## PRDs

Product Requirements Documents live in `docs/prds/`. Reference when making product decisions during implementation.

| Feature | PRD | Status |
|---------|-----|--------|
| Signal | `docs/prds/signal.md` | In Development |

**PRD contents:** Scope boundaries, key decisions, user journeys (as flows), edge cases, success metrics. Implementation details live in `docs/plans/`.

## Business Context

Deeper product and business context lives in Obsidian (accessible via MCP):

| Resource | Location | Use For |
|----------|----------|---------|
| Full PRDs | `Areas/Metatron Collective/PRDs/` | Product rationale, research, full user journeys |
| KPIs & Metrics | `Areas/Metatron Collective/Metrics/` | Success definitions, weekly reviews |
| Decisions | `Areas/Metatron Collective/Decisions/` | Historical context on why we chose X |
| AI Methodology | `Areas/AI/Collaboration/Methodology.md` | How we work together |

Reference when making strategic decisions or needing "why" context beyond implementation scope.

## UX Guidelines

UX resources live in `docs/ux/`. Reference these when designing features, writing UI copy, or making decisions about user experience.

**Brand positioning:** "Modern mystic" — sophisticated spirituality for people who meditate but also read design blogs.

| Document | Use For |
|----------|---------|
| `docs/ux/personas.md` | Understanding who we design for |
| `docs/ux/design-principles.md` | Decision-making guardrails |
| `docs/ux/voice-and-tone.md` | Writing copy (pair with `elements-of-style:writing-clearly-and-concisely`) |
| `docs/ux/user-journeys.md` | Designing flows, understanding emotional arcs |
| `docs/ux/interaction-patterns.md` | Reusable UI patterns (empty states, loading, errors) |
| `docs/ux/content-guidelines.md` | Writing about geometry and spirituality |

**Key principles:** Grounded over Grandiose, Invitation over Instruction, Quiet Confidence, Respect the Intelligence, Private by Default, Craft over Content.

## Linear Integration

- **Project**: Metatron Collective
- **Team**: Sherpa
- **Prefix**: `SG-`
- **Branch format**: `sg-<issue-number>-<slugified-title>`
- **Commits**: Reference issue ID (e.g., `SG-74: Add typography`)
- **Auto-close**: Issues are automatically marked Done when their branch is merged—rarely mark items Done manually
