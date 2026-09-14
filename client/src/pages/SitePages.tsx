/* Ground-truth replication: HT Logistics Solutions WordPress site. Preserve the source's red/charcoal identity, full-bleed photography, overlaid white header, and content hierarchy. */
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { animate, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, Boxes, CheckCircle2, ClipboardCheck, Clock3, Eye, FileCheck, Handshake, HeartHandshake, Lightbulb, ListChecks, Mail, MapPin, Menu, MessageCircle, Network, PackageCheck, PackagePlus, Phone, ShieldCheck, Target, Truck, Users, Warehouse, X, Zap } from "lucide-react";
import type { BlogPost } from "@shared/blog";
import axios from "axios";
import { fetchPosts, submitEnquiry } from "@/lib/api";
import { Seo, staticPage } from "@/lib/seo";
import { privacyPolicy, termsConditions, type LegalDocument } from "@/data/legal";
import { allServices, coreServices, specialisedServices, type ServiceEntry } from "@/data/services";
import logoImg from "@/assets/ht-logistics.png";
import logoWhiteImg from "@/assets/ht-logistics-white.png";
import ctaSectionImg from "@/assets/cta-section.jpg";
import heroImg from "@/assets/red-trucks-1024x390.png";
import deliveryImg from "@/assets/delivery-1024x678.jpg";
import kittingImg from "@/assets/kitting.jpg";
import packagingImg from "@/assets/packaging-labelling.jpg";
import heroWarehouseImg from "@/assets/hero-warehouse.jpg";
import problemSectionImg from "@/assets/problem-section.jpg";
import faqSectionImg from "@/assets/faq-section.jpg";
import aboutWarehouseImg from "@/assets/about-warehouse.jpg";
import aboutHeroImg from "@/assets/about-hero.jpg";
import aboutCtaImg from "@/assets/about-cta.jpg";
import servicesHeroImg from "@/assets/services-hero.jpg";
import contactHeroImg from "@/assets/contact-hero.jpg";
import servicesCta1Img from "@/assets/services-cta-1.jpg";
import servicesCta2Img from "@/assets/services-cta-2.jpg";
import servicesCta3Img from "@/assets/services-cta-3.jpg";
import industryManufacturingImg from "@/assets/industry-manufacturing.jpg";
import industryAutomotiveImg from "@/assets/industry-automotive.jpg";
import industryRetailImg from "@/assets/industry-retail.jpg";
import industryMedicalImg from "@/assets/industry-medical.jpg";
import industryElectronicsImg from "@/assets/industry-electronics.jpg";
import industryFmcgImg from "@/assets/industry-fmcg.jpg";
import industryEcommerceImg from "@/assets/industry-e-commerce.jpg";
import industryIndustrialImg from "@/assets/industry-industrial.jpg";
import markImg from "@/assets/ht-logistics-favicon-300x300.png";
import isoImg from "@/assets/isocertification-removebg-preview.png";
import certificationImg from "@/assets/Untitled-4-removebg-preview.png";

