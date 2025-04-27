import { Button } from "@/components/ui/button";
import { Theme, themeAtom } from "@/store/theme";
import { Head, Link } from "@inertiajs/react";
import { useAtom } from "jotai";

export default function Welcome() {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <>
      <Head title="Welcome"></Head>
      <main className="w-full min-h-dvh flex flex-col items-center justify-center">
        <div className="w-2/3 bg-secondary rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Laskaraya</h1>
          <p className="text-lg mb-8">This is a simple welcome page.</p>
          <div className="inline-flex gap-4">
            <Button
              onClick={() =>
                setTheme((prev) =>
                  prev == Theme.Light ? Theme.Dark : Theme.Light
                )
              }
            >
              Switch to {theme == Theme.Light ? "Dark" : "Light"} Mode
            </Button>
            <Button variant="secondary" asChild>
              <Link href={route("test")}>Go to Test Page</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
