import path from "node:path";

/** @param {string} file */
const relPosix = (file) => {
  const rel = path.relative(process.cwd(), path.resolve(file));
  return rel.split(path.sep).join("/");
};

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{ts,tsx}": (filenames) => {
    const frontend = filenames.filter((f) => {
      const r = relPosix(f);
      return r.startsWith("frontend/") || r === "frontend";
    });
    const ui = filenames.filter((f) => {
      const r = relPosix(f);
      return r.startsWith("packages/ui/") || r === "packages/ui";
    });
    const tasks = [];
    if (filenames.length) {
      tasks.push(`eslint --max-warnings 0 ${filenames.map((f) => `"${f}"`).join(" ")}`);
    }
    if (frontend.length) {
      tasks.push(
        `tsc-files --noEmit -p frontend/tsconfig.json ${frontend.map((f) => `"${f}"`).join(" ")}`,
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
