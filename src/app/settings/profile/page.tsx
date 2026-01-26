import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Heading } from "@radix-ui/themes";
import { auth } from "@/lib/auth";
import { db, spiritualProfiles } from "@/lib/db";
import { BirthDataForm } from "@/components/profile";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your birth data and cosmic blueprint.",
};

export default async function ProfileEditPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/?auth=sign-in");
  }

  // Fetch existing profile if any
  const [row] = await db
    .select()
    .from(spiritualProfiles)
    .where(eq(spiritualProfiles.userId, session.user.id));

  const initialData = row
    ? {
        birthDate: row.birthDate.toISOString().split("T")[0],
        birthTime: row.birthTime,
        birthTimeApproximate: row.birthTimeApproximate,
        birthCity: row.birthCity,
        birthCountry: row.birthCountry,
        birthLatitude: parseFloat(row.birthLatitude),
        birthLongitude: parseFloat(row.birthLongitude),
        birthTimezone: row.birthTimezone,
      }
    : undefined;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <AnimateOnScroll className="mb-8">
            <Link
              href="/profile"
              className="mb-4 inline-block text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
            >
              \u2190 Back to profile
            </Link>
            <Heading size="7" className="font-display text-foreground">
              {row ? "Edit Your Profile" : "Set Up Your Profile"}
            </Heading>
          </AnimateOnScroll>

          {/* Form */}
          <AnimateOnScroll delay={0.1}>
            <BirthDataForm initialData={initialData} />
          </AnimateOnScroll>
        </div>
      </div>
    </main>
  );
}
