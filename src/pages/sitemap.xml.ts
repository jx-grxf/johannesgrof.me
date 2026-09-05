import { getProjectGitHubInfo } from "@/data/github";
import { publicProjects } from "@/data/projects";
import { toCanonicalUrl } from "@/data/siteMetadata";

const homeAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/")}" />`;

const projectAlternates = (slug: string) => `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl(`/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl(`/de/projects/${slug}/`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl(`/projects/${slug}/`)}" />`;

const oeffigoAlternates = `
    <xhtml:link rel="alternate" hreflang="en" href="${toCanonicalUrl("/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="de-AT" href="${toCanonicalUrl("/de/oeffigo/")}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${toCanonicalUrl("/oeffigo/")}" />`;

const toDay = (value: string) => value.split("T")[0]!;

export async function GET() {
  const buildDay = toDay(new Date().toISOString());

  // A project page changes when its repository does, not when the site happens
  // to rebuild. Stamping every URL with the build date told Google that all 40
  // pages change daily, which makes the whole lastmod signal worthless. The
  // GitHub lookups are memoised per repo across the build, so this adds no
  // requests on top of what the pages already fetched.
  const projectDays = new Map(
    await Promise.all(
      publicProjects.map(async (project) => {
        const info = await getProjectGitHubInfo(project);

        return [project.slug, info.updatedAt ? toDay(info.updatedAt) : buildDay] as const;
      })
    )
  );

  const urls = [
    { path: "/", priority: "1.0", lastmod: buildDay, alternates: homeAlternates },
    { path: "/de/", priority: "1.0", lastmod: buildDay, alternates: homeAlternates },
    { path: "/oeffigo/", priority: "0.9", lastmod: buildDay, alternates: oeffigoAlternates },
    { path: "/de/oeffigo/", priority: "0.8", lastmod: buildDay, alternates: oeffigoAlternates },
    ...publicProjects.flatMap((project) => {
      const lastmod = projectDays.get(project.slug) ?? buildDay;

      return [
        { path: `/projects/${project.slug}/`, priority: "0.8", lastmod, alternates: projectAlternates(project.slug) },
        { path: `/de/projects/${project.slug}/`, priority: "0.7", lastmod, alternates: projectAlternates(project.slug) },
      ];
    }),
    // German-only legal pages: indexable, but no locale alternates.
    { path: "/impressum/", priority: "0.3", lastmod: buildDay, alternates: "" },
    { path: "/datenschutz/", priority: "0.3", lastmod: buildDay, alternates: "" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${toCanonicalUrl(url.path)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <priority>${url.priority}</priority>${url.alternates}
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
