import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { blogPostInputSchema } from "@shared/blog";
import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  getRelatedPosts,
  listAllPosts,
  listCategories,
  listPublishedPosts,
  updatePost,
} from "../lib/postsStore";
import { clearLoginAttempts, endAdminSession, isAdminRequest, isLoginRateLimited, recordFailedLogin, requireAdmin, startAdminSession, verifyAdminCredentials } from "../lib/auth";
import { upload, uploadImage } from "../lib/uploads";

export const blogRouter = Router();

// ---------- Public routes ----------

blogRouter.get("/posts", asyncHandler(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const tag = typeof req.query.tag === "string" ? req.query.tag : undefined;
  const posts = await listPublishedPosts({ category, tag });
  res.json({ posts });
}));

blogRouter.get("/posts/:slug", asyncHandler(async (req, res) => {
  const post = await getPostBySlug(req.params.slug);
  if (!post || post.status !== "published") {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  const related = await getRelatedPosts(post);
  res.json({ post, related });
}));

blogRouter.get("/categories", asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  res.json({ categories });
}));

// ---------- Admin auth ----------

blogRouter.post("/admin/login", asyncHandler(async (req, res) => {
  const ip = req.ip ?? "unknown";
  if (isLoginRateLimited(ip)) {
    res.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }

  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    recordFailedLogin(ip);
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  clearLoginAttempts(ip);
  startAdminSession(res);
  res.json({ authenticated: true });
}));

blogRouter.post("/admin/logout", (_req, res) => {
  endAdminSession(res);
  res.json({ authenticated: false });
});

blogRouter.get("/admin/session", (req, res) => {
  res.json({ authenticated: isAdminRequest(req) });
});

// ---------- Admin content management ----------

blogRouter.get("/admin/posts", requireAdmin, asyncHandler(async (_req, res) => {
  const posts = await listAllPosts();
  res.json({ posts });
}));

blogRouter.get("/admin/posts/:id", requireAdmin, asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json({ post });
}));

blogRouter.post("/admin/posts", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = blogPostInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }
  const post = await createPost(parsed.data);
  res.status(201).json({ post });
}));

blogRouter.put("/admin/posts/:id", requireAdmin, asyncHandler(async (req, res) => {
  const parsed = blogPostInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }
  const post = await updatePost(req.params.id, parsed.data);
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json({ post });
}));

blogRouter.delete("/admin/posts/:id", requireAdmin, asyncHandler(async (req, res) => {
  const removed = await deletePost(req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(204).end();
}));

blogRouter.post("/admin/upload", requireAdmin, upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  try {
    const url = await uploadImage(req.file);
    res.status(201).json({ url });
  } catch (err) {
    next(err);
  }
});
