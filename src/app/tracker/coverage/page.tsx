"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Container from "@/app/_components/container";
import StudyBreadcrumb from "@/app/_components/study-breadcrumb";

// Concept coverage checklist — the "map" that turns unknown-unknowns into
// known-unknowns. Gated under /tracker. Ticks persist server-side via
// /api/coverage, so they sync across every device and session.

type Group = { area: string; phase: string; items: string[] };
type Coverage = Record<string, boolean>;
type SaveState = "idle" | "saving" | "saved" | "error";

const GROUPS: Group[] = [
  {
    area: "Foundations",
    phase: "Wks 4–8",
    items: [
      "What a foundation model is (and isn't)",
      "Tokens & tokenization",
      "Embeddings & vector representations",
      "Transformer architecture & attention",
      "Context windows & their limits",
      "Temperature, sampling & decoding",
      "Pricing & reasoning about cost",
      "Model families & choosing between them",
      "Capabilities, limits & hallucination",
    ],
  },
  {
    area: "Prompting & context engineering",
    phase: "Wks 5–6",
    items: [
      "Prompt patterns & system prompts",
      "Few-shot & examples",
      "Structured outputs (JSON / schemas)",
      "Tool / function calling",
      "Context management & compression",
      "Prompt caching",
    ],
  },
  {
    area: "RAG",
    phase: "Wks 9–14",
    items: [
      "Chunking strategies & metadata",
      "Vector databases (Chroma / pgvector …)",
      "Semantic vs keyword vs hybrid retrieval",
      "Re-ranking",
      "Citations, grounding & 'I don't know' paths",
      "Retrieval evaluation",
      "Agentic / multi-document RAG",
    ],
  },
  {
    area: "Agents & MCP",
    phase: "Wks 15–20",
    items: [
      "Agentic loops (ReAct, plan-execute, reflection)",
      "Tool use & the perceive–reason–act loop",
      "Short- & long-term agent memory",
      "MCP: hosts, clients, servers",
      "MCP: tools, resources, prompts & transport",
      "Multi-agent orchestration",
      "Agent frameworks (Claude Agent SDK, LangGraph)",
    ],
  },
  {
    area: "Evaluation & observability",
    phase: "Wks 23–24",
    items: [
      "Eval sets & metrics (hit-rate, answer quality)",
      "LLM-as-judge",
      "Automated evaluation frameworks",
      "Tracing & observability (LangSmith / W&B)",
      "Regression testing in CI",
    ],
  },
  {
    area: "Fine-tuning & adaptation",
    phase: "awareness",
    items: [
      "When to fine-tune vs RAG vs prompt",
      "LoRA / PEFT",
      "Instruction tuning; RLHF / DPO (concept)",
    ],
  },
  {
    area: "Production, MLOps & cloud",
    phase: "Wks 25–27",
    items: [
      "Containerisation (Docker)",
      "Cloud deploy (AWS Bedrock / Azure / Vertex)",
      "CI/CD for ML",
      "Caching, rate-limiting, cost & latency tuning",
      "Prompt / model versioning & rollback",
      "Monitoring, reliability & fallbacks",
      "Security, prompt-injection defence & data privacy",
    ],
  },
  {
    area: "AI systems design",
    phase: "Wks 28–30",
    items: [
      "Reference architectures (RAG, agentic)",
      "Quality / latency / cost tradeoffs",
      "Vector-DB selection & hybrid search at scale",
      "Multi-tenancy & scaling patterns",
      "System-design interview practice",
    ],
  },
  {
    area: "Safety & governance",
    phase: "awareness",
    items: [
      "Guardrails & content moderation",
      "Jailbreaks & prompt-injection defence",
      "Responsible AI, bias, EU AI Act / GDPR basics",
    ],
  },
];

const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);
const id = (gi: number, ii: number) => `${gi}-${ii}`;

const ROADMAPS = [
  { label: "roadmap.sh — AI Engineer", href: "https://roadmap.sh/ai-engineer" },
  { label: "ai-engineer-roadmap (GitHub)", href: "https://github.com/musamaanjum/ai-engineer-roadmap" },
];

const SAVE_LABEL: Record<SaveState, string> = {
  idle: "",
  saving: "Saving…",
  saved: "Saved ✓",
  error: "Save failed — retry",
};

export default function CoveragePage() {
  const [done, setDone] = useState<Coverage>({});
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/coverage")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setDone(d.coverage ?? {});
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback((next: Coverage) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/coverage", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ coverage: next }),
        });
        setSaveState(res.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    }, 500);
  }, []);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) delete next[key];
      save(next);
      return next;
    });
  }

  function reset() {
    setDone({});
    save({});
  }

  const count = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const pct = Math.round((count / TOTAL) * 100);

  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <StudyBreadcrumb title="Concept coverage checklist" />

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Concept coverage checklist</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            The map, so your build-first path never hides an <em>unknown-unknown</em>. Skim it once now — that alone
            turns unknowns into known-unknowns — then revisit at each phase boundary. Anything still unticked that your
            builds haven&apos;t forced you to learn is a gap to schedule deliberately. Each row shows the phase where the
            plan covers it.
          </p>

          {/* roadmap links */}
          <div className="mt-6 flex flex-wrap gap-2">
            {ROADMAPS.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-brand-blue/40 bg-brand-blue/5 px-3 py-1.5 text-sm font-medium text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-blue/50"
              >
                🗺 {r.label} ↗
              </a>
            ))}
          </div>

          {/* progress */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                {count} / {TOTAL} concepts marked understood
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">{SAVE_LABEL[saveState]}</span>
                <button onClick={reset} className="text-xs text-slate-400 transition hover:text-brand-blue">
                  Reset
                </button>
              </div>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* groups */}
          <div className="mt-8 space-y-6" aria-busy={!loaded}>
            {GROUPS.map((g, gi) => (
              <section key={g.area}>
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-lg font-bold tracking-tight">{g.area}</h2>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {g.phase}
                  </span>
                </div>
                <ul className="space-y-1">
                  {g.items.map((item, ii) => {
                    const key = id(gi, ii);
                    const checked = !!done[key];
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(key)}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-blue"
                          />
                          <span
                            className={
                              checked
                                ? "text-sm text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600"
                                : "text-sm text-slate-700 dark:text-slate-200"
                            }
                          >
                            {item}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            <strong className="text-slate-800 dark:text-slate-100">How to use it against unknown-unknowns:</strong> at
            each phase boundary, open this, tick what you now genuinely understand, and skim the two roadmaps above for
            anything not listed here. Then ask your coach: &ldquo;here&apos;s what I&apos;ve built and ticked — what
            important concepts am I likely still missing?&rdquo; That sweep is what keeps blind spots from staying blind.
          </p>

          <p className="mt-6 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-700">
            Ticks sync across all your devices. A coverage map, not a syllabus — you learn each item by building; this
            just guarantees nothing stays hidden.
          </p>
        </div>
      </Container>
    </main>
  );
}
