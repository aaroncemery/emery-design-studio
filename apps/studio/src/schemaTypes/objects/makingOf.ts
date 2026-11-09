import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * Optional "making of" chapter for a project (a custom piece, a commissioned
 * maker, a process worth showing). Deliberately loose: notes are any mix of an
 * optional label, optional text, and any number of images — no required
 * stages, no numbering.
 */
export const makingOf = defineType({
  name: "makingOf",
  title: "The making of",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description:
        "Small label above the heading. Defaults to “The making of”.",
    }),
    defineField({
      name: "heading",
      type: "string",
      description:
        "Use “ / ” to set the second part in italics, e.g. “A table / made for the room.”",
    }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "notes",
      type: "array",
      of: [
        defineArrayMember({
          name: "makingNote",
          title: "Note",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              description: "Optional small label, e.g. “Drawing it”.",
            }),
            defineField({ name: "text", type: "text", rows: 4 }),
            defineField({
              name: "images",
              type: "array",
              of: [defineArrayMember({ type: "captionedImage" })],
              validation: (Rule) => Rule.max(3),
            }),
            defineField({
              name: "wide",
              title: "Run a single image wide",
              type: "boolean",
              initialValue: false,
            }),
          ],
          validation: (Rule) =>
            Rule.custom((note) => {
              const n = note as
                | { label?: string; text?: string; images?: unknown[] }
                | undefined;
              return n?.label || n?.text || n?.images?.length
                ? true
                : "Add a label, some text, or an image.";
            }),
          preview: {
            select: {
              title: "label",
              subtitle: "text",
              media: "images.0.asset",
            },
            prepare: ({ title, subtitle, media }) => ({
              title: title || subtitle || "Image only",
              subtitle: title ? subtitle : undefined,
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "maker",
      type: "object",
      description: "Credit and link for whoever made the piece.",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({
          name: "discipline",
          type: "string",
          description: "e.g. Furniture maker",
        }),
        defineField({ name: "location", type: "string" }),
        defineField({
          name: "piece",
          type: "string",
          description:
            "What they made, e.g. Dining table. Used in the credits.",
        }),
        defineField({
          name: "quote",
          type: "text",
          rows: 2,
          description: "A line from the maker, in their own words.",
        }),
        defineField({ name: "portrait", type: "captionedImage" }),
        defineField({ name: "url", title: "Website", type: "url" }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "label" },
    prepare: ({ title, subtitle }) => ({
      title: title || "The making of",
      subtitle,
    }),
  },
});
