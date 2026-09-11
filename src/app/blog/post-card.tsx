import { Image } from "next-sanity/image";
import Link from "next/link";

import { formatDate } from "@/modules/utils";
import { urlFor } from "@/sanity/lib/image";
import type { POSTS_QUERY_RESULT } from "@/sanity/types";

export type PostCardData = POSTS_QUERY_RESULT["posts"][number];

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article>
      {post.featuredImage?.asset && (
        <Image
          src={urlFor(post.featuredImage).url()}
          alt={post.featuredImage.alt}
          width={800}
          height={450}
          placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
        />
      )}
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.categories && (
        <ul>
          {post.categories.map((category) => (
            <li key={category._id}>{category.title}</li>
          ))}
        </ul>
      )}
      <Link href={`/blog/${post.slug}`}>Read more</Link>
    </article>
  );
}
