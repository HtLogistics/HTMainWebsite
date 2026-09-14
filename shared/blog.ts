import { z } from "zod";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  seoTitle: string;
  metaDescription: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const blogPostInputSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens").optional(),
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().default(""),
  content: z.string().trim().default(""),
  featuredImage: z.string().trim().nullable().optional(),
  category: z.string().trim().default("General"),
  tags: z.array(z.string().trim().min(1)).default([]),
  author: z.string().trim().default("HT Logistics Solutions"),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().trim().default(""),
  metaDescription: z.string().trim().default(""),
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}
