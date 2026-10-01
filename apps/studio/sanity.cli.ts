import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "qehxawm7",
    dataset: "edc-prod",
  },
  /**
   * Pin the studio hostname so `sanity deploy` runs non-interactively
   * (deploys to https://emery-design.sanity.studio).
   */
  studioHost: "emery-design",
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: "i0plice3m8nt4vfladfrmxv8",
  },
  typegen: {
    enabled: true,
    path: "../frontend/src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../frontend/src/lib/sanity/sanity.types.ts",
    // Off: the frontend calls a custom `sanityFetch` wrapper (next-sanity's
    // defineLive), not @sanity/client's fetch directly, so the ambient
    // overload has nothing to attach to — and @sanity/client isn't a direct
    // dependency of apps/frontend, so the generated `declare module
    // "@sanity/client"` augmentation can't even resolve. Result types are
    // imported explicitly at each call site instead.
    overloadClientMethods: false,
  },
});
