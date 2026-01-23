# Stripe Subscription System for Signal

## Summary

Add paid subscription tier to Signal. Free users can capture sightings with base meanings; Pro users get AI interpretations + 10 regenerations/month.

## Requirements (Confirmed)

| Requirement | Decision |
|-------------|----------|
| Free tier | Capture sightings, base meanings only, NO AI |
| Pro tier | Unlimited AI interpretations + 10 regenerations/month |
| Pricing | Configurable via Stripe Dashboard (not hardcoded) |
| Trial | None |
| Migration | Not needed (soft launch, no existing users) |

## Architecture

**Approach:** Minimal subscription table with Stripe as source of truth. Store essential data locally for fast gating checks; treat Stripe as canonical source.

## Files to Create

### 1. `src/lib/subscriptions/types.ts`
TypeScript interfaces for subscription domain.

### 2. `src/lib/subscriptions/queries.ts`
Database queries:
- `getUserSubscription(userId)` - Get subscription record
- `hasActiveSubscription(userId)` - Fast boolean check
- `getUsageForPeriod(userId, periodStart)` - Get/create usage record
- `incrementRegenerations(userId, periodStart)` - Increment counter
- `upsertSubscription(data)` - Create/update from webhook

### 3. `src/lib/subscriptions/stripe.ts`
Stripe operations:
- `getOrCreateStripeCustomer(user)` - Link user to Stripe
- `createSubscriptionCheckout(userId, priceId, origin)` - Create checkout session
- `createPortalSession(customerId, returnUrl)` - Billing portal

### 4. `src/lib/subscriptions/feature-gate.ts`
Gating functions:
- `canUseAiInterpretations(userId)` - Check Pro status
- `canRegenerate(userId)` - Check Pro + under 10/month limit

### 5. `src/lib/subscriptions/index.ts`
Barrel exports.

### 6. `src/app/api/subscriptions/checkout/route.ts`
POST: Create Stripe checkout session for subscription.

### 7. `src/app/api/subscriptions/portal/route.ts`
POST: Create billing portal session.

### 8. `src/app/api/subscriptions/status/route.ts`
GET: Return user's subscription status + usage.

## Files to Modify

### 1. `src/lib/db/schema.ts`

Add to `users` table:
```typescript
stripeCustomerId: text("stripe_customer_id").unique(),
```

Add new tables:
```typescript
// One subscription per user
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: text("status").notNull(), // active, canceled, past_due, etc.
  currentPeriodStart: timestamp("current_period_start", { mode: "date" }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { mode: "date" }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// Usage tracking per billing period
export const subscriptionUsage = pgTable("subscription_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  periodStart: timestamp("period_start", { mode: "date" }).notNull(),
  regenerationsUsed: integer("regenerations_used").notNull().default(0),
}, (table) => [
  unique("subscription_usage_user_period_unique").on(table.userId, table.periodStart),
  index("subscription_usage_user_id_idx").on(table.userId),
]);
```

### 2. `src/app/api/webhooks/stripe/route.ts`

Extend switch statement with subscription events:
- `checkout.session.completed` (mode: subscription) - Link customer, create subscription record
- `customer.subscription.updated` - Upsert subscription status/dates
- `customer.subscription.deleted` - Mark as canceled
- `invoice.payment_failed` - Update status to past_due (optional)

### 3. `src/app/api/signal/sightings/route.ts`

Before calling `generateInterpretation()` (~line 89):
```typescript
const isPro = await canUseAiInterpretations(session.user.id);

if (!isPro) {
  // Skip Claude API, use base meaning
  const baseMeaning = getBaseMeaning(validated.number);
  return NextResponse.json({
    sighting,
    interpretation: baseMeaning,
    isPro: false,
    isFirstCatch,
    count,
  });
}

// Existing Claude flow for Pro users...
```

### 4. `src/app/api/signal/interpret/route.ts`

