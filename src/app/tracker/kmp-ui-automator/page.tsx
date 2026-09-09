import Container from "@/app/_components/container";
import StudyBreadcrumb from "@/app/_components/study-breadcrumb";

// Build plan for kmp-ui-automator — the Week 17 MCP milestone project.
// Gated under /tracker by middleware. Content is data-driven so code snippets
// live in plain strings and the page inherits the site's class-based dark mode.

type Stage = {
  n: string;
  title: string;
  blurb: string;
  ships: string;
  hours: string;
  points: string[];
};

type Session = { slot: string; title: string; hrs: string };
type Week = { n: number; dates: string; title: string; hrs: string; gate: string; sessions: Session[] };
type Detector = { id: string; name: string; signal: number; note: string; verdict: string };

const STAGES: Stage[] = [
  {
    n: "01",
    title: "Android, cross-platform interface",
    blurb:
      "The full unified tool surface, with one implementation behind it. The abstraction is real from day one — the iOS driver exists and honestly reports what it cannot yet do.",
    ships: "Sun 20 Sep 2026",
    hours: "~46 h",
    points: [
      "~14 MCP tools defined; Android backed by adb",
      "Normalised UiNode model + platform-neutral selectors",
      "Capability matrix that stays honest across stages",
      "Reference KMP app with the shared tag contract live",
    ],
  },
  {
    n: "02",
    title: "iOS + divergence detection",
    blurb:
      "Broadcast mode: bind the session to both platforms and every action fans out to each. When they disagree, you get a ranked, tag-attributed divergence report. This is the payoff stage.",
    ships: "Sun 11 Oct 2026",
    hours: "~54 h",
    points: [
      "iOS lifecycle + screenshots via simctl",
      "iOS hierarchy and interaction via AXe",
      "Four-detector divergence engine (see below)",
      "Side-by-side demo with a deliberately planted bug",
    ],
  },
  {
    n: "03",
    title: "Optional extensions",
    blurb:
      "Re-scoped. WebDriverAgent was the original plan here, but AXe delivers the same value at Stage 2 cost — so this became a menu to pick from only if real usage demands it.",
    ships: "only if needed",
    hours: "1–3 wknds each",
    points: [
      "Physical Android devices (cheapest, adb is identical)",
      "CI mode — divergence as a merge gate",
      "Flow recording — replay one flow on both platforms",
      "A second iOS driver, only if AXe breaks",
    ],
  },
];

const WEEKS: Week[] = [
  {
    n: 1,
    dates: "29–30 Aug",
    title: "Spike & MCP plumbing",
    hrs: "9.5",
    gate: "Server appears in /mcp and returns a real screenshot.",
    sessions: [
      { slot: "Sat AM", title: "Spike 0 & skeleton", hrs: "3.5" },
      { slot: "Sat PM", title: "Targets & session", hrs: "3.0" },
      { slot: "Sun AM", title: "Screenshot & wire-up", hrs: "3.0" },
    ],
  },
  {
    n: 2,
    dates: "5–6 Sep",
    title: "Reference app",
    hrs: "9.5",
    gate: "Identical tag strings visible in both accessibility trees.",
    sessions: [
      { slot: "Sat AM", title: "Project & both targets building", hrs: "3.5" },
      { slot: "Sat PM", title: "Three screens", hrs: "3.0" },
      { slot: "Sun AM", title: "Prove the contract", hrs: "3.0" },
    ],
  },
  {
    n: 3,
    dates: "12–13 Sep",
    title: "Model layer — no device needed",
    hrs: "9.0",
    gate: "ui_snapshot and ui_find work. Full suite green with nothing plugged in.",
    sessions: [
      { slot: "Sat AM", title: "Hierarchy parsing", hrs: "3.0" },
      { slot: "Sat PM", title: "Geometry", hrs: "3.0" },
      { slot: "Sun AM", title: "Selectors & rendering", hrs: "3.0" },
    ],
  },
  {
    n: 4,
    dates: "19–20 Sep",
    title: "Interaction & Stage 1 ship",
    hrs: "9.5",
    gate: "🚢 Stage 1 ships.",
    sessions: [
      { slot: "Sat AM", title: "Core interaction", hrs: "3.5" },
      { slot: "Sat PM", title: "Reliability", hrs: "3.5" },
      { slot: "Sun AM", title: "README + demo GIF", hrs: "2.5" },
    ],
  },
  {
    n: 5,
    dates: "26–27 Sep",
    title: "iOS driver",
    hrs: "9.5",
    gate: "ui_snapshot works on iOS using the same selectors as Android.",
    sessions: [
      { slot: "Sat AM", title: "simctl", hrs: "3.5" },
      { slot: "Sat PM", title: "Unified lifecycle", hrs: "3.0" },
      { slot: "Sun AM", title: "iOS hierarchy", hrs: "3.0" },
    ],
  },
  {
    n: 6,
    dates: "3–4 Oct",
    title: "Broadcast & divergence",
    hrs: "9.5",
    gate: "One flow runs on both platforms. First divergence report produced.",
    sessions: [
      { slot: "Sat AM", title: "iOS interaction", hrs: "3.0" },
      { slot: "Sat PM", title: "Broadcast mode", hrs: "3.0" },
      { slot: "Sun AM", title: "D1 contract + D2 layout", hrs: "3.5" },
    ],
  },
  {
    n: 7,
    dates: "10–11 Oct",
    title: "Visual, report & Stage 2 ship",
    hrs: "9.0",
    gate: "🚢 Stage 2 ships.",
    sessions: [
      { slot: "Sat AM", title: "D3 visual", hrs: "3.0" },
      { slot: "Sat PM", title: "Noise & behaviour", hrs: "3.0" },
      { slot: "Sun AM", title: "Report, planted bug, demo GIF", hrs: "3.0" },
    ],
  },
];

