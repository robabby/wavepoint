# Numbers Section Design

Public content hub for number pattern meanings, with SEO optimization and Signal integration.

**Status:** Design Complete
**Date:** 2026-01-20

---

## Overview

Two sibling sections serve different purposes:

| Section | URL | Purpose | Access |
|---------|-----|---------|--------|
| Numbers | `/numbers` | Public content hub, SEO pages | Public |
| Signal | `/signal` | Personal tracking app | Authenticated |

Numbers provides the reference content. Signal provides the personal lens on that content.

---

## Naming Strategy

### The Problem

"Angel numbers" has strong SEO value but conflicts with our brand voice ("Grounded over Grandiose").

### The Solution

Acknowledge and reframe. Each page opens with "Often called angel numbers, these recurring sequences..." then pivots to our terminology:

- **"Number Patterns"** — for educational/content contexts
- **"Signals"** — for personal/tracking contexts

Example flow: "You've noticed a number pattern. What might this signal mean for you?"

---

## Content Scope

### Volume

Comprehensive coverage: 50-100+ pages targeting every meaningful number pattern.

| Category | Examples | Count |
|----------|----------|-------|
| Doubles | 11, 22, 33... 99 | 9 |
| Triples | 111, 222... 999 | 9 |
| Quads | 1111, 2222... 9999 | 9 |
| Sequential | 123, 234, 1234, 12345 | 10+ |
| Mirrored | 1221, 1331, 1441 | 10+ |
| Mixed | 1212, 1010, 2121 | 10+ |
| Master | 11, 22, 33 (overlap with doubles) | — |

### Page Structure

Each `/numbers/[pattern]` page includes:

1. **Core meaning** — 2-3 paragraphs on traditional interpretation
2. **Variations** — How context changes meaning (clock vs receipt vs license plate)
3. **Related patterns** — Links to related numbers (444 → 44 → 4444)
4. **Historical/cultural context** — Where this number appears in traditions
5. **Reflection prompts** — "When you see 444, consider asking yourself..." (invitation, not instruction)
6. **Signal CTA** — Gentle invite to track this pattern

### Content Architecture

```
src/lib/data/numbers.ts          # Structured data (meanings, keywords, relations)
src/content/numbers/444.mdx      # Rich prose extending data layer
src/components/numbers/          # Shared section components
```

Data layer enables:
- Signal's condensed meaning views
- Search and filtering
- Programmatic relationships

MDX layer provides:
- Full prose and cultural depth
- Custom sections per pattern
- Rich formatting

---

## Signal Tiering

### Free Tier

- Log sightings (number + optional note/mood)
- View base meanings (from Numbers content)
- Trends and heatmap visualization
- Personal history and notes
- No AI interpretations

### Paid Tier

- Everything in Free
- AI-powered interpretations (Claude)

### Future Paid Features (Not v1)

- Pattern synthesis ("You've seen 444 five times this month, always mornings...")
- Periodic digests (weekly/monthly AI summaries)
- Interpretation history (preserve past readings)
- Cross-number analysis ("Lots of 4-energy lately: 444, 44, 414...")

---

## Cross-Linking Strategy

### Numbers → Signal

- Each number page shows "Track this pattern" CTA
- Logged-in users see personal stats: "You've seen 444 three times"
- Stats appear inline, making content feel personalized

### Signal → Numbers

- After logging a sighting, show condensed meaning
- "Go deeper" link to full `/numbers/[pattern]` page
- Signal is the quick, contextual experience; Numbers is the reference

---

## Landing Page Design

### URL

`/numbers`

### Section 1: Hero — The Threshold

Full viewport, centered content. The input is the ritual moment.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      What did you notice?                       │
│                                                                 │
│                      ┌────────────────┐                         │
│                      │    4  4  4     │                         │
│                      └────────────────┘                         │
│                             ↵                                   │
│                                                                 │
│         Often called angel numbers, these recurring             │
│            sequences appear when you're paying                  │
│                       attention.                                │
│                                                                 │
│                            ↓                                    │
│                        explore                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Input behavior:**
- Large geometric/monospace font for digits
- Digits fade in with subtle scale animation (1.05 → 1.0)
- Gold pulsing cursor
- Max 6 digits
- On Enter, navigates to `/numbers/[input]`
- Invalid input: "We haven't written about this one yet."

