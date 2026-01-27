"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Section 3: Quick Actions
 *
 * - Capture sighting (primary)
 * - Add journal entry (link to calendar day)
 * - Set intention (placeholder, deferred to Layer 1.5)
 */
export function QuickActionsSection() {
  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  return (
    <section>
      <h2 className="mb-4 font-heading text-lg text-foreground">Quick Actions</h2>

      <div className="grid grid-cols-3 gap-3">
        {/* Capture Sighting */}
        <Link
          href="/signal/capture"
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl p-4",
            "border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10",
            "transition-all hover:border-[var(--color-gold)]/50 hover:bg-[var(--color-gold)]/20"
          )}
        >
          <Plus className="h-6 w-6 text-[var(--color-gold)]" />
          <span className="text-center text-xs font-medium text-foreground">
            Capture
          </span>
        </Link>

        {/* Add Journal Entry */}
        <Link
          href={`/calendar/day/${today}`}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl p-4",
            "border border-[var(--border-gold)]/20 bg-card/30",
            "transition-all hover:border-[var(--border-gold)]/40 hover:bg-card/50"
          )}
        >
          <BookOpen className="h-6 w-6 text-muted-foreground" />
          <span className="text-center text-xs font-medium text-muted-foreground">
            Journal
          </span>
        </Link>

        {/* Set Intention (placeholder) */}
        <button
          disabled
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl p-4",
            "border border-[var(--border-gold)]/10 bg-card/20",
            "cursor-not-allowed opacity-50"
          )}
          title="Coming soon"
        >
          <Target className="h-6 w-6 text-muted-foreground/50" />
          <span className="text-center text-xs font-medium text-muted-foreground/50">
            Intention
          </span>
        </button>
      </div>
    </section>
  );
}
