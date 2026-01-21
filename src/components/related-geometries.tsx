"use client";

import { useRef, useEffect } from "react";
import { Card, Heading } from "@radix-ui/themes";
import {
  getGeometryBySlug,
  type RelationshipType,
  type Geometry,
} from "@/lib/data";
import { GeometryCard } from "./geometry-card";
import {
  formatRelationshipLabel,
  getRelationshipCategory,
} from "./relationship-badge";
import { cn } from "@/lib/utils";
import { StaggerChildren, StaggerItem } from "./stagger-children";
import { useContentLayoutSafe } from "./content-layout-context";

interface RelatedGeometriesProps {
  slug: string;
}

// Category display order
const CATEGORY_ORDER = [
  "structural",
  "transformational",
  "conceptual",
  "mathematical",
] as const;

// Get sort priority for relationship types (within their category)
function getTypeSortPriority(type: RelationshipType): number {
  const priorities: Partial<Record<RelationshipType, number>> = {
    // Structural - most important first
    dual: 0,
    contains: 1,
    "appears-in": 2,
    "composed-of": 3,
    "derived-from": 4,
    // Transformational
    "transforms-into": 0,
    "emerges-from": 1,
    "unfolds-to": 2,
    // Conceptual
    "similar-to": 0,
    complementary: 1,
    "resonates-with": 2,
    "related-by-element": 3,
    // Mathematical
    "ratio-related": 0,
    proportional: 1,
    "symmetric-with": 2,
  };
  return priorities[type] ?? 99;
}

/**
 * RelatedGeometries Component
 *
 * Displays related geometries in a card grid layout,
 * grouped by relationship type with section headers.
 */
export function RelatedGeometries({ slug }: RelatedGeometriesProps) {
  const geometry = getGeometryBySlug(slug);
  const context = useContentLayoutSafe();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Register with scroll tracking context
  useEffect(() => {
    if (!context?.registerSection) return;
    const element = sectionRef.current;
    if (!element) return;

    context.registerSection("related-geometries", element);
    return () => context.registerSection("related-geometries", null);
  }, [context]);

  if (!geometry?.relationships || geometry.relationships.length === 0) {
    return null;
  }

  // Group relationships by type
  const grouped: Record<
    RelationshipType,
    Array<{
      target: Geometry;
      context?: string;
    }>
  > = {} as Record<RelationshipType, Array<{ target: Geometry; context?: string }>>;

  geometry.relationships.forEach((rel) => {
    const target = getGeometryBySlug(rel.targetId);
    if (!target) return;

    if (!grouped[rel.type]) {
      grouped[rel.type] = [];
    }
    grouped[rel.type].push({
      target,
      context: rel.context,
    });
  });

  // Sort relationship types by category order, then by priority within category
  const sortedTypes = (Object.keys(grouped) as RelationshipType[]).sort(
    (a, b) => {
      const catA = getRelationshipCategory(a);
      const catB = getRelationshipCategory(b);
      const catOrderA = CATEGORY_ORDER.indexOf(catA);
      const catOrderB = CATEGORY_ORDER.indexOf(catB);

      if (catOrderA !== catOrderB) {
        return catOrderA - catOrderB;
      }

      return getTypeSortPriority(a) - getTypeSortPriority(b);
    }
  );

  return (
    <Card
      ref={sectionRef}
      id="related-geometries"
      className="mb-6 border-[var(--border-gold)] bg-card dark:bg-gradient-to-br dark:from-[var(--color-warm-charcoal)] dark:to-[var(--color-dark-bronze)] p-6 sm:mb-8 sm:p-8"
    >
      <Heading
        mb="6"
        size={{ initial: "5", md: "6" }}
        className="text-[var(--color-gold)]"
      >
        Related Geometries
      </Heading>

      <div className="space-y-8">
        {sortedTypes.map((type) => {
          const relationships = grouped[type];
          if (!relationships || relationships.length === 0) return null;

          return (
            <section key={type}>
              {/* Section Header */}
              <Heading
                size="4"
                className="mb-4 text-[var(--color-gold-bright)]"
              >
                {formatRelationshipLabel(type)}
              </Heading>

              {/* Card Grid with Stagger Animation */}
              <StaggerChildren
                className={cn(
                  "grid gap-4",
                  "grid-cols-1",
                  "sm:grid-cols-2",
                  "lg:grid-cols-3"
                )}
                staggerDelay={0.08}
                threshold={0.1}
              >
                {relationships.map((rel) => (
                  <StaggerItem key={rel.target.id} variant="fadeUp">
                    <GeometryCard
                      geometry={rel.target}
                      context={rel.context}
                    />
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </section>
          );
        })}
      </div>
    </Card>
  );
}
