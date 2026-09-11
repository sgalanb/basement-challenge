import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { SANITY_API_READ_TOKEN } from "@/sanity/env.server";
import { client } from "@/sanity/lib/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: SANITY_API_READ_TOKEN }),
});
