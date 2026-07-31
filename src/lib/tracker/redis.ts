import { Redis } from "@upstash/redis";

// Redis keys used by the tracker.
export const PROGRESS_KEY = "aqui:tracker:progress";
export const QUESTIONS_KEY = "aqui:tracker:questions";
export const CONFIG_KEY = "aqui:tracker:config";

// Works with either env-var naming convention:
//  - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash direct), or
//  - KV_REST_API_URL / KV_REST_API_TOKEN (Vercel Marketplace Upstash integration).
// Instantiated lazily so a missing store degrades gracefully rather than
// crashing routes at import time.
export function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Redis REST credentials not configured");
  }
  return new Redis({ url, token });
}
