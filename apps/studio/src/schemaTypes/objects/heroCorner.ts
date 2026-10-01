import { defineField, defineType } from "sanity";

export const heroCorner = defineType({
  name: "heroCorner",
  title: "Hero Corner",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description:
        "Falls back to the referenced project's title when left blank and a project is set.",
    }),
    defineField({
      name: "meta",
      title: "Meta",
      type: "string",
      description:
        "Falls back to the referenced project's location, year, and category when left blank and a project is set.",
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description:
        "Falls back to the referenced project's page when left blank and a project is set.",
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      hidden: ({ path }) => path.includes("heroStatus"),
    }),
  ],
  preview: {
    select: {
      eyebrow: "eyebrow",
      headline: "headline",
      projectTitle: "project.title",
    },
    prepare({ eyebrow, headline, projectTitle }) {
      return {
        title: headline || projectTitle || "Untitled",
        subtitle: eyebrow || "Hero Corner",
      };
    },
  },
});