const assets = {
  logo: logoImg,
  hero: heroImg,
  delivery: deliveryImg,
  iso: isoImg,
  certification: certificationImg,
};

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const navItems = [
  ["Home", "/"],
  ["About", "/about-us/"],
  ["Services", "/services/"],
  ["Latest News", "/latest-news/"],
] as const;

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner">
      <Link href="/" className="brand"><img src={assets.logo} alt="HT Logistics Solutions" /></Link>
      <nav className={open ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        {navItems.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link href="/contact-us/" className="nav-cta" onClick={() => setOpen(false)}>Contact Us</Link>
      </nav>
      <button className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

function Footer() {
  return <footer className="site-footer">
    <div className="footer-main wrap">
      <div className="footer-brand"><Link href="/"><img src={logoWhiteImg} alt="HT Logistics Solutions" /></Link><p>Integrated warehousing and supply chain solutions from Penang to the world.</p></div>
      <div><h4>Useful Links</h4><Link href="/">Home</Link><Link href="/about-us/">About</Link><Link href="/services/">Services</Link><Link href="/latest-news/">Latest News</Link><Link href="/contact-us/">Contact</Link></div>
      <div><h4>Services</h4>{coreServices.map(s => <Link key={s.slug} href={`/${s.slug}/`}>{s.title}</Link>)}</div>
      <div className="footer-contact"><h4>Contact</h4><a href="https://www.google.com/maps/dir//Plot+3,+Hujung+Perusahaan+1,+13600+Perai,+Pulau+Pinang" target="_blank"><MapPin />Plot 3, Hujung Perusahaan 1, 13600 Perai, Penang.</a><a href="tel:043997120"><Phone />04-399 7120</a><a href="tel:0124879121"><Phone />012-487 9121</a><a href="mailto:admin@htlogisticssolutions.com"><Mail />admin@htlogisticssolutions.com</a></div>
    </div>
    <div className="footer-bottom wrap"><span>© Copyright {new Date().getFullYear()} | HT Logistics Solutions Sdn Bhd 201101019426 (1495599-H). All Rights Reserved.<span className="footer-credit">Developed by <a href="https://aurexissolution.com" target="_blank" rel="noreferrer">Aurexis Solution</a></span></span><span><Link href="/privacy-policy/">Privacy Policy</Link><i>|</i><Link href="/terms-conditions/">Terms &amp; Conditions</Link></span></div>
  </footer>;
}

function FloatingWhatsApp() { return <a className="whatsapp" href="https://wa.me/60124879121" target="_blank" aria-label="Chat on WhatsApp"><MessageCircle /></a>; }
export function Layout({ children }: { children: React.ReactNode }) { return <><Header />{children}<Footer /><FloatingWhatsApp /></>; }

const heroSlides = [
  { title: <>A Total<br />Logistics Solutions Company</>, copy: "Keep your inventory safe, accessible, and efficiently managed with our secure storage solutions.", image: heroWarehouseImg },
  { title: <>Kitting</>, copy: "Streamlined assembly and grouping of product sets for faster fulfillment and efficient distribution.", image: kittingImg },
  { title: <>Packaging &amp; Labelling</>, copy: "Reliable packaging and accurate labelling that keep your products protected, compliant, and ready for distribution.", image: packagingImg },
];

function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive(v => (v + 1) % heroSlides.length), 6000); return () => window.clearInterval(timer); }, []);
  const slide = heroSlides[active];
  return <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.12) 70%), url(${slide.image})` }}>
    <div className="hero-content wrap"><span className="eyebrow">HT LOGISTICS SOLUTIONS</span><h1>{slide.title}</h1><p>{slide.copy}</p></div>
    <div className="hero-controls"><button onClick={() => setActive((active + heroSlides.length - 1) % heroSlides.length)} aria-label="Previous slide"><ArrowLeft /></button><span>{String(active + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span><button onClick={() => setActive((active + 1) % heroSlides.length)} aria-label="Next slide"><ArrowRight /></button></div>
    <a href="#trusted-solutions" className="scroll-down" aria-label="Scroll down"><ArrowDown /></a>
  </section>;
}

function ProblemSection() {
  const problems = [
    [Boxes, "Scattered Inventory", "Stock spread across locations with no real-time visibility into what's where."],
    [Clock3, "Unpredictable Deliveries", "Delays and missed windows that throw off your entire schedule."],
    [Network, "Too Many Vendors", "Separate providers for storage, packaging, and transport that don't talk to each other."],
  ] as const;
  return <section className="problem-section" style={{ backgroundImage: `linear-gradient(rgba(10,10,10,.86), rgba(10,10,10,.9)), url(${problemSectionImg})` }}><div className="wrap">
    <span className="eyebrow red">THE CHALLENGE</span>
    <h2>Running a supply chain<br /><em>shouldn't feel this hard.</em></h2>
    <p>Too many logistics operations juggle scattered inventory, unpredictable deliveries, and one too many vendors — HT Logistics brings it all under one roof.</p>
    <div className="problem-grid">{problems.map(([Icon, title, copy]) => <div className="problem-item" key={title}><Icon /><h3>{title}</h3><p>{copy}</p></div>)}</div>
  </div></section>;
}

function AboutTeaser() { return <section id="trusted-solutions" className="about-teaser wrap"><div className="about-image"><img src={aboutWarehouseImg} alt="Warehouse supervisor reviewing inventory on a tablet" /><span className="image-tag">TRUSTED SOLUTIONS</span></div><div className="col-divider" aria-hidden="true"></div><div className="about-copy"><span className="eyebrow red">ABOUT US</span><h2>Trusted and Optimal<br /><em>Logistics Solutions.</em></h2><p>HT Logistics Solutions was established in the year 2023 with its headquarter in Penang, Malaysia. Started as warehousing, HT Logistics subsequently ventured into manpower supply, kitting, packing, labelling &amp; transportation to local and oversea destination. HT Logistics currently providing its warehousing services in 5 branches in Penang and Kulim.</p><Link href="/about-us/" className="outline-button">About Us <ArrowRight /></Link><div className="certified"><span>Certified by</span><div className="cert-item"><img src={assets.certification} alt="TAPA Certification" /><small>TAPA Certified</small></div><div className="cert-item"><img src={assets.iso} alt="ISO 14001 Certification" /><small>ISO 14001 Certified</small></div></div></div></section>; }

function ServiceCards({ items }: { items: readonly ServiceEntry[] }) { return <div className="service-cards wrap">{items.map(s => <Link href={`/${s.slug}/`} className="service-card" key={s.slug}>{s.image && <img src={s.image} alt={s.title} />}<h3>{s.title}<ArrowRight /></h3><p>{s.summary}</p></Link>)}</div>; }

function ServicesStrip() { return <section className="services-section"><div className="wrap section-heading"><span className="eyebrow red">WHAT WE DO</span><h2>Discover Our <em>Services</em></h2><p>Comprehensive Solutions for Every Step of Your Supply Chain</p></div><ServiceCards items={coreServices} /></section>; }

const homepageStats = [
  { value: 90, suffix: "%", a: "Client", b: "Satisfaction" },
  { value: 200, suffix: "+", a: "Active", b: "Workers" },
  { value: 20, suffix: "", a: "Land", b: "Vehicles" },
  { value: 5, suffix: "", a: "Warehouse", b: "Branches" },
  { value: 50000, suffix: "", a: "Warehouse Capacity", b: "(sqm)" },
] as const;

function useCountUp(value: number, active: boolean) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    const controls = animate(0, value, { duration: 1.6, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [active, value]);
  return display;
}

function CountUpStat({ value, suffix, a, b }: { value: number; suffix: string; a: string; b: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const display = useCountUp(value, inView);
  return <div className="stat" ref={ref}>
    <svg className="stat-tick" width="44" height="10" viewBox="0 0 44 10" fill="none" aria-hidden="true">
      <line x1="0" y1="5" x2="44" y2="5" stroke="#fff" strokeWidth="1" />
      <line x1="0.5" y1="1" x2="0.5" y2="9" stroke="#fff" strokeWidth="1" />
      <line x1="22" y1="2.5" x2="22" y2="7.5" stroke="#fff" strokeWidth="1" />
      <line x1="43.5" y1="1" x2="43.5" y2="9" stroke="#fff" strokeWidth="1" />
    </svg>
    <strong>{display.toLocaleString()}<sup>{suffix}</sup></strong><span>{a}<br />{b}</span>
  </div>;
}

/* Services stats: one full-width band, hairline-ruled like a spec sheet. The lead figure gets a
   wider column and larger type; the red rule above each number draws in, staggered. */
function CapacityStat({ s, index, lead = false }: { s: typeof homepageStats[number]; index: number; lead?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const display = useCountUp(s.value, inView);
  const reduce = useReducedMotion();
  return <div className={lead ? "cap-stat is-lead" : "cap-stat"} ref={ref}>
    <motion.i className="cap-rule" initial={reduce ? false : { scaleX: 0 }} animate={inView ? { scaleX: 1 } : undefined} transition={{ duration: .5, delay: index * .1, ease: [.2, .8, .2, 1] }} />
    <strong>{display.toLocaleString()}<sup>{s.suffix}</sup></strong>
    <span>{s.a} {s.b}</span>
  </div>;
}

/* Home renders the plain red band (`<Stats />`, markup unchanged). Services passes `routes` + a
   heading for the charcoal capacity band, which leads with warehouse capacity. */
function Stats({ heading, routes = false }: { heading?: React.ReactNode; routes?: boolean }) {
  if (!routes) return <section className="stats-section"><div className="wrap stats-grid">{homepageStats.map(s => <CountUpStat key={s.a} {...s} />)}</div></section>;
  const ordered = [homepageStats[homepageStats.length - 1], ...homepageStats.slice(0, -1)];
  return <section className="stats-section stats-routes"><div className="wrap">
    {heading && <div className="section-heading stats-heading">{heading}</div>}
    <div className="capacity-band">{ordered.map((s, i) => <CapacityStat s={s} index={i} lead={i === 0} key={s.a} />)}</div>
  </div></section>;
}

const companyValues = [
  [Users, "Teamwork", "Working together to achieve operational excellence and customer success."],
  [ShieldCheck, "Integrity", "Maintaining honesty, transparency, and accountability."],
  [Lightbulb, "Innovation", "Continuously improving through technology and new ideas."],
  [Zap, "Dynamism", "Adapting quickly to changing customer and market needs."],
  [Handshake, "Professionalism", "Delivering reliable and high-quality services."],
] as const;

/* The five values are HT Logistics' real, official ones, so they legitimately appear on
   both Home and About — but each page frames them differently rather than repeating
   an identical block. Home leads with the company quote; About omits it, since that
   page already carries the founder quote. */
function Values({ title = <>Built on trust.<br /><em>Driven by people.</em></>, showQuote = true }: { title?: React.ReactNode; showQuote?: boolean }) {
  return <section className="values-section wrap">
    <div className="values-intro">
      {showQuote && <span className="quote-mark">“</span>}
      <span className="eyebrow red">OUR CORE VALUES</span>
      <h2>{title}</h2>
      {showQuote && <blockquote className="values-quote">
        Quality of services shall always be guaranteed and improved by the attitude of employees thinking from the customer's point of view, creative ideas and wisdom and ingenuity.
        <cite>— HT Logistics Solutions</cite>
      </blockquote>}
    </div>
    <div className="value-list">{companyValues.map(([Icon, title, copy]) => <div className="value-item" key={title}><Icon /><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
  </section>;
}

/* About-page variant of the values block: names stacked large on the left, the hovered/focused
   value's description shown large on the right. Below 800px the interactive grid is hidden and a
   plain static list (reusing .value-list) renders instead. */
function ValuesSpotlight() {
  const [active, setActive] = useState(0);
  const [ActiveIcon, activeTitle, activeCopy] = companyValues[active];
  return <section className="values-spotlight"><div className="wrap">
    <div className="spotlight-grid">
      <div className="spotlight-nav">
        <span className="eyebrow red">OUR CORE VALUES</span>
        <h2 className="spotlight-title">The principles behind<br /><em>every shipment.</em></h2>
        <p className="spotlight-lead">Five values that shape how our team works, from the warehouse floor to final delivery.</p>
        <ul role="tablist" aria-label="Our core values">{companyValues.map(([, title], i) => <li key={title}>
          <button type="button" role="tab" id={`value-tab-${i}`} aria-selected={i === active} aria-controls="value-panel" tabIndex={i === active ? 0 : -1} className={i === active ? "is-active" : undefined}
            onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
            onKeyDown={e => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const n = (i + (e.key === "ArrowDown" ? 1 : companyValues.length - 1)) % companyValues.length; setActive(n); document.getElementById(`value-tab-${n}`)?.focus(); } }}>
            {title}
          </button>
        </li>)}</ul>
      </div>
      <div className="spotlight-panel" role="tabpanel" id="value-panel" aria-labelledby={`value-tab-${active}`}>
        <span className="spotlight-ghost" aria-hidden="true" key={`ghost-${active}`}>{activeTitle}</span>
        <div className="spotlight-body" key={active}><span className="spotlight-icon"><ActiveIcon /></span><h3>{activeTitle}</h3><p>{activeCopy}</p></div>
        <div className="spotlight-progress" aria-hidden="true">{companyValues.map(([, title], i) => <i key={title} className={i === active ? "is-active" : undefined} />)}<span>0{active + 1} / 0{companyValues.length}</span></div>
      </div>
    </div>
    <div className="spotlight-static">
      <span className="eyebrow red">OUR CORE VALUES</span>
      <div className="value-list">{companyValues.map(([Icon, title, copy]) => <div className="value-item" key={title}><Icon /><div><h3>{title}</h3><p>{copy}</p></div></div>)}</div>
    </div>
  </div></section>;
}

const faqs = [
  ["Where are your warehouses located?", "Our headquarters is at Science Park, Bukit Minyak in Pulau Pinang, with further facilities at Prai Industrial Park in Seberang Prai and Kulim Industrial Park in Kedah — five branches across Penang and Kulim in total."],
  ["Do you offer bonded or temperature-controlled storage?", "Yes. We operate FTZ, bonded and non-bonded facilities, with temperature-controlled, cold and ambient storage options to suit different product requirements."],
  ["What transport coverage do you provide?", "Nationwide FTL and LTL transport across Malaysia, cross-border trucking to regional markets, and last-mile delivery — all supported by real-time tracking through our Transport Management System."],
  ["Can you handle import/export and customs?", "Yes. Our team handles import and export clearance and customs documentation, and assists with duty exemptions, HS code registration, import permits and Licensed Manufacturing Warehouse (LMW) applications."],
  ["What certifications do you hold?", "HT Logistics Solutions is certified to ISO 9001, ISO 14001 and ISO 45001, and holds TAPA and GDPMD certification for supply chain security and good distribution practice."],
  ["How do I get a quote?", "Send us your requirements through the contact form, call 04-399 7120, or message us on WhatsApp. Our team will get back to you promptly with a tailored proposal."],
] as const;

function FaqSection() {
  return <section className="faq-section" style={{ backgroundImage: `linear-gradient(rgba(10,10,10,.86), rgba(10,10,10,.9)), url(${faqSectionImg})` }}><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">FAQ</span><h2>Questions, <em>answered.</em></h2><p>The things prospective customers ask us most often.</p></div>
    <div className="faq-list">{faqs.map(([q, a], i) => <details className="faq-item" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>
  </div></section>;
}

function NewsSection() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  useEffect(() => { fetchPosts().then(setPosts).catch(() => setPosts([])); }, []);
  if (posts === null) return null;
  const items = posts.slice(0, 3);
  return <section className="news-section wrap">
    <div className="section-heading"><span className="eyebrow red">FROM OUR BLOG</span><h2>Latest <em>News</em></h2><p>Stay Updated on Our Growth, Innovations &amp; Milestones</p></div>
    <div className="news-index">{items.map(post => {
      const d = post.publishedAt ? new Date(post.publishedAt) : null;
      return <Link href={`/${post.slug}/`} className="news-index-row" key={post.id}>
        <div className="news-date"><strong>{d ? d.getDate() : "—"}</strong><span>{d ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}</span></div>
        <div className="news-index-content"><h3>{post.title}</h3><p>{post.excerpt}</p></div>
        <img src={post.featuredImage || assets.delivery} alt={post.title} />
      </Link>;
    })}
    {items.length === 0 && <p className="news-empty">No articles published yet. Check back soon.</p>}
    </div>
    <Link href="/latest-news/" className="outline-button">View More <ArrowRight /></Link>
  </section>;
}

export function ContactBanner() {
  return <section className="contact-banner" style={{ backgroundImage: `linear-gradient(rgba(10,10,10,.87), rgba(10,10,10,.91)), url(${ctaSectionImg})` }}><div className="wrap">
    <div className="contact-cta-grid">
      <div className="contact-cta-copy">
        <span className="eyebrow">READY WHEN YOU ARE</span>
        <h2>Ready to Streamline Your Logistics?<br /><em>Talk to Us!</em></h2>
        <Link href="/contact-us/" className="light-button">Contact Us <ArrowRight /></Link>
      </div>
      <div className="contact-cta-channels">
        <a className="channel-row" href="tel:043997120"><Phone /><div><span>Phone</span><strong>04-399 7120</strong></div></a>
        <a className="channel-row" href="https://wa.me/60124879121" target="_blank" rel="noreferrer"><MessageCircle /><div><span>WhatsApp</span><strong>012-487 9121</strong></div></a>
        <a className="channel-row" href="mailto:admin@htlogisticssolutions.com"><Mail /><div><span>Email</span><strong>admin@htlogisticssolutions.com</strong></div></a>
        <div className="channel-row"><Clock3 /><div><span>Working Hours</span><strong>Mon – Sat, 8.30am – 5pm</strong></div></div>
      </div>
    </div>
    <p className="contact-cta-creds">Certified to ISO 9001, ISO 14001, ISO 45001, TAPA and GDPMD.</p>
  </div></section>;
}

/* About-page closing band. Same footprint as ContactBanner but a red duotone over a different
   photo, next-step copy, and the three main facilities (real data from `facilities`) in place
   of the contact channels, so it doesn't repeat the Home CTA. */
function AboutContactBanner() {
  return <section className="contact-banner about-cta" style={{ backgroundImage: `linear-gradient(105deg, rgba(14,12,12,.9) 0%, rgba(34,12,14,.84) 55%, rgba(110,14,20,.72) 100%), url(${aboutCtaImg})` }}><div className="wrap">
    <div className="contact-cta-grid">
      <div className="contact-cta-copy">
        <span className="eyebrow">NEXT STEP</span>
        <h2>Now that you know us,<br /><em>let's talk about your cargo.</em></h2>
        <div className="cta-actions">
          <Link href="/services/" className="light-button">Explore our services <ArrowRight /></Link>
          <Link href="/contact-us/" className="outline-button">Contact us</Link>
        </div>
      </div>
      <div className="site-list">
        <strong className="site-title">Three main facilities across Penang and Kedah</strong>
        {facilities.map(f => <div className="site-row" key={f.name}><MapPin /><div><b>{f.name}</b><small>{f.location}</small></div>{f.hq && <span className="site-tag">HQ</span>}</div>)}
      </div>
    </div>
    <p className="contact-cta-creds">Open Mon – Sat, 8.30am – 5pm. Call <a href="tel:043997120">04-399 7120</a> or WhatsApp <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer">012-487 9121</a>.</p>
  </div></section>;
}

export function HomePage() { return <Layout><Seo page={staticPage("/")} /><main><Hero /><AboutTeaser /><ProblemSection /><ServicesStrip /><Stats /><Values /><FaqSection /><NewsSection /><ContactBanner /></main></Layout>; }

/* Passing `copy` or `cta` upgrades this from a title band into a full hero (taller,
   supporting copy, CTA, scroll cue). Pages that pass neither keep the compact version. */
export function PageHero({ eyebrow, title, image = assets.hero, copy, cta, scrollTarget }: { eyebrow: string; title: React.ReactNode; image?: string; copy?: string; cta?: { label: string; href: string }; scrollTarget?: string }) {
  const full = Boolean(copy || cta);
  const longTitle = typeof title === "string" && title.length > 32;
  return <section className={`page-hero${full ? " page-hero-full" : ""}${longTitle ? " is-long-title" : ""}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.38)), url(${image})` }}>
    <div className="wrap">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {copy && <p>{copy}</p>}
      {cta && <Link href={cta.href} className="hero-button">{cta.label} <ArrowRight /></Link>}
    </div>
    {scrollTarget && <a href={`#${scrollTarget}`} className="scroll-down" aria-label="Scroll down"><ArrowDown /></a>}
  </section>;
}

