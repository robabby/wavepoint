"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { SightingCard } from "./sighting-card";
import { staggerContainerVariants, fadeUpVariants } from "./animation-config";

export interface CollectionGridProps {
  stats: Array<{
    number: string;
    count: number;
    lastSeen: Date;
  }>;
  onSelectNumber: (number: string) => void;
}

/**
 * Responsive grid of SightingCards with empty state.
 * Displays user's captured numbers with staggered entrance animation.
 */
export function CollectionGrid({ stats, onSelectNumber }: CollectionGridProps) {
  if (stats.length === 0) {
    return <EmptyCollection />;
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {stats.map((stat) => (
        <motion.div key={stat.number} variants={fadeUpVariants}>
          <SightingCard
            number={stat.number}
            count={stat.count}
            lastSeenAt={stat.lastSeen}
            onClick={() => onSelectNumber(stat.number)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Faint sacred geometry icon */}
      <div className="mb-6 opacity-20">
        <Image
          src="/images/geometries/patterns/seed-of-life/seed-of-life-primary.svg"
          alt=""
          width={80}
          height={80}
          className="text-[var(--color-gold)]"
        />
      </div>
      <h3 className="font-heading text-xl text-foreground">
        No signals captured yet
      </h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The universe is patient.
      </p>
    </div>
  );
}
