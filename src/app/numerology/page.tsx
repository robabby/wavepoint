import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { spiritualProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { PartialNumerologyProfile } from "@/lib/numerology";
import { NumerologyPageClient } from "./NumerologyPageClient";

export const metadata: Metadata = {
  title: "Numerology",
  description:
    "The mathematics of destiny. Explore core digit archetypes, numerological positions, and the cycles shaping your path.",
  openGraph: {
    title: "Numerology | WavePoint",
    description:
      "Explore digit archetypes, numerological positions, and personal cycles.",
  },
  keywords: [
    "numerology",
    "life path number",
    "expression number",
    "soul urge",
    "personality number",
    "birthday number",
    "maturity number",
    "numerology positions",
    "digit archetypes",
  ],
};

export default async function NumerologyPage() {
  // Fetch user's numerology data for personalization
  let userNumerology: PartialNumerologyProfile | null = null;
  let isAuthenticated = false;

  try {
    const session = await auth();
    isAuthenticated = !!session?.user?.id;

    if (session?.user?.id) {
      const [profile] = await db
        .select({
          lifePath: spiritualProfiles.lifePathNumber,
          birthday: spiritualProfiles.birthdayNumber,
          expression: spiritualProfiles.expressionNumber,
          soulUrge: spiritualProfiles.soulUrgeNumber,
          personality: spiritualProfiles.personalityNumber,
          maturity: spiritualProfiles.maturityNumber,
        })
        .from(spiritualProfiles)
        .where(eq(spiritualProfiles.userId, session.user.id));

      if (profile) {
        userNumerology = {
          lifePath: profile.lifePath,
          birthday: profile.birthday,
          expression: profile.expression,
          soulUrge: profile.soulUrge,
          personality: profile.personality,
          maturity: profile.maturity,
        };
      }
    }
  } catch {
    // Auth or DB error - continue without personalization
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NumerologyPageClient
        userNumerology={userNumerology}
        isAuthenticated={isAuthenticated}
      />
    </main>
  );
}
