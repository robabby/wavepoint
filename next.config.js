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
  // SEO redirects for URL restructure
  async redirects() {
    return [
      // OLD hub path → new hub
      {
        source: "/geometries",
        destination: "/sacred-geometry",
        permanent: true,
      },
      // OLD nested platonic-solids paths → new flat paths
      {
        source: "/geometries/platonic-solids",
        destination: "/platonic-solids",
        permanent: true,
      },
      {
        source: "/geometries/platonic-solids/:slug",
        destination: "/platonic-solids/:slug",
        permanent: true,
      },
      // OLD nested patterns paths → new sacred-patterns paths
      {
        source: "/geometries/patterns",
        destination: "/sacred-patterns",
        permanent: true,
      },
      {
        source: "/geometries/patterns/:slug",
        destination: "/sacred-patterns/:slug",
        permanent: true,
      },
      // Legacy /patterns → /sacred-patterns (keep for old external links)
      {
        source: "/patterns",
        destination: "/sacred-patterns",
        permanent: true,
      },
      {
        source: "/patterns/:slug",
        destination: "/sacred-patterns/:slug",
        permanent: true,
      },
      // Account → Settings redirects
      {
        source: "/account",
        destination: "/settings",
        permanent: true,
      },
      {
        source: "/account/:path*",
        destination: "/settings/:path*",
        permanent: true,
      },
      // Profile edit → Settings profile
      {
        source: "/profile/edit",
        destination: "/settings/profile",
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
