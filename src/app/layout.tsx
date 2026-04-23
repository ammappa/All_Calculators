import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";

import GoogleTags from "@/components/seo/GoogleTags";
import JsonLd from "@/components/seo/JsonLd";
import PwaInstallPrompt from "@/components/pwa/PwaInstallPrompt";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import { buildLocalBusinessSchema, buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { siteConfig } from "@/lib/siteConfig";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} Calculators`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  applicationName: siteConfig.name,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  icons: {
    icon: siteConfig.logoPath,
    apple: siteConfig.logoPath,
  },
  openGraph: {
    title: `${siteConfig.name} Calculators`,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.logoPath }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Calculators`,
    description: siteConfig.description,
    images: [siteConfig.logoPath],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <meta name="theme-color" content="#0f172a" />
        {adsenseClient ? (
          <meta name="google-adsense-account" content={adsenseClient} />
        ) : null}
        {adsenseClient ? (
          <Script
            async
            strategy="lazyOnload"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        ) : null}
        <GoogleTags gaMeasurementId={gaMeasurementId} gtmId={gtmId} />
        <JsonLd
          id="global-site-schema"
          data={[buildOrganizationSchema(), buildWebsiteSchema(), buildLocalBusinessSchema()]}
        />
      </head>
      <body className="antialiased">
        <ServiceWorkerRegistration />
        {children}
        <PwaInstallPrompt />
        <Toaster />
      </body>
    </html>
  );
}
