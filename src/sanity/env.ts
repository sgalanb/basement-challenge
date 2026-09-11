export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

// Public variables that can be imported from a client component.
// Put server-only variables in env.server.ts.

export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-10";

export const SANITY_DATASET = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const SANITY_PROJECT_ID = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);
