# Numbers PRD

Public content hub for number pattern meanings with SEO optimization and Signal integration.

**Status:** Planning
**Design Doc:** `docs/plans/2026-01-20-numbers-section-design.md`

## Problem

People search for angel number meanings but find low-quality content farms or overly mystical sites. Numbers provides authoritative, well-written content that respects readers' intelligence while driving discovery of Signal for personal tracking.

## Scope

### In Scope (v1)

- Landing page with ritual NumberPad input hero
- 20 individual pattern pages (see Launch Set below)
- Data layer for structured number meanings
- MDX content layer for rich prose
- Browse interface with category tabs
- Search fallback with component breakdown
- Signal CTA on all pages
- Logged-in personalization ("You've seen this 3 times")

### Out of Scope (v1)

- Signal tiering (free vs paid) — separate initiative
- Full 50-100+ pattern coverage — expand post-launch
- On-demand AI content generation
- User-submitted interpretations
- Comments or community features
- Pattern comparison tool

### Launch Set (20 Patterns)

| Category | Patterns | Count |
|----------|----------|-------|
| Triples | 111, 222, 333, 444, 555, 666, 777, 888, 999 | 9 |
| Quads | 1111, 2222 | 2 |
| Sequential | 123, 1234, 12345 | 3 |
| Mirrored | 1212, 1221 | 2 |
| Doubles | 11, 22, 33, 44 | 4 |

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL structure | `/numbers` (sibling to `/signal`) | Clear separation: content vs personal app |
| Naming | "Number patterns" / "Signals" | Acknowledge "angel numbers" for SEO, pivot to brand voice |
| 666 handling | Include with matter-of-fact reframe | Complete coverage, demonstrates mature voice |
| 666 visibility | Exclude from featured grid | Avoid drawing unnecessary attention |
| Search fallback | Component breakdown | Educational, no AI cost, links to digit pages |
| Content architecture | Data layer + MDX layer | Programmatic use + rich prose |
| Launch scope | 20 high-traffic patterns | Validate approach before full expansion |
| Content creation | AI-assisted with human review | Efficiency with quality control |

## User Journeys

### Direct Search (SEO Entry)
```
Google "444 meaning" → /numbers/444 →
Read core meaning → See reflection prompts →
Notice Signal CTA → Create account → Log first sighting
```

### Exploratory Browse
```
/numbers landing → Scroll to "Most Encountered" →
Click 333 card → Read full page →
Click related pattern 3333 → Continue exploring
```

### Ritual Input
```
/numbers landing → Type "1111" in hero input →
Press Enter → Navigate to /numbers/1111 →
Read meaning → "Track this pattern" → Signal capture
```

### Uncovered Pattern
```
/numbers landing → Type "847" →
See component breakdown: "8 (abundance) + 4 (stability) + 7 (wisdom)" →
Click through to /numbers/888 or /numbers/444 for deeper reading
```

### Returning Logged-In User
```
/numbers/444 → See "You've logged this 5 times" inline →
Click stat → Jump to Signal collection filtered by 444
```

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Pattern not covered | Show component breakdown with digit links |
| Invalid input (letters, symbols) | Ignore non-numeric input |
| Input too long (>6 digits) | Cap at 6 digits |
| Empty submit | No-op, keep focus on input |
| Logged-in user, no sightings | Hide personalization, show standard CTA |
| Pattern covered but no MDX | Render from data layer only (condensed page) |

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Organic traffic | 1,000 monthly sessions within 3 months | Google Analytics |
| Time on page | >2 min average | GA engagement |
| Signal conversion | 5% of visitors create account | Signup attribution |
| Content quality | Top 3 ranking for 5+ patterns | Search console |
| Cross-linking | 30% click to related pattern | Internal link clicks |

## Technical Summary

- **URL:** `/numbers` (landing), `/numbers/[pattern]` (individual pages)
- **Data layer:** `src/lib/data/numbers.ts` with `NumberPattern` interface
- **Content layer:** `src/content/numbers/[pattern].mdx`
- **Components:** `src/components/numbers/` (NumberCard, PatternGrid, NumberInput, ComponentBreakdown)
- **Integration:** Read from `signal_user_number_stats` for personalization (when authenticated)
- **SEO:** Static generation, JSON-LD structured data, meta descriptions per pattern
