import path from "node:path";

/** @param {string} file */
const relPosix = (file) => {
  const rel = path.relative(process.cwd(), path.resolve(file));
  return rel.split(path.sep).join("/");
};

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{ts,tsx}": (filenames) => {
    const appFrontend = filenames.filter((f) => {
      const r = relPosix(f);
      return r.startsWith("apps/frontend/") || r === "apps/frontend";
    });
    const ui = filenames.filter((f) => {
      const r = relPosix(f);
      return r.startsWith("packages/ui/") || r === "packages/ui";
    });
    const tasks = [];
    if (filenames.length) {
      tasks.push(`eslint --max-warnings 0 ${filenames.map((f) => `"${f}"`).join(" ")}`);
    }
    if (appFrontend.length) {
      tasks.push(
        `tsc-files --noEmit -p apps/frontend/tsconfig.json ${appFrontend.map((f) => `"${f}"`).join(" ")}`,
      );
    }
    if (ui.length) {
      tasks.push(
        `tsc-files --noEmit -p packages/ui/tsconfig.json ${ui.map((f) => `"${f}"`).join(" ")}`,
      );
    }
    return tasks;
  },
  "*.{ts,tsx,md,json}": ["prettier --write"],
};

export default config;
