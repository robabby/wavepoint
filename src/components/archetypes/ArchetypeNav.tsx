"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ArchetypeSlug } from "@/lib/archetypes";
import { getArchetypeBySlug } from "@/lib/archetypes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

interface ArchetypeNavProps {
  previous: ArchetypeSlug | null;
  next: ArchetypeSlug | null;
}

/**
 * Previous/next navigation for archetype detail pages.
 */
export function ArchetypeNav({ previous, next }: ArchetypeNavProps) {
  const prevArchetype = previous ? getArchetypeBySlug(previous) : null;
  const nextArchetype = next ? getArchetypeBySlug(next) : null;

  return (
    <AnimateOnScroll delay={0.4} className="mt-12">
      <div className="flex items-center justify-between border-t border-[var(--color-gold)]/10 pt-8">
        {/* Previous */}
        {prevArchetype ? (
          <Link
            href={`/archetypes/${prevArchetype.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="text-[var(--color-gold)]/60">{prevArchetype.romanNumeral}</span>
              {" "}
              {prevArchetype.name}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {nextArchetype ? (
          <Link
            href={`/archetypes/${nextArchetype.slug}`}
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
          >
            <span>
              <span className="text-[var(--color-gold)]/60">{nextArchetype.romanNumeral}</span>
              {" "}
              {nextArchetype.name}
            </span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </AnimateOnScroll>
  );
}
