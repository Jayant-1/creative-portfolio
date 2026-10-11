import { redirect } from "next/navigation";
import { notes } from "@/lib/site";

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

export default function NoteSlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/blog/${params.slug}`);
}
