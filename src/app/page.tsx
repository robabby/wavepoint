"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleDot, Hash, Sparkles, Search, ArrowRight } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { ROUTES } from "@/util/routes";
import { Separator } from "@/components/ui/separator";
import { AnimatedHero, AnimatedHeroItem } from "@/components/animated-hero";
import { StaggerChildren, StaggerItem } from "@/components/stagger-children";
import { AnimatedCard, GeometryImage } from "@/components/animated-card";
import { cn } from "@/lib/utils";
import { isSignalEnabled } from "@/lib/signal/feature-flags";
import { WaitlistModal } from "@/components/signal/waitlist-modal";
import {
  getGeometryBySlug,
  getGeometryPath,
} from "@/lib/data";

// Featured geometries for the hub card
const featuredGeometries = [
  { slug: "tetrahedron", label: "Tetrahedron" },
  { slug: "flower-of-life", label: "Flower of Life" },
  { slug: "golden-ratio", label: "Golden Ratio" },
];

// Featured angel numbers
const featuredNumbers = ["111", "222", "333"];

export default function HomePage() {
  const router = useRouter();
  const signalEnabled = isSignalEnabled();
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <AnimatedHero className="min-h-[50vh] sm:min-h-[60vh]">
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-12 sm:min-h-[60vh] sm:gap-8 sm:px-6 lg:px-8">
          {/* Headline */}
          <AnimatedHeroItem>
            <div className="flex items-center gap-3 sm:gap-4">
              <CircleDot className="h-8 w-8 text-[var(--color-gold)] sm:h-10 sm:w-10" />
              <h1 className="font-display text-hero tracking-tight text-foreground">
                WAVE<span className="text-[var(--color-gold)]">POINT</span>
              </h1>
              <CircleDot className="h-8 w-8 text-[var(--color-gold)] sm:h-10 sm:w-10" />
            </div>
          </AnimatedHeroItem>

          {/* Subheading */}
          <AnimatedHeroItem>
            <p className="font-heading max-w-xl px-4 text-center text-lg text-muted-foreground sm:text-xl">
              Explore the language of the universe
            </p>
          </AnimatedHeroItem>

          {/* Search Trigger */}
          <AnimatedHeroItem>
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                });
                document.dispatchEvent(event);
              }}
              className={cn(
                "group flex w-full max-w-md items-center gap-3 rounded-lg px-4 py-3 sm:px-5 sm:py-4",
                // Glass background
                "bg-[var(--glass-bg)] backdrop-blur-xl",
                // Gold border
                "border border-[var(--glass-border)]",
                // Transitions
                "transition-all duration-300",
                // Hover state with glow
                "hover:border-[var(--color-gold)] hover:shadow-[0_0_20px_var(--glow-gold)]"
              )}
            >
              <Search className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-[var(--color-gold)]" />
              <span className="flex-1 text-left text-sm text-muted-foreground sm:text-base">
                Search patterns, numbers, geometries...
              </span>
              <kbd className="hidden rounded bg-muted px-2 py-1 text-xs text-muted-foreground sm:inline-block">
                ⌘K
              </kbd>
            </button>
          </AnimatedHeroItem>
        </div>
      </AnimatedHero>

      <Separator className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />

      {/* Hub Section */}
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <StaggerChildren
          className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.15}
        >
          {/* Geometries Card */}
          <StaggerItem>
            <Link href={ROUTES.geometries.path} className="group block h-full">
              <AnimatedCard className="flex h-full flex-col p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
                    <CircleDot className="h-5 w-5 text-[var(--color-gold)]" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    Sacred Geometry
                  </h2>
                </div>

                <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                  Discover the mathematical principles that form the foundation of our universe
                </p>

                {/* Featured Items - using buttons to avoid nested <a> tags */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {featuredGeometries.map(({ slug, label }) => {
                    const geometry = getGeometryBySlug(slug);
                    if (!geometry) return null;
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(getGeometryPath(geometry));
                        }}
                        className="group/item flex items-center gap-2 rounded-lg border border-[var(--border-gold)]/50 bg-card/50 px-3 py-2 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
                      >
                        <GeometryImage className="relative h-6 w-6">
                          <Image
                            src={geometry.images?.heroImage ?? ""}
                            alt={label}
                            fill
                            sizes="24px"
                            className="object-contain svg-gold"
                          />
                        </GeometryImage>
                        <span className="text-xs text-muted-foreground transition-colors group-hover/item:text-[var(--color-gold)]">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[var(--border-gold)] text-[var(--color-gold)] transition-all group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)]/10"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </AnimatedCard>
            </Link>
          </StaggerItem>

          {/* Numbers Card */}
          <StaggerItem>
            <Link href={ROUTES.numbers.path} className="group block h-full">
              <AnimatedCard className="flex h-full flex-col p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
                    <Hash className="h-5 w-5 text-[var(--color-gold)]" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                    Number Sequences
                  </h2>
                </div>

                <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                  Explore the meanings behind repeating number patterns
                </p>

                {/* Featured Numbers - using buttons to avoid nested <a> tags */}
                <div className="mb-6 flex flex-wrap gap-3">
                  {featuredNumbers.map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`${ROUTES.numbers.path}/${number}`);
                      }}
                      className="group/item flex items-center justify-center rounded-lg border border-[var(--border-gold)]/50 bg-card/50 px-4 py-2 transition-all hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)]/10"
                    >
                      <span className="font-mono text-lg font-semibold text-muted-foreground transition-colors group-hover/item:text-[var(--color-gold)]">
                        {number}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-[var(--border-gold)] text-[var(--color-gold)] transition-all group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)]/10"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Discover
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </AnimatedCard>
            </Link>
          </StaggerItem>

          {/* Signal Card - always shown, different states based on feature flag */}
          <StaggerItem>
            {signalEnabled ? (
              <Link href="/signal" className="group block h-full">
                <AnimatedCard className="flex h-full flex-col p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
                      <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                      Signal
                    </h2>
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                    Track your number sightings and discover personal patterns
                  </p>

                  {/* Feature highlight */}
                  <div className="mb-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Record synchronicities
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Get AI-powered interpretations
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Track patterns over time
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Button
                      asChild
                      className="w-full bg-[var(--color-gold)] text-primary-foreground transition-all hover:bg-[var(--color-gold-bright)]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </div>
                </AnimatedCard>
              </Link>
            ) : (
              <div className="group block h-full">
                <AnimatedCard className="flex h-full flex-col p-6 sm:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-gold)]/10">
                        <Sparkles className="h-5 w-5 text-[var(--color-gold)]" />
                      </div>
                      <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                        Signal
                      </h2>
                    </div>
                    <span className="rounded-full bg-[var(--color-gold)]/10 px-2.5 py-0.5 text-xs font-medium tracking-wide text-[var(--color-gold)]">
                      Coming Soon
                    </span>
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                    Track your number sightings and discover personal patterns
                  </p>

                  {/* Feature highlight */}
                  <div className="mb-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Record synchronicities
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Get AI-powered interpretations
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      Track patterns over time
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWaitlistOpen(true)}
                    className="mt-auto block w-full text-left"
                  >
                    <Button
                      asChild
                      className="w-full bg-[var(--color-gold)] text-primary-foreground transition-all hover:bg-[var(--color-gold-bright)]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Join Waitlist
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </button>
                </AnimatedCard>
              </div>
            )}
          </StaggerItem>
        </StaggerChildren>
      </div>

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
}
