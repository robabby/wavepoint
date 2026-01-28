/**
 * Activity modifiers.
 */

import type { ActivityModifier } from "../../types";

const modifiers: ActivityModifier[] = [
  {
    type: "activity",
    key: "working",
    suffix:
      "Encountering this number during focused work suggests the message relates to your craft, vocation, or creative output. The professional sphere is where this energy wants to land right now.",
    transition: "As you move through your work,",
    keywords: ["vocation", "purpose", "craft", "focus"],
  },
  {
    type: "activity",
    key: "transit",
    suffix:
      "Numbers noticed while moving through the world carry the energy of transition itself. You're literally between places — and this pattern speaks to the space between where you've been and where you're going.",
    transition: "While you're in motion,",
    keywords: ["transition", "movement", "journey", "threshold"],
  },
  {
    type: "activity",
    key: "resting",
    suffix:
      "A number that finds you at rest speaks to the subconscious layers of your experience. In stillness, the signal arrives without the interference of activity — listen to what surfaces.",
    transition: "In your moment of rest,",
    keywords: ["stillness", "subconscious", "restoration", "receptivity"],
  },
  {
    type: "activity",
    key: "socializing",
    suffix:
      "Noticing this number while engaged with others suggests the message relates to your connections, community, or relational field. The people around you may be part of the pattern.",
    transition: "In the context of your social moment,",
    keywords: ["connection", "community", "relationships", "mirrors"],
  },
  {
    type: "activity",
    key: "other",
    suffix:
      "Whatever you're engaged in right now is the context this number wants to speak into. The specifics of your moment add a personal dimension that only you can interpret.",
    transition: "In the flow of your current activity,",
    keywords: ["context", "presence", "personal meaning", "awareness"],
  },
];

export default modifiers;
