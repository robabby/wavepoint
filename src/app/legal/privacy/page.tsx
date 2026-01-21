import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for WavePoint Shop. Learn how we collect, use, and protect your personal information.",
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
      <div className="space-y-4 text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <AnimateOnScroll className="mb-8 sm:mb-12">
          <Heading
            size="8"
            className="mb-4 font-display text-foreground"
          >
            Privacy Policy
          </Heading>
          <Text className="text-muted-foreground">
            Last updated: January 2026
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card p-6 sm:p-8">
            <Section title="1. Information We Collect">
              <Text as="p">
                When you make a purchase, we collect the following information:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Contact Information</strong> — Email address for order
                  confirmation and shipping updates
                </li>
                <li>
                  <strong>Shipping Address</strong> — Name and address for order
                  delivery
                </li>
                <li>
                  <strong>Payment Information</strong> — Processed securely by
                  Stripe; we never store your card details
                </li>
              </ul>
              <Text as="p" className="mt-4">
                When browsing, we may collect anonymous analytics data such as
                pages visited and time spent on site.
              </Text>
            </Section>

            <Section title="2. How We Use Your Information">
              <Text as="p">We use your information to:</Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Send order confirmations and shipping notifications</li>
                <li>Respond to customer service inquiries</li>
                <li>Improve our website and product offerings</li>
                <li>Comply with legal obligations</li>
              </ul>
              <Text as="p" className="mt-4">
                We do not sell, rent, or share your personal information with
                third parties for marketing purposes.
              </Text>
            </Section>

            <Section title="3. Third-Party Services">
              <Text as="p">
                We share necessary information with these trusted partners:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Stripe</strong> — Payment processing. Stripe receives
                  your payment details to process transactions securely.{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                  >
                    View Stripe&apos;s Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Printful</strong> — Order fulfillment. Printful
                  receives your shipping address to produce and deliver your
                  order.{" "}
                  <a
                    href="https://www.printful.com/policies/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                  >
                    View Printful&apos;s Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Vercel</strong> — Website hosting and analytics.{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                  >
                    View Vercel&apos;s Privacy Policy
                  </a>
                </li>
              </ul>
            </Section>

            <Section title="4. Cookies">
              <Text as="p">
                We use essential cookies to enable basic site functionality such
                as maintaining your shopping cart. We may also use analytics
                cookies to understand how visitors interact with our site.
              </Text>
              <Text as="p" className="mt-4">
                You can control cookies through your browser settings. Disabling
                cookies may affect site functionality.
              </Text>
            </Section>

            <Section title="5. Data Retention">
              <Text as="p">
                We retain order information for as long as necessary to fulfill
                your order, provide customer support, and comply with legal
                obligations. This typically means:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Order records — 7 years (tax/legal requirements)</li>
                <li>Analytics data — 26 months</li>
                <li>Customer support inquiries — 2 years after resolution</li>
              </ul>
            </Section>

            <Section title="6. Your Rights">
              <Text as="p">You have the right to:</Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Access your personal data we hold</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <Text as="p" className="mt-4">
                <strong>For EU residents (GDPR):</strong> You have additional
                rights including data portability and the right to lodge a
                complaint with a supervisory authority.
              </Text>
              <Text as="p" className="mt-4">
                <strong>For California residents (CCPA):</strong> You have the
                right to know what personal information is collected and to
                request its deletion.
              </Text>
            </Section>

            <Section title="7. Data Security">
              <Text as="p">
                We implement appropriate technical and organizational measures to
                protect your personal information, including:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure payment processing via Stripe (PCI compliant)</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
            </Section>

            <Section title="8. Children&apos;s Privacy">
              <Text as="p">
                Our website is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children.
              </Text>
            </Section>

            <Section title="9. Changes to This Policy">
              <Text as="p">
                We may update this Privacy Policy from time to time. Changes will
                be posted on this page with an updated revision date.
              </Text>
            </Section>

            <Section title="10. Contact">
              <Text as="p">
                For privacy-related questions or to exercise your rights, please
                visit our{" "}
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
