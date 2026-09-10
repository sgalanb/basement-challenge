import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";

import "./globals.css";

const TITLE = "basement.studio | We make cool shit that performs.";
const DESCRIPTION =
  "basement.studio is a digital studio crafting brands, websites, 3D experiences, and products. We design and engineer cool shit that actually performs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
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
    url: `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
