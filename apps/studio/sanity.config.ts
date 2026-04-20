import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Aligned Interior",

  projectId: "qehxawm7",
  dataset: "edc-prod",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
