# Signal Evolution: Subscriptions, Heatmap & Numbers Integration

## Overview

Evolve Signal from a basic sighting logger into a compelling free experience with optional paid AI interpretations. Phase 1 ships the free tier with engagement features; Phase 2 adds Signal Insight subscription.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Subscription model | Freemium with AI paywall | Clean separation, no "run out" frustration |
| Free tier experience | Base meanings from Numbers | Honest value, AI feels additive not withheld |
| Paid tier name | Signal Insight | Descriptive, leaves room for future tiers |
| Heatmap style | Intensity + streaks | Combines engagement mechanics |
| Launch sequence | Free-first | Validate free experience, build user base before monetization |
| Heatmap mobile | Full year scrollable | Horizontal scroll like GitHub mobile |
| Your Numbers placement | Replace CollectionGrid | Enhanced version of existing collection section |
| Pattern insights location | Capture result only | Show insights when user logs, not on dashboard |
| Free tier inputs | Full capture flow | Free users can add moods/notes, just no AI interpretation |
| Global stats | Skip for now | Focus on personal stats, avoid privacy complexity |
| Annual plan | Monthly only for launch | Simpler, can add later |
| Pricing | TBD via market research | Stripe Product/Price set manually |

---

## Phase 1: Free Launch

### 1. Heatmap & Streaks

GitHub-style contribution graph on `/signal` dashboard.

**Heatmap Specs:**
- 52 weeks (1 year), horizontal scroll on mobile
- 5-level intensity: 0 (empty), 1 (1 sighting), 2 (2-3), 3 (4-6), 4 (7+)
- Hover tooltip: "Jan 15: 3 sightings"

**Streak Display:**
- Current streak: "🔥 7 days"
- Longest streak: "Best: 23 days"
- Total active days: "142 days of noticing"

**Data Model — Hybrid Approach:**

Heatmap data computed from `signal_sightings` via GROUP BY query (efficient, uses existing `timestamp` index).

Streaks denormalized in new table:

```sql
CREATE TABLE signal_user_activity_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_active_days INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT, -- 'YYYY-MM-DD'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Streak Update Logic (on sighting create):**
- Same day → no-op
- Consecutive day → increment current streak
- Gap → reset current streak to 1
- Update longest if current > longest

**Files to create:**
- `src/lib/db/queries/activity.ts` — `updateUserActivityStats()`, `getUserActivityStats()`
- `src/app/api/signal/heatmap/route.ts` — GET endpoint
- `src/hooks/signal/use-heatmap.ts` — React Query hook
- `src/components/signal/activity-heatmap.tsx` — Grid component
- `src/components/signal/streak-stats.tsx` — Display component

**Files to modify:**
- `src/lib/db/schema.ts` — Add `signalUserActivityStats` table
- `src/app/api/signal/stats/route.ts` — Include activity stats in response
- `src/app/api/signal/sightings/route.ts` — Call `updateUserActivityStats()` on create
- `src/hooks/signal/query-keys.ts` — Add `heatmap` key
- `src/hooks/signal/use-stats.ts` — Extend return type
- `src/app/signal/dashboard-content.tsx` — Integrate components

### 2. "Your Numbers" Profile

Replaces existing `CollectionGrid` with enhanced collection display.

**Sections:**
1. **Top Patterns** — Top 5 by count, bar visualization, links to `/numbers/[pattern]`
2. **Collection Stats** — Unique count, coverage percentage by category
3. **Uncaught Discovery** — Missing categories with prompts

**Categories (from Numbers):** doubles, triples, quads, sequential, mirrored, clock, sandwich, compound

**Enhanced First-Catch:** Add category context: "✨ First mirrored number! 4 of 8 categories caught."

**Files to create:**
- `src/components/signal/your-numbers.tsx` — Main component
- `src/lib/signal/collection.ts` — Coverage calculation utilities

**Files to modify:**
- `src/app/signal/dashboard-content.tsx` — Replace `CollectionGrid`
- `src/app/signal/capture/page.tsx` — Enhance first-catch celebration

### 3. Pattern Insights

Rule-based insights shown on capture result screen (not dashboard).

**Triggers:**
| Trigger | Example |
|---------|---------|
| 3+ same in 7 days | "444 is showing up a lot this week." |
| Returns after 2+ week gap | "777 is back. Last time was 18 days ago." |
| New number | "First time seeing 1221. Mirrored numbers are about reflection." |

**Implementation:**
- Computed at capture time from stats + recent sightings
- Templates use Numbers library (category, meaning excerpt)
- No AI required

**Files to create:**
- `src/lib/signal/insights.ts` — Insight computation
- `src/components/signal/pattern-insight.tsx` — Display component

**Files to modify:**
- `src/app/api/signal/sightings/route.ts` — Return insight in response
- `src/app/signal/capture/page.tsx` — Show on result step

### 4. Surprise & Delight

Micro-moments computed at capture time.

| Moment | Trigger |
|--------|---------|
| Time alignment | Logging 333 at 3:33 PM |
| Milestone | 10th, 50th, 100th sighting |
| Anniversary | 1 year since first sighting |
| Pattern echo | Same number + mood months apart |
| Lucky timing | Logging on 11/11, 2/22 |

**Files to create:**
- `src/lib/signal/delight.ts` — Detection logic
- `src/components/signal/delight-toast.tsx` — Toast component

**Files to modify:**
- `src/app/signal/capture/page.tsx` — Trigger on result

### 5. Numbers Integration

**Signal → Numbers:**
- Numbers link on capture result and sighting detail
- "Learn more about 444 →"

**Numbers → Signal:**
- Existing: Personalization badge
- New: "Your history with 444" section with recent sightings/moods
- New: "Log this sighting" CTA pre-fills capture

**Files to modify:**
- `src/app/signal/capture/page.tsx` — Accept `?number=` query param
- `src/app/numbers/[pattern]/page.tsx` — Add Signal history section

---

## Phase 2: Signal Insight Subscription

### 1. Subscription Infrastructure

**Data Model:**
```sql
CREATE TABLE signal_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free', -- 'free' | 'insight'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'past_due'
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Gating Logic:**
- Check subscription before AI interpretation generation
- Free users see base meaning + upgrade CTA
- Existing interpretations remain visible on downgrade

