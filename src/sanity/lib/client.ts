import { createClient } from "next-sanity";

import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "../env";

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // We use ISR
  perspective: "published",
  stega: { studioUrl: "/cms" },
});
