import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { canAccessCalendar } from "@/lib/features/access";
import { CalendarMarketingPage, MonthView } from "@/components/calendar";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Your cosmic calendar with moon phases, transits, and synchronicities.",
};

interface CalendarPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const session = await auth();
  const params = await searchParams;

  // Show marketing page when feature is disabled (unless admin)
  if (!canAccessCalendar(session)) {
    return <CalendarMarketingPage />;
  }

  // Require auth for the actual Calendar app
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <MonthView initialMonth={params.month} />
      </div>
    </div>
  );
}
