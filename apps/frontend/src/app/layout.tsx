import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { NavWrapper } from "@/components/nav/nav-wrapper";
import { FooterWrapper } from "@/components/sections/footer-wrapper";
import { JsonLd } from "@/components/seo/json-ld";
import { SanityLive, sanityFetch } from "@/lib/sanity/live";
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import { organizationJsonLd } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/site-url";
import type { SiteSettings } from "@/lib/sanity/types";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const canela = localFont({
  src: [
    {
      path: "../fonts/canela/canela-thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-thin-italic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/canela/canela-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-light-italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/canela/canela-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/canela/canela-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/canela/canela-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/canela/canela-black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/canela/canela-black-italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-serif-local",
  display: "swap",
});

const suisse = localFont({
  src: [
    {
      path: "../fonts/suisse/suisse-hairline.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-hairline-italic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-thin.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-thin-italic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-light-italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-book.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-book-italic.woff2",
      weight: "450",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-semibold-italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/suisse/suisse-black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/suisse/suisse-black-italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-sans-local",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const naancy = localFont({
  src: [
    {
      path: "../fonts/naancy/naancy-grade-1.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/naancy/naancy-grade-2.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-naancy-local",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  const siteSettings = data as SiteSettings | null;
  const faviconUrl = siteSettings?.favicon?.asset?.url;

  return {
    metadataBase: new URL(SITE_URL),
    title: "Emery Design Studio — Kirkland, WA",
    description:
      "Considered residential interiors from a small, slow studio on Lake Washington.",
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ isEnabled: isDraftMode }, { data }] = await Promise.all([
    draftMode(),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  const siteSettings = data as SiteSettings | null;

  return (
    <html
      lang="en"
      className={`${canela.variable} ${suisse.variable} ${jetbrainsMono.variable} ${naancy.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd(siteSettings)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:-translate-x-1/2 focus:z-9999 focus:px-5 focus:py-2.5 focus:bg-[#1b3a5b] focus:text-white focus:text-[10px] focus:font-mono focus:tracking-widest focus:uppercase focus:rounded-full focus:outline-none"
        >
          Skip to main content
        </a>
        <NavWrapper />
        {children}
        <FooterWrapper />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
        <Analytics />
        <SpeedInsights />
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
