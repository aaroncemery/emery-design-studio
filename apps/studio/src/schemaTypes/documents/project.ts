import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS, PROJECT_CATEGORIES } from "../../utils/constants";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [GROUPS.content, GROUPS.details, GROUPS.media, GROUPS.seo],
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "excerpt",
      type: "text",
      rows: 3,
      description:
        "1–2 sentence blurb. Used on project cards and as the standfirst under the headline.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "headline",
      type: "string",
      description:
        "Display headline for the project page. Use “ / ” to set the second part in italics, e.g. “One house again, / quietly.” Falls back to the title.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "body",
      title: "Project Write-up",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Lead paragraph", value: "lead" },
            { title: "Heading", value: "h2" },
          ],
        }),
        defineArrayMember({ type: "storyImage" }),
        defineArrayMember({ type: "storyInset" }),
        defineArrayMember({ type: "storyPair" }),
        defineArrayMember({ type: "pullQuote" }),
        // Legacy plain image, kept so older write-ups stay valid.
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "makingOf",
      title: "The making of (optional)",
      type: "makingOf",
      description:
        "For projects with a custom piece or a maker worth showing. Leave empty to hide the section.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({ name: "location", type: "string", group: GROUP.DETAILS }),
    defineField({ name: "year", type: "number", group: GROUP.DETAILS }),
    defineField({
      name: "photoCredit",
      title: "Photographer",
      type: "string",
      description: "Shown in the byline and credits.",
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "season",
      type: "string",
      options: {
        list: [
          { title: "Spring", value: "spring" },
          { title: "Summer", value: "summer" },
          { title: "Fall", value: "fall" },
          { title: "Winter", value: "winter" },
          { title: "Year-round", value: "year-round" },
        ],
      },
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "category",
      type: "string",
      options: { list: PROJECT_CATEGORIES },
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      group: GROUP.MEDIA,
    }),
    defineField({
      name: "gallery",
      description:
        "Extra photographs for the “All photographs” sheet. Images already used in the write-up are included automatically.",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      group: GROUP.MEDIA,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: GROUP.SEO,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "location", media: "coverImage" },
  },
});
