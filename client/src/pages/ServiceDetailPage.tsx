import { ArrowLeft, ArrowRight, Check, FileText, MapPin, Phone, Users } from "lucide-react";
import { Link } from "wouter";
import { allServices, getServiceBySlug } from "@/data/services";
import { Layout, PageHero, facilities } from "./SitePages";
import { Seo } from "@/lib/seo";
import { absoluteUrl, breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@shared/seo";

/* Profile p.15 "Managing the Co-operation" — the same for every service, so it lives here
   rather than being repeated per entry in services.ts. */
const cooperation = [
  { icon: FileText, title: "A written SOP", copy: "Alongside the agreement we prepare a Standard Operating Procedure defining how we work together. It's a living document, changed as your business needs change." },
  { icon: Users, title: "A named team", copy: "A Key Account Manager, operational contacts and customer service, all briefed on your account." },
  { icon: Check, title: "A meeting routine", copy: "Monthly operational meetings on recent performance, quarterly business reviews of scope and improvements, and top management meeting at least once a year." },
];

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);

  if (!service) {
    return <Layout>
      <Seo page={{ path: `/${slug}/`, title: "Service not found | HT Logistics Solutions", description: "That service does not exist.", noindex: true }} />
      <PageHero eyebrow="HT LOGISTICS SOLUTIONS" title={<>Service<br /><em>Not Found</em></>} />
      <main><div className="wrap" style={{ paddingBlock: 80 }}>
        <p>Sorry, we couldn't find that service.</p>
        <Link href="/services/" className="outline-button" style={{ marginTop: 24 }}>Back to Services <ArrowRight /></Link>
      </div></main>
    </Layout>;
  }

  const related = (service.related ?? [])
    .map(s => allServices.find(x => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  /* Services with their own photograph get a full hero; the specialised ones (no image yet)
     fall back to a plain charcoal band rather than borrowing an unrelated picture. */
  const heroPhoto = service.heroImage ?? service.image;
  const heroStyle = heroPhoto
    ? { backgroundImage: `linear-gradient(95deg, rgba(12,11,11,.93) 0%, rgba(12,11,11,.78) 52%, rgba(12,11,11,.5) 100%), url(${heroPhoto})` }
    : undefined;

  const path = `/${service.slug}/`;
  const seoJsonLd = [
    serviceJsonLd({ name: service.title, description: service.summary, path, image: heroPhoto ? absoluteUrl(heroPhoto) : undefined }),
    breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services/" }, { name: service.title, path }]),
    ...(service.faqs?.length ? [faqJsonLd(service.faqs)] : []),
  ];

  return <Layout>
    <Seo page={{ path, title: `${service.title} | HT Logistics Solutions`, description: service.summary, image: heroPhoto ? absoluteUrl(heroPhoto) : undefined, jsonLd: seoJsonLd }} />
    <section className={heroPhoto ? "service-hero" : "service-hero is-plain"} style={heroStyle}>
      <div className="wrap">
        <Link href="/services/" className="service-crumb"><ArrowLeft />All services</Link>
        <h1>{service.title}</h1>
        <p>{service.summary}</p>
        <div className="service-hero-actions">
          <Link href="/contact-us/" className="hero-button">Request a quote <ArrowRight /></Link>
          <a href="tel:043997120" className="hero-ghost"><Phone />04-399 7120</a>
        </div>
      </div>
    </section>

    <main>
      <section className="service-body"><div className="wrap service-body-grid">
        <div className="service-overview">
          <span className="eyebrow red">OVERVIEW</span>
          {service.intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </div>
        <div className="service-included">
          <h2>What's included</h2>
          <ul>{service.highlights.map(item => <li key={item}><i><Check /></i>{item}</li>)}</ul>
        </div>
      </div></section>

      {service.pillars && service.pillars.length > 0 && <section className="service-pillars"><div className="wrap">
        <div className="section-heading"><span className="eyebrow red">CAPABILITIES</span><h2>What this service <em>gives you.</em></h2></div>
        <div className="service-ledger">
          {service.pillars.map(pillar => <div className="service-ledger-row" key={pillar.title}>
            <h3>{pillar.title}</h3>
            <p>{pillar.copy}</p>
          </div>)}
        </div>
      </div></section>}

      {service.handles && service.handles.length > 0 && <section className="service-handles"><div className="wrap">
        <div className="section-heading"><span className="eyebrow red">IN DETAIL</span><h2>What we <em>handle.</em></h2></div>
        <div className="service-handle-grid">
          {service.handles.map(group => <div className="service-handle" key={group.heading}>
            <h3>{group.heading}</h3>
            <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
          </div>)}
        </div>
      </div></section>}

      <section className="service-where"><div className="wrap">
        <div className="section-heading"><span className="eyebrow red">WHERE IT HAPPENS</span><h2>Delivered from our facilities across <em>Penang and Kedah.</em></h2></div>
        <div className="matrix-scroll"><table className="service-table">
          <thead><tr><th>Facility</th><th>Location</th><th>Floor space</th><th>Pallet positions</th><th>Storage</th></tr></thead>
          <tbody>
            {facilities.map(f => <tr key={f.name}>
              <td><strong>{f.name}</strong>{f.hq && <span className="service-table-tag">HQ</span>}</td>
              <td>{f.location}</td>
              <td className="is-num">{f.space}<small>m²</small></td>
              <td className="is-num">{f.pallets}</td>
              <td>{f.storage.join(", ")}</td>
            </tr>)}
          </tbody>
        </table></div>
      </div></section>

      <section className="service-coop"><div className="wrap">
        <div className="section-heading"><span className="eyebrow red">HOW WE WORK TOGETHER</span><h2>Set up properly, <em>then reviewed.</em></h2></div>
        <div className="service-coop-grid">
          {cooperation.map(({ icon: Icon, title, copy }) => <div className="service-coop-col" key={title}>
            <span className="service-coop-icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>)}
        </div>
      </div></section>

      {service.faqs && service.faqs.length > 0 && <section className="service-faq"><div className="wrap service-faq-grid">
        <aside className="service-faq-aside">
          <span className="eyebrow red">QUESTIONS</span>
          <h2>Asked and <em>answered.</em></h2>
          <p>The things customers ask before they book {service.title.toLowerCase()} with us. If yours isn't here, ask us directly.</p>
          <div className="service-faq-links">
            <a href="tel:043997120"><Phone />04-399 7120</a>
            <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer">WhatsApp 012-487 9121 <ArrowRight /></a>
          </div>
        </aside>
        <div className="service-faq-list">{service.faqs.map(([q, a], i) => <details className="service-faq-item" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </div></section>}

      {related.length > 0 && <section className="service-related"><div className="wrap">
        <div className="section-heading"><span className="eyebrow red">WORKS WELL WITH</span><h2>Often paired <em>with this.</em></h2></div>
        <div className="service-related-cols">
          {related.map(r => <Link href={`/${r.slug}/`} className="service-related-col" key={r.slug}>
            <h3>{r.title}</h3>
            <p>{r.summary}</p>
            <span>Explore <ArrowRight /></span>
          </Link>)}
        </div>
      </div></section>}

      <section className="service-cta"><div className="wrap service-cta-grid">
        <div>
          <h2>Let's scope your <em>{service.title.toLowerCase()}.</em></h2>
          <p>Tell us the volumes, locations and dates you're working to.</p>
        </div>
        <div className="service-cta-act">
          <Link href="/contact-us/" className="light-button">Request a quote <ArrowRight /></Link>
          <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer">WhatsApp 012-487 9121</a>
        </div>
      </div></section>
    </main>
  </Layout>;
}
