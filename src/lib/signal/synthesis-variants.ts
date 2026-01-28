/**
 * Sentence variants for context-aware synthesis interpretations.
 *
 * Provides deterministic variation using hash-based selection so the same
 * sighting always produces the same output, but different sightings get
 * different phrasings.
 *
 * @module signal/synthesis-variants
 */

// =============================================================================
// Hash-based Variant Selection
// =============================================================================

/**
 * Deterministically pick a variant using a hash of the sighting ID.
 * Same sighting ID always returns the same variant.
 */
export function pickVariant(sightingId: string, variants: string[]): string {
  if (variants.length === 0) return "";
  if (variants.length === 1) return variants[0]!;

  let hash = 0;
  for (let i = 0; i < sightingId.length; i++) {
    const char = sightingId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % variants.length;
  return variants[index]!;
}

// =============================================================================
// Mood Sentences
// =============================================================================

export const MOOD_SENTENCES: Record<string, string[]> = {
  calm: [
    "Your calm presence creates space for this message to land clearly.",
    "In stillness, the meaning of this number settles into focus.",
  ],
  energized: [
    "Your heightened energy amplifies the signal you're receiving right now.",
    "This number arrived while your vitality is running high — channel it.",
  ],
  reflective: [
    "Your reflective state allows you to receive this message at a deeper level.",
    "Introspection sharpens the lens through which this number speaks.",
  ],
  anxious: [
    "Even amid unease, this number appears as a grounding point — something to anchor to.",
    "Anxiety can heighten awareness. This number may be pointing toward what needs attention.",
  ],
  grateful: [
    "Gratitude opens the channel — this number lands with extra clarity when you're in this space.",
    "Your thankful heart amplifies the resonance of what you're seeing.",
  ],
  inspired: [
    "Inspiration and synchronicity often travel together. This number confirms the creative current you're feeling.",
    "Your inspired state is the perfect context for receiving this signal.",
  ],
  curious: [
    "Curiosity is the right response. This number invites further exploration.",
    "Your questioning mind is exactly what this moment calls for.",
  ],
  hopeful: [
    "Hope and this number share a frequency — both point toward what's forming.",
    "Your hopeful outlook aligns with the forward energy of this pattern.",
  ],
  peaceful: [
    "Peace allows the subtlest signals to register. This number speaks softly but clearly.",
    "From a place of peace, the meaning of this number unfolds naturally.",
  ],
  confused: [
    "Confusion often precedes clarity. This number may be the first thread to pull.",
    "Not everything needs to make sense immediately. Let this number sit with you.",
  ],
  excited: [
    "Your excitement resonates with the energy this number carries.",
    "High spirits and this number share a wavelength — something is aligning.",
  ],
  uncertain: [
    "Uncertainty is honest. This number arrives not to resolve doubt but to offer a compass point.",
    "In the space between knowing and not-knowing, this number provides a reference point.",
  ],
};

// =============================================================================
// Note Acknowledgment Sentences
// =============================================================================

export const NOTE_SENTENCES: string[] = [
  "The context you captured — your own words about this moment — adds a personal layer to this reading.",
  "Your note grounds this sighting in lived experience, giving the number a specific anchor.",
  "What you wrote down matters. The details you noticed are part of the signal.",
];

// =============================================================================
// Count Context Sentences
// =============================================================================

export const FIRST_CATCH_SENTENCES: string[] = [
  "This is your first encounter with this number. Pay attention to where you are and what you're thinking — first sightings often set the tone for the pattern ahead.",
  "A first sighting carries a particular charge. This number is introducing itself to your awareness.",
];

export const REPEAT_SIGHTING_SENTENCES: string[] = [
  "This number has appeared in your field before. Recurring patterns deepen their message with each encounter.",
  "You've seen this number before — and it's back. Repetition is how patterns establish themselves in your practice.",
];

// =============================================================================
// Moon Phase Sentences
// =============================================================================

export const MOON_SENTENCES: Record<string, string[]> = {
  new_moon: [
    "Under the new moon, this number carries the energy of seeds planted in darkness.",
    "The new moon amplifies intentions. This number arrives at a potent moment for setting direction.",
  ],
  waxing_crescent: [
    "The waxing crescent supports emerging momentum. This number aligns with what's beginning to take shape.",
    "Early growth energy colors this sighting — something is building.",
  ],
  first_quarter: [
    "The first quarter moon brings a moment of decision. This number may illuminate which way to lean.",
    "Half-lit and half-shadowed, the quarter moon asks for commitment. This number supports that clarity.",
  ],
  waxing_gibbous: [
    "The waxing gibbous moon carries the energy of refinement. This number arrives as things near completion.",
    "Almost full, the moon suggests your efforts are approaching fruition. This number confirms the trajectory.",
  ],
  full_moon: [
    "Under the full moon, this number arrives with maximum clarity and illumination.",
    "The full moon amplifies everything. This number's message is at peak intensity right now.",
  ],
  waning_gibbous: [
    "The waning gibbous invites gratitude and sharing. This number aligns with that generous energy.",
    "As the moon begins to release, this number speaks to what you can now share or teach.",
  ],
  last_quarter: [
    "The last quarter moon supports release and forgiveness. This number may point to what's ready to be let go.",
    "Half the moon is dark now, and this number arrives in that liminal space between holding and releasing.",
  ],
  waning_crescent: [
    "The waning crescent whispers of rest and surrender. This number arrives at a time for quiet integration.",
    "As the moon nears its darkest point, this number carries the energy of deep, quiet knowing.",
  ],
};
