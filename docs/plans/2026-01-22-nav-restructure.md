# WavePoint Navigation & Routing Restructure

## Overview

Mature WavePoint's navigation to reflect its evolution from Sacred Geometry-only to a platform covering Geometry, Angel Numbers, and Signal.

## Decisions Made

| Question | Decision |
|----------|----------|
| Signal in nav | Feature-flag gated (same as now, just in header) |
| Geometries dropdown | Simple: 2 links (Platonic Solids, Patterns) |
| Hero search | Visual trigger → opens Cmd+K modal |
| Hub cards | Rich: include 2-3 featured items per card |
| Implementation | 3 Phased PRs |

---

## PR 1: Data Layer & Redirects

**Branch:** `sg-XXX-nav-restructure-data-layer`
**Risk:** Low
**Status:** Complete

### Files Modified

**`src/lib/data/helpers.ts`** - Updated path functions:
```typescript
getGeometryPath()     → /geometries/platonic-solids/{slug}
getGeometryListPath() → /geometries/platonic-solids
```

**`src/util/routes.ts`** - Restructured paths:
```
platonicSolids.path: "/geometries/platonic-solids"
patterns.path: "/geometries/patterns"
+ Added: geometries: { path: "/geometries" }
```

**`next.config.js`** - Added redirects:
```javascript
/platonic-solids     → /geometries/platonic-solids
/platonic-solids/:slug → /geometries/platonic-solids/:slug
/patterns            → /geometries/patterns
/patterns/:slug      → /geometries/patterns/:slug
```

### Verification
- [x] `pnpm check` passes
- [x] `pnpm build` succeeds

---

## PR 2: Route Migration

**Branch:** `sg-XXX-nav-restructure-routes`
**Risk:** Medium
**Status:** Complete

### File Moves

```
src/app/page.tsx → src/app/geometries/page.tsx
src/app/platonic-solids/* → src/app/geometries/platonic-solids/*
src/app/patterns/* → src/app/geometries/patterns/*
```

Old directories deleted.

### Placeholder Homepage

**`src/app/page.tsx`** - Temporary redirect to `/geometries` until PR 3.

### Updated References

- `src/app/sitemap.ts` - Updated URLs to `/geometries/*`
- `src/components/geometry-navigation.test.tsx` - Updated expected paths

### Verification
- [x] All `/geometries/*` routes accessible
- [x] Redirects work: `/platonic-solids` → `/geometries/platonic-solids`
- [x] Sitemap shows new URLs
- [x] `pnpm check` passes
- [x] `pnpm test` passes (12/12)
- [x] `pnpm build` succeeds

---

## PR 3: Navigation UI & New Homepage

**Branch:** `sg-XXX-nav-restructure-ui`
**Risk:** Medium-High
**Status:** Pending

### Header Changes (`src/components/header.tsx`)

Nav items become: **Numbers | Geometries ▼ | Signal | Shop**

- Remove "Platonic Solids" and "Patterns" from flat nav
- Add `<GeometriesDropdown />` component
- Add Signal link (feature-flag gated via `useCanAccessSignal()`)
- Mobile: Show all links expanded (no dropdown)

### New Component: `src/components/geometries-dropdown.tsx`

**Trigger:**
- Text "Geometries" + ChevronDown icon
- Active state: gold text + animated underline (like existing nav links)
- Active when `pathname.startsWith('/geometries')`

**Dropdown Content:**
- Glass background matching mobile drawer aesthetic
- Gold border, subtle shadow
- Two menu items with hover states:
  - "Platonic Solids" → `/geometries/platonic-solids`
  - "Patterns" → `/geometries/patterns`
- Subtle separator between items
- Uses existing `DropdownMenu` from `src/components/ui/dropdown-menu.tsx`

### UserMenu (`src/components/auth/user-menu.tsx`)

Remove Signal link (moved to main nav).

### New Homepage (`src/app/page.tsx`)

**Hero Section:**
- Animated geometric background (existing `AnimatedHero` pattern)
- Bold headline: "WAVE" + gold "POINT" (similar to current "SACRED GEOMETRY" treatment)
- Subheading: "Explore the language of the universe"
- Search trigger styled as a floating search bar:
  - Glass background (`backdrop-blur`, gold border)
  - Search icon + placeholder: "Search patterns, numbers, geometries..."
  - ⌘K hint badge
  - Subtle glow on hover
  - Click dispatches `keydown` event to open SearchCommand modal

**Hub Section:** 3 asymmetric cards with staggered entrance:

| Card | Icon | Headline | Featured Items | CTA |
|------|------|----------|----------------|-----|
| Geometries | `CircleDot` | Sacred Geometry | Tetrahedron, Flower of Life, Golden Ratio (images) | Explore → |
| Numbers | `Hash` | Angel Numbers | 111, 222, 333 (styled number badges) | Discover → |
| Signal | `Sparkles` | Signal | "Track your number sightings" | Get Started → |

**Card Design:**
- Use existing `AnimatedCard` component
- Each card: icon + heading + 3 featured items + CTA button
- Featured items: small thumbnails/badges that link to detail pages
- Staggered entrance with `StaggerChildren`
- Gold accent border on hover with glow effect

### Verification
- [ ] Dropdown works (click, keyboard nav, active state)
- [ ] Mobile nav shows expanded links
- [ ] Signal visible in nav when enabled
- [ ] New homepage renders correctly
- [ ] Search trigger opens modal
- [ ] Hub cards link to correct destinations
- [ ] `pnpm check && pnpm build` succeeds

---

## Deployment Strategy

1. Merge PR 1 (don't deploy alone)
2. Merge PR 2, deploy PR 1+2 together
3. Merge and deploy PR 3 independently

---

## Critical Files Summary

| File | PR | Change |
|------|-----|--------|
| `src/lib/data/helpers.ts` | 1 | Update paths |
| `src/util/routes.ts` | 1 | Restructure |
| `next.config.js` | 1 | Add redirects |
| `src/app/geometries/page.tsx` | 2 | Move homepage |
| `src/app/geometries/platonic-solids/*` | 2 | Move routes |
| `src/app/geometries/patterns/*` | 2 | Move routes |
| `src/app/sitemap.ts` | 2 | Update URLs |
| `src/components/header.tsx` | 3 | Dropdown + Signal |
| `src/components/geometries-dropdown.tsx` | 3 | New component |
| `src/components/auth/user-menu.tsx` | 3 | Remove Signal |
| `src/app/page.tsx` | 3 | New homepage |

---

## Success Criteria

- [x] Zero broken links (redirects handle old URLs)
- [x] All redirects return 308 (permanent)
- [ ] Geometries dropdown functional
- [ ] Signal in main nav (feature-flag gated)
- [ ] New homepage with search trigger + 3 hub cards
- [ ] Mobile nav works correctly
- [x] Sitemap updated
- [x] All tests pass