/* Kept intentionally team-level rather than naming an individual — HT Logistics does not
   want a specific founder identified on the public site. */
function CompanyStatementSection() {
  return <section className="founder-section wrap">
    <div className="founder-stat"><strong>2023</strong><span>Established in Penang, Malaysia</span></div>
    <div className="founder-copy">
      <span className="eyebrow red">HOW WE OPERATE</span>
      <blockquote className="values-quote">
        We started as a single warehousing operation in 2023. Every service we've added since — kitting, packaging, transportation, manpower supply — exists because a client needed it done properly, in-house, by a team that treats their supply chain like its own.
        <cite>— The HT Logistics Team</cite>
      </blockquote>
    </div>
  </section>;
}

/* Specs per facility from the company profile's Warehouse Network page. Storage
   chips are the profile's own descriptors split out ("Bonded & Non-Bonded" → two chips). */
export const facilities = [
  { name: "Science Park", location: "Bukit Minyak, Pulau Pinang", space: "17,400", pallets: "4,000", storage: ["Bonded & non-bonded", "Temperature-controlled", "Cold storage"], hq: true },
  { name: "Prai Industrial Park", location: "Seberang Prai, Penang", space: "8,500", pallets: "6,000", storage: ["Bonded & non-bonded", "Temperature-controlled", "Ambient storage"], hq: false },
  { name: "Kulim Industrial Park", location: "Kulim, Kedah", space: "4,000", pallets: "4,000", storage: ["Bonded & non-bonded", "Temperature-controlled"], hq: false },
] as const;

