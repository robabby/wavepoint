"use client";

import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import type { ElementBalance as ElementBalanceType } from "@/lib/profile";
import { AnimatedCard } from "@/components/animated-card";

interface ElementBalanceProps {
  elementBalance: ElementBalanceType;
}

const ELEMENT_CONFIG = {
  fire: { symbol: "\uD83D\uDD25", color: "var(--color-fire, #f97316)", label: "Fire", geometry: "/platonic-solids/tetrahedron" },
  earth: { symbol: "\uD83C\uDF0D", color: "var(--color-earth, #84cc16)", label: "Earth", geometry: "/platonic-solids/hexahedron" },
  air: { symbol: "\uD83D\uDCA8", color: "var(--color-air, #06b6d4)", label: "Air", geometry: "/platonic-solids/octahedron" },
  water: { symbol: "\uD83D\uDCA7", color: "var(--color-water, #3b82f6)", label: "Water", geometry: "/platonic-solids/icosahedron" },
} as const;

/**
 * Horizontal bar chart showing element distribution.
 */
export function ElementBalance({ elementBalance }: ElementBalanceProps) {
  const maxValue = Math.max(
    elementBalance.fire,
    elementBalance.earth,
    elementBalance.air,
    elementBalance.water,
    1 // Prevent division by zero
  );

  return (
    <AnimatedCard className="p-6">
      <Heading size="4" className="mb-6 font-display text-[var(--color-gold)]">
        Element Balance
      </Heading>

      <div className="space-y-4">
        {(["fire", "earth", "air", "water"] as const).map((element) => {
          const config = ELEMENT_CONFIG[element];
          const value = elementBalance[element];
          const percentage = (value / maxValue) * 100;
          const isDominant = elementBalance.dominant === element;

          return (
            <div key={element} className="flex items-center gap-3">
              <span className="w-6 text-center text-lg">{config.symbol}</span>
              <span className="w-12 text-sm text-muted-foreground">{config.label}</span>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: config.color,
                      opacity: isDominant ? 1 : 0.6,
                    }}
                  />
                </div>
              </div>
              <span className={`w-6 text-right text-sm ${isDominant ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {elementBalance.dominant && (
        <Text size="2" className="mt-4 text-muted-foreground">
          Dominant element:{" "}
          <Link
            href={ELEMENT_CONFIG[elementBalance.dominant].geometry}
            className="font-medium capitalize text-foreground underline decoration-[var(--color-gold)]/30 underline-offset-4 transition-colors hover:text-[var(--color-gold)] hover:decoration-[var(--color-gold)]"
          >
            {elementBalance.dominant}
          </Link>
        </Text>
      )}

      <Text size="1" className="mt-2 text-muted-foreground/60">
        Based on Sun, Moon, Rising (2 pts each) + Mercury through Saturn (1 pt each)
      </Text>
    </AnimatedCard>
  );
}
