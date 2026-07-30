// 28-week AI Engineer learning plan.
// Static curriculum data — progress is stored separately (see /api/progress).

export type WeekStatus = "not-started" | "in-progress" | "done" | "skipped";

export interface PlanWeek {
  week: number;
  start: string; // human-readable week-start (Monday)
  phase: string;
  focus: string;
  tasks: string;
  milestone?: string;
  targetHrs: number;
}

export interface WeekProgress {
  status: WeekStatus;
  actualHrs?: number;
  notes?: string;
}

// Keyed by week number (as string).
export type Progress = Record<string, WeekProgress>;

export const STATUS_LABELS: Record<WeekStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  done: "Done",
  skipped: "Skipped",
};

// Tailwind classes per phase for the left accent + chip.
export const PHASE_STYLES: { match: string; bar: string; chip: string }[] = [
  { match: "Setup", bar: "border-l-sky-400", chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  { match: "Quick", bar: "border-l-sky-400", chip: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  { match: "Phase 0", bar: "border-l-slate-400", chip: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { match: "Phase 1", bar: "border-l-emerald-400", chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  { match: "Phase 2", bar: "border-l-orange-400", chip: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  { match: "Phase 3", bar: "border-l-violet-400", chip: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  { match: "Phase 4", bar: "border-l-cyan-400", chip: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
  { match: "Phase 5", bar: "border-l-pink-400", chip: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
];

export function phaseStyle(phase: string) {
  return (
    PHASE_STYLES.find((p) => phase.startsWith(p.match)) ?? {
      bar: "border-l-brand-blue",
      chip: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    }
  );
}

export const PLAN: PlanWeek[] = [
  { week: 1, start: "Mon 3 Aug 2026", phase: "Setup & quick win", focus: "Get set up + first efficiency win", tasks: "Install Python/uv, VS Code, Git. Create OpenAI + Anthropic API keys (set a $20–50 spend cap). Start a GitHub repo. Anthropic Academy: Claude Code 101.", milestone: "Dev environment ready; keys working; repo created", targetHrs: 10 },
  { week: 2, start: "Mon 10 Aug 2026", phase: "Quick wins", focus: "Power-user efficiency", tasks: "Anthropic Academy: Intro to Agent Skills + Intro to Subagents. Start using Claude Code on a real work task.", milestone: "Claude Code in your daily workflow", targetHrs: 10 },
  { week: 3, start: "Mon 17 Aug 2026", phase: "Phase 0: Python (skip if fluent)", focus: "Python fluency", tasks: "Python essentials for AI: syntax, venv, type hints, requests, async. If already fluent, skip to Week 4 and bank the time.", milestone: "Comfortable writing Python", targetHrs: 10 },
  { week: 4, start: "Mon 24 Aug 2026", phase: "Phase 1: LLM fundamentals", focus: "Curriculum spine begins", tasks: "Enrol DeepLearning.AI 'AI Engineer Specialization' — Course 1. DeepLearning.AI 'Prompt Engineering for Developers' (free).", milestone: "Specialization Course 1 underway", targetHrs: 10 },
  { week: 5, start: "Mon 31 Aug 2026", phase: "Phase 1: LLM fundamentals", focus: "Talking to models", tasks: "Specialization cont. Tokens, context windows, temperature, cost control. First API calls in Python.", milestone: "First working API script", targetHrs: 10 },
  { week: 6, start: "Mon 7 Sep 2026", phase: "Phase 1: LLM fundamentals", focus: "Prompt & context engineering", tasks: "Anthropic Academy: 'Building with the Claude API'. Structured outputs & basic tool calling.", targetHrs: 10 },
  { week: 7, start: "Mon 14 Sep 2026", phase: "Phase 1: LLM fundamentals", focus: "First build", tasks: "Build a chatbot with conversation memory. Multi-model: try the same task on OpenAI + Anthropic; skim both cookbooks.", milestone: "🎯 Chatbot with memory (on GitHub)", targetHrs: 10 },
  { week: 8, start: "Mon 21 Sep 2026", phase: "Phase 1: LLM fundamentals", focus: "Consolidate", tasks: "Build an article/document summariser. Tidy repo + README. Buffer for any spillover.", milestone: "🎯 Summariser (on GitHub)", targetHrs: 10 },
  { week: 9, start: "Mon 28 Sep 2026", phase: "Phase 2: RAG", focus: "Retrieval foundations", tasks: "Specialization RAG module. Embeddings & semantic search concepts.", targetHrs: 10 },
  { week: 10, start: "Mon 5 Oct 2026", phase: "Phase 2: RAG", focus: "Vector search", tasks: "Vector databases with Chroma (local): load & query embeddings. Start the flagship project.", milestone: "🎯 M1: naïve RAG loop end-to-end", targetHrs: 10 },
  { week: 11, start: "Mon 12 Oct 2026", phase: "Phase 2: RAG", focus: "Real ingestion", tasks: "Multi-format ingestion (PDF/.md/.txt). Chunking with overlap. Store source metadata.", milestone: "🎯 M2: real document ingestion", targetHrs: 10 },
  { week: 12, start: "Mon 19 Oct 2026", phase: "Phase 2: RAG", focus: "Grounding", tasks: "Citations back to source passages. Add an 'I don't know' path when retrieval is weak.", milestone: "🎯 M3: citations & grounding", targetHrs: 10 },
  { week: 13, start: "Mon 26 Oct 2026", phase: "Phase 2: RAG", focus: "Interface", tasks: "Streamlit UI: upload + chat + streaming responses + visible sources.", milestone: "🎯 M4: working UI / demo", targetHrs: 10 },
  { week: 14, start: "Mon 2 Nov 2026", phase: "Phase 2: RAG", focus: "Buffer & polish", tasks: "Polish 'Chat With Your Documents' to a shareable demo. Record a short demo GIF.", milestone: "Flagship project demo-ready", targetHrs: 10 },
  { week: 15, start: "Mon 9 Nov 2026", phase: "Phase 3: Agents", focus: "Tool use", tasks: "Specialization agents module. Function calling / tool-use patterns.", targetHrs: 10 },
  { week: 16, start: "Mon 16 Nov 2026", phase: "Phase 3: Agents", focus: "Agentic patterns", tasks: "ReAct, Plan-and-Execute, Reflection. Short- and long-term memory.", targetHrs: 10 },
  { week: 17, start: "Mon 23 Nov 2026", phase: "Phase 3: Agents", focus: "MCP", tasks: "Anthropic Academy: 'Introduction to Model Context Protocol'.", milestone: "First MCP server/client", targetHrs: 10 },
  { week: 18, start: "Mon 30 Nov 2026", phase: "Phase 3: Agents", focus: "MCP advanced", tasks: "Anthropic Academy: 'MCP: Advanced Topics'.", targetHrs: 10 },
  { week: 19, start: "Mon 7 Dec 2026", phase: "Phase 3: Agents", focus: "Agent build", tasks: "Build a research or data-analysis agent that uses tools.", milestone: "🎯 Agent project (on GitHub)", targetHrs: 10 },
  { week: 20, start: "Mon 14 Dec 2026", phase: "Phase 3: Agents", focus: "Buffer & polish", tasks: "Harden the agent. README + demo. Buffer.", milestone: "Agent project demo-ready", targetHrs: 10 },
  { week: 21, start: "Mon 21 Dec 2026", phase: "Phase 4: Production", focus: "Evaluation (the money skill)", tasks: "Build an eval set (Q→expected) for the RAG app. Measure retrieval hit-rate + answer quality.", milestone: "🎯 M5: eval suite + baseline numbers", targetHrs: 10 },
  { week: 22, start: "Mon 28 Dec 2026", phase: "Phase 4: Production", focus: "Observability", tasks: "LangSmith logging/tracing. Instrument your projects.", targetHrs: 10 },
  { week: 23, start: "Mon 4 Jan 2027", phase: "Phase 4: Production", focus: "Reliability", tasks: "Prompt versioning, caching, rate-limiting. Prompt-injection & data-leakage guards.", targetHrs: 10 },
  { week: 24, start: "Mon 11 Jan 2027", phase: "Phase 4: Production", focus: "Deploy", tasks: "Dockerise + deploy the flagship to a public URL (Railway/Render/Fly).", milestone: "🎯 M6: deployed, live URL", targetHrs: 10 },
  { week: 25, start: "Mon 18 Jan 2027", phase: "Phase 4: Production", focus: "Tune & prove", tasks: "Cost/latency tuning. Run the before/after eval and record the improvement numbers.", milestone: "Documented eval improvement", targetHrs: 10 },
  { week: 26, start: "Mon 25 Jan 2027", phase: "Phase 5: Launch", focus: "Portfolio polish", tasks: "Finalise 3 GitHub projects: READMEs, architecture diagrams, eval results, limitations.", milestone: "3 portfolio projects live", targetHrs: 10 },
  { week: 27, start: "Mon 1 Feb 2027", phase: "Phase 5: Launch", focus: "Visibility", tasks: "Write 1–2 short posts (blog/LinkedIn) on what you built and learned.", milestone: "1–2 posts published", targetHrs: 10 },
  { week: 28, start: "Mon 8 Feb 2027", phase: "Phase 5: Launch", focus: "Go to market", tasks: "Update CV/LinkedIn 'SWE → AI Engineer'. Volunteer for AI work at your current job. Start applying.", milestone: "Applications out", targetHrs: 10 },
];
