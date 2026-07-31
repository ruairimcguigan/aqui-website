"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/_components/container";
import { TRACKS, estimateMonths, type OnboardingConfig, type TrackId } from "@/lib/tracker/tracks";
import { getTrack } from "@/lib/tracker/tracks";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function OnboardingPage() {
  const router = useRouter();
  const [years, setYears] = useState("10+");
  const [track, setTrack] = useState<TrackId>("ai-engineering");
  const [hours, setHours] = useState(10);
  const [pythonFluent, setPythonFluent] = useState(false);
  const [goal, setGoal] = useState("job");
  const [startISO, setStartISO] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft: OnboardingConfig = { track, years, hours, pythonFluent, goal, startISO, createdAt: 0 };
  const months = useMemo(() => estimateMonths(draft), [track, hours, pythonFluent]); // eslint-disable-line
  const hasPython = !!getTrack(track).pythonWeek;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        router.push("/tracker");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Couldn't save — try again.");
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setSaving(false);
    }
  }

  const label = "block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2";
  const chip = (active: boolean) =>
    `cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${
      active
        ? "border-brand-blue bg-blue-50 text-brand-blue dark:bg-blue-900/30"
        : "border-slate-300 text-slate-600 hover:border-brand-blue dark:border-slate-600 dark:text-slate-300"
    }`;

  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-2xl py-12">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">Build your roadmap</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            A few questions and we&apos;ll tailor a week-by-week plan to you. You can change it anytime.
          </p>

          {/* Experience */}
          <div className="mt-8">
            <span className={label}>How many years have you been engineering?</span>
            <div className="flex flex-wrap gap-2">
              {["0–3", "4–9", "10+"].map((y) => (
                <button key={y} onClick={() => setYears(y)} className={chip(years === y)}>
                  {y} years
                </button>
              ))}
            </div>
          </div>

          {/* Track */}
          <div className="mt-8">
            <span className={label}>Which path do you want to take?</span>
            <div className="grid gap-3">
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrack(t.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    track === t.id
                      ? "border-brand-blue bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 hover:border-brand-blue dark:border-slate-700"
                  }`}
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{t.name}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="mt-8">
            <span className={label}>How many hours a week can you commit?</span>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 5, t: "~5 (light)" },
                { v: 10, t: "~10 (steady)" },
                { v: 18, t: "~15–20 (intensive)" },
              ].map((o) => (
                <button key={o.v} onClick={() => setHours(o.v)} className={chip(hours === o.v)}>
                  {o.t}
                </button>
              ))}
            </div>
          </div>

          {/* Python */}
          {hasPython && (
            <div className="mt-8">
              <span className={label}>Are you already fluent in Python?</span>
              <div className="flex gap-2">
                <button onClick={() => setPythonFluent(true)} className={chip(pythonFluent)}>
                  Yes — skip the Python week
                </button>
                <button onClick={() => setPythonFluent(false)} className={chip(!pythonFluent)}>
                  Not really
                </button>
              </div>
            </div>
          )}

          {/* Goal */}
          <div className="mt-8">
            <span className={label}>What&apos;s your target?</span>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "job", t: "Land a new role" },
                { v: "current", t: "Level up in my current job" },
                { v: "explore", t: "Explore & upskill" },
              ].map((o) => (
                <button key={o.v} onClick={() => setGoal(o.v)} className={chip(goal === o.v)}>
                  {o.t}
                </button>
              ))}
            </div>
          </div>

          {/* Start date */}
          <div className="mt-8">
            <span className={label}>When do you want to start?</span>
            <input
              type="date"
              value={startISO}
              onChange={(e) => setStartISO(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          {/* Summary */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50">
            <b className="text-slate-800 dark:text-slate-100">{getTrack(track).name}</b> · {hours} hrs/week
            {hasPython && pythonFluent ? " · Python skipped" : ""} · job-ready in ~<b>{months} months</b>.
          </div>

          {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="mt-6 flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="rounded-md bg-brand-blue px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & view my roadmap →"}
            </button>
            <button
              onClick={() => router.push("/tracker")}
              className="rounded-md border border-slate-300 px-5 py-3 text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}
