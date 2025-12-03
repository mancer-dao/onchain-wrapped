import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";

export const getClient = (apiKey: string) => {
  const config = new Configuration({
    apiKey,
  });

  return new NeynarAPIClient(config);
};