const storageTypes = ["Bonded & non-bonded", "Temperature-controlled", "Cold storage", "Ambient storage"] as const;

/* Rendered as a real table: facilities are columns, specs are rows, so the three
   sites' figures sit side by side and are directly comparable. */
function FacilitiesSection() {
  return <section className="facilities-section"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">WAREHOUSE NETWORK</span><h2>Our Main <em>Facilities</em></h2><p>Strategically located across Penang and Kedah to support efficient storage, inventory management and distribution.</p></div>
    <div className="matrix-scroll"><table className="facility-matrix">
      <thead><tr>
        <th scope="col"><span className="sr-only">Specification</span></th>
        {facilities.map(f => <th scope="col" key={f.name}>
          {f.hq && <span className="matrix-badge">Headquarters</span>}
          <strong>{f.name}</strong>
          <span className="matrix-loc"><MapPin />{f.location}</span>
        </th>)}
      </tr></thead>
      <tbody className="matrix-figures">
        <tr><th scope="row">Floor space</th>{facilities.map(f => <td key={f.name}><span className="matrix-figure">{f.space}<small>m²</small></span></td>)}</tr>
        <tr><th scope="row">Pallet capacity</th>{facilities.map(f => <td key={f.name}><span className="matrix-figure">{f.pallets}</span></td>)}</tr>
      </tbody>
      <tbody className="matrix-storage">
        {storageTypes.map(type => <tr key={type}>
          <th scope="row">{type}</th>
          {facilities.map(f => <td key={f.name}>{(f.storage as readonly string[]).includes(type) ? <span className="matrix-dot" aria-label="Available" /> : <span className="matrix-dash" aria-label="Not available">—</span>}</td>)}
        </tr>)}
      </tbody>
    </table></div>
    <div className="matrix-cards">{facilities.map(f => <div className="matrix-card" key={f.name}>
      {f.hq && <span className="matrix-badge">Headquarters</span>}
      <strong>{f.name}</strong>
      <span className="matrix-loc"><MapPin />{f.location}</span>
      <div className="matrix-card-figures">
        <div><span className="matrix-figure">{f.space}<small>m²</small></span><span>Floor space</span></div>
        <div><span className="matrix-figure">{f.pallets}</span><span>Pallet capacity</span></div>
      </div>
      <ul className="matrix-card-storage">{f.storage.map(type => <li key={type}>{type}</li>)}</ul>
    </div>)}</div>
  </div></section>;
}

