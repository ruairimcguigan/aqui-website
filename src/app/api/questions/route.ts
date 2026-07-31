import { NextResponse } from "next/server";
import { getRedis, QUESTIONS_KEY, PROGRESS_KEY, CONFIG_KEY } from "@/lib/tracker/redis";
import { answerQuestion } from "@/lib/tracker/answer";
import { PLAN, type Question, type Progress } from "@/lib/tracker/plan";
import { generatePlan, type OnboardingConfig } from "@/lib/tracker/tracks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

// Raise a new question against a week — and answer it immediately if possible.
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

  let all: Question[];
  try {
    all = await readAll();
    all.push(question);
    await getRedis().set(QUESTIONS_KEY, all);
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }

  // Answer on submit for instant turnaround. If it fails, the question stays
  // "open" and the periodic backstop (/api/cron/answer) will pick it up.
  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const progress = (await getRedis().get<Progress>(PROGRESS_KEY)) ?? {};
      const config = await getRedis().get<OnboardingConfig>(CONFIG_KEY);
      const plan = config ? generatePlan(config) : PLAN;
      const answer = await answerQuestion(question, progress, plan);
      question.answer = answer;
      question.status = "answered";
      question.answeredAt = Date.now();
      await getRedis().set(QUESTIONS_KEY, all); // `question` is a reference inside `all`
    }
  } catch {
    // leave it open; backstop will handle it
  }

  return NextResponse.json({ ok: true, question });
}

// Delete a question by id: DELETE /api/questions?id=...
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const all = await readAll();
    const next = all.filter((q) => q.id !== id);
    await getRedis().set(QUESTIONS_KEY, next);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
}
