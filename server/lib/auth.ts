import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { createAuthClient } from "./supabase";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function isLoginRateLimited(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedLogin(ip: string): void {
  const entry = attempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearLoginAttempts(ip: string): void {
  attempts.delete(ip);
}

/* Passwords are checked by Supabase Auth, but being a Supabase user is not enough: anyone can be
   given an account, so only users whose app_metadata.role is "admin" get in. app_metadata can only
   be written with the service role (SQL editor or dashboard), never by the user themselves, unlike
   user_metadata. Returns false for wrong credentials and non-admins alike so the login screen
   cannot be used to discover which emails have accounts. Throws if Supabase itself is failing. */
export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const client = createAuthClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.status === 429) throw Object.assign(new Error("Too many login attempts. Try again later."), { status: 429 });
    if (error.status === 400 || error.status === 401 || error.status === 422) return false;
    throw new Error(`Supabase Auth: ${error.message}`);
  }
  const isAdmin = data.user?.app_metadata?.role === "admin";
  // Nothing keeps this Supabase session, so end it rather than leave a live one behind.
  await client.auth.signOut().catch(() => {});
  return isAdmin;
}

/* The admin session is a signed cookie rather than a server-side session. On Vercel every
   request can land on a different short-lived instance, so an in-memory session store would log
   the admin out at random. The cookie carries only an expiry time and an HMAC of it; nothing
   about the user is stored anywhere. There is no server-side revocation: logging out clears the
   cookie, and a stolen one stays valid until it expires (8 hours). */
const COOKIE_NAME = "ht_admin_session";
const SESSION_MS = 8 * 60 * 60 * 1000;
const DEV_SECRET = "dev-only-secret-change-me";

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  // The secret is the only thing standing between the internet and the admin panel, so a
  // guessable fallback is only acceptable on a developer's machine.
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET must be set to at least 16 characters");
  return DEV_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function startAdminSession(res: Response): void {
  const payload = `v1.${Date.now() + SESSION_MS}`;
  res.cookie(COOKIE_NAME, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MS,
    path: "/",
  });
}

export function endAdminSession(res: Response): void {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
}

export function isAdminRequest(req: Request): boolean {
  const value = readCookie(req, COOKIE_NAME);
  if (!value) return false;
  const lastDot = value.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = value.slice(0, lastDot);
  const [version, expiresAt] = payload.split(".");
  if (version !== "v1" || !(Number(expiresAt) > Date.now())) return false;
  const given = Buffer.from(value.slice(lastDot + 1));
  const expected = Buffer.from(sign(payload));
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (isAdminRequest(req)) {
    next();
    return;
  }
  res.status(401).json({ error: "Authentication required" });
}
