import { sanityFetch } from "@/lib/sanity/live";
import {
  NAVIGATION_QUERY,
  FOOTER_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/lib/sanity/queries";
import type { Navigation, Footer, SiteSettings } from "@/lib/sanity/types";
import { SiteFooter } from "./site-footer";

export async function FooterWrapper() {
  const [
    { data: navigationData },
    { data: footerData },
    { data: siteSettingsData },
  ] = await Promise.all([
    sanityFetch({
      query: NAVIGATION_QUERY,
      tags: ["navigation"],
    }),
    sanityFetch({ query: FOOTER_QUERY, tags: ["footer"] }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  const navigation = navigationData as Navigation | null;
  const footer = footerData as Footer | null;
  const siteSettings = siteSettingsData as SiteSettings | null;

  return (
    <SiteFooter
      navigation={navigation}
      footer={footer}
      siteSettings={siteSettings}
    />
  );
}
