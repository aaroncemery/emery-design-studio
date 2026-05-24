import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description:
        'Used as the title suffix — e.g. "Page Title | Emery Design Studio"',
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "text",
      description: "Default meta description when a page does not set its own",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default OG Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Fallback social share image when a page does not set its own",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Site logo used in the nav/header",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      description: "Browser tab icon",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
