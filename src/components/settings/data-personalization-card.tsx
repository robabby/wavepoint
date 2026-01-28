import { Sparkles, Calendar, Radio, Heart, Hexagon } from "lucide-react";

const DATA_TYPES = [
  {
    icon: Calendar,
    label: "Birth Data",
    description: "Powers your natal chart, transits, and cosmic calendar",
  },
  {
    icon: Radio,
    label: "Sightings",
    description: "Builds your pattern insights and frequency trends",
  },
  {
    icon: Heart,
    label: "Resonance",
    description: "Refines interpretations based on what resonates with you",
  },
  {
    icon: Hexagon,
    label: "Geometry Affinities",
    description: "Shapes your sacred geometry profile and recommendations",
  },
];

export function DataPersonalizationCard() {
  return (
    <div className="rounded-xl border border-[var(--border-gold)]/20 bg-card/30 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--color-gold)]" />
        <p className="text-sm font-medium text-foreground">
          How your data personalizes WavePoint
        </p>
      </div>
      <div className="space-y-3">
        {DATA_TYPES.map(({ icon: Icon, label, description }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
