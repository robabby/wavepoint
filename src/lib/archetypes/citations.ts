/**
 * Citations for archetype correspondences.
 *
 * Sources for the Golden Dawn system and cross-traditional research.
 */

export interface Citation {
  id: string;
  category: "traditional" | "scholarly" | "contemporary";
  shortLabel: string;
  fullCitation: string;
  year?: number;
}

// =============================================================================
// GOLDEN DAWN & HERMETIC SOURCES
// =============================================================================

export const GOLDEN_DAWN_TRADITION: Citation = {
  id: "golden-dawn-tradition",
  category: "traditional",
  shortLabel: "Golden Dawn",
  fullCitation:
    "Hermetic Order of the Golden Dawn teachings (1888-1903). Systematized by MacGregor Mathers and published in Regardie's 'The Golden Dawn' (1937).",
  year: 1888,
};

export const CROWLEY_777: Citation = {
  id: "crowley-777",
  category: "traditional",
  shortLabel: "Crowley",
  fullCitation:
    "Crowley, Aleister. 777 and Other Qabalistic Writings. Samuel Weiser, 1909.",
  year: 1909,
};

export const REGARDIE_GOLDEN_DAWN: Citation = {
  id: "regardie-golden-dawn",
  category: "scholarly",
  shortLabel: "Regardie",
  fullCitation:
    "Regardie, Israel. The Golden Dawn: The Original Account of the Teachings, Rites, and Ceremonies of the Hermetic Order. Llewellyn Publications, 1937.",
  year: 1937,
};

// =============================================================================
// CONTINENTAL TRADITION
// =============================================================================

export const LEVI_TRANSCENDENTAL_MAGIC: Citation = {
  id: "levi-transcendental-magic",
  category: "traditional",
  shortLabel: "Levi",
  fullCitation:
    "Levi, Eliphas. Dogme et Rituel de la Haute Magie. Paris, 1856. English: Transcendental Magic.",
  year: 1856,
};

export const COURT_DE_GEBELIN: Citation = {
  id: "court-de-gebelin",
  category: "traditional",
  shortLabel: "Court de Gebelin",
  fullCitation:
    "Court de Gebelin, Antoine. Le Monde primitif, analyse et compare avec le monde moderne, Vol. VIII. Paris, 1781.",
  year: 1781,
};

// =============================================================================
// KABBALISTIC SOURCES
// =============================================================================

export const SEPHER_YETZIRAH: Citation = {
  id: "sepher-yetzirah",
  category: "traditional",
  shortLabel: "Sepher Yetzirah",
  fullCitation:
    "Sepher Yetzirah (Book of Formation). Multiple recensions, c. 3rd-6th century CE. Kaplan translation (1997).",
};

export const KAPLAN_SEPHER_YETZIRAH: Citation = {
  id: "kaplan-sepher-yetzirah",
  category: "scholarly",
  shortLabel: "Kaplan",
  fullCitation:
    "Kaplan, Aryeh. Sefer Yetzirah: The Book of Creation in Theory and Practice. Samuel Weiser, 1997.",
  year: 1997,
};

// =============================================================================
// ANTHROPOSOPHICAL
// =============================================================================

export const TOMBERG_MEDITATIONS: Citation = {
  id: "tomberg-meditations",
  category: "scholarly",
  shortLabel: "Tomberg",
  fullCitation:
    "Tomberg, Valentin. Meditations on the Tarot: A Journey into Christian Hermeticism. Amity House, 1985 (posthumous).",
  year: 1985,
};

// =============================================================================
// ALL CITATIONS
// =============================================================================

export const ALL_CITATIONS: Citation[] = [
  GOLDEN_DAWN_TRADITION,
  CROWLEY_777,
  REGARDIE_GOLDEN_DAWN,
  LEVI_TRANSCENDENTAL_MAGIC,
  COURT_DE_GEBELIN,
  SEPHER_YETZIRAH,
  KAPLAN_SEPHER_YETZIRAH,
  TOMBERG_MEDITATIONS,
];

/**
 * Get a citation by ID
 */
export function getCitation(id: string): Citation | undefined {
  return ALL_CITATIONS.find((c) => c.id === id);
}
