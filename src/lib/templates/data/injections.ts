/**
 * Pattern injection templates.
 */

import type { PatternInjection } from "../types";

const injections: PatternInjection[] = [
  {
    patternType: "peak_hour",
    template:
      "You tend to notice numbers most during {{label}}, with {{percentage}}% of your sightings clustered around that window. This number arriving now is part of that rhythm.",
    minDataPoints: 5,
  },
  {
    patternType: "top_mood",
    template:
      "When you're feeling {{mood}}, {{number}} tends to surface — {{percentage}}% of those sightings carry that emotional signature. Your inner state and this pattern are linked.",
    minDataPoints: 5,
  },
  {
    patternType: "frequency_trend",
    template:
      "Your sighting frequency is {{trend}}, averaging {{averagePerDay}} per day with a {{percentageChange}}% shift recently. The pace of your practice is part of the message.",
    minDataPoints: 7,
  },
  {
    patternType: "favorite_number",
    template:
      "Of all the numbers that find you, {{number}} appears most often — {{count}} times and counting. There's a reason this pattern keeps returning to your awareness.",
    minDataPoints: 10,
  },
  {
    patternType: "streak",
    template:
      "You've been noticing numbers for {{days}} consecutive days. Sustained attention creates its own kind of signal — your practice is building something.",
    minDataPoints: 3,
  },
  {
    patternType: "day_pattern",
    template:
      "Your sightings tend to cluster on {{day}}, with {{percentage}}% of your captures happening then. This weekly rhythm adds another dimension to your practice.",
    minDataPoints: 10,
  },
  {
    patternType: "element_correlation",
    template:
      "Numbers associated with {{element}} energy appear in {{percentage}}% of your sightings — your practice has an elemental signature worth noticing.",
    minDataPoints: 10,
  },
  {
    patternType: "moon_correlation",
    template:
      "You're most attuned during the {{phase}} moon, with {{percentage}}% of your sightings falling in that lunar window. The cosmos and your awareness are synced.",
    minDataPoints: 10,
  },
];

export default injections;
