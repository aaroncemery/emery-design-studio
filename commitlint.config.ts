import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"],
    ],
    "scope-case": [2, "always", "kebab-case"],
    "subject-case": [2, "always", "lower-case"],
    "body-max-line-length": [2, "always", 100],
  },
};

export default config;
