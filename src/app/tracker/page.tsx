"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/_components/container";
import {
  PLAN,
  STATUS_LABELS,
  phaseStyle,
  type Progress,
  type Question,
  type WeekProgress,
  type WeekStatus,
} from "@/lib/tracker/plan";

const STATUSES: WeekStatus[] = ["not-started", "in-progress", "done", "skipped"];

type SaveState = "idle" | "saving" | "saved" | "error";
type UIQuestion = Question & { pending?: boolean };

// One collapsible question + answer.
function QAItem({ q }: { q: UIQuestion }) {
  const answered = q.status === "answered" && !!q.answer;
  const [open, setOpen] = useState(!answered); // answered ones start collapsed
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50">
      <button
        onClick={() => answered && setOpen((o) => !o)}
        className={`flex w-full items-start gap-2 p-3 text-left text-sm ${answered ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="mt-0.5">❓</span>
        <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">{q.text}</span>
        {answered ? (
          <span className="mt-0.5 shrink-0 text-slate-400 transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }}>
            ▶
          </span>
        ) : q.pending ? (
          <span className="mt-0.5 shrink-0 text-xs italic text-brand-blue">Answering…</span>
        ) : (
          <span className="mt-0.5 shrink-0 text-xs italic text-slate-400">Awaiting</span>
        )}
      </button>
      {answered && open && (
        <p className="whitespace-pre-wrap px-3 pb-3 pl-9 text-sm text-slate-600 dark:text-slate-300">
          {q.answer}
        </p>
      )}
    </div>
  );
}

export default function TrackerPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>({});
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [storeWarning, setStoreWarning] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/questions").then((r) => r.json()),
    ])
      .then(([pData, qData]) => {
        if (!active) return;
        setProgress(pData.progress ?? {});
        setQuestions(Array.isArray(qData.questions) ? qData.questions : []);
        if (pData.warning === "store-unavailable") setStoreWarning(true);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const scheduleSave = useCallback((next: Progress) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/progress", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ progress: next }),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    }, 600);
  }, []);

  const patchWeek = useCallback(
    (week: number, patch: Partial<WeekProgress>) => {
      setProgress((prev) => {
        const current = prev[week] ?? { status: "not-started" as WeekStatus };
        const next: Progress = { ...prev, [week]: { ...current, ...patch } };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  // Optimistic ask: show the question immediately (answering), then swap in the
  // real answer when the server responds — answered on submit, usually seconds.
  const askQuestion = useCallback((week: number, text: string) => {
    const tempId = "temp-" + Date.now() + "-" + Math.random().toString(36).slice(2);
    const optimistic: UIQuestion = { id: tempId, week, text, status: "open", createdAt: Date.now(), pending: true };
    setQuestions((prev) => [optimistic, ...prev]);
    (async () => {
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ week, text }),
        });
        const data = await res.json();
        if (res.ok && data.question) {
          setQuestions((prev) => prev.map((q) => (q.id === tempId ? data.question : q)));
        } else {
          setQuestions((prev) => prev.map((q) => (q.id === tempId ? { ...q, pending: false } : q)));
        }
      } catch {
        setQuestions((prev) => prev.map((q) => (q.id === tempId ? { ...q, pending: false } : q)));
      }
    })();
  }, []);

  const questionsByWeek = useMemo(() => {
    const map = new Map<number, UIQuestion[]>();
    for (const q of questions) {
      const arr = map.get(q.week) ?? [];
      arr.push(q);
      map.set(q.week, arr);
    }
    return map;
  }, [questions]);

  const stats = useMemo(() => {
    const total = PLAN.length;
    let done = 0;
    let hours = 0;
    for (const w of PLAN) {
      const p = progress[w.week];
      if (p?.status === "done") done += 1;
      if (typeof p?.actualHrs === "number") hours += p.actualHrs;
    }
    return { total, done, hours, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [progress]);

  async function logout() {
    await fetch("/api/login", { method: "DELETE" }).catch(() => {});
    router.push("/tracker/login");
    router.refresh();
  }

  let lastPhase = "";

  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between pt-12">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">AI Engineer Tracker</h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                31 weeks · ~10 hrs/week · start Fri 31 Jul 2026 → job-ready ~Feb 2027
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-2 shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Log out
            </button>
          </div>

          <div className="sticky top-3 z-10 mt-8 rounded-xl border border-slate-200 bg-white/90 p-5 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stats.pct}% complete</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {stats.done} / {stats.total} weeks · {stats.hours} hrs logged
                {saveState === "saving" && " · saving…"}
                {saveState === "saved" && " · saved ✓"}
                {saveState === "error" && " · save failed"}
              </span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full rounded-full bg-brand-blue transition-all duration-500" style={{ width: `${stats.pct}%` }} />
            </div>
            {storeWarning && (
              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                Storage isn&apos;t connected yet — changes won&apos;t be saved.
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            {PLAN.map((w) => {
              const p = progress[w.week] ?? { status: "not-started" as WeekStatus };
              const ps = phaseStyle(w.phase);
              const isDone = p.status === "done";
              const showPhase = w.phase !== lastPhase;
              lastPhase = w.phase;
              const weekQuestions = questionsByWeek.get(w.week) ?? [];

              return (
                <div key={w.week}>
                  {showPhase && (
                    <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {w.phase}
                    </h2>
                  )}
                  <div
                    className={`rounded-xl border border-l-4 ${ps.bar} border-slate-200 bg-white p-4 transition dark:border-slate-700 dark:bg-slate-800/60 ${
                      isDone ? "opacity-70" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                        Week {w.week}
                      </span>
                      <span className="text-xs text-slate-400">{w.start}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ps.chip}`}>{w.focus}</span>
                    </div>

                    <p className={`mt-2 text-slate-700 dark:text-slate-300 ${isDone ? "line-through decoration-slate-400" : ""}`}>
                      {w.tasks}
                    </p>

                    {w.milestone && <p className="mt-1 text-sm font-medium text-brand-blue">{w.milestone}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <select
                        value={p.status}
                        onChange={(e) => patchWeek(w.week, { status: e.target.value as WeekStatus })}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>

                      <label className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        Hrs
                        <input
                          type="number"
                          min={0}
                          step={0.5}
                          value={p.actualHrs ?? ""}
                          onChange={(e) =>
                            patchWeek(w.week, { actualHrs: e.target.value === "" ? undefined : Number(e.target.value) })
                          }
                          className="w-16 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                          placeholder={String(w.targetHrs)}
                        />
                      </label>

                      <input
                        type="text"
                        value={p.notes ?? ""}
                        onChange={(e) => patchWeek(w.week, { notes: e.target.value })}
                        placeholder="Notes…"
                        className="min-w-[8rem] flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      />
                    </div>

                    {weekQuestions.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                        {weekQuestions.map((q) => (
                          <QAItem key={q.id} q={q} />
                        ))}
                      </div>
                    )}

                    <AskBox week={w.week} onAsk={askQuestion} />
                  </div>
                </div>
              );
            })}
          </div>

          {!loaded && <p className="mt-8 text-center text-slate-400">Loading your progress…</p>}
        </div>
      </Container>
    </main>
  );
}

function AskBox({ week, onAsk }: { week: number; onAsk: (week: number, text: string) => void }) {
  const [text, setText] = useState("");
  function submit() {
    const t = text.trim();
    if (!t) return;
    onAsk(week, t);
    setText("");
  }
  return (
    <div className="mt-2 flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="❓ Ask a question or flag an issue about this week…"
        className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
      />
      <button
        onClick={submit}
        disabled={!text.trim()}
        className="shrink-0 rounded-md bg-brand-blue px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        Ask
      </button>
    </div>
  );
}
