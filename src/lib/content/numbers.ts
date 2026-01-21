import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXSection } from "@/components/mdx-section";
import { getMDXComponents } from "@/components/mdx-components";
import { extractSectionsFromMDX, type SectionInfo } from "./types";

/**
 * Number Pattern MDX Content Interface
 */
export interface NumberContent {
  pattern: string;
  sections: SectionInfo[];
  content: React.ReactElement;
}

/**
 * Get the path to a Number Pattern MDX file
 */
function getContentPath(pattern: string): string {
  return path.join(process.cwd(), "src/content/numbers", `${pattern}.mdx`);
}

/**
 * Check if a Number Pattern MDX file exists
 */
export function numberContentExists(pattern: string): boolean {
  const filePath = getContentPath(pattern);
  return fs.existsSync(filePath);
}

/**
 * Load and compile Number Pattern MDX content
 */
export async function getNumberContent(
  pattern: string
): Promise<NumberContent | null> {
  const filePath = getContentPath(pattern);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");

  // Get custom MDX components and merge with Section component
  const customComponents = getMDXComponents({
    Section: MDXSection,
  });

  const { content, frontmatter } = await compileMDX<{
    pattern: string;
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
    pattern: frontmatter.pattern ?? pattern,
    sections,
    content,
  };
}

/**
 * Get all available Number Pattern content patterns (for static generation)
 */
export function getAllNumberContentPatterns(): string[] {
  const contentDir = path.join(process.cwd(), "src/content/numbers");

  if (!fs.existsSync(contentDir)) {
    return [];
  }

  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
