import fs from "node:fs/promises";
import path from "node:path";
import { SITE, STATIC_PAGES, absoluteUrl, articleJsonLd, breadcrumbJsonLd, faqJsonLd, serviceJsonLd, type PageMeta } from "@shared/seo";
import { serviceCatalog as allServices } from "@shared/services-catalog";
import { listPublishedPosts } from "./postsStore";

/* Resolve the metadata for a request path. Unknown paths return null so the caller can send a
   real 404 status while still serving the SPA shell (the client then renders its Not Found view). */
export async function resolvePageMeta(pathname: string): Promise<PageMeta | null> {
  const p = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const staticPage = STATIC_PAGES[p];
  if (staticPage) return { ...staticPage, path: p };

  const slug = p.replace(/^\/|\/$/g, "");
  const service = allServices.find(s => s.slug === slug);
  if (service) {
    const jsonLd: Record<string, unknown>[] = [
      serviceJsonLd({ name: service.title, description: service.summary, path: p }),
      breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }, { name: service.title, path: p }]),
    ];
    if (service.faqs?.length) jsonLd.push(faqJsonLd(service.faqs));
    return { path: p, title: `${service.title} | HT Logistics Solutions`, description: service.summary, jsonLd };
  }

  const posts = await listPublishedPosts();
  const post = posts.find(x => x.slug === slug);
  if (post) {
    return {
      path: p,
      type: "article",
      title: post.seoTitle || `${post.title} | HT Logistics Solutions`,
      description: post.metaDescription || post.excerpt,
      image: post.featuredImage ? absoluteUrl(post.featuredImage) : undefined,
      jsonLd: [
        articleJsonLd({ headline: post.title, description: post.excerpt, path: p, datePublished: post.publishedAt, dateModified: post.updatedAt, image: post.featuredImage }),
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Latest News", path: "/latest-news/" }, { name: post.title, path: p }]),
      ],
    };
  }
  return null;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function headTags(page: PageMeta): string {
  const canonical = absoluteUrl(page.path);
  const image = page.image ?? absoluteUrl(SITE.ogImagePath);
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<meta name="robots" content="${page.noindex ? "noindex, nofollow" : "index, follow"}">`,
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:type" content="${page.type ?? "website"}">`,
    `<meta property="og:site_name" content="${esc(SITE.name)}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
    ...(page.jsonLd ?? []).map(block => `<script type="application/ld+json" data-seo>${JSON.stringify(block).replace(/</g, "\\u003c")}</script>`),
  ];
  return tags.join("\n    ");
}

let shellCache: string | null = null;

/* Inject per-route head tags into the built index.html. The static <title>/<meta description> in
   the shell are replaced so crawlers never see two of either. */
export async function renderShell(staticPath: string, page: PageMeta | null): Promise<string> {
  if (!shellCache || process.env.NODE_ENV !== "production") {
    shellCache = await fs.readFile(path.join(staticPath, "index.html"), "utf-8");
  }
  const fallback: PageMeta = { path: "/", title: STATIC_PAGES["/"].title, description: STATIC_PAGES["/"].description, noindex: true };
  const html = shellCache
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta name="description"[^>]*>\s*/i, "");
  return html.replace("</head>", `    ${headTags(page ?? fallback)}\n  </head>`);
}

export async function sitemapXml(): Promise<string> {
  const posts = await listPublishedPosts();
  const urls: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: "/", priority: "1.0" },
    { loc: "/services/", priority: "0.9" },
    { loc: "/about-us/", priority: "0.8" },
    { loc: "/contact-us/", priority: "0.8" },
    { loc: "/latest-news/", priority: "0.6" },
    ...allServices.map(s => ({ loc: `/${s.slug}/`, priority: "0.8" })),
    ...posts.map(p => ({ loc: `/${p.slug}/`, lastmod: p.updatedAt.slice(0, 10), priority: "0.5" })),
  ];
  const body = urls.map(u => `  <url><loc>${absoluteUrl(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.priority}</priority></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function robotsTxt(): string {
  return ["User-agent: *", "Allow: /", "Disallow: /admin/", "Disallow: /api/", "", `Sitemap: ${absoluteUrl("/sitemap.xml")}`, ""].join("\n");
}
