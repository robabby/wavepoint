/**
 * GET /api/profile/geometry-affinities - Get all geometry affinities for the user
 * PATCH /api/profile/geometry-affinities - Upsert a single geometry affinity
 */

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, geometryAffinities } from "@/lib/db";
import { upsertGeometryAffinitySchema } from "@/lib/geometry";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affinities = await db
      .select()
      .from(geometryAffinities)
      .where(eq(geometryAffinities.userId, session.user.id));

    return NextResponse.json({ affinities });
  } catch (error) {
    console.error("Get geometry affinities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geometry affinities" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const parsed = upsertGeometryAffinitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { geometrySlug, affinityScore } = parsed.data;
    const userId = session.user.id;

    // If affinityScore is null, delete the record
    if (affinityScore === null) {
      await db
        .delete(geometryAffinities)
        .where(
          and(
            eq(geometryAffinities.userId, userId),
            eq(geometryAffinities.geometrySlug, geometrySlug)
          )
        );

      return NextResponse.json({ affinity: null });
    }

    // Upsert affinity (insert or update on conflict)
    const [affinity] = await db
      .insert(geometryAffinities)
      .values({
        userId,
        geometrySlug,
        affinityScore,
        source: "self_reported",
      })
      .onConflictDoUpdate({
        target: [geometryAffinities.userId, geometryAffinities.geometrySlug],
        set: {
          affinityScore,
          source: "self_reported",
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ affinity });
  } catch (error) {
    console.error("Upsert geometry affinity error:", error);
    return NextResponse.json(
      { error: "Failed to update geometry affinity" },
      { status: 500 }
    );
  }
}
