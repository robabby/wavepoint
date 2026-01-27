"use client";

import { motion } from "motion/react";
import { Clock, Heart, Briefcase, TrendingUp } from "lucide-react";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { usePatterns } from "@/hooks/patterns";
import { EASE_PHI } from "@/lib/animation-constants";
import type {
  PatternInsight,
  TimeDistributionInsight,
  MoodCorrelationInsight,
  ActivityCorrelationInsight,
  FrequencyTrendInsight,
  PeakHourInsight,
  DayOfWeekInsight,
  TopMoodForNumberInsight,
  TopActivityForNumberInsight,
  OverallTrendInsight,
  WeeklyTrendInsight,
  PatternInsightType,
} from "@/lib/patterns";

// Animation variants with phi-based easing
const staggerContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_PHI },
  },
};

/**
 * Convert an insight to human-readable text
 */
function getInsightText(insight: PatternInsight): string {
  // Time distribution insights
  if (insight.type === "time_distribution") {
    const timeInsight = insight as TimeDistributionInsight;
    if (timeInsight.key === "peak_hour") {
      const peakHour = timeInsight as PeakHourInsight;
      return `You often notice numbers around ${peakHour.value.label}`;
    }
    if (timeInsight.key === "day_of_week") {
      const dayInsight = timeInsight as DayOfWeekInsight;
      return `Most sightings happen on ${dayInsight.value.dayName}s`;
    }
  }

  // Mood correlation insights
  if (insight.type === "mood_correlation") {
    const moodInsight = insight as MoodCorrelationInsight;
    if (moodInsight.key.startsWith("top_mood_")) {
      const topMood = moodInsight as TopMoodForNumberInsight;
      return `${topMood.value.number} often appears when you're feeling ${topMood.value.mood}`;
    }
    // For numbers_for_mood, skip (less meaningful standalone)
  }

  // Activity correlation insights
  if (insight.type === "activity_correlation") {
    const activityInsight = insight as ActivityCorrelationInsight;
    if (activityInsight.key.startsWith("top_activity_")) {
      const topActivity = activityInsight as TopActivityForNumberInsight;
      return `${topActivity.value.number} tends to appear during ${formatActivity(topActivity.value.activity)}`;
    }
  }

  // Frequency trend insights
  if (insight.type === "frequency_trend") {
    const trendInsight = insight as FrequencyTrendInsight;
    if (trendInsight.key === "overall_trend") {
      const overall = trendInsight as OverallTrendInsight;
      return getTrendMessage(overall.value.trend, overall.value.averagePerDay);
    }
    if (trendInsight.key.endsWith("_weekly_trend")) {
      const weekly = trendInsight as WeeklyTrendInsight;
      if (weekly.value.number) {
        return `${weekly.value.number} is ${weekly.value.trend === "increasing" ? "appearing more often" : weekly.value.trend === "decreasing" ? "appearing less often" : "holding steady"} this week`;
      }
    }
  }

  return "";
}

function formatActivity(activity: string): string {
  // Convert snake_case or other formats to readable text
  return activity.toLowerCase().replace(/_/g, " ");
}

function getTrendMessage(trend: "increasing" | "decreasing" | "stable", avgPerDay: number): string {
  const avgText = avgPerDay >= 1
    ? `averaging ${avgPerDay.toFixed(1)} per day`
    : "building momentum";

  switch (trend) {
    case "increasing":
      return `Your sighting frequency is rising, ${avgText}`;
    case "decreasing":
      return `Your sighting frequency has slowed, ${avgText}`;
    case "stable":
      return `Your sighting frequency is steady, ${avgText}`;
  }
}

/**
 * Render the appropriate icon for an insight type
 */
function InsightIcon({ type }: { type: PatternInsightType }) {
  const iconClass = "h-5 w-5";
  switch (type) {
    case "time_distribution":
      return <Clock className={iconClass} aria-hidden="true" />;
    case "mood_correlation":
      return <Heart className={iconClass} aria-hidden="true" />;
    case "activity_correlation":
      return <Briefcase className={iconClass} aria-hidden="true" />;
    case "frequency_trend":
      return <TrendingUp className={iconClass} aria-hidden="true" />;
    default:
      return <Clock className={iconClass} aria-hidden="true" />;
  }
}

/**
 * Score insights by significance for ranking
 */
function scoreInsight(insight: PatternInsight): number {
  // Prioritize insights with higher confidence/count
  let score = insight.sightingCountAtComputation;

  // Boost overall trends - most universally useful
  if (insight.type === "frequency_trend" && insight.key === "overall_trend") {
    score += 100;
  }

  // Boost peak hour - very relatable
  if (insight.type === "time_distribution" && insight.key === "peak_hour") {
    score += 80;
  }

  // Boost day of week
  if (insight.type === "time_distribution" && insight.key === "day_of_week") {
    score += 60;
  }

  // Boost mood correlations with specific numbers
  if (insight.type === "mood_correlation" && insight.key.startsWith("top_mood_")) {
    score += 40;
  }

  // Activity correlations
  if (insight.type === "activity_correlation" && insight.key.startsWith("top_activity_")) {
    score += 30;
  }

  return score;
}

