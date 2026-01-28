"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/lib/theme";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3">
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl p-4",
            "border transition-all duration-200",
            theme === value
              ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]"
              : "border-[var(--border-gold)]/20 bg-card/30 text-muted-foreground hover:border-[var(--border-gold)]/40 hover:bg-card/50"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
