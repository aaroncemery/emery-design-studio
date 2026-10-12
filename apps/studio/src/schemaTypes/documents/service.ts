import { defineType, defineField, defineArrayMember } from "sanity";
import { GROUP, GROUPS, PROJECT_CATEGORIES } from "../../utils/constants";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [GROUPS.content, GROUPS.details, GROUPS.media, GROUPS.related],
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
      name: "number",
      type: "string",
      description: 'Display number, e.g. "01"',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description:
        'Short lede shown under the title, e.g. "Joinery, plaster, stone, and steel."',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "whatsIncluded",
      title: "What's Included",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: 'e.g. "Millwork & cabinetry"',
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "duration",
      type: "string",
      description: 'e.g. "6–14 months"',
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "engagement",
      type: "string",
      description: 'e.g. "Design + administration"',
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "relatedWorkCategory",
      title: "Related Work Category",
      type: "string",
      options: { list: PROJECT_CATEGORIES },
      description:
        "Which Work category this service's CTA and recent-work links point to.",
      group: GROUP.DETAILS,
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "captionedImage",
      group: GROUP.MEDIA,
    }),
    defineField({
      name: "recentProjects",
      title: "Recent Projects",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
      validation: (Rule) => Rule.max(3),
      group: GROUP.RELATED,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "number", media: "image.asset" },
  },
});
