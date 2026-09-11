import type { Quote } from "@/sanity/types";

export function QuoteBlock({ value }: { value: Quote }) {
  const attribution = [value.attributionName, value.attributionRole].filter(Boolean);

  return (
    <figure className="my-12">
      <blockquote className="typography-title">“{value.text}”</blockquote>
      {attribution.length > 0 && (
        <figcaption className="typography-caption mt-4 flex gap-2">
          {value.attributionName && <span className="font-medium">{value.attributionName}</span>}
          {value.attributionRole && (
            <span className="text-basement-grey">{value.attributionRole}</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
