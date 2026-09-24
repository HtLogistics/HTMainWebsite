import { Fragment, FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle, ArrowLeft, ArrowRight, ExternalLink, Eye, EyeOff, LogOut, Plus } from "lucide-react";
import { Streamdown } from "streamdown";
import "@/admin.css";
import logoImg from "@/assets/ht-logistics.png";
import logoWhiteImg from "@/assets/ht-logistics-white.png";
import loginHeroImg from "@/assets/hero-warehouse.jpg";
import type { BlogPost, BlogPostInput } from "@shared/blog";
import type { Enquiry } from "@shared/enquiry";
import {
  adminCreatePost,
  adminDeleteEnquiry,
  adminDeletePost,
  adminListEnquiries,
  adminListPosts,
  adminMarkEnquiryRead,
  adminLogin,
  adminLogout,
  adminSession,
  adminUpdatePost,
  adminUploadImage,
} from "@/lib/api";

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = "Admin | HT Logistics Solutions";
    return () => { document.head.removeChild(meta); document.title = prevTitle; };
  }, []);
}

const emptyForm: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: null,
  category: "Company News",
  tags: [],
  author: "HT Logistics Solutions",
  status: "draft",
  seoTitle: "",
  metaDescription: "",
};

const SEO_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });

function isUnauthorized(err: unknown): boolean {
  return isAxiosError(err) && err.response?.status === 401;
}

/* Surface the server's own message for client mistakes (validation, bad file type) and stay
   generic for everything else. */
function apiMessage(err: unknown, fallback: string): string {
  if (isAxiosError<{ error?: string }>(err) && err.response?.status === 400 && err.response.data?.error) return err.response.data.error;
  return fallback;
}

/* A wrong password and a dead server must not look the same, otherwise an outage reads as
   "you typed it wrong" and the admin keeps retrying. */
function loginErrorMessage(err: unknown): string {
  if (isAxiosError<{ error?: string }>(err) && err.response) {
    const { status, data } = err.response;
    if (status === 429) return data?.error ?? "Too many attempts. Please try again in a few minutes.";
    if (status === 400 || status === 401) return "Invalid username or password.";
    return "Something went wrong on the server. Please try again in a moment.";
  }
  return "Can't reach the server. Check your connection and try again.";
}

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminLogin(username, password);
      onSuccess();
    } catch (err) {
      setError(loginErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <aside
        className="admin-login-brand"
        style={{ backgroundImage: `linear-gradient(160deg, rgba(14,14,14,.9) 0%, rgba(14,14,14,.72) 55%, rgba(36,36,36,.55) 100%), url(${loginHeroImg})` }}
      >
        <img className="logo" src={logoWhiteImg} alt="HT Logistics Solutions" />
        <div>
          <span className="eyebrow red">CONTENT MANAGEMENT</span>
          <h2>Run the website, <em>your way.</em></h2>
          <p>Publish company news and read customer enquiries, all in one place.</p>
        </div>
        <small>© {new Date().getFullYear()} HT Logistics Solutions Sdn Bhd</small>
      </aside>

      <main className="admin-login-panel">
        <form className="admin-login-card" onSubmit={submit}>
          <span className="eyebrow red">ADMIN</span>
          <h1>Welcome back</h1>
          <p className="sub">Sign in to manage news posts and customer enquiries.</p>

          {error && <div className="admin-error" role="alert"><AlertCircle aria-hidden="true" />{error}</div>}

          <div className="admin-field">
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              className="admin-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              autoFocus
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                className="admin-input has-toggle"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-eye"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
          </div>

          <button className="admin-submit" type="submit" disabled={busy}>
            {busy ? <><span className="admin-spinner" aria-hidden="true" />Signing in…</> : <>Sign in <ArrowRight aria-hidden="true" /></>}
          </button>

          <a className="admin-back" href="/"><ArrowLeft aria-hidden="true" />Back to website</a>
        </form>
      </main>
    </div>
  );
}

type Section = "posts" | "enquiries";

interface ShellControls {
  unread: number;
  onSection: (s: Section) => void;
  onLogout: () => void;
  onExpired: () => void;
  onUnread: (n: number) => void;
}

