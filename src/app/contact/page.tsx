import type { Metadata } from "next";
import { Heading, Text } from "@radix-ui/themes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { ContactFormWrapper } from "@/components/contact/contact-form-wrapper";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the WavePoint team. We'd love to hear from you.",
  openGraph: {
    title: "Contact | WavePoint",
    description:
      "Get in touch with the WavePoint team. We'd love to hear from you.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <AnimateOnScroll className="mx-auto mb-8 max-w-md text-center sm:mb-12">
          <Heading
            size="8"
            className="font-display text-[var(--color-cream)]"
            mb="3"
          >
            Get in touch
          </Heading>
          <Text size="3" className="text-[var(--color-warm-gray)]">
            Questions, feedback, or just want to say hello?
          </Text>
        </AnimateOnScroll>

        {/* Form - no hover animation to avoid jarring UX with dropdown */}
        <AnimateOnScroll delay={0.1}>
          <div className="mx-auto max-w-md rounded-lg border border-[var(--border-gold)] bg-[var(--color-warm-charcoal)] p-6 sm:p-8">
            <ContactFormWrapper />
          </div>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
