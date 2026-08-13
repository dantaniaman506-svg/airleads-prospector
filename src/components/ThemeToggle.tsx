import { Moon, Sun } from "lucide-react";
import { haptic } from "@/lib/haptics";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => {
        haptic.tap();
        toggle();
      }}
      className="press grid size-11 place-items-center rounded-full border border-border bg-card shadow-[var(--shadow-soft)]"
    >
      {theme === "dark" ? <Sun className="size-5 text-primary" /> : <Moon className="size-5" />}
    </button>
  );
}
