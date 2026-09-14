import { cn } from "cn";
import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard, type PostCardData } from "@/app/(site)/blog/post-card";
import { CornerMarks } from "@/components/corner-marks";
import { NewTabHint } from "@/components/new-tab-hint";
import { PortableText } from "@/components/portable-text";
import { buttonVariants } from "@/components/ui/button";
import { formatDate } from "@/modules/utils";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { postTag } from "@/sanity/lib/tags";

import { getPost } from "./get-post";
import { ScrollRow } from "./scroll-row";

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

  return { title: `${post.title} | Blog`, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main
      id="main"
      tabIndex={-1}
      className="scroll-mt-20 overflow-x-clip px-3 pt-6 outline-none lg:scroll-mt-28.5 lg:px-6 lg:pt-9"
    >
      <article>
        <div className="mx-auto flex w-full max-w-343 flex-col">
          <div className="border-basement-grey border-b">
            <Link
              href="/blog"
              className="typography-label hover:text-basement-white/60 inline-flex items-center gap-2 py-2 transition-colors"
            >
              <span aria-hidden="true">←</span>
              Go back
            </Link>
          </div>

          <header className="flex flex-col gap-12 pt-6 lg:gap-15 lg:pt-15">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <h1 className="typography-large-headline lg:typography-headline text-balance">
                {post.title}
              </h1>

              <div className="flex flex-col gap-12 lg:gap-36">
                <div className="flex flex-col gap-2 lg:gap-6">
                  <p className="typography-title">{post.excerpt}</p>
                  <PortableText
                    value={post.intro}
                    className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  />
                </div>

                <div className="typography-caption mt-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {post.authors.length > 0 && (
                      <>
                        <span aria-hidden="true" className="bg-basement-grey size-1" />
                        <ul className="flex items-center">
                          {post.authors.map((author, i) => (
                            <li key={author._id}>
                              {i > 0 && ",\u00a0"}
                              <a
                                href={author.socialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-basement-white/60 transition-colors"
                              >
                                {author.name}
                                <NewTabHint />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  {post.categories.length > 0 && (
                    <ul className="hidden flex-wrap justify-end gap-1 lg:flex">
                      {post.categories.map((category) => (
                        <li key={category._id}>
                          <Link
                            href={`/blog?category=${stegaClean(category.slug)}#posts-grid`}
                            className="text-basement-light-grey bg-basement-dark-grey hover:text-basement-white block px-0.5 transition-colors"
                          >
                            {category.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {post.featuredImage?.asset && (
              <div className="border-basement-white/20 relative border">
                <Image
                  src={urlFor(post.featuredImage).url()}
                  alt={post.featuredImage.alt}
                  width={2400}
                  height={840}
                  placeholder={post.featuredImage.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={post.featuredImage.asset.metadata?.lqip ?? undefined}
                  preload
                  className="aspect-3/1 w-full object-cover"
                />
                <CornerMarks />
              </div>
            )}
          </header>
        </div>

        <div className="mx-auto flex w-full max-w-226 flex-col gap-12 py-24 lg:gap-15 lg:py-30">
          <PortableText
            value={post.body}
            className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          />

          {(post.previous || post.next) && (
            <nav aria-label="Adjacent posts" className="grid grid-cols-2 items-center gap-8">
              {post.previous && <AdjacentPostLink post={post.previous} type="prev" />}
              {post.next && <AdjacentPostLink post={post.next} type="next" />}
            </nav>
          )}
        </div>
      </article>

      {post.relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-posts"
          className="mx-auto flex w-full max-w-343 flex-col gap-6 pb-24 lg:flex-row lg:gap-0 lg:pb-30"
        >
          <ScrollRow
            heading={
              <h2
                id="related-posts"
                className="typography-large-headline lg:typography-headline text-balance"
              >
                Related Posts
              </h2>
            }
            className="min-w-0 flex-1 lg:mr-[calc(50%-50vw)]"
          >
            {post.relatedPosts.map((related) => (
              <li key={related._id} className="w-full shrink-0 snap-start lg:w-106">
                <PostCard post={related} variant="dark" />
              </li>
            ))}
          </ScrollRow>
        </section>
      )}
    </main>
  );
}

function AdjacentPostLink({ post, type }: { post: PostCardData; type: "prev" | "next" }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      rel={type}
      className={cn(
        "group flex min-w-0 items-center gap-4",
        type === "next" ? "col-start-2 flex-row-reverse text-right" : "col-start-1",
      )}
    >
      <span className={buttonVariants({ variant: "secondaryGrey" })}>
        {type === "next" ? "next" : "previous"}
      </span>
      <span className="typography-label group-hover:text-basement-white/60 hidden truncate transition-colors lg:inline">
        {post.title}
      </span>
    </Link>
  );
}
