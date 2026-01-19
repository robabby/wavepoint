"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SIGNAL_TIMING } from "./animation-config";

const SIZES = {
  sm: 16,
  md: 24,
  lg: 40,
} as const;

export interface SacredSpinnerProps {
  size?: keyof typeof SIZES;
  label?: string;
  className?: string;
}

/**
 * Sacred geometry loading indicator.
 * Simple ring with orbiting dot, 3-second meditative rotation.
 */
export function SacredSpinner({
  size = "md",
  label,
  className,
}: SacredSpinnerProps) {
  const dim = SIZES[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <motion.svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{
          duration: SIGNAL_TIMING.spinner,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Outer ring */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-gold)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        {/* Orbiting dot */}
        <circle cx="12" cy="2" r="2" fill="var(--color-gold)" />
      </motion.svg>
      {label && (
        <span className="text-sm text-[var(--color-dim)]">{label}</span>
      )}
    </span>
  );
}
