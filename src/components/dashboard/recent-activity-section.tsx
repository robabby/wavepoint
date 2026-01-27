"use client";

import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Hash, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSightings } from "@/hooks/signal";
import { useJournalEntries } from "@/hooks/calendar";
import type { SightingWithInterpretation } from "@/lib/signal/types";
import type { CalendarJournalEntry } from "@/lib/db/schema";

type ActivityItem =
  | { type: "sighting"; item: SightingWithInterpretation; date: Date }
  | { type: "journal"; item: CalendarJournalEntry; date: Date };

/**
 * Section 4: Recent Activity
 *
 * Unified feed showing sightings + journal entries interleaved by date.
 * Each item shows: type badge, date, preview.
 */
export function RecentActivitySection() {
  // Get last 7 days for journal entries
  const dateRange = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      start: start.toISOString().split("T")[0] ?? "",
      end: end.toISOString().split("T")[0] ?? "",
    };
  }, []);

  const { sightings, isLoading: sightingsLoading } = useSightings({ limit: 10 });
  const { entries: journalEntries, isLoading: journalLoading } = useJournalEntries(
    dateRange.start,
    dateRange.end
  );

  // Combine and sort by date
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add sightings
    for (const sighting of sightings) {
      items.push({
        type: "sighting",
        item: sighting,
        date: new Date(sighting.timestamp),
      });
    }

    // Add journal entries
    for (const entry of journalEntries) {
      items.push({
        type: "journal",
        item: entry,
        date: new Date(entry.entryDate),
      });
    }

    // Sort by date descending
    items.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Return top 8
    return items.slice(0, 8);
  }, [sightings, journalEntries]);

  const isLoading = sightingsLoading || journalLoading;
  const isEmpty = !isLoading && activities.length === 0;

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg text-foreground">
        Recent Activity
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-[var(--border-gold)]/10 bg-card/20 p-3"
            >
              <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="rounded-xl border border-[var(--border-gold)]/10 bg-card/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">No recent activity</p>
          <Link
            href="/signal/capture"
            className="mt-2 inline-block text-sm text-[var(--color-gold)] hover:underline"
          >
            Capture your first signal →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((activity, i) => (
            <ActivityRow key={`${activity.type}-${i}`} activity={activity} />
          ))}
        </div>
      )}
    </section>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  if (activity.type === "sighting") {
    return <SightingRow sighting={activity.item} />;
  }
  return <JournalRow entry={activity.item} />;
}

function SightingRow({ sighting }: { sighting: SightingWithInterpretation }) {
  const preview = useMemo(() => {
    const content = sighting.interpretation?.content;
    if (!content) return null;
    // Get first line, truncate if needed
    const firstLine = content.split("\n")[0] ?? "";
    return firstLine.length > 60 ? firstLine.slice(0, 60) + "..." : firstLine;
  }, [sighting.interpretation?.content]);

  return (
    <Link
      href={`/signal/sighting/${sighting.id}`}
      className={cn(
        "flex items-center gap-3 rounded-xl p-3",
        "border border-[var(--border-gold)]/10 bg-card/20",
        "transition-all hover:border-[var(--border-gold)]/30 hover:bg-card/40"
      )}
    >
      {/* Number badge */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
        <span className="font-display text-lg text-[var(--color-gold)]">
          {sighting.number}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Hash className="h-3 w-3 text-[var(--color-gold)]" />
          <span className="text-sm font-medium text-foreground">
            {sighting.number}
          </span>
        </div>
        {preview && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {preview}
          </p>
        )}
      </div>

      {/* Time */}
      <span className="shrink-0 text-xs text-muted-foreground/60">
        {formatDistanceToNow(new Date(sighting.timestamp), { addSuffix: true })}
      </span>
    </Link>
  );
}

function JournalRow({ entry }: { entry: CalendarJournalEntry }) {
  const preview = useMemo(() => {
    if (!entry.content) return null;
    return entry.content.length > 60
      ? entry.content.slice(0, 60) + "..."
      : entry.content;
  }, [entry.content]);

  const eventTypeLabel = useMemo(() => {
    switch (entry.eventType) {
      case "reflection":
        return "Reflection";
      case "milestone":
        return "Milestone";
      default:
        return "Note";
    }
  }, [entry.eventType]);

  return (
    <Link
      href={`/calendar/day/${entry.entryDate}`}
      className={cn(
        "flex items-center gap-3 rounded-xl p-3",
        "border border-[var(--border-gold)]/10 bg-card/20",
        "transition-all hover:border-[var(--border-gold)]/30 hover:bg-card/40"
      )}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card/50">
        <BookOpen className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {eventTypeLabel}
          </span>
        </div>
        {preview && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {preview}
          </p>
        )}
      </div>

      {/* Date */}
      <span className="shrink-0 text-xs text-muted-foreground/60">
        {formatDistanceToNow(new Date(entry.entryDate), { addSuffix: true })}
      </span>
    </Link>
  );
}
