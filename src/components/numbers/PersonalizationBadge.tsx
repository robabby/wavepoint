"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

interface UserNumberStat {
  number: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
}

interface PersonalizationBadgeProps {
  pattern: string;
  className?: string;
}

/**
 * Client-side personalization badge for number pattern pages.
 * Shows user's sighting count for this pattern when authenticated.
 * Only renders when Signal is enabled.
 */
export function PersonalizationBadge({
  pattern,
  className,
}: PersonalizationBadgeProps) {
  const [stats, setStats] = useState<UserNumberStat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch if Signal is not enabled
    if (!isSignalEnabled()) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const response = await fetch(`/api/numbers/stats?pattern=${pattern}`);
        if (!response.ok) {
          // User not authenticated or other error - fail silently
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch {
        // Network error - fail silently
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [pattern]);

  // Don't render anything if Signal not enabled, loading, or no stats
  if (!isSignalEnabled() || loading || !stats) {
    return null;
  }

  const lastSeenDate = new Date(stats.lastSeen);
  const relativeTime = formatDistanceToNow(lastSeenDate, { addSuffix: true });

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full",
        "border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5",
        "px-3 py-1.5",
        className
      )}
    >
      <span className="text-xs text-[var(--color-gold)]">
        You&apos;ve seen this {stats.count} {stats.count === 1 ? "time" : "times"}
      </span>
      <span className="text-xs text-[var(--color-dim)]">
        · Last {relativeTime}
      </span>
    </div>
  );
}
