"use client";

import { stegaClean } from "next-sanity";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import type { CATEGORIES_QUERY_RESULT, POSTS_QUERY_RESULT } from "@/sanity/types";

import { loadPosts } from "./actions";
import { CATEGORY_PARAM } from "./config";
import { PostCard } from "./post-card";

const ALL = "";

export function PostsGrid({
  initial,
  categories,
  exclude,
}: {
  initial: POSTS_QUERY_RESULT;
  categories: CATEGORIES_QUERY_RESULT;
  exclude: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requested = searchParams.get(CATEGORY_PARAM);
  const selected = categories.some((c) => stegaClean(c.slug) === requested) ? requested : null;
  const key = selected ?? ALL;

  const [lists, setLists] = useState<Record<string, POSTS_QUERY_RESULT>>({ [ALL]: initial });
  const [isPending, startTransition] = useTransition();
  const list = lists[key];

  // First visit to a category (including a deep link) fetches its first page.
  useEffect(() => {
    if (list) return;
    startTransition(async () => {
      const data = await loadPosts({ category: selected, offset: 0, exclude });
      setLists((current) => (current[key] ? current : { ...current, [key]: data }));
    });
  }, [key, list, selected, exclude]);

  function select(slug: string | null) {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set(CATEGORY_PARAM, slug);
    else params.delete(CATEGORY_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function loadMore() {
    if (!list) return;
    startTransition(async () => {
      const data = await loadPosts({ category: selected, offset: list.posts.length, exclude });
      setLists((current) => {
        const existing = current[key];
        if (!existing) return current;
        const seen = new Set(existing.posts.map((post) => post._id));
        return {
          ...current,
          [key]: {
            posts: [...existing.posts, ...data.posts.filter((post) => !seen.has(post._id))],
            total: data.total,
          },
        };
      });
    });
  }

  const hasMore = list ? list.posts.length < list.total : false;

  return (
    <section aria-busy={isPending}>
      <nav aria-label="Filter posts by category">
        <ul>
          <li>
            <button type="button" aria-pressed={selected === null} onClick={() => select(null)}>
              All posts
            </button>
          </li>
          {categories.map((category) => {
            const slug = stegaClean(category.slug);
            return (
              <li key={category._id}>
                <button type="button" aria-pressed={selected === slug} onClick={() => select(slug)}>
                  {category.title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!list ? (
        <p>Loading posts…</p>
      ) : list.posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {list.posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button type="button" disabled={isPending} onClick={loadMore}>
          {isPending ? "Loading…" : "Load more"}
        </button>
      )}
    </section>
  );
}
