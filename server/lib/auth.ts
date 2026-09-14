import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

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

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !expectedHash) return false;
  if (username !== expectedUsername) return false;
  return bcrypt.compare(password, expectedHash);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session.isAdmin) {
    next();
    return;
  }
  res.status(401).json({ error: "Authentication required" });
}
