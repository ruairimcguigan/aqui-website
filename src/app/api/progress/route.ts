import { NextResponse } from "next/server";
import { getRedis, PROGRESS_KEY } from "@/lib/tracker/redis";
import type { Progress } from "@/lib/tracker/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const progress = (await getRedis().get<Progress>(PROGRESS_KEY)) ?? {};
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
    await getRedis().set(PROGRESS_KEY, progress);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
