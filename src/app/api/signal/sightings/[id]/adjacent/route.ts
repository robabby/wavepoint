/**
 * GET /api/signal/sightings/[id]/adjacent - Get prev/next sighting IDs
 */

import { NextResponse } from "next/server";
import { and, eq, gt, lt, desc, asc } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, signalSightings } from "@/lib/db";

interface AdjacentResponse {
  prevId: string | null;
  nextId: string | null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AdjacentResponse | { error: string }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the current sighting to find its timestamp
    const current = await db.query.signalSightings.findFirst({
      where: and(
        eq(signalSightings.id, id),
        eq(signalSightings.userId, session.user.id)
      ),
      columns: { timestamp: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get previous sighting (older than current, ordered by timestamp desc)
    const [prev] = await db
      .select({ id: signalSightings.id })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.userId, session.user.id),
          lt(signalSightings.timestamp, current.timestamp)
        )
      )
      .orderBy(desc(signalSightings.timestamp))
      .limit(1);

    // Get next sighting (newer than current, ordered by timestamp asc)
    const [next] = await db
      .select({ id: signalSightings.id })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.userId, session.user.id),
          gt(signalSightings.timestamp, current.timestamp)
        )
      )
      .orderBy(asc(signalSightings.timestamp))
      .limit(1);

    return NextResponse.json({
      prevId: prev?.id ?? null,
      nextId: next?.id ?? null,
    });
  } catch (error) {
    console.error("Get adjacent sightings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch adjacent sightings" },
      { status: 500 }
    );
  }
}
