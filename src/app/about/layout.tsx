import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "WavePoint explores the geometric patterns that underlie reality. Built for people who want to explore these patterns without the noise — just geometry, context, and space to find your own meaning.",
  openGraph: {
    title: "About | WavePoint",
    description:
      "Explore sacred geometry patterns with privacy and intention. No breathless claims, no social feeds — just geometry, context, and space for your own meaning.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
