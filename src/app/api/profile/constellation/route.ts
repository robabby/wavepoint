/**
 * GET /api/profile/constellation - Lazy-init + fetch all constellation entries
 * PATCH /api/profile/constellation - Update entry status (dismiss/restore)
 * POST /api/profile/constellation - Add a user-chosen entry
 */

import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, archetypeConstellations, spiritualProfiles } from "@/lib/db";
import {
  updateConstellationSchema,
  addConstellationSchema,
  computeConstellation,
} from "@/lib/constellation";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user profile for computation
    const [profile] = await db
      .select()
      .from(spiritualProfiles)
      .where(eq(spiritualProfiles.userId, userId));

    // Compute expected entries from current profile data
    if (profile) {
      const computed = computeConstellation(profile.birthDate, {
        lifePathNumber: profile.lifePathNumber,
        birthdayNumber: profile.birthdayNumber,
        expressionNumber: profile.expressionNumber,
        soulUrgeNumber: profile.soulUrgeNumber,
        personalityNumber: profile.personalityNumber,
        maturityNumber: profile.maturityNumber,
      });

      // Batch insert with ON CONFLICT DO NOTHING (never overwrites existing rows)
      if (computed.length > 0) {
        await db
          .insert(archetypeConstellations)
          .values(
            computed.map((entry) => ({
              userId,
              system: entry.system,
              identifier: entry.identifier,
              source: "computed" as const,
              derivedFrom: entry.derivedFrom,
            }))
          )
          .onConflictDoNothing({
            target: [
              archetypeConstellations.userId,
              archetypeConstellations.system,
              archetypeConstellations.identifier,
            ],
          });
      }
    }

    // Return all entries for this user
    const entries = await db
      .select()
      .from(archetypeConstellations)
      .where(eq(archetypeConstellations.userId, userId));

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Get constellation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch constellation" },
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

    const parsed = updateConstellationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { system, identifier, status } = parsed.data;
    const userId = session.user.id;

    const [entry] = await db
      .update(archetypeConstellations)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(archetypeConstellations.userId, userId),
          eq(archetypeConstellations.system, system),
          eq(archetypeConstellations.identifier, identifier)
        )
      )
      .returning();

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Update constellation error:", error);
    return NextResponse.json(
      { error: "Failed to update constellation" },
      { status: 500 }
    );
  }
}

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

    const parsed = addConstellationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { system, identifier } = parsed.data;
    const userId = session.user.id;

    const [entry] = await db
      .insert(archetypeConstellations)
      .values({
        userId,
        system,
        identifier,
        source: "user_added",
        status: "active",
      })
      .onConflictDoUpdate({
        target: [
          archetypeConstellations.userId,
          archetypeConstellations.system,
          archetypeConstellations.identifier,
        ],
        set: {
          status: "active",
          updatedAt: new Date(),
        },
      })
      .returning();

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Add constellation error:", error);
    return NextResponse.json(
      { error: "Failed to add constellation entry" },
      { status: 500 }
    );
  }
}
