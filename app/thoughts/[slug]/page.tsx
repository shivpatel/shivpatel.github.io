import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/posts";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Shiv Patel`,
    description: post.description,
  };
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="max-w-[640px] mx-auto px-6 py-20">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] text-[#aaa] hover:text-[#111] transition-colors duration-150 mb-12"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Shiv Patel
      </Link>

      {/* Post header */}
      <div className="mb-10">
        <h1 className="text-[22px] font-semibold tracking-tight text-[#111] leading-snug mb-3">
          {post.title}
        </h1>
        {post.date && (
          <p className="text-[12px] text-[#bbb] tabular-nums">
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Post content */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
