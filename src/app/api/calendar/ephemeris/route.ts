/**
 * GET /api/calendar/ephemeris - Get cosmic context for calendar
 *
 * Supports two query modes:
 * - Single day: ?date=YYYY-MM-DD
 * - Date range: ?start=YYYY-MM-DD&end=YYYY-MM-DD
 *
 * No authentication required - cosmic context is universal.
 * Rate limited to 60 requests per minute.
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  calculateDashboardCosmicContext,
  calculateNextSignTransition,
} from "@/lib/signal";
import {
  dateStringSchema,
  type EphemerisDay,
  type EphemerisRange,
} from "@/lib/calendar";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    // Rate limit: 60 requests per minute
    const identifier = request.headers.get("x-forwarded-for") ?? "anonymous";
    const rateLimitKey = `calendar:ephemeris:${identifier}`;
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

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    // Single day mode
    if (date) {
      const parsed = dateStringSchema.safeParse(date);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }

      const dateObj = new Date(`${date}T12:00:00Z`); // Noon UTC for consistency
      const cosmicContext = calculateDashboardCosmicContext(
        dateObj,
        calculateNextSignTransition
      );

      return NextResponse.json(
        { date, data: cosmicContext },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
          },
        }
      );
    }

    // Range mode
    if (start && end) {
      const parsedStart = dateStringSchema.safeParse(start);
      const parsedEnd = dateStringSchema.safeParse(end);

      if (!parsedStart.success || !parsedEnd.success) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD for start and end." },
          { status: 400 }
        );
      }

      const startDate = new Date(`${start}T12:00:00Z`);
      const endDate = new Date(`${end}T12:00:00Z`);

      // Validate range (max 45 days to cover a month + buffer)
      const daysDiff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 0) {
        return NextResponse.json(
          { error: "Start date must be before end date." },
          { status: 400 }
        );
      }
      if (daysDiff > 45) {
        return NextResponse.json(
          { error: "Date range cannot exceed 45 days." },
          { status: 400 }
        );
      }

      // Calculate cosmic context for each day
      const days: Record<string, EphemerisDay> = {};
      const current = new Date(startDate);

      while (current <= endDate) {
        const dateKey = current.toISOString().split("T")[0]!;
        days[dateKey] = calculateDashboardCosmicContext(
          current,
          calculateNextSignTransition
        );
        current.setDate(current.getDate() + 1);
      }

      const rangeData: EphemerisRange = {
        start,
        end,
        days,
      };

      return NextResponse.json(
        { start, end, data: rangeData },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
          },
        }
      );
    }

    // No valid query parameters
    return NextResponse.json(
      {
        error:
          "Missing query parameters. Provide either ?date=YYYY-MM-DD or ?start=YYYY-MM-DD&end=YYYY-MM-DD",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Ephemeris calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate ephemeris" },
      { status: 500 }
    );
  }
}
