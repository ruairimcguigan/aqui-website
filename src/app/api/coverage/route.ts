import { NextResponse } from "next/server";
import { getRedis, COVERAGE_KEY } from "@/lib/tracker/redis";

// Concept-coverage checklist ticks, stored server-side so they sync across
// every device/session (like /api/progress). Shape: { "<groupIdx>-<itemIdx>": true }.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Coverage = Record<string, boolean>;

export async function GET() {
  try {
    const coverage = (await getRedis().get<Coverage>(COVERAGE_KEY)) ?? {};
    return NextResponse.json({ coverage });
  } catch {
    // Store not configured or transient error — render empty rather than crash.
    return NextResponse.json({ coverage: {}, warning: "store-unavailable" });
  }
}

export async function PUT(req: Request) {
  let coverage: Coverage | null = null;
  try {
    const body = await req.json();
    if (body && typeof body === "object" && body.coverage && typeof body.coverage === "object") {
      coverage = body.coverage as Coverage;
    }
  } catch {
    // fall through to bad-request
  }

  if (!coverage) {
    return NextResponse.json({ error: "Expected { coverage: {...} }" }, { status: 400 });
  }

  try {
    await getRedis().set(COVERAGE_KEY, coverage);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
