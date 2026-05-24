export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata: {
    dimensions: { width: number; height: number; aspectRatio: number };
    lqip: string;
  };
}

export interface SanityImage {
  asset: SanityImageAsset;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type PortableTextContent = Array<{
  _type: string;
  _key?: string;
  [key: string]: unknown;
}>;

export interface Project {
  _id: string;
  _type: "project";
  title: string;
  slug: string;
  location?: string;
  year?: number;
  season?: "spring" | "summer" | "fall" | "winter" | "year-round";
  category?:
    | "Full Renovation"
    | "Interior Architecture"
    | "Styling & Furnishing"
    | "Consultation";
  excerpt?: string;
  featured?: boolean;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  body?: PortableTextContent;
}

export interface Service {
  _id: string;
  _type: "service";
  title: string;
  slug: string;
  number?: string;
  description?: string;
  tags?: string[];
}

export interface Testimonial {
  _id: string;
  _type: "testimonial";
  quote: string;
  authorName?: string;
  authorContext?: string;
}

export interface PressItem {
  _id: string;
  _type: "pressItem";
  publicationName: string;
  logo?: SanityImage;
  url?: string;
}

export interface JournalPost {
  _id: string;
  _type: "journalPost";
  title: string;
  slug: string;
  author?: string;
  publishedAt?: string;
  coverImage?: SanityImage;
  body?: PortableTextContent;
}

export type CollectionItem = Project | Service | Testimonial | PressItem;

export interface HeroSection {
  _type: "heroSection";
  _key: string;
  headline?: string;
  subheadline?: string;
  availabilityText?: string;
  tagline?: string;
  backgroundImage?: SanityImage;
}

export interface StudioIntroSection {
  _type: "studioIntroSection";
  _key: string;
  heading?: string;
  body?: PortableTextContent;
  stats?: Array<{ label: string; value: string }>;
  images?: SanityImage[];
}

export interface CollectionSection {
  _type: "collectionSection";
  _key: string;
  heading?: string;
  subheading?: string;
  displayAs:
    | "projectGrid"
    | "serviceRows"
    | "testimonialRotator"
    | "pressMentions";
  items?: CollectionItem[];
}

export interface InquirySection {
  _type: "inquirySection";
  _key: string;
  heading?: string;
  subheading?: string;
  scopeOptions?: string[];
  budgetOptions?: string[];
}

export type PageSection =
  | HeroSection
  | StudioIntroSection
  | CollectionSection
  | InquirySection;

export interface HomePage {
  title?: string;
  sections?: PageSection[];
}
