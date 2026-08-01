import { sanityFetch } from "@/lib/sanity/live";
import { NAVIGATION_QUERY, FOOTER_QUERY } from "@/lib/sanity/queries";
import type { Navigation, Footer } from "@/lib/sanity/types";
import { SiteFooter } from "./site-footer";

export async function FooterWrapper() {
  const [{ data: navigationData }, { data: footerData }] = await Promise.all([
    sanityFetch({
      query: NAVIGATION_QUERY,
      tags: ["navigation"],
    }),
    sanityFetch({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);
  const navigation = navigationData as Navigation | null;
  const footer = footerData as Footer | null;

  return <SiteFooter navigation={navigation} footer={footer} />;
}