**Motion:**
- Inner gold glow on focus (10% opacity)
- Scroll indicator gently bobs

### Section 2: Most Encountered

Curated grid of 8-12 high-traffic patterns.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Most encountered                                              │
│                                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │   111   │  │   222   │  │   333   │  │   444   │           │
│   │         │  │         │  │         │  │         │           │
│   │ New     │  │ Balance │  │ Growth  │  │ Stable  │           │
│   │ cycles  │  │ & trust │  │ & help  │  │ ground  │           │
│   └─────────┘  └─────────┘  └─────────┘  └─────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Card design:**
- Dark background with subtle 1px border
- Number large and centered, geometric font
- 2-3 word essence below, muted
- Hover: border brightens, subtle lift, faint gold glow on number

**Featured patterns:** 111, 222, 333, 444, 555, 666, 777, 888, 999, 1111, 1212, 1234

### Section 3: Browse All

Tabbed interface with compact grid.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Browse patterns                                               │
│                                                                 │
│   ┌──────────┬───────────┬──────────┬─────────┐                │
│   │ All      │ Repeating │ Sequence │ Mirror  │                │
│   └──────────┴───────────┴──────────┴─────────┘                │
│                                                                 │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│   │ 11  │ │ 22  │ │ 33  │ │ 44  │ │ 55  │ │ 66  │ │ 77  │     │
│   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tabs:**
- All — everything, sorted by popularity
- Repeating — 11, 22, 111, 222, 1111...
- Sequential — 123, 234, 1234...
- Mirrored — 1221, 1331, 1441...

**Compact cards:**
- Number only, no description
- 7-8 per row on desktop
- Hover reveals essence as tooltip

### Section 4: Signal CTA

Simple banner, not pushy.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│           Notice these patterns often?                          │
│                                                                 │
│     Signal helps you track what you see and find meaning        │
│                      over time.                                 │
│                                                                 │
│                   [ Start tracking ]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Logged-in variant:** "You've logged 12 patterns this month. View your signals →"

---

## Visual Design

### Typography

| Element | Treatment |
|---------|-----------|
| Numbers (large) | Geometric mono/display: Familjen Grotesk, Space Mono, or Anybody |
| Headlines | Match number font or site display font |
| Body | Site's existing body font |
| Essence words | Smaller, muted, body font |

### Color

| Element | Color |
|---------|-------|
| Background | Site dark base |
| Cards | Slightly elevated dark, subtle border |
| Numbers | Off-white / light gray |
| Hover states | Gold border, faint gold glow |
| Input focus | Gold inner glow, gold cursor |
| Muted text | Gray, ~60% opacity |

### Mobile

- Hero input uses device keyboard, styled to feel like NumberPad
- "Most encountered" becomes horizontal scroll
- Grid becomes 3-4 columns
- Tabs become horizontally scrollable pills

---

## Content Creation

### Approach

AI-assisted with human review. Claude generates drafts following voice and tone guidelines. Review for accuracy and brand consistency.

### Template

Each MDX file follows consistent structure:

```mdx
---
pattern: "444"
category: "repeating"
keywords: ["stability", "foundation", "protection"]
related: ["44", "4444", "414"]
---

<Section>
## What 444 Means
[Core meaning prose]
</Section>

<Section>
## When You See It
[Context variations]
</Section>

<Section>
## Historical Context
[Cultural/traditional references]
</Section>

<Section>
## Questions to Sit With
[Reflection prompts]
</Section>
```

### Data Layer

`src/lib/data/numbers.ts` contains structured data for programmatic use:

```typescript
interface NumberPattern {
  pattern: string;
  category: 'repeating' | 'sequential' | 'mirrored' | 'mixed';
  essence: string;        // 2-3 words
  keywords: string[];
  related: string[];
  baseMeaning: string;    // One paragraph for Signal's condensed view
}
```

---

## Open Questions

1. **666** — Handle the cultural baggage? Include with reframe, or skip?
2. **Search fallback** — What happens for patterns we haven't covered? Generate on-demand?
3. **Prioritization** — Which 20 patterns to launch with?

---

## Next Steps

1. Create data model for number patterns
2. Build landing page components
3. Write content for top 20 patterns
4. Implement Signal integration (stats on number pages)
5. Add Signal tiering (free vs paid)
