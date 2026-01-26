"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { MajorArcanaCard } from "@/lib/tarot";
import { TAROT_STYLES } from "@/lib/theme/tarot-styles";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { TarotCardFrame } from "./TarotCardFrame";

interface TarotCardProps {
  card: MajorArcanaCard;
  className?: string;
}

/**
 * Grid card for displaying a Major Arcana tarot card.
 * Portrait aspect ratio with ornate gold frame, 3D hover tilt effect,
 * and warm gold styling to complement Rider-Waite illustrations.
 */
export function TarotCard({ card, className }: TarotCardProps) {
  return (
    <Link
      href={`/archetypes/tarot/${card.slug}`}
      className="block"
      aria-label={`${card.romanNumeral} ${card.name}: ${card.keywords.slice(0, 2).join(", ")}`}
    >
      <motion.article
        className={cn(
          "group relative cursor-pointer",
          "transform-gpu",
          className
        )}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          scale: TAROT_STYLES.animation.hoverScale,
          rotateY: 2,
          rotateX: -2,
          z: 50,
        }}
        transition={{
          duration: TAROT_STYLES.animation.hoverDuration,
          ease: EASE_STANDARD,
        }}
      >
        {/* Shadow layer - deepens on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl bg-black/0"
          style={{
            filter: "blur(20px)",
            transform: "translateY(10px) translateZ(-20px)",
          }}
          initial={{ opacity: 0.3 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card with ornate frame */}
        <TarotCardFrame
          className={cn(
            "rounded-xl",
            "bg-gradient-to-br",
            TAROT_STYLES.card.gradient,
            "transition-shadow duration-300",
            "group-hover:shadow-[0_0_30px_rgba(212,168,75,0.25)]"
          )}
        >
          {/* Card image with portrait aspect ratio */}
          <div className="relative mb-3 overflow-hidden rounded-lg" style={{ aspectRatio: "2 / 3" }}>
            <Image
              src={card.imagePath}
              alt={`${card.name} tarot card`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={cn(
                "object-cover object-top",
                "transition-transform duration-500",
                "group-hover:scale-105"
              )}
            />

            {/* Vignette overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
              }}
            />

            {/* Roman numeral overlay */}
            <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5">
              <span
                className="font-display text-sm tracking-wider"
                style={{ color: TAROT_STYLES.colors.goldBright }}
              >
                {card.romanNumeral}
              </span>
            </div>
          </div>

          {/* Card info - fixed height to ensure consistent card sizes */}
          <div className="flex min-h-[3.5rem] flex-col justify-center sm:min-h-[4rem]">
            {/* Card name */}
            <h3
              className="mb-1 text-center font-display text-sm leading-tight tracking-wide sm:text-base"
              style={{ color: TAROT_STYLES.colors.goldBright }}
            >
              {card.name.toUpperCase()}
            </h3>

            {/* Keywords (first 2) */}
            <p
              className="text-center text-xs"
              style={{ color: TAROT_STYLES.colors.gold, opacity: 0.8 }}
            >
              {card.keywords.slice(0, 2).join(" · ")}
            </p>
          </div>
        </TarotCardFrame>

        {/* Hover glow effect */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl opacity-0",
            "transition-opacity duration-300 group-hover:opacity-100"
          )}
          style={{
            background: `radial-gradient(ellipse at center, ${TAROT_STYLES.card.glowColor} 0%, transparent 70%)`,
          }}
        />
      </motion.article>
    </Link>
  );
}
