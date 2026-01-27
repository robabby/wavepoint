"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SensitivePointPageData } from "@/lib/astrology/nodes";

interface NodeTableProps {
  /** Sensitive points to display */
  nodes: SensitivePointPageData[];
  /** Optional className */
  className?: string;
}

/**
 * Category labels for display
 */
const CATEGORY_LABELS: Record<string, string> = {
  lunar: "Lunar",
  asteroid: "Asteroid",
  "arabic-part": "Arabic Part",
  angle: "Angle",
};

/**
 * Quick reference table for sensitive points.
 * Shows glyph, name, archetype, category, and keywords.
 */
export function NodeTable({ nodes, className }: NodeTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-gold)]/20">
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Glyph
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Archetype
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Category
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Keywords
            </th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => (
            <tr
              key={node.id}
              className="border-b border-[var(--color-gold)]/10 transition-colors hover:bg-card/30"
            >
              {/* Glyph */}
              <td className="px-3 py-4">
                <Link
                  href={`/astrology/nodes/${node.id}`}
                  className="font-display text-2xl text-[var(--color-gold)] transition-colors hover:text-[var(--color-gold-bright)]"
                >
                  {node.glyph}
                </Link>
              </td>

              {/* Name */}
              <td className="px-3 py-4">
                <Link
                  href={`/astrology/nodes/${node.id}`}
                  className="font-display text-foreground transition-colors hover:text-[var(--color-gold)]"
                >
                  {node.name}
                </Link>
              </td>

              {/* Archetype */}
              <td className="px-3 py-4 text-sm text-muted-foreground">
                {node.archetype}
              </td>

              {/* Category */}
              <td className="px-3 py-4">
                <span className="rounded-full border border-[var(--color-gold)]/20 bg-card/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {CATEGORY_LABELS[node.category] ?? node.category}
                </span>
              </td>

              {/* Keywords */}
              <td className="px-3 py-4 text-sm text-muted-foreground">
                {node.keywords.slice(0, 3).join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
