# WavePoint Infrastructure Maturity Plan

## Overview

Mature WavePoint's development, staging, and production infrastructure to support team growth, Claude Code-driven development, and industry best practices.

**Current State:**
- Single Neon PostgreSQL database (shared prod/dev)
- In-memory rate limiting (not scalable)
- Vercel deployment from main branch only
- GitHub Actions CI (lint/typecheck/tests)

**Target State:**
- Neon branch per environment (dev/staging/prod)
- Upstash Redis for rate limiting (free tier for dev, paid for prod)
- Staging environment with separate database
- Enhanced CI/CD with containers for testing
- Comprehensive developer onboarding

---

## Principal Review Findings (DevOps + Architect)

### Critical Issue #1: Database Driver Incompatibility (HIGH RISK)

The current codebase uses `@neondatabase/serverless` with `neon-http` driver exclusively:
```typescript
// src/lib/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
```

**Problem:** The plan proposes PostgreSQL containers in CI, but the Neon HTTP driver only works with Neon's HTTP protocol, not standard PostgreSQL. Running CI tests against PostgreSQL containers will fail.

**Resolution Options:**
1. **Neon Branching for CI** - Use ephemeral Neon branches instead of local containers (adds ~2-3s per branch creation)
2. **Conditional Driver Factory** - Create abstraction that uses `neon-http` in prod and `postgres-js` in CI
3. **Skip Database Tests in CI** - Continue current pattern (mocking db in unit tests)

**Recommended:** Option 3 for now (skip database containers in CI) - the current CI works and database tests are mocked. Add integration tests later with Neon branches.

### Critical Issue #2: Rate Limiter Race Conditions (HIGH RISK)

The proposed Redis implementation uses manual INCR/EXPIRE which has a classic race condition:
```
T0: Instance A reads count=29 (limit=30)
T1: Instance B reads count=29 (limit=30)
T2: Both increment - count exceeds limit
```

**Resolution:** Use `@upstash/ratelimit` library instead of manual Redis commands. It handles atomic operations properly via Lua scripting.

### Critical Issue #3: Fail-Open Required (HIGH RISK)

If Upstash is unavailable (quota exceeded, network issues), all requests will 500 error.

**Resolution:** Add try/catch with fail-open pattern:
```typescript
try {
  return await checkRateLimitRedis(...);
} catch (error) {
  console.error("Rate limit check failed:", error);
  return { allowed: true, remaining: -1, resetAt: Date.now() + 60000 };
}
```

### Critical Issue #4: Rate Limiter Module Location (MEDIUM)

Rate limiter is in `src/lib/signal/rate-limit.ts` but used by non-Signal routes:
- `/api/auth/register`
- `/api/contact`
- `/api/waitlist`

**Resolution:** Plan already proposes moving to `src/lib/rate-limit/`. Update all imports.

### Critical Issue #5: Upstash Free Tier Limits (MEDIUM)

Free tier: 10,000 commands/day. Each rate check = 2-3 commands = ~3,333 checks/day.

**Resolution:** Document limit in plan. Plan upgrade to Pro ($10/mo, 10M commands) before production launch.

### Missing from Plan (P2 Items)

1. **Secrets Rotation Procedures** - No documentation for rotating API keys
2. **Database Backup Strategy** - No mention of Neon backup configuration
3. **Monitoring/Alerting** - No observability for rate limit exhaustion
4. **Rollback Procedures** - No documentation for emergency rollbacks
5. **Disaster Recovery Runbook** - No DR documentation

---

## Architecture Decisions

### 1. Local Development: Cloud-First (No Docker)

**Decision:** Developers use Neon dev branch + Upstash free tier directly. No local containers.

**Rationale:**
- Zero local infrastructure to manage
- Same services as production (just different branches/tiers)
- Simplest onboarding: just configure `.env.local`
- Free tiers are generous for development

### 2. CI: Container Services in GitHub Actions

**Decision:** PostgreSQL + Redis containers for CI testing

**Rationale:**
- Fast (~0.5s startup vs cloud API calls)
- Deterministic (fresh DB every run)
- Free (no API quota usage)
- Isolated per job

### 3. Rate Limiting: Upstash Redis

**Decision:** Upstash Redis (serverless) with in-memory fallback

