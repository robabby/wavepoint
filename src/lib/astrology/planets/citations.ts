/**
 * Citation definitions for planet content.
 *
 * Sources are organized by category:
 * - Scholarly: Academic, peer-reviewed sources
 * - Traditional: Historical astrological texts
 * - Practitioner: Modern practitioner consensus
 * - WavePoint: Our synthesis framework
 */

import type { Citation } from "./types";

// ═══════════════════════════════════════════════════════════════════════════
// SCHOLARLY SOURCES
// ═══════════════════════════════════════════════════════════════════════════

export const PTOLEMY_TETRABIBLOS: Citation = {
  id: "ptolemy-tetrabiblos",
  category: "scholarly",
  shortLabel: "Ptolemy",
  fullCitation:
    "Ptolemy, Claudius. Tetrabiblos (2nd century CE). Translated by F.E. Robbins. Loeb Classical Library, 1940.",
  year: 150,
};

export const LILLY_CHRISTIAN_ASTROLOGY: Citation = {
  id: "lilly-christian-astrology",
  category: "scholarly",
  shortLabel: "Lilly",
  fullCitation:
    "Lilly, William. Christian Astrology. London: Thomas Brudenell, 1647.",
  year: 1647,
};

export const ARROYO_ASTROLOGY_PSYCHOLOGY: Citation = {
  id: "arroyo-astrology-psychology",
  category: "scholarly",
  shortLabel: "Arroyo",
  fullCitation:
    "Arroyo, Stephen. Astrology, Psychology, and the Four Elements. CRCS Publications, 1975.",
  year: 1975,
};

export const HAND_HOROSCOPE_SYMBOLS: Citation = {
  id: "hand-horoscope-symbols",
  category: "scholarly",
  shortLabel: "Hand",
  fullCitation:
    "Hand, Robert. Horoscope Symbols. Para Research, 1981.",
  year: 1981,
};

export const GREENE_SATURN: Citation = {
  id: "greene-saturn",
  category: "scholarly",
  shortLabel: "Greene",
  fullCitation:
    "Greene, Liz. Saturn: A New Look at an Old Devil. Samuel Weiser, 1976.",
  year: 1976,
};

export const RUDHYAR_ASTROLOGY_PERSONALITY: Citation = {
  id: "rudhyar-astrology-personality",
  category: "scholarly",
  shortLabel: "Rudhyar",
  fullCitation:
    "Rudhyar, Dane. The Astrology of Personality. Lucis Publishing, 1936.",
  year: 1936,
};

export const REINHART_CHIRON: Citation = {
  id: "reinhart-chiron",
  category: "scholarly",
  shortLabel: "Reinhart",
  fullCitation:
    "Reinhart, Melanie. Chiron and the Healing Journey. Penguin/Arkana, 1989.",
  year: 1989,
};

export const GEORGE_LILITH: Citation = {
  id: "george-lilith",
  category: "scholarly",
  shortLabel: "George",
  fullCitation:
    "George, Demetra. Mysteries of the Dark Moon. HarperOne, 1992.",
  year: 1992,
};

export const SCHULMAN_NODES: Citation = {
  id: "schulman-nodes",
  category: "scholarly",
  shortLabel: "Schulman",
  fullCitation:
    "Schulman, Martin. Karmic Astrology: The Moon's Nodes and Reincarnation. Samuel Weiser, 1975.",
  year: 1975,
};

export const SPILLER_NODES: Citation = {
  id: "spiller-nodes",
  category: "scholarly",
  shortLabel: "Spiller",
  fullCitation:
    "Spiller, Jan. Astrology for the Soul. Bantam Books, 1997.",
  year: 1997,
};

export const ARABIC_PARTS_TRADITION: Citation = {
  id: "arabic-parts-tradition",
  category: "traditional",
  shortLabel: "Arabic Parts",
  fullCitation:
    "Arabic parts tradition. Medieval Islamic astrology, developed 8th-12th century CE.",
};

export const BONATTI_LIBER_ASTRONOMIAE: Citation = {
  id: "bonatti-liber-astronomiae",
  category: "traditional",
  shortLabel: "Bonatti",
  fullCitation:
    "Bonatti, Guido. Liber Astronomiae (Book of Astronomy). 13th century.",
  year: 1277,
};

// ═══════════════════════════════════════════════════════════════════════════
// TRADITIONAL SOURCES
// ═══════════════════════════════════════════════════════════════════════════

export const VEDIC_TRADITION: Citation = {
  id: "vedic-tradition",
  category: "traditional",
  shortLabel: "Vedic",
  fullCitation:
    "Vedic astrological tradition (Jyotish). Consolidated from Brihat Parashara Hora Shastra and related texts.",
};

