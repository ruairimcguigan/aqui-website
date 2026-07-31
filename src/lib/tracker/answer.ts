import { COACH_CONTEXT } from "./coach-context";
import { PLAN, type Question, type Progress } from "./plan";

// Shared question-answering used by both the on-submit path (/api/questions)
// and the periodic backstop (/api/cron/answer).

const MODEL = process.env.COACH_MODEL || "claude-sonnet-4-6";

export function weekInfo(week: number): string {
  const w = PLAN.find((p) => p.week === week);
  if (!w) return `Week ${week}.`;
  return `Week ${w.week} (${w.start}) — ${w.phase} — focus: ${w.focus}. This week's tasks: ${w.tasks}${
    w.milestone ? ` Milestone: ${w.milestone}.` : ""
  }`;
}

export async function answerQuestion(q: Question, progress: Progress): Promise<string> {
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
