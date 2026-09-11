import { defineLive } from "next-sanity/live";

import { client } from "./client";

// Required for draft previews in the Studio
const token = process.env.SANITY_API_READ_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});
