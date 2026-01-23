# WavePoint Architecture Evaluation & Recommendations

## Executive Summary

**Overall Assessment**: WavePoint is a well-architected MVP-stage SaaS application with strong foundations. The codebase demonstrates excellent domain separation, consistent patterns, and thoughtful design decisions. However, several gaps exist for production-scale operations.

**Monorepo Verdict**: **Not recommended at this time.** The current single-app architecture works well with clear internal module boundaries. Monorepo migration would add complexity without proportional benefit until you need multiple deployment targets (mobile app, admin dashboard) or team-based code ownership.

---

## Current State Analysis

### Architecture Score: 4/5

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Domain Separation | Excellent | geometry, numbers, signal, shop cleanly isolated |
| Code Coupling | Excellent | One-directional dependencies, no circular imports |
| Type Safety | Strong | Strict TypeScript, Zod validation, minimal `any` |
| Testing | Good | 264 test files, but API route coverage gaps |
| Configuration | Excellent | Centralized env validation, clean build config |

### SaaS Maturity Score: 2/5 (MVP Stage)

| Dimension | Rating | Gap |
|-----------|--------|-----|
| Authentication | 2/5 | Credentials-only, no RBAC beyond admin boolean |
| Multi-tenancy | 1/5 | Single-tenant only, no workspace/team support |
| Billing | 2.5/5 | Basic Stripe lifecycle, missing enterprise features |
| Feature Flags | 1/5 | Env vars only, no targeting or gradual rollout |
| Rate Limiting | 2/5 | In-memory only, serverless vulnerable |
| Data Modeling | 3/5 | Good for single-tenant, audit/compliance gaps |

---

## Critical Recommendations

### Priority 1: Production Hardening (Pre-Launch)

#### 1.1 Upgrade from Next-auth Beta
**Risk**: `next-auth@5.0.0-beta.30` is a critical path dependency
**Action**: Monitor for stable release or pin to known-working beta version with extensive testing
**Files**: `package.json`, auth integration points

#### 1.2 Distributed Rate Limiting
**Risk**: Current in-memory rate limiting resets on serverless cold starts
**Action**: Migrate to Redis-based rate limiting (Upstash recommended for Vercel)
**Files**: `src/lib/signal/rate-limit.ts`

```typescript
// Current (vulnerable)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

// Target (distributed)
// Use @upstash/ratelimit with Redis
```

#### 1.3 Add Error Boundaries
**Risk**: Component errors crash entire page
**Action**: Add React error boundaries around Signal, Shop, and Auth features
**Files**: New `src/components/error-boundary.tsx`, wrap features in layouts

### Priority 2: Short-term Improvements (First Quarter)

#### 2.1 Centralize Feature Flags
**Current**: Scattered across `lib/shop/feature-flags.ts`, `lib/signal/feature-flags.ts`
**Action**: Create unified feature flag service with potential for runtime toggles

```
src/lib/feature-flags/
├── index.ts          # Unified exports
├── flags.ts          # All flag definitions
├── context.tsx       # React context for client-side
└── server.ts         # Server-side evaluation
```

#### 2.2 Extend API Route Testing
**Gap**: Webhook handlers and checkout flow lack tests
**Priority**: `src/app/api/webhooks/stripe/route.ts`, `src/app/api/signal/webhooks/`
**Action**: Add integration tests with Stripe test mode

#### 2.3 Add Security Headers
**Missing**: CSP, X-Frame-Options, referrer policy
**Action**: Configure in `next.config.js` headers section

#### 2.4 Harden Printful Parsing
**Risk**: `parseVariantName()` relies on exact Printful format
**Action**: Add monitoring/alerting when parsing fails, add regression tests

### Priority 3: Medium-term Enhancements (First Year)

#### 3.1 Role-Based Access Control (RBAC)
**Need**: Beyond binary admin flag for future team/enterprise features
**Design**:
- Add `role` field to users table (`member`, `admin`, `owner`)
- Create permission checking middleware
- Update authorization checks across routes

