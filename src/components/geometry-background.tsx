"use client";

import { motion } from "motion/react";
import Image from "next/image";

interface GeometryBackgroundProps {
  className?: string;
}

export function GeometryBackground({ className }: GeometryBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Rotating Flower of Life pattern */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          width: "min(120vw, 1000px)",
          height: "min(120vw, 1000px)",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 120, // 2 minutes for full rotation - very slow
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <Image
          src="/images/geometries/patterns/flower-of-life/flower-of-life-primary.svg"
          alt=""
          fill
          className="object-contain opacity-[0.08]"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(76%) sepia(30%) saturate(500%) hue-rotate(5deg) brightness(95%) contrast(90%)",
          }}
          priority
        />
      </motion.div>
    </div>
  );
}
