import { NextResponse } from "next/server";
import { getRedis, QUESTIONS_KEY, PROGRESS_KEY } from "@/lib/tracker/redis";
import { COACH_CONTEXT } from "@/lib/tracker/coach-context";
import { PLAN, type Question, type Progress } from "@/lib/tracker/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.COACH_MODEL || "claude-3-5-sonnet-latest";
const MAX_PER_RUN = 5; // bound cost/time; backlog clears over subsequent runs

function weekInfo(week: number): string {
  const w = PLAN.find((p) => p.week === week);
  if (!w) return `Week ${week}.`;
  return `Week ${w.week} (${w.start}) — ${w.phase} — focus: ${w.focus}. This week's tasks: ${w.tasks}${
    w.milestone ? ` Milestone: ${w.milestone}.` : ""
  }`;
}

async function answerQuestion(q: Question, progress: Progress): Promise<string> {
  const wp = progress[q.week];
  const progressNote = wp
    ? `His logged status for week ${q.week}: ${wp.status}${wp.actualHrs ? `, ${wp.actualHrs}h` : ""}${
        wp.notes ? `, note: "${wp.notes}"` : ""
      }.`
    : `He hasn't logged progress for week ${q.week} yet.`;

  const system = `${COACH_CONTEXT}\n\nContext for THIS question (tagged to a week):\n${weekInfo(
    q.week
  )}\n${progressNote}\n\nAnswer his question directly and practically in a few short paragraphs. No preamble, no sign-off.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: q.text }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = Array.isArray(data?.content)
    ? data.content
        .filter((b: { type?: string }) => b.type === "text")
        .map((b: { text?: string }) => b.text ?? "")
        .join("\n")
        .trim()
    : "";
  return text || "(no answer generated)";
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

  const toAnswer = open.slice(0, MAX_PER_RUN);
  const answeredWeeks: number[] = [];
  const errors: string[] = [];

  for (const q of toAnswer) {
    try {
      const a = await answerQuestion(q, progress);
      q.answer = a;
      q.status = "answered";
      q.answeredAt = Date.now();
      answeredWeeks.push(q.week);
    } catch (e) {
      errors.push(`week ${q.week}: ${e instanceof Error ? e.message : String(e)}`);
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
