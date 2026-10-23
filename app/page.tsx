import HomePage from "@/components/HomePage";
import { projects } from "@/lib/site";

export default function Page() {
  // Case-study bodies stay on the server; interactive home cards receive only what they render.
  const featured = projects.map(({ slug, number, title, headline, date, category, color, ink, hero, homeHero, problem }) => ({
    slug, number, title, headline, date, category, color, ink, hero, homeHero, problem,
  }));
  return <HomePage projects={featured} />;
}
