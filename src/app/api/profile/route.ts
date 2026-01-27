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
import { getTimezone } from "@/lib/location";
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
import { calculateStableNumbers, toNumerologyData } from "@/lib/numerology";

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
  birthTimezone: z.string().optional(), // Auto-calculated from coordinates if not provided
  birthName: z.string().nullable().optional(), // Full name at birth for numerology
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
    birthName: row.birthName,
    lifePathNumber: row.lifePathNumber,
    birthdayNumber: row.birthdayNumber,
    expressionNumber: row.expressionNumber,
    soulUrgeNumber: row.soulUrgeNumber,
    personalityNumber: row.personalityNumber,
    maturityNumber: row.maturityNumber,
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
        numerology: null,
      });
    }

    const profile = rowToProfile(row);

    // Calculate numerology data (dynamic cycles need current date)
    const numerology = profile.birthDate
      ? toNumerologyData(
          {
            lifePathNumber: profile.lifePathNumber,
            birthdayNumber: profile.birthdayNumber,
            expressionNumber: profile.expressionNumber,
            soulUrgeNumber: profile.soulUrgeNumber,
            personalityNumber: profile.personalityNumber,
            maturityNumber: profile.maturityNumber,
          },
          profile.birthDate
        )
      : null;

    return NextResponse.json({
      profile,
      bigThree: getBigThreeFromProfile(profile),
      elementBalance: getElementBalanceFromProfile(profile),
      modalityBalance: getModalityBalanceFromProfile(profile),
      numerology,
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
      birthTimezone: providedTimezone,
      birthName,
    } = parsed.data;

    // Parse date string directly to avoid timezone conversion issues
    // Input format: "YYYY-MM-DD" from HTML date input
    const [yearStr, monthStr, dayStr] = birthDateStr.split("-");
    const year = parseInt(yearStr!, 10);
    const month = parseInt(monthStr!, 10); // Already 1-indexed from HTML date input
    const day = parseInt(dayStr!, 10);

    // Create Date object for database storage (use UTC to preserve the exact date)
    const birthDate = new Date(Date.UTC(year, month - 1, day));

    // Calculate timezone from coordinates (or use provided value if given)
    const birthTimezone = providedTimezone ?? getTimezone(birthLatitude, birthLongitude);
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
        name: `${birthCity}, ${birthCountry}`,
      },
    });

    const elementBalance = calculateElementBalance(chart);
    const modalityBalance = calculateModalityBalance(chart);
    const bigThree = extractBigThree(chart, hasBirthTime);
    const chartData = extractStoredChartData(chart);

    // Calculate numerology numbers
    const numerologyNumbers = calculateStableNumbers(birthDate, birthName);

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
        birthName: birthName ?? null,
        lifePathNumber: numerologyNumbers.lifePath,
        birthdayNumber: numerologyNumbers.birthday,
        expressionNumber: numerologyNumbers.expression,
        soulUrgeNumber: numerologyNumbers.soulUrge,
        personalityNumber: numerologyNumbers.personality,
        maturityNumber: numerologyNumbers.maturity,
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
          birthName: birthName ?? null,
          lifePathNumber: numerologyNumbers.lifePath,
          birthdayNumber: numerologyNumbers.birthday,
          expressionNumber: numerologyNumbers.expression,
          soulUrgeNumber: numerologyNumbers.soulUrge,
          personalityNumber: numerologyNumbers.personality,
          maturityNumber: numerologyNumbers.maturity,
          chartData,
          calculatedAt: now,
          calculationVersion: CALCULATION_VERSION,
          updatedAt: now,
        },
      })
      .returning();

    const profile = rowToProfile(row!);

    // Calculate numerology data for response (includes dynamic cycles)
    const numerology = toNumerologyData(
      {
        lifePathNumber: numerologyNumbers.lifePath,
        birthdayNumber: numerologyNumbers.birthday,
        expressionNumber: numerologyNumbers.expression,
        soulUrgeNumber: numerologyNumbers.soulUrge,
        personalityNumber: numerologyNumbers.personality,
        maturityNumber: numerologyNumbers.maturity,
      },
      birthDate
    );

    return NextResponse.json({
      profile,
      bigThree,
      elementBalance,
      modalityBalance,
      numerology,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
