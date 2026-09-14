"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Module-level so any client component can read it without a context.
let previousPathname: string | null = null;
let currentPathname: string | null = null;

export function getPreviousPathname() {
  return previousPathname;
}

/** Mount once in a layout to keep track of the previously visited pathname. */
export function PreviousPathnameTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (currentPathname === pathname) return;
    previousPathname = currentPathname;
    currentPathname = pathname;
  }, [pathname]);

  return null;
}
