# PRODUCT_NOTES — `product-wip-branch`

**Purpose.** This branch is the experimental sandbox for turning the private AI-engineering
study tracker into a **sellable product** for experienced engineers pivoting into AI (and
adjacent paths). It stays **off `main`/production** until features are validated. `main` is the
stable personal tracker; this branch is where product thinking accumulates alongside code.

**Origin.** Started as a personal 31-week AI-engineering learning tracker on
`aquidigital.co.uk/tracker`. The insight: other senior engineers feel the same "will AI take my
job / how do I pivot" pressure — so the tool could be a product. Dogfooding it (using it while
building it) is the current strategy for finding the right features.

## What's on this branch (beyond production `main`)

- **Instant answer-on-submit** — coach questions are answered the moment they're posted
  (`/api/questions` POST calls the model server-side), with the twice-daily cron as a backstop.
- **Collapsible Q&A** — answered questions collapse by default; click to expand.
- **Personalization** — `/tracker/onboarding` flow: pick a track, weekly hours, Python
  fluency, goal, and start date → saved config → personalized, dated, renumbered roadmap.
  Four tracks (`src/lib/tracker/tracks.ts`): AI/ML Engineering (full 31-wk), Security
  Engineering, Senior/Staff & Leadership, Specialized Data Science. The coach uses the active
  track's plan for correct week context.

## Architecture (current)

- Next.js (App Router) on Vercel. Tailwind. Password gate via signed cookie + middleware.
- Upstash Redis (single store). Keys: `aqui:tracker:progress`, `:questions`, `:config`.
- Coach answering: Anthropic Messages API (`COACH_MODEL`, default `claude-sonnet-4-6`),
  system prompt = `coach-context.ts` + active week + live progress. Shared in `lib/tracker/answer.ts`.
- Env: `TRACKER_PASSWORD`, `TRACKER_SECRET`, `KV_REST_API_*`, `ANTHROPIC_API_KEY`,
  `CRON_SECRET`, `COACH_MODEL`.

## Known WIP limitations (fix before selling)

- **Single-tenant.** One shared password, one Redis store, no user accounts.
- **Progress keyed by week number** → carries across tracks (Week 1 stays "done" when you
  switch track). Should be per-track / per-user.
- **Coach persona is user-specific** (written around Ruairi). Week context is track-correct,
  but the persona brief should be generated per user for a real product.
- **Non-AI tracks are lighter** (~18–22 wks, phase-level). Deepen when a track gets traction.
- **Onboarding is a single screen** (could be a stepped flow — the Vector prototype has one).
- **No reset / delete-config UI.** Changing track overwrites; no "back to default".
- **Preview shares the production Redis store** — preview writes are real data.

## Product backlog / ideas

- Multi-user auth + accounts (Auth.js) and per-user data isolation.
- Billing (Stripe) + tiers: free / Pro / cohort. Consider model tiering (Haiku free, Sonnet paid).
- Public landing page + waitlist (see the `Vector` prototype) to test demand.
- Adaptive roadmap: add / skip / reorder weeks; regenerate on the fly.
- Email digests + smarter notifications; progress analytics.
- Deepen the non-AI tracks; add more tracks as demand shows.

## Do this before over-building

Validate first: talk to ~10 target engineers, and ideally **pre-sell one paid cohort** off the
existing plan (coaching them manually) before investing in multi-user infra. Build the software
to scale what already sells.

## Related artifacts (in the Cowork conversation, not this repo)

- `Vector` product prototype (standalone HTML: landing + onboarding + tracker + mentor demo).
- Career-pivot research report and the AI/ML engineering roadmap docs.
