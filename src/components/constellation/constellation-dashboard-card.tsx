"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import { useConstellation } from "@/hooks/constellation";
import { getArchetypeBySlug } from "@/lib/archetypes";
import { getMajorArcanaBySlug } from "@/lib/tarot";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
      <div className="mb-3 flex items-center gap-1.5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Your Archetypes
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-72 space-y-1.5 py-2">
            <p className="font-medium">Archetypes</p>
            <p>Each numerology position (life path, expression, etc.) maps its digit to a Jungian archetype. Master numbers (11, 22, 33) reduce to their base digit.</p>
            <p className="font-medium">Birth Cards</p>
            <p>Sum all digits of your birth date (MMDDYYYY), then reduce until ≤ 21. The result is your primary Major Arcana card; further digit sums yield companion cards.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        {/* Primary archetype */}
        {primaryArchetype && (
          <Link href={`/archetypes/${primaryArchetype.slug}`} className="group/arch block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
              <span className="text-sm text-muted-foreground">
                {PLANET_SYMBOLS[primaryArchetype.planet] ?? ""}
              </span>
              <span className="font-display text-lg text-foreground group-hover/arch:text-[var(--color-gold)] transition-colors">
                {primaryArchetype.name.toUpperCase()}
              </span>
            </div>
            <p className="ml-4 text-xs text-muted-foreground">
              {primaryArchetype.keywords.slice(0, 3).join(" · ")}
            </p>
          </Link>
        )}

        {/* Primary tarot card */}
        {primaryTarot && (
          <Link href={`/archetypes/tarot/${primaryTarot.slug}`} className="group/tarot flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            <span
              className="font-display text-sm"
              style={{ color: TAROT_STYLES.colors.gold }}
            >
              {primaryTarot.romanNumeral}
            </span>
            <span className="text-sm text-foreground group-hover/tarot:text-[var(--color-gold)] transition-colors">
              {primaryTarot.name.toUpperCase()}
            </span>
          </Link>
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
