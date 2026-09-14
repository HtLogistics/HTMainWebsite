import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight } from "lucide-react";
import { Streamdown } from "streamdown";
import type { BlogPost } from "@shared/blog";
import { fetchCategories, fetchPost, fetchPosts } from "@/lib/api";
import { ContactBanner, Layout, PageHero, formatDate } from "./SitePages";
import { Seo, staticPage } from "@/lib/seo";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from "@shared/seo";
import newsHeroImg from "@/assets/news-hero.jpg";

/* The newsroom leads with its most recent story rather than a static title band: the page label and
   positioning sit left, the latest post is the hero card on the right. */
function NewsHero({ featured }: { featured?: BlogPost }) {
  return <section className="news-hero" style={{ backgroundImage: `linear-gradient(100deg, rgba(12,11,11,.94) 0%, rgba(12,11,11,.8) 48%, rgba(12,11,11,.62) 100%), url(${newsHeroImg})` }}><div className="wrap news-hero-grid">
    <div className="news-hero-intro">
      <span className="eyebrow">LATEST NEWS</span>
      <h1>What's moving at<br /><em>HT Logistics.</em></h1>
      <p>Company news, service updates and notes from our warehousing and transport operations across Penang and Kulim.</p>
    </div>
    {featured && <Link href={`/${featured.slug}/`} className="news-featured">
      {featured.category && <span className="news-featured-cat">{featured.category}</span>}
      <h2>{featured.title}</h2>
      <p>{featured.excerpt}</p>
      <span className="news-featured-foot">
        <span>{formatDate(featured.publishedAt)}</span>
        <span className="news-featured-link">Read the article <ArrowRight /></span>
      </span>
    </Link>}
  </div></section>;
}

/* One article in an index: publish meta on the left, story on the right, optional thumbnail last.
   Shared by the newsroom index and the related list on an article. */
function NewsRow({ post }: { post: BlogPost }) {
  return <article className={post.featuredImage ? "news-row has-media" : "news-row"}>
    <div className="news-row-meta">
      <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
      {post.category && <span className="news-row-cat">{post.category}</span>}
    </div>
    <div className="news-row-body">
      <h2><Link href={`/${post.slug}/`}>{post.title}</Link></h2>
      <p>{post.excerpt}</p>
      <Link href={`/${post.slug}/`} className="news-row-link">Read the article <ArrowRight /></Link>
    </div>
    {post.featuredImage && <Link href={`/${post.slug}/`} className="news-row-media" tabIndex={-1} aria-hidden="true"><img src={post.featuredImage} alt="" loading="lazy" /></Link>}
  </article>;
}

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  useEffect(() => { fetchCategories().then(setCategories).catch(() => setCategories([])); }, []);
  useEffect(() => {
    setPosts(null);
    fetchPosts(activeCategory ? { category: activeCategory } : undefined)
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [activeCategory]);

  return <Layout>
    <Seo page={staticPage("/latest-news/")} />
    <NewsHero featured={posts?.[0]} />
    <main>
      {categories.length > 0 && <div className="news-filters wrap" role="group" aria-label="Filter by category">
        <button type="button" className={!activeCategory ? "chip is-on" : "chip"} aria-pressed={!activeCategory} onClick={() => setActiveCategory(undefined)}>All</button>
        {categories.map(c => <button type="button" key={c} className={activeCategory === c ? "chip is-on" : "chip"} aria-pressed={activeCategory === c} onClick={() => setActiveCategory(c)}>{c}</button>)}
      </div>}
      <section className="news-list wrap">
        {posts === null && <p className="news-note">Loading articles…</p>}
        {posts !== null && posts.length === 0 && <p className="news-note">No articles published yet. Check back soon.</p>}
        {posts?.map(post => <NewsRow post={post} key={post.id} />)}
      </section>
    </main>
  </Layout>;
}

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<{ post: BlogPost; related: BlogPost[] } | null | undefined>(undefined);

  useEffect(() => {
    setState(undefined);
    fetchPost(slug).then(setState);
  }, [slug]);

  if (state === undefined) return <Layout><main><div className="wrap" style={{ paddingBlock: 120 }}>Loading…</div></main></Layout>;

  if (state === null) return <Layout>
    <Seo page={{ path: `/${slug}/`, title: "Article not found | HT Logistics Solutions", description: "That article does not exist or has been unpublished.", noindex: true }} />
    <PageHero eyebrow="INSIGHTS & UPDATES" title={<>Article<br /><em>Not Found</em></>} />
    <main><div className="wrap" style={{ paddingBlock: 80 }}>
      <p>Sorry, we couldn't find that article. It may have been moved or unpublished.</p>
      <Link href="/latest-news/" className="outline-button" style={{ marginTop: 24 }}>Back to Latest News <ArrowRight /></Link>
    </div></main>
  </Layout>;

  const { post, related } = state;

  const path = `/${post.slug}/`;
  return <Layout>
    <Seo page={{
      path, type: "article",
      title: post.seoTitle || `${post.title} | HT Logistics Solutions`,
      description: post.metaDescription || post.excerpt,
      image: post.featuredImage ? absoluteUrl(post.featuredImage) : undefined,
      jsonLd: [
        articleJsonLd({ headline: post.title, description: post.excerpt, path, datePublished: post.publishedAt, dateModified: post.updatedAt, image: post.featuredImage }),
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Latest News", path: "/latest-news/" }, { name: post.title, path }]),
      ],
    }} />
    <PageHero eyebrow={post.category} title={post.title} image={post.featuredImage ?? undefined} />
    <main>
      <section className="inner-story wrap">
        <div>
          <span className="eyebrow red">{formatDate(post.publishedAt)}</span>
          <h2>By <em>{post.author}</em></h2>
          {post.tags.length > 0 && <p style={{ marginTop: 16 }}>{post.tags.map(t => `#${t}`).join("  ")}</p>}
        </div>
        <div className="lead" style={{ maxWidth: "none" }}>
          <Streamdown>{post.content}</Streamdown>
        </div>
      </section>
      {related.length > 0 && <section className="news-section wrap">
        <div className="section-heading"><span className="eyebrow red">RELATED</span><h2>More from <em>{post.category}</em></h2></div>
        <div className="news-list" style={{ paddingBlock: 0 }}>
          {related.map(r => <NewsRow post={r} key={r.id} />)}
        </div>
      </section>}
      <ContactBanner />
    </main>
  </Layout>;
}
