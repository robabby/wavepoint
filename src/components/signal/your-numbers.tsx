"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  fadeUpVariants,
  staggerContainerVariants,
} from "./animation-config";
import {
  getAllCategoryCoverage,
  getCollectionStats,
  getUncaughtCategories,
  getDiscoveryPrompt,
} from "@/lib/signal/collection";
import { getPatternByNumber } from "@/lib/numbers/helpers";

interface NumberStat {
  number: string;
  count: number;
  lastSeen: Date;
}

export interface YourNumbersProps {
  stats: NumberStat[];
  onSelectNumber?: (number: string) => void;
  isLoading?: boolean;
}

/**
 * Enhanced collection display showing:
 * - Top patterns with bar visualization
 * - Collection stats and category coverage
 * - Discovery prompts for uncaught categories
 */
export function YourNumbers({
  stats,
  onSelectNumber,
  isLoading,
}: YourNumbersProps) {
  // Get top 5 patterns by count
  const topPatterns = useMemo(
    () => [...stats].sort((a, b) => b.count - a.count).slice(0, 5),
    [stats]
  );

  // Calculate max count for bar visualization
  const maxCount = topPatterns[0]?.count ?? 1;

  // Get list of all logged numbers for coverage calculation
  const loggedNumbers = useMemo(
    () => stats.map((s) => s.number),
    [stats]
  );

  // Calculate collection stats
  const collectionStats = useMemo(
    () => getCollectionStats(loggedNumbers),
    [loggedNumbers]
  );

  // Get category coverage
  const categoryCoverage = useMemo(
    () => getAllCategoryCoverage(loggedNumbers),
    [loggedNumbers]
  );

  // Get uncaught categories for discovery prompts
  const uncaughtCategories = useMemo(
    () => getUncaughtCategories(loggedNumbers).slice(0, 2),
    [loggedNumbers]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-card" />
          ))}
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Patterns */}
      <motion.div variants={fadeUpVariants}>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Top Patterns
        </h3>
        <div className="space-y-2">
          {topPatterns.map((stat, index) => {
            const pattern = getPatternByNumber(stat.number);
            const barWidth = (stat.count / maxCount) * 100;

            return (
              <div key={stat.number} className="group relative">
                {/* Background bar */}
                <div
                  className="absolute inset-y-0 left-0 rounded-lg bg-[var(--color-gold)]/10 transition-all group-hover:bg-[var(--color-gold)]/15"
                  style={{ width: `${barWidth}%` }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-display text-sm text-muted-foreground">
                      {index + 1}
                    </span>
                    <button
                      onClick={() => onSelectNumber?.(stat.number)}
                      className="font-display text-lg text-[var(--color-gold)] hover:text-[var(--color-gold-bright)] transition-colors"
                    >
                      {stat.number}
                    </button>
                    {pattern && (
                      <Link
                        href={`/numbers/${pattern.slug}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {pattern.essence}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stat.count}×
                    </span>
                    {pattern && (
                      <Link
                        href={`/numbers/${pattern.slug}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Collection Stats */}
      <motion.div variants={fadeUpVariants}>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Collection
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            value={collectionStats.totalCaught}
            label="Known patterns"
            subtext={`of ${collectionStats.totalPatterns}`}
          />
          <StatCard
            value={`${collectionStats.percentage}%`}
            label="Coverage"
          />
          <StatCard
            value={collectionStats.categoriesCovered}
            label="Categories"
            subtext={`of ${collectionStats.totalCategories}`}
          />
          <StatCard
            value={stats.length}
            label="Unique numbers"
          />
        </div>
      </motion.div>

      {/* Category Coverage */}
      <motion.div variants={fadeUpVariants}>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          By Category
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categoryCoverage.map((cat) => (
            <div
              key={cat.category}
              className={`rounded-lg border p-2 text-center transition-colors ${
                cat.caught > 0
                  ? "border-[var(--border-gold)]/30 bg-card/50"
                  : "border-border/30 bg-transparent opacity-50"
              }`}
            >
              <div className="font-display text-lg text-[var(--color-gold)]">
                {cat.caught}/{cat.total}
              </div>
              <div className="text-xs text-muted-foreground">
                {cat.pluralLabel}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Discovery Prompts */}
      {uncaughtCategories.length > 0 && (
        <motion.div variants={fadeUpVariants}>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Discover
          </h3>
          <div className="space-y-2">
            {uncaughtCategories.map((cat) => (
              <div
                key={cat.category}
                className="flex items-start gap-3 rounded-lg border border-dashed border-[var(--border-gold)]/20 p-3"
              >
                <Sparkles className="mt-0.5 h-4 w-4 text-[var(--color-gold)]/50" />
                <div>
                  <div className="text-sm text-foreground">
                    No {cat.pluralLabel.toLowerCase()} yet
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getDiscoveryPrompt(cat)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

interface StatCardProps {
  value: number | string;
  label: string;
  subtext?: string;
}

function StatCard({ value, label, subtext }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border-gold)]/20 bg-card/50 p-3 text-center">
      <div className="font-display text-xl text-[var(--color-gold)]">
        {value}
        {subtext && (
          <span className="text-sm text-muted-foreground"> {subtext}</span>
        )}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
