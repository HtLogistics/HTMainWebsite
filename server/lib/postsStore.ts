import { nanoid } from "nanoid";
import type { BlogPost, BlogPostInput } from "@shared/blog";
import { slugify } from "@shared/blog";
import { dbError, getSupabase } from "./supabase";

const TABLE = "posts";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  seo_title: string;
  meta_description: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function fromRow(r: PostRow): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    content: r.content,
    featuredImage: r.featured_image,
    category: r.category,
    tags: r.tags,
    author: r.author,
    status: r.status,
    seoTitle: r.seo_title,
    metaDescription: r.meta_description,
    publishedAt: r.published_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/* Newest-edited first — matches the admin list's expectations. */
export async function listAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabase().from(TABLE).select("*").order("updated_at", { ascending: false });
  if (error) throw dbError(error);
  return (data as PostRow[]).map(fromRow);
}

export async function listPublishedPosts(opts: { category?: string; tag?: string } = {}): Promise<BlogPost[]> {
  let query = getSupabase().from(TABLE).select("*").eq("status", "published").order("published_at", { ascending: false });
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.tag) query = query.contains("tags", [opts.tag]);
  const { data, error } = await query;
  if (error) throw dbError(error);
  return (data as PostRow[]).map(fromRow);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await getSupabase().from(TABLE).select("*").eq("slug", slug).maybeSingle();
  if (error) throw dbError(error);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  const { data, error } = await getSupabase().from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw dbError(error);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const published = await listPublishedPosts({ category: post.category });
  return published.filter((p) => p.id !== post.id).slice(0, limit);
}

export async function listCategories(): Promise<string[]> {
  const posts = await listPublishedPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 2;
  for (;;) {
    let query = getSupabase().from(TABLE).select("id", { count: "exact", head: true }).eq("slug", slug);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { count, error } = await query;
    if (error) throw dbError(error);
    if (!count) return slug;
    slug = `${slugify(base)}-${suffix++}`;
  }
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const slug = await uniqueSlug(input.slug || input.title);
  const timestamp = new Date().toISOString();
  const row = {
    id: nanoid(),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    featured_image: input.featuredImage ?? null,
    category: input.category,
    tags: input.tags,
    author: input.author,
    status: input.status,
    seo_title: input.seoTitle,
    meta_description: input.metaDescription,
    published_at: input.status === "published" ? timestamp : null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const { data, error } = await getSupabase().from(TABLE).insert(row).select().single();
  if (error) throw dbError(error);
  return fromRow(data as PostRow);
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost | undefined> {
  const existing = await getPostById(id);
  if (!existing) return undefined;

  const slug = input.slug && input.slug !== existing.slug ? await uniqueSlug(input.slug, id) : existing.slug;
  const wasPublished = existing.status === "published";
  const isNowPublished = input.status === "published";
  const updatedAt = new Date().toISOString();

  const row = {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    featured_image: input.featuredImage ?? null,
    category: input.category,
    tags: input.tags,
    author: input.author,
    status: input.status,
    seo_title: input.seoTitle,
    meta_description: input.metaDescription,
    published_at: !isNowPublished ? null : !wasPublished ? updatedAt : existing.publishedAt,
    updated_at: updatedAt,
  };
  const { data, error } = await getSupabase().from(TABLE).update(row).eq("id", id).select().maybeSingle();
  if (error) throw dbError(error);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function deletePost(id: string): Promise<boolean> {
  const { error, count } = await getSupabase().from(TABLE).delete({ count: "exact" }).eq("id", id);
  if (error) throw dbError(error);
  return (count ?? 0) > 0;
}