#### 3.2 Subscription Enhancements
**Gaps**: No trials, no proration, no metering, no dunning
**Staged Approach**:
1. Add trial period support
2. Implement subscription change proration
3. Add usage metering for future tiers

#### 3.3 Audit Logging
**Need**: Compliance and debugging for data changes
**Design**: Event log table with: `userId`, `action`, `resourceType`, `resourceId`, `metadata`, `timestamp`

---

## Monorepo Analysis

### Why NOT Now

1. **No deployment diversity**: Single Next.js app serves all needs
2. **Domain boundaries already clean**: Module separation is excellent
3. **Team size**: No code ownership conflicts requiring package isolation
4. **Build complexity**: Turborepo/Nx adds maintenance overhead

### When to Reconsider

Migrate to monorepo **only if**:
- Building native mobile app needing shared business logic
- Creating separate admin dashboard with independent deployment
- Team grows to 5+ developers needing clear package ownership
- Different features need independent versioning/deployment cycles

### If/When Migrating

```
wavepoint/
├── apps/
│   └── web/                 # Current Next.js app
├── packages/
│   ├── geometry/            # @wavepoint/geometry (pure data)
│   ├── numbers/             # @wavepoint/numbers (pure data)
│   ├── signal-core/         # @wavepoint/signal (business logic)
│   ├── shop-core/           # @wavepoint/shop (business logic)
│   ├── db/                  # @wavepoint/db (Drizzle + queries)
│   ├── ui/                  # @wavepoint/ui (shadcn + theme)
│   └── config/              # @wavepoint/config (shared)
└── tooling/
    ├── eslint-config/
    ├── typescript-config/
    └── vitest-config/
```

---

## Technical Debt Register

| Item | Severity | Location | Notes |
|------|----------|----------|-------|
| Next-auth beta | High | `package.json` | Critical path dependency |
| In-memory rate limiting | High | `lib/signal/rate-limit.ts` | Serverless vulnerable |
| Stripe webhook type cast | Medium | `api/webhooks/stripe/route.ts:17-21` | `as unknown` for API version handling |
| Printful name parsing | Medium | `lib/shop/printful.ts:41-59` | Fragile string splitting |
| Scattered feature flags | Medium | Multiple files | No centralization |
| Missing error boundaries | Medium | Component tree | No feature isolation |
| API route test coverage | Low | `src/app/api/` | Webhook handlers untested |
| Missing CSP headers | Low | `next.config.js` | Security headers absent |

---

## Strengths to Preserve

1. **Domain isolation**: Keep geometry/numbers/signal/shop as separate modules
2. **Type safety**: Maintain strict TypeScript, Zod validation
3. **Env validation**: Keep centralized `src/env.js` pattern
4. **React Query patterns**: Continue query key factories in `src/hooks/*/query-keys.ts`
5. **Graceful degradation**: Claude API fallbacks, feature flag defaults

---

## Implementation Roadmap

### Phase 1: Production Hardening (2-3 weeks)
- [ ] Add distributed rate limiting (Upstash Redis)
- [ ] Add error boundaries to feature domains
- [ ] Add CSP and security headers
- [ ] Add Printful parsing monitoring

### Phase 2: Developer Experience (2-3 weeks)
- [ ] Centralize feature flags
- [ ] Add API route integration tests
- [ ] Add bundle analysis tooling
- [ ] Document rate limit configuration

### Phase 3: SaaS Maturity (4-6 weeks)
- [ ] Implement RBAC foundation
- [ ] Add subscription trial support
- [ ] Add audit logging
- [ ] Upgrade Next-auth when stable

### Phase 4: Scale Readiness (as needed)
- [ ] Evaluate monorepo if deployment diversity needed
- [ ] Add multi-tenancy if B2B market demand emerges
- [ ] Add usage metering for premium tiers

---

## Files to Review

Critical files for understanding current architecture:
- `src/env.js` - Environment validation
- `src/lib/db/schema.ts` - Data model
- `src/lib/signal/rate-limit.ts` - Rate limiting implementation
- `src/lib/shop/feature-flags.ts` - Feature flag pattern
- `package.json` - Dependencies (note Next-auth beta)
