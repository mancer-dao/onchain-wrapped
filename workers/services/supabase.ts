import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "./types";

export const getDbConnection = (url: string, key: string) => {
  return createClient(url, key);
};

type WithDbContext = {
  db: SupabaseClient
}

export function withDbConnection(fn: (c: Context & WithDbContext) => void) {
  return async (c: Context) => {
    const db = getDbConnection(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);
    return fn({ ...c, db });
  };
};
