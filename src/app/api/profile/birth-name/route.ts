/**
 * Birth Name API route
 *
 * PATCH /api/profile/birth-name - Update birth name and recalculate numerology
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { calculateStableNumbers, toNumerologyData } from "@/lib/numerology";

const birthNameSchema = z.object({
  birthName: z.string().nullable(),
});

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

    const parsed = birthNameSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { birthName } = parsed.data;

    // Fetch existing profile
    const [existingProfile] = await db
      .select()
      .from(spiritualProfiles)
      .where(eq(spiritualProfiles.userId, session.user.id));

    if (!existingProfile) {
      return NextResponse.json(
        { error: "No profile found. Please create a profile first." },
        { status: 404 }
      );
    }

    // Recalculate numerology with new birth name
    const numerologyNumbers = calculateStableNumbers(
      existingProfile.birthDate,
      birthName
    );

    // Update profile
    const [updatedRow] = await db
      .update(spiritualProfiles)
      .set({
        birthName: birthName,
        expressionNumber: numerologyNumbers.expression,
        soulUrgeNumber: numerologyNumbers.soulUrge,
        personalityNumber: numerologyNumbers.personality,
        maturityNumber: numerologyNumbers.maturity,
        updatedAt: new Date(),
      })
      .where(eq(spiritualProfiles.userId, session.user.id))
      .returning();

    // Build numerology response
    const numerology = toNumerologyData(
      {
        lifePathNumber: updatedRow!.lifePathNumber,
        birthdayNumber: updatedRow!.birthdayNumber,
        expressionNumber: numerologyNumbers.expression,
        soulUrgeNumber: numerologyNumbers.soulUrge,
        personalityNumber: numerologyNumbers.personality,
        maturityNumber: numerologyNumbers.maturity,
      },
      existingProfile.birthDate
    );

    return NextResponse.json({
      birthName: birthName,
      numerology,
    });
  } catch (error) {
    console.error("Update birth name error:", error);
    return NextResponse.json(
      { error: "Failed to update birth name" },
      { status: 500 }
    );
  }
}
