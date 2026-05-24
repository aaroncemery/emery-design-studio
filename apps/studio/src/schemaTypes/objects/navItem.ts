import { defineField, defineType } from "sanity";

export const navItem = defineType({
  name: "navItem",
  title: "Nav Item",
  type: "object",
  fields: [
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Page", value: "page" },
          { title: "URL", value: "url" },
        ],
        layout: "radio",
      },
      initialValue: "page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "reference",
      to: [{ type: "page" }, { type: "legalPage" }],
      hidden: ({ parent }) => parent?.linkType !== "page",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "url",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "Optional display label. Falls back to the referenced page title if left blank.",
    }),
  ],
  preview: {
    select: {
      label: "label",
      pageTitle: "page.title",
      url: "url",
      linkType: "linkType",
    },
    prepare({ label, pageTitle, url, linkType }) {
      const title = label || pageTitle || url || "Untitled link";
      const subtitle = linkType === "page" ? "Page reference" : "External URL";
      return { title, subtitle };
    },
  },
});
