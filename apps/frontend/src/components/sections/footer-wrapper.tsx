import { sanityFetch } from "@/lib/sanity/client";
import { NAVIGATION_QUERY, FOOTER_QUERY } from "@/lib/sanity/queries";
import type { Navigation, Footer } from "@/lib/sanity/types";
import { SiteFooter } from "./site-footer";

export async function FooterWrapper() {
  const [navigation, footer] = await Promise.all([
    sanityFetch<Navigation | null>({
      query: NAVIGATION_QUERY,
      tags: ["navigation"],
    }),
    sanityFetch<Footer | null>({ query: FOOTER_QUERY, tags: ["footer"] }),
  ]);

  return <SiteFooter navigation={navigation} footer={footer} />;
}
