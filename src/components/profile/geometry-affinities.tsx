"use client";

import { useMemo, useCallback, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Heading, Text } from "@radix-ui/themes";
import { cn } from "@/lib/utils";
import { getPlatonicImagePath } from "@/lib/data/image-paths";
import {
  useGeometryAffinities,
  useUpdateGeometryAffinity,
} from "@/hooks/geometry";
import type { PlatonicSolidSlug, AffinityScore } from "@/lib/geometry";
import {
  fadeUpVariants,
  staggerContainerVariants,
} from "@/components/signal/animation-config";

/**
 * Configuration for the 5 Platonic solids
 */
const GEOMETRIES = [
  {
    slug: "tetrahedron" as PlatonicSolidSlug,
    name: "Tetrahedron",
    element: "Fire",
    elementColor: "var(--color-fire, #f97316)",
  },
  {
    slug: "hexahedron" as PlatonicSolidSlug,
    name: "Hexahedron",
    element: "Earth",
    elementColor: "var(--color-earth, #84cc16)",
  },
  {
    slug: "octahedron" as PlatonicSolidSlug,
    name: "Octahedron",
    element: "Air",
    elementColor: "var(--color-air, #06b6d4)",
  },
  {
    slug: "icosahedron" as PlatonicSolidSlug,
    name: "Icosahedron",
    element: "Water",
    elementColor: "var(--color-water, #3b82f6)",
  },
  {
    slug: "dodecahedron" as PlatonicSolidSlug,
    name: "Dodecahedron",
    element: "Spirit",
    elementColor: "var(--color-gold)",
  },
] as const;

interface AffinityRatingProps {
  /** Current score (1-5) or null if not set */
  value: AffinityScore | null;
  /** Callback when rating changes */
  onChange: (score: AffinityScore | null) => void;
  /** Whether the rating is being updated */
  isUpdating?: boolean;
  /** Unique ID for accessibility */
  id: string;
  /** Geometry name for aria-label */
  geometryName: string;
}

/**
 * Interactive 5-circle affinity rating component.
 * Supports keyboard navigation and screen readers.
 */
