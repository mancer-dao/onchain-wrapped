import { hc } from "hono/client";
import type { ApiType } from "../workers/index";

export const apiClient = hc<ApiType>("/");

// export interface PredictionResponse {
//   predictions?: string[];
//   code?: string;
//   error?: string;
// }
//
// export async function getPredictions(userFid: number): Promise<PredictionResponse> {
//   try {
//     const response = await fetch(`/api/predictions/${userFid}`);
//
//     if (!response.ok) {
//       console.error("Failed to fetch predictions - response not ok");
//       throw new Error(`HTTP ${response.status}`);
//     }
//
//     const data: PredictionResponse = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching predictions:", error);
//     throw error;
//   }
// }
