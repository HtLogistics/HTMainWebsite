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
