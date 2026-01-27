// Types
export type {
  PatternInsightType,
  BasePatternInsight,
  PeakHourInsight,
  DayOfWeekInsight,
  TimeDistributionInsight,
  TopMoodForNumberInsight,
  NumbersForMoodInsight,
  MoodCorrelationInsight,
  NumbersForActivityInsight,
  TopActivityForNumberInsight,
  ActivityCorrelationInsight,
  WeeklyTrendInsight,
  OverallTrendInsight,
  FrequencyTrendInsight,
  PatternInsight,
  ComputedPatterns,
  SightingForPattern,
} from "./types";

// Analysis functions
export { computeTimeDistribution } from "./time";
export { computeMoodCorrelation } from "./mood";
export { computeActivityCorrelation } from "./activity";
export { computeFrequencyTrends } from "./trends";

// Orchestration
export { computeAllPatterns } from "./compute";

// Cache
export {
  getCachedPatterns,
  cachePatterns,
  isPatternsStale,
  STALENESS_THRESHOLD,
} from "./cache";