**Rationale:**
- HTTP-based (works in serverless/Edge)
- Pay-per-request pricing
- Free tier (10k requests/day) for development
- Falls back to in-memory if not configured

### 4. Environment Strategy

| Environment | Database | Redis | Stripe |
|-------------|----------|-------|--------|
| **Local Dev** | Neon dev branch | Upstash (shared) / in-memory | Test keys |
| **CI** | Mocked | Mocked | Mocked |
| **Staging** | Neon staging branch | Upstash (shared) | Test keys |
| **Production** | Neon main | Upstash (shared) | Live keys |

**Note:** Upstash free tier only allows one database, so all environments share the same Redis instance. Rate limit keys are namespaced and include identifiers (user ID, IP, action type) that naturally separate environments.

---

## Implementation Plan

### Phase 1: Local Development Environment

**Goal:** Enable developers to run locally without Docker

#### 1.1 Create Neon Development Branch

In Neon dashboard:
1. Go to project → Branches
2. Create branch `development` from `main`
3. Note the connection string

#### 1.2 Set Up Upstash Account

1. Create account at upstash.com
2. Create Redis database (free tier)
3. Note `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

#### 1.3 Update Environment Variables

**File:** `src/env.js`

Add new variables:
```javascript
// Server-side
UPSTASH_REDIS_REST_URL: z.string().url().optional(),
UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
```

#### 1.4 Create .env.local.example

**File:** `.env.local.example`

```bash
# ===========================================
# WavePoint Local Development Configuration
# ===========================================

# Database (Neon)
# Create a dev branch at: https://console.neon.tech
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Redis (Upstash) - Optional, falls back to in-memory
# Create free database at: https://console.upstash.com
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# Authentication
AUTH_SECRET="development-secret-minimum-32-characters-here"

# Stripe (Test Mode)
# Get test keys from: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Optional Services
PRINTFUL_API_KEY=""
ANTHROPIC_API_KEY=""
BREVO_API_KEY=""

# Feature Flags
NEXT_PUBLIC_SHOP_ENABLED="true"
NEXT_PUBLIC_AUTH_ENABLED="true"
NEXT_PUBLIC_SIGNAL_ENABLED="true"
NEXT_PUBLIC_INVITES_REQUIRED="false"

# App URL
APP_URL="http://localhost:3000"
```

#### 1.5 Update package.json Scripts

**File:** `package.json`

Add/update scripts:
```json
{
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:studio": "drizzle-kit studio",
    "db:seed": "npx tsx scripts/seed.ts",
    "setup": "pnpm install && cp -n .env.local.example .env.local || true && echo 'Configure .env.local with your Neon and Upstash credentials'",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe",
    "stripe:listen:signal": "stripe listen --forward-to localhost:3000/api/signal/webhooks/stripe"
  }
}
```

**Note:** Fix `stripe:listen` port from 3001 → 3000

---

### Phase 2: Rate Limiting with Upstash Redis

**Goal:** Replace in-memory rate limiting with Redis-backed (production-ready)

#### 2.1 Install Upstash Ratelimit

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

**Note:** Use `@upstash/ratelimit` (not manual Redis commands) to avoid race conditions. It uses atomic Lua scripts internally.

#### 2.2 Create Rate Limiter Abstraction

**File:** `src/lib/rate-limit/index.ts`

```typescript
import { env } from "@/env";

// In-memory fallback for local development without Upstash
const localLimits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  /** Max requests per window (default: 30) */
  limit?: number;
  /** Window duration in ms (default: 60000 = 1 minute) */
  windowMs?: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// Upstash Ratelimiter (lazy-loaded) - uses atomic Lua scripts to prevent race conditions
let ratelimiter: import("@upstash/ratelimit").Ratelimit | null = null;

async function getRatelimiter(limit: number, windowMs: number) {
  if (!ratelimiter && env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Sliding window algorithm - more accurate than fixed window
    ratelimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
      analytics: true, // Optional: track usage in Upstash dashboard
    });
  }
  return ratelimiter;
}

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const { limit = 30, windowMs = 60000 } = options;
  const now = Date.now();

  // Try Upstash first with fail-open pattern
  try {
    const limiter = await getRatelimiter(limit, windowMs);

    if (limiter) {
      const result = await limiter.limit(key);
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetAt: result.reset,
      };
    }
  } catch (error) {
    // Fail open - log error but don't block requests
    console.error("[rate-limit] Upstash error, failing open:", error);
    return { allowed: true, remaining: -1, resetAt: now + windowMs };
  }

  // Fallback: In-memory (local dev without Upstash)
  const record = localLimits.get(key);

  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    localLimits.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}
