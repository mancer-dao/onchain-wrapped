import { Hono } from "hono";
import { AiServiceWithCache } from "./services/ai";
import {
  castToPromptInput,
  NeynarService,
  userToPromptInput,
} from "./services/neynar";
import * as errors from "./errors";
import { createClient as createFarcasterAuthClient } from "@farcaster/quick-auth";
import { createMiddleware } from "hono/factory";

const authMiddleware = createMiddleware<{
  Variables: {
    user: { fid: number; issuer: string };
  };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ code: errors.UNAUTHORIZED }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const auth = createFarcasterAuthClient();
    const payload = await auth.verifyJwt({
      token,
      // must match current mini-app URL
      domain: "farcaster-oracle.magicdima.xyz",
    });

    const user = { fid: payload.sub, issuer: payload.iss };
    console.debug({ context: "[auth middleware] user authenticated", user });
    c.set("user", user);
    await next();
  } catch (err) {
    console.error({ contex: "[auth middleware] error", error: err });
    return c.json({ code: errors.UNAUTHORIZED }, 401);
  }
});

const app = new Hono<{ Bindings: Env }>()
  .get("/api/health", (c) => {
    return c.json({ health: "live" });
  })
  .post("/api/predictions", authMiddleware, async (c) => {
    const now = Date.now();
    let userFid = c.var.user.fid;
    if (userFid === 1478450 || userFid === 1138489) {
      const body = await c.req.json();
      if (body.fid != null && (Number.isNaN(body.fid) || body.fid <= 0)) {
        return c.json({ code: errors.INVALID_REQUEST }, 400);
      } else if (body.fid) {
        // override from req body, only available for admin/god mode
        userFid = body.fid;
      }
    }
    const ignoreCache =
      c.req.query("ignore-cache") === "t" && c.var.user.fid === 1478450;

    if (Number.isNaN(userFid) || userFid <= 0) {
      return c.json({ code: errors.INVALID_REQUEST }, 400);
    }

    await c.env.USAGE.put(
      `predictions:${now}`,
      JSON.stringify({ fid: userFid, timestamp: now, user: c.var.user }),
    );

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

    const neynar = new NeynarService(
      c.env.NEYNAR_API_KEY,
      ignoreCache ? undefined : c.env.USER_CACHE,
    );
    const lastFollowingsRes = await neynar.fetchUserLastFollowings(userFid);
    const latestCastsRes = await neynar.fetchUserLatestCasts(userFid);
    const popularCastsRes = await neynar.fetchUserPopularCasts(userFid);
    const mostImportantFollowersRes =
      await neynar.fetchMostImportantUserFollowers(userFid);
    const userProfile = await neynar.fetchUserProfile(userFid);
    const userBio = userProfile.profile.bio.text || "";

    if (!popularCastsRes.casts.length) {
      return c.json({ code: errors.IMMATURE_ACCOUNT });
    }

    const aiService = new AiServiceWithCache(
      c.env.GEMINI_API_KEY,
      c.env.USER_CACHE,
    );

    if (ignoreCache) {
      try {
        await aiService.purgeCache(userFid);
      } catch (err) {
        console.error("Failed to purge cache:", err);
        return c.json({ code: errors.UNKNOWN_ERROR }, 500);
      }
    }

    try {
      const predictions = await aiService.generatePredictions({
        userFid,
        userBio,
        recentFollowings: lastFollowingsRes.users.map((u) =>
          userToPromptInput(u.user),
        ),
        latestCasts: latestCastsRes.casts.map(castToPromptInput),
        popularCasts: popularCastsRes.casts.map(castToPromptInput),
        bestFriends: mostImportantFollowersRes.users.map((u) =>
          userToPromptInput(u.user),
        ),
      });

      console.debug({ context: "predictions generated", predictions });
      return c.json({ predictions, code: errors.NO_ERROR });
    } catch (err) {
      console.error({ context: "failed to generate predictions", error: err });
      return c.json({ code: errors.UNKNOWN_ERROR }, 500);
    }
  });

export default {
  fetch: app.fetch,
};

export type ApiType = typeof app;
