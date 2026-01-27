"use client";

import { cn } from "@/lib/utils";
import { getEclipseContext } from "@/lib/eclipses";
import { EclipseCard } from "./eclipse-card";
import { PortalBanner } from "./portal-banner";

interface EclipseSectionProps {
  /** Date in YYYY-MM-DD format */
  date: string;
  /** Optional className */
  className?: string;
}

/**
 * Eclipse section for day view.
 *
 * Composite component that renders:
 * - EclipseCard when viewing an eclipse day
 * - PortalBanner when viewing a day within an active portal (but not an eclipse day)
 * - Nothing when the date is outside any eclipse portal
 *
 * This component handles the decision logic for which eclipse-related
 * content to display based on the date's context.
 */
export function EclipseSection({ date, className }: EclipseSectionProps) {
  const context = getEclipseContext(date);

  // Eclipse day - show the full eclipse card
  if (context.eclipse) {
    return (
      <section className={cn("space-y-3", className)}>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Eclipse
        </h2>
        <EclipseCard eclipse={context.eclipse} />
      </section>
    );
  }

  // Portal day (non-eclipse) - show the portal banner
  if (context.activePortal) {
    return (
      <section className={cn("space-y-3", className)}>
        <h2 className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
          Eclipse Portal
        </h2>
        <PortalBanner portal={context.activePortal} currentDate={date} />
      </section>
    );
  }

  // Not in a portal - render nothing
  return null;
}
