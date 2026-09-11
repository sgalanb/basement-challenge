import type { Code } from "@/sanity/types";

export function CodeBlock({ value }: { value: Code }) {
  if (!value.code) return null;

  return (
    <figure className="bg-basement-dark-grey my-8 overflow-hidden rounded-lg">
      {value.filename && (
        <figcaption className="typography-caption border-basement-grey/40 text-basement-light-grey border-b px-4 py-2">
          {value.filename}
        </figcaption>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code data-language={value.language}>{value.code}</code>
      </pre>
    </figure>
  );
}
