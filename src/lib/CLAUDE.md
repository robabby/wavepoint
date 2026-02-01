# src/lib/ — Module Conventions

## Structure

Every module exports its public API via `index.ts`. Import from the barrel:
```ts
import { createSighting } from "@/lib/signal"     // ✓
import { createSighting } from "@/lib/signal/api"  // ✗
```

## Adding a New Module

1. Create `src/lib/<name>/` with `index.ts` barrel export
2. Add feature flag in `feature-flags.ts` if gated (`is<Name>Enabled()`)
3. Source env vars from `@/env` (validated by Zod in `src/env.js`)
4. Add types/schemas in the module, export from barrel
5. Document in root `CLAUDE.md` under Features

## Cross-Module Imports

Modules may import from other `@/lib/*` barrels but avoid circular deps. Common shared imports:
- `@/lib/db` — database queries
- `@/lib/auth` — session/user access
- `@/lib/features` — access control checks
- `@/env` — environment variables

## Feature Flag Pattern

```ts
export function isMyFeatureEnabled() {
  return env.NEXT_PUBLIC_MY_FEATURE_ENABLED === true
}
```

Define flag in `src/env.js`, default `false`, prefix client flags with `NEXT_PUBLIC_`.
