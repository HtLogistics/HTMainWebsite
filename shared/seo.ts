/* Single source of truth for page metadata and structured data, used by the client (to update the
   document head on navigation) and the server (to inject the same into index.html for crawlers
   that don't execute JavaScript). Framework-free on purpose. */

export const SITE = {
  name: "HT Logistics Solutions",
  legalName: "HT Logistics Solutions Sdn Bhd",
  registration: "201101019426 (1495599-H)",
  url: "https://htlogisticssolutions.com",
  phone: "+60 4-399 7120",
  mobile: "+60 12-487 9121",
  email: "admin@htlogisticssolutions.com",
  address: { street: "Plot 3, Hujung Perusahaan 1", locality: "Perai", region: "Pulau Pinang", postalCode: "13600", country: "MY" },
  founded: "2023",
  logoPath: "/logo.png",
  ogImagePath: "/og-default.jpg",
} as const;

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

export function absoluteUrl(path: string): string {
  return SITE.url.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: absoluteUrl(SITE.logoPath),
    foundingDate: SITE.founded,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: "Malaysia",
    contactPoint: [
      { "@type": "ContactPoint", telephone: SITE.phone, contactType: "customer service", areaServed: "MY", availableLanguage: ["en", "ms"] },
      { "@type": "ContactPoint", telephone: SITE.mobile, contactType: "sales", areaServed: "MY" },
    ],
  };
}

export function localBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#localbusiness"),
    name: SITE.name,
    image: absoluteUrl(SITE.ogImagePath),
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:30", closes: "17:00" }],
    parentOrganization: { "@id": absoluteUrl("/#organization") },
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return { "@context": "https://schema.org", "@type": "WebSite", url: SITE.url, name: SITE.name, publisher: { "@id": absoluteUrl("/#organization") } };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}

export function faqJsonLd(faqs: readonly (readonly [string, string])[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

export function serviceJsonLd(input: { name: string; description: string; path: string; image?: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: input.image } : {}),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: "Malaysia",
    serviceType: input.name,
  };
}

export function articleJsonLd(input: { headline: string; description: string; path: string; datePublished: string | null; dateModified: string; image?: string | null }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

/* Static pages. Service and article pages build their meta from their own data. */
export const STATIC_PAGES: Record<string, Omit<PageMeta, "path">> = {
  "/": {
    title: "HT Logistics Solutions | Integrated Warehousing & Supply Chain, Penang",
    description: "Integrated warehousing, transportation, manpower and supply chain services from five branches across Penang and Kulim. Bonded, temperature-controlled and cold storage. ISO 9001, 14001, 45001, TAPA and GDPMD certified.",
    jsonLd: [organizationJsonLd(), localBusinessJsonLd(), websiteJsonLd()],
  },
  "/about-us/": {
    title: "About HT Logistics Solutions | Established 2023, Headquartered in Penang",
    description: "A Malaysian logistics company established in 2023 with three main facilities across Penang and Kedah, 50,000 m² of warehouse capacity and over 200 active workers. Our vision, mission, values and way of working.",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about-us/" }])],
  },
  "/services/": {
    title: "Logistics Services | Warehousing, Transport, Kitting, Packaging & Manpower",
    description: "Fourteen logistics services from one provider: warehousing and distribution, kitting, packaging and labelling, transportation and manpower supply, plus nine specialised capabilities from cross-border trucking to WMS and TMS.",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }])],
  },
  "/latest-news/": {
    title: "Latest News | HT Logistics Solutions",
    description: "Company news, service updates and notes from HT Logistics Solutions' warehousing and transport operations across Penang and Kulim.",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Latest News", path: "/latest-news/" }])],
  },
  "/contact-us/": {
    title: "Contact HT Logistics Solutions | Penang, Prai & Kulim",
    description: "Call 04-399 7120, WhatsApp 012-487 9121 or send an enquiry. Plot 3, Hujung Perusahaan 1, 13600 Perai, Penang. Open Mon–Sat, 8.30am–5pm.",
    jsonLd: [localBusinessJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact-us/" }])],
  },
  "/privacy-policy/": { title: "Privacy Policy | HT Logistics Solutions", description: "What personal information HT Logistics Solutions collects through this website, how it is used and stored, third-party services, cookies, and your rights under the PDPA 2010." },
  "/terms-conditions/": { title: "Terms & Conditions | HT Logistics Solutions", description: "Terms governing use of the HT Logistics Solutions website: permitted use, content ownership, service information, enquiries, liability and governing law." },
  "/admin/": { title: "Admin | HT Logistics Solutions", description: "", noindex: true },
};
