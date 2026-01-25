/**
 * GET /api/archetypes/[slug] - Get a single archetype
 *
 * Returns the archetype with all its relations populated.
 */

import { NextResponse } from "next/server";

import {
  isValidArchetypeSlug,
  getArchetypeWithRelations,
  type ArchetypeSlug,
} from "@/lib/archetypes";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!isValidArchetypeSlug(slug)) {
      return NextResponse.json({ error: "Invalid archetype slug" }, { status: 400 });
    }

    // Get archetype with relations
    const archetype = getArchetypeWithRelations(slug as ArchetypeSlug);

    if (!archetype) {
      return NextResponse.json({ error: "Archetype not found" }, { status: 404 });
    }

    return NextResponse.json({ archetype });
  } catch (error) {
    console.error("Get archetype error:", error);
    return NextResponse.json(
      { error: "Failed to fetch archetype" },
      { status: 500 }
    );
  }
}
