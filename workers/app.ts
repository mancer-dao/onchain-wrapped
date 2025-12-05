import { Hono } from "hono";
// import { createRequestHandler } from "react-router";
import { trendingFarcasterCasts } from "./jobs/trending-farcaster-casts";
import { clearCache, getCachedUserData } from "./services/cache";
import { baseCastInfo, baseUserInfo, NeynarService } from "./services/neynar";

const app = new Hono<{ Bindings: Env }>();

app
  .get("/api/health", (c) => {
    return c.json({ health: "live" });
  })
  .get("/api/t", async (c) => {
    const userFid = Number(c.req.query("fid"));
    const ignoreCache = c.req.query("ignore-cache") === "t";
    if (Number.isNaN(userFid) || userFid <= 0) {
      return c.json({ error: "invalid fid" });
    }

    if (ignoreCache) {
      console.debug("requested to clear cached for user:", userFid);
      await clearCache(userFid.toString(), c.env.USER_CACHE);
    }

    const neynar = new NeynarService(c.env.NEYNAR_API_KEY);

    const {
      mostImportantFollowersRes,
      lastFollowingsRes,
      latestCastsRes,
      popularCastsRes,
    } = await getCachedUserData(
      userFid,
      async () => {
        const mostImportantFollowersRes =
          await neynar.fetchMostImportantUserFollowers(userFid);
        const lastFollowingsRes = await neynar.fetchUserLastFollowings(userFid);
        const latestCastsRes = await neynar.fetchUserLatestCasts(userFid);
        const popularCastsRes = await neynar.fetchUserPopularCasts(userFid);

        return {
          latestCastsRes,
          popularCastsRes,
          lastFollowingsRes,
          mostImportantFollowersRes,
        };
      },
      c.env.USER_CACHE,
    );

    return c.json({
      popularCasts: popularCastsRes.casts.map(baseCastInfo),
      latestCasts: latestCastsRes.casts.map(baseCastInfo),
      mostImportantFollowers: mostImportantFollowersRes.users.map(baseUserInfo),
      lastFOllowings: lastFollowingsRes.users.map(baseUserInfo),
    });
  });

export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledController, env: Env, c: ExecutionContext) {
    try {
      c.waitUntil(
        trendingFarcasterCasts({ env }).catch((err) => {
          console.error({
            context: "trending-farcaster-casts job failed",
            err,
          });
        }),
      );
      console.log("scheduled trigger done");
    } catch (err) {
      console.error({
        context: "failed to run trending-farcaster-casts job",
        err,
      });
    }
  },
};
