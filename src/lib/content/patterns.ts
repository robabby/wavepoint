import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXSection } from "@/components/mdx-section";
import { getMDXComponents } from "@/components/mdx-components";
import { extractSectionsFromMDX, type SectionInfo } from "./types";

/**
 * Pattern MDX Content Interface
 */
export interface PatternContent {
  slug: string;
  sections: SectionInfo[];
  content: React.ReactElement;
}

/**
 * Get the path to a Pattern MDX file
 */
function getContentPath(slug: string): string {
  return path.join(
    process.cwd(),
    "src/content/patterns",
    `${slug}.mdx`
  );
}

/**
 * Check if a Pattern MDX file exists
 */
export function patternContentExists(slug: string): boolean {
  const filePath = getContentPath(slug);
  return fs.existsSync(filePath);
}

/**
 * Load and compile Pattern MDX content
 */
export async function getPatternContent(
  slug: string
): Promise<PatternContent | null> {
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
    sections?: Array<{ title: string; id: string }>;
  }>({
    source,
    options: { parseFrontmatter: true },
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
 * Get all available Pattern content slugs
 */
export function getAllPatternContentSlugs(): string[] {
  const contentDir = path.join(
    process.cwd(),
    "src/content/patterns"
  );

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
