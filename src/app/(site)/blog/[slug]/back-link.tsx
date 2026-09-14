"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { getPreviousPathname } from "@/components/previous-pathname";

/**
 * Links to /blog, but when the user arrived from /blog it goes back through
 * history instead so the browser restores the blog's scroll position.
 */
export function BackLink({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (getPreviousPathname() !== "/blog") return;
    e.preventDefault();
    router.back();
  };

  return (
    <Link href="/blog" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
