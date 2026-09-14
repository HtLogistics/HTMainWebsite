import { Router } from "express";
import { enquiryInputSchema } from "@shared/enquiry";
import { createEnquiry, deleteEnquiry, listEnquiries, markEnquiryRead } from "../lib/enquiriesStore";
import { requireAdmin } from "../lib/auth";

export const enquiriesRouter = Router();

/* Separate from the admin login limiter in lib/auth: a spammer hitting the public form should
   never lock the client out of their own admin login from the same address. */
const MAX_PER_WINDOW = 5;
const WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const entry = submissions.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    submissions.delete(ip);
    return false;
  }
  return entry.count >= MAX_PER_WINDOW;
}

function recordSubmission(ip: string): void {
  const entry = submissions.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

// ---------- Public ----------

enquiriesRouter.post("/enquiries", async (req, res) => {
  const ip = req.ip ?? "unknown";
  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many messages sent. Please try again later or call us directly." });
    return;
  }

  const parsed = enquiryInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Please check the form and try again." });
    return;
  }

  // Honeypot: hidden from real users, so a filled value means a bot. Answer 201 so the bot
  // sees success and does not retry, but store nothing.
  if (parsed.data.website) {
    res.status(201).json({ ok: true });
    return;
  }

  recordSubmission(ip);
  await createEnquiry(parsed.data);
  res.status(201).json({ ok: true });
});

// ---------- Admin ----------

enquiriesRouter.get("/enquiries", requireAdmin, async (_req, res) => {
  res.json({ enquiries: await listEnquiries() });
});

enquiriesRouter.patch("/enquiries/:id/read", requireAdmin, async (req, res) => {
  const read = req.body?.read !== false;
  const enquiry = await markEnquiryRead(req.params.id, read);
  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.json({ enquiry });
});

enquiriesRouter.delete("/enquiries/:id", requireAdmin, async (req, res) => {
  const deleted = await deleteEnquiry(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }
  res.status(204).end();
});
