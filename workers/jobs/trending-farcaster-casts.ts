import { getDbConnection } from "../services/supabase";

export const trendingFarcasterCasts = async (env: {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}) => {
  const db = getDbConnection(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  await db.from("genstore").insert({
    key: "trending-farcaster-casts:last-run",
    value: new Date().toISOString(),
  });
};
