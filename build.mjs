// Builds the static site into dist/. No dependencies: `node build.mjs` (or `npm run build`).

import { rm, mkdir, writeFile, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homePage, casePage, notFoundPage, sitemap, robots, PRODUCT_IDS } from "./src/templates.mjs";
import { ME } from "./src/content.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "src");
const dist = join(root, "dist");

async function write(path, content) {
  const file = join(dist, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
  console.log("  " + path);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const asset of ["styles.css", "site.js", "favicon.svg", "apple-touch-icon.png", "og.png", "img", "data", ME.resume.file]) {
  await cp(join(src, asset), join(dist, asset), { recursive: true });
}

console.log("Pages:");
await write("index.html", homePage());
for (const id of PRODUCT_IDS) await write(`work/${id}/index.html`, casePage(id));
await write("404.html", notFoundPage());
await write("robots.txt", robots());
const map = sitemap();
if (map) await write("sitemap.xml", map);

console.log(`Built ${PRODUCT_IDS.length + 2} pages into dist/, plus ${ME.resume.file}`);
