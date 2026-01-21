/**
 * GET /api/numbers/[pattern] - Get a single number pattern
 *
 * Returns the pattern with its related patterns.
 * For uncovered patterns (not in our data), returns a component breakdown.
 */

import { NextResponse } from "next/server";

import {
  getPatternByNumber,
  getRelatedPatterns,
  generateComponentBreakdown,
} from "@/lib/numbers";

interface RouteParams {
  params: Promise<{ pattern: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { pattern: patternParam } = await params;

    // Validate pattern format (digits only, 2-5 characters)
    if (!/^\d{2,5}$/.test(patternParam)) {
      return NextResponse.json(
        { error: "Invalid pattern format. Must be 2-5 digits." },
        { status: 400 }
      );
    }

    // Try to get the pattern from our data
    const pattern = getPatternByNumber(patternParam);

    if (pattern) {
      // Known pattern - return with related patterns
      const related = getRelatedPatterns(pattern.id);
      return NextResponse.json({
        pattern,
        related,
      });
    }

    // Uncovered pattern - generate component breakdown
    const breakdown = generateComponentBreakdown(patternParam);

    if (!breakdown) {
      return NextResponse.json(
        { error: "Pattern not found and cannot be broken down" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      pattern: null,
      breakdown,
    });
  } catch (error) {
    console.error("Get pattern error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pattern" },
      { status: 500 }
    );
  }
}
