import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import type { Cast, FeedResponse, User } from "@neynar/nodejs-sdk/build/api";
import { withObserveHttpCall } from "./observability";
import { withCache } from "./cache";

export interface FetchTrendingCastsParams {
  limit?: number;
  cursor?: string;
}

export class NeynarService {
  private client: NeynarAPIClient;
  private kvStore: KVNamespace | null;

  constructor(apiKey: string, kvStore?: KVNamespace) {
    const config = new Configuration({
      apiKey,
    });
    this.client = new NeynarAPIClient(config);
    this.kvStore = kvStore || null;
  }

  fetchTrendingCasts(params: FetchTrendingCastsParams = {}): Promise<FeedResponse> {
    const { limit = 10, cursor } = params;
    const cacheKey = `fetchTrendingCasts_limit_${limit}_cursor_${cursor || "none"}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchTrendingCasts",
        async (params: FetchTrendingCastsParams = {}): Promise<FeedResponse> => {
          const { limit = 10, cursor } = params;

          try {
            const response = await this.client.fetchTrendingFeed({
              limit,
              cursor,
              timeWindow: "6h",
            });
            return response;
          } catch (err) {
            console.error(
              "Error fetching trending casts with response from Neynar:",
              err,
            );
            throw err;
          }
        },
      ),
      this.kvStore,
      cacheKey
    )(params);
  }

  fetchUser(fid: number) {
    const cacheKey = `fetchUser_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUser",
        async (fid: number) => {
          return this.client.fetchBulkUsers({
            fids: [fid],
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchUserBestFriends(fid: number) {
    const cacheKey = `fetchUserBestFriends_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUserBestFriends",
        async (fid: number) => {
          return this.client.getUserBestFriends({
            fid,
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchLastUserFollowers(fid: number) {
    const cacheKey = `fetchLastUserFollowers_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchLastUserFollowers",
        async (fid: number) => {
          return this.client.fetchUserFollowers({
            fid,
            sortType: "desc_chron",
            limit: 20,
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchMostImportantUserFollowers(fid: number) {
    const cacheKey = `fetchMostImportantUserFollowers_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchMostImportantUserFollowers",
        async (fid: number) => {
          return this.client.fetchUserFollowers({
            fid,
            sortType: "algorithmic",
            limit: 5,
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchUserLastFollowings(fid: number) {
    const cacheKey = `fetchUserLastFollowings_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUserLastFollowings",
        async (fid: number) => {
          return this.client.fetchUserFollowing({
            fid,
            limit: 20,
            sortType: "desc_chron",
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchUserPopularCasts(fid: number) {
    const cacheKey = `fetchUserPopularCasts_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUserPopularCasts",
        async (fid: number) => {
          return this.client.fetchPopularCastsByUser({
            fid,
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchUserLatestCasts(fid: number) {
    const cacheKey = `fetchUserLatestCasts_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUserLatestCasts",
        async (fid: number) => {
          return this.client.fetchCastsForUser({
            fid,
            limit: 20,
          });
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }

  fetchUserProfile(fid: number): Promise<User> {
    const cacheKey = `fetchUserProfile_fid_${fid}`;

    return withCache(
      withObserveHttpCall(
        "NeynarService.fetchUserProfile",
        async (fid: number): Promise<User> => {
          const response = await this.client.fetchBulkUsers({
            fids: [fid],
          });

          if (!response.users || response.users.length === 0) {
            throw new Error(`User with fid ${fid} not found`);
          }

          return response.users[0];
        },
      ),
      this.kvStore,
      cacheKey
    )(fid);
  }
}

export function baseUserInfo(
  obj:
    | User
    | { object: "follow"; user: User }
    | { object: "follower"; user: User },
) {
  if (obj.object === "user") {
    return {
      fid: obj.fid,
      display_name: obj.display_name,
      bio: obj.profile.bio.text,
    };
  }
  if (obj.object === "follow") {
    return {
      fid: obj.user.fid,
      display_name: obj.user.display_name,
      bio: obj.user.profile.bio.text,
    };
  }
  console.error("[baseUserInfo] unsupported object:", obj);
  throw new Error("[baseUserInfo] unknown object type");
}

export function baseCastInfo(cast: Cast) {
  return {
    hash: cast.hash,
    text_content: cast.text,
    caste_timestamp: cast.timestamp,
    reactions: cast.reactions,
    replies: cast.replies,
  };
}

export function userToPromptInput(user: User) {
  return `name: ${user.display_name}, bio: ${user.profile.bio.text}`;
}

export function castToPromptInput(cast: Cast) {
  return `user ${cast.author.display_name} wrote: ${cast.text} (replies: ${cast.replies}, likes: ${cast.reactions.likes_count}, reposts: ${cast.reactions.recasts_count})`;
}
