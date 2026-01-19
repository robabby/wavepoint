# Signal PRD

Angel number logging with AI-powered interpretations.

**Status:** In Development
**Linear Epic:** [SG-285](https://linear.app/sherpagg/issue/SG-285)
**Implementation Plan:** `docs/plans/2026-01-18-signal-angel-number-tracking.md`

## Problem

People notice repeating numbers (11:11, 444, 222) and sense meaning, but these moments evaporate. Signal transforms fleeting angel number moments into a personal spiritual record with meaningful AI interpretations.

## Scope

### In Scope (v1)

- Capture flow: number input → optional note/mood → save
- AI interpretation (Claude Haiku)
- Sighting collection with filters
- Basic stats (most frequent numbers, streaks)
- "First catch" celebration animation
- Two input modes: NumberPad (quick) and SacredNumberWheel (ritual)

### Out of Scope (v1)

- Social/sharing features
- Backdated sightings
- Interpretation history (regenerate overwrites)
- Push notifications
- Export functionality
- Public profiles

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL structure | `/signal` (top-level) | Memorable, parallel to `/shop` |
| Access model | Auth required | All registered users get access when flag is on |
| Feature flag | `NEXT_PUBLIC_SIGNAL_ENABLED` | Consistent with shop pattern |
| Input modes | Both NumberPad + SacredNumberWheel | Quick entry AND ritual experience |
| AI model | Claude Haiku | Speed over depth for v1 |
| Regeneration | Upsert (overwrite) | Simpler schema, history not needed |
| Privacy | Private only | No sharing in v1 |
| Stats after deletes | Approximations OK | Exact timestamps rarely needed |

## User Journeys

### First Sighting
```
See 11:11 → Open MC → Signal in user menu → Capture page →
Enter "1111" via NumberPad → Add mood "hopeful" → Submit →
See interpretation + first-catch celebration → Collection (1 sighting)
```

### Quick Repeat Capture
```
See 444 again → Signal → Capture → NumberPad "444" →
Skip note → Submit → Interpretation shows "3rd time seeing this"
```

### Reflection Session
```
Sunday evening → Signal → Collection → Filter by "111" →
See all 111 sightings with interpretations → Notice mood patterns
```

### Unauthenticated Access
```
Visit /signal directly → Redirect to /login?redirect=/signal →
Sign in → Back to /signal dashboard
```

### Feature Disabled
```
Visit /signal when flag=false → 404 (feature hidden)
```

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Not authenticated | Redirect to `/login?redirect=/signal` |
| Feature flag off | Return 404 |
| Invalid sighting ID | Return 404 |
| Other user's sighting | Return 404 (sightings are private) |
| AI interpretation fails | Show fallback message, log error |
| Rate limit exceeded | Return 429, show friendly message |

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption | 50% of registered users try Signal | Users with ≥1 sighting |
| Retention | 20% weekly active | Users with sightings in consecutive weeks |
| Engagement | 3+ sightings/user/month | Avg sightings per active user |
| Interpretation quality | <5% regeneration rate | Regenerate calls / total sightings |

## Technical Summary

- **Feature flag:** `NEXT_PUBLIC_SIGNAL_ENABLED`
- **Auth guard:** Layout-level redirect for unauthenticated users
- **Tables:** `signal_sightings`, `signal_interpretations`, `signal_user_number_stats`
- **API routes:** `/api/signal/sightings`, `/api/signal/interpret`, `/api/signal/stats`
- **AI:** Claude Haiku via Anthropic SDK with timeout/fallback
