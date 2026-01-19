/**
 * DELETE /api/account/delete - Permanently delete user account
 *
 * Deletes:
 * - Verification tokens (by email)
 * - User record (cascades: sessions, accounts, addresses)
 * - Orders are anonymized (userId set to null via DB constraint)
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, users, verificationTokens } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email for token cleanup
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete verification tokens for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, user.email));

    // Delete user (cascades: sessions, accounts, addresses; orders set to null)
    await db.delete(users).where(eq(users.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