Before regeneration (~line 62):
```typescript
const regenCheck = await canRegenerate(session.user.id);

if (!regenCheck.allowed) {
  return NextResponse.json({
    error: "Monthly regeneration limit reached",
    code: "REGEN_LIMIT_REACHED",
    remaining: 0,
    resetsAt: regenCheck.resetsAt,
  }, { status: 403 });
}

// After successful regeneration:
await incrementRegenerations(session.user.id, regenCheck.periodStart);
// Include in response: regenerationsRemaining: regenCheck.remaining - 1
```

## Environment Variables

No new required variables. Existing Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are sufficient.

Optional (for convenience, can hardcode instead):
```typescript
STRIPE_PRO_MONTHLY_PRICE_ID: z.string().startsWith("price_").optional(),
STRIPE_PRO_YEARLY_PRICE_ID: z.string().startsWith("price_").optional(),
```

## Stripe Dashboard Setup (Manual)

1. Create Product: "Signal Pro"
2. Create Prices:
   - Monthly: $X/month (recurring)
   - Yearly: $Y/year (recurring)
3. Configure Customer Portal (Settings > Billing > Customer Portal)
4. Add webhook endpoint for production: `https://yoursite.com/api/webhooks/stripe`
5. Add events to webhook:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

## Build Sequence

### Phase 1: Database Schema
1. Modify `src/lib/db/schema.ts` with changes above
2. Run `npx drizzle-kit push`
3. Run `pnpm check`

### Phase 2: Subscriptions Library
1. Create `src/lib/subscriptions/types.ts`
2. Create `src/lib/subscriptions/queries.ts`
3. Create `src/lib/subscriptions/stripe.ts`
4. Create `src/lib/subscriptions/feature-gate.ts`
5. Create `src/lib/subscriptions/index.ts`
6. Run `pnpm check`

### Phase 3: API Routes
1. Create `src/app/api/subscriptions/checkout/route.ts`
2. Create `src/app/api/subscriptions/portal/route.ts`
3. Create `src/app/api/subscriptions/status/route.ts`
4. Run `pnpm check`

### Phase 4: Webhook Extensions
1. Extend `src/app/api/webhooks/stripe/route.ts`
2. Run `pnpm check`

### Phase 5: Feature Gating
1. Modify `src/app/api/signal/sightings/route.ts`
2. Modify `src/app/api/signal/interpret/route.ts`
3. Run `pnpm check`

## Verification

### Manual Testing

1. **Free user sighting creation:**
   ```bash
   # Create sighting as user without subscription
   # Should return base meaning, isPro: false
   ```

2. **Subscription checkout flow:**
   ```bash
   # Start Stripe CLI listener
   stripe listen --forward-to localhost:3000/api/webhooks/stripe

   # Create checkout session via API
   # Complete checkout in browser
   # Verify webhook creates subscription record
   ```

3. **Pro user sighting creation:**
   ```bash
   # Create sighting as subscribed user
   # Should return AI interpretation, isPro: true
   ```

4. **Regeneration with limits:**
   ```bash
   # Regenerate interpretation 10 times
   # 11th should return 403 with REGEN_LIMIT_REACHED
   ```

5. **Subscription cancellation:**
   ```bash
   # Cancel via portal
   # Verify webhook updates status
   # Verify user reverts to free behavior
   ```

### Automated Tests

```bash
pnpm test
```

Key test cases:
- `canUseAiInterpretations` returns false for no subscription
- `canUseAiInterpretations` returns true for active subscription
- `canRegenerate` returns false when limit reached
- Usage counter resets on new period
- Webhook upserts subscription correctly

## Key Design Decisions

1. **Stripe as source of truth** - Local DB is cache, webhooks update it
2. **Fail open for sightings** - If subscription check fails, user still captures (gets base meaning)
3. **Regeneration limit in DB** - Simpler than Stripe usage metering
4. **No client-side subscription state** - Always fetch fresh from API
5. **Single subscription per user** - No multi-subscription support needed
