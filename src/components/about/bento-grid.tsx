"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { CircleDot, Hash, Sparkles } from "lucide-react";
import { ROUTES } from "@/util/routes";
import { cn } from "@/lib/utils";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

/**
 * BentoGrid - Feature card layout for About page
 */

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: EASE_STANDARD,
    },
  },
};

interface BentoCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
  large?: boolean;
}

function BentoCard({
  href,
  icon,
  title,
  description,
  className,
  large = false,
}: BentoCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Link
        href={href}
        className={cn(
          "group relative block h-full overflow-hidden rounded-lg",
          "border border-[var(--border-gold)] bg-card",
          "transition-all duration-300",
          "hover:border-[var(--color-gold)] hover:shadow-[0_0_24px_var(--glow-gold)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
      >
        <div className={cn("flex flex-col", large ? "p-8 lg:p-10" : "p-6")}>
          {/* Icon with rotation on hover */}
          <div
            className={cn(
              "mb-4 flex items-center justify-center rounded-lg bg-[var(--color-gold)]/10",
              "transition-all duration-300 group-hover:rotate-12 group-hover:bg-[var(--color-gold)]/20",
              large ? "h-14 w-14" : "h-10 w-10"
            )}
          >
            <div className={cn("text-[var(--color-gold)]", large ? "h-7 w-7" : "h-5 w-5")}>
              {icon}
            </div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-heading font-semibold text-foreground",
              "transition-colors group-hover:text-[var(--color-gold)]",
              large ? "text-2xl lg:text-3xl" : "text-lg"
            )}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className={cn(
              "mt-2 text-muted-foreground",
              large ? "text-base lg:text-lg" : "text-sm"
            )}
          >
            {description}
          </p>

          {/* Arrow indicator for large card */}
          {large && (
            <div className="mt-auto pt-8">
              <span className="inline-flex items-center gap-2 text-sm text-[var(--color-gold)] opacity-0 transition-opacity group-hover:opacity-100">
                Explore
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          )}
        </div>

        {/* Decorative gold gradient on hover - bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            background: "linear-gradient(to right, transparent, var(--color-gold), transparent)",
          }}
        />
      </Link>
    </motion.div>
  );
}

export function BentoGrid() {
  const signalEnabled = isSignalEnabled();

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Large card: Geometries */}
      <BentoCard
        href={ROUTES.sacredGeometry.path}
        icon={<CircleDot className="h-full w-full" />}
        title="Geometries"
        description="The forms that shape reality. From Platonic solids to sacred patterns, explore the mathematical principles underlying our universe."
        large
      />

      {/* Numbers card */}
      <BentoCard
        href={ROUTES.numbers.path}
        icon={<Hash className="h-full w-full" />}
        title="Numbers"
        description="Angel number meanings"
        large
      />

      {/* Signal card */}
      <BentoCard
        href={signalEnabled ? "/signal" : "/signal"}
        icon={<Sparkles className="h-full w-full" />}
        title="Signal"
        description={signalEnabled ? "Track your sightings" : "Coming soon"}
        large
      />
    </motion.div>
  );
}

export default BentoGrid;
