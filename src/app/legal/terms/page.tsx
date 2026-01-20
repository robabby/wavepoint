import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for WavePoint Shop. Read our terms and conditions for using our website and purchasing products.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <Heading
        size="5"
        className="mb-4 font-heading text-[var(--color-gold)]"
      >
        {title}
      </Heading>
      <div className="space-y-4 text-[var(--color-warm-gray)]">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <AnimateOnScroll className="mb-8 sm:mb-12">
          <Heading
            size="8"
            className="mb-4 font-display text-[var(--color-cream)]"
          >
            Terms of Service
          </Heading>
          <Text className="text-[var(--color-warm-gray)]">
            Last updated: January 2026
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)] p-6 sm:p-8">
            <Section title="1. Acceptance of Terms">
              <Text as="p">
                By accessing and using WavePoint (wavepoint.space), you
                accept and agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our website or
                services.
              </Text>
            </Section>

            <Section title="2. Use of Website">
              <Text as="p">
                You may use this website for lawful purposes only. You agree not
                to:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Use the site in any way that violates applicable laws</li>
                <li>Attempt to gain unauthorized access to any part of the site</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Copy, reproduce, or distribute content without permission</li>
              </ul>
            </Section>

            <Section title="3. Products and Purchases">
              <Text as="p">
                All products sold through our shop are print-on-demand items
                fulfilled by our partner, Printful. By making a purchase, you
                agree to:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Provide accurate and complete payment information</li>
                <li>Pay all charges at the prices in effect when incurred</li>
                <li>
                  Review product details, including size and specifications,
                  before ordering
                </li>
              </ul>
              <Text as="p" className="mt-4">
                Prices are subject to change without notice. We reserve the right
                to refuse or cancel orders at our discretion.
              </Text>
            </Section>

            <Section title="4. Payment Processing">
              <Text as="p">
                All payments are processed securely through Stripe. We do not
                store your credit card information on our servers. By making a
                purchase, you also agree to Stripe&apos;s{" "}
                <a
                  href="https://stripe.com/legal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                >
                  Terms of Service
                </a>
                .
              </Text>
            </Section>

            <Section title="5. Intellectual Property">
              <Text as="p">
                All content on this website, including sacred geometry designs,
                text, graphics, and software, is the property of WavePoint
                or its content suppliers and is protected by copyright and
                intellectual property laws.
              </Text>
              <Text as="p" className="mt-4">
                Sacred geometry patterns themselves are ancient symbols in the
                public domain. However, our specific artistic interpretations,
                product designs, and website content are proprietary.
              </Text>
            </Section>

            <Section title="6. Limitation of Liability">
              <Text as="p">
                WavePoint shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use
                of the website or purchase of products. Our liability is limited
                to the amount you paid for the specific product in question.
              </Text>
            </Section>

            <Section title="7. Third-Party Services">
              <Text as="p">
                Our website integrates with third-party services:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Printful</strong> — Order fulfillment and shipping
                </li>
                <li>
                  <strong>Stripe</strong> — Payment processing
                </li>
                <li>
                  <strong>Vercel</strong> — Website hosting
                </li>
              </ul>
              <Text as="p" className="mt-4">
                Your use of these services is subject to their respective terms
                and privacy policies.
              </Text>
            </Section>

            <Section title="8. Governing Law">
              <Text as="p">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of the United States, without regard to
                conflict of law principles.
              </Text>
            </Section>

            <Section title="9. Changes to Terms">
              <Text as="p">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting to the website.
                Continued use of the site after changes constitutes acceptance of
                the new terms.
              </Text>
            </Section>

            <Section title="10. Contact">
              <Text as="p">
                For questions about these Terms of Service, please visit our{" "}
                <Link
                  href="/faq"
                  className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                >
                  FAQ page
                </Link>{" "}
                or contact us through GitHub.
              </Text>
            </Section>
          </div>
        </AnimateOnScroll>
      </div>
    </main>
  );
}
