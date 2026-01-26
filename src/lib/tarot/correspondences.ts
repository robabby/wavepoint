/**
 * Tarot-Archetype correspondences.
 *
 * Maps the 5 most obvious psychological connections between
 * Major Arcana cards and Jungian archetypes.
 */

import type { ArchetypeSlug } from "@/lib/archetypes";
import type { MajorArcanaSlug } from "./types";

/**
 * Bidirectional mapping between tarot cards and Jungian archetypes.
 * Only includes the 5 most psychologically obvious connections.
 */
export const TAROT_ARCHETYPE_MAP: Record<MajorArcanaSlug, ArchetypeSlug | undefined> = {
  "the-fool": "the-innocent",
  "the-magician": "the-magician",
  "the-high-priestess": undefined,
  "the-empress": "the-caregiver",
  "the-emperor": "the-ruler",
  "the-hierophant": undefined,
  "the-lovers": "the-lover",
  "the-chariot": undefined,
  "strength": undefined,
  "the-hermit": undefined,
  "wheel-of-fortune": undefined,
  "justice": undefined,
  "the-hanged-man": undefined,
  "death": undefined,
  "temperance": undefined,
  "the-devil": undefined,
  "the-tower": undefined,
  "the-star": undefined,
  "the-moon": undefined,
  "the-sun": undefined,
  "judgement": undefined,
  "the-world": undefined,
};

/**
 * Reverse mapping: Jungian archetype to tarot card
 */
export const ARCHETYPE_TAROT_MAP: Record<ArchetypeSlug, MajorArcanaSlug | undefined> = {
  "the-innocent": "the-fool",
  "the-orphan": undefined,
  "the-hero": undefined,
  "the-caregiver": "the-empress",
  "the-explorer": undefined,
  "the-rebel": undefined,
  "the-lover": "the-lovers",
  "the-creator": undefined,
  "the-jester": undefined,
  "the-sage": undefined,
  "the-magician": "the-magician",
  "the-ruler": "the-emperor",
};

/**
 * Get the linked Jungian archetype for a tarot card
 */
export function getLinkedArchetype(tarotSlug: MajorArcanaSlug): ArchetypeSlug | undefined {
  return TAROT_ARCHETYPE_MAP[tarotSlug];
}

/**
 * Get the linked tarot card for a Jungian archetype
 */
export function getLinkedTarotCard(archetypeSlug: ArchetypeSlug): MajorArcanaSlug | undefined {
  return ARCHETYPE_TAROT_MAP[archetypeSlug];
}

/**
 * Check if a tarot card has a linked Jungian archetype
 */
export function hasLinkedArchetype(tarotSlug: MajorArcanaSlug): boolean {
  return TAROT_ARCHETYPE_MAP[tarotSlug] !== undefined;
}

/**
 * Check if a Jungian archetype has a linked tarot card
 */
export function hasLinkedTarotCard(archetypeSlug: ArchetypeSlug): boolean {
  return ARCHETYPE_TAROT_MAP[archetypeSlug] !== undefined;
}
