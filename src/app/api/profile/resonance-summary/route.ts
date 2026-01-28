/**
 * GET /api/profile/resonance-summary - Get aggregate resonance stats for the user
 */

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getResonanceSummary } from "@/lib/resonance/queries";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const summary = await getResonanceSummary(session.user.id);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Get resonance summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resonance summary" },
      { status: 500 }
    );
  }
}
