import { defineCliConfig } from "sanity/cli";

import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/modules/sanity/env";

export default defineCliConfig({
  api: { projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./src/modules/sanity/schema.json",
    generates: "./src/modules/sanity/types.ts",
    overloadClientMethods: true,
  },
});
