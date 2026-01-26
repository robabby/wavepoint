/**
 * Journal entry API routes for calendar feature.
 *
 * PATCH /api/calendar/journal/[id] - Update entry
 * DELETE /api/calendar/journal/[id] - Delete entry
 *
 * Requires authentication and ownership.
 */

import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calendarJournalEntries } from "@/lib/db/schema";
import {
  updateJournalEntrySchema,
  type CalendarJournalEntry,
  type JournalEntryType,
} from "@/lib/calendar";
import { checkRateLimit } from "@/lib/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/calendar/journal/[id] - Update a journal entry
 *
 * Body:
 * - content: string (optional, max 500 chars)
 * - eventType: 'reflection' | 'milestone' | 'note' (optional)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 writes per minute
    const rateLimitKey = `calendar:journal:patch:${session.user.id}`;
    const rateLimit = await checkRateLimit(rateLimitKey, {
      limit: 30,
      windowMs: 60000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 });
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = updateJournalEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updates = parsed.data;

    // Check if there are any updates
    if (!updates.content && !updates.eventType) {
      return NextResponse.json(
        { error: "No updates provided" },
        { status: 400 }
      );
    }

    // Update entry (only if owned by user)
    const [entry] = await db
      .update(calendarJournalEntries)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(calendarJournalEntries.id, id),
          eq(calendarJournalEntries.userId, session.user.id)
        )
      )
      .returning();

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found or access denied" },
        { status: 404 }
      );
    }

    const formattedEntry: CalendarJournalEntry = {
      id: entry.id,
      userId: entry.userId,
      entryDate: entry.entryDate,
      tz: entry.tz,
      content: entry.content,
      eventType: entry.eventType as JournalEntryType,
      cosmicSnapshot: entry.cosmicSnapshot as CalendarJournalEntry["cosmicSnapshot"],
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };

    return NextResponse.json({ entry: formattedEntry });
  } catch (error) {
    console.error("Journal PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/calendar/journal/[id] - Delete a journal entry
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 writes per minute
    const rateLimitKey = `calendar:journal:delete:${session.user.id}`;
    const rateLimit = await checkRateLimit(rateLimitKey, {
      limit: 30,
      windowMs: 60000,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 });
    }

    // Delete entry (only if owned by user)
    const [deleted] = await db
      .delete(calendarJournalEntries)
      .where(
        and(
          eq(calendarJournalEntries.id, id),
          eq(calendarJournalEntries.userId, session.user.id)
        )
      )
      .returning({ id: calendarJournalEntries.id });

    if (!deleted) {
      return NextResponse.json(
        { error: "Entry not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id: deleted.id });
  } catch (error) {
    console.error("Journal DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
