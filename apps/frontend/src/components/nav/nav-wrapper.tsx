import { sanityFetch } from "@/lib/sanity/live";
import { NAVIGATION_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";
import { SiteNav } from "./site-nav";

export async function NavWrapper() {
  const [{ data: navigationData }, { data: siteSettingsData }] =
    await Promise.all([
      sanityFetch({ query: NAVIGATION_QUERY, tags: ["navigation"] }),
      sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
    ]);
  const navigation = navigationData as Navigation | null;
  const siteSettings = siteSettingsData as SiteSettings | null;

  return <SiteNav navigation={navigation} siteSettings={siteSettings} />;
}
