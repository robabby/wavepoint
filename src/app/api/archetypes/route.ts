/**
 * GET /api/archetypes - List all archetypes
 *
 * Returns all 12 Jungian archetypes.
 */

import { NextResponse } from "next/server";
import { getAllArchetypes } from "@/lib/archetypes";

export async function GET() {
  try {
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
