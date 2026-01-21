/**
 * GET /api/numbers - List all number patterns
 *
 * Query params:
 * - category: Filter by category (triple, quad, sequential, mirrored, double)
 * - featured: If "true", return only featured patterns
 */

import { NextResponse } from "next/server";

import {
  getAllPatterns,
  getPatternsByCategory,
  getFeaturedPatterns,
  type NumberCategory,
} from "@/lib/numbers";

const VALID_CATEGORIES: NumberCategory[] = [
  "triple",
  "quad",
  "sequential",
  "mirrored",
  "double",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    // Featured patterns (excludes 666)
    if (featured === "true") {
      const patterns = getFeaturedPatterns();
      return NextResponse.json({
        patterns,
        total: patterns.length,
      });
    }

    // Filter by category
    if (category) {
      if (!VALID_CATEGORIES.includes(category as NumberCategory)) {
        return NextResponse.json(
          {
            error: "Invalid category",
            validCategories: VALID_CATEGORIES,
          },
          { status: 400 }
        );
      }

      const patterns = getPatternsByCategory(category as NumberCategory);
      return NextResponse.json({
        patterns,
        total: patterns.length,
        category,
      });
    }

    // All patterns
    const patterns = getAllPatterns();
    return NextResponse.json({
      patterns,
      total: patterns.length,
    });
  } catch (error) {
    console.error("Get patterns error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patterns" },
      { status: 500 }
    );
  }
}
