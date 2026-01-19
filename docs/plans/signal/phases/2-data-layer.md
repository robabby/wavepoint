# Phase 2: Data Layer

**Linear:** [SG-287](https://linear.app/sherpagg/issue/SG-287)
**Branch:** `sg-287-signal-phase-2-data-layer`

## Overview

Install Anthropic SDK, create Claude integration, and implement all API routes.

## Tasks

### 1. Install Anthropic SDK

```bash
pnpm add @anthropic-ai/sdk
```

### 2. Create Base Meanings

Create `src/lib/signal/meanings.ts`. See [claude.md](../claude.md) for implementation.

### 3. Create Claude Integration

Create `src/lib/signal/claude.ts` with:
- `generateInterpretation()` function
- Timeout handling (15s)
- Fallback interpretations
- Upsert pattern for regeneration

See [claude.md](../claude.md) for full implementation.

### 4. Create API Routes

Create the following routes. See [api.md](../api.md) for implementations.

| File | Methods |
|------|---------|
| `src/app/api/signal/sightings/route.ts` | POST, GET |
| `src/app/api/signal/sightings/[id]/route.ts` | GET, DELETE |
| `src/app/api/signal/stats/route.ts` | GET |
| `src/app/api/signal/interpret/route.ts` | POST |

### 5. Add Rate Limiting

Implement simple rate limiting in POST endpoints. See [api.md](../api.md#rate-limiting).

## Verification

- [ ] Anthropic SDK installed
- [ ] `meanings.ts` exports `getBaseMeaning()`
- [ ] `claude.ts` exports `generateInterpretation()`
- [ ] All API routes respond correctly
- [ ] Rate limiting prevents abuse
- [ ] Fallback works when Claude API fails
- [ ] `pnpm check` passes

## Testing API Routes

```bash
# Test create sighting (requires auth)
curl -X POST http://localhost:3000/api/signal/sightings \
  -H "Content-Type: application/json" \
  -d '{"number": "444"}'

# Test get sightings
curl http://localhost:3000/api/signal/sightings

# Test get stats
curl http://localhost:3000/api/signal/stats
```

## Dependencies

**Install:** `pnpm add @anthropic-ai/sdk`

**Requires:** Phase 1 complete (schema, env vars)

## Next Phase

[Phase 3: Hooks & State](./3-hooks-state.md) — Install SWR, create data fetching hooks
