import { Image } from "next-sanity/image";

import { CornerMarks } from "@/components/corner-marks";
import { urlFor } from "@/sanity/lib/image";
import type { POST_QUERY_RESULT } from "@/sanity/types";

type Block = NonNullable<NonNullable<POST_QUERY_RESULT>["body"]>[number];
type ImageValue = Extract<Block, { _type: "imageWithAlt" }>;

export function ImageBlock({ value }: { value: ImageValue }) {
  const { asset, crop } = value;
  if (!asset?.metadata?.dimensions) return null;

  const { width, height } = asset.metadata.dimensions;
  const croppedWidth = Math.round(width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0)));
  const croppedHeight = Math.round(height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0)));
  const lqip = asset.metadata.lqip;

  return (
    <figure className="my-8 flex justify-center">
      <div className="border-basement-white/20 relative max-w-full border">
        <Image
          src={urlFor(value).url()}
          alt={value.alt}
          width={croppedWidth}
          height={croppedHeight}
          sizes="(min-width: 1024px) 800px, 100vw"
          placeholder={lqip ? "blur" : "empty"}
          blurDataURL={lqip ?? undefined}
          className="h-auto max-h-150 w-auto max-w-full"
        />
        <CornerMarks />
      </div>
    </figure>
  );
}
