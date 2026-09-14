import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { nanoid } from "nanoid";
import type { BlogPost, BlogPostInput } from "@shared/blog";
import { slugify } from "@shared/blog";

// On Vercel the project directory is read-only at runtime (only /tmp is writable), so
// posts/enquiries/uploads fall back to /tmp there. That storage does not persist across
// invocations — this is the known, accepted gap until the CMS moves to a real database.
function resolveDataDir(): string {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  if (process.env.VERCEL) return path.join(os.tmpdir(), "ht-logistics-data");
  return path.resolve(process.cwd(), "data");
}

export const DATA_DIR = resolveDataDir();
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

const now = () => new Date().toISOString();

const seedPosts: BlogPost[] = [
  {
    id: nanoid(),
    slug: "launches-real-time-tracking-system-for-enhanced-delivery-transparency",
    title: "Launches Real-Time Tracking System for Enhanced Delivery Transparency",
    excerpt: "HT Logistics Solutions introduces a real-time tracking system to improve delivery transparency and customer experience.",
    content: "HT Logistics Solutions has rolled out a real-time tracking system across its transportation fleet, giving customers live visibility into the status of their shipments from dispatch to delivery.\n\nThe new system reflects our ongoing commitment to operational transparency and customer confidence, and forms part of a broader investment in technology across our warehousing and transport operations.",
    featuredImage: null,
    category: "Company News",
    tags: ["tracking", "technology", "delivery"],
    author: "HT Logistics Solutions",
    status: "published",
    seoTitle: "Real-Time Delivery Tracking | HT Logistics Solutions",
    metaDescription: "HT Logistics Solutions launches a real-time tracking system for enhanced delivery transparency across Malaysia.",
    publishedAt: "2025-07-21T00:00:00.000Z",
    createdAt: "2025-07-21T00:00:00.000Z",
    updatedAt: "2025-07-21T00:00:00.000Z",
  },
  {
    id: nanoid(),
    slug: "sustainable-logistics-eco-friendly-packaging-initiative",
    title: "Sustainable Logistics: Introduces Eco-Friendly Packaging Initiative",
    excerpt: "Sustainable Logistics announces the launch of its Eco-Friendly Packaging Initiative, reinforcing its commitment to sustainability.",
    content: "As part of our commitment to ethical and sustainable practices, HT Logistics Solutions has introduced an eco-friendly packaging initiative across its kitting and packaging operations.\n\nThe initiative reduces single-use plastic and prioritises recyclable materials, supporting both environmental goals and the expectations of our partners across the supply chain.",
    featuredImage: null,
    category: "Sustainability",
    tags: ["sustainability", "packaging"],
    author: "HT Logistics Solutions",
    status: "published",
    seoTitle: "Eco-Friendly Packaging Initiative | HT Logistics Solutions",
    metaDescription: "HT Logistics Solutions introduces an eco-friendly packaging initiative reinforcing its sustainability commitment.",
    publishedAt: "2025-06-13T00:00:00.000Z",
    createdAt: "2025-06-13T00:00:00.000Z",
    updatedAt: "2025-06-13T00:00:00.000Z",
  },
];

let cache: BlogPost[] | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureLoaded(): Promise<BlogPost[]> {
  if (cache) return cache;
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(POSTS_FILE, "utf-8");
    cache = JSON.parse(raw) as BlogPost[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      cache = seedPosts;
      await persist();
    } else {
      throw err;
    }
  }
  return cache!;
}

async function persist(): Promise<void> {
  const data = cache ?? [];
  writeQueue = writeQueue.then(() => fs.writeFile(POSTS_FILE, JSON.stringify(data, null, 2), "utf-8"));
  await writeQueue;
}

export async function listAllPosts(): Promise<BlogPost[]> {
  const posts = await ensureLoaded();
  return [...posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listPublishedPosts(opts: { category?: string; tag?: string } = {}): Promise<BlogPost[]> {
  const posts = await listAllPosts();
  return posts
    .filter((p) => p.status === "published")
    .filter((p) => !opts.category || p.category === opts.category)
    .filter((p) => !opts.tag || p.tags.includes(opts.tag))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await ensureLoaded();
  return posts.find((p) => p.slug === slug);
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
  const posts = await ensureLoaded();
  return posts.find((p) => p.id === id);
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
  const posts = await ensureLoaded();
  let slug = slugify(base);
  let suffix = 2;
  while (posts.some((p) => p.slug === slug && p.id !== ignoreId)) {
    slug = `${slugify(base)}-${suffix++}`;
  }
  return slug;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  const posts = await ensureLoaded();
  const slug = await uniqueSlug(input.slug || input.title);
  const timestamp = now();
  const post: BlogPost = {
    id: nanoid(),
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    featuredImage: input.featuredImage ?? null,
    category: input.category,
    tags: input.tags,
    author: input.author,
    status: input.status,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    publishedAt: input.status === "published" ? timestamp : null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  posts.push(post);
  await persist();
  return post;
}

export async function updatePost(id: string, input: BlogPostInput): Promise<BlogPost | undefined> {
  const posts = await ensureLoaded();
  const existing = posts.find((p) => p.id === id);
  if (!existing) return undefined;

  const slug = input.slug && input.slug !== existing.slug ? await uniqueSlug(input.slug, id) : existing.slug;
  const wasPublished = existing.status === "published";
  const isNowPublished = input.status === "published";

  existing.slug = slug;
  existing.title = input.title;
  existing.excerpt = input.excerpt;
  existing.content = input.content;
  existing.featuredImage = input.featuredImage ?? null;
  existing.category = input.category;
  existing.tags = input.tags;
  existing.author = input.author;
  existing.status = input.status;
  existing.seoTitle = input.seoTitle;
  existing.metaDescription = input.metaDescription;
  existing.updatedAt = now();
  if (!wasPublished && isNowPublished) existing.publishedAt = existing.updatedAt;
  if (!isNowPublished) existing.publishedAt = null;

  await persist();
  return existing;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await ensureLoaded();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  posts.splice(index, 1);
  await persist();
  return true;
}
