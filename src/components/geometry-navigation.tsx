import Link from "next/link";
import { Button, Flex } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type GeometryCategory,
  getGeometryBySlug,
  getNextGeometry,
  getPreviousGeometry,
  getGeometryPath,
  getGeometryListPath,
} from "@/lib/data";

interface GeometryNavigationProps {
  currentSlug: string;
  category: GeometryCategory;
}

export function GeometryNavigation({
  currentSlug,
  category,
}: GeometryNavigationProps) {
  const currentGeometry = getGeometryBySlug(currentSlug);

  if (!currentGeometry) {
    return null;
  }

  const prevGeometry = getPreviousGeometry(currentGeometry.id, category);
  const nextGeometry = getNextGeometry(currentGeometry.id, category);

  // Category-specific labels
  const allLabel =
    category === "platonic" ? "All Platonic Solids" : "All Sacred Patterns";
  const allLabelMobile =
    category === "platonic" ? "All Solids" : "All Sacred Patterns";

  return (
    <Flex
      direction={{ initial: "column", sm: "row" }}
      justify="between"
      gap={{ initial: "3", sm: "4" }}
      className="mt-12 border-t border-amber-500/20 pt-6 sm:mt-16 sm:pt-8"
    >
      <div className="min-w-0 flex-1">
        {prevGeometry && (
          <Button
            asChild
            variant="outline"
            size={{ initial: "2", sm: "3" }}
            className="min-h-11 w-full border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/10 sm:w-auto"
          >
            <Link
              href={getGeometryPath(prevGeometry)}
              className="flex min-w-0 items-center justify-center gap-2 text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Previous: </span>
              <span className="max-[400px]:hidden sm:hidden">Prev: </span>
              <span className="min-w-0 truncate max-[400px]:hidden">
                {prevGeometry.name}
              </span>
            </Link>
          </Button>
        )}
      </div>

      <Button
        asChild
        variant="soft"
        size={{ initial: "2", sm: "3" }}
        className="min-h-11 w-full shrink-0 bg-blue-900/50 text-sm text-blue-200 hover:bg-blue-900/70 sm:w-auto sm:text-base"
      >
        <Link href={getGeometryListPath(category)}>
          <span className="hidden sm:inline">{allLabel}</span>
          <span className="sm:hidden">{allLabelMobile}</span>
        </Link>
      </Button>

      <div className="flex min-w-0 flex-1 justify-end">
        {nextGeometry && (
          <Button
            asChild
            variant="outline"
            size={{ initial: "2", sm: "3" }}
            className="min-h-11 w-full border-amber-400/50 text-amber-300 hover:border-amber-400 hover:bg-amber-400/10 sm:w-auto"
          >
            <Link
              href={getGeometryPath(nextGeometry)}
              className="flex min-w-0 items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Next: </span>
              <span className="max-[400px]:hidden sm:hidden">Next: </span>
              <span className="min-w-0 truncate max-[400px]:hidden">
                {nextGeometry.name}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        )}
      </div>
    </Flex>
  );
}