```

**Key improvements over manual Redis commands:**
1. **No race conditions** - Uses atomic Lua scripts via `@upstash/ratelimit`
2. **Fail-open pattern** - If Redis fails, requests are allowed (with logging)
3. **Sliding window** - More accurate rate limiting than fixed windows
4. **Analytics** - Usage visible in Upstash dashboard

#### 2.3 Update Signal Rate Limiting

**File:** `src/lib/signal/rate-limit.ts`

Replace current implementation:
```typescript
/**
 * Rate limiting for Signal API routes.
 * Uses Upstash Redis in production, falls back to in-memory locally.
 */
export { checkRateLimit } from "@/lib/rate-limit";
```

#### 2.4 Update API Routes

The current `checkRateLimit` is synchronous. The new version is async.
Update all usages in `src/app/api/signal/` routes to `await checkRateLimit(...)`.

---

### Phase 3: Staging Environment

**Goal:** Create isolated staging environment

#### 3.1 Create Neon Staging Branch

In Neon dashboard:
1. Go to your project → Branches
2. Click "Create Branch"
3. Name: `staging`
4. Parent: `main`
5. Note the connection string (will look like `postgresql://...@ep-xxx-staging.../neondb`)

#### 3.2 Configure Vercel Environment Variables

**Understanding Vercel Scopes:**

Vercel has three environment scopes:
- **Production** - Only the production branch (main)
- **Preview** - All preview deployments (PRs, staging branch, feature branches)
- **Development** - Only `vercel dev` command (rarely used)

**Step-by-Step Setup:**

**A. Navigate to Environment Variables**
1. Open Vercel Dashboard → Your Project
2. Go to Settings → Environment Variables

**B. Categorize Your Current Variables**

| Variable | Scope Strategy | Notes |
|----------|----------------|-------|
| `DATABASE_URL` | Different per scope | Prod uses main, Preview uses staging |
| `AUTH_SECRET` | Can share or separate | Same is fine, separate is more secure |
| `STRIPE_SECRET_KEY` | Different per scope | `sk_live_*` (prod) vs `sk_test_*` (preview) |
| `STRIPE_WEBHOOK_SECRET` | Different per scope | Different webhook endpoints |
| `STRIPE_SIGNAL_WEBHOOK_SECRET` | Different per scope | Different webhook endpoints |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Different per scope | `pk_live_*` vs `pk_test_*` |
| `PRINTFUL_API_KEY` | Share (Prod + Preview) | Same API key works |
| `ANTHROPIC_API_KEY` | Share (Prod + Preview) | Same API key works |
| `BREVO_API_KEY` | Share (Prod + Preview) | Same API key works |
| `APP_URL` | Different per scope | Domain differs |
| `UPSTASH_REDIS_REST_URL` | Share or separate | Free tier can be shared |
| `UPSTASH_REDIS_REST_TOKEN` | Share or separate | Free tier can be shared |
| Feature flags (`NEXT_PUBLIC_*_ENABLED`) | Share (Prod + Preview) | Usually same behavior |

**C. Update Shared Variables**

For each variable that should work in BOTH production and staging:
1. Click the variable
2. Check both ☑️ Production AND ☑️ Preview
3. Save

**D. Add Staging-Specific Overrides**

For variables that need different staging values, add NEW entries:

1. **Staging DATABASE_URL:**
   - Click "Add New"
   - Name: `DATABASE_URL`
   - Value: Your Neon staging branch connection string
   - Environments: ☑️ Preview only
   - Save

2. **Staging Stripe Keys:**
   - Add `STRIPE_SECRET_KEY` with `sk_test_...` → ☑️ Preview only
   - Add `STRIPE_WEBHOOK_SECRET` with test webhook secret → ☑️ Preview only
   - Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` with `pk_test_...` → ☑️ Preview only

3. **Staging APP_URL:**
   - Add `APP_URL` with `https://staging.wavepoint.space` → ☑️ Preview only

**E. Final Variable Matrix**

After setup, you should have:

