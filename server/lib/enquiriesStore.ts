import { nanoid } from "nanoid";
import type { Enquiry, EnquiryInput } from "@shared/enquiry";
import { dbError, getSupabase } from "./supabase";

const TABLE = "enquiries";

type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
  status: "new" | "read";
  created_at: string;
};

function fromRow(r: EnquiryRow): Enquiry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    service: r.service,
    subject: r.subject,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  };
}

/* Newest first — the inbox is read chronologically. */
export async function listEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await getSupabase().from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) throw dbError(error);
  return (data as EnquiryRow[]).map(fromRow);
}

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  const row = {
    id: nanoid(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    service: input.service ?? "",
    subject: input.subject ?? "",
    message: input.message,
    status: "new" as const,
    created_at: new Date().toISOString(),
  };
  const { data, error } = await getSupabase().from(TABLE).insert(row).select().single();
  if (error) throw dbError(error);
  return fromRow(data as EnquiryRow);
}

export async function markEnquiryRead(id: string, read: boolean): Promise<Enquiry | null> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update({ status: read ? "read" : "new" })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw dbError(error);
  return data ? fromRow(data as EnquiryRow) : null;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const { error, count } = await getSupabase().from(TABLE).delete({ count: "exact" }).eq("id", id);
  if (error) throw dbError(error);
  return (count ?? 0) > 0;
}
