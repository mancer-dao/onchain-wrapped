import { Hono } from "hono";
// import { createRequestHandler } from "react-router";
import { getClient } from "./services/neynar";
import { trendingFarcasterCasts } from "./jobs/trending-farcaster-casts";

const app = new Hono<{ Bindings: Env }>();

app
  .get("/health", (c) => {
    return c.json({ health: "live" });
  })
  .get("/t", async (c) => {
    try {
      const res = await getClient(c.env.NEYNAR_API_KEY).fetchBulkUsers({
        fids: [1478450],
      });
      return c.json({ result: res });
    } catch (err) {
      console.error({ context: "failed to fetch user", err });
      return c.json({ error: "internal server error" });
    }
  });
// .get("*", (c) => {
//   const requestHandler = createRequestHandler(
//     () => import("virtual:react-router/server-build"),
//     import.meta.env.MODE,
//   );
//
//   return requestHandler(c.req.raw, {
//     cloudflare: { env: c.env, ctx: c.executionCtx },
//   });
// });

export default {
  fetch: app.fetch,

  async scheduled(
    _event: ScheduledController,
    env: Env,
    c: ExecutionContext,
  ) {
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
