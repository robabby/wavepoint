/**
 * Admin Invites API
 *
 * GET  - List all invites with stats
 * POST - Create a new invite
 *
 * Protected: Returns 404 for non-admins (hides endpoint existence)
 */

import { NextResponse } from "next/server";

import { env } from "@/env";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/admin";
import {
  createInvite,
  createInviteSchema,
  getInviteStats,
  listInvites,
  syncInviteToBrevoAsync,
} from "@/lib/invites";

export async function GET() {
  try {
    const session = await auth();

    // Return 404 to hide admin routes from non-admins
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [invites, stats] = await Promise.all([
      listInvites(),
      getInviteStats(),
    ]);

    return NextResponse.json({ invites, stats });
  } catch (error) {
    console.error("List invites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    // Return 404 to hide admin routes from non-admins
    if (!session?.user?.id || !isAdmin(session)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = createInviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const result = await createInvite(email);

    if (!result.success || !result.data) {
      // 409 for duplicate email
      const status = result.error === "This email has already been invited" ? 409 : 400;
      return NextResponse.json({ error: result.error ?? "Failed to create invite" }, { status });
    }

    const invite = result.data;

    // Fire-and-forget Brevo sync
    syncInviteToBrevoAsync(invite.email, invite.code);

    // Build invite URL
    const inviteUrl = `${env.APP_URL}/invite/${invite.code}`;

    return NextResponse.json(
      {
        invite,
        inviteUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create invite error:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 }
    );
  }
}