const DETECTORS: Detector[] = [
  {
    id: "D1",
    name: "Contract",
    signal: 100,
    verdict: "deterministic, zero noise",
    note: "For every shared testTag: present on both? same enabled / checked / text? A screenshot-differ cannot do this at all — it has no notion of which region means promo_code_field. This is the headline capability, not the pixel diff.",
  },
  {
    id: "D2",
    name: "Layout",
    signal: 75,
    verdict: "topology solid, metrics noisy",
    note: "Reading order, containment and overlap are invariant to screen size and font metrics, so an inversion is always a bug. Raw position and size deltas are not — SF and Roboto legitimately differ by a few percent, so those warn rather than fail.",
  },
  {
    id: "D4",
    name: "Behaviour",
    signal: 70,
    verdict: "outcomes solid, timing noisy",
    note: "Did the action succeed on both, fail on both, or succeed on exactly one? Succeed-on-one is the strongest signal in the product, needs no thresholds, and falls out of broadcast mode for free.",
  },
  {
    id: "D3",
    name: "Visual",
    signal: 30,
    verdict: "needs the most machinery to be useful",
    note: "Never compare whole screens — crop per element using the tag bounds, downscale to 32×32, then compare with a perceptual hash rather than per-pixel RMS. Colour is checked separately in OKLab, because RGB distance does not track perceived difference.",
  },
];

const RISKS: { risk: string; mitigation: string }[] = [
  {
    risk: "AXe cannot see Compose Multiplatform's lazily-synced accessibility tree",
    mitigation: "Spike 0, first 90 minutes. If it fails, WebDriverAgent returns and Stage 2 costs 20–25 h more.",
  },
  {
    risk: "Context flooding — a raw hierarchy dump is 50–200 KB of XML",
    mitigation: "Hard cap of ~2 000 tokens per tool response. Prune, collapse, and say so when truncating.",
  },
  {
    risk: "Content-rect and density normalisation underestimated",
    mitigation: "Without it every iOS element is offset from its Android twin — a 100% false-positive rate on layout diff.",
  },
  {
    risk: "The reference app quietly becomes the project",
    mitigation: "Three screens, ugly is fine, timeboxed to Week 2. One deliberately planted divergence.",
  },
];

const TAG_KOTLIN = `// shared/src/commonMain/kotlin/.../UiTags.kt
object UiTags {
    const val LOGIN_SUBMIT = "login_submit"
}

// Applied once, in shared Compose UI
Button(
    onClick = ::submit,
    modifier = Modifier.testTag(UiTags.LOGIN_SUBMIT),
) { Text("Sign in") }`;

const TAG_ANDROID = `// ⚠️ Android needs an explicit opt-in, or the tag
// never reaches the accessibility tree and every
// selector silently matches nothing.

@OptIn(ExperimentalComposeUiApi::class)
Scaffold(
    modifier = Modifier.semantics {
        testTagsAsResourceId = true
    }
) { /* nested testTags now appear as resource-id */ }`;

