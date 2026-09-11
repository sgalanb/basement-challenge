import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { POST_GRAPH_TAG, TAGS, authorTag, categoryTag, isTag, postTag } from "@/sanity/lib/tags";

type WebhookBody = {
  _type: string;
  _id: string;
  slug?: string | null;
  previousSlug?: string | null;
  structural?: boolean | null;
};

/** Which tags a change to this document invalidates. */
function tagsFor(body: WebhookBody): string[] {
  const tags: string[] = [body._type];

  if (body._type === TAGS.post) {
    for (const slug of new Set([body.slug, body.previousSlug])) {
      if (slug) tags.push(postTag(slug));
    }
    if (body.structural) tags.push(POST_GRAPH_TAG);
  } else if (body._type === TAGS.author) {
    tags.push(authorTag(body._id));
  } else if (body._type === TAGS.category) {
    tags.push(categoryTag(body._id));
  }

  return tags;
}

// Sanity webhook target
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(
      req,
      process.env.SANITY_REVALIDATE_SECRET, // Webhook configured secret
    );

    // Check the request really come from Sanity
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type || !body._id) {
      return NextResponse.json({ message: "Missing _type or _id" }, { status: 400 });
    }
    if (!isTag(body._type)) {
      return NextResponse.json({ message: `Ignored type ${body._type}`, revalidated: false });
    }
    // A post event without a slug means the webhook projection is misconfigured; fail loudly.
    if (body._type === TAGS.post && !body.slug && !body.previousSlug) {
      return NextResponse.json({ message: "Post event without slug" }, { status: 400 });
    }

    const tags = tagsFor(body);
    for (const tag of tags) revalidateTag(tag, "max");

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
