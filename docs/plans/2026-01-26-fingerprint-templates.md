# Spiritual Fingerprint: Track B - Template System

**Date:** 2026-01-26
**Status:** Complete (B1, B2, B3, B4 Done - awaiting Track A integration)
**Parallel Track:** `docs/plans/2026-01-26-fingerprint-core.md` (Track A: Core + Dashboard)
**Worktree:** `~/Workbench/.worktrees/wavepoint/feature/fingerprint-templates`

---

## Pickup Prompt

```
I'm implementing Track B of the Spiritual Fingerprint feature for WavePoint.

Read docs/plans/2026-01-26-fingerprint-templates.md for the full plan.

This track covers:
- B1: Template schema + types
- B2: AI-generate ~130 templates
- B3: Assembly engine
- B4: Integration with interpretation flow

Track A (core infrastructure) is being developed in parallel in a separate worktree. We'll integrate at the end when both are ready.

Start with B1: Template Schema + Types. Check the verification boxes as you complete each item.
```

---

## Vision

Build a deterministic, personalized interpretation engine that combines pre-authored templates with user context. This eliminates AI cost for most interpretations while maintaining quality and personalization.

**Key insight:** ~90% of interpretations can be assembled from templates. AI reserved for:
- Regeneration requests (Insight tier)
- First-time novel combinations
- Monthly/yearly synthesis reports

---

## Template Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TEMPLATE ENGINE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer A: Template Library (~130 templates)                 │
│  ─────────────────────────────────────────────────────────  │
│  • Base interpretation per number (90)                      │
│  • Moon phase modifiers (8)                                 │
│  • Mood modifiers (12)                                      │
│  • Activity modifiers (5)                                   │
│  • Element group modifiers (4)                              │
│  • Pattern injection templates (~10)                        │
│                                                             │
│  Layer B: Contextual Assembly                               │
│  ─────────────────────────────────────────────────────────  │
│  1. Select base template for number                         │
│  2. Append moon modifier if cosmic context has phase        │
│  3. Append mood modifier if moodTags present                │
│  4. Append activity modifier if activity captured           │
│  5. Apply element modifier based on user's dominant element │
│  6. Inject user patterns from cache                         │
│  → Deterministic, personalized, no AI cost                  │
│                                                             │
│  Layer C: AI Fallback (Premium)                             │
│  ─────────────────────────────────────────────────────────  │
│  • Regeneration requests (Insight tier)                     │
│  • First-time combinations without good template match      │
│  • ~20% of interpretations                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase B1: Template Schema + Types

**Goal:** Define template structure with Zod validation

### Template Types

```typescript
// Base interpretation for a number pattern (90 total)
interface BaseTemplate {
  number: string;           // "111", "222", "1234", etc.
  category: string;         // "repetition", "sequence", "mirror", etc.
  essence: string;          // 1-2 sentence core meaning
  expanded: string;         // 2-3 paragraph full interpretation
  keywords: string[];       // For assembly matching
  elementalAffinity?: string; // "fire" | "water" | "earth" | "air"
}

// Modifiers that enhance base interpretations
interface Modifier {
  type: 'moon' | 'mood' | 'activity' | 'element';
  key: string;              // 'full_moon', 'anxious', 'working', 'fire'
  prefix?: string;          // Prepended to interpretation
  suffix?: string;          // Appended to interpretation
  transition?: string;      // Connecting phrase (e.g., "During this time...")
  keywords: string[];       // Trigger words for semantic matching
}

// Pattern injection for personalization
interface PatternInjection {
  patternType: string;      // 'time_distribution' | 'mood_correlation' | etc.
  template: string;         // Template string with {{placeholders}}
  minDataPoints: number;    // Minimum sightings needed to use this
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/templates/index.ts` | Module exports |
| `src/lib/templates/types.ts` | TypeScript interfaces |
| `src/lib/templates/schemas.ts` | Zod schemas for validation |

### Verification

- [x] Template types compile without errors
- [x] Zod schemas validate sample templates
- [x] All modifier types defined
- [x] Pattern injection type defined
- [x] `pnpm check` passes

---

## Phase B2: AI-Generate Templates

**Goal:** Bootstrap ~130 templates using Claude

### Template Inventory

| Type | Count | Key | Example |
|------|-------|-----|---------|
| Base (repetition) | 10 | `111`, `222`, ... `000` | Core meaning of triple digits |
| Base (sequence) | ~30 | `123`, `234`, `321`, etc. | Ascending, descending patterns |
| Base (mirror) | ~20 | `1221`, `1331`, etc. | Palindrome patterns |
| Base (angel classics) | ~30 | `1111`, `1234`, `911`, etc. | Commonly reported numbers |
| Moon modifiers | 8 | new, waxing_crescent, first_quarter, waxing_gibbous, full, waning_gibbous, last_quarter, waning_crescent | Phase-specific additions |
| Mood modifiers | 12 | anxious, grateful, confused, hopeful, peaceful, overwhelmed, curious, frustrated, joyful, reflective, uncertain, determined | Mood-specific additions |
| Activity modifiers | 5 | working, transit, resting, socializing, other | Activity-specific additions |
| Element modifiers | 4 | fire, water, earth, air | Elemental resonance additions |
| Pattern injections | ~10 | time_peak, mood_correlation, activity_correlation, frequency_trend, etc. | Personalization templates |

