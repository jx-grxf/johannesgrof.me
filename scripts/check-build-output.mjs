// Astro logs a failed prerender as an error but still exits 0, which once shipped a
// Cloudflare build without a single static page. Fail the build instead.
import { existsSync } from "node:fs";

const roots = process.env.DEPLOY_TARGET === "cloudflare" ? ["dist/client"] : [".vercel/output/static", "dist"];
const required = ["index.html", "de/index.html", "impressum/index.html", "datenschutz/index.html", "hi/index.html", "sitemap.xml"];
const root = roots.find((dir) => existsSync(dir));
const missing = root ? required.filter((page) => !existsSync(`${root}/${page}`)) : required;

if (missing.length) {
  console.error(`Build output in ${root ?? roots.join(" or ")} lacks prerendered pages: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`Build output in ${root}: prerendered pages present`);
