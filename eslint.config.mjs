import { nextJsConfig } from "@repo/eslint-config/next-js";
import uiConfig from "./packages/ui/eslint.config.mjs";
import { config as baseConfig } from "@repo/eslint-config/base";

/**
 * @param {import("eslint").Linter.Config[]} configs
 * @param {string[]} files
 */
const scopeTo = (configs, files) =>
  configs.map((entry) => {
    if ("files" in entry) return entry;
    if (Object.keys(entry).length === 1 && "ignores" in entry) return entry;
    return { ...entry, files };
  });

/**
 * @param {import("eslint").Linter.Config[]} configs
 */
const scopeRepoRootTs = (configs) =>
  configs.map((entry) => {
    if (Object.keys(entry).length === 1 && "ignores" in entry) return entry;
    if ("files" in entry) return entry;
    return {
      ...entry,
      files: ["**/*.{ts,mts,cts}"],
      ignores: ["apps/frontend/**", "packages/ui/**", ...(entry.ignores ?? [])],
    };
  });

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "pnpm-lock.yaml",
    ],
  },
  ...scopeTo(nextJsConfig, ["apps/frontend/**/*.{js,mjs,cjs,ts,tsx}"]),
  ...scopeTo(uiConfig, ["packages/ui/**/*.{js,mjs,cjs,ts,tsx}"]),
  ...scopeRepoRootTs(baseConfig),
];
