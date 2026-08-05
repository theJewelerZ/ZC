import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import "@/app/globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { businessConfig } from "@/config/business";
import { getOrganizationStructuredData } from "@/lib/structured-data";

const description =
  "Zarka Construction plans and builds custom indoor golf simulator rooms for residential and commercial spaces.";

const searchIndexingEnabled =
  process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === "true";

export const metadata: Metadata = {
  metadataBase: new URL(businessConfig.canonicalUrl),
  title: {
    default: `Golf Simulator Room Builder | ${businessConfig.displayName}`,
    template: `%s | ${businessConfig.displayName}`,
  },
  description,
  applicationName: businessConfig.displayName,
  authors: [{ name: businessConfig.legalName }],
  creator: businessConfig.legalName,
  publisher: businessConfig.legalName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `Golf Simulator Room Builder | ${businessConfig.displayName}`,
    description,
    url: businessConfig.canonicalUrl,
    siteName: businessConfig.displayName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Golf Simulator Room Builder | ${businessConfig.displayName}`,
    description,
  },
  robots: searchIndexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0B1F33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsEnabled =
    process.env.VERCEL === "1" &&
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false";
  const organizationData = getOrganizationStructuredData();

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
          type="application/ld+json"
        />
        {analyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
