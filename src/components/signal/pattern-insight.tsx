"use client";

import { motion } from "motion/react";
import { Sparkles, TrendingUp, RotateCcw } from "lucide-react";
import { fadeUpVariants } from "./animation-config";
import type { PatternInsight, InsightType } from "@/lib/signal/insights";

export interface PatternInsightProps {
  insight: PatternInsight;
}

const INSIGHT_ICONS: Record<InsightType, typeof Sparkles> = {
  first_catch: Sparkles,
  frequent: TrendingUp,
  returning: RotateCcw,
};

const INSIGHT_COLORS: Record<InsightType, string> = {
  first_catch: "text-[var(--color-gold)]",
  frequent: "text-[var(--color-copper)]",
  returning: "text-[var(--color-bronze)]",
};

/**
 * Display component for pattern insights.
 * Shown on the capture result screen.
 */
export function PatternInsightCard({ insight }: PatternInsightProps) {
  const Icon = INSIGHT_ICONS[insight.type];
  const iconColor = INSIGHT_COLORS[insight.type];

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg border border-[var(--border-gold)]/30 bg-card/80 p-4"
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-foreground">{insight.message}</p>
          {insight.subtext && (
            <p className="mt-1 text-sm text-muted-foreground">
              {insight.subtext}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
