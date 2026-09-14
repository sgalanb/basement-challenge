import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[calc(100svh-4rem)] scroll-mt-20 flex-col items-center justify-center outline-none lg:min-h-[calc(100svh-6.125rem)] lg:scroll-mt-28.5"
    >
      <h1 className="sr-only">basement.studio</h1>
      <Button variant="primaryLight" nativeButton={false} render={<Link href="/blog" />}>
        Check out the blog
      </Button>
    </main>
  );
}
