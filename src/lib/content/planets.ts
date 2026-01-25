import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { MDXSection } from "@/components/mdx-section";
import { getMDXComponents } from "@/components/mdx-components";
import { extractSectionsFromMDX, type SectionInfo } from "./types";

/**
 * Planet MDX Content Interface
 */
export interface PlanetContent {
  slug: string;
  sections: SectionInfo[];
  content: React.ReactElement;
}

/**
 * Get the path to a Planet MDX file
 */
function getContentPath(slug: string): string {
  return path.join(process.cwd(), "src/content/planets", `${slug}.mdx`);
}

/**
 * Check if a Planet MDX file exists
 */
export function planetContentExists(slug: string): boolean {
  const filePath = getContentPath(slug);
  return fs.existsSync(filePath);
}

/**
 * Load and compile Planet MDX content
 */
export async function getPlanetContent(
  slug: string
): Promise<PlanetContent | null> {
  const filePath = getContentPath(slug);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");

  // Get custom MDX components and merge with Section component
  const customComponents = getMDXComponents({
    Section: MDXSection,
  });

  const { content, frontmatter } = await compileMDX<{
    slug: string;
    sections?: SectionInfo[];
  }>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: customComponents,
  });

  // Use frontmatter sections if provided, otherwise extract from h2 headings
  const sections: SectionInfo[] =
    frontmatter.sections ?? extractSectionsFromMDX(source);

  return {
    slug: frontmatter.slug ?? slug,
    sections,
    content,
  };
}

/**
 * Get all available Planet content slugs
 */
export function getAllPlanetContentSlugs(): string[] {
  const contentDir = path.join(process.cwd(), "src/content/planets");

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
