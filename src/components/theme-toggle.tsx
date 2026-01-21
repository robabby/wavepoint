"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themeOptions: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

/**
 * Theme toggle dropdown for switching between light, dark, and system themes.
 */
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Show the icon for the current resolved theme
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md",
            "text-muted-foreground",
            "transition-colors",
            "hover:bg-card hover:text-[var(--color-gold)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/50"
          )}
          aria-label="Toggle theme"
        >
          <CurrentIcon className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                isActive && "bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
