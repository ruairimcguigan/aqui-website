import { NextResponse } from "next/server";
import { getRedis, QUESTIONS_KEY, PROGRESS_KEY } from "@/lib/tracker/redis";
import { answerQuestion } from "@/lib/tracker/answer";
import type { Question, Progress } from "@/lib/tracker/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CONCURRENCY = 5; // answer up to this many at once; higher just needs rate-limit headroom

// Run an async mapper over items with a bounded concurrency.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function handle(req: Request) {
  const url = new URL(req.url);
  if (!process.env.CRON_SECRET || url.searchParams.get("key") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  let questions: Question[];
  let progress: Progress;
  try {
    const redis = getRedis();
    questions = (await redis.get<Question[]>(QUESTIONS_KEY)) ?? [];
    progress = (await redis.get<Progress>(PROGRESS_KEY)) ?? {};
  } catch {
    return NextResponse.json({ error: "store-unavailable" }, { status: 503 });
  }
  if (!Array.isArray(questions)) questions = [];

  const open = questions.filter((q) => q.status === "open");
  if (open.length === 0) {
    return NextResponse.json({ answered: 0, message: "No open questions." });
  }

  type Outcome = { q: Question; ok: true; answer: string } | { q: Question; ok: false; error: string };
  const outcomes = await mapLimit<Question, Outcome>(open, CONCURRENCY, async (q) => {
    try {
      const answer = await answerQuestion(q, progress);
      return { q, ok: true, answer };
    } catch (e) {
      return { q, ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  });

  const answeredWeeks: number[] = [];
  const errors: string[] = [];
  for (const o of outcomes) {
    if (o.ok) {
      o.q.answer = o.answer;
      o.q.status = "answered";
      o.q.answeredAt = Date.now();
      answeredWeeks.push(o.q.week);
    } else {
      errors.push(`week ${o.q.week}: ${o.error}`);
    }
  }

  try {
    await getRedis().set(QUESTIONS_KEY, questions);
  } catch {
    return NextResponse.json({ error: "failed-to-save", answered: answeredWeeks.length }, { status: 503 });
  }

  return NextResponse.json({
    answered: answeredWeeks.length,
    weeks: answeredWeeks,
    remaining: open.length - answeredWeeks.length,
    errors,
  });
}

export async function GET(req: Request) {
  return handle(req);
}
export async function POST(req: Request) {
  return handle(req);
}
