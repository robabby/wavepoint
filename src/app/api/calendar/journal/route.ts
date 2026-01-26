/**
 * Journal API routes for calendar feature.
 *
 * GET /api/calendar/journal - List entries in date range
 * POST /api/calendar/journal - Create new entry
 *
 * Requires authentication.
 */

import { NextResponse, type NextRequest } from "next/server";
import { and, eq, gte, lte } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calendarJournalEntries } from "@/lib/db/schema";
import {
  journalListQuerySchema,
  createJournalEntrySchema,
  type CalendarJournalEntry,
  type JournalEntryType,
} from "@/lib/calendar";
import { calculateDashboardCosmicContext, calculateNextSignTransition } from "@/lib/signal";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/calendar/journal - List journal entries in date range
 *
 * Query params:
 * - start: YYYY-MM-DD (required)
 * - end: YYYY-MM-DD (required)
 * - tz: IANA timezone (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 60 requests per minute
    const rateLimitKey = `calendar:journal:get:${session.user.id}`;
    const rateLimit = await checkRateLimit(rateLimitKey, {
      limit: 60,
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

    // Parse and validate query params
    const searchParams = request.nextUrl.searchParams;
    const query = {
      start: searchParams.get("start"),
      end: searchParams.get("end"),
      tz: searchParams.get("tz") ?? undefined,
    };

    const parsed = journalListQuerySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { start, end } = parsed.data;

    // Query entries in date range
    const entries = await db
      .select()
      .from(calendarJournalEntries)
      .where(
        and(
          eq(calendarJournalEntries.userId, session.user.id),
          gte(calendarJournalEntries.entryDate, new Date(start)),
          lte(calendarJournalEntries.entryDate, new Date(end))
        )
      )
      .orderBy(calendarJournalEntries.entryDate);

    // Transform to API response format
    const formattedEntries: CalendarJournalEntry[] = entries.map((entry) => ({
      id: entry.id,
      userId: entry.userId,
      entryDate: entry.entryDate,
      tz: entry.tz,
      content: entry.content,
      eventType: entry.eventType as JournalEntryType,
      cosmicSnapshot: entry.cosmicSnapshot as CalendarJournalEntry["cosmicSnapshot"],
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }));

    return NextResponse.json({ entries: formattedEntries });
  } catch (error) {
    console.error("Journal GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/calendar/journal - Create a new journal entry
 *
 * Body:
 * - entryDate: YYYY-MM-DD (required)
 * - content: string (required, max 500 chars)
 * - eventType: 'reflection' | 'milestone' | 'note' (optional, default 'note')
 * - tz: IANA timezone (optional)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 writes per minute
    const rateLimitKey = `calendar:journal:post:${session.user.id}`;
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

    // Parse and validate body
    const body = await request.json();
    const parsed = createJournalEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { entryDate, content, eventType, tz } = parsed.data;

    // Check for existing entry on this date (one per day per user)
    const existing = await db
      .select({ id: calendarJournalEntries.id })
      .from(calendarJournalEntries)
      .where(
        and(
          eq(calendarJournalEntries.userId, session.user.id),
          eq(calendarJournalEntries.entryDate, new Date(entryDate))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Entry already exists for this date. Use PATCH to update." },
        { status: 409 }
      );
    }

    // Calculate cosmic snapshot for the entry date
    const dateObj = new Date(`${entryDate}T12:00:00Z`);
    const cosmic = calculateDashboardCosmicContext(dateObj, calculateNextSignTransition);
    const cosmicSnapshot = {
      moonPhase: cosmic.moon.phase,
      moonSign: cosmic.moon.sign,
      sunSign: cosmic.sun.sign,
    };

    // Create entry
    const [entry] = await db
      .insert(calendarJournalEntries)
      .values({
        userId: session.user.id,
        entryDate: new Date(entryDate),
        content,
        eventType,
        tz: tz ?? null,
        cosmicSnapshot,
      })
      .returning();

    if (!entry) {
      return NextResponse.json(
        { error: "Failed to create journal entry" },
        { status: 500 }
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

    return NextResponse.json({ entry: formattedEntry }, { status: 201 });
  } catch (error) {
    console.error("Journal POST error:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
