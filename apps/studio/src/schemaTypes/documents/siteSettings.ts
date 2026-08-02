import { defineType, defineField, ALL_FIELDS_GROUP } from "sanity";
import { GROUP, GROUPS } from "../../utils/constants";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    {
      ...ALL_FIELDS_GROUP,
      hidden: true,
    },
    GROUPS.seo,
    GROUPS.microcopy,
  ],
  fieldsets: [
    {
      name: "header",
      title: "Header / Nav Microcopy",
      description:
        "The small corner labels in the site header, next to the main nav",
      group: GROUP.MICROCOPY,
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      group: GROUP.SEO,
      description:
        'Used as the title suffix — e.g. "Page Title | Emery Design Studio"',
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      group: GROUP.SEO,
      description: "Default meta description when a page does not set its own",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
      group: GROUP.SEO,
      description:
        "Fallback social share image when a page does not set its own",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: GROUP.SEO,
      description: "Site logo used in the nav/header",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: GROUP.SEO,
      description: "Browser tab icon",
    }),
    defineField({
      name: "headerBrandLabel",
      title: "Brand Label",
      type: "string",
      group: GROUP.MICROCOPY,
      fieldset: "header",
      description:
        'The site logotype, e.g. "EMERY". Rendered large in the Naancy display font as the clickable home link — keep it short.',
    }),
    defineField({
      name: "headerLocationLabel",
      title: "Location Label",
      type: "string",
      group: GROUP.MICROCOPY,
      fieldset: "header",
      description:
        'Line beneath the brand label, e.g. "Puget Sound · Pacific Northwest".',
    }),
    defineField({
      name: "headerEstablishedLabel",
      title: "Established Label",
      type: "string",
      group: GROUP.MICROCOPY,
      fieldset: "header",
      description: 'Top-right label, e.g. "Established MMXIV".',
    }),
    defineField({
      name: "headerIndexLabel",
      title: "Index Label",
      type: "string",
      group: GROUP.MICROCOPY,
      fieldset: "header",
      description:
        'Line beneath the established label, e.g. "Index №01 — Home". Static copy — not tied to the current page.',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
