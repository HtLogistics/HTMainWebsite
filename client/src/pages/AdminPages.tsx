import { Fragment, FormEvent, useEffect, useState } from "react";
import { Streamdown } from "streamdown";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

function LoginView({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await adminLogin(username, password);
      onSuccess();
    } catch {
      setError("Invalid username or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f0f0ed" }}>
      <form onSubmit={submit} style={{ background: "#fff", padding: 40, borderRadius: 8, width: 360, display: "grid", gap: 16, boxShadow: "0 10px 40px #0001" }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>HT Logistics Admin</h1>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p style={{ color: "#ef1d27", fontSize: 13, margin: 0 }}>{error}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</Button>
      </form>
    </div>
  );
}

function PostListView({ onEdit, onNew, onLogout, onView }: { onEdit: (post: BlogPost) => void; onNew: () => void; onLogout: () => void; onView: (v: "posts" | "enquiries") => void }) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  const load = () => adminListPosts().then(setPosts);
  useEffect(() => { load(); }, []);

  const remove = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await adminDeletePost(post.id);
    load();
  };

  const togglePublish = async (post: BlogPost) => {
    const input: BlogPostInput = { ...post, status: post.status === "published" ? "draft" : "published" };
    await adminUpdatePost(post.id, input);
    load();
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Blog Posts</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Button size="sm" onClick={onNew}>New Post</Button>
          <AdminNav view="posts" onView={onView} onLogout={onLogout} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell><Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge></TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button size="sm" variant="outline" onClick={() => onEdit(post)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => togglePublish(post)}>{post.status === "published" ? "Unpublish" : "Publish"}</Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(post)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {posts?.length === 0 && <TableRow><TableCell colSpan={5}>No posts yet — click "New Post" to write the first one.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}

function AdminNav({ view, onView, onLogout, unread }: { view: "posts" | "enquiries"; onView: (v: "posts" | "enquiries") => void; onLogout: () => void; unread?: number }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Button size="sm" variant={view === "posts" ? "default" : "outline"} onClick={() => onView("posts")}>Blog Posts</Button>
      <Button size="sm" variant={view === "enquiries" ? "default" : "outline"} onClick={() => onView("enquiries")}>
        Enquiries{unread ? ` (${unread})` : ""}
      </Button>
      <Button size="sm" variant="outline" onClick={onLogout}>Log Out</Button>
    </div>
  );
}

/* Contact-form submissions. Stored server-side in data/enquiries.json — this is the only place
   they can be read, so deleting one is permanent. */
function EnquiryListView({ onView, onLogout }: { onView: (v: "posts" | "enquiries") => void; onLogout: () => void }) {
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const load = () => adminListEnquiries().then(setEnquiries);
  useEffect(() => { load(); }, []);

  const toggleRead = async (enquiry: Enquiry) => {
    await adminMarkEnquiryRead(enquiry.id, enquiry.status !== "read");
    load();
  };

  const remove = async (enquiry: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${enquiry.name}? This cannot be undone.`)) return;
    await adminDeleteEnquiry(enquiry.id);
    load();
  };

  const unread = enquiries?.filter(e => e.status === "new").length ?? 0;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Enquiries</h1>
        <AdminNav view="enquiries" onView={onView} onLogout={onLogout} unread={unread} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Received</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries?.map((enquiry) => (
            <Fragment key={enquiry.id}>
              <TableRow>
                <TableCell>
                  {enquiry.status === "new" && <Badge style={{ marginRight: 8 }}>new</Badge>}
                  {new Date(enquiry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div style={{ fontWeight: 600 }}>{enquiry.name}</div>
                  <div style={{ fontSize: 12 }}><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></div>
                  <div style={{ fontSize: 12 }}><a href={`tel:${enquiry.phone}`}>{enquiry.phone}</a></div>
                </TableCell>
                <TableCell>{enquiry.service || "—"}</TableCell>
                <TableCell>{enquiry.subject || "—"}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="outline" onClick={() => setOpen(open === enquiry.id ? null : enquiry.id)}>{open === enquiry.id ? "Hide" : "Read"}</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleRead(enquiry)}>{enquiry.status === "read" ? "Mark unread" : "Mark read"}</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(enquiry)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
              {open === enquiry.id && (
                <TableRow>
                  <TableCell colSpan={5} style={{ whiteSpace: "pre-wrap", background: "#f6f6f4" }}>{enquiry.message}</TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
          {enquiries?.length === 0 && <TableRow><TableCell colSpan={5}>No enquiries yet. Messages sent through the contact form appear here.</TableCell></TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}

function PostEditView({ post, onDone }: { post: BlogPost | null; onDone: () => void }) {
  const [form, setForm] = useState<BlogPostInput>(post ? { ...post } : emptyForm);
  const [tagsInput, setTagsInput] = useState(post?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof BlogPostInput>(key: K, value: BlogPostInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminUploadImage(file);
      set("featuredImage", url);
    } catch {
      setError("Image upload failed. Please try a JPEG, PNG, WebP, GIF or SVG under 5MB.");
    } finally {
      setUploading(false);
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
    } catch {
      setError("Could not save this post. Check the required fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>{post ? "Edit Post" : "New Post"}</h1>
        <Button variant="outline" onClick={onDone}>Back to list</Button>
      </div>
      <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 32 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Title
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Slug (leave blank to auto-generate)
            <Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-title" />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Excerpt
            <Textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Content (Markdown)
            <Textarea rows={14} value={form.content} onChange={(e) => set("content", e.target.value)} />
          </label>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Preview</span>
            <div style={{ border: "1px solid #e6e6e3", borderRadius: 6, padding: 16, marginTop: 6 }}>
              <Streamdown>{form.content || "Nothing to preview yet."}</Streamdown>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Status
            <Select value={form.status} onValueChange={(v) => set("status", v as BlogPostInput["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Featured Image
            <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
          {form.featuredImage && <img src={form.featuredImage} alt="Featured" style={{ width: "100%", borderRadius: 6 }} />}
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Category
            <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Tags (comma-separated)
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Author
            <Input value={form.author} onChange={(e) => set("author", e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>SEO Title
            <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 13, fontWeight: 600 }}>Meta Description
            <Textarea rows={3} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />
          </label>
          {error && <p style={{ color: "#ef1d27", fontSize: 13 }}>{error}</p>}
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Post"}</Button>
        </div>
      </form>
    </div>
  );
}

export function AdminPage() {
  useNoIndex();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [view, setView] = useState<"list" | "edit" | "enquiries">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => { adminSession().then((ok) => { setAuthenticated(ok); setChecking(false); }); }, []);

  if (checking) return null;
  if (!authenticated) return <LoginView onSuccess={() => setAuthenticated(true)} />;

  const logout = () => adminLogout().then(() => setAuthenticated(false));
  const switchView = (v: "posts" | "enquiries") => setView(v === "posts" ? "list" : "enquiries");

  if (view === "edit") {
    return <PostEditView post={editingPost} onDone={() => { setView("list"); setEditingPost(null); }} />;
  }

  if (view === "enquiries") {
    return <EnquiryListView onView={switchView} onLogout={logout} />;
  }

  return (
    <PostListView
      onNew={() => { setEditingPost(null); setView("edit"); }}
      onEdit={(post) => { setEditingPost(post); setView("edit"); }}
      onView={switchView}
      onLogout={logout}
    />
  );
}
