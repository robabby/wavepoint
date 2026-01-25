# WavePoint Astrology Integration Roadmap

## Overview

**Vision**: Build a defensible moat through a proprietary Sacred Geometry × Numerology × Astrology synthesis that creates personalized, evolving interpretations.

**Timeline**: 8+ months (34 weeks across 5 phases)
**Team**: Solo founder + Claude Code partnership
**Approach**: In-house astrology calculations using Swiss Ephemeris (no external API dependencies)

---

## Phase 0: Foundation & Research (Weeks 1-4)

**Goal**: Deep domain understanding + technical feasibility validation

### Workstreams

1. **Astrology Domain Deep-Dive**
   - Document key concepts: natal charts, houses (Placidus vs Whole Sign), aspects, transits, progressions
   - Define which elements are essential for the synthesis vs. nice-to-have
   - Create glossary for consistent terminology
   - Output: `docs/plans/astrology-domain-guide.md`

2. **Swiss Ephemeris Spike**
   - Research: `swisseph` npm package, data file requirements
   - Build proof-of-concept: generate natal chart from birth data
   - Validate accuracy against known tools (Astro.com, Co-Star)
   - Output: Working prototype in `src/lib/astrology/` (experimental)

3. **Synthesis Framework Design**
   - Map initial Geometry ↔ Numbers ↔ Astrology relationships
   - Define "edges" in the knowledge graph (e.g., Tetrahedron ↔ Fire signs ↔ 1/10/19/28)
   - Identify which relationships are "known" vs. need to be learned
   - Output: `docs/plans/synthesis-framework-v1.md`

