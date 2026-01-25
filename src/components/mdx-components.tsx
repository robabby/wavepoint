import type { MDXComponents } from "mdx/types";
import type { ReactNode, AnchorHTMLAttributes } from "react";
import { Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { RelatedGeometries } from "@/components/related-geometries";
import { SourceBadge } from "@/components/synthesis";
import { cn } from "@/lib/utils";
import type { SourceCategory } from "@/lib/astrology/planets";

/**
 * Named h2 component with displayName for MDXSection title extraction
 * The displayName "MDXHeading2" is checked by extractTitleFromChildren()
 * in mdx-section.tsx to identify h2 elements for collapsible section titles.
 */
function MDXHeading2({ children }: { children: ReactNode }) {
  return (
    <Heading mb="2" size="5" className="text-amber-300">
      {children}
    </Heading>
  );
}
MDXHeading2.displayName = "MDXHeading2";

/**
 * Get custom MDX components for Sacred Pattern content
 * Non-hook version for use in server-side functions
 */
export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <Heading
        mb="2"
        size="6"
        className="text-amber-300"
      >
        {children}
      </Heading>
    ),
    h2: MDXHeading2,
    h3: ({ children }) => (
      <Heading size="4" mb="3" className="text-amber-200">
        {children}
      </Heading>
    ),

    // Paragraphs
    p: ({ children }) => (
      <Text as="p" mb="2" className="text-foreground">
        {children}
      </Text>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="mb-4 space-y-3 text-foreground">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-4 space-y-3 text-foreground">{children}</ol>
    ),
    li: ({ children }) => <li>{children}</li>,

    // Tables
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-[var(--color-gold)]/30 text-left">
        {children}
      </thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-[var(--border-gold)]/10">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="px-3 py-2 font-heading text-[var(--color-gold)]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-foreground">{children}</td>
    ),

    // Strong text
    strong: ({ children }) => (
      <strong className="text-amber-300">{children}</strong>
    ),

    // Links - styled with gold color and underline for visibility
    a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      // Use Next.js Link for internal links
      const isInternal = href?.startsWith("/") || href?.startsWith("#");

      const linkStyles = "text-[var(--color-gold)] underline decoration-[var(--color-gold-muted)] underline-offset-2 transition-colors hover:text-[var(--color-gold-bright)] hover:decoration-[var(--color-gold)]";

      if (isInternal && href) {
        return (
          <Link href={href} className={linkStyles} {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={linkStyles}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },

    // Wrapper for sections - wraps content between h2s in Cards
    wrapper: ({ children }) => <>{children}</>,

    // Custom components
    RelatedGeometries,

    // Synthesis components for astrology/planets MDX content
    RelatedNumbers,
    RelatedGeometry,
    RelatedSigns,
    SourceBadgeMDX,

    ...components,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// PLANET-SPECIFIC MDX COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

interface RelatedNumbersProps {
  /** The number pattern to link to (e.g., "888") */
  pattern: string;
  /** Optional context text explaining the connection */
  context?: string;
}

/**
 * MDX component for linking to number patterns from planet pages.
 */
function RelatedNumbers({ pattern, context }: RelatedNumbersProps) {
  return (
    <div className="my-4 rounded-lg border border-[var(--border-gold)]/30 bg-card/30 p-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/numbers/${pattern}`}
          className={cn(
            "font-display text-2xl tracking-wider text-[var(--color-gold)]",
            "transition-colors hover:text-[var(--color-gold-bright)]"
          )}
        >
          {pattern}
        </Link>
        {context && (
          <Text size="2" className="text-muted-foreground">
            {context}
          </Text>
        )}
      </div>
    </div>
  );
}

interface RelatedGeometryMDXProps {
  /** The geometry slug to link to (e.g., "hexahedron") */
  slug: string;
  /** Optional context text explaining the connection */
  context?: string;
}

/**
 * MDX component for linking to geometry pages from planet pages.
 */
function RelatedGeometry({ slug, context }: RelatedGeometryMDXProps) {
  // Map common names to paths
  const pathMap: Record<string, string> = {
    tetrahedron: "/platonic-solids/tetrahedron",
    cube: "/platonic-solids/hexahedron",
    hexahedron: "/platonic-solids/hexahedron",
    octahedron: "/platonic-solids/octahedron",
    icosahedron: "/platonic-solids/icosahedron",
    dodecahedron: "/platonic-solids/dodecahedron",
  };

  const path = pathMap[slug.toLowerCase()] ?? `/platonic-solids/${slug}`;
  const displayName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="my-4 rounded-lg border border-[var(--border-gold)]/30 bg-card/30 p-4">
      <div className="flex items-center gap-3">
        <Link
          href={path}
          className={cn(
            "font-heading text-lg text-[var(--color-gold)]",
            "transition-colors hover:text-[var(--color-gold-bright)]"
          )}
        >
          {displayName}
        </Link>
        {context && (
          <Text size="2" className="text-muted-foreground">
            {context}
          </Text>
        )}
      </div>
    </div>
  );
}

interface RelatedSignsProps {
  /** Type of relationship to show */
  type: "rules" | "exalts" | "detriment" | "fall";
  /** Signs to display */
  signs: string[];
  /** Whether this is traditional rulership */
  traditional?: boolean;
}

/**
 * MDX component for showing zodiac sign relationships.
 */
function RelatedSigns({ type, signs, traditional }: RelatedSignsProps) {
  const labels: Record<string, string> = {
    rules: "Rules",
    exalts: "Exalted in",
    detriment: "Detriment in",
    fall: "Fall in",
  };

  return (
    <div className="my-2 flex items-center gap-2">
      <Text size="2" className="text-muted-foreground">
        {labels[type]}:
      </Text>
      <div className="flex gap-2">
        {signs.map((sign) => (
          <span
            key={sign}
            className="rounded-full border border-[var(--color-gold)]/20 bg-card/30 px-2 py-0.5 text-sm text-foreground"
          >
            {sign}
            {traditional && type === "rules" && (
              <span className="ml-1 text-xs text-muted-foreground">
                (traditional)
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

interface SourceBadgeMDXProps {
  /** The source category */
  category: SourceCategory;
  /** Short label for the badge */
  label?: string;
  /** Full citation shown on hover */
  citation?: string;
}

/**
 * MDX wrapper for SourceBadge component.
 * Allows inline citations in MDX content.
 */
function SourceBadgeMDX({ category, label, citation }: SourceBadgeMDXProps) {
  return (
    <SourceBadge
      category={category}
      label={label}
      fullCitation={citation}
      className="ml-1"
    />
  );
}

/**
 * Custom MDX components for Sacred Pattern content
 * Hook version for use in client components
 * These components style MDX content to match our design system
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
