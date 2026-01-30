"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { toAstroChartData } from "@/lib/astrology";
import { EASE_EMERGENCE, TIMING } from "@/lib/animation-constants";
import type { StoredChartData } from "@/lib/profile/types";

const MAX_SIZE = 420;

const CHART_SETTINGS = {
  COLOR_BACKGROUND: "transparent",
  POINTS_COLOR: "#d4a84b",
  SIGNS_COLOR: "#d4a84b",
  CIRCLE_COLOR: "rgba(212,168,75,0.3)",
  LINE_COLOR: "#5c4d3d",
  CUSPS_FONT_COLOR: "#8a7355",
  SYMBOL_AXIS_FONT_COLOR: "#d4a84b",
  COLOR_ARIES: "#d4a84b",
  COLOR_TAURUS: "#d4a84b",
  COLOR_GEMINI: "#d4a84b",
  COLOR_CANCER: "#d4a84b",
  COLOR_LEO: "#d4a84b",
  COLOR_VIRGO: "#d4a84b",
  COLOR_LIBRA: "#d4a84b",
  COLOR_SCORPIO: "#d4a84b",
  COLOR_SAGITTARIUS: "#d4a84b",
  COLOR_CAPRICORN: "#d4a84b",
  COLOR_AQUARIUS: "#d4a84b",
  COLOR_PISCES: "#d4a84b",
  STROKE_ONLY: true,
  SYMBOL_SCALE: 0.8,
};

interface NatalChartProps {
  chartData: StoredChartData;
}

export function NatalChart({ chartData }: NatalChartProps) {
  const reactId = useId();
  const containerId = `natal-chart-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(MAX_SIZE);

  // Responsive sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? MAX_SIZE;
      setSize(Math.min(width, MAX_SIZE));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Render chart
  useEffect(() => {
    const target = document.getElementById(containerId);
    if (!target || size === 0) return;

    let cancelled = false;

    void import("@astrodraw/astrochart").then(({ Chart }) => {
      if (cancelled) return;
      target.innerHTML = "";
      const data = toAstroChartData(chartData);
      const chart = new Chart(containerId, size, size, CHART_SETTINGS);
      const radix = chart.radix(data);
      radix.aspects();
    });

    return () => {
      cancelled = true;
      if (target) target.innerHTML = "";
    };
  }, [chartData, containerId, size]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: TIMING.emergence, ease: EASE_EMERGENCE }}
      ref={containerRef}
      className="mb-8 flex justify-center"
    >
      <div className="rounded-2xl border border-[var(--color-gold)]/20 bg-[var(--glass-bg)] p-4 shadow-[0_0_40px_rgba(212,168,75,0.06)]">
        <div id={containerId} />
      </div>
    </motion.div>
  );
}
