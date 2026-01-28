"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Heading } from "@radix-ui/themes";
import { ArrowRight, Calendar, Heart } from "lucide-react";
import { useSightings } from "@/hooks/signal";
import { AnimatedCard } from "@/components/animated-card";

export interface SignalHistoryProps {
  number: string;
}

/**
 * Displays a user's Signal history for a specific number.
 * Shows recent sightings with moods and dates.
 * Only renders when user is authenticated and has sightings.
 */
export function SignalHistory({ number }: SignalHistoryProps) {
  const { status } = useSession();
  const { sightings, isLoading } = useSightings({
    number,
    limit: 5,
  });

  // Don't render anything for unauthenticated users
  if (status === "unauthenticated") {
    return null;
  }

  // Don't render during initial load or if no sightings
  if (status === "loading" || isLoading) {
    return null;
  }

  if (sightings.length === 0) {
    return null;
  }

  return (
    <AnimatedCard className="p-6 sm:p-8">
      <Heading
        size="4"
        className="mb-4 font-display text-[var(--color-gold)]"
      >
        Your history with {number}
      </Heading>

      <div className="space-y-3">
        {sightings.map((sighting) => (
          <Link
            key={sighting.id}
            href={`/sightings/${sighting.id}`}
            className="group flex items-start gap-3 rounded-lg bg-background/50 p-3 transition-colors hover:bg-[var(--color-gold)]/5"
          >
            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(sighting.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Moods */}
            {sighting.moodTags && sighting.moodTags.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-3.5 w-3.5" />
                <span>{sighting.moodTags.slice(0, 2).join(", ")}</span>
              </div>
            )}

            {/* Arrow indicator */}
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>

      {/* View all link */}
      <div className="mt-4 text-center">
        <Link
          href={`/sightings?number=${number}`}
          className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
        >
          View all sightings of {number} →
        </Link>
      </div>
    </AnimatedCard>
  );
}
