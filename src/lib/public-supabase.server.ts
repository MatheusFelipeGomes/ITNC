import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-only Supabase client using the publishable key.
 * Used by public server functions (SSR) with anon SELECT policies.
 */
export function publicSupabase() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

const ONE_WEEK = 60 * 60 * 24 * 7;

/** Media stored in the private `midias` bucket is exposed through short-lived signed URLs. */
export async function resolveMedia<T>(rows: T[], fields: string[]): Promise<T[]> {
  const client = publicSupabase();
  const paths = new Set<string>();

  for (const row of rows) {
    for (const field of fields) {
      const value = (row as Record<string, unknown>)[field];
      if (typeof value === "string" && value && !value.startsWith("http")) paths.add(value);
    }
  }
  if (paths.size === 0) return rows;

  const signed = new Map<string, string>();
  await Promise.all(
    [...paths].map(async (path) => {
      const { data } = await client.storage.from("midias").createSignedUrl(path, ONE_WEEK);
      if (data?.signedUrl) signed.set(path, data.signedUrl);
    }),
  );

  return rows.map((row) => {
    const next = { ...row } as Record<string, unknown>;
    for (const field of fields) {
      const value = next[field];
      if (typeof value === "string" && signed.has(value)) next[field] = signed.get(value);
    }
    return next as T;
  });
}
