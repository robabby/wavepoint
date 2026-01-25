/**
 * GET /api/archetypes - List all archetypes
 *
 * Query params:
 * - attribution: Filter by attribution type (element, planet, zodiac)
 */

import { NextResponse } from "next/server";

import {
  getAllArchetypes,
  getArchetypesByAttribution,
  type AttributionType,
} from "@/lib/archetypes";

const VALID_ATTRIBUTION_TYPES: AttributionType[] = [
  "element",
  "planet",
  "zodiac",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const attribution = searchParams.get("attribution");

    // Filter by attribution type
    if (attribution) {
      if (!VALID_ATTRIBUTION_TYPES.includes(attribution as AttributionType)) {
        return NextResponse.json(
          {
            error: "Invalid attribution type",
            validTypes: VALID_ATTRIBUTION_TYPES,
          },
          { status: 400 }
        );
      }

      const archetypes = getArchetypesByAttribution(
        attribution as AttributionType
      );
      return NextResponse.json({
        archetypes,
        total: archetypes.length,
      });
    }

    // All archetypes
    const archetypes = getAllArchetypes();
    return NextResponse.json({
      archetypes,
      total: archetypes.length,
    });
  } catch (error) {
    console.error("Get archetypes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch archetypes" },
      { status: 500 }
    );
  }
}
