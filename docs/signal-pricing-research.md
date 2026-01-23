# Signal Insight Pricing Research & Recommendation

## Executive Summary

Based on comprehensive market research, API cost analysis, and Stripe fee evaluation, the recommended pricing for Signal Insight is:

| Plan | Price | Effective Monthly | Net After Fees |
|------|-------|-------------------|----------------|
| **Monthly** | $7.99/mo | $7.99 | $7.42 (93%) |
| **Annual** | $59.99/yr | $5.00 | $57.66 (96%) |

**Rationale**: This positions Signal competitively against spiritual wellness apps while maintaining healthy margins. API costs are negligible (~$0.05-0.13/user/month), and fees are minimized at this price point.

---

## 1. Competitor Pricing Analysis

### Direct Comparables (Spiritual/AI Features)

| App | Category | Monthly | Annual | Trial |
|-----|----------|---------|--------|-------|
| **CHANI** | Astrology + AI | $11.99 | $107.99 | 14-day |
| **Hallow** | Catholic meditation | $9.99 | $69.99 | Free |
| **Nebula** | Astrology + Psychic | $7.99/wk | $49.99 | 3-day |
| **The Pattern** | Astrology + AI | $14.99 | ~$84 | Varies |
| **Insight Timer** | Meditation | $9.99 | $59.99 | 7-day |
| **Aura** | AI meditation | $11.99 | $59.99 | 7-day |
| **Angel Numbers Numerology** | Angel numbers | ~$10/mo | $21.99 | None |

### Key Insights

- **$9.99/mo and $69.99/yr** is the industry standard for spiritual wellness apps
- **Niche angel number apps** are underpriced ($10-22/yr) with no AI features
- **AI-powered apps** (CHANI, Aura) command premium pricing ($100+/yr)
- **Signal Insight has no direct competitor** - angel numbers + AI interpretation is unique

### Market Position

```
Budget          Mid-range        Premium
$5/mo           $10/mo           $12+/mo
|---------------|-----------------|
Nebula (annual) Hallow           CHANI
Angel Numbers   Insight Timer    The Pattern
                Aura             Sanctuary

        ★ SIGNAL INSIGHT ($7.99/mo, $59.99/yr) ★
        (Positioned as accessible premium)
```

---

## 2. Claude API Operating Costs

### Model Selection (Current Implementation)
- **Claude 3.5 Haiku** - Quick captures (no mood/notes): ~70% of requests
- **Claude Sonnet 4** - Rich context (with mood/notes): ~30% of requests

### Current Anthropic Pricing

| Model | Input | Output |
|-------|-------|--------|
| Claude 3.5 Haiku | $0.80/MTok | $4.00/MTok |
| Claude Sonnet 4 | $3.00/MTok | $15.00/MTok |

### Cost Per Interpretation

| Scenario | Input Tokens | Output Tokens | Cost |
|----------|-------------|---------------|------|
| Quick capture (Haiku) | ~200 | ~300 | **$0.0014** |
| Rich context (Sonnet) | ~350 | ~300 | **$0.0056** |
| Blended average (70/30) | - | - | **$0.0027** |

### Monthly Cost by Usage Level

| Usage | Interpretations | API Cost | % of $7.99 |
|-------|-----------------|----------|------------|
| Light | 5/mo | $0.01 | 0.2% |
| Medium | 20/mo | $0.05 | 0.7% |
| Heavy | 50/mo | $0.13 | 1.7% |

**Key Finding**: API costs are negligible at any realistic usage level. Even a "power user" generating 50 interpretations/month costs only $0.13 in API fees.

### Cost at Scale

| Subscribers | Avg Use | Monthly API Cost |
|-------------|---------|------------------|
| 100 | 15/mo | $4.05 |
| 500 | 15/mo | $20.25 |
| 1,000 | 15/mo | $40.50 |
| 5,000 | 15/mo | $202.50 |

---

## 3. Stripe Fee Analysis

### Fee Structure
- **Card transactions**: 2.9% + $0.30 per transaction
- **Stripe Billing**: +0.7% for subscriptions
- **Total**: 3.6% + $0.30 per transaction

### Net Revenue by Price Point

| Price | Stripe Fee | Net Revenue | Fee % |
|-------|------------|-------------|-------|
| $3/mo | $0.41 | $2.59 | **13.7%** |
| $5/mo | $0.48 | $4.52 | 9.6% |
| $7/mo | $0.55 | $6.45 | 7.9% |
| **$7.99/mo** | **$0.59** | **$7.40** | **7.4%** |
| $9/mo | $0.62 | $8.38 | 6.9% |
| $12/mo | $0.73 | $11.27 | 6.1% |

### Annual Plans (Single Transaction)

| Price | Stripe Fee | Net Revenue | Fee % |
|-------|------------|-------------|-------|
| $49.99/yr | $2.10 | $47.89 | 4.2% |
| **$59.99/yr** | **$2.46** | **$57.53** | **4.1%** |
| $69.99/yr | $2.82 | $67.17 | 4.0% |

**Key Finding**: The $0.30 fixed fee is devastating at low price points. At $3/mo, fees consume 13.7%. At $7.99/mo, fees are a reasonable 7.4%. Annual plans dramatically reduce effective fees to ~4%.

