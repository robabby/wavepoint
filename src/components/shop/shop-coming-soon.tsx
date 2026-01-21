import Link from "next/link";
import { Box, Heading, Text } from "@radix-ui/themes";
import { CircleDot } from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

/**
 * Coming Soon page for when the shop is disabled.
 * Shown instead of 404 when users navigate directly to /shop or /shop/[slug].
 */
export function ShopComingSoon() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <AnimateOnScroll>
          {/* Decorative icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full border border-[var(--border-gold)] bg-card p-6">
              <CircleDot className="h-12 w-12 text-[var(--color-gold)]" />
            </div>
          </div>

          <Heading
            size="9"
            className="mb-4 font-display text-foreground"
          >
            Shop Coming Soon
          </Heading>

          <Box mb="6">
            <Text size="5" className="text-[var(--color-gold)]">
              Sacred geometry merchandise is on its way
            </Text>
          </Box>

          <Text
            size="3"
            className="mx-auto mb-8 max-w-lg text-muted-foreground"
          >
            We&apos;re preparing a collection of carefully designed products
            featuring Metatron&apos;s Cube and other sacred patterns. Check back
            soon.
          </Text>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-gold)] bg-card px-6 py-3 font-medium text-[var(--color-gold)] transition-colors hover:bg-muted"
          >
            Return Home
          </Link>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
