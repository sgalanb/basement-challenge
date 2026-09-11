import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // We use ISR
  perspective: "published",
  stega: { studioUrl: "/cms" },
});