| Variable | Production Value | Preview Value |
|----------|------------------|---------------|
| `DATABASE_URL` | Neon main branch | Neon staging branch |
| `STRIPE_SECRET_KEY` | `sk_live_...` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Live webhook secret | Test webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` |
| `APP_URL` | `https://wavepoint.space` | `https://staging.wavepoint.space` |
| `PRINTFUL_API_KEY` | (shared) | (shared) |
| `ANTHROPIC_API_KEY` | (shared) | (shared) |
| (etc.) | | |

**F. Verify Configuration**

Use Vercel CLI to verify:
```bash
# List all env vars and their scopes
vercel env ls

# Pull production env vars
vercel env pull .env.production.local --environment=production

# Pull preview env vars
vercel env pull .env.preview.local --environment=preview
```

#### 3.3 Add Staging Domain

**Option A: Via Vercel Dashboard**
1. Go to Project → Settings → Domains
2. Add `staging.wavepoint.space`
3. In Git settings, configure the staging branch:
   - Project → Settings → Git
   - Under "Production Branch", keep `main`
   - The staging domain will automatically use preview deployments

**Option B: Via Branch-Specific Domain**
1. Go to Project → Deployments
2. Find a deployment from `staging` branch
3. Click "..." → "Assign Domain"
4. Enter `staging.wavepoint.space`
5. This creates a permanent alias for staging branch deployments

**DNS Configuration:**
If you manage DNS separately, add a CNAME record:
- Name: `staging`
- Value: `cname.vercel-dns.com`

#### 3.4 Create Staging Git Branch

```bash
# Create staging branch from main
git checkout main
git pull origin main
git checkout -b staging
git push -u origin staging
```

#### 3.5 Configure Stripe Staging Webhooks

**In Stripe Dashboard (Test Mode):**

1. Switch to Test Mode (toggle in top-right)
2. Go to Developers → Webhooks → Add endpoint

**Shop Webhook:**
- Endpoint URL: `https://staging.wavepoint.space/api/webhooks/stripe`
- Events to send:
  - `checkout.session.completed`
- Copy the signing secret → Use as `STRIPE_WEBHOOK_SECRET` (Preview scope)

**Signal Subscription Webhook:**
- Endpoint URL: `https://staging.wavepoint.space/api/signal/webhooks/stripe`
- Events to send:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
- Copy the signing secret → Use as `STRIPE_SIGNAL_WEBHOOK_SECRET` (Preview scope)

---

### Phase 4: CI/CD Enhancements

**Goal:** Improve CI pipeline with build verification and E2E tests

**Important Note:** The codebase uses `@neondatabase/serverless` with `neon-http` driver, which only works with Neon's HTTP protocol. Standard PostgreSQL containers in CI will NOT work without significant refactoring. Current tests mock the database, which is the correct pattern for unit tests.

#### 4.1 Update GitHub Actions

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main, staging]
  push:
    branches: [main, staging]

env:
  SKIP_ENV_VALIDATION: true

jobs:
  check:
    name: Lint, Type Check & Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm test

  build:
    name: Build Verification
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Build
        run: pnpm build
        env:
          SKIP_ENV_VALIDATION: true

  e2e:
    name: E2E Tests
    needs: [check, build]
    if: github.base_ref == 'staging' || github.base_ref == 'main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          SKIP_ENV_VALIDATION: true
          # E2E tests use Playwright against built app
          # Database calls are either mocked or use staging Neon branch
```

**Note on Database Testing:**
- Unit tests: Mock database (current pattern, keeps working)
- E2E tests: Can use staging Neon branch if needed
- Integration tests: Future enhancement - use Neon branching API to create ephemeral branches

**Future Enhancement (Optional):**
For true database integration tests, use Neon's branching API:
```yaml
  integration:
    name: Integration Tests (Database)
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ secrets.NEON_PROJECT_ID }}
          api_key: ${{ secrets.NEON_API_KEY }}
          branch_name: ci-${{ github.run_id }}
          parent: staging
      # ... run tests against ephemeral branch
      - name: Delete Neon Branch
        if: always()
        run: |
          curl -X DELETE "https://console.neon.tech/api/v2/projects/${{ secrets.NEON_PROJECT_ID }}/branches/ci-${{ github.run_id }}" \
            -H "Authorization: Bearer ${{ secrets.NEON_API_KEY }}"
