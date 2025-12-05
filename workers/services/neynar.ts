import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import type { Cast, FeedResponse, User } from "@neynar/nodejs-sdk/build/api";
import { withObserveHttpCall } from "./observability";

export interface FetchTrendingCastsParams {
  limit?: number;
  cursor?: string;
}

export class NeynarService {
  private client: NeynarAPIClient;

  constructor(apiKey: string) {
    const config = new Configuration({
      apiKey,
    });
    this.client = new NeynarAPIClient(config);
  }

  fetchTrendingCasts = withObserveHttpCall(
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
    }
  );

  fetchUser = withObserveHttpCall(
    "NeynarService.fetchUser",
    async (fid: number) => {
      return this.client.fetchBulkUsers({
        fids: [fid],
      });
    }
  );

  fetchUserBestFriends = withObserveHttpCall(
    "NeynarService.fetchUserBestFriends",
    async (fid: number) => {
      return this.client.getUserBestFriends({
        fid,
      });
    }
  );

  fetchLastUserFollowers = withObserveHttpCall(
    "NeynarService.fetchLastUserFollowers",
    async (fid: number) => {
      return this.client.fetchUserFollowers({
        fid,
        sortType: "desc_chron",
        limit: 20,
      });
    }
  );

  fetchMostImportantUserFollowers = withObserveHttpCall(
    "NeynarService.fetchMostImportantUserFollowers",
    async (fid: number) => {
      return this.client.fetchUserFollowers({
        fid,
        sortType: "algorithmic",
        limit: 5,
      });
    }
  );

  fetchUserLastFollowings = withObserveHttpCall(
    "NeynarService.fetchUserLastFollowings",
    async (fid: number) => {
      return this.client.fetchUserFollowing({
        fid,
        limit: 20,
        sortType: "desc_chron",
      });
    }
  );

  fetchUserPopularCasts = withObserveHttpCall(
    "NeynarService.fetchUserPopularCasts",
    async (fid: number) => {
      return this.client.fetchPopularCastsByUser({
        fid,
      });
    }
  );

  fetchUserLatestCasts = withObserveHttpCall(
    "NeynarService.fetchUserLatestCasts",
    async (fid: number) => {
      return this.client.fetchCastsForUser({
        fid,
        limit: 20,
      });
    }
  );
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
  }
}
