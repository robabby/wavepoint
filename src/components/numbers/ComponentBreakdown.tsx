import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentBreakdown as ComponentBreakdownType } from "@/lib/numbers";

interface ComponentBreakdownProps {
  breakdown: ComponentBreakdownType;
  className?: string;
}

/**
 * Displays a breakdown of an uncovered number pattern.
 * Shows individual digit meanings and links to known patterns.
 */
export function ComponentBreakdown({
  breakdown,
  className,
}: ComponentBreakdownProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <span className="font-display text-5xl tracking-widest text-[var(--color-gold)]">
          {breakdown.number}
        </span>
        <p className="mt-2 text-sm text-muted-foreground">
          Number breakdown
        </p>
      </div>

      {/* Synthesized meaning */}
      <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card/30 p-4">
        <p className="text-center text-muted-foreground">
          {breakdown.synthesizedMeaning}
        </p>
      </div>

      {/* Component digits */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--color-gold-bright)]">
          Component energies
        </h3>
        <div className="grid gap-2">
          {breakdown.components.map((component, index) => (
            <div
              key={`${component.digit}-${index}`}
              className={cn(
                "flex items-center gap-4 rounded-lg border p-3",
                "border-[var(--border-gold)]/20 bg-card/20",
                component.patternId && "hover:border-[var(--color-gold)]/40 transition-colors"
              )}
            >
              {/* Digit/pattern display */}
              {component.patternId ? (
                <Link
                  href={`/numbers/${component.patternId}`}
                  className="font-display text-2xl text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
                  aria-label={`View ${component.patternId} meaning`}
                >
                  {component.digit}
                </Link>
              ) : (
                <span className="font-display text-2xl text-[var(--color-gold)]/70">
                  {component.digit}
                </span>
              )}

              {/* Meaning */}
              <div className="flex-1">
                <span className="text-sm text-muted-foreground">
                  {component.meaning}
                </span>
                {component.patternId && (
                  <Link
                    href={`/numbers/${component.patternId}`}
                    className="ml-2 text-xs text-[var(--color-gold)]/60 hover:text-[var(--color-gold)] transition-colors"
                    aria-label={`Learn more about ${component.patternId}`}
                  >
                    Learn more →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explore suggestion */}
      <p className="text-center text-xs text-muted-foreground">
        Each digit carries its own energy. Together, they create a unique message for you.
      </p>
    </div>
  );
}
