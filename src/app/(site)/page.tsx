import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE } from "@/modules/site";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
};

export default function Home() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[calc(100svh-4rem)] scroll-mt-20 flex-col items-center justify-center outline-none lg:min-h-[calc(100svh-6.125rem)] lg:scroll-mt-28.5"
    >
      <h1 className="sr-only">{SITE.name}</h1>
      <p className="sr-only">
        {SITE.description} Based in {SITE.location.city}, {SITE.location.country}. This site hosts
        the studio blog: research, insights, and the science behind building brands and websites.
      </p>
      <Button variant="primaryLight" nativeButton={false} render={<Link href="/blog" />}>
        Check out the blog
      </Button>
    </main>
  );
}
