/**
 * POST /api/signal/resonance - Record resonance feedback for a sighting
 * GET /api/signal/resonance?sightingId=... - Get resonance for a sighting
 */

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, interpretationResonance, signalSightings } from "@/lib/db";
import { recordResonanceSchema, getResonanceSchema } from "@/lib/resonance";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = recordResonanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { sightingId, resonated } = parsed.data;
    const userId = session.user.id;

    // Verify the sighting exists and belongs to the user
    const [sighting] = await db
      .select({ id: signalSightings.id })
      .from(signalSightings)
      .where(
        and(
          eq(signalSightings.id, sightingId),
          eq(signalSightings.userId, userId)
        )
      );

    if (!sighting) {
      return NextResponse.json(
        { error: "Sighting not found" },
        { status: 404 }
      );
    }

    // Upsert resonance (one per user per sighting)
    const [resonance] = await db
      .insert(interpretationResonance)
      .values({
        userId,
        sightingId,
        resonated,
      })
      .onConflictDoUpdate({
        target: [interpretationResonance.userId, interpretationResonance.sightingId],
        set: {
          resonated,
        },
      })
      .returning();

    return NextResponse.json({ resonance });
  } catch (error) {
    console.error("Record resonance error:", error);
    return NextResponse.json(
      { error: "Failed to record resonance" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sightingId = searchParams.get("sightingId");

    const parsed = getResonanceSchema.safeParse({ sightingId });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid sightingId" },
        { status: 400 }
      );
    }

    const [resonance] = await db
      .select()
      .from(interpretationResonance)
      .where(
        and(
          eq(interpretationResonance.userId, session.user.id),
          eq(interpretationResonance.sightingId, parsed.data.sightingId)
        )
      );

    return NextResponse.json({ resonance: resonance ?? null });
  } catch (error) {
    console.error("Get resonance error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resonance" },
      { status: 500 }
    );
  }
}
