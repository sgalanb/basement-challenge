import Link from "next/link";

import { HeroGlow } from "@/components/hero-glow";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="bg-background relative isolate flex min-h-[calc(100svh-4rem)] w-full scroll-mt-20 flex-col items-center justify-center overflow-hidden px-3 py-12 outline-none lg:min-h-[calc(100svh-6.125rem)] lg:scroll-mt-28.5 lg:px-6 lg:py-24"
    >
      <HeroGlow />
      <div className="flex w-full max-w-343 flex-col items-start gap-8 lg:gap-12">
        <span className="typography-label text-basement-orange">Error 404</span>
        <h1 className="typography-large-headline max-w-4xl text-balance">
          This page doesn&apos;t exist.
        </h1>
        <p className="typography-title text-basement-light-grey max-w-xl text-balance">
          The page you are looking for could not be found. Head back home or check out the blog.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primaryLight" nativeButton={false} render={<Link href="/" />}>
            Go home
          </Button>
          <Button variant="primaryDark" nativeButton={false} render={<Link href="/blog" />}>
            Read the blog
          </Button>
        </div>
      </div>
    </main>
  );
}
