import { Image } from "next-sanity/image";

import { urlFor } from "@/sanity/lib/image";
import type { POST_QUERY_RESULT } from "@/sanity/types";

type Block = NonNullable<NonNullable<POST_QUERY_RESULT>["body"]>[number];
type ImageValue = Extract<Block, { _type: "imageWithAlt" }>;

export function ImageBlock({ value }: { value: ImageValue }) {
  const { asset, crop } = value;
  if (!asset?.metadata?.dimensions) return null;

  // Sanity applies `crop` server-side via `rect`, so the rendered aspect ratio is the cropped one.
  const { width, height } = asset.metadata.dimensions;
  const croppedWidth = Math.round(width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0)));
  const croppedHeight = Math.round(height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0)));
  const lqip = asset.metadata.lqip;

  return (
    <figure className="my-8">
      <Image
        src={urlFor(value).url()}
        alt={value.alt}
        width={croppedWidth}
        height={croppedHeight}
        sizes="(min-width: 1024px) 800px, 100vw"
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip ?? undefined}
        className="h-auto w-full rounded-lg"
      />
    </figure>
  );
}
