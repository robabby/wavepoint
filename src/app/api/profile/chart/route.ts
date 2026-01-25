/**
 * Chart calculation API route
 *
 * POST /api/profile/chart - Calculate chart without saving
 *
 * Used for previewing chart results before committing to profile.
 */

import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateChart } from "@/lib/astrology/chart";
import {
  calculateElementBalance,
  calculateModalityBalance,
  extractBigThree,
  parseBirthTime,
} from "@/lib/profile";

/**
 * Schema for chart calculation input
 */
const chartInputSchema = z.object({
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  birthTime: z.string().nullable().optional(),
  birthLatitude: z.number().min(-90).max(90),
  birthLongitude: z.number().min(-180).max(180),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = chartInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { birthDate: birthDateStr, birthTime, birthLatitude, birthLongitude } = parsed.data;

    // Parse date string directly to avoid timezone conversion issues
    // Input format: "YYYY-MM-DD" from HTML date input
    const [yearStr, monthStr, dayStr] = birthDateStr.split("-");
    const year = parseInt(yearStr!, 10);
    const month = parseInt(monthStr!, 10); // Already 1-indexed from HTML date input
    const day = parseInt(dayStr!, 10);

    const parsedTime = parseBirthTime(birthTime ?? null);
    const hasBirthTime = !!parsedTime;

    // Calculate chart
    const chart = calculateChart({
      year,
      month,
      day,
      hour: parsedTime?.hour ?? 12, // Default to noon if no time
      minute: parsedTime?.minute ?? 0,
      location: {
        latitude: birthLatitude,
        longitude: birthLongitude,
      },
    });

    const elementBalance = calculateElementBalance(chart);
    const modalityBalance = calculateModalityBalance(chart);
    const bigThree = extractBigThree(chart, hasBirthTime);

    return NextResponse.json({
      success: true,
      bigThree,
      elementBalance,
      modalityBalance,
    });
  } catch (error) {
    console.error("Calculate chart error:", error);
    return NextResponse.json(
      { error: "Failed to calculate chart" },
      { status: 500 }
    );
  }
}
