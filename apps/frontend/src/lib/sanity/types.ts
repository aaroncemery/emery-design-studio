import type {
  HOME_PAGE_QUERY_RESULT,
  PROJECT_BY_SLUG_QUERY_RESULT,
  ALL_SERVICES_QUERY_RESULT,
  ALL_TESTIMONIALS_QUERY_RESULT,
  ALL_PRESS_ITEMS_QUERY_RESULT,
  JOURNAL_POST_BY_SLUG_QUERY_RESULT,
  LEGAL_PAGE_BY_SLUG_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  NAVIGATION_QUERY_RESULT,
  FOOTER_QUERY_RESULT,
} from "./sanity.types";

// Everything below is derived from the TypeGen output in ./sanity.types.ts
// (generated from the Studio schema + the GROQ queries in ./queries.ts), not
// hand-maintained. Run `pnpm typegen` after changing a schema or a query.

export type SiteSettings = NonNullable<SITE_SETTINGS_QUERY_RESULT>;
export type Navigation = NonNullable<NAVIGATION_QUERY_RESULT>;
export type Footer = NonNullable<FOOTER_QUERY_RESULT>;
export type NavItem = NonNullable<Navigation["items"]>[number];

export type SanityImage = NonNullable<SiteSettings["logo"]>;
export type SanityImageAsset = NonNullable<SanityImage["asset"]>;

// The full detail-query shape is used everywhere a Project appears (list
// cards included) — list queries only ever project a subset of these same
// field names, so the shape still matches at runtime.
export type Project = NonNullable<PROJECT_BY_SLUG_QUERY_RESULT>;
export type Service = ALL_SERVICES_QUERY_RESULT[number];
export type Testimonial = ALL_TESTIMONIALS_QUERY_RESULT[number];
export type PressItem = ALL_PRESS_ITEMS_QUERY_RESULT[number];
export type JournalPost = NonNullable<JOURNAL_POST_BY_SLUG_QUERY_RESULT>;
export type LegalPage = NonNullable<LEGAL_PAGE_BY_SLUG_QUERY_RESULT>;

export type CollectionItem = Project | Service | Testimonial | PressItem;

type HomePageSection = NonNullable<
  NonNullable<HOME_PAGE_QUERY_RESULT>["sections"]
>[number];

export type PageSection = HomePageSection;
export type HeroSection = Extract<PageSection, { _type: "heroSection" }>;
export type StudioIntroSection = Extract<
  PageSection,
  { _type: "studioIntroSection" }
>;
export type CollectionSection = Extract<
  PageSection,
  { _type: "collectionSection" }
>;
export type InquirySection = Extract<PageSection, { _type: "inquirySection" }>;

export type HeroCornerData = NonNullable<HeroSection["heroFeatured"]>;

export type HomePage = NonNullable<HOME_PAGE_QUERY_RESULT>;
export type Seo = NonNullable<HomePage["seo"]>;
