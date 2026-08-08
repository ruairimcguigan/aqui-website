import { COACH_CONTEXT } from "./coach-context";
import { type PlanWeek, type Question, type Progress } from "./plan";

// Shared question-answering used by both the on-submit path (/api/questions)
// and the periodic backstop (/api/cron/answer). `plan` is the learner's active
// roadmap (personalized track if set, otherwise the default) so week context is
// always correct.

const MODEL = process.env.COACH_MODEL || "claude-sonnet-4-6";

export function weekInfo(week: number, plan: PlanWeek[]): string {
  const w = plan.find((p) => p.week === week);
  if (!w) return `Week ${week}.`;
  return `Week ${w.week} (${w.start}) — ${w.phase} — focus: ${w.focus}. This week's tasks: ${w.tasks}${
    w.milestone ? ` Milestone: ${w.milestone}.` : ""
  }`;
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

// Generic Claude call used by the coach features.
export async function callClaude(
  system: string,
  messages: ChatMessage[],
  maxTokens = 1024
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages }),
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

export async function answerQuestion(q: Question, progress: Progress, plan: PlanWeek[]): Promise<string> {
  const wp = progress[q.week];
  const progressNote = wp
    ? `His logged status for week ${q.week}: ${wp.status}${wp.actualHrs ? `, ${wp.actualHrs}h` : ""}${
        wp.notes ? `, note: "${wp.notes}"` : ""
      }.`
    : `He hasn't logged progress for week ${q.week} yet.`;

  const system = `${COACH_CONTEXT}\n\nContext for THIS question (tagged to a week):\n${weekInfo(
    q.week,
    plan
  )}\n${progressNote}\n\nAnswer his question directly and practically in a few short paragraphs. No preamble, no sign-off.`;

  return callClaude(system, [{ role: "user", content: q.text }], 1024);
}
