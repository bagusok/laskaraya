import { Button } from "@/components/ui/button";
import { Theme, themeAtom } from "@/store/theme";
import { Head, Link } from "@inertiajs/react";
import { useAtom } from "jotai";

export default function Test() {
  return (
    <>
      <Head title="Welcome"></Head>
      <main className="w-full min-h-dvh flex flex-col items-center justify-center">
        <div className="w-2/3 bg-secondary rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Test Page</h1>
          <p className="text-lg mb-8">
            This is a simple Test Page for test navigating.
          </p>
          <div className="inline-flex gap-4">
            <Button asChild>
              <Link href={route("welcome")}>Go to Home Page</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
