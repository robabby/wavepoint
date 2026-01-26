"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: SectionNavItem[];
  className?: string;
}

/**
 * Sticky section navigation with scroll-based active highlighting.
 * Tracks which section is currently in view and highlights the corresponding nav item.
 */
export function SectionNav({ sections, className }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  // Calculate active section based on scroll position
  const calculateActiveSection = useCallback(() => {
    const threshold = 200; // pixels from top of viewport
    let activeId: string | null = null;
    let smallestPositiveDistance = Infinity;

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const distanceAboveThreshold = threshold - rect.top;

      // Section has passed threshold and is still visible
      if (distanceAboveThreshold >= 0 && rect.bottom > 0) {
        if (distanceAboveThreshold < smallestPositiveDistance) {
          smallestPositiveDistance = distanceAboveThreshold;
          activeId = section.id;
        }
      }
    }

    // Fallback to first visible section if none passed threshold
    if (!activeId) {
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          activeId = section.id;
          break;
        }
      }
    }

    return activeId ?? sections[0]?.id ?? "";
  }, [sections]);

  // Set up scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const newActive = calculateActiveSection();
          setActiveSection((prev) => (prev !== newActive ? newActive : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    const timeoutId = setTimeout(() => {
      setActiveSection(calculateActiveSection());
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateActiveSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-16 z-30 -mx-4 px-4 py-3 backdrop-blur-md",
        "bg-background/80 border-b border-border/50",
        "overflow-x-auto scrollbar-hide",
        className
      )}
      aria-label="Page sections"
    >
      <div className="flex items-center justify-center gap-1 min-w-max">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition-colors",
              "rounded-full whitespace-nowrap",
              activeSection === section.id
                ? "text-[var(--color-gold)] bg-[var(--color-gold)]/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            aria-current={activeSection === section.id ? "true" : undefined}
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
