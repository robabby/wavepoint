"use client";

import { motion } from "motion/react";
import { Heading, Text } from "@radix-ui/themes";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCard } from "@/components/animated-card";
import { useResonanceSummary } from "@/hooks/resonance";
import { cn } from "@/lib/utils";
import { fadeUpVariants } from "@/components/signal/animation-config";
import type { ResonanceTrend } from "@/lib/resonance";

/**
 * Get label and styling based on resonance rate threshold
 */
function getResonanceThreshold(rate: number) {
  if (rate >= 80) {
    return {
      label: "Strong resonance",
      colorClass: "text-[var(--color-gold)]",
    };
  }
  if (rate >= 60) {
    return {
      label: "Growing alignment",
      colorClass: "text-foreground",
    };
  }
  return {
    label: "Still discovering",
    colorClass: "text-muted-foreground",
  };
}

/**
 * Get trend icon and label
 */
function getTrendConfig(trend: ResonanceTrend) {
  switch (trend) {
    case "improving":
      return {
        Icon: TrendingUp,
        label: "improving",
        colorClass: "text-emerald-500",
        ariaLabel: "Trend is improving",
      };
    case "declining":
      return {
        Icon: TrendingDown,
        label: "declining",
        colorClass: "text-amber-500",
        ariaLabel: "Trend is declining",
      };
    case "stable":
      return {
        Icon: Minus,
        label: "stable",
        colorClass: "text-muted-foreground",
        ariaLabel: "Trend is stable",
      };
  }
}

/**
 * Loading skeleton for resonance summary
 */
function ResonanceSummarySkeleton() {
  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center justify-between gap-6">
        {/* Rate skeleton */}
        <div className="space-y-1">
          <div className="h-10 w-20 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted/30" />
        </div>

        {/* Responses skeleton */}
        <div className="space-y-1 text-center">
          <div className="mx-auto h-6 w-12 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted/30" />
        </div>

        {/* Trend skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted/30" />
        </div>
      </div>
    </AnimatedCard>
  );
}

/**
 * Empty state when no resonance data exists
 */
function ResonanceEmptyState() {
  return (
    <AnimatedCard className="p-6">
      <div className="text-center">
        <Text size="2" className="text-muted-foreground">
          No resonance data yet. Mark interpretations to build your profile.
        </Text>
      </div>
    </AnimatedCard>
  );
}

/**
 * Displays aggregate resonance statistics for the user:
 * - Resonance rate (percentage of "Yes" responses)
 * - Total responses count
 * - Trend direction (improving/declining/stable)
 */
export function ResonanceSummary() {
  const { summary, isLoading, isError } = useResonanceSummary();

  // Loading state
  if (isLoading) {
    return <ResonanceSummarySkeleton />;
  }

  // Error state - hide gracefully
  if (isError) {
    return null;
  }

  // Empty state - no responses yet
  if (!summary || summary.totalResponses === 0) {
    return <ResonanceEmptyState />;
  }

  const { resonanceRate, totalResponses, trend } = summary;
  const threshold = getResonanceThreshold(resonanceRate);
  const trendConfig = getTrendConfig(trend);
  const TrendIcon = trendConfig.Icon;

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedCard className="p-6">
        <Heading size="4" className="mb-4 font-display text-[var(--color-gold)]">
          Resonance
        </Heading>

        <div className="flex flex-wrap items-end justify-between gap-6">
          {/* Resonance rate - hero treatment */}
          <div className="min-w-0">
            <span
              className={cn(
                "font-display text-4xl font-medium",
                threshold.colorClass
              )}
              aria-label={`${resonanceRate}% resonance rate`}
            >
              {resonanceRate}%
            </span>
            <Text
              size="2"
              className="mt-1 block text-muted-foreground"
            >
              {threshold.label}
            </Text>
          </div>

          {/* Total responses */}
          <div className="text-center">
            <Text
              size="5"
              weight="medium"
              className="block text-foreground"
            >
              {totalResponses}
            </Text>
            <Text size="2" className="text-muted-foreground">
              {totalResponses === 1 ? "response" : "responses"}
            </Text>
          </div>

          {/* Trend indicator with ARIA live region */}
          <div
            className="flex items-center gap-2"
            role="status"
            aria-live="polite"
            aria-label={trendConfig.ariaLabel}
          >
            <TrendIcon
              className={cn("h-5 w-5", trendConfig.colorClass)}
              aria-hidden="true"
            />
            <Text size="2" className={trendConfig.colorClass}>
              {trendConfig.label}
            </Text>
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
