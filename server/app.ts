import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import session from "express-session";
import path from "path";
import { blogRouter } from "./routes/blog";
import { enquiriesRouter } from "./routes/enquiries";
import { renderShell, resolvePageMeta, robotsTxt, sitemapXml } from "./lib/seo";
import { UPLOADS_DIR } from "./lib/uploads";

// The built client (`dist/public`) sits in a different place relative to this module
// depending on how the server is packaged (bundled dist/index.js next to dist/public
// vs. a Vercel function bundle rooted at the project directory), so callers resolve
// and pass in the absolute path rather than this module guessing from its own __dirname.
export function createApp(staticPath: string) {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(
    session({
      name: "ht_admin_session",
      secret: process.env.SESSION_SECRET || "dev-only-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8,
      },
    }),
  );

  // Uploaded images (featured images) — served before the API and the SPA fallback.
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Blog + admin API — must be mounted before the static/wildcard handlers below,
  // otherwise the wildcard route would swallow every /api request.
  app.use("/api", blogRouter);
  app.use("/api", enquiriesRouter);

  const uploadErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
  };
  app.use("/api", uploadErrorHandler);

  app.get("/robots.txt", (_req, res) => { res.type("text/plain").send(robotsTxt()); });
  app.get("/sitemap.xml", async (_req, res) => { res.type("application/xml").send(await sitemapXml()); });

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

  return app;
}
