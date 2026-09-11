import { Image } from "next-sanity/image";
import Link from "next/link";

import { formatDate } from "@/modules/utils";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_PAGE_QUERY_RESULT } from "@/sanity/types";

type FeaturedPost = NonNullable<NonNullable<BLOG_PAGE_QUERY_RESULT>["featuredPost"]>;

export function FeaturedPost({ post }: { post: FeaturedPost }) {
  return (
    <article>
      {post.featuredImage?.asset && (
        <Image
          src={urlFor(post.featuredImage).url()}
          alt={post.featuredImage.alt}
          width={1600}
          height={1200}
          placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
          preload
        />
      )}
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <h2>{post.title}</h2>
      {post.categories && (
        <ul>
          {post.categories.map((category) => (
            <li key={category._id}>{category.title}</li>
          ))}
        </ul>
      )}
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`}>Read full blog post</Link>
    </article>
  );
}
