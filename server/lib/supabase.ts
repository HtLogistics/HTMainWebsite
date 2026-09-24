import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily constructed so importing this module never fails at load time (which would crash
// every request on a serverless cold start) — the error only surfaces when a route actually
// needs the database, where it becomes a normal per-request 500 instead of a dead function.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  // The service role key bypasses Row Level Security — never expose it to the client, only use
  // it here on the server. There's no browser session to persist.
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// supabase-js returns errors as plain objects; throwing those bare loses the stack and prints as
// "#<Object>" in logs, so wrap them in a real Error.
export function dbError(error: { message: string }): Error {
  return new Error(`Supabase: ${error.message}`);
}

// Password sign-in goes through its own client built with the publishable key. It must never be
// the service-role client: after signInWithPassword a supabase-js client switches to that user's
// token, which would silently drop the service role's privileges for every later query. A fresh
// client per attempt also means one admin's session is never held in memory for the next request.
export function createAuthClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
