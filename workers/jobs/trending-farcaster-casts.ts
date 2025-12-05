import type { Cast } from "@neynar/nodejs-sdk/build/api";
import type { Json } from "workers/database.types";
import { NO_ERROR, UNKNOWN_ERROR } from "../errors";
import { NeynarService } from "../services/neynar";
import { withDbConnection } from "../services/supabase";

interface TrendingCast {
  hash: string;
  author_fid: number;
  content: string;
  cast_timestamp: string;
  likes: number;
  recasts: number;
  replies: number;
  cast_raw: Json;
}

export const trendingFarcasterCasts = withDbConnection(async (c) => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);

  try {
    const neynarService = new NeynarService(c.env.NEYNAR_API_KEY);

    // Drain all pages of trending casts using cursor pagination
    const trendingCasts: Cast[] = [];
    let cursor: string | undefined;
    let hasMorePages = true;

    while (hasMorePages) {
      const fullResponse = await neynarService.fetchTrendingCasts({
        limit: 10,
        cursor,
      });

      trendingCasts.push(...fullResponse.casts);

      if (fullResponse.next?.cursor) {
        cursor = fullResponse.next.cursor;
      } else {
        hasMorePages = false;
      }
    }

    const casts = trendingCasts;

    // Store trending casts in the database
    if (casts && casts.length > 0) {
      const trendingCasts: Omit<TrendingCast, "id" | "created_at">[] =
        casts.map((cast) => ({
          hash: cast.hash,
          author_fid: cast.author.fid,
          content: cast.text,
          cast_timestamp: cast.timestamp,
          likes: cast.reactions?.likes_count || 0,
          recasts: cast.reactions?.recasts_count || 0,
          replies: cast.replies?.count || 0,
          cast_raw: cast as unknown as { [key: string]: Json | undefined },
        }));

      // Upsert to handle idempotency - will update if hash already exists
      const { error: upsertTrendingCastsErr } = await c.db
        .from("trending_casts")
        .upsert(trendingCasts, { onConflict: "hash" });

      if (upsertTrendingCastsErr) {
        console.error({
          context: "Error storing trending casts:",
          err: upsertTrendingCastsErr,
        });
        return UNKNOWN_ERROR;
      }

      // Aggregate users with most trending casts for the week
      // await updateTopTrendingUsers(c.db);
    }

    // Update last run timestamp
    await c.db.from("genstore").upsert(
      {
        key: "trending-farcaster-casts:last-run",
        value: now.toISOString(),
      },
      { onConflict: "key" },
    );

    return NO_ERROR;
  } catch (err) {
    console.error({ context: "Error in trendingFarcasterCasts job:", err });
    return UNKNOWN_ERROR;
  }
});

// async function updateTopTrendingUsers(db: SupabaseClient) {
//   const startOfWeek = new Date();
//   startOfWeek.setHours(0, 0, 0, 0);
//   startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
//
//   const { data: topUsers, error } = await db
//     .from("trending_casts")
//     .select("author_fid, count(*) as trending_count")
//     .gte("timestamp", startOfWeek.toISOString())
//     .group("author_fid")
//     .order("trending_count", { ascending: false })
//     .limit(10);
//
//   if (error) {
//     console.error("Error getting top trending users:", error);
//     throw error;
//   }
//
//   await db.from("genstore").upsert(
//     {
//       key: "top-trending-users",
//       value: JSON.stringify({
//         updated_at: new Date().toISOString(),
//         users: topUsers.map((user) => ({
//           fid: user.author_fid,
//           trending_count: user.trending_count,
//         })),
//       }),
//     },
//     { onConflict: "key" },
//   );
// }
