"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ROUTES } from "@/util/routes";

/**
 * Geometric divider SVG - a subtle line pattern
 */
function GeometricDivider() {
  return (
    <div className="flex items-center justify-center py-4 sm:py-6 lg:py-8">
      <svg
        width="200"
        height="20"
        viewBox="0 0 200 20"
        className="text-[var(--color-tarnished)]"
        aria-hidden="true"
      >
        {/* Left line */}
        <motion.line
          x1="0"
          y1="10"
          x2="70"
          y2="10"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Center diamond */}
        <motion.path
          d="M 90 10 L 100 2 L 110 10 L 100 18 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        />
        {/* Right line */}
        <motion.line
          x1="130"
          y1="10"
          x2="200"
          y2="10"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * Footer link with hover effect
 */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-gold)] bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <GeometricDivider />

        {/* Footer sections - reordered on mobile: About, Explore, Connect, Legal */}
        <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-3 sm:gap-6 sm:pb-6 lg:gap-8 lg:pb-8">
          {/* About - first on mobile, center on desktop */}
          <div className="order-1 text-center sm:order-2">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              About
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              An exploration of the geometric patterns that underlie reality.
              From Platonic solids to sacred symbols, discover the mathematics
              of creation.
            </p>
          </div>

          {/* Explore - second on mobile, first column on desktop */}
          <div className="order-2 text-center sm:order-1 sm:row-span-2 sm:text-left">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Explore
            </h3>
            <nav className="flex flex-col gap-2">
              <FooterLink href={ROUTES.home.path}>Home</FooterLink>
              <FooterLink href={ROUTES.platonicSolids.path}>
                Platonic Solids
              </FooterLink>
              <FooterLink href={ROUTES.sacredPatterns.path}>
                Sacred Patterns
              </FooterLink>
              <FooterLink href={ROUTES.faq.path}>FAQ</FooterLink>
            </nav>

            {/* Legal - stays with Explore on desktop, but hidden on mobile (shown separately) */}
            <div className="hidden sm:block">
              <h3 className="mb-4 mt-6 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                Legal
              </h3>
              <nav className="flex flex-col gap-2">
                <FooterLink href="/legal/terms">Terms of Service</FooterLink>
                <FooterLink href="/legal/privacy">Privacy Policy</FooterLink>
              </nav>
            </div>
          </div>

          {/* Connect - third on mobile, right column on desktop */}
          <div className="order-3 text-center sm:row-span-2 sm:text-right">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Connect
            </h3>
            <div className="flex flex-col gap-2">
              <FooterLink href={ROUTES.contact.path}>Contact</FooterLink>
              <a
                href="https://github.com/robabby/sacred-geometry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                GitHub
              </a>
              <a
                href="https://robabby.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-[var(--color-gold)]"
              >
                Rob Abby
              </a>
            </div>
          </div>

          {/* Legal - fourth on mobile only (hidden on desktop, shown in Explore column) */}
          <div className="order-4 text-center sm:hidden">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/legal/terms">Terms of Service</FooterLink>
              <FooterLink href="/legal/privacy">Privacy Policy</FooterLink>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-gold)]/30 py-4 text-center sm:py-5 lg:py-6">
          <p className="text-xs text-muted-foreground">
            Built with Next.js, React, and curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}
