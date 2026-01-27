/**
 * Pattern insight types for the Spiritual Fingerprint feature.
 * These represent computed insights from user sighting data.
 */

/**
 * Pattern insight types that can be computed
 */
export type PatternInsightType =
  | "time_distribution"
  | "mood_correlation"
  | "activity_correlation"
  | "frequency_trend";

/**
 * Base interface for all pattern insights
 */
export interface BasePatternInsight {
  type: PatternInsightType;
  key: string;
  computedAt: Date;
  sightingCountAtComputation: number;
}

// =============================================================================
// Time Distribution Patterns
// =============================================================================

/**
 * Peak hour insight - when user most often sees numbers
 */
export interface PeakHourInsight extends BasePatternInsight {
  type: "time_distribution";
  key: "peak_hour";
  value: {
    hour: number; // 0-23
    count: number;
    percentage: number; // of total sightings
    label: string; // "11am", "3pm", etc.
  };
}

/**
 * Day of week insight - which days have most sightings
 */
export interface DayOfWeekInsight extends BasePatternInsight {
  type: "time_distribution";
  key: "day_of_week";
  value: {
    day: number; // 0-6 (Sunday = 0)
    dayName: string; // "Monday", "Tuesday", etc.
    count: number;
    percentage: number;
  };
}

export type TimeDistributionInsight = PeakHourInsight | DayOfWeekInsight;

// =============================================================================
// Mood Correlation Patterns
// =============================================================================

/**
 * Top mood for a specific number
 */
export interface TopMoodForNumberInsight extends BasePatternInsight {
  type: "mood_correlation";
  key: `top_mood_${string}`; // e.g., "top_mood_444"
  value: {
    number: string;
    mood: string;
    count: number;
    percentage: number; // of sightings with this number that have this mood
  };
}

/**
 * Numbers most associated with a specific mood
 */
export interface NumbersForMoodInsight extends BasePatternInsight {
  type: "mood_correlation";
  key: `${string}_numbers`; // e.g., "anxious_numbers"
  value: {
    mood: string;
    numbers: Array<{
      number: string;
      count: number;
      percentage: number;
    }>;
  };
}

export type MoodCorrelationInsight = TopMoodForNumberInsight | NumbersForMoodInsight;

// =============================================================================
// Activity Correlation Patterns
// =============================================================================

/**
 * Numbers most seen during a specific activity
 */
export interface NumbersForActivityInsight extends BasePatternInsight {
  type: "activity_correlation";
  key: `${string}_numbers`; // e.g., "work_numbers", "rest_numbers"
  value: {
    activity: string;
    numbers: Array<{
      number: string;
      count: number;
      percentage: number;
    }>;
  };
}

/**
 * Top activity for a specific number
 */
export interface TopActivityForNumberInsight extends BasePatternInsight {
  type: "activity_correlation";
  key: `top_activity_${string}`; // e.g., "top_activity_444"
  value: {
    number: string;
    activity: string;
    count: number;
    percentage: number;
  };
}

export type ActivityCorrelationInsight = NumbersForActivityInsight | TopActivityForNumberInsight;

// =============================================================================
// Frequency Trend Patterns
// =============================================================================

/**
 * Weekly trend for a specific number or overall
 */
export interface WeeklyTrendInsight extends BasePatternInsight {
  type: "frequency_trend";
  key: `${string}_weekly_trend` | "overall_weekly_trend"; // e.g., "444_weekly_trend"
  value: {
    number?: string; // undefined for overall trend
    currentWeekCount: number;
    previousWeekCount: number;
    trend: "increasing" | "decreasing" | "stable";
    percentageChange: number; // positive = increasing, negative = decreasing
  };
}

/**
 * Overall sighting frequency trend
 */
export interface OverallTrendInsight extends BasePatternInsight {
  type: "frequency_trend";
  key: "overall_trend";
  value: {
    last7Days: number;
    previous7Days: number;
    trend: "increasing" | "decreasing" | "stable";
    percentageChange: number;
    averagePerDay: number;
  };
}

export type FrequencyTrendInsight = WeeklyTrendInsight | OverallTrendInsight;

// =============================================================================
// Union Types
// =============================================================================

/**
 * All possible pattern insight types
 */
export type PatternInsight =
  | TimeDistributionInsight
  | MoodCorrelationInsight
  | ActivityCorrelationInsight
  | FrequencyTrendInsight;

/**
 * Computed patterns response from API
 */
export interface ComputedPatterns {
  timeDistribution: TimeDistributionInsight[];
  moodCorrelation: MoodCorrelationInsight[];
  activityCorrelation: ActivityCorrelationInsight[];
  frequencyTrend: FrequencyTrendInsight[];
  isStale: boolean;
  lastComputedAt: Date | null;
  sightingCount: number;
}

/**
 * Raw sighting data used for pattern computation
 */
export interface SightingForPattern {
  id: string;
  number: string;
  moodTags: string[] | null;
  activity: string | null;
  timestamp: Date;
  tz: string | null;
}
