import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { SanityLive } from "@/modules/sanity/lib/live";
import { ORGANIZATION_ID, SAME_AS, SITE } from "@/modules/site";
import { SITE_URL } from "@/modules/utils";

const TITLE = "basement.studio | We make cool shit that performs.";
const DESCRIPTION =
  "basement.studio is a digital studio crafting brands, websites, 3D experiences, and products. We design and engineer cool shit that actually performs.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false }, // Not a real site, avoid indexing.
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        alt: TITLE,
        height: 630,
        url: "/opengraph-image.jpg",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: "basement.studio",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    site: "@basementstudio",
    creator: "@basementstudio",
    card: "summary_large_image",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE_URL,
      logo: SITE.logo,
      description: DESCRIPTION,
      email: SITE.email,
      sameAs: SAME_AS,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE.location.city,
        addressCountry: SITE.location.countryCode,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SITE.email,
          url: `${SITE.officialUrl}/contact`,
          availableLanguage: ["en", "es"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: SITE.salesEmail,
          url: `${SITE.officialUrl}/contact`,
          availableLanguage: ["en", "es"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE.name,
      url: SITE_URL,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export const viewport: Viewport = {
  colorScheme: "normal",
  themeColor: "#000000",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd} />
        {children}
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
