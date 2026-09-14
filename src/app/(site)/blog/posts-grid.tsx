"use client";

import { stegaClean } from "next-sanity";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { CATEGORIES_QUERY_RESULT, POSTS_QUERY_RESULT } from "@/modules/sanity/types";

import { loadPosts } from "./actions";
import { POSTS_PAGE_SIZE } from "./config";
import { PostCard, PostCardSkeleton, type PostCardVariant } from "./post-card";

export const CATEGORY_PARAM = "category";
const ALL = "";

export function PostsGrid({
  initial,
  categories,
  exclude,
  variant = "light",
}: {
  initial: POSTS_QUERY_RESULT;
  categories: CATEGORIES_QUERY_RESULT;
  exclude: string | null;
  variant?: PostCardVariant;
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

  const gridRef = useRef<HTMLUListElement>(null);
  // Index of the first card appended by "load more". Focus moves there once it renders so
  // keyboard users continue from the new content.
  const focusIndexRef = useRef<number | null>(null);
  const count = list?.posts.length ?? 0;

  useEffect(() => {
    const index = focusIndexRef.current;
    if (index === null || index >= count) return;
    focusIndexRef.current = null;
    gridRef.current?.children[index]?.querySelector("a")?.focus();
  }, [count]);

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
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function loadMore() {
    if (!list || isPending) return;
    focusIndexRef.current = list.posts.length;
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
  const status = !list || isPending ? "Loading posts" : `Showing ${count} of ${list.total} posts`;
  const skeletonCount = !list
    ? POSTS_PAGE_SIZE
    : isPending && hasMore
      ? Math.min(POSTS_PAGE_SIZE, list.total - list.posts.length)
      : 0;

  return (
    <div aria-busy={isPending} className="flex flex-col gap-4 lg:gap-8">
      <nav
        aria-label="Filter posts by category"
        className="-mx-3 -my-1 scrollbar-none overflow-x-auto px-1 py-1 lg:-mx-4 lg:px-0"
      >
        <ul className="flex w-max">
          <li>
            <FilterButton active={selected === null} onClick={() => select(null)}>
              All posts
            </FilterButton>
          </li>
          {categories.map((category) => {
            const slug = stegaClean(category.slug);
            return (
              <li key={category._id}>
                <FilterButton active={selected === slug} onClick={() => select(slug)}>
                  {category.title}
                </FilterButton>
              </li>
            );
          })}
        </ul>
      </nav>

      {list && list.posts.length === 0 ? (
        <p className="typography-body text-basement-grey">No posts yet.</p>
      ) : (
        <ul ref={gridRef} className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
          {list?.posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} variant={variant} />
            </li>
          ))}
          {Array.from({ length: skeletonCount }, (_, i) => (
            <li key={`skeleton-${i}`}>
              <PostCardSkeleton variant={variant} index={i} />
            </li>
          ))}
        </ul>
      )}
      <output className="sr-only">{status}</output>

      {hasMore && (
        <Button
          variant={variant === "light" ? "primaryDark" : "primaryLight"}
          disabled={isPending}
          focusableWhenDisabled
          onClick={loadMore}
          className="mx-auto mt-6 lg:mt-12"
        >
          {isPending ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="typography-label text-basement-grey -my-0.5 cursor-pointer px-3 py-0.5 whitespace-nowrap uppercase transition-colors hover:text-current aria-pressed:text-current lg:px-5"
    >
      {children}
    </button>
  );
}
