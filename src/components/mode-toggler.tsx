import { Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggler() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="secondary"
      className="cursor-pointer"
      // Cycle through themes: 'light' -> 'dark' -> 'system' -> 'light'.
      // 'system' mode uses the system's theme preference.
      onClick={() => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
      }}
    >
      {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <SunMoon />}
    </Button>
  );
}
