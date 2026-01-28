/**
 * Mood modifiers.
 */

import type { MoodModifier } from "../../types";

const modifiers: MoodModifier[] = [
  {
    type: "mood",
    key: "calm",
    suffix:
      "Your centered state creates ideal conditions for receiving this message clearly. Stillness is its own form of intelligence — the signal lands differently when the inner waters are quiet.",
    transition: "In your current state of calm,",
    keywords: ["stillness", "clarity", "receptivity", "centering"],
  },
  {
    type: "mood",
    key: "energized",
    suffix:
      "Your heightened vitality amplifies whatever this number is pointing toward. High energy is momentum waiting for direction — let this pattern help you aim it.",
    transition: "With the energy you're carrying right now,",
    keywords: ["vitality", "momentum", "action", "direction"],
  },
  {
    type: "mood",
    key: "reflective",
    suffix:
      "Your introspective state opens deeper channels of understanding. When you're already looking inward, synchronicities tend to reveal their subtler layers.",
    transition: "In this reflective moment,",
    keywords: ["introspection", "depth", "understanding", "insight"],
  },
  {
    type: "mood",
    key: "anxious",
    suffix:
      "Anxiety sharpens awareness, even when it doesn't feel comfortable. This number may be pointing toward the very thing your nervous system is trying to process — not as a warning, but as an anchor point.",
    transition: "Even amid the unease you're feeling,",
    keywords: ["awareness", "grounding", "processing", "attention"],
  },
  {
    type: "mood",
    key: "grateful",
    suffix:
      "Gratitude and synchronicity share a frequency. When you're already in a state of appreciation, the messages that arrive tend to carry extra resonance and clarity.",
    transition: "With gratitude as your current lens,",
    keywords: ["appreciation", "resonance", "openness", "receptivity"],
  },
  {
    type: "mood",
    key: "inspired",
    suffix:
      "Inspiration and synchronicity often travel together. When the creative current is flowing, numbers become part of the larger pattern of ideas arriving at the right moment.",
    transition: "In this inspired state,",
    keywords: ["creativity", "flow", "vision", "alignment"],
  },
  {
    type: "mood",
    key: "curious",
    suffix:
      "Curiosity is the ideal posture for receiving these kinds of signals. The questioning mind doesn't force meaning — it allows meaning to emerge on its own terms.",
    transition: "With the curiosity you're bringing,",
    keywords: ["questioning", "openness", "exploration", "discovery"],
  },
  {
    type: "mood",
    key: "hopeful",
    suffix:
      "Hope orients your attention toward what's forming rather than what's dissolving. This number arrives while you're already facing the right direction — toward possibility.",
    transition: "Carried by the hope you're feeling,",
    keywords: ["possibility", "forward motion", "optimism", "trust"],
  },
  {
    type: "mood",
    key: "peaceful",
    suffix:
      "Peace allows the subtlest signals to register. In the absence of inner noise, this number's message can land with its full intended weight.",
    transition: "From this place of peace,",
    keywords: ["stillness", "presence", "receptivity", "depth"],
  },
  {
    type: "mood",
    key: "confused",
    suffix:
      "Confusion is often the threshold of new understanding — the mind reorganizing before a clearer picture forms. This number arrives not to add complexity but to offer a single point of orientation.",
    transition: "In the midst of what feels unclear,",
    keywords: ["threshold", "reorientation", "clarity emerging", "patience"],
  },
  {
    type: "mood",
    key: "excited",
    suffix:
      "Your excitement creates a kind of magnetic openness. When energy is high and forward-facing, synchronicities tend to confirm the direction you're already leaning toward.",
    transition: "With the excitement you're feeling,",
    keywords: ["energy", "magnetism", "confirmation", "momentum"],
  },
  {
    type: "mood",
    key: "uncertain",
    suffix:
      "Uncertainty isn't the absence of knowing — it's the space where new knowing is forming. This number arrives as a reference point, not an answer. Let it orient you without needing to resolve everything at once.",
    transition: "In this space of uncertainty,",
    keywords: ["orientation", "patience", "trust", "emergence"],
  },
];

export default modifiers;
