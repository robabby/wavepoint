type JsonLdData = Record<string, unknown> & {
  "@context": "https://schema.org";
  "@type": string;
};

interface StructuredDataProps {
  data: JsonLdData;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Helper to create WebSite schema
export function createWebSiteSchema(
  url: string,
  name: string,
  description: string
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    description,
    url,
  };
}

// Helper to create Article schema for geometry detail pages
export function createArticleSchema({
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified,
}: {
  url: string;
  headline: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    publisher: {
      "@type": "Organization",
      name: "WavePoint",
      url: "https://wavepoint.space",
    },
  };
}

// Helper to create FAQPage schema (for Phase 2)
export function createFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Helper to create Product schema for shop pages
export function createProductSchema({
  url,
  name,
  description,
  image,
  price,
  priceCurrency = "USD",
  availability = "InStock",
  lowPrice,
  highPrice,
}: {
  url: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  lowPrice?: number;
  highPrice?: number;
}): JsonLdData {
  const availabilityUrl = {
    InStock: "https://schema.org/InStock",
    OutOfStock: "https://schema.org/OutOfStock",
    PreOrder: "https://schema.org/PreOrder",
  }[availability];

  // Use AggregateOffer if price range, otherwise single Offer
  const offers =
    lowPrice !== undefined && highPrice !== undefined
      ? {
          "@type": "AggregateOffer",
          lowPrice,
          highPrice,
          priceCurrency,
          availability: availabilityUrl,
        }
      : {
          "@type": "Offer",
          price,
          priceCurrency,
          availability: availabilityUrl,
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    ...(image && { image }),
    offers,
    brand: {
      "@type": "Brand",
      name: "WavePoint",
    },
  };
}
