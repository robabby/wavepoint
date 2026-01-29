"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useConstellation } from "@/hooks/constellation";
import { getArchetypeBySlug } from "@/lib/archetypes";
import { getMajorArcanaBySlug } from "@/lib/tarot";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";

const PLANET_SYMBOLS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
};

/**
 * Compact constellation card for the dashboard Personal Focus section.
 */
export function ConstellationDashboardCard() {
  const { entries, isLoading } = useConstellation();

  const activeEntries = useMemo(
    () => entries.filter((e) => e.status === "active"),
    [entries]
  );

  const primaryArchetype = useMemo(() => {
    const first = activeEntries.find((e) => e.system === "jungian");
    if (!first) return null;
    return getArchetypeBySlug(first.identifier) ?? null;
  }, [activeEntries]);

  const primaryTarot = useMemo(() => {
    const first = activeEntries.find((e) => e.system === "tarot");
    if (!first) return null;
    return getMajorArcanaBySlug(first.identifier) ?? null;
  }, [activeEntries]);

  if (isLoading || (!primaryArchetype && !primaryTarot)) return null;

  return (
    <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-4">
      <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        Your Archetypes
      </p>

      <div className="space-y-2">
        {/* Primary archetype */}
        {primaryArchetype && (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
              <span className="text-sm text-muted-foreground">
                {PLANET_SYMBOLS[primaryArchetype.planet] ?? ""}
              </span>
              <span className="font-display text-lg text-foreground">
                {primaryArchetype.name.toUpperCase()}
              </span>
            </div>
            <p className="ml-4 text-xs text-muted-foreground">
              {primaryArchetype.keywords.slice(0, 3).join(" · ")}
            </p>
          </div>
        )}

        {/* Primary tarot card */}
        {primaryTarot && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span
              className="font-display text-sm"
              style={{ color: TAROT_STYLES.colors.gold }}
            >
              {primaryTarot.romanNumeral}
            </span>
            <span className="text-sm text-foreground">
              {primaryTarot.name.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <Link
        href="/profile"
        className="mt-3 inline-block text-xs text-muted-foreground hover:text-[var(--color-gold)]"
      >
        View constellation →
      </Link>
    </div>
  );
}