---

## 4. Willingness-to-Pay Research

### By Usage Frequency

| Usage Pattern | Willing to Pay |
|---------------|----------------|
| < 1x/week | $4.90/mo |
| 1x/week to 1x/day | $5.90/mo |
| Daily (60+ min) | $21.95-35/mo |
| Multiple times/day | $23.49-41/mo |

### Key Demographics

- **Gen Z & Millennials**: 59% of astrology app users, 80% of Gen Z believe in astrology
- **North America**: 35% of paid subscriptions, 53% of consumer spending
- **Daily engagement**: 48% engage with astrology apps daily

### Conversion Benchmarks

| Model | Good | Great |
|-------|------|-------|
| Freemium (self-serve) | 3-5% | 6-8% |
| Free trial (opt-in) | 8-12% | 15-25% |
| Free trial (opt-out) | ~18% | ~49% |

**Expected Signal conversion**: 3-5% freemium, potentially higher with strong free tier + compelling upgrade path.

---

## 5. Pricing Recommendation

### Recommended: $7.99/mo, $59.99/yr

| Attribute | Value |
|-----------|-------|
| Monthly | $7.99 |
| Annual | $59.99 (save 37%) |
| Annual effective | $5.00/mo |
| Stripe Product Name | Signal Insight |

### Why This Price Point

1. **Competitive positioning**: Below CHANI ($11.99), Hallow ($9.99), at Aura annual level
2. **Fee efficiency**: 7.4% fee (vs 13.7% at $3/mo)
3. **Psychological threshold**: Under $10/mo, under $60/yr
4. **Margin health**: API costs are <2% even at heavy usage
5. **Annual incentive**: 37% discount drives annual conversion, reduces churn
6. **Charm pricing**: $7.99 outperforms $8.00 by up to 24%

### Unit Economics at $7.99/mo

| Metric | Value |
|--------|-------|
| Gross revenue | $7.99 |
| Stripe fee | -$0.59 |
| API cost (medium user) | -$0.05 |
| **Net margin** | **$7.35 (92%)** |

### Unit Economics at $59.99/yr

| Metric | Value |
|--------|-------|
| Gross revenue | $59.99 |
| Stripe fee | -$2.46 |
| API cost (medium user x 12) | -$0.64 |
| **Net margin** | **$56.89 (95%)** |

---

## 6. Alternative Pricing Options

### Option A: Premium Positioning ($9.99/mo, $79.99/yr)

**Pros**: Higher ARPU, positions with Hallow/Headspace tier
**Cons**: May limit conversion, exceeds occasional user willingness-to-pay
**When to choose**: If Signal has substantial differentiating features

### Option B: Accessible Entry ($5.99/mo, $49.99/yr)

**Pros**: Maximizes conversion, matches Nebula annual
**Cons**: Lower ARPU, higher fee % at monthly level
**When to choose**: If prioritizing user growth over revenue

### Option C: Value Leader ($4.99/mo, $39.99/yr)

**Pros**: Undercuts all competitors, maximizes accessibility
**Cons**: 9.6% fees at monthly, may signal "cheap" quality
**When to choose**: Only with very high volume strategy

---

## 7. Implementation Checklist

### Stripe Setup

1. Create Stripe Product: "Signal Insight"
2. Create Price: $7.99/mo recurring
3. Create Price: $59.99/yr recurring (mark as default)
4. Configure Customer Portal for self-service management
5. Set up webhooks for subscription lifecycle events

### Free Tier Value (to drive conversions)

- Base meanings from Numbers library
- Sighting logging with mood/notes
- Heatmap and streak tracking
- Collection stats

### Paid Tier Value

- AI-generated personalized interpretations
- Pattern insights based on history
- Surprise & delight moments
- Full interpretation history

---

## 8. Future Considerations

### Pricing Evolution

- **A/B test** $7.99 vs $8.99 monthly after launch
- **Monitor conversion** and adjust annual discount (currently 37%)
- **Consider lifetime** option at $179-249 after proving retention

### Cost Optimization

- **Prompt caching**: Could reduce API costs by 90% on system prompts
- **Batch API**: 50% discount for non-real-time use cases
- **Model tuning**: Haiku-only option for cost-sensitive scenarios

### Revenue Expansion

- **Premium tier**: $12.99/mo for additional features (journal, export, advanced patterns)
- **Per-reading upsell**: $0.99 for on-demand detailed reading
- **Family plan**: $99.99/yr for household

---

## Sources

### Competitor Pricing
- CHANI: chaninicholas.zendesk.com
- Hallow: apps.apple.com, contrary.com research
- Nebula: apps.apple.com, lunarguide review
- Insight Timer: insighttimer.com
- Aura: aurahealth.io

### API Pricing
- Anthropic: platform.claude.com/docs/en/about-claude/pricing

### Stripe Fees
- Stripe: stripe.com/pricing, stripe.com/billing/pricing

### Market Research
- RevenueCat State of Subscription Apps 2024/2025
- Grand View Research: Spiritual Wellness Apps Market
- SBI Growth: Headspace & Calm Pricing Teardown
- McKinsey: Future of Wellness Trends
