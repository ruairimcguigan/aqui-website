"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/_components/container";
import Link from "next/link";
import {
  PLAN,
  STATUS_LABELS,
  WEEK_RESOURCES,
  phaseStyle,
  splitActions,
  type Progress,
  type Question,
  type WeekProgress,
  type WeekStatus,
} from "@/lib/tracker/plan";
import { generatePlan, getTrack, estimateMonths, type OnboardingConfig } from "@/lib/tracker/tracks";
import { NotesEditor } from "@/app/_components/notes-editor";
import { AttachmentsEditor } from "@/app/_components/attachments-editor";

const STATUSES: WeekStatus[] = ["not-started", "in-progress", "done", "skipped"];

// Base URL for the companion GitHub repo's per-week folders (weeks/week-NN).
const REPO_WEEK_BASE = "https://github.com/ruairimcguigan/ai-engineering/tree/main/weeks";

type SaveState = "idle" | "saving" | "saved" | "error";
type UIQuestion = Question & { pending?: boolean };

// One collapsible question + answer.
function QAItem({ q, onDelete }: { q: UIQuestion; onDelete: (id: string) => void }) {
  const answered = q.status === "answered" && !!q.answer;
  const [open, setOpen] = useState(!answered); // answered ones start collapsed
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50">
      <div className="flex items-start gap-2 p-3 text-sm">
        <button
          onClick={() => answered && setOpen((o) => !o)}
          className={`flex flex-1 items-start gap-2 text-left ${answered ? "cursor-pointer" : "cursor-default"}`}
        >
          <span className="mt-0.5">❓</span>
          <span className="flex-1 font-medium text-slate-800 dark:text-slate-200">{q.text}</span>
        </button>
        {answered ? (
          <span
            className="mt-0.5 shrink-0 text-slate-400 transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "none" }}
          >
            ▶
          </span>
        ) : q.pending ? (
          <span className="mt-0.5 shrink-0 text-xs italic text-brand-blue">Answering…</span>
        ) : (
          <span className="mt-0.5 shrink-0 text-xs italic text-slate-400">Awaiting</span>
        )}
        <button
          onClick={() => onDelete(q.id)}
          title="Delete question"
          aria-label="Delete question"
          className="mt-0.5 shrink-0 text-slate-300 transition hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
        >
          ✕
        </button>
      </div>
      {answered && open && (
        <p className="whitespace-pre-wrap px-3 pb-3 pl-9 text-sm text-slate-600 dark:text-slate-300">{q.answer}</p>
      )}
    </div>
  );
}

