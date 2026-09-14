import { useEffect } from "react";
import { SITE, STATIC_PAGES, absoluteUrl, type PageMeta } from "@shared/seo";

const MANAGED = "data-seo";

function upsert(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void): void {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  apply(el);
}

function meta(attr: "name" | "property", key: string, content: string): void {
  upsert(`meta[${attr}="${key}"]`, () => { const m = document.createElement("meta"); m.setAttribute(attr, key); return m; }, el => el.setAttribute("content", content));
}

/* Keeps the document head in step with the current page: title, description, canonical, Open
   Graph / Twitter, robots and JSON-LD. The server injects the same for the first request; this
   takes over on client-side navigation. */
export function useSeo(page: PageMeta): void {
  useEffect(() => {
    const canonical = absoluteUrl(page.path);
    const image = page.image ?? absoluteUrl(SITE.ogImagePath);

    document.title = page.title;
    meta("name", "description", page.description);
    meta("name", "robots", page.noindex ? "noindex, nofollow" : "index, follow");
    meta("property", "og:type", page.type ?? "website");
    meta("property", "og:site_name", SITE.name);
    meta("property", "og:title", page.title);
    meta("property", "og:description", page.description);
    meta("property", "og:url", canonical);
    meta("property", "og:image", image);
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", page.title);
    meta("name", "twitter:description", page.description);
    meta("name", "twitter:image", image);
    upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.rel = "canonical"; return l; }, el => el.setAttribute("href", canonical));

    document.head.querySelectorAll(`script[type="application/ld+json"][${MANAGED}]`).forEach(s => s.remove());
    for (const block of page.jsonLd ?? []) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute(MANAGED, "");
      s.textContent = JSON.stringify(block);
      document.head.appendChild(s);
    }
  }, [page.title, page.description, page.path, page.type, page.image, page.noindex, JSON.stringify(page.jsonLd ?? [])]);
}

/* Drop-in for pages written as single JSX expressions. */
export function Seo({ page }: { page: PageMeta }): null {
  useSeo(page);
  return null;
}

export function staticPage(path: keyof typeof STATIC_PAGES): PageMeta {
  return { ...STATIC_PAGES[path], path };
}