```

#### 4.2 Configure Branch Protection

**GitHub → Settings → Branches → Branch protection rules**

**main branch:**
- Require pull request reviews: 1 approval
- Require status checks to pass:
  - `check`
  - `migration-check`
  - `e2e`
- Require branches to be up to date

**staging branch:**
- Require pull request reviews: 1 approval
- Require status checks to pass:
  - `check`
  - `migration-check`

---

### Phase 5: Developer Experience

**Goal:** Comprehensive onboarding documentation

#### 5.1 Create CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

```markdown
# Contributing to WavePoint

## Prerequisites

- Node.js 24+ (`nvm install` from repo root)
- pnpm 9.7.1+ (`npm install -g pnpm@9.7.1`)
- Stripe CLI (`brew install stripe/stripe-cli/stripe`)
- Neon account (free tier)
- Upstash account (free tier, optional)

## Quick Start

1. **Clone and install:**
   ```bash
   git clone git@github.com:your-org/wavepoint.git
   cd wavepoint
   pnpm install
   ```

2. **Set up cloud services:**
   - Create Neon dev branch at https://console.neon.tech
   - (Optional) Create Upstash Redis at https://console.upstash.com

3. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Push database schema:**
   ```bash
   pnpm db:push
   ```

5. **Start development:**
   ```bash
   pnpm dev
   ```

6. **(Optional) Stripe webhooks:**
   ```bash
   pnpm stripe:listen
   ```

## Development Workflow

### Feature Development

1. Create Linear issue (SG-XXX)
2. Create branch: `git checkout -b sg-xxx-feature-name`
3. Develop with `pnpm dev`
4. Commit with: `SG-XXX: Description`
5. Push and create PR to `staging`

### Database Changes

```bash
# 1. Modify src/lib/db/schema.ts
# 2. Push to your dev branch
pnpm db:push

# 3. Generate migration (before committing)
pnpm db:generate

# 4. Commit migration files with your changes
```

### Testing

```bash
pnpm test        # Unit tests
pnpm test:e2e    # E2E tests
pnpm check       # Lint + typecheck
```

## Architecture

See `CLAUDE.md` for full project context and conventions.
```

#### 5.2 Create ADR Directory

**File:** `docs/adr/0001-cloud-first-development.md`

```markdown
# ADR-0001: Cloud-First Local Development

**Status:** Accepted
**Date:** 2026-01-23

## Context

We needed to mature our development environment to separate local development from production while maintaining excellent DX.

## Decision

Use cloud services directly for local development:
- Neon PostgreSQL branches for database isolation
- Upstash Redis free tier for rate limiting
- No Docker required for local development

## Consequences

**Positive:**
- Zero local infrastructure to manage
- Same services as production
- Simple onboarding (just configure .env.local)
- Faster setup for new developers