export default function TrackerPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress>({});
  const [questions, setQuestions] = useState<UIQuestion[]>([]);
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [noteQuery, setNoteQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [storeWarning, setStoreWarning] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/questions").then((r) => r.json()),
      fetch("/api/config").then((r) => r.json()),
    ])
      .then(([pData, qData, cData]) => {
        if (!active) return;
        setProgress(pData.progress ?? {});
        setQuestions(Array.isArray(qData.questions) ? qData.questions : []);
        setConfig(cData.config ?? null);
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

  const toggleAction = useCallback(
    (week: number, idx: number) => {
      setProgress((prev) => {
        const cur = prev[week] ?? { status: "not-started" as WeekStatus };
        const set = new Set(cur.actionsDone ?? []);
        if (set.has(idx)) set.delete(idx);
        else set.add(idx);
        const next: Progress = {
          ...prev,
          [week]: { ...cur, actionsDone: Array.from(set).sort((a, b) => a - b) },
        };
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (!id.startsWith("temp-")) {
      fetch("/api/questions?id=" + encodeURIComponent(id), { method: "DELETE" }).catch(() => {});
    }
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

  const activePlan = useMemo(() => (config ? generatePlan(config) : PLAN), [config]);

  const stats = useMemo(() => {
    const total = activePlan.length;
    let done = 0;
    let hours = 0;
    for (const w of activePlan) {
      const p = progress[w.week];
      if (p?.status === "done") done += 1;
      if (typeof p?.actualHrs === "number") hours += p.actualHrs;
    }
    return { total, done, hours, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [progress, activePlan]);

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
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">
                {config ? getTrack(config.track).name : "AI Engineer"} Tracker
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {config
                  ? `${activePlan.length} weeks · ~${config.hours} hrs/week · starts ${
                      activePlan[0]?.start ?? ""
                    } → job-ready in ~${estimateMonths(config)} months`
                  : "33 weeks · ~10 hrs/week · start Fri 31 Jul 2026 → job-ready ~Mar 2027"}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-brand-blue">
                <Link href="/tracker/plan" className="hover:underline">
                  Read the full plan →
                </Link>
                <Link href="/tracker/notes" className="hover:underline">
                  Notes →
                </Link>
                <Link href="/tracker/onboarding" className="hover:underline">
                  {config ? "Change track / adjust plan →" : "Personalize your roadmap →"}
                </Link>
              </div>
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
            <input
              type="text"
              value={noteQuery}
              onChange={(e) => setNoteQuery(e.target.value)}
              placeholder="🔎 Search your notes…"
              className="mt-3 w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-brand-blue dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="mt-8 space-y-3">
            {activePlan
              .filter((w) => {
                const q = noteQuery.trim().toLowerCase();
                if (!q) return true;
                return (progress[w.week]?.notes ?? "").toLowerCase().includes(q);
              })
              .map((w) => {
              const p = progress[w.week] ?? { status: "not-started" as WeekStatus };
              const ps = phaseStyle(w.phase);
              const isDone = p.status === "done";
              const showPhase = w.phase !== lastPhase;
              lastPhase = w.phase;
              const weekQuestions = questionsByWeek.get(w.week) ?? [];

              return (
                <div key={w.week} id={`week-${w.week}`} className="scroll-mt-6">
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
                      <a
                        href={`${REPO_WEEK_BASE}/week-${String(w.week).padStart(2, "0")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition hover:text-brand-blue"
                        title={`Week ${w.week} notes & files on GitHub`}
                      >
                        GitHub ↗
                      </a>
                    </div>

                    {(() => {
                      const actions = splitActions(w.tasks);
                      const doneSet = new Set(p.actionsDone ?? []);
                      return (
                        <>
                          <ul className="mt-2 space-y-1.5">
                            {actions.map((a, i) => {
                              const done = doneSet.has(i);
                              return (
                                <li
                                  key={i}
                                  onClick={() => toggleAction(w.week, i)}
                                  className="flex cursor-pointer items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                                >
                                  <span
                                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border text-[10px] font-bold ${
                                      done
                                        ? "border-brand-blue bg-brand-blue text-white"
                                        : "border-slate-300 dark:border-slate-600"
                                    }`}
                                  >
                                    {done ? "✓" : ""}
                                  </span>
                                  <span className={done ? "line-through decoration-slate-400" : ""}>{a}</span>
                                </li>
                              );
                            })}
                          </ul>
                          <p className="mt-1.5 text-xs text-slate-400">
                            {doneSet.size}/{actions.length} actions done
                          </p>
                        </>
                      );
                    })()}

                    {w.milestone && <p className="mt-2 text-sm font-medium text-brand-blue">{w.milestone}</p>}

                    {(WEEK_RESOURCES[w.week] ?? []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {WEEK_RESOURCES[w.week].map((r) => (
                          <Link
                            key={r.href}
                            href={r.href}
                            className="inline-flex items-center gap-1.5 rounded-md border border-brand-blue/40 bg-brand-blue/5 px-2.5 py-1 text-xs font-medium text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-blue/50"
                          >
                            <span aria-hidden>📄</span>
                            {r.label}
                          </Link>
                        ))}
                      </div>
                    )}

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

                    </div>

                    <NotesEditor value={p.notes ?? ""} onChange={(v) => patchWeek(w.week, { notes: v })} />

                    <AttachmentsEditor
                      value={p.attachments ?? []}
                      onChange={(next) => patchWeek(w.week, { attachments: next })}
                    />

                    {weekQuestions.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                        {weekQuestions.map((q) => (
                          <QAItem key={q.id} q={q} onDelete={deleteQuestion} />
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
