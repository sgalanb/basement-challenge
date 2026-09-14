import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { SANITY_DATASET, SANITY_PROJECT_ID } from "../env";

const builder = createImageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