const workflowSteps = [
  [PackagePlus, "Receiving"], [ClipboardCheck, "Inspection"], [Warehouse, "Warehousing"], [ListChecks, "Inventory Management"],
  [FileCheck, "Order Processing"], [PackageCheck, "Packaging"], [Truck, "Transportation"], [CheckCircle2, "Delivery"],
] as const;

/* The rail is scrubbed by scroll: a red line runs left to right as the section passes through the
   viewport and each step lights up as the shipment reaches it. Fully lit under reduced motion. */
function WorkflowSection({ tone }: { tone?: "grey" }) {
  const railRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 95%", "end 25%"] });
  const fillScale = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: .001 });
  const [reached, setReached] = useState(0);
  // driven by the smoothed value so each dot lights exactly as the visible line reaches it
  useMotionValueEvent(fillScale, "change", v => setReached(Math.round(v * workflowSteps.length)));
  const lit = reduce ? workflowSteps.length : reached;
  return <section className={tone === "grey" ? "workflow-section is-grey" : "workflow-section"}><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">HOW WE WORK</span><h2>From receiving to <em>delivery.</em></h2><p>Every shipment moves through the same disciplined eight-step process.</p></div>
    <div className="workflow-rail" ref={railRef}>
      <motion.i className="wf-fill" style={reduce ? { scaleX: 1 } : { scaleX: fillScale }} aria-hidden="true" />
      {workflowSteps.map(([, label], i) => <div className={`wf-step ${i % 2 === 0 ? "is-above" : "is-below"}${i < lit ? " is-on" : ""}`} key={label}>
      <div className="wf-label"><span>{String(i + 1).padStart(2, "0")}</span><h3>{label}</h3></div>
      <i className="wf-dot" />
    </div>)}</div>
  </div></section>;
}

const commitments = [
  ["Safety", "Prioritising safe operations and responsible handling of every shipment."],
  ["Reliability", "Delivering dependable logistics services with consistency and professionalism."],
  ["Customer Focus", "Providing responsive, flexible solutions tailored to customer needs."],
  ["Operational Efficiency", "Enhancing processes through innovation and operational excellence."],
  ["Continuous Improvement", "Optimising logistics workflows to support business growth."],
] as const;

function CommitmentSection() {
  return <section className="commitment-section"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">COMMITMENT TO EXCELLENCE</span><h2>How we hold ourselves <em>to account.</em></h2><p>Delivering safe, reliable, customer-focused logistics through continuous improvement and operational excellence.</p></div>
    <div className="commitment-list">{commitments.map(([title, copy]) => <div className="commitment-row" key={title}><h3>{title}<span className="commitment-dot">.</span></h3><p>{copy}</p></div>)}</div>
  </div></section>;
}

/* Capability points as listed in the company profile — the profile provides labels only,
   no descriptions, so none are invented here. */
const whyChoose = [
  "Integrated Logistics Solutions", "Warehousing Expertise", "Strategic Locations",
  "Temperature Controlled Facilities", "Skilled Workforce", "Reliable Transportation Network",
  "Customer Centric Service", "Sustainable Business Practices", "Continuous Innovation",
] as const;

function WhyChooseSection() {
  return <section className="why-choose-section"><div className="wrap why-ledger">
    <div className="why-ledger-intro"><span className="eyebrow red">WHY CHOOSE US</span><h2>What you get with <em>HT Logistics.</em></h2><p>Nine reasons businesses across Penang and Kedah trust us with their supply chain.</p></div>
    <ul className="why-list">{whyChoose.map(item => <li key={item}>{item}</li>)}</ul>
  </div></section>;
}

const industries: { name: string; image: string }[] = [
  { name: "Manufacturing", image: industryManufacturingImg },
  { name: "Automotive", image: industryAutomotiveImg },
  { name: "Retail", image: industryRetailImg },
  { name: "Medical", image: industryMedicalImg },
  { name: "Electronics", image: industryElectronicsImg },
  { name: "FMCG", image: industryFmcgImg },
  { name: "E-commerce", image: industryEcommerceImg },
  { name: "Industrial", image: industryIndustrialImg },
];

function IndustriesSection() {
  return <section className="industries-section"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">WHO WE SERVE</span><h2>Industries we <em>support.</em></h2><p>Our logistics capabilities are designed to support businesses across a wide range of industries.</p></div>
    <div className="industry-strips">{industries.map(({ name, image }) => <div className="industry-strip" key={name}>{image && <img src={image} alt="" loading="lazy" />}<span className="industry-name">{name}</span></div>)}</div>
  </div></section>;
}

