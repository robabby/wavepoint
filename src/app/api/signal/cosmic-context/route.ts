/**
 * GET /api/signal/cosmic-context - Get current cosmic context for dashboard
 *
 * Returns planetary positions, moon phase, sign transitions, and tight aspects.
 * No authentication required - cosmic context is the same for everyone.
 */

import { NextResponse } from "next/server";

import {
  calculateDashboardCosmicContext,
  calculateNextSignTransition,
} from "@/lib/signal";

export async function GET() {
  try {
    const now = new Date();

    // Calculate cosmic context with sign transitions
    const cosmicContext = calculateDashboardCosmicContext(
      now,
      calculateNextSignTransition
    );

    // Add cache headers (5 minutes - matches client staleTime)
    return NextResponse.json(cosmicContext, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Cosmic context calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate cosmic context" },
      { status: 500 }
    );
  }
}
