import { publicProjects } from "@/data/projects";
import { toCanonicalUrl } from "@/data/siteMetadata";

const urls = [
  { path: "/", priority: "1.0" },
  ...publicProjects.map((project) => ({ path: `/projects/${project.slug}/`, priority: "0.8" })),
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${toCanonicalUrl(url.path)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