function AdminShell({ section, controls, title, actions, children }: { section: Section; controls: ShellControls; title: string; actions?: ReactNode; children: ReactNode }) {
  const tab = (id: Section, label: string, badge?: number) => (
    <button type="button" className={section === id ? "is-active" : ""} aria-current={section === id ? "page" : undefined} onClick={() => controls.onSection(id)}>
      {label}
      {badge ? <span className="admin-count" aria-label={`${badge} unread`}>{badge}</span> : null}
    </button>
  );

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <a className="admin-topbar-brand" href="/" aria-label="HT Logistics Solutions website">
            <img src={logoImg} alt="HT Logistics Solutions" />
            <span>ADMIN</span>
          </a>
          <nav className="admin-tabs" aria-label="Admin sections">
            {tab("posts", "Blog posts")}
            {tab("enquiries", "Enquiries", controls.unread)}
          </nav>
          <div className="admin-topbar-actions">
            <a className="admin-link" href="/" target="_blank" rel="noreferrer">View site <ExternalLink aria-hidden="true" /></a>
            <button type="button" className="admin-btn outline sm" onClick={controls.onLogout}><LogOut aria-hidden="true" />Log out</button>
          </div>
        </div>
      </header>
      <main className="admin-main">
        <div className="admin-pagehead">
          <h1 className="admin-title">{title}</h1>
          {actions && <div className="admin-pagehead-actions">{actions}</div>}
        </div>
        {children}
      </main>
    </div>
  );
}

/* Load once, expose a reload, and send an expired session (8h cookie) back to the login screen
   instead of leaving a table that silently stays empty. */
function useLoad<T>(fetcher: () => Promise<T>, onExpired: () => void) {
  const [data, setData] = useState<T | null>(null);
  const [failed, setFailed] = useState(false);
  const reload = useCallback(() => {
    setFailed(false);
    return fetcher().then(setData).catch((err) => {
      if (isUnauthorized(err)) onExpired();
      else setFailed(true);
    });
  }, [fetcher, onExpired]);
  useEffect(() => { reload(); }, [reload]);
  return { data, failed, reload };
}

function LoadState({ loading, failed, onRetry, what }: { loading: boolean; failed: boolean; onRetry: () => void; what: string }) {
  if (failed) {
    return (
      <div className="admin-empty">
        <strong>Couldn't load {what}</strong>
        The server didn't answer properly. This is usually temporary.
        <div style={{ marginTop: 16 }}><button type="button" className="admin-btn outline sm" onClick={onRetry}>Try again</button></div>
      </div>
    );
  }
  if (loading) return <div className="admin-empty" role="status">Loading {what}…</div>;
  return null;
}

