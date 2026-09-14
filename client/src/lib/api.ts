import axios from "axios";
import type { BlogPost, BlogPostInput } from "@shared/blog";
import type { Enquiry, EnquiryInput } from "@shared/enquiry";

export const api = axios.create({ baseURL: "/api", withCredentials: true });

export async function fetchPosts(params?: { category?: string; tag?: string }): Promise<BlogPost[]> {
  const { data } = await api.get<{ posts: BlogPost[] }>("/posts", { params });
  return data.posts;
}

export async function fetchPost(slug: string): Promise<{ post: BlogPost; related: BlogPost[] } | null> {
  try {
    const { data } = await api.get<{ post: BlogPost; related: BlogPost[] }>(`/posts/${encodeURIComponent(slug)}`);
    return data;
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<string[]> {
  const { data } = await api.get<{ categories: string[] }>("/categories");
  return data.categories;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  await api.post("/admin/login", { username, password });
}

export async function adminLogout(): Promise<void> {
  await api.post("/admin/logout");
}

export async function adminSession(): Promise<boolean> {
  const { data } = await api.get<{ authenticated: boolean }>("/admin/session");
  return data.authenticated;
}

export async function adminListPosts(): Promise<BlogPost[]> {
  const { data } = await api.get<{ posts: BlogPost[] }>("/admin/posts");
  return data.posts;
}

export async function adminGetPost(id: string): Promise<BlogPost> {
  const { data } = await api.get<{ post: BlogPost }>(`/admin/posts/${id}`);
  return data.post;
}

export async function adminCreatePost(input: BlogPostInput): Promise<BlogPost> {
  const { data } = await api.post<{ post: BlogPost }>("/admin/posts", input);
  return data.post;
}

export async function adminUpdatePost(id: string, input: BlogPostInput): Promise<BlogPost> {
  const { data } = await api.put<{ post: BlogPost }>(`/admin/posts/${id}`, input);
  return data.post;
}

export async function adminDeletePost(id: string): Promise<void> {
  await api.delete(`/admin/posts/${id}`);
}

export async function adminUploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ url: string }>("/admin/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  await api.post("/enquiries", input);
}

export async function adminListEnquiries(): Promise<Enquiry[]> {
  const { data } = await api.get<{ enquiries: Enquiry[] }>("/enquiries");
  return data.enquiries;
}

export async function adminMarkEnquiryRead(id: string, read: boolean): Promise<void> {
  await api.patch(`/enquiries/${id}/read`, { read });
}

export async function adminDeleteEnquiry(id: string): Promise<void> {
  await api.delete(`/enquiries/${id}`);
}
