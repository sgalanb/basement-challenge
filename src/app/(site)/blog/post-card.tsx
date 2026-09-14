import { cn } from "cn";
import { Image } from "next-sanity/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/modules/utils";
import { urlFor } from "@/sanity/lib/image";
import type { POSTS_QUERY_RESULT } from "@/sanity/types";

export type PostCardData = POSTS_QUERY_RESULT["posts"][number];
export type PostCardVariant = "light" | "dark";

const styles: Record<
  PostCardVariant,
  {
    card: string;
    date: string;
    category: string;
    button: "secondaryLight" | "secondaryDark";
    bone: string;
  }
> = {
  light: {
    card: "glass-light",
    date: "text-basement-grey",
    category: "text-basement-grey/40 bg-basement-white",
    button: "secondaryLight",
    bone: "bg-basement-black/6",
  },
  dark: {
    card: "glass-dark",
    date: "text-basement-grey",
    category: "text-basement-light-grey bg-basement-dark-grey",
    button: "secondaryDark",
    bone: "bg-basement-white/8",
  },
};

const cardBase = "flex h-full w-full flex-col items-start gap-4 rounded-2xl p-4 lg:p-6";

export function PostCard({
  post,
  variant = "light",
}: {
  post: PostCardData;
  variant?: PostCardVariant;
}) {
  const s = styles[variant];

  return (
    <article className="h-full">
      <Link href={`/blog/${post.slug}`} className={cn(cardBase, s.card)}>
        {post.featuredImage?.asset && (
          <Image
            src={urlFor(post.featuredImage).width(1500).height(500).url()}
            alt={post.featuredImage.alt}
            width={1500}
            height={500}
            placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
            className="aspect-3/1 w-full shrink-0 rounded-md object-cover"
          />
        )}

        <div className="flex w-full flex-col items-start gap-2 lg:gap-4">
          <time dateTime={post.date} className={cn("typography-caption", s.date)}>
            {formatDate(post.date)}
          </time>

          <h3 className="typography-title-emphasized text-balance">{post.title}</h3>

          {post.categories && (
            <ul className="flex flex-wrap gap-1">
              {post.categories.map((category) => (
                <li key={category._id} className={cn("typography-caption px-0.5", s.category)}>
                  {category.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pushed to the bottom so cards without an image still align with their siblings */}
        <div className="mt-auto">
          {/* Visual affordance only: the whole card is the link, so this must not be a second tab stop */}
          <span className={buttonVariants({ variant: s.button, className: "mt-4" })}>
            Read more
          </span>
        </div>
      </Link>
    </article>
  );
}

// different widths to make the skeleton look more realistic
const titleWidths = ["w-3/4", "w-1/2", "w-2/3"];

export function PostCardSkeleton({
  variant = "light",
  index = 0,
}: {
  variant?: PostCardVariant;
  index?: number;
}) {
  const s = styles[variant];
  const bone = cn("rounded-sm motion-safe:animate-pulse", s.bone);

  return (
    <div
      aria-hidden
      className={cn(cardBase, s.card)}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Image */}
      <div className={cn(bone, "aspect-3/1 w-full shrink-0 rounded-md")} />

      <div className="flex w-full flex-col items-start gap-2 lg:gap-4">
        {/* Date */}
        <div className={cn(bone, "h-3.25 w-16")} />

        {/* Title */}
        <div className="flex w-full flex-col gap-1.5">
          <div className={cn(bone, "h-5 w-11/12")} />
          <div className={cn(bone, "h-5", titleWidths[index % titleWidths.length])} />
        </div>

        {/* Categories */}
        <div className="flex gap-1">
          <div className={cn(bone, "h-3.25 w-20")} />
          <div className={cn(bone, "h-3.25 w-16")} />
        </div>
      </div>

      {/* Button */}
      <div className="mt-auto">
        <div className={cn(bone, "mt-4 h-7 w-24")} />
      </div>
    </div>
  );
}
