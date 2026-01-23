/**
 * GET /api/signal/sightings/[id] - Get a single sighting
 * PATCH /api/signal/sightings/[id] - Update a sighting (note and moodTags only)
 * DELETE /api/signal/sightings/[id] - Delete a sighting
 */

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings, signalUserNumberStats } from "@/lib/db";
import { checkRateLimit } from "@/lib/signal/rate-limit";
import { updateSightingSchema } from "@/lib/signal/schemas";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const sighting = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, id),
        eq(signalSightings.userId, session.user.id)
      ),
      with: {
        interpretation: true,
      },
    });

    if (!sighting) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ sighting });
  } catch (error) {
    console.error("Get sighting error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sighting" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (30/min for updates)
    const rateLimit = await checkRateLimit(`${session.user.id}:sighting:update`, {
      limit: 30,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as unknown;
    const parsed = updateSightingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, id),
        eq(signalSightings.userId, session.user.id)
      ),
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update sighting
    await db
      .update(signalSightings)
      .set({
        note: parsed.data.note,
        moodTags: parsed.data.moodTags,
      })
      .where(eq(signalSightings.id, id));

    // Fetch updated sighting with interpretation
    const sighting = await db.query.signalSightings.findFirst({
      where: eq(signalSightings.id, id),
      with: {
        interpretation: true,
      },
    });

    return NextResponse.json({ sighting });
  } catch (error) {
    console.error("Update sighting error:", error);
    return NextResponse.json(
      { error: "Failed to update sighting" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit check (30/min for deletions)
    const rateLimit = await checkRateLimit(`${session.user.id}:sighting:delete`, {
      limit: 30,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
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

    // Delete sighting (interpretation cascades via FK)
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
        // Last sighting of this number - remove stats row
        await db
          .delete(signalUserNumberStats)
          .where(eq(signalUserNumberStats.id, stats.id));
      } else {
        // Decrement count
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
