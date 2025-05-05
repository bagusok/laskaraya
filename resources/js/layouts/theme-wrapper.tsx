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
export function BackgroundPattern({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0">
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-white to-blue-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_0.5px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_0.5px)] bg-[size:24rem_9rem]"></div>
  </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}


