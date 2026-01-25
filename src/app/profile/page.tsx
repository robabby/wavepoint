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
import { ProfileHero, ElementBalance, ProfileEmptyState } from "@/components/profile";
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

          {/* Birth data summary */}
          <AnimateOnScroll delay={0.2} className="mt-8 text-center">
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
