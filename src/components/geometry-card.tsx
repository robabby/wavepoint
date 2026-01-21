"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type Geometry, type RelationshipType, getGeometryThumbnailPath, getGeometryPath } from "@/lib/data";
import { RelationshipBadge } from "./relationship-badge";

interface GeometryCardProps {
  geometry: Geometry;
  relationshipType?: RelationshipType;
  context?: string;
  className?: string;
}

/**
 * GeometryCard - A glassmorphism card for displaying geometry information
 *
 * Features:
 * - Thumbnail with gold filter and hover rotation
 * - Geometry name and optional relationship badge
 * - Optional context text
 * - Truncated description
 * - Hover effects: lift, glow, border enhancement
 */
export function GeometryCard({
  geometry,
  relationshipType,
  context,
  className,
}: GeometryCardProps) {
  const thumbnailPath = getGeometryThumbnailPath(geometry.slug, geometry.category);
  const href = getGeometryPath(geometry);

  return (
    <Link
      href={href}
      className={cn(
        "group block",
        // Glassmorphism base
        "rounded-lg border backdrop-blur-md",
        "bg-card/60",
        "border-[var(--border-gold)]/40",
        // Shadow
        "shadow-lg shadow-black/20",
        // Hover effects
        "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:shadow-xl hover:shadow-[var(--glow-gold)]",
        "hover:border-[var(--color-gold)]/50",
        "hover:bg-card/70",
        // Focus state
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div
          className={cn(
            "relative h-16 w-16 shrink-0",
            "transition-transform duration-300 ease-out",
            "group-hover:rotate-[15deg]"
          )}
        >
          <Image
            src={thumbnailPath}
            alt={geometry.name}
            fill
            className="object-contain svg-gold"
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name and Badge */}
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-sm font-semibold text-[var(--color-gold-bright)] transition-colors group-hover:text-[var(--color-gold)]">
              {geometry.name}
            </h3>
            {relationshipType && (
              <RelationshipBadge type={relationshipType} />
            )}
          </div>

          {/* Context (if provided) */}
          {context && (
            <p className="mb-1 text-xs text-muted-foreground">
              {context}
            </p>
          )}

          {/* Description (truncated) */}
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
            {geometry.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