export function AboutPage() { return <Layout><Seo page={staticPage("/about-us/")} /><PageHero eyebrow="ABOUT HT LOGISTICS" title={<>Moving business<br /><em>forward, together.</em></>} image={aboutHeroImg} copy="A Malaysian logistics company providing integrated warehousing, transportation and supply chain solutions from Penang since 2023." cta={{ label: "Our Services", href: "/services/" }} scrollTarget="who-we-are" /><main><section id="who-we-are" className="about-intro">
      <img className="about-intro-mark" src={markImg} alt="" aria-hidden="true" />
      <div className="wrap">
        <div className="about-intro-grid">
          <div className="about-intro-head">
            <span className="eyebrow red">WHO WE ARE</span>
            <h2>Trusted and Optimal<br /><em>Logistics Solutions.</em></h2>
          </div>
          <div className="about-intro-copy">
            <p>HT Logistics Solutions was established in the year 2023 with its headquarter in Penang, Malaysia. Started as warehousing, HT Logistics subsequently ventured into manpower supply, kitting, packing, labelling &amp; transportation to local and oversea destination. HT Logistics currently providing its warehousing services in 5 branches in Penang and Kulim.</p>
            <p>Beginning as a warehousing specialist, the company has steadily expanded to become an integrated logistics service provider — today supporting businesses across multiple industries through flexible warehousing, transportation, manpower solutions and value-added logistics services designed to improve operational efficiency.</p>
          </div>
        </div>
        <div className="about-facts-strip">
          <div className="about-fact"><strong>2023</strong><span>Established</span></div>
          <div className="about-fact"><strong>15+</strong><span>Years of team experience</span></div>
          <div className="about-fact"><strong>Penang</strong><span>Headquarters</span></div>
          <div className="about-fact"><strong>5</strong><span>Facilities across Penang &amp; Kulim</span></div>
          <div className="about-fact"><strong>200+</strong><span>Active workers</span></div>
        </div>
      </div>
    </section><section className="vision-grid">
      <div><span className="vision-icon"><Eye /></span><span className="eyebrow">VISION</span><h2>Premier logistics partner.</h2><p>Setting industry standards in Malaysia and beyond.</p></div>
      <div><span className="vision-icon"><Target /></span><span className="eyebrow">MISSION</span><h2>Sustainability, innovation, and integrity.</h2><p>Delivering integrated logistics excellence while empowering communities.</p></div>
      <div><span className="vision-icon"><HeartHandshake /></span><span className="eyebrow">VALUES</span><h2>Guided by five core values.</h2><p>Teamwork, integrity, innovation, dynamism and professionalism.</p></div>
    </section><CompanyStatementSection /><FacilitiesSection /><WorkflowSection /><CommitmentSection /><IndustriesSection /><WhyChooseSection /><ValuesSpotlight /><AboutContactBanner /></main></Layout>; }

/* ---------- Services page ---------- */

/* The five stages goods pass through, and what HT covers at each. The red bar spanning all five
   columns is the section's argument: one provider across the whole chain. It draws itself once,
   on scroll. Capabilities listed are real services from services.ts / the company profile. */
const chainStages = [
  ["Inbound", ["Receiving and put-away", "Import, export and customs support"]],
  ["Storage", ["Bonded and non-bonded", "Temperature-controlled and cold", "Warehouse management system"]],
  ["Handling", ["Kitting", "Packaging and labelling", "Pick and pack", "Value-added services"]],
  ["Transport", ["Nationwide FTL and LTL", "Cross-border trucking", "Transport management system"]],
  ["Delivery", ["Last-mile delivery", "Distribution", "Real-time tracking"]],
] as const;

function ServicesIntro() {
  const reduce = useReducedMotion();
  return <section className="services-intro"><div className="wrap">
    <div className="services-intro-top">
      <div><span className="eyebrow red">INTEGRATED LOGISTICS</span><h2>One provider for<br /><em>the whole chain.</em></h2></div>
      <p>Warehousing, transportation, manpower and the systems that track them all sit with a single provider. That means one team accountable for your goods from inbound receipt to final delivery, across bonded, temperature-controlled and cold storage.</p>
    </div>
    <div className="chain">
      <div className="chain-stages">{chainStages.map(([stage, items]) => <div className="chain-stage" key={stage}>
        <h3>{stage}</h3>
        <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
      </div>)}</div>
      <motion.div className="chain-bar" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .9, ease: [.2, .8, .2, 1] }}>
        <span>One team accountable at every stage</span>
      </motion.div>
      <div className="chain-links">
        <a href="#core-services">The five core services <ArrowRight /></a>
        <a href="#capabilities">The nine specialised capabilities <ArrowRight /></a>
      </div>
    </div>
  </div></section>;
}

function FeatureRow({ s, flipped }: { s: ServiceEntry; flipped: boolean }) {
  const reduce = useReducedMotion();
  return <motion.div className={flipped ? "feature-row is-flipped" : "feature-row"} initial={reduce ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .6, ease: [.2, .8, .2, 1] }}>
    <div className="feature-media">{s.image && <img src={s.image} alt={s.title} loading="lazy" />}</div>
    <div className="feature-copy">
      <h3>{s.title}</h3>
      <p>{s.intro[0]}</p>
      <ul className="feature-highlights">{s.highlights.map(h => <li key={h}>{h}</li>)}</ul>
      <Link href={`/${s.slug}/`} className="outline-button">Explore {s.title} <ArrowRight /></Link>
    </div>
  </motion.div>;
}

function ServiceFeatureRows() {
  return <section className="feature-rows" id="core-services"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">CORE SERVICES</span><h2>The five services <em>we're built on.</em></h2><p>Warehousing, kitting, packaging, transport and manpower, delivered by our own teams from our own facilities.</p></div>
    {coreServices.map((s, i) => <FeatureRow s={s} flipped={i % 2 === 1} key={s.slug} />)}
  </div></section>;
}

/* The nine specialised services grouped by where they sit in the supply chain. Grouping only —
   titles and summaries come from services.ts. */
const capabilityGroups = [
  { icon: Truck, name: "Transport", line: "Moving goods across Malaysia and across borders.", slugs: ["nationwide-ftl-ltl-transport", "cross-border-trucking", "last-mile-delivery"] },
  { icon: Boxes, name: "Warehouse operations", line: "Everything that happens between inbound and dispatch.", slugs: ["supply-chain-solutions", "pick-pack-operations", "value-added-services", "import-export-customs-support"] },
  { icon: Network, name: "Technology", line: "Visibility and control over inventory and fleet.", slugs: ["warehouse-management-system-wms", "transport-management-system-tms"] },
] as const;

function CapabilityGroups() {
  return <section className="capability-section" id="capabilities"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">BEYOND THE BASICS</span><h2>Specialised <em>Capabilities</em></h2><p>Nine further capabilities for complex, cross-border and technology-driven operations, grouped by where they fit in your supply chain.</p></div>
    <div className="capability-groups">{capabilityGroups.map(({ icon: Icon, name, line, slugs }) => <div className="capability-group" key={name}>
      <div className="capability-head"><span className="capability-icon"><Icon /></span><h3>{name}</h3><p>{line}</p></div>
      <div className="capability-list">{slugs.map(slug => { const s = specialisedServices.find(x => x.slug === slug); return s ? <Link href={`/${s.slug}/`} className="capability-item" key={slug}><div><h4>{s.title}</h4><p>{s.summary}</p></div><ArrowRight /></Link> : null; })}</div>
    </div>)}</div>
  </div></section>;
}

