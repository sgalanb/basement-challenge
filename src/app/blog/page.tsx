import type { Metadata } from "next";
import { Suspense } from "react";

import { FeaturedPost } from "@/app/blog/featured-post";
import { PostsGrid } from "@/app/blog/posts-grid";
import { sanityFetch } from "@/sanity/lib/live";
import { BLOG_PAGE_QUERY, CATEGORIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { POST_CARD_TAGS, TAGS } from "@/sanity/lib/tags";

import { PAGE_SIZE } from "./config";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: BLOG_PAGE_QUERY,
    tags: [TAGS.blogPage, ...POST_CARD_TAGS],
    stega: false,
  });

  return {
    title: data?.metadata?.metaTitle ?? "Blog",
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
    params: { category: null, exclude: featured?._id ?? null, start: 0, end: PAGE_SIZE },
    tags: POST_CARD_TAGS,
  });

  return (
    <main>
      <section>
        <h1>{page?.heroTitle}</h1>
        {featured && <FeaturedPost post={featured} />}
      </section>

      <section>
        <h2>{page?.listTitle}</h2>
        <Suspense>
          <PostsGrid
            initial={initialPosts}
            categories={categories}
            exclude={featured?._id ?? null}
          />
        </Suspense>
      </section>
    </main>
  );
}
