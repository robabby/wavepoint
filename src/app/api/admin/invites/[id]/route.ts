/**
 * Admin Invite API (by ID)
 *
 * PATCH  - Cancel a pending invite
 * DELETE - Permanently delete a cancelled invite
 *
 * Protected: Returns 404 for non-admins (hides endpoint existence)
 */

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/admin";
import {
  cancelInvite,
  deleteInvite,
  getInviteById,
  removeContactFromBrevoAsync,
} from "@/lib/invites";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    // Return 404 to hide admin routes from non-admins
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { id } = await params;

    // Get the invite first to capture email for Brevo sync
    const getResult = await getInviteById(id);
    if (!getResult.success || !getResult.data) {
      return NextResponse.json(
        { error: getResult.error ?? "Invite not found" },
        { status: 404 }
      );
    }

    const email = getResult.data.email;

    const result = await cancelInvite(id);

    if (!result.success || !result.data) {
      // 400 for validation errors (wrong status, etc.)
      return NextResponse.json(
        { error: result.error ?? "Failed to cancel invite" },
        { status: 400 }
      );
    }

    // Fire-and-forget Brevo contact removal
    removeContactFromBrevoAsync(email);

    return NextResponse.json({ invite: result.data });
  } catch (error) {
    console.error("Cancel invite error:", error);
    return NextResponse.json(
      { error: "Failed to cancel invite" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();

    // Return 404 to hide admin routes from non-admins
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { id } = await params;

    // Get the invite first to capture email for Brevo sync
    const getResult = await getInviteById(id);
    if (!getResult.success || !getResult.data) {
      return NextResponse.json(
        { error: getResult.error ?? "Invite not found" },
        { status: 404 }
      );
    }

    const email = getResult.data.email;

    const result = await deleteInvite(id);

    if (!result.success) {
      // 400 for validation errors (wrong status, etc.)
      return NextResponse.json(
        { error: result.error ?? "Failed to delete invite" },
        { status: 400 }
      );
    }

    // Fire-and-forget Brevo contact removal (safety - in case it wasn't removed on cancel)
    removeContactFromBrevoAsync(email);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Delete invite error:", error);
    return NextResponse.json(
      { error: "Failed to delete invite" },
      { status: 500 }
    );
  }
}
