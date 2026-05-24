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
});
