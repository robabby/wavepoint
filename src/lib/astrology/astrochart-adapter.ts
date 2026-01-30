/**
 * Adapter to convert StoredChartData into the format expected by @astrodraw/astrochart.
 */

import type { CelestialBodyId } from "./constants";
import type { StoredChartData } from "@/lib/profile/types";

/** Data shape expected by the astrochart library's radix() method. */
export interface AstroChartData {
  planets: Record<string, number[]>;
  cusps: number[];
}

const PLANET_NAME_MAP: Partial<Record<CelestialBodyId, string>> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  chiron: "Chiron",
  lilith: "Lilith",
  northnode: "NNode",
};

/**
 * Convert StoredChartData to the format @astrodraw/astrochart expects.
 */
export function toAstroChartData(chart: StoredChartData): AstroChartData {
  const planets: Record<string, number[]> = {};

  for (const [id, planet] of Object.entries(chart.planets)) {
    const name = PLANET_NAME_MAP[id as CelestialBodyId];
    if (!name) continue;
    planets[name] = planet.isRetrograde
      ? [planet.position.longitude, -1]
      : [planet.position.longitude];
  }

  const cusps = [...chart.houses]
    .sort((a, b) => a.number - b.number)
    .map((h) => h.position.longitude);

  return { planets, cusps };
}
