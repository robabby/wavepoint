# Signal Database Schema

Database tables for Signal feature.

> **Related:** [api.md](./api.md) | [README.md](./README.md)

## Tables

Add to `src/lib/db/schema.ts`:

### signal_sightings

Primary table for captured angel numbers.

```typescript
import { index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const signalSightings = pgTable(
  "signal_sightings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull(), // "1111", "444", etc.
    note: text("note"),
    moodTags: text("mood_tags").array(),
    timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("signal_sightings_user_id_idx").on(table.userId),
    index("signal_sightings_number_idx").on(table.number),
    index("signal_sightings_timestamp_idx").on(table.timestamp),
  ]
);
```

### signal_interpretations

AI-generated interpretations (1:1 with sightings).

```typescript
export const signalInterpretations = pgTable(
  "signal_interpretations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sightingId: uuid("sighting_id")
      .notNull()
      .unique() // 1:1 relationship
      .references(() => signalSightings.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    model: text("model").notNull(), // "claude-3-haiku", "fallback", etc.
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("signal_interpretations_sighting_id_idx").on(table.sightingId),
  ]
);
```

### signal_user_number_stats

Denormalized stats for performance.

```typescript
export const signalUserNumberStats = pgTable(
  "signal_user_number_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    number: text("number").notNull(),
    count: integer("count").notNull().default(0),
    firstSeen: timestamp("first_seen", { mode: "date" }).notNull(),
    lastSeen: timestamp("last_seen", { mode: "date" }).notNull(),
  },
  (table) => [
    unique("signal_user_number_stats_user_number_unique").on(table.userId, table.number),
    index("signal_user_number_stats_user_id_idx").on(table.userId),
  ]
);
```

## Relations

Required for Drizzle's `with: { interpretation }` queries.

```typescript
export const signalSightingsRelations = relations(signalSightings, ({ one }) => ({
  interpretation: one(signalInterpretations, {
    fields: [signalSightings.id],
    references: [signalInterpretations.sightingId],
  }),
}));

export const signalInterpretationsRelations = relations(signalInterpretations, ({ one }) => ({
  sighting: one(signalSightings, {
    fields: [signalInterpretations.sightingId],
    references: [signalSightings.id],
  }),
}));
```

## Inferred Types

```typescript
export type SignalSighting = typeof signalSightings.$inferSelect;
export type NewSignalSighting = typeof signalSightings.$inferInsert;
export type SignalInterpretation = typeof signalInterpretations.$inferSelect;
export type SignalUserNumberStats = typeof signalUserNumberStats.$inferSelect;
```

## Zod Schemas

Create in `src/lib/signal/schemas.ts`:

```typescript
import { z } from "zod";

export const MOOD_OPTIONS = [
  "calm",
  "energized",
  "reflective",
  "anxious",
  "grateful",
  "inspired",
] as const;

export const createSightingSchema = z.object({
  number: z
    .string()
    .min(1)
    .max(10)
    .regex(/^\d+$/, "Must contain only digits"),
  note: z.string().max(500).optional(),
  moodTags: z
    .array(z.enum(MOOD_OPTIONS))
    .max(3)
    .optional(),
});

export type CreateSightingInput = z.infer<typeof createSightingSchema>;
```

## Schema Design Notes

| Decision | Rationale |
|----------|-----------|
| Indexes on `userId`, `number`, `timestamp` | Query performance for listing/filtering |
| Unique constraint on `(userId, number)` in stats | Prevent duplicate stats entries |
| `.unique()` on `sightingId` in interpretations | Enforce 1:1 relationship |
| `text` instead of `varchar` | Simpler, no length constraint needed |
| `moodTags` as array | Flexible multi-select without join table |
| Denormalized stats table | Avoid expensive count queries |

## Migration

After adding schema, run:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```
