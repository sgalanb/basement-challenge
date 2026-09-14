import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";

import "./globals.css";
import { SanityLive } from "@/modules/sanity/lib/live";
import { SITE_URL } from "@/modules/utils";

const TITLE = "basement.studio | We make cool shit that performs.";
const DESCRIPTION =
  "basement.studio is a digital studio crafting brands, websites, 3D experiences, and products. We design and engineer cool shit that actually performs.";

export const metadata: Metadata = {
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

export const viewport: Viewport = {
  colorScheme: "normal",
  themeColor: "#000000",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
