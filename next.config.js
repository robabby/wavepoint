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
  // SEO redirects for URL rebranding
  async redirects() {
    return [
      // Legacy sacred-patterns redirects
      {
        source: "/sacred-patterns",
        destination: "/geometries/patterns",
        permanent: true,
      },
      {
        source: "/sacred-patterns/:slug",
        destination: "/geometries/patterns/:slug",
        permanent: true,
      },
      // Navigation restructure redirects (platonic-solids → geometries/platonic-solids)
      {
        source: "/platonic-solids",
        destination: "/geometries/platonic-solids",
        permanent: true,
      },
      {
        source: "/platonic-solids/:slug",
        destination: "/geometries/platonic-solids/:slug",
        permanent: true,
      },
      // Navigation restructure redirects (patterns → geometries/patterns)
      {
        source: "/patterns",
        destination: "/geometries/patterns",
        permanent: true,
      },
      {
        source: "/patterns/:slug",
        destination: "/geometries/patterns/:slug",
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
