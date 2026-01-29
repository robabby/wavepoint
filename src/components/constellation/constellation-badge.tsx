"use client";

import { useConstellation, useAddConstellation } from "@/hooks/constellation";
import type { ConstellationSystem } from "@/lib/constellation";

interface ConstellationBadgeProps {
  slug: string;
  type: "archetype" | "tarot";
}

/**
 * Badge for archetype/tarot detail pages.
 * Shows "In Your Constellation" with provenance, or "Add to Constellation" button.
 * Self-fetching client component — renders null if not authenticated.
 */
export function ConstellationBadge({ slug, type }: ConstellationBadgeProps) {
  const system: ConstellationSystem = type === "archetype" ? "jungian" : "tarot";
  const { entries, isLoading, isError } = useConstellation();
  const { addEntry, isAdding } = useAddConstellation();

  if (isLoading || isError) return null;

  const match = entries.find(
    (e) => e.system === system && e.identifier === slug && e.status === "active"
  );

  if (match) {
    const provenance = match.derivedFrom ? formatProvenance(match.derivedFrom) : "";
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 px-3 py-1.5 shadow-[0_0_12px_rgba(212,168,75,0.15)]">
        <span className="text-[var(--color-gold)]">✦</span>
        <span className="text-sm text-muted-foreground">
          In Your Constellation
          {provenance && <> · {provenance}</>}
        </span>
      </span>
    );
  }

  return (
    <button
      onClick={() => void addEntry({ system, identifier: slug })}
      disabled={isAdding}
      className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
    >
      + Add to Your Constellation
    </button>
  );
}

function formatProvenance(derivedFrom: string): string {
  if (derivedFrom.startsWith("birth-date:")) return "via birth date";
  const [position, digit] = derivedFrom.split(":");
  if (!position || !digit) return "";
  const label = position
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `via ${label} ${digit}`;
}
