"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface TarotCardFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Art Nouveau-inspired ornate border frame for tarot cards.
 * Uses SVG for decorative gold gradient border with corner flourishes.
 */
export function TarotCardFrame({ children, className, style }: TarotCardFrameProps) {
  return (
    <div className={cn("relative", className)} style={style}>
      {/* SVG frame with Art Nouveau styling */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gold gradient for main border */}
          <linearGradient id="tarotGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(232, 192, 104)" />
            <stop offset="50%" stopColor="rgb(212, 168, 75)" />
            <stop offset="100%" stopColor="rgb(168, 134, 60)" />
          </linearGradient>

          {/* Shimmer gradient for hover effect */}
          <linearGradient id="tarotShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(232, 192, 104)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(255, 220, 140)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(232, 192, 104)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer decorative border */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          fill="none"
          stroke="url(#tarotGoldGradient)"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Inner border for depth */}
        <rect
          x="5"
          y="5"
          width="calc(100% - 10px)"
          height="calc(100% - 10px)"
          rx="8"
          fill="none"
          stroke="rgb(212, 168, 75)"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Top-left corner flourish */}
        <path
          d="M 8 20 Q 8 8 20 8"
          stroke="url(#tarotGoldGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="8" cy="20" r="2" fill="rgb(212, 168, 75)" fillOpacity="0.6" />
        <circle cx="20" cy="8" r="2" fill="rgb(212, 168, 75)" fillOpacity="0.6" />

        {/* Top-right corner flourish */}
        <path
          d="M calc(100% - 8px) 20 Q calc(100% - 8px) 8 calc(100% - 20px) 8"
          stroke="url(#tarotGoldGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="calc(100% - 8px)" cy="20" r="2" fill="rgb(212, 168, 75)" fillOpacity="0.6" />
        <circle cx="calc(100% - 20px)" cy="8" r="2" fill="rgb(212, 168, 75)" fillOpacity="0.6" />

        {/* Bottom-left corner flourish */}
        <path
          d="M 8 calc(100% - 20px) Q 8 calc(100% - 8px) 20 calc(100% - 8px)"
          stroke="url(#tarotGoldGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="8"
          cy="calc(100% - 20px)"
          r="2"
          fill="rgb(212, 168, 75)"
          fillOpacity="0.6"
        />
        <circle
          cx="20"
          cy="calc(100% - 8px)"
          r="2"
          fill="rgb(212, 168, 75)"
          fillOpacity="0.6"
        />

        {/* Bottom-right corner flourish */}
        <path
          d="M calc(100% - 8px) calc(100% - 20px) Q calc(100% - 8px) calc(100% - 8px) calc(100% - 20px) calc(100% - 8px)"
          stroke="url(#tarotGoldGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="calc(100% - 8px)"
          cy="calc(100% - 20px)"
          r="2"
          fill="rgb(212, 168, 75)"
          fillOpacity="0.6"
        />
        <circle
          cx="calc(100% - 20px)"
          cy="calc(100% - 8px)"
          r="2"
          fill="rgb(212, 168, 75)"
          fillOpacity="0.6"
        />
      </svg>

      {/* Card content */}
      <div className="relative z-10 p-2">{children}</div>
    </div>
  );
}