/* Full-height Services hero: headline, lead, two actions, and a service index strip along the
   bottom linking straight to the five core service pages. TODO: swap `heroImg` for the dedicated
   services hero photo once generated. */
function ServicesHero() {
  return <section className="page-hero page-hero-full services-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.25) 100%), url(${servicesHeroImg})` }}>
    <div className="wrap">
      <span className="eyebrow">WHAT WE OFFER</span>
      <h1>Logistics services<br /><em>built around your operation.</em></h1>
      <p>Fourteen services across warehousing, transport, manpower and technology, delivered from five branches in Penang and Kulim.</p>
      <div className="hero-actions">
        <Link href="/contact-us/" className="hero-button">Talk to us <ArrowRight /></Link>
        <a href="#core-services" className="hero-ghost">See our core services <ArrowDown /></a>
      </div>
    </div>
    <div className="hero-index"><div className="wrap hero-index-row">{coreServices.map(s => <Link href={`/${s.slug}/`} key={s.slug}>{s.title}<ArrowRight /></Link>)}</div></div>
  </section>;
}

/* Services-page closing strip: deliberately short and type-led. Home lists contact details and
   About lists facilities; this one just asks for the next step. */
function ServicesContactBanner() {
  const panels = [servicesCta1Img, servicesCta2Img, servicesCta3Img];
  return <section className="services-cta">
    <div className="services-cta-bg" aria-hidden="true">{panels.map((src, i) => <img key={i} src={src} alt="" loading="lazy" />)}</div>
    <div className="wrap services-cta-grid">
    <div>
      <h2>Tell us what <em>you're moving.</em></h2>
      <p>Warehousing, transport, manpower or the whole chain — we'll scope it with you.</p>
    </div>
    <div className="services-cta-act">
      <Link href="/contact-us/" className="light-button">Request a quote <ArrowRight /></Link>
      <span className="services-cta-links">
        <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer">WhatsApp 012-487 9121</a>
        <a href="tel:043997120">Call 04-399 7120</a>
      </span>
    </div>
    </div>
  </section>;
}

export function ServicesPage() { return <Layout><Seo page={staticPage("/services/")} /><ServicesHero /><main><ServicesIntro /><ServiceFeatureRows /><Stats routes heading={<><span className="eyebrow">THE NUMBERS</span><h2>Capacity you can <em>count on.</em></h2></>} /><CapabilityGroups /><WorkflowSection tone="grey" /><ServicesContactBanner /></main></Layout>; }

/* Only the Perai address is known to us. The other two sites have area names but no street
   address, so they get no directions link until HT Logistics supplies one — see the contact
   notes in the plan. The Perai map link matches the footer's. */
const PERAI_ADDRESS = "Plot 3, Hujung Perusahaan 1, 13600 Perai, Penang.";
const PERAI_MAP = "https://www.google.com/maps/dir//Plot+3,+Hujung+Perusahaan+1,+13600+Perai,+Pulau+Pinang";
const PERAI_EMBED = "https://www.google.com/maps?q=Plot+3,+Hujung+Perusahaan+1,+13600+Perai,+Pulau+Pinang&z=15&output=embed";

function ContactHero() {
  return <section className="contact-hero" style={{ backgroundImage: `linear-gradient(95deg, rgba(12,11,11,.93) 0%, rgba(12,11,11,.78) 55%, rgba(12,11,11,.5) 100%), url(${contactHeroImg})` }}>
    <div className="wrap">
      <span className="eyebrow">GET IN TOUCH</span>
      <h1>Let's talk about<br /><em>your supply chain.</em></h1>
      <p>Tell us what you need moved or stored and our team will come back to you. For anything urgent, call or message us directly.</p>
      <div className="contact-hero-channels">
        <a href="tel:043997120"><Phone /><span><small>Call</small>04-399 7120</span></a>
        <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer"><MessageCircle /><span><small>WhatsApp</small>012-487 9121</span></a>
        <a href="mailto:admin@htlogisticssolutions.com"><Mail /><span><small>Email</small>admin@htlogisticssolutions.com</span></a>
      </div>
    </div>
  </section>;
}

const contactFields = [
  { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
  { name: "phone", label: "Phone number", type: "tel", required: true, autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text", required: false, autoComplete: "off" },
] as const;

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await submitEnquiry({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        service: String(data.get("service") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
        website: String(data.get("website") ?? ""),
      });
      form.reset();
      setStatus("sent");
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      setError(typeof message === "string" ? message : "Something went wrong and your message was not sent. Please call or WhatsApp us instead.");
      setStatus("error");
    }
  };

  return <form className="contact-form" onSubmit={submit}>
    {contactFields.map(f => <label key={f.name}>
      <span>{f.label}{f.required && <em>*</em>}</span>
      <input name={f.name} type={f.type} required={f.required} autoComplete={f.autoComplete} />
    </label>)}
    <label className="contact-form-wide">
      <span>Service of interest</span>
      <select name="service" defaultValue="">
        <option value="">Not sure yet</option>
        {allServices.map(s => <option key={s.slug} value={s.title}>{s.title}</option>)}
      </select>
    </label>
    <label className="contact-form-wide">
      <span>Message<em>*</em></span>
      <textarea name="message" rows={5} required placeholder="Volumes, locations, dates — whatever you have." />
    </label>
    {/* Honeypot — hidden from people, catches bots that fill every field. */}
    <label className="contact-form-hp" aria-hidden="true">
      Leave this field empty
      <input name="website" type="text" tabIndex={-1} autoComplete="off" />
    </label>
    <div className="contact-form-actions">
      <button className="light-button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"} <ArrowRight />
      </button>
      <p className="contact-form-note" role="status">
        {status === "sent" && <span className="is-ok">Thank you — your message has been sent. We'll reply during working hours.</span>}
        {status === "error" && <span className="is-error">{error}</span>}
      </p>
    </div>
  </form>;
}

/* Facility facts (space, pallets, storage types) come from the same `facilities` data the About
   page's matrix uses. Only Prai has a street address we can stand behind. */
function ContactLocations() {
  return <section className="contact-locations"><div className="wrap">
    <div className="locator-head"><span className="eyebrow red">OUR FACILITIES</span><h2>Where to <em>find us.</em></h2></div>
    <div className="locator">
      <div className="locator-list">
        {facilities.map(f => <div className="locator-site" key={f.name}>
          <div className="locator-site-head">
            <h3>{f.name}</h3>
            {f.hq && <span className="location-tag">HQ</span>}
          </div>
          <p className="locator-area">{f.location}</p>
          <div className="locator-facts">
            <div><strong>{f.space}<small>m²</small></strong><span>Floor space</span></div>
            <div><strong>{f.pallets}</strong><span>Pallet positions</span></div>
          </div>
          <p className="locator-storage">{f.storage.join(", ")}</p>
          {f.name === "Prai Industrial Park"
            ? <p className="locator-address"><MapPin />{PERAI_ADDRESS}<a href={PERAI_MAP} target="_blank" rel="noreferrer" className="location-link">Get directions <ArrowRight /></a></p>
            : <p className="locator-address is-pending"><Phone />Full address on request: <a href="tel:043997120">04-399 7120</a></p>}
        </div>)}
      </div>
      <div className="locator-map">
        <iframe src={PERAI_EMBED} title="Map showing HT Logistics Solutions in Perai, Penang" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </div>
  </div></section>;
}

