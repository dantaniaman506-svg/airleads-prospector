import { useEffect, type ReactNode } from "react";

/**
 * The app ships a single light theme. This provider only makes sure the
 * `dark` class is never applied, even for visitors with an older stored value.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem("airleads-theme");
  }, []);

  return <>{children}</>;
}
