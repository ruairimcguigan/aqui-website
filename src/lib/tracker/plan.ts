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
  actionsDone?: number[]; // indices of completed actions within the week
}

// Split a week's task prose into discrete, checkable actions.
export function splitActions(tasks: string): string[] {
  return tasks
    .split(/\.\s+(?=[A-Z0-9“"'])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (/[.!?]$/.test(s) ? s : s + "."));
}

// Keyed by week number (as string).
export type Progress = Record<string, WeekProgress>;

export type QuestionStatus = "open" | "answered";

// A question/issue raised against a specific week, answered by the polling task.
export interface Question {
  id: string;
  week: number;
  text: string;
  status: QuestionStatus;
  answer?: string;
  createdAt: number;
  answeredAt?: number;
}

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
  { match: "Phase 5", bar: "border-l-amber-400", chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  { match: "Phase 6", bar: "border-l-pink-400", chip: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300" },
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
  {
    week: 1,
    start: "Fri 31 Jul 2026",
    phase: "Setup & quick win",
    focus: "Get set up + first efficiency win",
    tasks:
      "Get your environment production-ready: install Python 3.12+ (via uv or pyenv), VS Code with the Python extension, and Git. Create OpenAI and Anthropic accounts, generate API keys, and set a hard spend cap of $20–50 so experiments can't run away. Spin up a fresh GitHub repo for your AI work. Finish Anthropic Academy's 'Claude Code 101' so you're using the agentic coding tool from day one.",
    milestone: "Dev environment ready; keys working; repo created",
    targetHrs: 10,
  },
  {
    week: 2,
    start: "Fri 7 Aug 2026",
    phase: "Quick wins",
    focus: "Power-user efficiency",
    tasks:
      "Complete Anthropic Academy's 'Introduction to Agent Skills' and 'Introduction to Subagents'. Then apply them for real: pick a genuine task from your current job and drive it end-to-end with Claude Code — let it read the codebase, plan, and make edits. The goal this week is to make Claude Code a daily habit, not a novelty.",
    milestone: "Claude Code in your daily workflow",
    targetHrs: 10,
  },
  {
    week: 3,
    start: "Fri 14 Aug 2026",
    phase: "Phase 0: Python (skip if fluent)",
    focus: "Python fluency",
    tasks:
      "Close any Python gaps: comprehensions, type hints, virtual environments, the requests library, and async/await. Coming from Swift/Kotlin, focus on Pythonic idioms rather than raw syntax. If you're already comfortable, skip this week entirely and bank the 10 hours as buffer — or pull Week 4 forward.",
    milestone: "Comfortable writing Python",
    targetHrs: 10,
  },
  {
    week: 4,
    start: "Fri 21 Aug 2026",
    phase: "Phase 1: LLM fundamentals",
    focus: "Curriculum spine begins",
    tasks:
      "Enrol in the DeepLearning.AI 'AI Engineer Specialization' — this is your curriculum spine — and work through Course 1. Alongside it, do the short, free 'ChatGPT Prompt Engineering for Developers'. Aim to genuinely understand what a foundation model is and isn't before you start building on one.",
    milestone: "Specialization Course 1 underway",
    targetHrs: 10,
  },
  {
    week: 5,
    start: "Fri 28 Aug 2026",
    phase: "Phase 1: LLM fundamentals",
    focus: "Talking to models",
    tasks:
      "Continue the Specialization and get concrete about mechanics: how tokens work, context-window limits, temperature and sampling, and — importantly — how pricing is calculated so you can reason about cost. Write your first real API calls from Python and log the token usage of each one.",
    milestone: "First working API script",
    targetHrs: 10,
  },
  {
    week: 6,
    start: "Fri 4 Sep 2026",
    phase: "Phase 1: LLM fundamentals",
    focus: "Prompt & context engineering",
    tasks:
      "Do Anthropic Academy's 'Building with the Claude API' for a deeper, provider-grade view. Learn structured outputs (getting reliable JSON back) and the basics of tool/function calling — the two techniques you'll reach for in almost everything you build later.",
    targetHrs: 10,
  },
  {
    week: 7,
    start: "Fri 11 Sep 2026",
    phase: "Phase 1: LLM fundamentals",
    focus: "First build",
    tasks:
      "Build a chatbot that remembers the conversation: manage message history, a system prompt, and streaming responses. Then make it multi-model — run the same prompt through both OpenAI and Anthropic and note the differences. Commit it to GitHub with a short README describing what you learned.",
    milestone: "🎯 Chatbot with memory (on GitHub)",
    targetHrs: 10,
  },
  {
    week: 8,
    start: "Fri 18 Sep 2026",
    phase: "Phase 1: LLM fundamentals",
    focus: "Consolidate",
    tasks:
      "Build a second small tool — an article or document summariser — to cement the fundamentals. Tidy both projects: clear READMEs, proper .env handling, no committed secrets. This is a buffer week, so use any slack to catch up rather than race ahead.",
    milestone: "🎯 Summariser (on GitHub)",
    targetHrs: 10,
  },
  {
    week: 9,
    start: "Fri 25 Sep 2026",
    phase: "Phase 2: RAG",
    focus: "Retrieval foundations",
    tasks:
      "Start the RAG portion of the Specialization. Understand embeddings (turning text into vectors), semantic similarity, and why RAG exists at all — grounding a model in your own data instead of relying on its training. Read one solid end-to-end RAG explainer before you write any code.",
    targetHrs: 10,
  },
  {
    week: 10,
    start: "Fri 2 Oct 2026",
    phase: "Phase 2: RAG",
    focus: "Vector search",
    tasks:
      "Build the naïve version of your flagship 'Chat With Your Documents' app end-to-end: ingest one PDF, chunk it, embed the chunks, store them in a local Chroma vector DB, retrieve the top matches for a question, and stuff them into the prompt. Ugly is completely fine — the goal is a working loop you understand.",
    milestone: "🎯 M1: naïve RAG loop end-to-end",
    targetHrs: 10,
  },
  {
    week: 11,
    start: "Fri 9 Oct 2026",
    phase: "Phase 2: RAG",
    focus: "Real ingestion",
    tasks:
      "Make ingestion real: handle multiple files and formats (PDF, .md, .txt), add sensible chunking with overlap, and store metadata (source file and page) alongside each chunk so you can cite it later. Test against a messy, real-world set of documents rather than one clean file.",
    milestone: "🎯 M2: real document ingestion",
    targetHrs: 10,
  },
  {
    week: 12,
    start: "Fri 16 Oct 2026",
    phase: "Phase 2: RAG",
    focus: "Grounding",
    tasks:
      "Add grounding and trust: return citations pointing back to the exact source passages, and build an explicit 'I don't know' path for when retrieval is weak. This honesty is what separates a real system from a demo — and it's a strong interview talking point.",
    milestone: "🎯 M3: citations & grounding",
    targetHrs: 10,
  },
  {
    week: 13,
    start: "Fri 23 Oct 2026",
    phase: "Phase 2: RAG",
    focus: "Interface",
    tasks:
      "Give it a real interface with Streamlit: document upload, a chat window, streaming responses, and visible source citations. Keep it simple but presentable — this is the version people will actually click through in your portfolio, so first impressions count.",
    milestone: "🎯 M4: working UI / demo",
    targetHrs: 10,
  },
  {
    week: 14,
    start: "Fri 30 Oct 2026",
    phase: "Phase 2: RAG",
    focus: "Buffer & polish",
    tasks:
      "Polish the flagship into a shareable demo: fix the rough edges, write a proper README with an architecture sketch, and record a 30-second demo GIF. This is a buffer week, so also use it to close any gaps from Phase 2 before moving into agents.",
    milestone: "Flagship project demo-ready",
    targetHrs: 10,
  },
  {
    week: 15,
    start: "Fri 6 Nov 2026",
    phase: "Phase 3: Agents",
    focus: "Tool use",
    tasks:
      "Begin the agents module of the Specialization. Understand tool/function calling in depth — how a model decides to call a function, how you pass the result back, and how to design tools well. As practice, convert one manual step in an earlier project into a proper tool call.",
    targetHrs: 10,
  },
  {
    week: 16,
    start: "Fri 13 Nov 2026",
    phase: "Phase 3: Agents",
    focus: "Agentic patterns",
    tasks:
      "Learn the core agentic patterns: ReAct (reason + act loops), Plan-and-Execute, and Reflection (self-critique). Understand the difference between short-term and long-term memory for agents and where each matters. Sketch how you'd apply one of these patterns to a real task.",
    targetHrs: 10,
  },
  {
    week: 17,
    start: "Fri 20 Nov 2026",
    phase: "Phase 3: Agents",
    focus: "MCP",
    tasks:
      "Do Anthropic Academy's 'Introduction to Model Context Protocol'. Build a minimal MCP server and client so you understand the standard that now underpins tool use across the industry — including OpenAI. Aim to expose at least one simple tool over MCP yourself.",
    milestone: "First MCP server/client",
    targetHrs: 10,
  },
  {
    week: 18,
    start: "Fri 27 Nov 2026",
    phase: "Phase 3: Agents",
    focus: "MCP advanced",
    tasks:
      "Do 'MCP: Advanced Topics' and apply the production patterns — proper error handling, auth, and structuring multiple tools cleanly. MCP fluency is a genuine differentiator right now, so it's worth investing real time here rather than skimming.",
    targetHrs: 10,
  },
  {
    week: 19,
    start: "Fri 4 Dec 2026",
    phase: "Phase 3: Agents",
    focus: "Agent build",
    tasks:
      "Build a real agent: a research or data-analysis assistant that uses tools to complete a multi-step task (e.g. search + fetch + summarise, or query data + compute + report). Prioritise reliability over cleverness — an agent that works predictably beats a flashy one that doesn't. Commit it with a README.",
    milestone: "🎯 Agent project (on GitHub)",
    targetHrs: 10,
  },
  {
    week: 20,
    start: "Fri 11 Dec 2026",
    phase: "Phase 3: Agents",
    focus: "Buffer & polish",
    tasks:
      "Harden the agent: add error handling, cost controls, and clear logging of each step it takes. Write the README and record a short demo. This is a buffer week — use any spare time to shore up anything shaky from Phase 3 before the production phase.",
    milestone: "Agent project demo-ready",
    targetHrs: 10,
  },
  {
    week: 21,
    start: "Fri 18 Dec 2026",
    phase: "Phase 4: Production",
    focus: "Evaluation (the money skill)",
    tasks:
      "The most valuable skill in the whole plan: build an evaluation set for your RAG app — questions paired with expected answers — and measure retrieval hit-rate and answer quality objectively. Establish a baseline you can then improve against. This is exactly what you'll talk about in interviews.",
    milestone: "🎯 M5: eval suite + baseline numbers",
    targetHrs: 10,
  },
  {
    week: 22,
    start: "Fri 25 Dec 2026",
    phase: "Phase 4: Production",
    focus: "Observability",
    tasks:
      "Instrument your projects with LangSmith (or a similar tool): trace every LLM call, inspect inputs and outputs, and catch failures you previously couldn't see. Being able to observe and debug AI systems in production is a core, under-taught skill.",
    targetHrs: 10,
  },
  {
    week: 23,
    start: "Fri 1 Jan 2027",
    phase: "Phase 4: Production",
    focus: "Reliability",
    tasks:
      "Add the production hardening: prompt versioning (so you can roll back a regression), response caching, rate-limiting, and guards against prompt injection and data leakage. Lean on the security-minded engineer you already are — this is where your background pays off.",
    targetHrs: 10,
  },
  {
    week: 24,
    start: "Fri 8 Jan 2027",
    phase: "Phase 4: Production",
    focus: "Deploy",
    tasks:
      "Dockerise the flagship and deploy it to a public URL (Railway, Render, or Fly.io). A live, deployed project a hiring manager can click is worth far more than a repo they'd have to clone and run themselves. Make sure the demo works from a cold start.",
    milestone: "🎯 M6: deployed, live URL",
    targetHrs: 10,
  },
  {
    week: 25,
    start: "Fri 15 Jan 2027",
    phase: "Phase 4: Production",
    focus: "Tune & prove",
    tasks:
      "Tune for cost and latency (caching, model choice, trimming prompts), then re-run your Week-21 eval and record the before/after numbers. 'I improved retrieval hit-rate from 61% to 84% by doing X' is precisely the kind of concrete, quantified result that gets an experienced engineer hired.",
    milestone: "Documented eval improvement",
    targetHrs: 10,
  },
  {
    week: 26,
    start: "Fri 22 Jan 2027",
    phase: "Phase 5: AI Systems Design",
    focus: "Architecture & tradeoffs",
    tasks:
      "Learn how AI systems are actually structured: the reference architectures for RAG and agentic systems — ingestion, retrieval, generation, evaluation, feedback loops, guardrails, observability — and how the pieces fit together. Internalise the quality/latency/cost tradeoff triangle and how to reason about it out loud. Study 2–3 real production architecture write-ups from engineering blogs and sketch each one.",
    milestone: "Can whiteboard a RAG system end-to-end",
    targetHrs: 10,
  },
  {
    week: 27,
    start: "Fri 29 Jan 2027",
    phase: "Phase 5: AI Systems Design",
    focus: "Scaling & retrieval at scale",
    tasks:
      "Go deep on the hard parts: vector DB selection, hybrid (keyword + semantic) search and re-ranking, index freshness, and multi-tenancy; plus scaling patterns like semantic caching, model routing and cascades, batching, streaming, and graceful fallbacks. Practice back-of-envelope sizing for tokens, cost, and QPS. Then write a proper design doc for your own flagship RAG app.",
    milestone: "🎯 Design doc for your flagship system",
    targetHrs: 10,
  },
  {
    week: 28,
    start: "Fri 5 Feb 2027",
    phase: "Phase 5: AI Systems Design",
    focus: "System-design interviews",
    tasks:
      "Practice the interview format that's now standard for AI roles: design systems out loud against a prompt — 'design an AI customer-support assistant', 'design a code-review copilot', 'design a document-Q&A platform at scale'. Do 3–4 timeboxed mock designs covering requirements, architecture, tradeoffs, scaling, evaluation, and failure modes. Your 13 years of general system-design instinct is the real edge here — you're just layering the AI-specific parts on top.",
    milestone: "3–4 AI system-design mocks done",
    targetHrs: 10,
  },
  {
    week: 29,
    start: "Fri 12 Feb 2027",
    phase: "Phase 6: Launch",
    focus: "Portfolio polish",
    tasks:
      "Finalise your three portfolio projects: strong READMEs, an architecture diagram for each, your evaluation results, and an honest 'limitations and next steps' section (a real seniority signal). Make your GitHub profile tell one clear story about the engineer you've become.",
    milestone: "3 portfolio projects live",
    targetHrs: 10,
  },
  {
    week: 30,
    start: "Fri 19 Feb 2027",
    phase: "Phase 6: Launch",
    focus: "Visibility",
    tasks:
      "Write one or two short posts (blog or LinkedIn) on what you built and learned — a walkthrough of your RAG evaluations, or how you approached agents. Public work compounds: it's discovery, credibility, and interview material all at once, with very little extra effort.",
    milestone: "1–2 posts published",
    targetHrs: 10,
  },
  {
    week: 31,
    start: "Fri 26 Feb 2027",
    phase: "Phase 6: Launch",
    focus: "Go to market",
    tasks:
      "Reframe your CV and LinkedIn around 'Software Engineer → AI Engineer', with your projects front and centre. Most importantly, volunteer for AI work at your current job — the fastest, lowest-risk route in — and start applying to AI-first teams and internal AI roles.",
    milestone: "Applications out",
    targetHrs: 10,
  },
];
