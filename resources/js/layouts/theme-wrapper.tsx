import { Theme, themeAtom } from "@/store/theme";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAtomValue(themeAtom);

  useEffect(() => {
    if (theme === Theme.System) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    } else {
      document.documentElement.classList.toggle("dark", theme === Theme.Dark);
    }
  }, [theme]);

  return children;
}
