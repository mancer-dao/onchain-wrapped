import { GoogleGenAI } from "@google/genai";
import { withCache } from "./cache";

export interface GeneratePredictionParams {
  userFid: number;
  userBio: string;
  recentFollowings: string[];
  latestCasts: string[];
  popularCasts: string[];
  bestFriends: string[];
}

export class AiService {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({
      vertexai: true,
      apiKey,
    });
  }

  async generatePredictions(params: GeneratePredictionParams): Promise<string[]> {
    const { userBio, recentFollowings, latestCasts, popularCasts, bestFriends } = params;

    const prompt = `Based on this Farcaster user's data, predict what they will be doing in 2026. Provide a prediction as a list of specific, creative statements: 1. sentence about reading of their data, 2. person archetype in one phrase from their bio and latest and popular casts, 3. sentence about their biggest achievement in next year, 4. a sentence with a warning about what to be wary of, 5. highlight their best moments with best friends on farcast. Be imaginative with predictions but realistic based on their current patterns.

User Data:
- bio: ${userBio}
- Recent followings:\n - ${recentFollowings.join(";\n - ")}\n
- Latest casts:\n - ${latestCasts.join(";\n ")}\n
- Popular casts:\n -${popularCasts.join(";\n ")}\n
- Best friends:\n - ${bestFriends.join(";\n - ")}

IMPORTANT: Output ONLY with a valid JSON output, each sentence-prediction separate string in an array, no markdown formatting. Example: ["1st sentence", "2nd phrase", "3rd sentence", "4th sentence", "the last sentence"]`;

    let text: string | null = null;
    try {
      const res = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      console.debug({ genAiRes: res, prompt });
      if (res.text) {
        text = res.text;
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      throw new Error("Failed to generate prediction");
    }

    if (!text) {
      console.error({ error: "Failed to generate prediction", prompt });
      throw new Error("Failed to generate prediction");
    }

    try {
      const predictions = JSON.parse(text.trim());
      if (
        Array.isArray(predictions) &&
        predictions.every((p) => typeof p === "string") &&
        predictions.length > 0
      ) {
        return predictions;
      } else {
        console.error({ error: "Invalid prediction format", text });
        throw new Error("Invalid prediction format");
      }
    } catch (err) {
      console.error({ error: "Failed to parse AI response as JSON", text, err });
      throw new Error("Failed to parse AI response as JSON");
    }
  }
}

export class AiServiceWithCache {
  private aiService: AiService;
  private kvStore: KVNamespace;

  constructor(apiKey: string, kvStore: KVNamespace) {
    this.aiService = new AiService(apiKey);
    this.kvStore = kvStore;
  }

  async generatePredictions(params: GeneratePredictionParams): Promise<string[]> {
    const cacheKey = `ai_predictions_fid_${params.userFid}`;

    const aiCallFunction = async (p: GeneratePredictionParams) => this.aiService.generatePredictions(p);
    const cachedFunction = withCache(aiCallFunction, this.kvStore, cacheKey);

    return cachedFunction(params);
  }

  async purgeCache(userFid: number): Promise<void> {
    const cacheKey = `ai_predictions_fid_${userFid}`;
    try {
      await this.kvStore.delete(cacheKey);
      console.debug(`[AiServiceWithCache] Purged cache for prediction fid: ${userFid}`);
    } catch (err) {
      console.error({ context: "[AiServiceWithCache] Failed to purge cache:", error: err });
      throw new Error("Failed to purge cache");
    }
  }
}
