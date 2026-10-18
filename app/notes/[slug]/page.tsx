import { redirect } from "next/navigation";
import { notes } from "@/lib/site";

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

export default async function NoteSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}

