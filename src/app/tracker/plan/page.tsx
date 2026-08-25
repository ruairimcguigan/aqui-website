"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/app/_components/container";
import { PLAN, WEEK_RESOURCES, phaseStyle, type PlanWeek } from "@/lib/tracker/plan";
import { generatePlan, getTrack, estimateMonths, type OnboardingConfig } from "@/lib/tracker/tracks";

export default function FullPlanPage() {
  const [config, setConfig] = useState<OnboardingConfig | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        if (active) setConfig(d.config ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const plan: PlanWeek[] = useMemo(() => (config ? generatePlan(config) : PLAN), [config]);
  const trackName = config ? getTrack(config.track).name : "AI / ML Engineering";
  const months = config ? estimateMonths(config) : 8;

  let lastPhase = "";

  return (
    <main className="pb-24">
      <Container>
        <article className="prose-tracker mx-auto max-w-3xl">
          <div className="flex items-center justify-between pt-12">
            <Link href="/tracker" className="text-sm font-medium text-brand-blue hover:underline">
              ← Back to tracker
            </Link>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">The full plan</h1>
          <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
            {trackName} · {plan.length} weeks · ~{config?.hours ?? 10} hrs/week · job-ready in ~{months} months.
            Your complete step-by-step roadmap, in full.
          </p>

          {/* Strategy */}
          <section className="mt-10 space-y-4 text-slate-700 dark:text-slate-300">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">The goal</h2>
            <p>
              Pivot from experienced software/mobile engineer into AI engineering over {plan.length} weeks at
              ~10 hrs/week, remote-first. The strategy is to overlay AI onto your senior engineering career rather
              than reset — the durable, augment-resistant skills AI can&apos;t easily automate. Target roles include
              AI Engineer and the fast-emerging &ldquo;Claude Code specialist&rdquo; niche.
            </p>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              The two curriculum spines
            </h2>
            <p>
              <strong>Front half (Weeks 4–14):</strong> the DeepLearning.AI &ldquo;AI Engineer Specialization&rdquo;
              for LLM fundamentals and RAG, supplemented by free Anthropic Academy courses.
            </p>
            <p>
              <strong>Back half (Weeks 15–24):</strong> the Udacity &ldquo;AI Engineering with Claude&rdquo;
              Nanodegree — Claude Agent SDK, MCP, evaluation/observability, and guardrails. ~38 hours across four
              mentor-reviewed, project-based courses. Best value: subscribe (~£80–94/mo, often on sale) around Week 15
              and blitz it; its four projects double as your portfolio.
            </p>

            <h2 className="pt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Flagship projects (your portfolio)
            </h2>
            <p>
              Your own <strong>&ldquo;Chat With Your Documents&rdquo; RAG app</strong>, built in milestones M1–M6
              (naïve loop → real ingestion → citations → UI → evaluation → deployed URL). Plus the Nanodegree
              projects: the <strong>claims-intake agent</strong>, <strong>PriceScout</strong> agentic analyst, the
              <strong> Multi-Surface Monorepo</strong> Claude Code config, the <strong>Evaluation &amp; Observability</strong>{" "}
              systems, and — the standout for Claude-Code-specialist roles — the{" "}
              <strong>enterprise code-review orchestrator</strong>.
            </p>
            <p>
              Evaluation is emphasised throughout as the single most hireable skill. Buffer weeks let a slip absorb
              without derailing the plan.
            </p>
          </section>

          {/* Week by week */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Week by week
            </h2>
            <div className="mt-6 space-y-6">
              {plan.map((w) => {
                const ps = phaseStyle(w.phase);
                const showPhase = w.phase !== lastPhase;
                lastPhase = w.phase;
                return (
                  <div key={w.week}>
                    {showPhase && (
                      <h3 className="mb-3 mt-8 border-b border-slate-200 pb-1 text-sm font-bold uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
                        {w.phase}
                      </h3>
                    )}
                    <div className={`border-l-4 ${ps.bar} pl-4`}>
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100">Week {w.week}</span>
                        <span className="text-sm text-slate-400">{w.start}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ps.chip}`}>{w.focus}</span>
                      </div>
                      <p className="mt-2 text-slate-700 dark:text-slate-300">{w.tasks}</p>
                      {w.milestone && (
                        <p className="mt-1.5 text-sm font-semibold text-brand-blue">{w.milestone}</p>
                      )}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-14 border-t border-slate-200 pt-6 dark:border-slate-700">
            <Link href="/tracker" className="text-sm font-medium text-brand-blue hover:underline">
              ← Back to tracker
            </Link>
          </div>
        </article>
      </Container>
    </main>
  );
}