function PostListView({ controls, onEdit, onNew }: { controls: ShellControls; onEdit: (post: BlogPost) => void; onNew: () => void }) {
  const { data: posts, failed, reload } = useLoad(adminListPosts, controls.onExpired);
  const [actionError, setActionError] = useState<string | null>(null);

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
      await reload();
    } catch (err) {
      if (isUnauthorized(err)) controls.onExpired();
      else setActionError("That didn't work. Please try again.");
    }
  };

  const remove = (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    run(() => adminDeletePost(post.id));
  };

  const togglePublish = (post: BlogPost) => {
    const input: BlogPostInput = { ...post, status: post.status === "published" ? "draft" : "published" };
    run(() => adminUpdatePost(post.id, input));
  };

  return (
    <AdminShell
      section="posts"
      controls={controls}
      title="Blog posts"
      actions={<button type="button" className="admin-btn" onClick={onNew}><Plus aria-hidden="true" />New post</button>}
    >
      {actionError && <div className="admin-error" role="alert"><AlertCircle aria-hidden="true" />{actionError}</div>}
      <div className="admin-card">
        <LoadState loading={posts === null && !failed} failed={failed} onRetry={reload} what="posts" />
        {posts && posts.length === 0 && (
          <div className="admin-empty"><strong>No posts yet</strong>Click "New post" to write the first one.</div>
        )}
        {posts && posts.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Title</th><th>Status</th><th>Category</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="is-primary">
                      <span className="admin-cell-title">{post.title}</span>
                      <span className="admin-cell-sub">/{post.slug}/</span>
                    </td>
                    <td data-label="Status"><span className={`admin-badge is-${post.status}`}>{post.status}</span></td>
                    <td data-label="Category">{post.category}</td>
                    <td data-label="Updated">{formatDate(post.updatedAt)}</td>
                    <td className="is-actions">
                      <div className="admin-actions">
                        <button type="button" className="admin-btn outline sm" onClick={() => onEdit(post)}>Edit</button>
                        <button type="button" className="admin-btn outline sm" onClick={() => togglePublish(post)}>{post.status === "published" ? "Unpublish" : "Publish"}</button>
                        <button type="button" className="admin-btn danger sm" onClick={() => remove(post)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

/* Contact-form submissions. Stored in the Supabase `enquiries` table — this is the only place
   they can be read, so deleting one is permanent. */
function EnquiryListView({ controls }: { controls: ShellControls }) {
  const { data: enquiries, failed, reload } = useLoad(adminListEnquiries, controls.onExpired);
  const [open, setOpen] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { onUnread } = controls;

  useEffect(() => {
    if (enquiries) onUnread(enquiries.filter((e) => e.status === "new").length);
  }, [enquiries, onUnread]);

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
      await reload();
    } catch (err) {
      if (isUnauthorized(err)) controls.onExpired();
      else setActionError("That didn't work. Please try again.");
    }
  };

  const toggleRead = (enquiry: Enquiry) => run(() => adminMarkEnquiryRead(enquiry.id, enquiry.status !== "read"));

  const remove = (enquiry: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${enquiry.name}? This cannot be undone.`)) return;
    run(() => adminDeleteEnquiry(enquiry.id));
  };

  return (
    <AdminShell section="enquiries" controls={controls} title="Enquiries">
      {actionError && <div className="admin-error" role="alert"><AlertCircle aria-hidden="true" />{actionError}</div>}
      <div className="admin-card">
        <LoadState loading={enquiries === null && !failed} failed={failed} onRetry={reload} what="enquiries" />
        {enquiries && enquiries.length === 0 && (
          <div className="admin-empty"><strong>No enquiries yet</strong>Messages sent through the contact form appear here.</div>
        )}
        {enquiries && enquiries.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Received</th><th>From</th><th>Service</th><th>Subject</th><th><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <Fragment key={enquiry.id}>
                    <tr>
                      <td data-label="Received">
                        {enquiry.status === "new" && <span className="admin-badge is-new" style={{ marginRight: 8 }}>new</span>}
                        {formatDate(enquiry.createdAt)}
                      </td>
                      <td className="is-primary">
                        <span className="admin-cell-title">{enquiry.name}</span>
                        <span className="admin-cell-sub"><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></span>
                        <span className="admin-cell-sub"><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></span>
                      </td>
                      <td data-label="Service">{enquiry.service || "—"}</td>
                      <td data-label="Subject">{enquiry.subject || "—"}</td>
                      <td className="is-actions">
                        <div className="admin-actions">
                          <button type="button" className="admin-btn outline sm" onClick={() => setOpen(open === enquiry.id ? null : enquiry.id)}>{open === enquiry.id ? "Hide" : "Read"}</button>
                          <button type="button" className="admin-btn outline sm" onClick={() => toggleRead(enquiry)}>{enquiry.status === "read" ? "Mark unread" : "Mark read"}</button>
                          <button type="button" className="admin-btn danger sm" onClick={() => remove(enquiry)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                    {open === enquiry.id && (
                      <tr className="admin-message-row">
                        <td colSpan={5}>
                          <div className="admin-message">{enquiry.message}</div>
                          <a
                            className="admin-btn sm"
                            href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject || "Your enquiry"}`)}`}
                          >Reply by email</a>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function PostEditView({ post, controls, onDone }: { post: BlogPost | null; controls: ShellControls; onDone: () => void }) {
  const [form, setForm] = useState<BlogPostInput>(post ? { ...post } : emptyForm);
  const [tagsInput, setTagsInput] = useState(post?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      set("featuredImage", await adminUploadImage(file));
    } catch (err) {
      if (isUnauthorized(err)) controls.onExpired();
      else setError(apiMessage(err, "Image upload failed. Please try a JPEG, PNG, WebP, GIF or SVG under 5MB."));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const input: BlogPostInput = { ...form, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      if (post) await adminUpdatePost(post.id, input);
      else await adminCreatePost(input);
      onDone();
    } catch (err) {
      if (isUnauthorized(err)) controls.onExpired();
      else setError(apiMessage(err, "Could not save this post. Check the required fields and try again."));
      setSaving(false);
    }
  };

  return (
    <AdminShell
      section="posts"
      controls={controls}
      title={post ? "Edit post" : "New post"}
      actions={<button type="button" className="admin-btn outline" onClick={onDone}><ArrowLeft aria-hidden="true" />Back to list</button>}
    >
      {error && <div className="admin-error" role="alert"><AlertCircle aria-hidden="true" />{error}</div>}
      <form onSubmit={submit} className="admin-edit-grid">
        <div className="admin-card admin-panel">
          <h2>Content</h2>
          <div className="admin-field">
            <label htmlFor="post-title">Title</label>
            <input id="post-title" className="admin-input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="admin-field">
            <label htmlFor="post-slug">Slug (leave blank to auto-generate)</label>
            <input id="post-slug" className="admin-input" value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-title" />
          </div>
          <div className="admin-field">
            <label htmlFor="post-excerpt">Excerpt</label>
            <textarea id="post-excerpt" className="admin-input admin-textarea" rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="post-content">Content (Markdown)</label>
            <textarea id="post-content" className="admin-input admin-textarea tall" value={form.content} onChange={(e) => set("content", e.target.value)} />
          </div>
          <div className="admin-field">
            <span className="admin-label">Preview</span>
            <div className="admin-preview"><Streamdown>{form.content || "Nothing to preview yet."}</Streamdown></div>
          </div>
        </div>

        <div className="admin-side">
          <div className="admin-card admin-panel">
            <h2>Publishing</h2>
            <div className="admin-field">
              <label htmlFor="post-status">Status</label>
              <select id="post-status" className="admin-input" value={form.status} onChange={(e) => set("status", e.target.value as BlogPostInput["status"])}>
                <option value="draft">Draft (not visible on the site)</option>
                <option value="published">Published (live)</option>
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="post-image">Featured image</label>
              <input id="post-image" className="admin-input admin-file" type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
              {uploading && <span className="admin-hint" role="status">Uploading…</span>}
              {form.featuredImage && (
                <div className="admin-thumb">
                  <img src={form.featuredImage} alt="Featured" />
                  <button type="button" className="admin-btn outline sm" onClick={() => set("featuredImage", null)}>Remove image</button>
                </div>
              )}
            </div>
            <div className="admin-field">
              <label htmlFor="post-category">Category</label>
              <input id="post-category" className="admin-input" value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="post-tags">Tags (comma-separated)</label>
              <input id="post-tags" className="admin-input" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </div>
            <div className="admin-field">
              <label htmlFor="post-author">Author</label>
              <input id="post-author" className="admin-input" value={form.author} onChange={(e) => set("author", e.target.value)} />
            </div>
          </div>

          <div className="admin-card admin-panel">
            <h2>Search engines</h2>
            <div className="admin-field">
              <label htmlFor="post-seo-title">SEO title</label>
              <input id="post-seo-title" className="admin-input" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
              <span className="admin-hint"><span>Shown as the headline in Google results.</span><span className={form.seoTitle.length > SEO_TITLE_MAX ? "over" : ""}>{form.seoTitle.length}/{SEO_TITLE_MAX}</span></span>
            </div>
            <div className="admin-field">
              <label htmlFor="post-meta">Meta description</label>
              <textarea id="post-meta" className="admin-input admin-textarea" rows={3} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
              <span className="admin-hint"><span>The short summary under the headline.</span><span className={form.metaDescription.length > META_DESCRIPTION_MAX ? "over" : ""}>{form.metaDescription.length}/{META_DESCRIPTION_MAX}</span></span>
            </div>
          </div>

          <button type="submit" className="admin-btn admin-save" disabled={saving || uploading}>{saving ? "Saving…" : post ? "Save changes" : "Save post"}</button>
        </div>
      </form>
    </AdminShell>
  );
}

export function AdminPage() {
  useNoIndex();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "enquiries">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [unread, setUnread] = useState(0);

  // If the API is unreachable the session check throws; without the catch the page stayed blank forever.
  useEffect(() => {
    adminSession().catch(() => false).then((ok) => { setAuthenticated(ok); setChecking(false); });
  }, []);

  // The unread badge lives in the top bar on every screen, so fetch it once after signing in
  // (the enquiries screen keeps it current after that).
  useEffect(() => {
    if (!authenticated) return;
    adminListEnquiries().then((list) => setUnread(list.filter((e) => e.status === "new").length)).catch(() => {});
  }, [authenticated]);

  const onExpired = useCallback(() => setAuthenticated(false), []);
  const onUnread = useCallback((n: number) => setUnread(n), []);

  if (checking) return <div className="admin-loading"><span className="admin-spinner" role="status" aria-label="Loading" /></div>;
  if (!authenticated) return <LoginView onSuccess={() => setAuthenticated(true)} />;

  const controls: ShellControls = {
    unread,
    onExpired,
    onUnread,
    onLogout: () => { adminLogout().catch(() => {}).then(() => setAuthenticated(false)); },
    onSection: (s) => { setEditingPost(null); setView(s === "posts" ? "list" : "enquiries"); },
  };

  if (view === "edit") {
    return <PostEditView post={editingPost} controls={controls} onDone={() => { setView("list"); setEditingPost(null); }} />;
  }

  if (view === "enquiries") {
    return <EnquiryListView controls={controls} />;
  }

  return (
    <PostListView
      controls={controls}
      onNew={() => { setEditingPost(null); setView("edit"); }}
      onEdit={(post) => { setEditingPost(post); setView("edit"); }}
    />
  );
}
