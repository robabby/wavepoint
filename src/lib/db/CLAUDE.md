# src/lib/db/ — Drizzle + Neon Conventions

## Schema Patterns

- **Primary keys**: UUID with `defaultRandom()` — never auto-increment
- **Timestamps**: Use `{ mode: "date" }` for JS Date objects
- **Every table** gets `createdAt` (default `now()`) and `updatedAt` columns
- **Relations**: Define in schema file alongside table, export from barrel

## Imports

```ts
import { db } from "@/lib/db"           // ✓ — use barrel
import { users } from "@/lib/db/schema"  // ✗ — avoid direct schema import
```

## Neon-HTTP Limitations

- **No transaction support** — neon-http driver doesn't support `db.transaction()`
- Use individual queries; design for idempotency instead of transactions

## Query Functions

Place query functions in `queries/` subdirectory. Pattern:
```ts
export async function getSightingById(id: string) {
  return db.query.signalSightings.findFirst({
    where: eq(signalSightings.id, id),
  })
}
```

## After Schema Changes

```bash
npx drizzle-kit push    # Push to Neon
npx drizzle-kit studio  # Verify in GUI
```
