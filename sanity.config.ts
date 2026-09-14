"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/cms/[[...tool]]/page.tsx` route
 */

import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "./src/modules/sanity/env";
import { resolve } from "./src/modules/sanity/presentation/resolve";
import { schema, singletonTypes } from "./src/modules/sanity/schemaTypes";
import { structure } from "./src/modules/sanity/structure";

const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  basePath: "/cms",
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  title: "Website Studio",
  schema: {
    ...schema,
    // Hide singletons from the "new document" menu
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
      resolve,
    }),
    codeInput(),
    // GROQ playground, only available in local development
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: SANITY_API_VERSION })]
      : []),
  ],
  document: {
    // Singletons can't be deleted, duplicated or unpublished
    actions: (prev, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({ action }) => action && singletonActions.has(action))
        : prev,
  },
});
