import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import type { Enquiry, EnquiryInput } from "@shared/enquiry";
import { DATA_DIR } from "./postsStore";

const ENQUIRIES_FILE = path.join(DATA_DIR, "enquiries.json");

let cache: Enquiry[] | null = null;
let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureLoaded(): Promise<Enquiry[]> {
  if (cache) return cache;
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(ENQUIRIES_FILE, "utf-8");
    cache = JSON.parse(raw) as Enquiry[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      cache = [];
      await persist();
    } else {
      throw err;
    }
  }
  return cache!;
}

async function persist(): Promise<void> {
  const data = cache ?? [];
  writeQueue = writeQueue.then(() => fs.writeFile(ENQUIRIES_FILE, JSON.stringify(data, null, 2), "utf-8"));
  await writeQueue;
}

/* Newest first — the inbox is read chronologically. */
export async function listEnquiries(): Promise<Enquiry[]> {
  const all = await ensureLoaded();
  return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createEnquiry(input: EnquiryInput): Promise<Enquiry> {
  const all = await ensureLoaded();
  const enquiry: Enquiry = {
    id: nanoid(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    service: input.service ?? "",
    subject: input.subject ?? "",
    message: input.message,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  all.unshift(enquiry);
  await persist();
  return enquiry;
}

export async function markEnquiryRead(id: string, read: boolean): Promise<Enquiry | null> {
  const all = await ensureLoaded();
  const enquiry = all.find(e => e.id === id);
  if (!enquiry) return null;
  enquiry.status = read ? "read" : "new";
  await persist();
  return enquiry;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const all = await ensureLoaded();
  const index = all.findIndex(e => e.id === id);
  if (index === -1) return false;
  all.splice(index, 1);
  await persist();
  return true;
}
