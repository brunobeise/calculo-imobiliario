import { MoonStar, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "../theme";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="link"
        size="icon"
      >
        <Sun
          className={`h-[1.2rem] w-[1.2rem] transition-transform ${
            theme === "dark" ? "-rotate-180 scale-0" : "rotate-0 scale-100"
          }`}
        />
        <MoonStar
          className={`absolute h-[1.2rem] w-[1.2rem] transition-transform ${
            theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          }`}
        />
      </Button>
    </>
  );
}
