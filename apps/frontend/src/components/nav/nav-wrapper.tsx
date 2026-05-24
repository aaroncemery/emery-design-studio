import { sanityFetch } from "@/lib/sanity/client";
import { NAVIGATION_QUERY } from "@/lib/sanity/queries";
import type { Navigation } from "@/lib/sanity/types";
import { SiteNav } from "./site-nav";

export async function NavWrapper() {
  const navigation = await sanityFetch<Navigation | null>({
    query: NAVIGATION_QUERY,
    tags: ["navigation"],
  });

  return <SiteNav navigation={navigation} />;
}
