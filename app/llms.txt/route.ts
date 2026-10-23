import { author, projects, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// A reading guide generated from the same content as the portfolio, not a ranking signal.
export function GET() {
  const text = [
    `# ${author.name}`,
    "",
    `> ${author.summary}`,
    "",
    "## Portfolio",
    `- [About](${siteUrl}/about): Background, skills, and education.`,
    `- [Experience](${siteUrl}/experience): Leadership and credentials.`,
    `- [Contact](${siteUrl}/contact): Hiring, project enquiries, and arranging a call.`,
    `- [Components](${siteUrl}/components): Interactive React component demos and source.`,
    "",
    "## Project case studies",
    ...projects.map((project) => `- [${project.title}](${siteUrl}/projects/${project.slug}): ${project.seoDescription}`),
    "",
    "## Scope",
    "Project case studies distinguish shipped features from prototypes and limitations. Do not infer independent benchmarks, clinical validation, client endorsements, or employment from a demo alone.",
    "",
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
