# Founding Engineer DX & Onboarding Evaluation

*Perspective: Senior Engineer joining on Day 1*

---

## Executive Summary

WavePoint has **strong foundational DX** with excellent documentation and modern tooling. The codebase is well-organized with clear patterns. However, there are gaps in testing, CI completeness, and architectural documentation that would be expected for a project of this maturity.

**Overall Grade: B+**

---

## What Works Well

### 1. Onboarding Experience (A)

The onboarding path is exceptionally clear:

```bash
cp .env.example .env       # Well-commented with setup links
pnpm install               # Single package manager
npx drizzle-kit push       # Schema sync
pnpm check                 # Lint + typecheck
```

**Specifics:**
- `.env.example` has inline comments with links to Neon, Stripe, Anthropic dashboards
- `CONTRIBUTING.md` provides step-by-step walkthrough with service-specific setup
- `CLAUDE.md` serves as comprehensive architecture reference
- `.nvmrc` pins Node version (no surprises)
- `pnpm check` is a single command for verification

### 2. Feature Organization (A-)

The `src/lib/` structure is exemplary:

```
src/lib/
  signal/           # 12+ modules with clean index.ts exports
  numbers/          # Data, relationships, helpers
  auth/             # Config, tokens, admin checks
  rate-limit/       # Upstash with in-memory fallback
```

Each feature has:
- `index.ts` exporting public API
- `feature-flags.ts` for toggles
- `schemas.ts` for Zod validation
- Clear separation of concerns

### 3. Type Safety (A)

Strict TypeScript configuration with:
- `strict: true`
- `noUncheckedIndexedAccess`
- `checkJs` enabled
- Zero `any` types detected
- Zod validation at all API boundaries

### 4. Modern Tooling (A-)

- **ESLint**: Flat config with TypeScript-ESLint + Next.js rules
- **Prettier**: Tailwind plugin for class sorting
- **Vitest**: Fast test runner with React Testing Library
- **Playwright**: Multi-browser E2E setup (Chrome, Firefox, Safari)
- **Drizzle**: Type-safe ORM with studio GUI

### 5. Infrastructure Patterns (A)

- **Feature flags**: `isXEnabled()` pattern with admin overrides
- **Rate limiting**: Graceful degradation (fail-open if Redis unavailable)
- **Subscriptions**: Clear tier checking with explicit conditions
- **Environment validation**: `@t3-oss/env-nextjs` with Zod

---

## Points of Friction

### 1. Test Coverage (D)

**Critical gap**: Only 2 unit tests exist for the entire codebase.

| What's Missing | Impact |
|----------------|--------|
| API route tests | Can't verify auth, validation, business logic |
| Hook tests | React Query behavior untested |
| E2E tests | Playwright configured but `e2e/` is empty |
| Service layer tests | Business logic in routes, untestable in isolation |

**Recommendation**: Establish minimum coverage threshold (60%) and add test utilities (MSW for API mocking, test factories).

### 2. CI Pipeline Incomplete (C)

Current CI only runs:
1. `pnpm check` (lint + typecheck)
2. `pnpm test` (the 2 tests)

Missing from CI:
- `pnpm build` verification
- E2E tests (Playwright)
- `pnpm format:check`
- Coverage reporting
- Database schema validation

### 3. Business Logic in API Routes (C+)

API routes are 200-300 lines with mixed concerns:

```typescript
// /api/signal/sightings POST does:
// 1. Auth check → 2. Rate limit → 3. Validation
// 4. DB insert → 5. Stats update → 6. Activity update
// 7. Count query → 8. First catch → 9. Historical fetch
// 10. Delight detection → 11. AI interpretation → 12. Subscription check
```

This makes testing difficult and creates tight coupling. A service layer would help:

```typescript
// Ideal: src/lib/signal/service.ts
export async function createSighting(input, userId) {
  // All business logic here, easily testable
}
```

### 4. Code Duplication (B-)

Duplicated patterns that should be extracted:

| Pattern | Locations | Fix |
|---------|-----------|-----|
| IP extraction | `/api/contact`, `/api/waitlist` | `src/lib/api/utils.ts` |
| Error responses | All 28 API routes | `ApiError.unauthorized()` helper |
| Form styling | Contact form, Signal forms | `src/lib/theme/form-styles.ts` |
| Fetch calls | All React Query hooks | `useFetchJson()` utility |

### 5. Missing Pre-Commit Hooks (C)

No Husky or lint-staged configuration. Issues caught only in CI, not locally.

**Impact**: Failed CI runs that could be prevented.

### 6. No .editorconfig (B-)

Missing standardization for:
- Tab width
- Line endings
- Indent style

Different IDEs may format differently.

---

## Documentation Gaps

### ADRs (D+)

Only 1 ADR exists (`cloud-first-development.md`). Missing decisions for:
- Why credentials auth over OAuth
- Database denormalization strategy
- Fail-open rate limiting design
- Subscription tier architecture
- API authentication patterns

### CLAUDE.md Drift (B)

- References "Shop" feature as shipped, but incomplete in code
- Missing subscription tier documentation
- Directory structure missing shop entries
- Feature flag table incomplete

### Component Documentation (C)

- Infrastructure code has excellent JSDoc
- React components have minimal documentation
- API endpoints have no request/response examples

---

## Nice-to-Haves

### Developer Productivity

1. **Test generators**: CLI to scaffold test files from components/routes
2. **Component documentation**: Storybook for UI components
3. **API documentation**: OpenAPI spec generation from Zod schemas
4. **Database seeding**: Deterministic seed data for local development

### Observability

1. **Structured logging**: Replace `console.error` with proper logger
2. **External integration monitoring**: Track Brevo/Claude API failures
3. **Error boundaries**: React error boundaries with reporting

### Code Quality

1. **Service layer extraction**: Move business logic from routes
2. **Query builders**: Reduce Drizzle query duplication
3. **Type-safe route params**: Validate dynamic params (UUIDs, etc.)

---

## Immediate Improvements (Week 1)

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Add `.editorconfig` | 15 min |
| 2 | Add Husky + lint-staged | 30 min |
| 3 | Add `pnpm build` to CI | 15 min |
| 4 | Extract `ApiError` utility | 1 hour |
| 5 | Extract `getClientIp()` utility | 30 min |
| 6 | Add format check to CI | 15 min |

## Medium-Term Improvements (Month 1)

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Establish test coverage baseline | 2 days |
| 2 | Create 5 core ADRs | 1 day |
| 3 | Extract Signal service layer | 2 days |
| 4 | Add E2E test suite | 3 days |
| 5 | Update CLAUDE.md accuracy | 2 hours |
| 6 | Add API documentation | 1 day |

---

## Summary

**Strengths to preserve:**
- Module organization pattern
- Feature flag architecture
- Type safety discipline
- Onboarding documentation

**Critical gaps to address:**
- Test coverage (2 tests for entire codebase)
- Service layer extraction (routes too fat)
- CI completeness (missing build, E2E, coverage)
- ADR documentation (only 1 exists)

The codebase is well-positioned for growth with some targeted improvements to testing and architecture patterns.
