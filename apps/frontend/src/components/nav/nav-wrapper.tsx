import { sanityFetch } from "@/lib/sanity/live";
import { NAVIGATION_QUERY } from "@/lib/sanity/queries";
import type { Navigation } from "@/lib/sanity/types";
import { SiteNav } from "./site-nav";

export async function NavWrapper() {
  const { data } = await sanityFetch({
    query: NAVIGATION_QUERY,
    tags: ["navigation"],
  });
  const navigation = data as Navigation | null;

  return <SiteNav navigation={navigation} />;
}
