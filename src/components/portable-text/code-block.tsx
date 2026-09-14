import type { Code } from "@/sanity/types";

export function CodeBlock({ value }: { value: Code }) {
  if (!value.code) return null;

  return (
    <figure className="glass-dark my-8 overflow-hidden rounded-2xl">
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        <code data-language={value.language}>{value.code}</code>
      </pre>
    </figure>
  );
}
