import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import type { ZodiacSign } from "@/lib/astrology";
import {
  getElementBalanceFromProfile,
  getBigThreeFromProfile,
  type SpiritualProfile,
} from "@/lib/profile";
import { toNumerologyData } from "@/lib/numerology";
import {
  ProfileHero,
  ElementBalance,
  ProfileEmptyState,
  ResonanceSummary,
  PatternsSection,
  GeometryAffinities,
} from "@/components/profile";
import { NumerologyProfileCard } from "@/components/numerology";
import { ConstellationSection } from "@/components/constellation";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Your Profile",
  description: "View your cosmic blueprint - your birth chart and element balance.",
};

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

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/?auth=sign-in");
  }

  // Fetch profile
  const [row] = await db
    .select()
    .from(spiritualProfiles)
    .where(eq(spiritualProfiles.userId, session.user.id));

  // If no profile, show empty state
  if (!row) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <ProfileEmptyState />
        </div>
      </main>
    );
  }

  const profile = rowToProfile(row);
  const bigThree = getBigThreeFromProfile(profile);
  const elementBalance = getElementBalanceFromProfile(profile);

  // Calculate numerology data
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

  // If no bigThree (shouldn't happen with a saved profile, but handle gracefully)
  if (!bigThree) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <ProfileEmptyState />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          {/* Hero with Big Three */}
          <AnimateOnScroll>
            <ProfileHero bigThree={bigThree} />
          </AnimateOnScroll>

          {/* Element Balance */}
          <AnimateOnScroll delay={0.1}>
            <ElementBalance elementBalance={elementBalance} />
          </AnimateOnScroll>

          {/* Numerology */}
          {numerology && (
            <AnimateOnScroll delay={0.2} className="mt-6">
              <NumerologyProfileCard
                numerology={numerology}
                hasBirthName={!!profile.birthName}
              />
            </AnimateOnScroll>
          )}

          {/* Archetypal Constellation */}
          <AnimateOnScroll delay={0.3} className="mt-6">
            <ConstellationSection />
          </AnimateOnScroll>

          {/* Signal Fingerprint Section Divider */}
          <AnimateOnScroll delay={0.5} className="my-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
              <AnimateOnScroll delay={0.6}>
                <span className="font-heading text-sm uppercase tracking-widest text-muted-foreground">
                  Your Signal Fingerprint
                </span>
              </AnimateOnScroll>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />
            </div>
          </AnimateOnScroll>

          {/* Resonance Summary */}
          <AnimateOnScroll delay={0.7}>
            <ResonanceSummary />
          </AnimateOnScroll>

          {/* Patterns Section */}
          <AnimateOnScroll delay={0.8} className="mt-8">
            <PatternsSection />
          </AnimateOnScroll>

          {/* Geometry Affinities */}
          <AnimateOnScroll delay={1.0} className="mt-8">
            <GeometryAffinities />
          </AnimateOnScroll>

          {/* Birth data summary */}
          <AnimateOnScroll delay={1.1} className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Born in {profile.birthCity}, {profile.birthCountry}
              {profile.birthTime && ` at ${profile.birthTime.slice(0, 5)}`}
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
