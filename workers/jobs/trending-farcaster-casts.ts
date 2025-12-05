import { NO_ERROR } from "../errors";
import { withDbConnection } from "../services/supabase";

export const trendingFarcasterCasts = withDbConnection(async (c) => {
  await c.db.from("genstore").insert({
    key: "trending-farcaster-casts:last-run",
    value: new Date().toISOString(),
  });
  return NO_ERROR;
});
