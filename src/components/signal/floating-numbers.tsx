"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface FloatingNumbersProps {
  className?: string;
}

// Common angel number sequences
const ANGEL_NUMBERS = [
  "111",
  "222",
  "333",
  "444",
  "555",
  "777",
  "888",
  "999",
  "1111",
  "1234",
  "1212",
  "11:11",
  "12:34",
  "1010",
  "2222",
  "3333",
];

interface FloatingNumber {
  id: number;
  number: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  xDirection: number;
}

// Generate floating numbers (pure function)
function generateFloatingNumbers(count: number): FloatingNumber[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    number: ANGEL_NUMBERS[Math.floor(Math.random() * ANGEL_NUMBERS.length)]!,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.75 + Math.random() * 1.25, // 0.75rem to 2rem
    opacity: 0.08 + Math.random() * 0.12, // 0.08 to 0.20
    duration: 20 + Math.random() * 30, // 20s to 50s
    delay: Math.random() * -20, // Stagger start times
    xDirection: Math.random() > 0.5 ? 10 : -10,
  }));
}

// Pre-generate on module load (this file is dynamically imported with ssr: false)
const FLOATING_NUMBERS = generateFloatingNumbers(24);

/**
 * Animated background with drifting angel numbers.
 * Creates an ethereal "numbers everywhere" atmosphere.
 *
 * IMPORTANT: This component must be imported with next/dynamic and ssr: false
 * to avoid hydration mismatches from Math.random().
 */
export function FloatingNumbers({ className }: FloatingNumbersProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {FLOATING_NUMBERS.map((item) => (
        <motion.span
          key={item.id}
          className="absolute font-display text-[var(--color-gold-decorative)] select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            textShadow: "0 0 20px var(--glow-gold)",
          }}
          initial={{ y: 0, x: 0, opacity: 0, scale: 0.8 }}
          animate={{
            y: [0, -50, 0],
            x: [0, item.xDirection * 2, 0],
            opacity: [0, item.opacity * 2, item.opacity, item.opacity * 2, 0],
            scale: [0.8, 1, 1.05, 1, 0.8],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          {item.number}
        </motion.span>
      ))}
    </div>
  );
}
