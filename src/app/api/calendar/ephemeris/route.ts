/**
 * GET /api/calendar/ephemeris - Get cosmic context for calendar
 *
 * Supports two query modes:
 * - Single day: ?date=YYYY-MM-DD&tz=IANA_TIMEZONE
 * - Date range: ?start=YYYY-MM-DD&end=YYYY-MM-DD&tz=IANA_TIMEZONE
 *
 * The `tz` parameter (optional) specifies the user's timezone for accurate
 * lunar peak detection. Defaults to UTC if not provided.
 *
 * No authentication required - cosmic context is universal.
 * Rate limited to 60 requests per minute.
 */

import { NextResponse, type NextRequest } from "next/server";

import {
  calculateDashboardCosmicContext,
  calculateNextSignTransition,
} from "@/lib/signal";
import { calculateBatchEphemeris, getNoonInTimezone } from "@/lib/signal/ephemeris-batch";
import {
  dateStringSchema,
  type EphemerisDay,
  type EphemerisRange,
} from "@/lib/calendar";
import {
  getCachedEphemeris,
  setCachedEphemeris,
  makeEphemerisKey,
} from "@/lib/calendar/ephemeris-cache";
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
    const tz = searchParams.get("tz") ?? "UTC";

    // Single day mode
    if (date) {
      const parsed = dateStringSchema.safeParse(date);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 }
        );
      }

      // Check cache first, then compute
      const cacheKey = makeEphemerisKey(date, tz);
      let cosmicContext = getCachedEphemeris(cacheKey);
      if (!cosmicContext) {
        const dateObj = getNoonInTimezone(date, tz);
        cosmicContext = calculateDashboardCosmicContext(
          dateObj,
          calculateNextSignTransition
        );
        setCachedEphemeris(cacheKey, cosmicContext);
      }

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

      const startDate = new Date(`${start}T00:00:00Z`);
      const endDate = new Date(`${end}T00:00:00Z`);

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

      // Build list of date keys, checking cache for each
      const dateKeys: string[] = [];
      const days: Record<string, EphemerisDay> = {};
      const current = new Date(startDate);

      while (current <= endDate) {
        const dateKey = current.toISOString().split("T")[0]!;
        const cacheKey = makeEphemerisKey(dateKey, tz);
        const cached = getCachedEphemeris(cacheKey);
        if (cached) {
          days[dateKey] = cached;
        } else {
          dateKeys.push(dateKey);
        }
        current.setDate(current.getDate() + 1);
      }

      // Batch-compute uncached days
      if (dateKeys.length > 0) {
        const batchResults = calculateBatchEphemeris(dateKeys, tz);
        for (const [dateKey, context] of Object.entries(batchResults)) {
          days[dateKey] = context;
          setCachedEphemeris(makeEphemerisKey(dateKey, tz), context);
        }
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
