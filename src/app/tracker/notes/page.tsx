"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Container from "@/app/_components/container";
import { MarkdownView } from "@/app/_components/notes-editor";
import { PLAN, phaseStyle, type Progress, type PlanWeek } from "@/lib/tracker/plan";
import { generatePlan, type OnboardingConfig } from "@/lib/tracker/tracks";

type ChatMsg = { role: "user" | "assistant"; content: string };

function StudyWithCoach({ hasNotes }: { hasNotes: boolean }) {
  const [thread, setThread] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [thread, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next = [...thread, { role: "user" as const, content: trimmed }];
    setThread(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/coach/notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setThread((t) => [...t, { role: "assistant", content: data.reply ?? "(no reply)" }]);
    } catch {
      setThread((t) => [...t, { role: "assistant", content: "Something went wrong reaching the coach. Try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-brand-blue/30 bg-brand-blue/5 p-4 dark:border-brand-blue/40 dark:bg-brand-blue/10">
      <div className="flex items-center gap-2">
        <span className="text-lg">🎓</span>
        <h2 className="text-lg font-bold">Study with your coach</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Your coach reads every note you&apos;ve saved. Ask it to summarise or quiz you.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => send("Summarise my notes — pull out the key themes, techniques, and quotes across weeks.")}
          disabled={!hasNotes || busy}
          className="rounded-full bg-brand-blue px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          Summarise my notes
        </button>
        <button
          onClick={() => send("Quiz me on what I saved. Ask focused questions one at a time and wait for my answers.")}
          disabled={!hasNotes || busy}
          className="rounded-full border border-brand-blue px-3 py-1.5 text-sm font-medium text-brand-blue transition hover:bg-brand-blue/10 disabled:opacity-40"
        >
          Quiz me
        </button>
      </div>

      {thread.length > 0 && (
        <div className="mt-4 space-y-3">
          {thread.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-blue px-3 py-2 text-sm text-white"
                  : "mr-auto max-w-[95%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
              }
            >
              {m.role === "user" ? m.content : <MarkdownView text={m.content} />}
            </div>
          ))}
          {busy && (
            <div className="mr-auto rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800">
              Thinking…
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!hasNotes || busy}
          placeholder={hasNotes ? "Ask about your notes…" : "Save some notes first…"}
          className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-blue disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={!hasNotes || busy || !input.trim()}
          className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function NotesPage() {
  const [progress, setProgress] = useState<Progress>({});
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [q, setQ] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/progress").then((r) => r.json()),
      fetch("/api/config").then((r) => r.json()),
    ])
      .then(([p, c]) => {
        if (!active) return;
        setProgress(p.progress ?? {});
        setConfig(c.config ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const plan: PlanWeek[] = useMemo(() => (config ? generatePlan(config) : PLAN), [config]);

  const allNotes = useMemo(
    () =>
      plan
        .map((w) => ({ w, note: (progress[w.week]?.notes ?? "").trim() }))
        .filter((x) => x.note.length > 0),
    [plan, progress]
  );

  const notes = useMemo(() => {
    const query = q.trim().toLowerCase();
    return query ? allNotes.filter((x) => x.note.toLowerCase().includes(query)) : allNotes;
  }, [allNotes, q]);

  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between pt-12">
            <Link href="/tracker" className="text-sm font-medium text-brand-blue hover:underline">
              ← Back to tracker
            </Link>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Notes</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Every note you&apos;ve captured, in one searchable place — quotes, techniques, and approaches.
          </p>

          <StudyWithCoach hasNotes={allNotes.length > 0} />

          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="🔎 Search notes…"
            className="mt-8 w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="mt-8 space-y-4">
            {notes.map(({ w, note }) => {
              const ps = phaseStyle(w.phase);
              return (
                <Link
                  key={w.week}
                  href="/tracker"
                  className={`block rounded-xl border border-l-4 ${ps.bar} border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60`}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      Week {w.week}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ps.chip}`}>{w.focus}</span>
                    <span className="text-xs text-slate-400">{w.start}</span>
                  </div>
                  <MarkdownView text={note} />
                </Link>
              );
            })}

            {loaded && notes.length === 0 && (
              <p className="py-12 text-center text-slate-400">
                {q.trim()
                  ? "No notes match your search."
                  : "No notes yet — add some from the tracker as you study."}
              </p>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
