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
   cp .env.example .env.local
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
pnpm test:e2e    # E2E tests (Playwright)
pnpm check       # Lint + typecheck
```

## Environment Setup Details

### Neon (Required)

1. Sign up at https://neon.tech (free tier available)
2. Create a project or use an existing one
3. Go to Branches → Create Branch from `main`
4. Name it `development` (or use your name, e.g., `dev-yourname`)
5. Copy the connection string to `DATABASE_URL` in `.env.local`

### Upstash (Optional)

Rate limiting falls back to in-memory if Upstash is not configured.

**Note:** Upstash free tier only allows one database, so local dev shares the same instance as production. This is safe because rate limit keys are namespaced and include user/IP identifiers.

1. Get the shared Upstash credentials from team (or create your own at https://upstash.com)
2. Add to `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Stripe (For Payment Features)

1. Get test API keys from https://dashboard.stripe.com/test/apikeys
2. Add to `.env.local`:
   - `STRIPE_SECRET_KEY` (sk_test_...)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
3. For webhooks:
   - Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
   - Run `stripe login` to authenticate
   - Run `pnpm stripe:listen` to forward webhooks
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Architecture

See `CLAUDE.md` for full project context, conventions, and directory structure.

Key conventions:
- Use `@/*` imports for `src/`
- Use `cn()` for merging Tailwind classes
- Follow existing patterns in similar files
- Keep components focused and composable

## Code Review Guidelines

- PRs should be reviewed before merging to `staging`
- `staging` is merged to `main` after QA
- CI must pass (lint, typecheck, tests, build)

## Questions?

Check `CLAUDE.md` for project-specific guidance or ask in the team channel.
