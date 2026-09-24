import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import multer from "multer";
import { asyncHandler } from "./lib/asyncHandler";
import path from "path";
import { blogRouter } from "./routes/blog";
import { enquiriesRouter } from "./routes/enquiries";
import { renderShell, resolvePageMeta, robotsTxt, sitemapXml } from "./lib/seo";

// The built client (`dist/public`) sits in a different place relative to this module
// depending on how the server is packaged (bundled dist/server.js next to dist/public
// vs. a Vercel function bundle rooted at the project directory), so callers resolve
// and pass in the absolute path rather than this module guessing from its own __dirname.
export function createApp(staticPath: string) {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());

  // Blog + admin API — must be mounted before the static/wildcard handlers below,
  // otherwise the wildcard route would swallow every /api request.
  app.use("/api", blogRouter);
  app.use("/api", enquiriesRouter);

  // Client mistakes (bad upload, malformed JSON) keep their message; anything else is a server
  // fault: log it here and answer generically so internal details never reach the browser.
  const apiErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const status = typeof err?.status === "number" ? err.status : err instanceof multer.MulterError ? 400 : 500;
    if (status >= 500) {
      console.error("API error:", err);
      res.status(500).json({ error: "Something went wrong on the server. Please try again." });
      return;
    }
    res.status(status).json({ error: err instanceof Error ? err.message : "Bad request" });
  };
  app.use("/api", apiErrorHandler);

  app.get("/robots.txt", (_req, res) => { res.type("text/plain").send(robotsTxt()); });
  app.get("/sitemap.xml", asyncHandler(async (_req, res) => { res.type("application/xml").send(await sitemapXml()); }));

  // Vite fingerprints everything under /assets, so those can be cached hard; index.html must not be.
  app.use("/assets", express.static(path.join(staticPath, "assets"), { immutable: true, maxAge: "1y" }));
  app.use(express.static(staticPath, { index: false }));

  // Client-side routing: serve the shell with per-route head tags injected. Unknown paths get a
  // real 404 status so crawlers don't index them, while the SPA still renders its Not Found view.
  app.get("*", async (req, res, next) => {
    try {
      const page = await resolvePageMeta(req.path);
      const html = await renderShell(staticPath, page);
      res.status(page ? 200 : 404).type("html").send(html);
    } catch (err) {
      next(err);
    }
  });

  // Last resort for non-API routes (the page shell, sitemap): log it, never show a stack trace.
  const fallbackErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("Server error:", err);
    res.status(500).type("text/plain").send("Something went wrong on the server. Please try again shortly.");
  };
  app.use(fallbackErrorHandler);

  return app;
}
