import type { Metadata } from "next";
import Link from "next/link";
import { Heading, Text } from "@radix-ui/themes";
import { AnimateOnScroll } from "@/components/animate-on-scroll";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping Policy for WavePoint Shop. Learn about delivery times, shipping costs, and international shipping.",
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

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <AnimateOnScroll className="mb-8 sm:mb-12">
          <Heading
            size="8"
            className="mb-4 font-display text-foreground"
          >
            Shipping Policy
          </Heading>
          <Text className="text-muted-foreground">
            Last updated: January 2026
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="rounded-lg border border-[var(--border-gold)]/30 bg-card p-6 sm:p-8">
            <Section title="Processing Time">
              <Text as="p">
                All orders are printed on-demand by our fulfillment partner,
                Printful. Please allow <strong>2-5 business days</strong> for
                production before shipping. During peak seasons (holidays, sales
                events), production time may extend to 7-10 business days.
              </Text>
            </Section>

            <Section title="Shipping Destinations">
              <Text as="p">We currently ship to the following countries:</Text>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <span>United States</span>
                <span>Canada</span>
                <span>United Kingdom</span>
                <span>Australia</span>
                <span>Germany</span>
                <span>France</span>
                <span>Spain</span>
                <span>Italy</span>
                <span>Netherlands</span>
              </div>
              <Text as="p" className="mt-4">
                Additional countries may be available at checkout depending on
                product availability.
              </Text>
            </Section>

            <Section title="Estimated Delivery Times">
              <Text as="p">
                After production, typical shipping times are:
              </Text>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-gold)]/30">
                      <th className="pb-2 pr-4 text-foreground">
                        Region
                      </th>
                      <th className="pb-2 text-foreground">
                        Estimated Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-gold)]/20">
                    <tr>
                      <td className="py-2 pr-4">United States (Domestic)</td>
                      <td className="py-2">5-8 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Canada</td>
                      <td className="py-2">8-12 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Europe (UK, DE, FR, etc.)</td>
                      <td className="py-2">8-15 business days</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Australia</td>
                      <td className="py-2">12-20 business days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Text as="p" className="mt-4 text-sm">
                These are estimates and may vary based on customs processing and
                local delivery conditions.
              </Text>
            </Section>

            <Section title="Shipping Costs">
              <Text as="p">
                Shipping costs are calculated at checkout based on:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>Destination country</li>
                <li>Package weight and dimensions</li>
                <li>Shipping method selected</li>
              </ul>
              <Text as="p" className="mt-4">
                Exact shipping costs will be displayed before you complete your
                purchase.
              </Text>
            </Section>

            <Section title="Order Tracking">
              <Text as="p">
                Once your order ships, you&apos;ll receive an email with tracking
                information. You can use this to monitor your package&apos;s
                journey. Please note:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Tracking may take 24-48 hours to update after shipment
                </li>
                <li>
                  International tracking may be limited once the package leaves
                  the origin country
                </li>
              </ul>
            </Section>

            <Section title="Customs & Import Duties">
              <Text as="p">
                For international orders, please be aware:
              </Text>
              <ul className="ml-6 list-disc space-y-2">
                <li>
                  Your order may be subject to import duties, taxes, and customs
                  fees
                </li>
                <li>
                  These charges are determined by your country&apos;s customs
                  office and are <strong>not included</strong> in our prices
                </li>
                <li>
                  You are responsible for paying any applicable customs fees
                </li>
                <li>
                  We cannot predict or control these charges, as they vary by
                  country
                </li>
              </ul>
            </Section>

            <Section title="Multiple Fulfillment Centers">
              <Text as="p">
                Printful operates fulfillment centers in multiple locations
                (USA, Europe, Australia). Your order will be produced at the
                facility closest to your shipping address when possible, which
                helps reduce shipping times and costs.
              </Text>
              <Text as="p" className="mt-4">
                If you order multiple items, they may ship separately from
                different facilities and arrive at different times.
              </Text>
            </Section>

            <Section title="Delayed or Lost Shipments">
              <Text as="p">
                If your order is significantly delayed or appears lost:
              </Text>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Check your tracking information for updates</li>
                <li>
                  Wait until the estimated delivery window has fully passed
                </li>
                <li>
                  Contact us with your order number — we&apos;ll investigate and
                  work toward a resolution
                </li>
              </ol>
              <Text as="p" className="mt-4">
                See our{" "}
                <Link
                  href="/legal/returns"
                  className="text-[var(--color-gold)] underline underline-offset-2 hover:text-[var(--color-gold-bright)]"
                >
                  Return & Refund Policy
                </Link>{" "}
                for information on lost package claims.
              </Text>
            </Section>

            <Section title="Contact">
              <Text as="p">
                For shipping questions, please visit our{" "}
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
