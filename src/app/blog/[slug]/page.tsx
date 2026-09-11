import type { Metadata } from "next";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/app/blog/post-card";
import { PortableText } from "@/components/portable-text";
import { formatDate } from "@/modules/utils";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { postTag } from "@/sanity/lib/tags";

import { getPost } from "./get-post";

type Props = PageProps<"/blog/[slug]">;

// Posts published after the build are rendered on first request, then cached (ISR)
export const dynamicParams = true;

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    tags: [postTag(slug)],
    stega: false,
  });

  if (!post) return {};

  // Post metadata is derived from content (see README); OG images are generated in code.
  return { title: `${post.title} | Blog`, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main>
      <Link href="/blog">← Go back</Link>

      <header>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <PortableText value={post.intro} />

        <div>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.authors && (
            <ul>
              {post.authors.map((author) => (
                <li key={author._id}>
                  <a href={author.socialUrl} target="_blank" rel="noopener noreferrer">
                    {author.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {post.categories && (
            <ul>
              {post.categories.map((category) => (
                <li key={category._id}>
                  <Link href={`/blog?category=${category.slug}`}>{category.title}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {post.featuredImage?.asset && (
          <Image
            src={urlFor(post.featuredImage).width(1600).height(900).url()}
            alt={post.featuredImage.alt}
            width={1600}
            height={900}
            placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
            preload
          />
        )}
      </header>

      <PortableText value={post.body} />

      {(post.previous || post.next) && (
        <nav aria-label="Adjacent posts">
          {post.previous && (
            <Link href={`/blog/${post.previous.slug}`} rel="prev">
              Previous: {post.previous.title}
            </Link>
          )}
          {post.next && (
            <Link href={`/blog/${post.next.slug}`} rel="next">
              Next: {post.next.title}
            </Link>
          )}
        </nav>
      )}

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section>
          <h2>Related posts</h2>
          <ul>
            {post.relatedPosts.map((related) => (
              <li key={related._id}>
                <PostCard post={related} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