**Negative:**
- Requires internet connection
- Each developer needs Neon/Upstash accounts
- Minor cost if exceeding free tiers
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/env.js` | Modify | Add Upstash env vars |
| `src/lib/rate-limit/index.ts` | Create | Redis abstraction with fail-open |
| `src/lib/signal/rate-limit.ts` | Modify | Re-export from new location |
| `src/lib/signal/index.ts` | Modify | Update re-export path |
| `src/app/api/signal/sightings/route.ts` | Modify | Add `await` to rate limit check |
| `src/app/api/signal/sightings/[id]/route.ts` | Modify | Add `await` to rate limit checks (2 locations) |
| `src/app/api/signal/interpret/route.ts` | Modify | Add `await` to rate limit check |
| `src/app/api/waitlist/route.ts` | Modify | Add `await` to rate limit check |
| `src/app/api/auth/register/route.ts` | Modify | Add `await` to rate limit check |
| `src/app/api/contact/route.ts` | Modify | Add `await` to rate limit check |
| `package.json` | Modify | Fix stripe port, add scripts, add dependencies |
| `.env.local.example` | Create | Developer template |
| `.github/workflows/ci.yml` | Modify | Add build step, E2E configuration |
| `CONTRIBUTING.md` | Create | Onboarding guide |
| `docs/adr/0001-cloud-first-development.md` | Create | Architecture decision |

## New Dependencies

- `@upstash/redis` - Serverless Redis client
- `@upstash/ratelimit` - Atomic rate limiting (prevents race conditions)

---

## Phased Rollout

### Phase 1: Local Development
- `.env.local.example` template
- Updated package.json scripts
- `CONTRIBUTING.md`

### Phase 2: Rate Limiting
- Install `@upstash/redis`
- Create rate limit abstraction
- Update API routes (async)

### Phase 3: Staging Environment
- Neon staging branch
- Vercel env vars per scope
- Staging domain
- Stripe staging webhooks

### Phase 4: CI/CD
- PostgreSQL + Redis services in GitHub Actions
- Migration check job
- E2E tests on PRs to main/staging
- Branch protection rules

### Phase 5: Observability (Future)
- Sentry error tracking
- Structured logging

---

## Verification Checklist

### Phase 1 Complete
- [ ] Developer can clone, configure `.env.local`, and run `pnpm dev`
- [ ] No Docker required
- [ ] `pnpm db:push` works against Neon dev branch
- [ ] `pnpm stripe:listen` forwards to correct port

### Phase 2 Complete
- [ ] Rate limiting works with Upstash in staging/prod
- [ ] Falls back to in-memory when Upstash not configured
- [ ] All Signal API routes use async rate limiting

### Phase 3 Complete
- [ ] `staging.wavepoint.space` deploys from staging branch
- [ ] Staging uses separate Neon branch
- [ ] Stripe test webhooks work in staging

### Phase 4 Complete
- [ ] Staging branch triggers (deferred)
- [ ] E2E tests run on PRs (deferred - Playwright issues)
- [ ] Branch protection enforced (manual GitHub configuration)

Note: Build verification handled by Vercel (automatic builds on every commit).

---

## External Account Setup

### Neon (Required)
1. Sign up at https://neon.tech
2. Create project (or use existing)
3. Create `development` branch from `main`
4. Copy connection string to `.env.local`

### Upstash (Optional but Recommended)
1. Sign up at https://upstash.com
2. Create Redis database (free tier)
3. Copy REST URL and token to `.env.local`

### Stripe (For Payment Features)
1. Get test API keys from https://dashboard.stripe.com/test/apikeys
2. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
3. Run `stripe login` to authenticate

---

## Operational Runbooks (Future Work)

These items are NOT required for initial implementation but should be documented before production launch:

### Secrets Rotation Checklist
- [ ] `AUTH_SECRET` - Requires re-signing all JWTs (coordinate user logout)
- [ ] `STRIPE_SECRET_KEY` - Rotate in Stripe dashboard, update Vercel
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Rotate in Upstash, update Vercel
- [ ] `ANTHROPIC_API_KEY` - Rotate in Anthropic console, update Vercel
- [ ] `PRINTFUL_API_KEY` - Rotate in Printful dashboard, update Vercel
- [ ] `BREVO_API_KEY` - Rotate in Brevo settings, update Vercel

### Database Backup Strategy
- Neon provides point-in-time recovery on paid plans
- For critical data, consider periodic `pg_dump` exports
- Document Recovery Time Objective (RTO) and Recovery Point Objective (RPO)

### Monitoring & Alerting (Recommended)
- **Upstash Dashboard** - Monitor Redis usage and quota
- **Vercel Analytics** - Already installed, review traffic patterns
- **Sentry** (future) - Error tracking and alerting
- **Custom alerts** - Rate limit exhaustion, API latency spikes

### Disaster Recovery Contacts
- Neon Support: https://neon.tech/docs/introduction/support
- Upstash Support: https://upstash.com/docs/common/help/support
- Vercel Support: https://vercel.com/support
- Stripe Support: https://support.stripe.com

### Rollback Procedures
1. **Code rollback**: Revert commit on main, Vercel auto-redeploys
2. **Database migration rollback**: Drizzle doesn't auto-generate down migrations - prepare manual scripts for critical changes
3. **Feature flag emergency disable**: Set `NEXT_PUBLIC_*_ENABLED=false` in Vercel

---

## Upstash Free Tier Limits

**Important:** Monitor usage before production launch

| Limit | Free Tier | Pro Tier ($10/mo) |
|-------|-----------|-------------------|
| Commands/day | 10,000 | 10,000,000 |
| Storage | 256MB | 10GB |
| Connections | 100 | 1,000 |

**Usage estimation:**
- Each rate limit check = 1-2 commands (Ratelimit library is efficient)
- ~5,000-10,000 rate checks/day on free tier
- **Recommendation:** Upgrade to Pro before production launch
