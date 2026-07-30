import { NextResponse } from "next/server";
import { getRedis, QUESTIONS_KEY } from "@/lib/tracker/redis";
import type { Question } from "@/lib/tracker/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readAll(): Promise<Question[]> {
  const data = (await getRedis().get<Question[]>(QUESTIONS_KEY)) ?? [];
  return Array.isArray(data) ? data : [];
}

// List all questions (newest first).
export async function GET() {
  try {
    const questions = await readAll();
    questions.sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ questions: [], warning: "store-unavailable" });
  }
}

// Raise a new question against a week.
export async function POST(req: Request) {
  let week = 0;
  let text = "";
  try {
    const body = await req.json();
    week = Number(body?.week);
    text = typeof body?.text === "string" ? body.text.trim() : "";
  } catch {
    // fall through
  }

  if (!Number.isFinite(week) || week < 1 || !text) {
    return NextResponse.json({ error: "Expected { week: number, text: string }" }, { status: 400 });
  }

  const question: Question = {
    id: crypto.randomUUID(),
    week,
    text: text.slice(0, 2000),
    status: "open",
    createdAt: Date.now(),
  };

  try {
    const all = await readAll();
    all.push(question);
    await getRedis().set(QUESTIONS_KEY, all);
    return NextResponse.json({ ok: true, question });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