function AffinityRating({
  value,
  onChange,
  isUpdating,
  id,
  geometryName,
}: AffinityRatingProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentScoreIndex = value === null ? 0 : value;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          if (currentScoreIndex < 5) {
            onChange((currentScoreIndex + 1) as AffinityScore);
          }
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          if (currentScoreIndex > 1) {
            onChange((currentScoreIndex - 1) as AffinityScore);
          } else if (currentScoreIndex === 1) {
            onChange(null);
          }
          break;
        case "Home":
          e.preventDefault();
          onChange(null);
          break;
        case "End":
          e.preventDefault();
          onChange(5);
          break;
      }
    },
    [value, onChange]
  );

  const handleClick = useCallback(
    (score: AffinityScore) => {
      // Toggle off if clicking the same value
      if (value === score) {
        onChange(null);
      } else {
        onChange(score);
      }
    },
    [value, onChange]
  );

  const ariaLabel = useMemo(() => {
    if (value === null) {
      return `${geometryName} affinity: not set`;
    }
    return `${geometryName} affinity: ${value} of 5`;
  }, [geometryName, value]);

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      id={id}
      className="flex items-center gap-1.5"
    >
      {([1, 2, 3, 4, 5] as AffinityScore[]).map((score) => {
        const isSelected = value !== null && score <= value;
        const isExact = value === score;

        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={isExact}
            aria-label={`${score} of 5`}
            tabIndex={isExact || (value === null && score === 1) ? 0 : -1}
            disabled={isUpdating}
            onClick={() => handleClick(score)}
            onKeyDown={handleKeyDown}
            className={cn(
              "relative h-5 w-5 rounded-full transition-all duration-200",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isUpdating && "cursor-wait opacity-60",
              !isUpdating && "cursor-pointer"
            )}
          >
            {/* Outer ring (always visible) */}
            <span
              className={cn(
                "absolute inset-0 rounded-full border-2 transition-colors duration-200",
                isSelected
                  ? "border-[var(--color-gold)]"
                  : "border-muted-foreground/30"
              )}
            />
            {/* Inner fill (when selected) */}
            <motion.span
              initial={false}
              animate={{
                scale: isSelected ? 1 : 0,
                opacity: isSelected ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.15,
                ease: "easeOut",
              }}
              className={cn(
                "absolute inset-1 rounded-full bg-[var(--color-gold)]",
                isSelected && "shadow-[0_0_8px_var(--glow-gold)]"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Loading skeleton for geometry cards
 */
function GeometryAffinitiesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-48 animate-pulse rounded bg-muted/30" />
      <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="min-w-[140px] flex-shrink-0 animate-pulse rounded-xl border border-[var(--border-gold)]/10 bg-card/20 px-3 py-4 lg:min-w-0"
          >
            <div className="mb-2 h-14 w-14 mx-auto rounded-lg bg-muted/20" />
            <div className="mb-1 h-4 w-20 mx-auto rounded bg-muted/20" />
            <div className="mb-2 h-3 w-10 mx-auto rounded bg-muted/20" />
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((j) => (
                <div
                  key={j}
                  className="h-5 w-5 rounded-full bg-muted/20"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GeometryAffinitiesProps {
  className?: string;
}

/**
 * Displays all 5 Platonic solids with interactive affinity ratings.
 * Supports horizontal scroll on mobile, 5-column grid on desktop.
 */
export function GeometryAffinities({ className }: GeometryAffinitiesProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseId = useId();

  const { affinities, isLoading } = useGeometryAffinities();
  const { updateAffinity, isUpdating } = useUpdateGeometryAffinity();

  // Create a lookup map for quick access
  const affinityMap = useMemo(() => {
    const map = new Map<PlatonicSolidSlug, AffinityScore | null>();
    for (const affinity of affinities) {
      map.set(affinity.geometrySlug, affinity.affinityScore);
    }
    return map;
  }, [affinities]);

  const handleAffinityChange = useCallback(
    async (slug: PlatonicSolidSlug, score: AffinityScore | null) => {
      try {
        await updateAffinity({ geometrySlug: slug, affinityScore: score });
      } catch (error) {
        // Error is already handled by the hook with rollback
        console.error("Failed to update affinity:", error);
      }
    },
    [updateAffinity]
  );

  if (isLoading) {
    return <GeometryAffinitiesSkeleton />;
  }

  return (
    <section className={className}>
      <Heading
        size="4"
        className="mb-4 font-display text-[var(--color-gold)]"
      >
        Geometry Affinities
      </Heading>

      <motion.div
        variants={prefersReducedMotion ? undefined : staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0"
      >
        {GEOMETRIES.map((geometry, index) => {
          const currentScore = affinityMap.get(geometry.slug) ?? null;
          const ratingId = `${baseId}-${geometry.slug}`;

          return (
            <motion.div
              key={geometry.slug}
              variants={prefersReducedMotion ? undefined : fadeUpVariants}
              custom={index}
              className={cn(
                "group relative min-w-[140px] flex-shrink-0 rounded-xl px-3 py-4 lg:min-w-0",
                "border border-[var(--border-gold)]/20 bg-card/30",
                "hover:border-[var(--color-gold)]/40 hover:bg-[var(--color-gold)]/5",
                "transition-all duration-300"
              )}
            >
              {/* Geometry Icon - gold tinted via CSS filters */}
              <Link
                href={`/geometries/platonic-solids/${geometry.slug}`}
                className="mx-auto mb-2 block h-14 w-14 transition-transform duration-300 group-hover:scale-110"
              >
                <Image
                  src={getPlatonicImagePath(geometry.slug, "3d")}
                  alt={geometry.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-contain transition-all [filter:invert(75%)_sepia(50%)_saturate(600%)_hue-rotate(5deg)_brightness(100%)] group-hover:[filter:invert(80%)_sepia(60%)_saturate(800%)_hue-rotate(5deg)_brightness(110%)_drop-shadow(0_0_8px_var(--glow-gold))]"
                />
              </Link>

              {/* Name - fluid sizing to fit all names */}
              <Link
                href={`/geometries/platonic-solids/${geometry.slug}`}
                className="mb-0.5 block text-center"
              >
                <span
                  className="whitespace-nowrap font-display font-medium text-foreground transition-colors group-hover:text-[var(--color-gold)]"
                  style={{ fontSize: "clamp(0.7rem, 1.5vw + 0.3rem, 0.875rem)" }}
                >
                  {geometry.name}
                </span>
              </Link>

              {/* Element */}
              <Text
                size="1"
                className="mb-2 block text-center uppercase tracking-wider"
                style={{ color: geometry.elementColor }}
              >
                {geometry.element}
              </Text>

              {/* Rating */}
              <div className="flex justify-center">
                <AffinityRating
                  id={ratingId}
                  value={currentScore}
                  onChange={(score) => handleAffinityChange(geometry.slug, score)}
                  isUpdating={isUpdating}
                  geometryName={geometry.name}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <Text size="1" className="mt-3 text-center text-muted-foreground/60 lg:text-left">
        Rate your connection to each sacred form
      </Text>
    </section>
  );
}
