import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { Progress } from "@/lib/tracker/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEY = "aqui:tracker:progress";

// Works with either env-var naming convention:
//  - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash direct), or
//  - KV_REST_API_URL / KV_REST_API_TOKEN (Vercel Marketplace Upstash integration).
// Instantiated lazily so a missing store degrades gracefully rather than
// crashing the route at import time.
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Redis REST credentials not configured");
  }
  return new Redis({ url, token });
}

export async function GET() {
  try {
    const progress = (await getRedis().get<Progress>(KEY)) ?? {};
    return NextResponse.json({ progress });
  } catch {
    // Store not configured yet, or transient error — return empty so the UI
    // still renders (progress just won't persist until the store is wired up).
    return NextResponse.json({ progress: {}, warning: "store-unavailable" });
  }
}

export async function PUT(req: Request) {
  let progress: Progress | null = null;
  try {
    const body = await req.json();
    if (body && typeof body === "object" && body.progress && typeof body.progress === "object") {
      progress = body.progress as Progress;
    }
  } catch {
    // fall through to bad-request
  }

  if (!progress) {
    return NextResponse.json({ error: "Expected { progress: {...} }" }, { status: 400 });
  }

  try {
    await getRedis().set(KEY, progress);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
