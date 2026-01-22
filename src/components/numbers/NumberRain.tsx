"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useIsClient } from "@/hooks/use-is-client";

const PARTICLE_COUNT = 25;

// Angel number sequences - weighted toward meaningful patterns
const NUMBERS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "11", "22", "33", "44", "55", "66", "77", "88", "99",
  "111", "222", "333", "444", "555",
  "1111", "1234",
];

// Color configs with matching glow colors
const COLOR_CONFIGS = [
  { color: "var(--color-gold)", glow: "var(--glow-gold)" },
  { color: "var(--color-gold-muted)", glow: "rgba(166, 138, 60, 0.3)" },
  { color: "var(--color-copper)", glow: "var(--glow-copper)" },
  { color: "var(--color-bronze)", glow: "rgba(138, 115, 85, 0.25)" },
];

interface Particle {
  id: number;
  value: string;
  left: number;        // percentage - weighted to edges
  delay: number;       // seconds
  duration: number;    // seconds (15-28)
  opacity: number;     // 0.04-0.12
  fontSize: number;    // rem (0.75-2)
  blur: number;        // px (0-2)
  drift: number;       // horizontal drift vw
  rotation: number;    // degrees (-8 to 8)
  colorConfig: typeof COLOR_CONFIGS[number];
}

// Weight distribution toward edges to frame content
function getWeightedPosition(): number {
  const rand = Math.random();
  if (rand < 0.4) return 5 + Math.random() * 30;     // 5-35% (left edge)
  if (rand < 0.8) return 65 + Math.random() * 30;    // 65-95% (right edge)
  return 35 + Math.random() * 30;                     // 35-65% (occasional center)
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const fontSize = 0.75 + Math.random() * 1.25;
    // Larger = sharper (closer), smaller = blurrier (farther)
    const blur = fontSize < 1 ? 1 + Math.random() : fontSize < 1.5 ? Math.random() * 0.5 : 0;

    return {
      id: i,
      value: NUMBERS[Math.floor(Math.random() * NUMBERS.length)]!,
      left: getWeightedPosition(),
      delay: Math.random() * 15,           // Stagger over 15s
      duration: 15 + Math.random() * 13,   // 15-28s fall
      opacity: 0.01 + Math.random() * 0.04,
      fontSize,
      blur,
      drift: (Math.random() - 0.5) * 4,    // -2vw to +2vw
      rotation: (Math.random() - 0.5) * 16, // -8 to +8 degrees
      colorConfig: COLOR_CONFIGS[Math.floor(Math.random() * COLOR_CONFIGS.length)]!,
    };
  });
}

interface NumberRainProps {
  paused?: boolean;
  className?: string;
}

export function NumberRain({ paused = false, className }: NumberRainProps) {
  const prefersReducedMotion = useReducedMotion();
  const isClient = useIsClient();

  // Generate particles only on client to avoid hydration mismatch
  const particles = useMemo(
    () => (isClient ? generateParticles(PARTICLE_COUNT) : []),
    [isClient]
  );

  if (prefersReducedMotion || !isClient) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Fade in at top 10%, fade out at bottom 30%
        "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_70%,transparent_100%)]",
        className
      )}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-number-fall font-display select-none"
          style={{
            left: `${p.left}%`,
            color: p.colorConfig.color,
            opacity: p.opacity,
            fontSize: `${p.fontSize}rem`,
            filter: p.blur > 0 ? `blur(${p.blur}px)` : undefined,
            textShadow: `0 0 12px ${p.colorConfig.glow}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationPlayState: paused ? "paused" : "running",
            // Pass custom properties for keyframe animation
            "--drift": `${p.drift}vw`,
            "--rotation": `${p.rotation}deg`,
          } as React.CSSProperties}
        >
          {p.value}
        </span>
      ))}
    </div>
  );
}
