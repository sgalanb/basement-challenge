const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats a Sanity `date` (YYYY-MM-DD) as "Jan 3, 2025" without timezone drift. */
export function formatDate(date: string) {
  return formatter.format(new Date(`${date}T00:00:00Z`));
}

export function unique<T>(values: T[]) {
  return [...new Set(values)];
}
