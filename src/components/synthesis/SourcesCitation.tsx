import { cn } from "@/lib/utils";
import type { Citation, SourceCategory } from "@/lib/astrology/planets";

interface SourcesCitationProps {
  /** List of citations to display */
  citations: Citation[];
  /** Optional title (default: "Sources") */
  title?: string;
  /** Optional className */
  className?: string;
}

/**
 * Full citation list component for the bottom of content pages.
 * Groups citations by category with appropriate styling.
 */
export function SourcesCitation({
  citations,
  title = "Sources",
  className,
}: SourcesCitationProps) {
  if (citations.length === 0) return null;

  // Group citations by category
  const grouped = citations.reduce(
    (acc, citation) => {
      if (!acc[citation.category]) {
        acc[citation.category] = [];
      }
      acc[citation.category].push(citation);
      return acc;
    },
    {} as Record<SourceCategory, Citation[]>
  );

  // Category display order and labels
  const categoryOrder: SourceCategory[] = [
    "scholarly",
    "traditional",
    "practitioner",
    "wavepoint",
  ];

  const categoryLabels: Record<SourceCategory, string> = {
    scholarly: "Scholarly Sources",
    traditional: "Traditional Sources",
    practitioner: "Modern Practitioner Sources",
    wavepoint: "WavePoint Synthesis",
  };

  const categoryStyles: Record<SourceCategory, string> = {
    scholarly: "text-muted-foreground",
    traditional: "text-[var(--color-copper)]",
    practitioner: "text-muted-foreground",
    wavepoint: "text-[var(--color-gold)]/70",
  };

  return (
    <section
      className={cn(
        "mt-12 border-t border-[var(--border-gold)]/20 pt-8",
        className
      )}
      aria-labelledby="sources-heading"
    >
      <h2
        id="sources-heading"
        className="mb-6 font-heading text-lg text-[var(--color-gold)]"
      >
        {title}
      </h2>

      <div className="space-y-6">
        {categoryOrder.map((category) => {
          const categoryCitations = grouped[category];
          if (!categoryCitations || categoryCitations.length === 0) return null;

          return (
            <div key={category}>
              <h3
                className={cn(
                  "mb-3 text-sm font-medium",
                  categoryStyles[category]
                )}
              >
                {categoryLabels[category]}
              </h3>
              <ul className="space-y-2">
                {categoryCitations.map((citation) => (
                  <li key={citation.id} className="text-sm text-muted-foreground">
                    {citation.url ? (
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--color-gold)] hover:underline"
                      >
                        {citation.fullCitation}
                      </a>
                    ) : (
                      citation.fullCitation
                    )}
                    {citation.year && (
                      <span className="ml-1 text-muted-foreground/60">
                        ({citation.year})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