4. **Spiritual Profile Schema Design**
   - Define what we capture (birth data, geometry affinities, sighting patterns)
   - Define what we infer (planetary strengths, element balance)
   - Plan evolution over time (what changes, what's static)
   - Output: `docs/plans/spiritual-profile-schema.md`

### Exit Criteria
- [ ] Can generate accurate natal charts in-house
- [ ] Have written synthesis framework draft
- [ ] Spiritual Profile schema documented
- [ ] Clear understanding of astronomical concepts needed

---

## Phase 1: Core Infrastructure (Weeks 5-10)

**Goal**: Build the foundational systems everything else depends on

### Workstreams

1. **Astrology Engine** (`src/lib/astrology/`)
   - Full Swiss Ephemeris integration
   - Natal chart generation: planets, houses, aspects
   - Current transit calculations
   - House system options (Placidus, Whole Sign, Equal)
   - Aspect orb configuration
   - Comprehensive test suite against known charts

2. **Spiritual Profile System**
   - Database schema: `spiritualProfiles` table
   - API routes for CRUD operations
   - Birth data capture flow in Signal onboarding
   - Handle missing/uncertain birth time gracefully
   - Privacy considerations for birth data
   - **Identity groundwork** (for Phase 5):
     - Add `username` column to `users` (nullable, unique)
     - Add `displayName` column to `users` (freeform)
     - Add `profileVisibility` to `spiritualProfiles` (private/public)
     - Design `/u/[identifier]` route structure

3. **Synthesis Algorithm v1** (`src/lib/synthesis/`)
   - Knowledge graph data structure
   - Initial hardcoded relationships (Geometry ↔ Numbers ↔ Astrology)
   - Query interface: "Given this sighting + profile, what's relevant?"
   - Extensible for learned relationships later

4. **Enhanced Prompt Engine**
   - Refactor Signal's Claude integration
   - Prompt templates that incorporate spiritual profile context
   - Structured output for consistent interpretation format
   - A/B testing infrastructure for prompt variants

### Exit Criteria
- [ ] Natal chart generation works for any birth data
- [ ] Spiritual profiles stored and retrievable
- [ ] Basic synthesis query returns relevant context
- [ ] Interpretations can reference user's chart

---

## Phase 2: User Experience (Weeks 11-16)

**Goal**: Surface the synthesis to users compellingly

### Workstreams

1. **Birth Data Onboarding**
   - UX flow: birth date (required), time (optional), location (required)
   - Time uncertainty handling ("I know it was morning" → range)
   - Location autocomplete (Google Places or similar)
   - Explanation of why we need this data
   - Skip option with degraded experience

2. **Astrology-Aware Interpretations**
   - Signal interpretations now reference:
     - Natal chart placements ("As a Virgo rising...")
     - Current transits ("With Mercury retrograde in your 3rd house...")
     - Synthesis connections ("444's earth energy resonates with your Saturn placement...")
   - Graceful degradation when birth time unknown

3. **Spiritual Profile Dashboard**
   - Chart wheel visualization (SVG or Canvas)
   - Geometry affinities display
   - Number pattern trends
   - "Your spiritual fingerprint" summary
   - Option to update/correct birth data

4. **Transit Notifications** (Stretch)
   - Identify significant upcoming transits for user
   - Connect to their number patterns
   - Optional push/email notifications

### Exit Criteria
- [ ] Users can enter birth data during onboarding
- [ ] Interpretations feel meaningfully personalized
- [ ] Users can view their spiritual profile
- [ ] Clear value prop communicated for why astrology matters

---

## Phase 3: Learning & Evolution (Weeks 17-22)

**Goal**: Build the flywheel — interpretations improve over time

### Workstreams

1. **Resonance Feedback System**
   - UI for "Did this resonate?" after interpretations
   - Structured feedback: resonance level, specific elements that landed
   - Store feedback linked to interpretation + profile
   - Privacy-first: aggregate only, no PII in analytics

2. **Aggregate Pattern Analysis**
   - Analytics pipeline for resonance data
   - Segment by profile characteristics (sun sign, element balance, etc.)
   - Identify what interpretation styles work for whom
   - Dashboard for internal analysis

3. **Prompt Evolution Engine**
   - System for A/B testing prompt variants
   - Automated refinement based on resonance signals
   - Version control for prompt templates
   - Rollback capability

4. **Longitudinal Tracking**
   - Monthly "Spiritual Journey" summaries
   - Quarterly pattern analysis
   - Year-over-year trends
   - "Your numbers are shifting toward..." insights

### Exit Criteria
- [ ] Capturing resonance feedback from users
- [ ] Have data on what interpretation styles work
- [ ] Prompt variants being tested systematically
- [ ] Users receiving longitudinal insights

---

## Phase 4: Community & Moat Deepening (Weeks 23-28)

**Goal**: Build network effects and switching costs

### Workstreams

1. **Community Wisdom Layer**
   - Aggregate insights: "Users with similar profiles often see..."
   - Anonymized pattern sharing
   - Optional: user-contributed interpretations (moderated)

2. **Temporal Pattern Features**
   - "Your 2025 is trending toward 8s..."
   - Correlation with major transits
   - Predictive insights based on upcoming transits
   - Life phase detection (Saturn return, etc.)

3. **Advanced Synthesis**
   - Machine learning on resonance patterns
   - Learned correlations supplement hardcoded ones
   - Personalized weighting of synthesis edges
   - Self-improving knowledge graph

4. **Documentation & IP**
   - Document synthesis algorithm thoroughly
   - Evaluate patent potential
   - Trade secret protection measures

### Exit Criteria
- [ ] Community insights surfacing to users
- [ ] Temporal patterns providing unique value
- [ ] Evidence of learned correlations improving quality
- [ ] IP documentation complete

---

## Phase 5: Social & Public Profiles (Weeks 29-34)

**Goal**: Enable social features and user-generated content that deepen the moat

### Workstreams

1. **Public Profile System**
   - Public profile page at `/u/[identifier]`
   - Privacy controls: what's visible (Big Three, element balance, chart wheel)
   - What's NEVER public: exact birth date/time/location (PII)
   - OG image generation for social sharing
   - Embed widgets for external sites

2. **Username & Identity System**
   - Username claiming flow (unique, validated)
   - Display name (freeform, non-unique)
   - Vanity URL: `/u/[username]` replaces `/u/[id]`
   - Handle changes, reservations, disputes
   - Consider: premium/earned vanity URLs?

3. **Synastry & Comparison**
   - Compare two profiles (element harmony, aspect overlays)
   - "Cosmic compatibility" score
   - Privacy-respecting: both users must have public profiles or explicit consent
   - Shareable comparison results

4. **Connection Model**
   - Follow/subscribe to public profiles?
   - "Cosmic circle" concept (mutual connections)
   - Activity feed: "Users you follow saw 444 today"
   - Privacy controls for visibility

### Privacy Model

| Data | Public Profile | Private Profile |
|------|----------------|-----------------|
| Display name | ✓ | ✓ (to self) |
| Username | ✓ | ✓ (to self) |
| Big Three (Sun/Moon/Rising) | ✓ (opt-in) | Hidden |
| Element balance | ✓ (opt-in) | Hidden |
| Chart wheel visualization | ✓ (opt-in) | Hidden |
| Geometry affinities | ✓ (opt-in) | Hidden |
| Exact birth date | **Never** | **Never** |
| Birth time | **Never** | **Never** |
| Birth location | **Never** | **Never** |
| Sighting history | **Never** (unless explicitly shared) | Hidden |

### Username Strategy

**Recommended approach: ID-based with optional vanity**

- Default: UUID-based URL (`/u/a7f3b2c9`)
- Optional: Claim username → vanity URL (`/u/cosmic_wanderer`)
- Display name always freeform (shown on profile, not in URL)

**Why not Discord-style discriminators (#1234)?**
- Discord abandoned this in 2023
- Ugly in URLs
- Adds UX complexity

**Why not immediate usernames?**
- Avoids land-grab at launch
- Reduces signup friction
- Can add as engagement feature later

### Exit Criteria
- [ ] Users can make profiles public
- [ ] Public profiles shareable with OG images
- [ ] Username claiming works
- [ ] Basic synastry comparison functional
- [ ] Privacy model enforced (no PII leakage)

---

## Working Model

### Session Types

| Type | Purpose | Output |
|------|---------|--------|
| **Brainstorm** | Explore domain, make decisions | Design doc in `docs/plans/` |
| **Research** | Investigate sources, libraries | Notes in Obsidian |
| **Architecture** | Design schemas, APIs | ADRs, design docs |
| **Implementation** | Write code | Code, tests, commits |
| **Review** | Evaluate against plan | Iteration notes |

### Per-Phase Cadence

1. Kickoff brainstorm → define goals
2. Research sessions → one per major unknown
3. Architecture session → design before building
4. Implementation sessions → focused deliverables
5. Phase review → evaluate exit criteria

### Artifact Trail

- **Obsidian** (`Areas/WavePoint/Roadmaps/Astrology/`): Project home with phase subfolders
- **docs/plans/**: Design documents, specs (code repo)
- **docs/adr/**: Architecture Decision Records
- **Code**: Implementation in `src/lib/`

---

## Obsidian Project Structure

```
Areas/WavePoint/Roadmaps/Astrology/
├── Astrology Integration.md      # Project overview, links to phases
├── Phase 0 - Foundation/
│   ├── Domain Research/          # Astrology concepts, glossary
│   ├── Swiss Ephemeris/          # Library evaluation, data files
│   ├── Synthesis Framework/      # Relationship mapping
│   └── Session Notes/            # Notes from each working session
├── Phase 1 - Infrastructure/
│   ├── Architecture/             # Schema designs, API specs
│   ├── Implementation Notes/     # Learnings during build
│   └── Session Notes/
├── Phase 2 - User Experience/
│   ├── UX Research/              # User flows, wireframes
│   ├── Design Decisions/
│   └── Session Notes/
├── Phase 3 - Learning/
│   ├── Analytics Design/
│   ├── ML Research/
│   └── Session Notes/
├── Phase 4 - Community/
│   ├── Feature Research/
│   ├── IP Documentation/
│   └── Session Notes/
├── Phase 5 - Social/
│   ├── Public Profiles/
│   ├── Identity System/
│   ├── Synastry/
│   └── Session Notes/
└── Resources/
    ├── Data Sources/             # API evaluations, library comparisons
    ├── Reference Materials/      # External articles, papers
    └── Decisions Log.md          # Running log of key decisions
```

---

## Immediate Next Steps

**Step 0: Project Setup** ✅
- Create Obsidian folder structure above
- Create project overview note with links
- Save this roadmap to project folder

**Step 1: Astrology Domain Brainstorm**
- Define which astrological concepts matter for the synthesis
- Prioritize: what's essential vs. nice-to-have
- Output: Domain guide in `Phase 0 - Foundation/Domain Research/`

**Step 2: Swiss Ephemeris Research**
- Evaluate `swisseph` npm package
- Understand data file requirements
- Plan proof-of-concept scope
- Output: Research notes in `Phase 0 - Foundation/Swiss Ephemeris/`

---

## Verification

After each phase, verify:
- All exit criteria met
- Documentation complete
- Code tested and committed
- Obsidian notes updated
- Ready for next phase kickoff
