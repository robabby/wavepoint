/**
 * Element modifiers.
 */

import type { ElementModifier } from "../../types";

const modifiers: ElementModifier[] = [
  {
    type: "element",
    key: "fire",
    suffix:
      "Your fire-dominant nature means this message lands with urgency and creative force. You're wired to act on what you see — and this number is fuel for your natural initiative. Channel the spark without burning through the insight too quickly.",
    transition: "With fire as your dominant element,",
    keywords: ["initiative", "passion", "action", "creative force", "urgency"],
  },
  {
    type: "element",
    key: "water",
    suffix:
      "Your water-dominant nature processes this message through feeling and intuition first. You'll understand this number emotionally before you understand it intellectually — trust that sequence. The depths hold what the surface can't show.",
    transition: "With water as your dominant element,",
    keywords: ["intuition", "emotion", "depth", "flow", "feeling"],
  },
  {
    type: "element",
    key: "earth",
    suffix:
      "Your earth-dominant nature grounds this message in practical reality. You'll naturally ask what this number means in tangible terms — and that instinct serves you well. Look for where this energy meets your material world.",
    transition: "With earth as your dominant element,",
    keywords: ["practicality", "grounding", "tangible", "material", "stability"],
  },
  {
    type: "element",
    key: "air",
    suffix:
      "Your air-dominant nature processes this message through thought, pattern, and connection. You'll see the links between this number and your broader understanding before others would — follow those threads. Ideas are your native language.",
    transition: "With air as your dominant element,",
    keywords: ["thought", "connection", "pattern", "communication", "ideas"],
  },
];

export default modifiers;
