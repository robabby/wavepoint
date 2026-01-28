"use client";

import Link from "next/link";
import { format } from "date-fns";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrentCosmicContext } from "@/hooks/signal/use-cosmic-context";
import {
  getMoonPhaseEmoji,
  getMoonPhaseName,
  getMoonPhaseGlow,
  getSignGlyph,
} from "@/lib/signal/cosmic-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarMoonPhaseProps {
  isCollapsed?: boolean;
  className?: string;
}

/**
 * Compact moon phase display for sidebar.
 * Shows moon emoji with animated glow, phase name, and sign.
 */
export function SidebarMoonPhase({
  isCollapsed = false,
  className,
}: SidebarMoonPhaseProps) {
  const { cosmicContext, isLoading, isError } = useCurrentCosmicContext();

  // Loading state
  if (isLoading) {
    return <MoonPhaseSkeleton isCollapsed={isCollapsed} className={className} />;
  }

  // Error or no data - graceful degradation (hide widget)
  if (isError || !cosmicContext) {
    return null;
  }

  const { moon } = cosmicContext;
  const phaseGlow = getMoonPhaseGlow(moon.phase);
  const phaseName = getMoonPhaseName(moon.phase);
  const signGlyph = getSignGlyph(moon.sign);
  const signName = moon.sign.charAt(0).toUpperCase() + moon.sign.slice(1);
  const degree = Math.floor(moon.degree);

  // Today's date for calendar link
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const calendarHref = `/calendar/day/${todayStr}`;

  // Collapsed: emoji only with tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={calendarHref}
              className={cn(
                "mx-3 flex h-10 w-10 items-center justify-center rounded-lg",
                "transition-colors",
                "hover:bg-[var(--sidebar-accent)]",
                className
              )}
            >
              <div className="relative">
                {/* Animated glow */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-lg"
                  style={{ background: phaseGlow }}
                  animate={{ opacity: [0.3, 0.45, 0.3] }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                {/* Moon emoji */}
                <span
                  className="relative text-2xl"
                  role="img"
                  aria-label={phaseName}
                >
                  {getMoonPhaseEmoji(moon.phase)}
                </span>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-body">
            <p className="font-heading text-sm">{phaseName}</p>
            <p className="text-xs text-muted-foreground">
              in {signGlyph} {signName} {degree}°
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expanded: full display
  return (
    <Link
      href={calendarHref}
      className={cn(
        "mx-4 flex items-center gap-3 rounded-lg px-3 py-2.5",
        "transition-colors",
        "hover:bg-[var(--sidebar-accent)]",
        className
      )}
    >
      {/* Moon emoji with glow */}
      <div className="relative shrink-0">
        {/* Animated glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg"
          style={{ background: phaseGlow }}
          animate={{ opacity: [0.3, 0.45, 0.3] }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        {/* Moon emoji */}
        <span
          className="relative text-2xl"
          role="img"
          aria-label={phaseName}
        >
          {getMoonPhaseEmoji(moon.phase)}
        </span>
      </div>

      {/* Phase info */}
      <div className="min-w-0">
        <p className="font-heading text-base text-foreground">{phaseName}</p>
        <p className="text-xs text-muted-foreground">
          in {signGlyph} {signName} {degree}°
        </p>
      </div>
    </Link>
  );
}

/**
 * Loading skeleton for moon phase
 */
function MoonPhaseSkeleton({
  isCollapsed,
  className,
}: {
  isCollapsed: boolean;
  className?: string;
}) {
  if (isCollapsed) {
    return (
      <div className={cn("flex justify-center py-3", className)}>
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--sidebar-accent)]" />
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-3", className)}>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--sidebar-accent)]" />
        <div className="space-y-1.5">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--sidebar-accent)]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--sidebar-accent)]" />
        </div>
      </div>
    </div>
  );
}
