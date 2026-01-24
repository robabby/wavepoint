"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { AboutHero } from "@/components/about/about-hero";
import { BentoGrid } from "@/components/about/bento-grid";
import { PrivacyBand } from "@/components/about/privacy-band";
import { ROUTES } from "@/util/routes";
import { EASE_STANDARD } from "@/lib/animation-constants";
import { isSignalEnabled } from "@/lib/signal/feature-flags";

/**
 * About Page - Editorial Sacred design
 *
 * Sections:
 * 1. Hero - Split layout with Metatron's Cube
 * 2. Origin Story - Asymmetric text layout
 * 3. Features (Bento Grid) - What we build
 * 4. Privacy Band - Full-width dark section
 * 5. Philosophy + CTA - Minimal closing
 */

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_STANDARD,
    },
  },
};

// Drop cap component for origin story
function DropCap({ children }: { children: string }) {
  const firstLetter = children.charAt(0);
  const rest = children.slice(1);

  return (
    <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">
      <span className="float-left mr-3 mt-1 font-display text-5xl leading-[0.8] text-[var(--color-gold)] sm:mr-4 sm:text-6xl">
        {firstLetter}
      </span>
      {rest}
    </p>
  );
}

export default function AboutPage() {
  const signalEnabled = isSignalEnabled();

  // Determine CTA based on feature flags
  const ctaHref = signalEnabled ? "/signal" : ROUTES.sacredGeometry.path;
  const ctaText = signalEnabled ? "Start noticing" : "Explore the geometry";

  return (
    <div className="min-h-screen bg-background">
      {/* Section 1: Hero */}
      <AboutHero />

      {/* Section 2: Origin Story */}
      <section className="py-16 sm:py-20 lg:py-28">
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          {/* Centered content with gold accent border */}
          <div className="mx-auto max-w-2xl border-l-2 border-[var(--color-gold)]/30 pl-6 sm:pl-8">
            <DropCap>
              The ideas behind WavePoint grew from a simple observation: the same
              geometric forms appear everywhere — in honeycombs, in galaxies, in the
              proportions of Renaissance paintings. Patterns that humans have noticed
              for millennia, calling them sacred.
            </DropCap>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              We built WavePoint for people who want to explore these patterns without
              the noise. No breathless claims about manifesting abundance. No social
              feeds performing spirituality. Just geometry, context, and space to find
              your own meaning.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Gold separator */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="h-px"
          style={{
            background: "linear-gradient(to right, transparent, var(--color-gold)/40, transparent)",
          }}
        />
      </div>

      {/* Section 3: What We Build (Bento Grid) */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <h2 className="font-heading text-section text-foreground">
              What We Build
            </h2>
          </motion.div>

          <BentoGrid />
        </div>
      </section>

      {/* Section 4: Privacy Band */}
      <PrivacyBand />

      {/* Section 5: Philosophy + CTA */}
      <section className="py-20 sm:py-24 lg:py-32">
        <motion.div
          className="container mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
        >
          {/* Philosophy statement */}
          <p className="font-heading text-lg italic text-muted-foreground sm:text-xl">
            We follow a few principles: grounded over grandiose, invitation over
            instruction, craft over content.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Button
              asChild
              size="3"
              variant="outline"
              className="group border-[var(--color-gold)] text-[var(--color-gold)] transition-all hover:bg-[var(--color-gold)]/10"
            >
              <Link href={ctaHref} className="inline-flex items-center gap-2">
                {ctaText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
