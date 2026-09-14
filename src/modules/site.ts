import { SITE_URL } from "@/modules/utils";

/**
 * Site identity shared by metadata, JSON-LD, llms.txt and the markdown representations.
 * Contact details are the ones basement.studio lists publicly on https://basement.studio.
 */
export const SITE = {
  name: "basement.studio",
  legalName: "basement.studio LLC",
  url: SITE_URL,
  officialUrl: "https://basement.studio",
  tagline: "We make cool shit that performs.",
  description:
    "basement.studio is a digital studio crafting brands, websites, 3D experiences, and products. We design and engineer cool shit that actually performs.",
  email: "hello@basement.studio",
  salesEmail: "sales@basement.studio",
  location: { city: "Mar del Plata", country: "Argentina", countryCode: "AR" },
  social: {
    x: "https://x.com/basementstudio",
    instagram: "https://www.instagram.com/basementdotstudio/",
    github: "https://github.com/basementstudio",
  },
  logo: `${SITE_URL}/opengraph-image.jpg`,
} as const;

export const SAME_AS = Object.values(SITE.social);

/** JSON-LD `@id` of the publisher, so page-level schemas can reference the Organization. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const absoluteUrl = (path: string) => new URL(path, SITE.url).toString();
