/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const config = {
  // Configure pageExtensions to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Allow external images from Printful CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.printful.com",
      },
    ],
  },
  // SEO redirects for URL rebranding
  async redirects() {
    return [
      {
        source: "/sacred-patterns",
        destination: "/patterns",
        permanent: true,
      },
      {
        source: "/sacred-patterns/:slug",
        destination: "/patterns/:slug",
        permanent: true,
      },
    ];
  },
};

// MDX configuration
const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Wrap Next.js config with MDX support
export default withMDX(config);