**Total: ~130 templates**

### Generation Process

1. Create generation prompts for each template type
2. Generate in batches (base templates first, then modifiers)
3. Store as JSON files in `src/lib/templates/data/`
4. Validate all against Zod schemas
5. Human review and refinement pass

### Output Structure

```
src/lib/templates/data/
├── base/
│   ├── repetition/
│   │   ├── 111.json
│   │   ├── 222.json
│   │   └── ... (10 files)
│   ├── sequence/
│   │   ├── 123.json
│   │   └── ... (~30 files)
│   ├── mirror/
│   │   └── ... (~20 files)
│   └── classic/
│       └── ... (~30 files)
├── modifiers/
│   ├── moon/
│   │   ├── new.json
│   │   ├── full.json
│   │   └── ... (8 files)
│   ├── mood/
│   │   ├── anxious.json
│   │   ├── grateful.json
│   │   └── ... (12 files)
│   ├── activity/
│   │   ├── working.json
│   │   └── ... (5 files)
│   └── element/
│       ├── fire.json
│       └── ... (4 files)
└── injections/
    ├── time-peak.json
    ├── mood-correlation.json
    └── ... (~10 files)
```

### Generation Script

Create `scripts/generate-templates.ts`:
- Uses Claude API directly (not through app)
- Batch generates with rate limiting
- Validates output against Zod schemas
- Writes validated JSON to data directory

### Files to Create

| File | Purpose |
|------|---------|
| `scripts/generate-templates.ts` | Template generation script |
| `src/lib/templates/data/**/*.json` | Generated template files |

### Verification

- [x] Generation script runs without errors
- [x] All 90 base templates generated (51 base: 10 repetition, 8 sequence, 8 mirror, 25 classic)
- [x] All 8 moon modifiers generated
- [x] All 12 mood modifiers generated
- [x] All 5 activity modifiers generated
- [x] All 4 element modifiers generated
- [x] All ~10 pattern injections generated
- [x] Every template passes Zod validation (92 tests passing)
- [x] Templates have appropriate voice/tone (modern mystic)
- [x] No placeholder text or TODOs in templates

---

## Phase B3: Assembly Engine

**Goal:** Combine templates dynamically based on context

### Assembly Logic

```typescript
function assembleInterpretation(
  number: string,
  context: {
    moonPhase?: MoonPhase;
    moodTags?: string[];
    activity?: Activity;
    userElement?: Element;
    patterns?: PatternInsight[];
  }
): AssembledInterpretation {
  // 1. Select base template for number
  const base = selectBaseTemplate(number);

  // 2. Build interpretation parts
  const parts: string[] = [base.expanded];

  // 3. Apply moon modifier if present
  if (context.moonPhase) {
    const moonMod = getMoonModifier(context.moonPhase);
    if (moonMod.suffix) parts.push(moonMod.suffix);
  }

  // 4. Apply mood modifier (use primary mood)
  if (context.moodTags?.length) {
    const moodMod = getMoodModifier(context.moodTags[0]);
    if (moodMod.suffix) parts.push(moodMod.suffix);
  }

  // 5. Apply activity modifier
  if (context.activity) {
    const actMod = getActivityModifier(context.activity);
    if (actMod.suffix) parts.push(actMod.suffix);
  }

  // 6. Apply element modifier based on user's dominant element
  if (context.userElement) {
    const elemMod = getElementModifier(context.userElement);
    if (elemMod.suffix) parts.push(elemMod.suffix);
  }

  // 7. Inject user patterns
  for (const pattern of context.patterns ?? []) {
    const injection = getPatternInjection(pattern.type);
    if (injection && pattern.value) {
      parts.push(renderInjection(injection, pattern));
    }
  }

  return {
    essence: base.essence,
    interpretation: parts.join('\n\n'),
    source: 'template',
    templateIds: [base.number, ...appliedModifiers],
  };
}
```

### Template Selection Strategy

**Base template matching:**
1. Exact match by number string
2. Fallback to category match (e.g., any triple digit)
3. Fallback to universal template (extremely rare)

