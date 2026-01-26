import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { auth } from "@/lib/auth";
import { canAccessCalendar } from "@/lib/features/access";
import { DayViewContent } from "./day-view-content";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: DayPageProps): Promise<Metadata> {
  const { date } = await params;

  // Validate date format
  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) {
    return { title: "Invalid Date" };
  }

  const formattedDate = format(parsedDate, "MMMM d, yyyy");
  return {
    title: `${formattedDate} | Calendar`,
    description: `Cosmic weather and synchronicities for ${formattedDate}`,
  };
}

export default async function DayPage({ params }: DayPageProps) {
  const session = await auth();
  const { date } = await params;

  // Check feature access
  if (!canAccessCalendar(session)) {
    redirect("/calendar");
  }

  // Require auth
  if (!session?.user) {
    redirect("/?auth=sign-in");
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    notFound();
  }

  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) {
    notFound();
  }

  return <DayViewContent date={date} />;
}
