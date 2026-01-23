# ADR-0001: Cloud-First Local Development

**Status:** Accepted
**Date:** 2026-01-23

## Context

We needed to mature our development environment to:
- Separate local development from production
- Enable team growth with isolated developer environments
- Maintain excellent developer experience (DX)
- Support Claude Code-driven development workflows

Options considered:
1. **Docker Compose** - Local PostgreSQL + Redis containers
2. **Cloud-First** - Use Neon branches + Upstash free tier directly
3. **Hybrid** - Docker for DB, cloud for Redis

## Decision

Use cloud services directly for local development:
- **Database:** Neon PostgreSQL branches (one per developer)
- **Rate Limiting:** Upstash Redis free tier (falls back to in-memory)
- **No Docker required** for local development

## Rationale

### Why Cloud-First?

1. **Zero local infrastructure** - No Docker, no containers, no port conflicts
2. **Same services as production** - Neon + Upstash in all environments
3. **Simplest onboarding** - Just configure `.env.local`
4. **Free tiers are generous** - Neon and Upstash both offer sufficient free usage
5. **Branch isolation** - Each developer gets their own database branch

### Why Not Docker?

1. **Neon HTTP driver incompatibility** - Our codebase uses `@neondatabase/serverless` with `neon-http` driver, which only works with Neon's HTTP protocol. Standard PostgreSQL containers require a different driver.
2. **Added complexity** - Docker adds setup steps and potential issues for developers
3. **Not representative** - Local containers don't match production behavior exactly

### Rate Limiting Approach

- **Upstash Redis** in production and staging (scalable, persistent)
- **In-memory fallback** when Upstash not configured (development convenience)
- **Fail-open pattern** - If Redis fails, requests are allowed (with logging)

## Consequences

### Positive

- Zero local infrastructure to manage
- Same services as production (just different branches/tiers)
- Simple onboarding (just configure .env.local)
- Faster setup for new developers
- No Docker/container expertise required

### Negative

- Requires internet connection for development
- Each developer needs Neon/Upstash accounts
- Minor cost if exceeding free tiers (unlikely during development)
- Database branches need periodic cleanup

## Environment Matrix

| Environment | Database | Redis | Stripe |
|-------------|----------|-------|--------|
| **Local Dev** | Neon dev branch | Upstash (shared) / in-memory | Test keys |
| **CI** | Mocked | Mocked | Mocked |
| **Staging** | Neon staging branch | Upstash (shared) | Test keys |
| **Production** | Neon main | Upstash (shared) | Live keys |

**Note:** Upstash free tier only allows one database, so all environments share the same Redis instance. Rate limit keys are namespaced with `wavepoint:ratelimit:` prefix, and each key includes identifiers (user ID, IP, action type) that naturally separate environments. This is safe for rate limiting purposes.

## Related

- [Infrastructure Maturity Plan](../plans/2026-01-23-infrastructure-maturity.md)
- `CONTRIBUTING.md` - Developer onboarding guide
- `.env.local.example` - Environment configuration template
