import {
  BlockElementIcon,
  ComposeIcon,
  ImageIcon,
  InlineElementIcon,
  InsertAboveIcon,
  SearchIcon,
  TagIcon,
} from "@sanity/icons";
import type { FieldGroupDefinition } from "sanity";

export const GROUP = {
  MAIN_CONTENT: "content",
  SEO: "seo",
  DETAILS: "details",
  MEDIA: "media",
  OG: "og",
  CARD: "card",
  RELATED: "related",
} as const;

export const GROUPS = {
  content: {
    name: GROUP.MAIN_CONTENT,
    icon: ComposeIcon,
    title: "Content",
    default: true,
  } satisfies FieldGroupDefinition,
  seo: {
    name: GROUP.SEO,
    icon: SearchIcon,
    title: "SEO",
  } satisfies FieldGroupDefinition,
  details: {
    name: GROUP.DETAILS,
    icon: TagIcon,
    title: "Details",
  } satisfies FieldGroupDefinition,
  media: {
    name: GROUP.MEDIA,
    icon: ImageIcon,
    title: "Media",
  } satisfies FieldGroupDefinition,
  og: {
    name: GROUP.OG,
    icon: InsertAboveIcon,
    title: "Open Graph",
  } satisfies FieldGroupDefinition,
  card: {
    name: GROUP.CARD,
    icon: BlockElementIcon,
    title: "Card",
  } satisfies FieldGroupDefinition,
  related: {
    name: GROUP.RELATED,
    icon: InlineElementIcon,
    title: "Related",
  } satisfies FieldGroupDefinition,
};
