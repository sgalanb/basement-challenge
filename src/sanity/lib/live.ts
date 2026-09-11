import { defineLive } from "next-sanity/live";

import { SANITY_API_READ_TOKEN } from "@/sanity/env.server";

import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Required for draft previews in the Studio
  serverToken: SANITY_API_READ_TOKEN,
  browserToken: SANITY_API_READ_TOKEN,
});
