/**
 * GET /api/account/address - Fetch user's address
 * PUT /api/account/address - Save/update user's address
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, addresses } from "@/lib/db";
import { addressSchema } from "@/lib/address/schemas";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const address = await db.query.addresses.findFirst({
      where: eq(addresses.userId, session.user.id),
    });

    return NextResponse.json({ address: address ?? null });
  } catch (error) {
    console.error("Get address error:", error);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(errors).flat()[0] ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, line1, line2, city, state, postalCode } = parsed.data;

    // Upsert address (insert or update if exists)
    await db
      .insert(addresses)
      .values({
        userId: session.user.id,
        name,
        line1,
        line2: line2 ?? null,
        city,
        state,
        postalCode,
        country: "US",
      })
      .onConflictDoUpdate({
        target: addresses.userId,
        set: {
          name,
          line1,
          line2: line2 ?? null,
          city,
          state,
          postalCode,
          country: "US",
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save address error:", error);
    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}
