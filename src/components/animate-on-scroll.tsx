"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { EASE_STANDARD } from "@/lib/animation-constants";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  /** Animation variant to use */
  variant?: "fadeUp" | "fadeIn" | "scaleUp";
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Margin around viewport to trigger earlier (e.g., "-100px" triggers 100px before entering) */
  margin?: string;
}

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
  fadeIn: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  },
  scaleUp: {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  },
};

export function AnimateOnScroll({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  duration = 0.5,
  margin = "0px 0px 100px 0px",
}: AnimateOnScrollProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: "some", margin }}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: EASE_STANDARD,
      }}
    >
      {children}
    </motion.div>
  );
}