/**
 * Select the most meaningful insights (max 5)
 */
function selectTopInsights(allInsights: PatternInsight[]): PatternInsight[] {
  // Filter out insights with empty text
  const validInsights = allInsights.filter((insight) => getInsightText(insight));

  // Sort by score descending
  const scored = validInsights
    .map((insight) => ({ insight, score: scoreInsight(insight) }))
    .sort((a, b) => b.score - a.score);

  // Take top 5, ensuring variety (max 2 per category)
  const selected: PatternInsight[] = [];
  const typeCounts: Record<string, number> = {};

  for (const { insight } of scored) {
    const typeCount = typeCounts[insight.type] ?? 0;
    if (typeCount < 2 && selected.length < 5) {
      selected.push(insight);
      typeCounts[insight.type] = typeCount + 1;
    }
  }

  return selected;
}

interface InsightCardProps {
  insight: PatternInsight;
  sightingCount: number;
}

function InsightCard({ insight, sightingCount }: InsightCardProps) {
  const text = getInsightText(insight);

  return (
    <motion.div
      variants={fadeUpVariants}
      className={cn(
        "flex items-start gap-4 rounded-lg p-4",
        "border-l-2 border-[var(--color-gold)]/40",
        "bg-gradient-to-r from-[var(--color-gold)]/5 to-transparent"
      )}
    >
      <div className="mt-0.5 text-[var(--color-gold)]">
        <InsightIcon type={insight.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground">{text}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Based on {sightingCount} sighting{sightingCount !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
}

function InsightSkeleton() {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-lg p-4",
        "border-l-2 border-[var(--color-gold)]/20",
        "bg-gradient-to-r from-[var(--color-gold)]/5 to-transparent",
        "animate-pulse"
      )}
    >
      <div className="mt-0.5 h-5 w-5 rounded bg-muted/30" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted/30" />
        <div className="h-3 w-1/3 rounded bg-muted/30" />
      </div>
    </div>
  );
}

/**
 * PatternsSection displays computed pattern insights from user sighting data.
 * Part of the Spiritual Fingerprint feature.
 */
export function PatternsSection() {
  const { patterns, isLoading } = usePatterns();

  // Loading state
  if (isLoading) {
    return (
      <section aria-label="Pattern Insights">
        <Heading
          size="4"
          className="mb-4 font-display text-[var(--color-gold)]"
        >
          Pattern Insights
        </Heading>
        <div className="space-y-3">
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
        </div>
      </section>
    );
  }

  // Empty state - no patterns yet
  if (!patterns || patterns.sightingCount === 0) {
    return (
      <section aria-label="Pattern Insights">
        <Heading
          size="4"
          className="mb-4 font-display text-[var(--color-gold)]"
        >
          Pattern Insights
        </Heading>
        <div className="rounded-lg border border-[var(--border-gold)]/20 bg-card/30 p-6 text-center">
          <Text className="text-muted-foreground italic">
            Patterns emerge with time. Continue noticing — your data tells a story.
          </Text>
        </div>
      </section>
    );
  }

  // Collect all insights from patterns
  const allInsights: PatternInsight[] = [
    ...patterns.timeDistribution,
    ...patterns.moodCorrelation,
    ...patterns.activityCorrelation,
    ...patterns.frequencyTrend,
  ];

  // Select top insights
  const topInsights = selectTopInsights(allInsights);

  // If no meaningful insights could be extracted
  if (topInsights.length === 0) {
    return (
      <section aria-label="Pattern Insights">
        <Heading
          size="4"
          className="mb-4 font-display text-[var(--color-gold)]"
        >
          Pattern Insights
        </Heading>
        <div className="rounded-lg border border-[var(--border-gold)]/20 bg-card/30 p-6 text-center">
          <Text className="text-muted-foreground italic">
            Patterns emerge with time. Continue noticing — your data tells a story.
          </Text>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Pattern Insights">
      <Heading
        size="4"
        className="mb-4 font-display text-[var(--color-gold)]"
      >
        Pattern Insights
      </Heading>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {topInsights.map((insight) => (
          <InsightCard
            key={insight.key}
            insight={insight}
            sightingCount={insight.sightingCountAtComputation}
          />
        ))}
      </motion.div>
      {patterns.isStale && (
        <Text size="1" className="mt-3 text-muted-foreground/60">
          Patterns may be updating in the background
        </Text>
      )}
    </section>
  );
}
