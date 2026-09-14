import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { stegaClean } from "next-sanity";
import { ImageResponse } from "next/og";

import { getPost } from "@/app/(site)/blog/[slug]/get-post";
import { formatDate } from "@/modules/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};
export const alt = "basement.studio | Blog Post Opengraph Image";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });

  return data.map(({ slug }) => ({ slug }));
}

// Design tokens from globals.css. Satori can't read CSS variables, so they are inlined here.
const colors = {
  white: "#e6e6e6",
  lightGrey: "#c4c4c4",
  darkGrey: "#2e2e2e",
};

// Read once at module scope: these never depend on request data. `fetch(import.meta.url)` does not
// work here because the Node.js runtime cannot fetch `file://` URLs.
const background = await readFile(
  join(process.cwd(), "assets/blog-post-og-background.jpg"),
  "base64",
);

// Satori needs a static TTF; the `geist` npm package ships them alongside the web fonts.
const geistSemiBold = await readFile(
  join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf"),
);

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    // Strip stega encoding so invisible characters don't reach the renderer.
    const title = stegaClean(post?.title) || "Blog Post | basement.studio";
    const date = post?.date ? formatDate(stegaClean(post.date)) : null;
    const categories = post?.categories.map((category) => stegaClean(category.title)) ?? [];

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          width: "100%",
          height: "100%",
          padding: "0 92px 48px",
          fontFamily: "Geist",
          fontWeight: 600,
          backgroundImage: `url(data:image/jpeg;base64,${background})`,
          backgroundSize: "1200px 630px",
        }}
      >
        {date && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1,
              color: colors.lightGrey,
            }}
          >
            {date}
          </div>
        )}

        <div
          style={{
            display: "block",
            maxWidth: "100%",
            fontSize: 64,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            textAlign: "center",
            textWrap: "balance",
            color: colors.white,
            lineClamp: 3,
          }}
        >
          {title}
        </div>

        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
            {categories.map((category) => (
              <div
                key={category}
                style={{
                  display: "flex",
                  padding: "2px 12px",
                  fontSize: 24,
                  lineHeight: 1,
                  color: colors.lightGrey,
                  backgroundColor: colors.darkGrey,
                }}
              >
                {category}
              </div>
            ))}
          </div>
        )}
      </div>,
      {
        width: size.width,
        height: size.height,
        fonts: [{ name: "Geist", data: geistSemiBold, weight: 600, style: "normal" }],
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(`Failed to generate OG image: ${e.message}`);
    } else {
      console.error("An unknown error occurred while generating OG image");
    }

    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
