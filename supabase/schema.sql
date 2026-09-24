/* Run once in the Supabase SQL editor (Project > SQL Editor > New query) for a fresh project.
   Safe to re-run: every statement is idempotent. */

create table if not exists posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  featured_image text,
  category text not null default 'General',
  tags text[] not null default '{}',
  author text not null default 'HT Logistics Solutions',
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text not null default '',
  meta_description text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists enquiries (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  service text not null default '',
  subject text not null default '',
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

/* The server only ever talks to Supabase with the service_role key, which bypasses RLS, so
   these tables are never reachable with the public anon key regardless of policy. Enabling
   RLS with no policies is defense in depth, not something the app relies on. */
alter table posts enable row level security;
alter table enquiries enable row level security;

/* Public bucket so uploaded images are servable directly from Supabase's CDN via their
   public URL, without a signed-URL round trip through our own server on every page view. */
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

/* Seed content so the blog isn't empty on first launch, matching what previously shipped as
   in-code seed data. Skipped automatically if posts already exist. */
insert into posts (id, slug, title, excerpt, content, category, tags, author, status, seo_title, meta_description, published_at, created_at, updated_at)
select * from (values
  (
    'seed-real-time-tracking',
    'launches-real-time-tracking-system-for-enhanced-delivery-transparency',
    'Launches Real-Time Tracking System for Enhanced Delivery Transparency',
    'HT Logistics Solutions introduces a real-time tracking system to improve delivery transparency and customer experience.',
    E'HT Logistics Solutions has rolled out a real-time tracking system across its transportation fleet, giving customers live visibility into the status of their shipments from dispatch to delivery.\n\nThe new system reflects our ongoing commitment to operational transparency and customer confidence, and forms part of a broader investment in technology across our warehousing and transport operations.',
    'Company News',
    array['tracking', 'technology', 'delivery'],
    'HT Logistics Solutions',
    'published',
    'Real-Time Delivery Tracking | HT Logistics Solutions',
    'HT Logistics Solutions launches a real-time tracking system for enhanced delivery transparency across Malaysia.',
    '2025-07-21T00:00:00.000Z'::timestamptz,
    '2025-07-21T00:00:00.000Z'::timestamptz,
    '2025-07-21T00:00:00.000Z'::timestamptz
  ),
  (
    'seed-eco-friendly-packaging',
    'sustainable-logistics-eco-friendly-packaging-initiative',
    'Sustainable Logistics: Introduces Eco-Friendly Packaging Initiative',
    'Sustainable Logistics announces the launch of its Eco-Friendly Packaging Initiative, reinforcing its commitment to sustainability.',
    E'As part of our commitment to ethical and sustainable practices, HT Logistics Solutions has introduced an eco-friendly packaging initiative across its kitting and packaging operations.\n\nThe initiative reduces single-use plastic and prioritises recyclable materials, supporting both environmental goals and the expectations of our partners across the supply chain.',
    'Sustainability',
    array['sustainability', 'packaging'],
    'HT Logistics Solutions',
    'published',
    'Eco-Friendly Packaging Initiative | HT Logistics Solutions',
    'HT Logistics Solutions introduces an eco-friendly packaging initiative reinforcing its sustainability commitment.',
    '2025-06-13T00:00:00.000Z'::timestamptz,
    '2025-06-13T00:00:00.000Z'::timestamptz,
    '2025-06-13T00:00:00.000Z'::timestamptz
  )
) as seed(id, slug, title, excerpt, content, category, tags, author, status, seo_title, meta_description, published_at, created_at, updated_at)
where not exists (select 1 from posts);
