# Phase 6: Integration

**Linear:** [SG-291](https://linear.app/sherpagg/issue/SG-291)
**Branch:** `sg-291-signal-phase-6-integration`

## Overview

Integrate Signal into the main application: add to navigation, verify all guards work correctly.

## Tasks

### 1. Update User Menu

Add Signal link to user dropdown menu (only when feature flag is on):

```tsx
// In user menu component
import { isSignalEnabled } from "@/lib/signal/feature-flags";

// Inside the dropdown menu
{isSignalEnabled() && (
  <DropdownMenuItem asChild>
    <Link href="/signal">
      <span className="mr-2">✨</span>
      Signal
    </Link>
  </DropdownMenuItem>
)}
```

Menu structure:
```
┌─────────────────────┐
│  rob@example.com    │
├─────────────────────┤
│  Signal        ✨   │  ← New (only when flag=true)
│  Account Settings   │
│  ───────────────    │
│  Sign Out           │
└─────────────────────┘
```

### 2. Verify Feature Flag Guards

Test all scenarios:

| Scenario | Expected Behavior |
|----------|-------------------|
| Not authenticated, visit `/signal` | Redirect to `/login?redirect=/signal` |
| Authenticated, flag off, visit `/signal` | 404 |
| Authenticated, flag on, visit `/signal` | Dashboard loads |
| Not authenticated, flag off | Signal not in nav, `/signal` redirects then 404 |

### 3. Verify Deep Link Handling

Test sighting URLs:

| Scenario | Expected |
|----------|----------|
| Valid sighting, owner viewing | Show detail |
| Valid sighting, other user | 404 |
| Invalid sighting ID | 404 |
| Not authenticated | Redirect to login, then 404 (can't see others') |

### 4. Update CLAUDE.md

Add Signal to the documentation:

```markdown
## Signal Integration (`src/lib/signal/`)

| File | Purpose |
|------|---------|
| `feature-flags.ts` | `isSignalEnabled()` for feature gating |
| `schemas.ts` | Zod validation schemas |
| `claude.ts` | Claude API client with timeout/fallback |
| `meanings.ts` | Base angel number meanings |
| `types.ts` | TypeScript interfaces |
```

## Verification Checklist

- [ ] Signal appears in user menu when authenticated and flag=on
- [ ] Signal does NOT appear in menu when flag=off
- [ ] Signal does NOT appear in menu when not authenticated
- [ ] `/signal` redirects to login when not authenticated
- [ ] `/signal` returns 404 when flag=off
- [ ] Sighting detail handles all edge cases correctly
- [ ] CLAUDE.md updated with Signal docs
- [ ] `pnpm check` passes

## Manual Test Script

```bash
# 1. Set feature flag off
# Edit .env: NEXT_PUBLIC_SIGNAL_ENABLED=false
# Restart dev server

# 2. Test: Signal should NOT appear in nav
# 3. Test: /signal should 404

# 4. Set feature flag on
# Edit .env: NEXT_PUBLIC_SIGNAL_ENABLED=true
# Restart dev server

# 5. Test: Signal appears in nav (when logged in)
# 6. Test: Full capture flow works
# 7. Test: Collection displays sightings
```

## Dependencies

**Install:** None

**Requires:** Phase 5 complete (all pages)

## Next Phase

[Phase 7: Testing & Polish](./7-testing-polish.md) — Tests, E2E, final verification