function Badge({ children, tone }: { children: string; tone: "blue" | "amber" | "violet" | "emerald" }) {
  const map = {
    blue: "bg-brand-blue/10 text-brand-blue",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  } as const;
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide ${map[tone]}`}>{children}</span>
  );
}

function Pane({ label, tone, code }: { label: string; tone: "amber" | "violet"; code: string }) {
  const toneClass = tone === "amber" ? "text-amber-600 dark:text-amber-400" : "text-violet-600 dark:text-violet-400";
  return (
    <div className="flex min-w-0 flex-col bg-white dark:bg-slate-800/60">
      <div className={`px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wide ${toneClass}`}>{label}</div>
      <pre className="overflow-x-auto px-4 pb-4 pt-1.5">
        <code className="whitespace-pre font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-100">
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function KmpUiAutomatorPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <StudyBreadcrumb title="kmp-ui-automator" />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl">kmp-ui-automator</h1>
            <Badge tone="blue">week 17 milestone</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            An MCP server that lets an agent drive and verify mobile UI across{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Android</span> and{" "}
            <span className="text-violet-600 dark:text-violet-400">iOS</span> through one unified tool surface. An agent
            changes shared KMP code, runs the same flow on both platforms, and reports back where the two diverge.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            This is the <strong className="text-slate-700 dark:text-slate-200">Custom MCP server (FastMCP)</strong>{" "}
            milestone, built ahead of the curriculum on purpose — the point is to learn MCP by wiring it up rather than
            by reading protocol theory, so the build lands before Week 17 rather than during it.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="https://claude.ai/code/artifact/439b7790-e240-48b9-b66d-c01a19cbf366"
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-blue/40 bg-brand-blue/5 px-3 py-1.5 text-sm font-medium text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-blue/50"
            >
              <span aria-hidden>✓</span> Session tracker
            </a>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Repository link goes here once the project is pushed to GitHub.
            </span>
          </div>

          {/* ---------------- The contract ---------------- */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">The shared contract</h2>
            <Badge tone="blue">the whole idea</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Both platforms already agree on a semantic model — Android&apos;s{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">resource-id</code> is
            iOS&apos;s{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">accessibilityIdentifier</code>
            . Declare the tag once in <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">commonMain</code>{" "}
            and one selector addresses both.
          </p>
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
            <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-slate-700 md:grid-cols-2">
              <Pane label="Declare & apply once" tone="violet" code={TAG_KOTLIN} />
              <Pane label="The Android gotcha" tone="amber" code={TAG_ANDROID} />
            </div>
          </div>
          <div className="mt-3 rounded-lg border-l-4 border-amber-400 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-100">Why it bites:</span>{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">Modifier.testTag()</code>{" "}
            sets a Compose-semantics property visible only to the Compose test framework. On iOS under Compose
            Multiplatform it maps to <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">accessibilityIdentifier</code>{" "}
            automatically; on Android it reaches UIAutomator only with the opt-in above. The server detects its absence
            and says so, rather than returning a bare &ldquo;element not found&rdquo;.
          </div>

          {/* ---------------- Stages ---------------- */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Stages</h2>
            <Badge tone="emerald">each independently shippable</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {STAGES.map((s) => (
              <div
                key={s.n}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-sm font-bold text-brand-blue">{s.n}</span>
                  <h3 className="font-semibold tracking-tight">{s.title}</h3>
                  <span className="ml-auto font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {s.hours} · {s.ships}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{s.blurb}</p>
                <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <span className="text-brand-blue" aria-hidden>
                        ·
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ---------------- Divergence ---------------- */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">What &ldquo;divergence&rdquo; means</h2>
            <Badge tone="violet">the hard question</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Compose and SwiftUI will never be pixel-identical, so a naive screenshot diff reports near-total difference
            on every screen. Divergence is four independent detectors with very different signal-to-noise, applied in
            descending order of reliability — most tools do this backwards by starting with pixels.
          </p>
          <div className="mt-5 space-y-4">
            {DETECTORS.map((d) => (
              <div
                key={d.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-bold text-brand-blue">{d.id}</span>
                  <h3 className="font-semibold tracking-tight">{d.name}</h3>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{d.verdict}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-brand-blue" style={{ width: `${d.signal}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{d.note}</p>
              </div>
            ))}
          </div>

          {/* ---------------- Schedule ---------------- */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Seven weekends</h2>
            <Badge tone="emerald">~65 h</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Twenty-one sessions, ~9.5 h a week. Each week ends on a binary gate — it either passes or the week
            isn&apos;t done.
          </p>
          <div className="mt-5 space-y-3">
            {WEEKS.map((w) => (
              <div
                key={w.n}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <div className="flex flex-wrap items-baseline gap-3 px-5 pb-2 pt-4">
                  <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold tracking-wide text-white dark:bg-slate-100 dark:text-slate-900">
                    WK {w.n}
                  </span>
                  <h3 className="font-semibold tracking-tight">{w.title}</h3>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{w.dates}</span>
                  <span className="ml-auto font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {w.hrs} h
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-slate-700 sm:grid-cols-3">
                  {w.sessions.map((s) => (
                    <div key={s.slot} className="bg-white px-5 py-3 dark:bg-slate-800/60">
                      <div className="text-xs font-bold uppercase tracking-wide text-brand-blue">{s.slot}</div>
                      <div className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{s.title}</div>
                      <div className="mt-0.5 font-mono text-xs tabular-nums text-slate-400">{s.hrs} h</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 bg-slate-50 px-5 py-2.5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Gate:</span> {w.gate}
                </div>
              </div>
            ))}
          </div>

          {/* ---------------- Risks ---------------- */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">What most likely eats the time</h2>
            <Badge tone="amber">watch out</Badge>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {RISKS.map((r) => (
              <div
                key={r.risk}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <h4 className="text-sm font-semibold tracking-tight">{r.risk}</h4>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{r.mitigation}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Full design rationale, the complete tool surface and the unassisted ~102 h estimate live in{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">PLAN.md</code> and{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] dark:bg-slate-800">SCHEDULE.md</code> in the
            repository.
          </p>
        </div>
      </Container>
    </main>
  );
}
