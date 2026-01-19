"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface SignalBackgroundProps {
  /** Enable subtle pulse animation for "receiving" state */
  pulse?: boolean;
  className?: string;
}

/**
 * Subtle sacred geometry background pattern.
 * Faint Seed of Life centered, with optional pulse animation.
 */
export function SignalBackground({ pulse, className }: SignalBackgroundProps) {
  return (
    <motion.div
      animate={
        pulse ? { opacity: [0.02, 0.04, 0.02], scale: [1, 1.02, 1] } : undefined
      }
      transition={
        pulse
          ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
      className={cn(
        "fixed inset-0 -z-10 flex items-center justify-center pointer-events-none",
        className
      )}
    >
      <Image
        src="/images/geometries/sacred-patterns/seed-of-life/seed-of-life-primary.svg"
        alt=""
        width={500}
        height={500}
        className="opacity-[0.02]"
        priority
      />
    </motion.div>
  );
}
