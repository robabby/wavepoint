import type { MetadataRoute } from "next";
import { getAllGeometries, getGeometryPath } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wavepoint.space";

export default function sitemap(): MetadataRoute.Sitemap {
  const geometries = getAllGeometries();

  return [
    {
      url: BASE_URL,
      priority: 1.0,
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}/platonic-solids`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/sacred-patterns`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}/faq`,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    ...geometries.map((g) => ({
      url: `${BASE_URL}${getGeometryPath(g)}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
