import { cn } from "@/lib/utils";
import type { PlanetPageData } from "@/lib/astrology/planets";
import { AnimatedCard } from "@/components/animated-card";

interface CoreIdentityCardProps {
  /** Planet data */
  planet: PlanetPageData;
  /** Optional className */
  className?: string;
}

/**
 * Core identity card showing quick facts about a planet.
 * Used on detail pages for at-a-glance reference.
 */
export function CoreIdentityCard({ planet, className }: CoreIdentityCardProps) {
  return (
    <AnimatedCard className={cn("p-6 sm:p-8", className)}>
      <h2 className="mb-4 font-heading text-lg text-[var(--color-gold)]">
        Core Identity
      </h2>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {/* Element */}
        <div>
          <dt className="text-xs text-muted-foreground">Element</dt>
          <dd className="font-medium capitalize text-foreground">
            {planet.element}
          </dd>
        </div>

        {/* Number */}
        {planet.numerology.digit !== null && (
          <div>
            <dt className="text-xs text-muted-foreground">Number</dt>
            <dd className="font-medium text-foreground">
              {planet.numerology.digit}
            </dd>
          </div>
        )}

        {/* Day */}
        {planet.dayOfWeek && (
          <div>
            <dt className="text-xs text-muted-foreground">Day</dt>
            <dd className="font-medium text-foreground">{planet.dayOfWeek}</dd>
          </div>
        )}

        {/* Metal */}
        {planet.metal && (
          <div>
            <dt className="text-xs text-muted-foreground">Metal</dt>
            <dd className="font-medium text-foreground">{planet.metal}</dd>
          </div>
        )}

        {/* Type */}
        <div>
          <dt className="text-xs text-muted-foreground">Type</dt>
          <dd className="font-medium capitalize text-foreground">
            {planet.type}
          </dd>
        </div>

        {/* Geometry (if applicable) */}
        {planet.geometry && (
          <div>
            <dt className="text-xs text-muted-foreground">Geometry</dt>
            <dd className="font-medium capitalize text-foreground">
              {planet.geometry.geometry}
            </dd>
          </div>
        )}
      </dl>

      {/* Rulerships */}
      {planet.rulerships.length > 0 && (
        <div className="mt-6 border-t border-[var(--border-gold)]/20 pt-4">
          <h3 className="mb-2 text-xs text-muted-foreground">Rules</h3>
          <div className="flex flex-wrap gap-2">
            {planet.rulerships.map((rulership) => (
              <span
                key={rulership.sign}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-sm",
                  rulership.modern
                    ? "border-[var(--color-gold)]/30 text-foreground"
                    : "border-[var(--color-copper)]/30 text-muted-foreground"
                )}
              >
                {rulership.sign}
                {!rulership.modern && rulership.traditional && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (trad.)
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </AnimatedCard>
  );
}
