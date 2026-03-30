import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const { data } = matter(fs.readFileSync(fullPath, "utf8"));
    return {
      slug,
      title: data.title ?? slug,
      date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ""),
      description: data.description ?? "",
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : (data.date ?? ""),
    description: data.description ?? "",
    content: processed.toString(),
  };
}