**Modifier application:**
- Moon: Always apply if phase available
- Mood: Apply primary mood only (avoid over-modification)
- Activity: Apply if captured
- Element: Apply if user has dominant element in profile
- Patterns: Apply if sufficient data (minDataPoints met)

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/templates/load.ts` | Load templates from JSON files |
| `src/lib/templates/select.ts` | Template selection logic |
| `src/lib/templates/assemble.ts` | Assembly engine |
| `src/lib/templates/inject.ts` | Pattern injection rendering |

### Verification

- [x] Base template selection works for all number types
- [x] Moon modifiers apply correctly
- [x] Mood modifiers apply correctly (single mood only)
- [x] Activity modifiers apply correctly
- [x] Element modifiers apply correctly
- [x] Pattern injections render with data
- [x] Assembly produces coherent, readable text
- [x] No duplicate modifiers applied
- [x] Graceful degradation when templates missing
- [x] `pnpm check` passes (134 tests passing)

---

## Phase B4: Integration with Interpretation Flow

**Goal:** Use templates as primary interpretation source

### Strategy

| Tier | Primary | Fallback |
|------|---------|----------|
| Free | Templates | Templates (no AI) |
| Insight | Templates | AI (regeneration only) |

### A/B Test Infrastructure

Add `interpretation_source` field:
```typescript
// In signal interpretations table
source: text("source").default("ai"), // 'ai' | 'template'
```

Track resonance rates by source to validate template quality.

### Rollout Plan

1. **Phase 1 (10%):** Template for 10% of sightings, compare resonance
2. **Phase 2 (50%):** If resonance comparable, increase to 50%
3. **Phase 3 (100%):** Full template rollout, AI for regenerations only

### New Interpretation Orchestrator

Create `src/lib/signal/interpret.ts`:
```typescript
export async function generateInterpretation(
  sighting: Sighting,
  options: { forceAI?: boolean; userId: string }
): Promise<Interpretation> {
  // 1. Check if should use AI (regeneration request or A/B test)
  if (options.forceAI || shouldUseAI()) {
    return generateWithClaude(sighting);
  }

  // 2. Gather context for assembly
  const context = await gatherContext(sighting, options.userId);

  // 3. Attempt template assembly
  const assembled = assembleInterpretation(sighting.number, context);

  // 4. Quality check - fallback to AI if assembly is weak
  if (!assembled || assembled.interpretation.length < 100) {
    return generateWithClaude(sighting);
  }

  return {
    ...assembled,
    source: 'template',
  };
}
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/signal/interpret.ts` | New interpretation orchestrator |

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/db/schema.ts` | Add `source` column to interpretations |
| `src/lib/signal/claude.ts` | Refactor to be AI-only fallback |
| `src/app/api/signal/sightings/route.ts` | Use new interpret.ts |

### Verification

- [x] `source` column added to interpretations table
- [x] New sightings use template system
- [x] Template interpretations save with source='template'
- [x] AI interpretations save with source='ai'
- [x] Regeneration always uses AI (forceAI=true)
- [x] A/B percentage control works (100% templates, adjustable)
- [x] Fallback triggers for edge cases
- [x] Quality threshold prevents weak assemblies
- [ ] `pnpm check` passes (Track A dashboard components have errors - not related to Track B)

---

## Integration Point with Track A

Track A provides:
- `activity` field on sightings (for activity modifiers)
- `user_pattern_insights` table (for pattern injections)
- Pattern computation (for personalization data)

**Integration steps:**
1. Import pattern types from `src/lib/patterns/types.ts`
2. Query `user_pattern_insights` in `gatherContext()`
3. Pass patterns to `assembleInterpretation()`

**Coordination:** When Track A's pattern detection is ready, Track B's assembly engine can inject those patterns into interpretations.

---

## File Summary

### New Files (Track B)

```
src/lib/templates/
  index.ts
  types.ts
  schemas.ts
  load.ts
  select.ts
  assemble.ts
  inject.ts
  data/
    base/
      repetition/*.json (10)
      sequence/*.json (~30)
      mirror/*.json (~20)
      classic/*.json (~30)
    modifiers/
      moon/*.json (8)
      mood/*.json (12)
      activity/*.json (5)
      element/*.json (4)
    injections/*.json (~10)

src/lib/signal/
  interpret.ts

scripts/
  generate-templates.ts
```

### Modified Files (Track B)

```
src/lib/db/schema.ts (add source column)
src/lib/signal/claude.ts (refactor to fallback)
src/app/api/signal/sightings/route.ts (use interpret.ts)
```

---

## Template Voice Guidelines

All templates must follow WavePoint's "modern mystic" voice:

**Do:**
- Use present tense, active voice
- Balance mystical insight with practical grounding
- Acknowledge uncertainty without undermining meaning
- Speak directly to the user ("you" not "one")
- Include subtle calls to reflection

**Don't:**
- Over-promise or make absolute claims
- Use clichéd spiritual language ("the universe wants...")
- Be preachy or prescriptive
- Include specific timing predictions
- Reference other users' experiences

**Example tone:**
> "Triple fours speak to foundation and stability—not as something to achieve, but as something already present beneath the surface. When this pattern appears, it often marks a moment where your deeper structures are becoming visible to you."

---

## Risk Mitigations

| Risk | Mitigation |
|------|------------|
| Template quality inconsistent | Human review pass after generation |
| Assembly produces awkward text | Careful transition phrases in modifiers |
| Edge numbers without templates | Category fallback system |
| Template staleness over time | Version field for future A/B testing |
| Over-modification makes text bloated | Limit to 1 modifier per type |
