import { createClient } from "@supabase/supabase-js";

export const getDbConnection = (url: string, key: string) => {
  return createClient(url, key);
};
