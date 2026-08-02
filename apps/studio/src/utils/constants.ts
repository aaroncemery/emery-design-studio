import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { ComposeIcon } from "@sanity/icons/Compose";
import { EditIcon } from "@sanity/icons/Edit";
import { ImageIcon } from "@sanity/icons/Image";
import { InlineElementIcon } from "@sanity/icons/InlineElement";
import { InsertAboveIcon } from "@sanity/icons/InsertAbove";
import { SearchIcon } from "@sanity/icons/Search";
import { TagIcon } from "@sanity/icons/Tag";
import type { FieldGroupDefinition } from "sanity";

export const GROUP = {
  MAIN_CONTENT: "content",
  SEO: "seo",
  DETAILS: "details",
  MEDIA: "media",
  OG: "og",
  CARD: "card",
  RELATED: "related",
  MICROCOPY: "microcopy",
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
  microcopy: {
    name: GROUP.MICROCOPY,
    icon: EditIcon,
    title: "Microcopy",
  } satisfies FieldGroupDefinition,
};
