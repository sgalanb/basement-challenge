import { Image } from "next-sanity/image";
import Link from "next/link";
import { ViewTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/modules/sanity/lib/image";
import type { BLOG_PAGE_QUERY_RESULT } from "@/modules/sanity/types";
import { formatDate } from "@/modules/utils";

import { postTitleTransition } from "./config";

type FeaturedPost = NonNullable<NonNullable<BLOG_PAGE_QUERY_RESULT>["featuredPost"]>;

export function FeaturedPost({ post }: { post: FeaturedPost }) {
  return (
    <article className="w-full lg:mx-auto lg:max-w-4xl">
      <Link
        href={`/blog/${post.slug}`}
        className="glass-dark flex w-full flex-col gap-4 rounded-2xl p-4 lg:flex-row lg:items-center lg:gap-12"
      >
        {post.featuredImage?.asset && (
          <Image
            src={urlFor(post.featuredImage).url()}
            alt={post.featuredImage.alt}
            width={1500}
            height={1000}
            sizes="(min-width: 1024px) 30rem, 100vw"
            placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
            preload
            className="aspect-3/1 w-full shrink-0 rounded-md object-cover lg:aspect-4/3 lg:w-120"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col items-start gap-2 lg:gap-4 lg:py-8">
          <time dateTime={post.date} className="typography-caption text-basement-light-grey">
            {formatDate(post.date)}
          </time>

          <ViewTransition name={postTitleTransition(post._id)} share="morph" default="none">
            <h2 className="typography-headline text-balance">{post.title}</h2>
          </ViewTransition>

          {post.categories && (
            <ul className="flex flex-wrap gap-1">
              {post.categories.map((category) => (
                <li
                  key={category._id}
                  className="typography-caption text-basement-light-grey bg-basement-dark-grey px-0.5"
                >
                  {category.title}
                </li>
              ))}
            </ul>
          )}

          <p className="typography-body text-basement-light-grey text-balance">{post.excerpt}</p>

          {/* Visual button only, the whole card is the clickable/pressable area */}
          <span className={buttonVariants({ variant: "secondaryDark", className: "mt-6 lg:mt-2" })}>
            Read full blog post
          </span>
        </div>
      </Link>
    </article>
  );
}
