import type { MDXComponents } from "mdx/types";
import type { ReactNode, AnchorHTMLAttributes } from "react";
import { Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { RelatedGeometries } from "@/components/related-geometries";

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

    ...components,
  };
}

/**
 * Custom MDX components for Sacred Pattern content
 * Hook version for use in client components
 * These components style MDX content to match our design system
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
