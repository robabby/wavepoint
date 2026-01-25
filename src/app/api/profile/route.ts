/**
 * Profile API routes
 *
 * GET /api/profile - Get current user's profile
 * PUT /api/profile - Create or update profile
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { calculateChart } from "@/lib/astrology/chart";
import type { ZodiacSign } from "@/lib/astrology";
import {
  calculateElementBalance,
  calculateModalityBalance,
  extractBigThree,
  extractStoredChartData,
  getElementBalanceFromProfile,
  getModalityBalanceFromProfile,
  getBigThreeFromProfile,
  parseBirthTime,
  CALCULATION_VERSION,
  type SpiritualProfile,
} from "@/lib/profile";

/**
 * Schema for profile input validation
 */
const profileInputSchema = z.object({
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  birthTime: z.string().nullable().optional(),
  birthTimeApproximate: z.boolean().optional().default(false),
  birthCity: z.string().min(1, "City is required"),
  birthCountry: z.string().min(1, "Country is required"),
  birthLatitude: z.number().min(-90).max(90),
  birthLongitude: z.number().min(-180).max(180),
  birthTimezone: z.string().min(1, "Timezone is required"),
});

/**
 * Convert database row to SpiritualProfile type
 */
function rowToProfile(row: typeof spiritualProfiles.$inferSelect): SpiritualProfile {
  return {
    id: row.id,
    userId: row.userId,
    birthDate: row.birthDate,
    birthTime: row.birthTime,
    birthTimeApproximate: row.birthTimeApproximate,
    birthCity: row.birthCity,
    birthCountry: row.birthCountry,
    birthLatitude: parseFloat(row.birthLatitude),
    birthLongitude: parseFloat(row.birthLongitude),
    birthTimezone: row.birthTimezone,
    sunSign: row.sunSign as ZodiacSign | null,
    sunDegree: row.sunDegree ? parseFloat(row.sunDegree) : null,
    moonSign: row.moonSign as ZodiacSign | null,
    moonDegree: row.moonDegree ? parseFloat(row.moonDegree) : null,
    risingSign: row.risingSign as ZodiacSign | null,
    risingDegree: row.risingDegree ? parseFloat(row.risingDegree) : null,
    elementFire: row.elementFire,
    elementEarth: row.elementEarth,
    elementAir: row.elementAir,
    elementWater: row.elementWater,
    modalityCardinal: row.modalityCardinal,
    modalityFixed: row.modalityFixed,
    modalityMutable: row.modalityMutable,
    chartData: row.chartData as SpiritualProfile["chartData"],
    calculatedAt: row.calculatedAt,
    calculationVersion: row.calculationVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [row] = await db
      .select()
      .from(spiritualProfiles)
      .where(eq(spiritualProfiles.userId, session.user.id));

    if (!row) {
      return NextResponse.json({
        profile: null,
        bigThree: null,
        elementBalance: null,
        modalityBalance: null,
      });
    }

    const profile = rowToProfile(row);

    return NextResponse.json({
      profile,
      bigThree: getBigThreeFromProfile(profile),
      elementBalance: getElementBalanceFromProfile(profile),
      modalityBalance: getModalityBalanceFromProfile(profile),
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = profileInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      birthDate: birthDateStr,
      birthTime,
      birthTimeApproximate,
      birthCity,
      birthCountry,
      birthLatitude,
      birthLongitude,
      birthTimezone,
    } = parsed.data;

    const birthDate = new Date(birthDateStr);
    const parsedTime = parseBirthTime(birthTime ?? null);
    const hasBirthTime = !!parsedTime;

    // Calculate chart
    const chart = calculateChart({
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: parsedTime?.hour ?? 12, // Default to noon if no time
      minute: parsedTime?.minute ?? 0,
      location: {
        latitude: birthLatitude,
        longitude: birthLongitude,
        name: `${birthCity}, ${birthCountry}`,
      },
    });

    const elementBalance = calculateElementBalance(chart);
    const modalityBalance = calculateModalityBalance(chart);
    const bigThree = extractBigThree(chart, hasBirthTime);
    const chartData = extractStoredChartData(chart);

    const now = new Date();

    // Upsert profile
    const [row] = await db
      .insert(spiritualProfiles)
      .values({
        userId: session.user.id,
        birthDate,
        birthTime: birthTime ?? null,
        birthTimeApproximate: birthTimeApproximate ?? false,
        birthCity,
        birthCountry,
        birthLatitude: birthLatitude.toString(),
        birthLongitude: birthLongitude.toString(),
        birthTimezone,
        sunSign: chart.sunSign,
        sunDegree: chart.planets.sun?.position.signDegrees.toFixed(2) ?? null,
        moonSign: chart.moonSign,
        moonDegree: chart.planets.moon?.position.signDegrees.toFixed(2) ?? null,
        risingSign: hasBirthTime ? chart.risingSign : null,
        risingDegree: hasBirthTime ? chart.angles.ascendant.position.signDegrees.toFixed(2) : null,
        elementFire: elementBalance.fire,
        elementEarth: elementBalance.earth,
        elementAir: elementBalance.air,
        elementWater: elementBalance.water,
        modalityCardinal: modalityBalance.cardinal,
        modalityFixed: modalityBalance.fixed,
        modalityMutable: modalityBalance.mutable,
        chartData,
        calculatedAt: now,
        calculationVersion: CALCULATION_VERSION,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: spiritualProfiles.userId,
        set: {
          birthDate,
          birthTime: birthTime ?? null,
          birthTimeApproximate: birthTimeApproximate ?? false,
          birthCity,
          birthCountry,
          birthLatitude: birthLatitude.toString(),
          birthLongitude: birthLongitude.toString(),
          birthTimezone,
          sunSign: chart.sunSign,
          sunDegree: chart.planets.sun?.position.signDegrees.toFixed(2) ?? null,
          moonSign: chart.moonSign,
          moonDegree: chart.planets.moon?.position.signDegrees.toFixed(2) ?? null,
          risingSign: hasBirthTime ? chart.risingSign : null,
          risingDegree: hasBirthTime ? chart.angles.ascendant.position.signDegrees.toFixed(2) : null,
          elementFire: elementBalance.fire,
          elementEarth: elementBalance.earth,
          elementAir: elementBalance.air,
          elementWater: elementBalance.water,
          modalityCardinal: modalityBalance.cardinal,
          modalityFixed: modalityBalance.fixed,
          modalityMutable: modalityBalance.mutable,
          chartData,
          calculatedAt: now,
          calculationVersion: CALCULATION_VERSION,
          updatedAt: now,
        },
      })
      .returning();

    const profile = rowToProfile(row!);

    return NextResponse.json({
      profile,
      bigThree,
      elementBalance,
      modalityBalance,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
