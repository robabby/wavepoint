import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "Return and Refund Policy for WavePoint Shop. Learn about our print-on-demand return process and refund eligibility.",
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

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-cream)]">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <AnimateOnScroll className="mb-8 sm:mb-12">
          <Heading
            size="8"
            className="mb-4 font-display text-[var(--color-cream)]"
          >
            Return & Refund Policy
          </Heading>
          <Text className="text-[var(--color-warm-gray)]">
            Last updated: January 2026
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="rounded-lg border border-[var(--border-gold)]/30 bg-[var(--color-warm-charcoal)] p-6 sm:p-8">
            <Section title="Print-on-Demand Products">
              <Text as="p">
                All our products are made-to-order through our fulfillment
                partner, Printful. This means each item is printed specifically
                for you after your order is placed. Because of this custom
                production process, we cannot accept returns for change of mind
                or incorrect sizing.
              </Text>
            </Section>

            <Section title="Eligible Returns">
              <Text as="p">
                We want you to be completely satisfied with your purchase. We
                accept returns and issue refunds in the following situations:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Defective items</strong> — Products with printing
                  errors, misprints, or manufacturing defects
                </li>
                <li>
                  <strong>Damaged in shipping</strong> — Items that arrive
                  damaged or in poor condition
                </li>
                <li>
                  <strong>Wrong item received</strong> — You received a different
                  product than what you ordered
                </li>
              </ul>
            </Section>

            <Section title="Non-Eligible Returns">
              <Text as="p">
                Due to the custom nature of print-on-demand, we cannot accept
                returns for:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Change of mind after ordering</li>
                <li>Incorrect size selection (please check size guides before ordering)</li>
                <li>Color variations due to screen display differences</li>
                <li>Minor variations inherent to the printing process</li>
              </ul>
            </Section>

            <Section title="Return Window">
              <Text as="p">
                To be eligible for a return, you must contact us within{" "}
                <strong>30 days</strong> of receiving your order. After 30 days,
                we cannot guarantee a refund or replacement.
              </Text>
            </Section>

            <Section title="How to Request a Return">
              <Text as="p">To initiate a return, please:</Text>
              <ol className="ml-6 list-decimal space-y-2">
                <li>
                  <strong>Take photos</strong> — Document the issue with clear
                  photos showing the defect or damage
                </li>
                <li>
                  <strong>Contact us</strong> — Reach out through GitHub with
                  your order number and photos
                </li>
                <li>
                  <strong>Wait for confirmation</strong> — We&apos;ll review your
                  request within 2-3 business days
                </li>
                <li>
                  <strong>Resolution</strong> — If approved, we&apos;ll issue a
                  replacement or refund
                </li>
              </ol>
            </Section>

            <Section title="Refund Process">
              <Text as="p">
                Once your return is approved:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  <strong>Replacements</strong> — A new item will be produced and
                  shipped at no additional cost
                </li>
                <li>
                  <strong>Refunds</strong> — Credited to your original payment
                  method within 5-10 business days
                </li>
              </ul>
              <Text as="p" className="mt-4">
                Original shipping costs are refunded only if the return is due to
                our error or a defective product.
              </Text>
            </Section>

            <Section title="Exchanges">
              <Text as="p">
                We do not offer direct exchanges. If you need a different size or
                product, please initiate a return (if eligible) and place a new
                order.
              </Text>
            </Section>

            <Section title="Lost Packages">
              <Text as="p">
                If your package is lost in transit:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Wait until the estimated delivery date has passed (check your
                  tracking information)
                </li>
                <li>
                  Contact us with your order number and tracking details
                </li>
                <li>
                  We&apos;ll work with the carrier to locate your package or issue
                  a replacement
                </li>
              </ul>
            </Section>

            <Section title="Contact">
              <Text as="p">
                For return requests or questions, please visit our{" "}
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