/* Accreditations already stated on the Home CTA. Only TAPA and ISO 14001 have artwork on file;
   the rest are named in text rather than given invented badges. */
function ContactCerts() {
  return <section className="contact-certs"><div className="wrap contact-certs-row">
    <span className="contact-certs-label">Certified to</span>
    <div className="contact-certs-items">
      <span className="cert-badge"><img src={assets.certification} alt="" /><span>TAPA</span></span>
      <span className="cert-badge"><img src={assets.iso} alt="" /><span>ISO 14001</span></span>
      <span className="cert-text">ISO 9001</span>
      <span className="cert-text">ISO 45001</span>
      <span className="cert-text">GDPMD</span>
    </div>
  </div></section>;
}

/* Answers are drawn only from facts elsewhere on the site: working hours, the transport services
   in services.ts, and the storage types in `facilities`. */
const contactFaqs = [
  ["When will you reply?", "We reply during working hours, Mon – Sat, 8.30am – 5pm. For anything urgent, call 04-399 7120 or WhatsApp 012-487 9121."],
  ["Do you deliver outside Penang?", "Yes. Our transport covers nationwide full-truckload and less-than-truckload shipments across Malaysia, plus cross-border trucking to regional markets."],
  ["What should I include in my enquiry?", "The service you need, rough volumes (pallets, loads or headcount), the locations involved and the dates you're working to. With those we can come back with something concrete."],
  ["Do you offer bonded or cold storage?", "Yes. Science Park offers bonded and non-bonded, temperature-controlled and cold storage; Prai offers bonded and non-bonded, temperature-controlled and ambient storage; Kulim offers bonded and non-bonded and temperature-controlled storage."],
] as const;

function ContactFaq() {
  return <section className="contact-faq"><div className="wrap">
    <div className="section-heading"><span className="eyebrow red">BEFORE YOU WRITE</span><h2>Common <em>questions.</em></h2></div>
    <div className="faq-list">{contactFaqs.map(([q, a], i) => <details className="faq-item" key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>)}</div>
  </div></section>;
}

export function ContactPage() {
  return <Layout>
    <Seo page={staticPage("/contact-us/")} />
    <ContactHero />
    <main>
      <ContactCerts />
      <section className="contact-block"><div className="wrap contact-block-grid">
        <div className="contact-intro">
          <span className="eyebrow red">GET IN TOUCH</span>
          <h2>Questions or<br /><em>booking requests?</em></h2>
          <p>Tell us the service, rough volumes and the dates you're working to, and we'll come back with something concrete rather than a list of questions.</p>
          <div className="contact-rows">
            <div><i><MapPin /></i><span><small>Address</small>{PERAI_ADDRESS}</span></div>
            <a href="tel:043997120"><i><Phone /></i><span><small>Phone</small>04-399 7120</span></a>
            <a href="https://wa.me/60124879121" target="_blank" rel="noreferrer"><i><MessageCircle /></i><span><small>WhatsApp</small>012-487 9121</span></a>
            <a href="mailto:admin@htlogisticssolutions.com"><i><Mail /></i><span><small>Email</small>admin@htlogisticssolutions.com</span></a>
            <div><i><Clock3 /></i><span><small>Working hours</small>Mon – Sat, 8.30am – 5pm</span></div>
          </div>
        </div>
        <div className="form-sheet">
          <div className="form-sheet-head"><strong>Send a message</strong><span>We reply during working hours</span></div>
          <ContactForm />
        </div>
      </div></section>
      <ContactLocations />
      <ContactFaq />
    </main>
  </Layout>;
}


/* Privacy Policy and Terms, rendered from client/src/data/legal.ts. */
function LegalPage({ path, doc }: { path: "/privacy-policy/" | "/terms-conditions/"; doc: LegalDocument }) {
  return <Layout>
    <Seo page={staticPage(path)} />
    <PageHero eyebrow="HT LOGISTICS SOLUTIONS" title={doc.title} />
    <main><div className="wrap legal-grid">
      <nav className="legal-nav" aria-label="On this page">
        <span className="eyebrow red">CONTENTS</span>
        <ol>{doc.sections.map((sec, i) => <li key={sec.heading}><a href={`#legal-${i + 1}`}>{sec.heading}</a></li>)}</ol>
      </nav>
      <article className="legal-page">
        <p className="legal-updated">Last updated {doc.updated}</p>
        <p className="legal-intro">{doc.intro}</p>
        {doc.sections.map((sec, i) => <section key={sec.heading} id={`legal-${i + 1}`}>
          <h2>{sec.heading}</h2>
          {sec.paragraphs?.slice(0, 1).map(t => <p key={t}>{t}</p>)}
          {sec.bullets && <ul>{sec.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
          {sec.paragraphs?.slice(1).map(t => <p key={t}>{t}</p>)}
        </section>)}
        <p className="legal-foot">See also: <Link href={path === "/privacy-policy/" ? "/terms-conditions/" : "/privacy-policy/"}>{path === "/privacy-policy/" ? "Terms & Conditions" : "Privacy Policy"}</Link></p>
      </article>
    </div></main>
  </Layout>;
}
export function PrivacyPage() { return <LegalPage path="/privacy-policy/" doc={privacyPolicy} />; }
export function TermsPage() { return <LegalPage path="/terms-conditions/" doc={termsConditions} />; }

export function NotFoundPage() {
  return <Layout>
    <Seo page={{ path: "/404", title: "Page not found | HT Logistics Solutions", description: "The page you were looking for does not exist.", noindex: true }} />
    <PageHero eyebrow="ERROR 404" title={<>Page<br /><em>not found</em></>} />
    <main><section className="notfound-page wrap">
      <p>The address may be mistyped, or the page has moved. Try one of these instead.</p>
      <div className="notfound-links">
        <Link href="/" className="light-button">Home <ArrowRight /></Link>
        <Link href="/services/" className="outline-button">Services <ArrowRight /></Link>
        <Link href="/contact-us/" className="outline-button">Contact us <ArrowRight /></Link>
      </div>
    </section></main>
  </Layout>;
}
