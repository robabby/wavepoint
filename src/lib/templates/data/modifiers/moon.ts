/**
 * Moon phase modifiers.
 */

import type { MoonModifier } from "../../types";

const modifiers: MoonModifier[] = [
  {
    type: "moon",
    key: "new_moon",
    suffix:
      "This dark moon phase invites you to plant seeds of intention in the fertile void. What you're experiencing now is a cosmic reset point — a chance to begin again with fresh perspective and renewed commitment to your path.",
    transition: "Under tonight's new moon,",
    keywords: ["new beginnings", "intention", "inner work", "potential", "reset"],
  },
  {
    type: "moon",
    key: "waxing_crescent",
    suffix:
      "As the moon begins to show its first sliver of light, you're in the germination phase of a new cycle. The energy supports taking initial steps, clarifying your vision, and building momentum toward what you're calling in.",
    transition: "During this waxing crescent phase,",
    keywords: ["momentum", "clarification", "first steps", "growth", "emergence"],
  },
  {
    type: "moon",
    key: "first_quarter",
    suffix:
      "The moon stands at half-strength, illuminating the tension between intention and action. This message arrives at a decision point, asking you to commit fully and push through any resistance keeping you from your next level of growth.",
    transition: "As the moon reaches its first quarter,",
    keywords: ["decision", "commitment", "action", "tension", "breakthrough"],
  },
  {
    type: "moon",
    key: "waxing_gibbous",
    suffix:
      "With the moon nearly full, you're in a period of refinement and adjustment. What you're seeing now asks you to fine-tune your approach, trust the process, and prepare for the culmination just ahead.",
    transition: "In this waxing gibbous phase,",
    keywords: ["refinement", "adjustment", "preparation", "patience"],
  },
  {
    type: "moon",
    key: "full_moon",
    suffix:
      "The full moon illuminates everything, bringing clarity, revelation, and emotional intensity. This synchronicity arrives at peak energy — what's been hidden becomes visible, and what's been building reaches its fullness.",
    transition: "Under the light of the full moon,",
    keywords: ["illumination", "revelation", "completion", "harvest", "clarity"],
  },
  {
    type: "moon",
    key: "waning_gibbous",
    suffix:
      "As the moon begins to release its fullness, you're entering a phase of gratitude and integration. This message invites you to metabolize recent experiences, share what you've learned, and begin releasing what no longer serves.",
    transition: "In this waning gibbous phase,",
    keywords: ["gratitude", "integration", "sharing", "processing"],
  },
  {
    type: "moon",
    key: "last_quarter",
    suffix:
      "The moon returns to half-light, but now in release rather than building. What you're experiencing asks you to let go consciously, forgive, and clear space for the new cycle ahead. This is active surrender, not passive defeat.",
    transition: "As the moon reaches its last quarter,",
    keywords: ["release", "letting go", "forgiveness", "clearing", "surrender"],
  },
  {
    type: "moon",
    key: "waning_crescent",
    suffix:
      "In the final sliver before darkness, the moon invites deep rest and spiritual composting. This synchronicity arrives in the balsamic phase, asking you to retreat, reflect, and trust the wisdom of endings.",
    transition: "During this waning crescent phase,",
    keywords: ["rest", "reflection", "completion", "wisdom", "preparation"],
  },
];

export default modifiers;
