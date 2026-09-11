// Server-only variables

import { assertValue } from "./env";

export const SANITY_API_READ_TOKEN = assertValue(
  process.env.SANITY_API_READ_TOKEN,
  "Missing environment variable: SANITY_API_READ_TOKEN",
);
