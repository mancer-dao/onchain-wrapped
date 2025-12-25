import { Hono } from "hono";
import { AiServiceWithCache } from "./services/ai";
import {
  castToPromptInput,
  NeynarService,
  userToPromptInput,
} from "./services/neynar";

const app = new Hono<{ Bindings: Env }>();

app
  .get("/api/health", (c) => {
    return c.json({ health: "live" });
  })
  .get("/api/predict/:fid", async (c) => {
    const userFid = Number(c.req.param("fid"));
    const ignoreCache = c.req.query("ignore-cache") === "t";

    if (Number.isNaN(userFid) || userFid <= 0) {
      return c.json({ error: "invalid fid" });
    }

    // const cachedQueryRes = await c.env.USER_CACHE.get(`user_99`)
    // if (!cachedQueryRes) {
    //   return c.json({ error: "no cached data found for the user" });
    // }
    // const { 
    //   mostImportantFollowersRes,
    //   lastFollowingsRes,
    //   latestCastsRes,
    //   popularCastsRes,
    // } = JSON.parse(cachedQueryRes);

    const neynar = new NeynarService(c.env.NEYNAR_API_KEY, ignoreCache ? undefined : c.env.USER_CACHE);
    const lastFollowingsRes = await neynar.fetchUserLastFollowings(userFid);
    const latestCastsRes = await neynar.fetchUserLatestCasts(userFid);
    const popularCastsRes = await neynar.fetchUserPopularCasts(userFid);
    const mostImportantFollowersRes = await neynar.fetchMostImportantUserFollowers(userFid);
    const userProfile = await neynar.fetchUserProfile(userFid);
    const userBio = userProfile.profile.bio.text || "";

    const aiService = new AiServiceWithCache(c.env.GEMINI_API_KEY, c.env.USER_CACHE);

    if (ignoreCache) {
      try {
      await aiService.purgeCache(userFid);
      } catch (err) {
        console.error("Failed to purge cache:", err);
        return c.json({ error: "internal error" });
      }
    }

    try {
      const predictions = await aiService.generatePredictions({
        userFid,
        userBio,
        recentFollowings: lastFollowingsRes.users.map((u) => userToPromptInput(u.user)),
        latestCasts: latestCastsRes.casts.map(castToPromptInput),
        popularCasts: popularCastsRes.casts.map(castToPromptInput),
        bestFriends: mostImportantFollowersRes.users.map((u) => userToPromptInput(u.user)),
      });

      return c.json({ predictions });
    } catch (err) {
      console.error({ context: "failed to generate predictions", error: err });
      return c.json({ error: "internal error" });
    }
  });

export default {
  fetch: app.fetch,
};
