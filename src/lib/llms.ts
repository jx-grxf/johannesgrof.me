import { homepageProjects, localizedStatusLabel, publicProjects, type Project } from "@/data/projects";
import { kontobuch } from "@/data/kontobuch";
import { oeffigo } from "@/data/oeffigo";
import { siteContentByLocale } from "@/data/siteContent";
import { author, personSameAs, toCanonicalUrl } from "@/data/siteMetadata";

// Both llms files are generated from the same data as the pages, so they can
// never drift from what the site actually says.

const en = siteContentByLocale.en;
const projectUrl = (project: Project) => toCanonicalUrl(`/projects/${project.slug}/`);
const projectUrlDe = (project: Project) => toCanonicalUrl(`/de/projects/${project.slug}/`);
const status = (project: Project) => localizedStatusLabel(project.status, "en").toLowerCase();
const sourceLine = (project: Project) =>
  project.visibility === "public" ? project.githubUrl : "source not public";

const intro = `# ${author.name}

> Software developer and HTL Kaindorf student in south-east Styria, Austria. Builds native iPhone and Mac apps, web projects and small developer tools.

The portfolio is available in English and German. The HTML pages and their canonical URLs are the primary source; this file is a directory for language models and other readers that support llms.txt. A public project page does not necessarily mean its source code or beta is public.`;

const contact = `## Contact

- Email: ${author.email}
- Contact form: ${toCanonicalUrl("/#contact")}
${personSameAs.map((url) => `- ${new URL(url).hostname.replace("www.", "")}: ${url}`).join("\n")}
- Privacy policy (German): ${toCanonicalUrl("/datenschutz/")}
- Imprint (German): ${toCanonicalUrl("/impressum/")}`;

const stack = `## Stack

${en.stack.groups.map((group) => `- ${group.title}: ${group.items.join(", ")}`).join("\n")}`;

export function llmsTxt(): string {
  const selected = new Set(homepageProjects.map((project) => project.slug));
  const rest = publicProjects.filter((project) => !selected.has(project.slug));
  const line = (project: Project) =>
    `- [${project.name}](${projectUrl(project)}): ${project.tagline} Status: ${status(project)}. [Deutsch](${projectUrlDe(project)}).`;

  return `${intro}

## Main projects

- [ÖffiGo](${toCanonicalUrl("/oeffigo/")}): ${oeffigo.tagline.en} Public transport for all of Austria on iPhone and Apple Watch. Status: ${oeffigo.status.en.toLowerCase()}. [Deutsch](${toCanonicalUrl("/de/oeffigo/")}). [Product website](${oeffigo.websiteUrl}).
- [Kontobuch](${kontobuch.websiteUrl}): ${kontobuch.description.en} ${kontobuch.availability.en}.

## Selected work

${homepageProjects.map(line).join("\n")}

## All other projects

${rest.map(line).join("\n")}

${stack}

${contact}

## Optional

- [Full project texts](${toCanonicalUrl("/llms-full.txt")}): every project with its description, problem, implementation and highlights.
- [Sitemap](${toCanonicalUrl("/sitemap.xml")})
`;
}

export function llmsFullTxt(): string {
  const projectBlock = (project: Project) => `### ${project.name}

- Page: ${projectUrl(project)} (German: ${projectUrlDe(project)})
- Status: ${status(project)}
- Stack: ${project.stack.join(", ")}${project.platformLabels ? `\n- Platforms: ${project.platformLabels.join(", ")}` : ""}${project.liveUrl ? `\n- Live: ${project.liveUrl}` : ""}
- Source: ${sourceLine(project)}

${project.tagline}

${project.description}

Problem: ${project.caseStudy.problem}

What was built: ${project.caseStudy.built}

${project.highlights.map((highlight) => `- ${highlight}`).join("\n")}`;

  return `${intro}

## About

${en.about.body}

${stack}

## ÖffiGo

- Page: ${toCanonicalUrl("/oeffigo/")} (German: ${toCanonicalUrl("/de/oeffigo/")})
- Product website: ${oeffigo.websiteUrl}
- Platform: ${oeffigo.platform.en}
- Status: ${oeffigo.status.en}

${oeffigo.tagline.en}

${oeffigo.lead.en}

${oeffigo.features.map((feature) => `- ${feature.title.en}: ${feature.body.en}`).join("\n")}

Data: ${oeffigo.dataNote.en}

## Kontobuch

- Website: ${kontobuch.websiteUrl}
- Availability: ${kontobuch.availability.en}

${kontobuch.description.en}

## Projects

${publicProjects.map(projectBlock).join("\n\n")}

${contact}
`;
}
