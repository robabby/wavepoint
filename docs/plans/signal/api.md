# Signal API Endpoints

API routes for Signal feature.

> **Related:** [schema.md](./schema.md) | [hooks.md](./hooks.md) | [README.md](./README.md)
>
> **Edge Cases:** See [`docs/prds/signal.md`](../../prds/signal.md) for expected behaviors

## Endpoints Overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/signal/sightings` | Create sighting |
| GET | `/api/signal/sightings` | List sightings |
| GET | `/api/signal/sightings/[id]` | Get single sighting |
| DELETE | `/api/signal/sightings/[id]` | Delete sighting |
| GET | `/api/signal/stats` | Get user stats |
| POST | `/api/signal/interpret` | Regenerate interpretation |

## POST /api/signal/sightings

Create a new sighting with automatic interpretation generation.

```typescript
// src/app/api/signal/sightings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserNumberStats } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateInterpretation } from "@/lib/signal/claude";
import { createSightingSchema } from "@/lib/signal/schemas";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = createSightingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { number, note, moodTags } = parsed.data;
    const userId = session.user.id;
    const now = new Date();

    // Transaction: create sighting + upsert stats atomically
    const result = await db.transaction(async (tx) => {
      const [sighting] = await tx
        .insert(signalSightings)
        .values({ userId, number, note, moodTags })
        .returning();

      const [stats] = await tx
        .insert(signalUserNumberStats)
        .values({
          userId,
          number,
          count: 1,
          firstSeen: now,
          lastSeen: now,
        })
        .onConflictDoUpdate({
          target: [signalUserNumberStats.userId, signalUserNumberStats.number],
          set: {
            count: sql`${signalUserNumberStats.count} + 1`,
            lastSeen: now,
          },
        })
        .returning();

      const isFirstCatch = stats.count === 1;
      return { sighting, stats, isFirstCatch };
    });

    // Generate interpretation (outside transaction - can retry independently)
    const { content: interpretation } = await generateInterpretation({
      sightingId: result.sighting.id,
      number,
      note,
      moodTags,
      count: result.stats.count,
      isFirstCatch: result.isFirstCatch,
    });

    return NextResponse.json({
      sighting: result.sighting,
      interpretation,
      isFirstCatch: result.isFirstCatch,
      count: result.stats.count,
    });
  } catch (error) {
    console.error("Create sighting error:", error);
    return NextResponse.json(
      { error: "Failed to create sighting" },
      { status: 500 }
    );
  }
}
```

## GET /api/signal/sightings

List sightings with optional filtering and pagination.

```typescript
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const numberFilter = searchParams.get("number");

    const conditions = [eq(signalSightings.userId, session.user.id)];
    if (numberFilter) {
      conditions.push(eq(signalSightings.number, numberFilter));
    }

    const sightings = await db.query.signalSightings.findMany({
      where: and(...conditions),
      orderBy: desc(signalSightings.timestamp),
      limit,
      offset,
      with: {
        interpretation: true,
      },
    });

    const [{ total }] = await db
      .select({ total: count().mapWith(Number) })
      .from(signalSightings)
      .where(and(...conditions));

    return NextResponse.json({ sightings, total });
  } catch (error) {
    console.error("Get sightings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sightings" },
      { status: 500 }
    );
  }
}
```

## GET /api/signal/stats

Get user's number statistics.

```typescript
// src/app/api/signal/stats/route.ts
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await db.query.signalUserNumberStats.findMany({
      where: eq(signalUserNumberStats.userId, session.user.id),
      orderBy: desc(signalUserNumberStats.count),
    });

    const totalSightings = stats.reduce((sum, s) => sum + s.count, 0);
    const uniqueNumbers = stats.length;

    return NextResponse.json({
      totalSightings,
      uniqueNumbers,
      numberCounts: stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
```

## DELETE /api/signal/sightings/[id]

Delete a sighting (ownership verified).

> **Note:** `params: Promise<{ id: string }>` is correct for Next.js 15+ async params.

```typescript
// src/app/api/signal/sightings/[id]/route.ts
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const sighting = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, id),
        eq(signalSightings.userId, session.user.id)
      ),
    });

    if (!sighting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete sighting (interpretation cascades)
    await db.delete(signalSightings).where(eq(signalSightings.id, id));

    // Update stats (approximation after deletes is acceptable - see PRD)
    const stats = await db.query.signalUserNumberStats.findFirst({
      where: and(
        eq(signalUserNumberStats.userId, session.user.id),
        eq(signalUserNumberStats.number, sighting.number)
      ),
    });

    if (stats) {
      if (stats.count <= 1) {
        await db.delete(signalUserNumberStats).where(eq(signalUserNumberStats.id, stats.id));
      } else {
        await db
          .update(signalUserNumberStats)
          .set({ count: stats.count - 1 })
          .where(eq(signalUserNumberStats.id, stats.id));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete sighting error:", error);
    return NextResponse.json(
      { error: "Failed to delete sighting" },
      { status: 500 }
    );
  }
}
```

## POST /api/signal/interpret

Regenerate interpretation for existing sighting.

```typescript
// src/app/api/signal/interpret/route.ts
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sightingId } = await request.json();

    // Verify ownership
    const sighting = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, sightingId),
        eq(signalSightings.userId, session.user.id)
      ),
    });

    if (!sighting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get stats for count
    const stats = await db.query.signalUserNumberStats.findFirst({
      where: and(
        eq(signalUserNumberStats.userId, session.user.id),
        eq(signalUserNumberStats.number, sighting.number)
      ),
    });

    const { content } = await generateInterpretation({
      sightingId: sighting.id,
      number: sighting.number,
      note: sighting.note ?? undefined,
      moodTags: sighting.moodTags ?? undefined,
      count: stats?.count ?? 1,
      isFirstCatch: false, // Regeneration is never first catch
    });

    return NextResponse.json({ interpretation: content });
  } catch (error) {
    console.error("Regenerate interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate interpretation" },
      { status: 500 }
    );
  }
}
```

## Rate Limiting

**Decision:** In-memory rate limiting per userId for v1. Sufficient for feature-flagged beta; upgrade to Redis when scaling.

Create `src/lib/signal/rate-limit.ts`:

```typescript
// In-memory rate limit - sufficient for beta, upgrade to Redis when scaling
const rateLimits = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  limit?: number;      // Max requests per window (default: 30)
  windowMs?: number;   // Window duration in ms (default: 60000 = 1 minute)
}

export function checkRateLimit(
  userId: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { limit = 30, windowMs = 60000 } = options;
  const now = Date.now();
  const record = rateLimits.get(userId);

  // First request or window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    rateLimits.set(userId, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Within window
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// Cleanup old entries periodically (optional, prevents memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [userId, record] of rateLimits.entries()) {
    if (now > record.resetAt) {
      rateLimits.delete(userId);
    }
  }
}, 60000); // Clean up every minute
```

Apply to mutation endpoints (POST, DELETE):

```typescript
import { checkRateLimit } from "@/lib/signal/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  const rateLimit = checkRateLimit(session.user.id);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  // ... rest of handler
}
```

**Rate Limits by Endpoint:**

| Endpoint | Limit | Window | Rationale |
|----------|-------|--------|-----------|
| POST `/sightings` | 30/min | 60s | Prevent spam capture |
| DELETE `/sightings/[id]` | 30/min | 60s | Prevent mass deletion |
| POST `/interpret` | 10/min | 60s | AI calls are expensive |

**Future Scaling:**
When moving to production at scale, replace with Redis-based rate limiting:
- Use `@upstash/ratelimit` or similar
- Distributed across serverless instances
- Persistent across deployments
