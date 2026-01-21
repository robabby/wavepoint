import type { Metadata } from "next";
import Link from "next/link";
import { Box, Heading, Text } from "@radix-ui/themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  StructuredData,
  createFAQPageSchema,
} from "@/components/structured-data";
import {
  FAQ_CATEGORIES,
  FAQ_DATA,
  getFAQsByCategory,
  type FAQCategory,
} from "@/lib/data/faq";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { AnimatedCard } from "@/components/animated-card";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about sacred geometry, Platonic Solids, sacred patterns, and how to practice geometric meditation. Learn about the Flower of Life, Metatron's Cube, the Golden Ratio, and more.",
  openGraph: {
    title: "FAQ | WavePoint",
    description:
      "Answers to common questions about sacred geometry, the five Platonic Solids, sacred patterns like the Flower of Life, and practical applications.",
  },
};

export default function FAQPage() {
  const faqSchema = createFAQPageSchema(
    FAQ_DATA.map((faq) => ({
      question: faq.question,
      answer: faq.answer.replace(/<[^>]*>/g, ""), // Strip HTML for schema
    }))
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <StructuredData data={faqSchema} />

      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <AnimateOnScroll className="mx-auto mb-8 max-w-4xl text-center sm:mb-12 lg:mb-16">
          <Heading
            size="9"
            className="font-display text-foreground"
            mb="4"
          >
            Frequently Asked Questions
          </Heading>
          <Box mb="2">
            <Text size="5" className="text-[var(--color-gold)]">
              Your guide to understanding sacred geometry
            </Text>
          </Box>
          <Text
            size="3"
            className="mx-auto max-w-3xl text-muted-foreground"
          >
            Explore answers to common questions about sacred geometry, from the
            fundamental Platonic Solids to ancient patterns like the Flower of
            Life. Whether you&apos;re new to these concepts or deepening your
            practice, find the insights you seek.
          </Text>
        </AnimateOnScroll>

        {/* FAQ Categories */}
        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
          {FAQ_CATEGORIES.map((category, categoryIndex) => {
            const faqs = getFAQsByCategory(category.id as FAQCategory);
            return (
              <AnimateOnScroll key={category.id} delay={categoryIndex * 0.1}>
                <AnimatedCard className="p-6 sm:p-8">
                  {/* Category Header */}
                  <div className="mb-6">
                    <Heading
                      size="6"
                      className="mb-2 font-heading text-[var(--color-gold)]"
                    >
                      {category.name}
                    </Heading>
                    <Text size="2" className="text-muted-foreground">
                      {category.description}
                    </Text>
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border-b border-[var(--border-gold)]/30"
                      >
                        <AccordionTrigger className="py-4 text-left text-foreground hover:text-[var(--color-gold)] hover:no-underline [&[data-state=open]]:text-[var(--color-gold)]">
                          <span className="pr-4 text-base font-medium sm:text-lg">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          <div
                            dangerouslySetInnerHTML={{ __html: faq.answer }}
                            className="prose-a:text-[var(--color-gold)] prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-[var(--color-gold-bright)]"
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AnimatedCard>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <AnimateOnScroll delay={0.4}>
          <div className="mx-auto mt-12 max-w-4xl text-center sm:mt-16">
            <Text className="text-muted-foreground">
              Have more questions? Explore our detailed guides on{" "}
              <Link
                href="/platonic-solids"
                className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
              >
                Platonic Solids
              </Link>{" "}
              and{" "}
              <Link
                href="/sacred-patterns"
                className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
              >
                Sacred Patterns
              </Link>
              .
            </Text>
          </div>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
