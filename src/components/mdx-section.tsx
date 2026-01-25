"use client";

import { type ReactNode, useRef, useEffect, useLayoutEffect, useId } from "react";
import { Card } from "@radix-ui/themes";
import { useContentLayoutSafe } from "./content-layout-context";

interface MDXSectionProps {
  children: ReactNode;
}

/**
 * Generate URL-friendly ID from title
 */
function generateIdFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * MDX Section Component
 *
 * Renders content sections as styled cards.
 * When used within ContentLayout, tracks active section for ToC highlighting.
 *
 * Uses DOM-based h2 extraction because React children from server-rendered MDX
 * are serialized and lose their component type information (displayName).
 */
export function MDXSection({ children }: MDXSectionProps) {
  const context = useContentLayoutSafe();
  const sectionRef = useRef<HTMLDivElement>(null);
  const fallbackId = useId();
  const computedIdRef = useRef<string>(fallbackId);

  // Extract h2 text from DOM after render and set ID attribute directly
  // Using useLayoutEffect to update DOM before paint, avoiding flash of wrong ID
  useLayoutEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    // Find the first heading element within this section
    const h2Element = element.querySelector("h1, h2");
    const h2Text = h2Element?.textContent?.trim();

    let id = fallbackId;

    if (h2Text && context) {
      // Find matching section by title for consistent ID
      const normalizedTitle = h2Text.toLowerCase().trim();
      const matchingSection = context.sections.find(
        (s) => s.title.toLowerCase().trim() === normalizedTitle
      );
      id = matchingSection?.id ?? generateIdFromTitle(h2Text);
    } else if (h2Text) {
      id = generateIdFromTitle(h2Text);
    }

    // Update the ref and DOM directly (no state update = no re-render)
    computedIdRef.current = id;
    element.id = id;
  }, [context, fallbackId]);

  // Get stable reference to registerSection
  const registerSection = context?.registerSection;

  // Register with the centralized section tracker
  useEffect(() => {
    if (!registerSection) return;

    const element = sectionRef.current;
    if (!element) return;

    // Register this section element
    registerSection(computedIdRef.current, element);

    return () => {
      // Unregister on cleanup
      registerSection(computedIdRef.current, null);
    };
  }, [registerSection]);

  return (
    <Card
      ref={sectionRef}
      id={fallbackId}
      // Suppress hydration warning because we intentionally update the ID
      // via useLayoutEffect after extracting h2 text from the DOM.
      // The fallbackId from useId() can differ between server/client in MDX contexts.
      suppressHydrationWarning
      className="mb-6 border-[var(--border-gold)] bg-card dark:bg-gradient-to-br dark:from-[var(--color-warm-charcoal)] dark:to-[var(--color-dark-bronze)] p-6 sm:mb-8 sm:p-8"
    >
      {children}
    </Card>
  );
}
