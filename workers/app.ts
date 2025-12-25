import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";
import { clearCache, getCachedUserData } from "./services/cache";
import {
  baseCastInfo,
  baseUserInfo,
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
    const cachedQueryRes = await c.env.USER_CACHE.get(`user_99`)
    if (!cachedQueryRes) {
      return c.json({ error: "no cached data found for the user" });
    }

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
    const userBio = "base builder #001 | DM jessexbt to get started building";

    const genAI = new GoogleGenAI({
      vertexai: true,
      apiKey: c.env.GEMINI_API_KEY,
    });

    const prompt = `Based on this Farcaster user's data, predict what they will be doing in 2026. Provide a prediction as a list of specific, creative statements: 1. sentenc about reading of their data, 2. person archetype in one phrase, 3. sentence about their biggest achievement in next year, 4. a sentence with a warning about what to be wary of. 5. highlight their best moments with best friends on farcast. Be imaginative with predictions but realistic based on their current patterns.

User Data:
- bio: ${userBio}
- Recent followings:\n - ${lastFollowingsRes.users.map((u) => userToPromptInput(u.user)).join(";\n - ")}\n
- Latest casts:\n - ${latestCastsRes.casts.map(castToPromptInput).join(";\n ")}\n
- Popular casts:\n -${popularCastsRes.casts.map(castToPromptInput).join(";\n ")}\n
- Best friends:\n - ${mostImportantFollowersRes.users.map((u) => userToPromptInput(u.user)).join(";\n - ")}

IMPORTANT: Output ONLY with a valid JSON output, each sentence-prediction separate string in an array, no markdown formatting. Example: ["1st sentence", "2nd phrase", "3rd sentence", "4th sentence", "the last sentence"]`;

    let text: string | null = null;
    try {
      const res = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      console.debug({ genAiRes: res, prompt });
      if (res.text) {
        text = res.text;
      }
    } catch (err) {
      console.error("Gemini API error:", err);
    }
    if (!text) {
      console.error({ error: "Failed to generate prediction", prompt });
      return c.json({ error: "Failed to generate prediction" });
    }

    try {
      const predictions = JSON.parse(text.trim());
      if (
        Array.isArray(predictions) &&
        predictions.every((p) => typeof p === "string") &&
        predictions.length > 0
      ) {
        return c.json({ predictions });
      } else {
        console.error({ error: "Invalid prediction format", text });
        return c.json({ error: "Invalid prediction format" });
      }
    } catch (err) {
      console.error({ error: "Failed to parse AI response as JSON", text, err });
      return c.json({ error: "Failed to parse AI response as JSON" });
    }
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

    const neynar = new NeynarService(c.env.NEYNAR_API_KEY, c.env.USER_CACHE);

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
};