**Stripe Integration:**
- Reuse existing `src/lib/shop/stripe.ts` client
- New checkout session with `mode: "subscription"`
- Handle webhook events: `customer.subscription.created`, `.updated`, `.deleted`, `invoice.paid`, `invoice.payment_failed`

**Files to create:**
- `src/lib/db/queries/subscriptions.ts` — Subscription queries
- `src/lib/signal/subscriptions.ts` — Tier checking utilities
- `src/app/api/signal/subscribe/route.ts` — Create checkout session
- `src/app/api/signal/webhooks/stripe/route.ts` — Webhook handler

**Files to modify:**
- `src/lib/db/schema.ts` — Add `signalSubscriptions` table
- `src/env.js` — Add `STRIPE_SIGNAL_WEBHOOK_SECRET` if separate

### 2. Free Tier Experience

**Capture Result (Free):**
```
444 · Stability & Foundation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Base meaning from Numbers library]

[Learn more about 444 →]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Want a personalized interpretation?
Signal Insight analyzes your mood, notes, and
history to reveal what this number means for you.

[Upgrade to Signal Insight]
```

**Files to create:**
- `src/components/signal/upgrade-cta.tsx` — Upgrade prompt

**Files to modify:**
- `src/app/signal/capture/page.tsx` — Conditional rendering
- `src/app/api/signal/sightings/route.ts` — Skip AI for free tier

### 3. Subscription Management

- Upgrade CTAs on capture result, sighting detail
- Subscription status in account settings
- Stripe Customer Portal for billing

**Files to create:**
- `src/app/signal/settings/page.tsx` — Subscription management
- `src/components/signal/subscription-status.tsx` — Status display

---

## Implementation Sequence

### Phase 1 (Free Launch)

1. Database: Add `signal_user_activity_stats` table, run migration
2. Heatmap API: Create `/api/signal/heatmap` endpoint
3. Streak logic: Implement `updateUserActivityStats()`, integrate in sightings POST
4. Stats API: Extend `/api/signal/stats` with activity data
5. Hooks: Add `useHeatmap`, extend `useStats`
6. Components: Build `ActivityHeatmap`, `StreakStats`
7. Dashboard: Integrate heatmap + streaks on `/signal`
8. Your Numbers: Build component, replace `CollectionGrid`
9. Insights: Build detection + display, integrate in capture result
10. Delight: Build detection + toast, integrate in capture
11. Numbers integration: Add history section, pre-fill capture

### Phase 2 (Signal Insight)

1. Database: Add `signal_subscriptions` table
2. Subscription utilities: Tier checking, queries
3. Stripe: Checkout session, webhook handler
4. Tier gating: Modify interpretation flow in sightings POST
5. Free result: Base meaning + upgrade CTA
6. Settings: Subscription management page

---

## Verification

### Phase 1

```bash
# 1. Heatmap
- Log sightings across multiple days
- Verify intensity levels display correctly
- Verify streak increments on consecutive days
- Verify streak resets after gap

# 2. Collection
- Log numbers from different categories
- Verify "Your Numbers" shows top patterns
- Verify coverage stats update
- Verify discovery prompts for missing categories

# 3. Insights
- Log same number 3x in a week
- Verify "showing up a lot" insight appears on result

# 4. Delight
- Log at aligned time (3:33 at 3:33 PM)
- Verify delight toast appears

# 5. Numbers integration
- Click "Learn more" → goes to Numbers page
- On Numbers page, click "Log sighting" → capture pre-filled
```

### Phase 2

```bash
# 1. Free capture
- Log sighting as free user
- Verify base meaning shown (not AI interpretation)
- Verify upgrade CTA appears

# 2. Subscription
- Click upgrade → Stripe checkout
- Complete payment
- Verify tier updates to 'insight'

# 3. Paid capture
- Log sighting as subscriber
- Verify AI interpretation generated

# 4. Downgrade
- Cancel subscription via Stripe Portal
- Verify existing interpretations still visible
- Verify new captures show base meaning only
```

---

## Key Files Summary

| Area | Files |
|------|-------|
| Schema | `src/lib/db/schema.ts` |
| Queries | `src/lib/db/queries/activity.ts`, `src/lib/db/queries/subscriptions.ts` |
| Logic | `src/lib/signal/insights.ts`, `src/lib/signal/delight.ts`, `src/lib/signal/collection.ts`, `src/lib/signal/subscriptions.ts` |
| Hooks | `src/hooks/signal/use-heatmap.ts`, `src/hooks/signal/use-stats.ts` |
| Components | `activity-heatmap.tsx`, `streak-stats.tsx`, `your-numbers.tsx`, `pattern-insight.tsx`, `delight-toast.tsx`, `upgrade-cta.tsx` |
| API | `src/app/api/signal/heatmap/route.ts`, `src/app/api/signal/subscribe/route.ts`, `src/app/api/signal/webhooks/stripe/route.ts` |
| Pages | `src/app/signal/dashboard-content.tsx`, `src/app/signal/capture/page.tsx`, `src/app/signal/settings/page.tsx` |
