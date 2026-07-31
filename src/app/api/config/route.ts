import { NextResponse } from "next/server";
import { getRedis, CONFIG_KEY } from "@/lib/tracker/redis";
import type { OnboardingConfig, TrackId } from "@/lib/tracker/tracks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRACK_IDS: TrackId[] = ["ai-engineering", "security", "leadership", "data-science"];

export async function GET() {
  try {
    const config = await getRedis().get<OnboardingConfig>(CONFIG_KEY);
    return NextResponse.json({ config: config ?? null });
  } catch {
    return NextResponse.json({ config: null, warning: "store-unavailable" });
  }
}

export async function POST(req: Request) {
  let body: Partial<OnboardingConfig> | null = null;
  try {
    body = await req.json();
  } catch {
    // fall through
  }

  if (!body || !TRACK_IDS.includes(body.track as TrackId)) {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }
  const hours = Number(body.hours);
  if (!Number.isFinite(hours) || hours < 1) {
    return NextResponse.json({ error: "Invalid hours" }, { status: 400 });
  }
  if (!body.startISO || !/^\d{4}-\d{2}-\d{2}$/.test(body.startISO)) {
    return NextResponse.json({ error: "Invalid startISO" }, { status: 400 });
  }

  const config: OnboardingConfig = {
    track: body.track as TrackId,
    years: typeof body.years === "string" ? body.years : "",
    hours,
    pythonFluent: !!body.pythonFluent,
    goal: typeof body.goal === "string" ? body.goal : "",
    startISO: body.startISO,
    createdAt: Date.now(),
  };

  try {
    await getRedis().set(CONFIG_KEY, config);
    return NextResponse.json({ ok: true, config });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
