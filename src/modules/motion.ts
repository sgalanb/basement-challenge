// Mirrors `globals.css` tokens
export const EASE = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.15, // seconds
  normal: 0.25, // seconds
} as const;

export const TRANSITION = {
  fast: { duration: DURATION.fast, ease: EASE },
  normal: { duration: DURATION.normal, ease: EASE },
} as const;
