/**
 * Resonance value types
 * - true: "Yes, this resonated"
 * - false: "No, this didn't resonate"
 * - null: "Not sure yet" (respects that meaning takes time)
 */
export type ResonanceValue = boolean | null;

/**
 * Resonance record from database
 */
export interface Resonance {
  id: string;
  userId: string;
  sightingId: string;
  resonated: ResonanceValue;
  createdAt: Date;
}

/**
 * Input for recording resonance
 */
export interface RecordResonanceInput {
  sightingId: string;
  resonated: ResonanceValue;
}

/**
 * Trend direction for resonance over time
 */
export type ResonanceTrend = "improving" | "declining" | "stable";

/**
 * Aggregate resonance summary for a user
 */
export interface ResonanceSummary {
  /** Total number of responses (excluding "not sure" = null) */
  totalResponses: number;
  /** Percentage of responses where resonated = true (0-100) */
  resonanceRate: number;
  /** Trend direction based on recent vs older responses */
  trend: ResonanceTrend;
}