export const CHALDEAN_TRADITION: Citation = {
  id: "chaldean-tradition",
  category: "traditional",
  shortLabel: "Chaldean",
  fullCitation:
    "Chaldean numerological tradition. Mesopotamian origins, c. 4000 BCE.",
};

export const HERMETIC_TRADITION: Citation = {
  id: "hermetic-tradition",
  category: "traditional",
  shortLabel: "Hermetic",
  fullCitation:
    "Hermetic tradition. Corpus Hermeticum and related Alexandrian texts, c. 100-300 CE.",
};

export const AGRIPPA_OCCULT_PHILOSOPHY: Citation = {
  id: "agrippa-occult-philosophy",
  category: "traditional",
  shortLabel: "Agrippa",
  fullCitation:
    "Agrippa, Heinrich Cornelius. Three Books of Occult Philosophy. 1533.",
  year: 1533,
};

export const KABBALAH_TRADITION: Citation = {
  id: "kabbalah-tradition",
  category: "traditional",
  shortLabel: "Kabbalah",
  fullCitation:
    "Kabbalistic tradition. Sefer Yetzirah and related mystical texts.",
};

// ═══════════════════════════════════════════════════════════════════════════
// PRACTITIONER SOURCES
// ═══════════════════════════════════════════════════════════════════════════

export const MODERN_WESTERN_CONSENSUS: Citation = {
  id: "modern-western-consensus",
  category: "practitioner",
  shortLabel: "Modern",
  fullCitation:
    "Modern Western astrological consensus. Synthesized from contemporary practice and education.",
};

export const PSYCHOLOGICAL_ASTROLOGY: Citation = {
  id: "psychological-astrology",
  category: "practitioner",
  shortLabel: "Psychological",
  fullCitation:
    "Psychological astrology school. Influenced by Jung, developed mid-20th century.",
};

// ═══════════════════════════════════════════════════════════════════════════
// WAVEPOINT SYNTHESIS
// ═══════════════════════════════════════════════════════════════════════════

export const WAVEPOINT_SYNTHESIS: Citation = {
  id: "wavepoint-synthesis",
  category: "wavepoint",
  shortLabel: "WavePoint",
  fullCitation:
    "WavePoint Synthesis Framework. Our integration of numerology, astrology, and sacred geometry.",
};

// ═══════════════════════════════════════════════════════════════════════════
// CITATION COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * All available citations indexed by ID.
 */
export const CITATIONS: Record<string, Citation> = {
  [PTOLEMY_TETRABIBLOS.id]: PTOLEMY_TETRABIBLOS,
  [LILLY_CHRISTIAN_ASTROLOGY.id]: LILLY_CHRISTIAN_ASTROLOGY,
  [ARROYO_ASTROLOGY_PSYCHOLOGY.id]: ARROYO_ASTROLOGY_PSYCHOLOGY,
  [HAND_HOROSCOPE_SYMBOLS.id]: HAND_HOROSCOPE_SYMBOLS,
  [GREENE_SATURN.id]: GREENE_SATURN,
  [RUDHYAR_ASTROLOGY_PERSONALITY.id]: RUDHYAR_ASTROLOGY_PERSONALITY,
  [VEDIC_TRADITION.id]: VEDIC_TRADITION,
  [CHALDEAN_TRADITION.id]: CHALDEAN_TRADITION,
  [HERMETIC_TRADITION.id]: HERMETIC_TRADITION,
  [AGRIPPA_OCCULT_PHILOSOPHY.id]: AGRIPPA_OCCULT_PHILOSOPHY,
  [KABBALAH_TRADITION.id]: KABBALAH_TRADITION,
  [MODERN_WESTERN_CONSENSUS.id]: MODERN_WESTERN_CONSENSUS,
  [PSYCHOLOGICAL_ASTROLOGY.id]: PSYCHOLOGICAL_ASTROLOGY,
  [WAVEPOINT_SYNTHESIS.id]: WAVEPOINT_SYNTHESIS,
  // Node-specific citations
  [REINHART_CHIRON.id]: REINHART_CHIRON,
  [GEORGE_LILITH.id]: GEORGE_LILITH,
  [SCHULMAN_NODES.id]: SCHULMAN_NODES,
  [SPILLER_NODES.id]: SPILLER_NODES,
  [ARABIC_PARTS_TRADITION.id]: ARABIC_PARTS_TRADITION,
  [BONATTI_LIBER_ASTRONOMIAE.id]: BONATTI_LIBER_ASTRONOMIAE,
};

/**
 * Get a citation by ID.
 */
export function getCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}

/**
 * Get multiple citations by IDs.
 */
export function getCitations(ids: string[]): Citation[] {
  return ids.map((id) => CITATIONS[id]).filter((c): c is Citation => !!c);
}
