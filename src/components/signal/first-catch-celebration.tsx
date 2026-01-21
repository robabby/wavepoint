"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PARTICLE_COLORS } from "./animation-config";

const PARTICLE_COUNT = 24;

export interface FirstCatchCelebrationProps {
  number: string;
  onDismiss: () => void;
}

/**
 * Full-screen celebration for first-time number catches.
 * Features particle burst animation and badge reveal.
 */
export function FirstCatchCelebration({
  number,
  onDismiss,
}: FirstCatchCelebrationProps) {
  const [showBadge, setShowBadge] = useState(false);

  // Generate particles once
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);

  useEffect(() => {
    // Show badge after particles settle
    const timer = setTimeout(() => setShowBadge(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDismiss}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-label="First catch celebration"
    >
      {/* Particle burst */}
      <ParticleBurst particles={particles} />

      {/* Badge reveal */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)] text-[var(--color-gold)] text-sm font-heading tracking-widest uppercase">
              First Catch
            </span>
            <p className="mt-6 text-5xl font-display text-foreground">
              {number}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Tap anywhere to continue
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360,
    distance: 100 + Math.random() * 100,
    size: 4 + Math.random() * 4,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]!,
    delay: Math.random() * 0.2,
  }));
}

function ParticleBurst({ particles }: { particles: Particle[] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance + 50, // drift down
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
