/**
 * GET /api/calendar/transits - Get personal transits for a date
 *
 * Calculates which current planetary positions are aspecting the user's natal chart.
 * Requires authentication and a saved spiritual profile with chart data.
 *
 * Query params:
 * - date: YYYY-MM-DD format (required)
 */

import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { calculateDashboardCosmicContext, calculateNextSignTransition } from "@/lib/signal";
import { dateStringSchema } from "@/lib/calendar";
import { calculateTransits, filterSignificantTransits, type StoredChartData } from "@/lib/transits";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 requests per minute
    const rateLimitKey = `calendar:transits:${session.user.id}`;
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

    // Validate date parameter
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter. Use ?date=YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const parsed = dateStringSchema.safeParse(date);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    // Get user's spiritual profile
    const [profile] = await db
      .select()
      .from(spiritualProfiles)
      .where(eq(spiritualProfiles.userId, session.user.id));

    if (!profile) {
      return NextResponse.json(
        {
          error: "no_profile",
          message: "No spiritual profile found. Create a profile to see personal transits.",
        },
        { status: 404 }
      );
    }

    const chartData = profile.chartData as StoredChartData | null;
    if (!chartData || !chartData.planets) {
      return NextResponse.json(
        {
          error: "incomplete_profile",
          message: "Profile chart data is incomplete. Please update your profile.",
        },
        { status: 400 }
      );
    }

    // Calculate cosmic context for the requested date (noon UTC)
    const dateObj = new Date(`${date}T12:00:00Z`);
    const cosmicContext = calculateDashboardCosmicContext(
      dateObj,
      calculateNextSignTransition
    );

    // Calculate transits
    const allTransits = calculateTransits(cosmicContext, chartData);
    const significantTransits = filterSignificantTransits(allTransits, 15);

    return NextResponse.json({
      date,
      transits: significantTransits,
      totalCount: allTransits.length,
    });
  } catch (error) {
    console.error("Transits calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate transits" },
      { status: 500 }
    );
  }
}
