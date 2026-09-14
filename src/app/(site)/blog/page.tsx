import type { Metadata } from "next";
import { Suspense } from "react";

import { FeaturedPost } from "@/app/(site)/blog/featured-post";
import { PostsGrid } from "@/app/(site)/blog/posts-grid";
import { HeroGlow } from "@/components/hero-glow";
import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_PAGE_QUERY, CATEGORIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { POST_CARD_TAGS, TAGS } from "@/sanity/lib/tags";

import { POSTS_PAGE_SIZE } from "./config";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: BLOG_PAGE_QUERY,
    tags: [TAGS.blogPage, ...POST_CARD_TAGS],
    stega: false,
  });

  return {
    title: data?.metadata?.metaTitle ?? "Blog | basement.studio",
    description: data?.metadata?.metaDescription ?? undefined,
  };
}

export default async function BlogPage() {
  // Three fetches so each can cache and revalidate on its own
  const [{ data: page }, { data: categories }] = await Promise.all([
    sanityFetch({ query: BLOG_PAGE_QUERY, tags: [TAGS.blogPage, ...POST_CARD_TAGS] }),
    sanityFetch({ query: CATEGORIES_QUERY, tags: [TAGS.category] }),
  ]);

  const featured = page?.featuredPost ?? null;

  // Posts wait until we know which one is featured
  const { data: initialPosts } = await sanityFetch({
    query: POSTS_QUERY,
    params: { category: null, exclude: featured?._id ?? null, start: 0, end: POSTS_PAGE_SIZE },
    tags: POST_CARD_TAGS,
  });

  return (
    <main id="main" tabIndex={-1} className="scroll-mt-20 outline-none lg:scroll-mt-28.5">
      <header className="bg-background relative isolate flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-start overflow-hidden px-3 pt-3 pb-6 lg:min-h-[calc(100svh-6.125rem)] lg:px-6 lg:pt-16 lg:pb-12">
        <HeroGlow />
        <div className="flex w-full max-w-343 flex-1 flex-col">
          <h1 className="typography-large-headline max-w-5xl text-balance">{page?.heroTitle}</h1>
          {featured && (
            <div className="flex flex-1 items-center py-6 lg:py-12">
              <FeaturedPost post={featured} />
            </div>
          )}
        </div>
      </header>

      <section
        id="posts-grid"
        aria-labelledby="posts-heading"
        className="bg-foreground text-background scroll-mt-20 px-3 py-6 lg:scroll-mt-28.5 lg:px-6 lg:py-16"
      >
        <div className="mx-auto flex w-full max-w-343 flex-col gap-32">
          <h2 id="posts-heading" className="typography-large-headline max-w-3xl text-balance">
            {page?.listTitle}
          </h2>
          <Suspense>
            <PostsGrid
              initial={initialPosts}
              categories={categories}
              exclude={featured?._id ?? null}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
