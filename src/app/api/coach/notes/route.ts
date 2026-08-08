import { NextResponse } from "next/server";
import { getRedis, PROGRESS_KEY, CONFIG_KEY } from "@/lib/tracker/redis";
import { callClaude, type ChatMessage } from "@/lib/tracker/answer";
import { COACH_CONTEXT } from "@/lib/tracker/coach-context";
import { PLAN, type Progress, type PlanWeek } from "@/lib/tracker/plan";
import { generatePlan, type OnboardingConfig } from "@/lib/tracker/tracks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Study-with-your-coach: feeds every saved note into Claude so Ruairi can ask
// it to summarise, quiz him, or reason over what he's captured across weeks.

function buildNotesDoc(progress: Progress, plan: PlanWeek[]): { doc: string; count: number } {
  const parts: string[] = [];
  let count = 0;
  for (const w of plan) {
    const note = (progress[w.week]?.notes ?? "").trim();
    if (!note) continue;
    count += 1;
    parts.push(`## Week ${w.week} — ${w.phase} — ${w.focus}\n${note}`);
  }
  return { doc: parts.join("\n\n"), count };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { reply: "The coach isn't configured yet (missing API key). Add ANTHROPIC_API_KEY and redeploy." },
      { status: 200 }
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) {
      messages = body.messages
        .filter(
          (m: unknown): m is ChatMessage =>
            !!m &&
            typeof (m as ChatMessage).content === "string" &&
            ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant")
        )
        .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, 4000) }))
        .slice(-20);
    }
  } catch {
    // fall through to validation
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Expected { messages: ChatMessage[] } ending with a user turn" }, { status: 400 });
  }

  let progress: Progress = {};
  let plan: PlanWeek[] = PLAN;
  try {
    progress = (await getRedis().get<Progress>(PROGRESS_KEY)) ?? {};
    const config = await getRedis().get<OnboardingConfig>(CONFIG_KEY);
    plan = config ? generatePlan(config) : PLAN;
  } catch {
    return NextResponse.json({ reply: "I can't reach your saved notes right now — try again in a moment." }, { status: 200 });
  }

  const { doc, count } = buildNotesDoc(progress, plan);
  if (count === 0) {
    return NextResponse.json({
      reply: "You haven't saved any notes yet. Capture some quotes, techniques, or approaches from the tracker as you study, and I'll help you summarise or quiz yourself on them.",
    });
  }

  const system = `${COACH_CONTEXT}

STUDY-ASSISTANT MODE
Ruairi is reviewing the notes he has saved across his learning tracker. His full notes are below, grouped by week. Work ONLY from these notes plus your own knowledge to reinforce them — do not invent things he wrote.
- "Summarise" → pull out the key themes, techniques, and quotes across weeks; be concise and well-organised.
- "Quiz me" → ask him a small set of focused questions (one at a time works well), based on what he saved, then wait for his answers before revealing whether he's right.
- For any other request, reason over the notes and help him study.
Answer in markdown. Be specific and reference the relevant week when useful.

HIS SAVED NOTES (${count} week${count === 1 ? "" : "s"}):
${doc}`;

  try {
    const reply = await callClaude(system, messages, 2048);
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json(
      { reply: `The coach hit an error: ${e instanceof Error ? e.message : "unknown"}. Try again in a moment.` },
      { status: 200 }
    );
  }
}
