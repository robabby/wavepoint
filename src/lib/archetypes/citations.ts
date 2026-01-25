/**
 * Citations for archetype correspondences.
 *
 * Sources for Jungian archetypal psychology and the 12-archetype framework.
 */

export interface Citation {
  id: string;
  category: "primary" | "scholarly" | "contemporary";
  shortLabel: string;
  fullCitation: string;
  year?: number;
}

// =============================================================================
// CARL JUNG - PRIMARY SOURCES
// =============================================================================

export const JUNG_ARCHETYPES: Citation = {
  id: "jung-archetypes",
  category: "primary",
  shortLabel: "Jung CW 9.1",
  fullCitation:
    "Jung, C. G. The Archetypes and the Collective Unconscious (Collected Works Vol. 9 Part 1). Princeton University Press, 1959.",
  year: 1959,
};

export const JUNG_AION: Citation = {
  id: "jung-aion",
  category: "primary",
  shortLabel: "Jung Aion",
  fullCitation:
    "Jung, C. G. Aion: Researches into the Phenomenology of the Self (Collected Works Vol. 9 Part 2). Princeton University Press, 1959.",
  year: 1959,
};

export const JUNG_PSYCHOLOGY_ALCHEMY: Citation = {
  id: "jung-psychology-alchemy",
  category: "primary",
  shortLabel: "Jung CW 12",
  fullCitation:
    "Jung, C. G. Psychology and Alchemy (Collected Works Vol. 12). Princeton University Press, 1953.",
  year: 1953,
};

export const JUNG_MYSTERIUM: Citation = {
  id: "jung-mysterium",
  category: "primary",
  shortLabel: "Jung CW 14",
  fullCitation:
    "Jung, C. G. Mysterium Coniunctionis (Collected Works Vol. 14). Princeton University Press, 1963.",
  year: 1963,
};

// =============================================================================
// CAROL PEARSON - 12 ARCHETYPE FRAMEWORK
// =============================================================================

export const PEARSON_HEROES: Citation = {
  id: "pearson-heroes",
  category: "scholarly",
  shortLabel: "Pearson",
  fullCitation:
    "Pearson, Carol S. Awakening the Heroes Within: Twelve Archetypes to Help Us Find Ourselves and Transform Our World. HarperOne, 1991.",
  year: 1991,
};

export const PEARSON_MARK_HERO: Citation = {
  id: "pearson-mark-hero",
  category: "scholarly",
  shortLabel: "Pearson & Mark",
  fullCitation:
    "Mark, Margaret, and Carol S. Pearson. The Hero and the Outlaw: Building Extraordinary Brands Through the Power of Archetypes. McGraw-Hill, 2001.",
  year: 2001,
};

// =============================================================================
// CONTEMPORARY JUNGIAN PSYCHOLOGY
// =============================================================================

export const HILLMAN_ARCHETYPAL: Citation = {
  id: "hillman-archetypal",
  category: "contemporary",
  shortLabel: "Hillman",
  fullCitation:
    "Hillman, James. Re-Visioning Psychology. Harper Perennial, 1975.",
  year: 1975,
};

export const MOORE_KING: Citation = {
  id: "moore-king",
  category: "contemporary",
  shortLabel: "Moore & Gillette",
  fullCitation:
    "Moore, Robert, and Douglas Gillette. King, Warrior, Magician, Lover: Rediscovering the Archetypes of the Mature Masculine. HarperOne, 1990.",
  year: 1990,
};

// =============================================================================
// ALL CITATIONS
// =============================================================================

export const ALL_CITATIONS: Citation[] = [
  JUNG_ARCHETYPES,
  JUNG_AION,
  JUNG_PSYCHOLOGY_ALCHEMY,
  JUNG_MYSTERIUM,
  PEARSON_HEROES,
  PEARSON_MARK_HERO,
  HILLMAN_ARCHETYPAL,
  MOORE_KING,
];

/**
 * Get a citation by ID
 */
export function getCitation(id: string): Citation | undefined {
  return ALL_CITATIONS.find((c) => c.id === id);
}
