import Link from "next/link";
import Container from "@/app/_components/container";
import { REFERENCES } from "@/lib/tracker/references";

// The reference hub: one card per study page. Driven entirely by
// src/lib/tracker/references.ts — add an entry there and it shows up here.

export default function ReferenceHubPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-12 text-sm text-slate-400 dark:text-slate-500"
          >
            <Link href="/tracker" className="font-medium text-brand-blue hover:underline">
              Tracker
            </Link>
            <span aria-hidden>›</span>
            <span className="text-slate-500 dark:text-slate-400">Reference</span>
          </nav>

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Reference library</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            Your study pages — the concepts and cheat sheets worth keeping close as you work through the plan. Each one
            is a self-contained explainer you can revise from before interviews.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REFERENCES.map((r) => (
              <Link
                key={r.slug}
                href={`/tracker/${r.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-blue/50 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-brand-blue/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-blue dark:text-slate-100">
                    {r.title}
                  </h2>
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {r.tag}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{r.blurb}</p>
                <span className="mt-3 text-sm font-medium text-brand-blue">Open →</span>
              </Link>
            ))}
          </div>

          <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-slate-700">
            More pages get added here as the plan progresses. This hub, and the breadcrumb on each page, are driven by a
            single list — so the library stays tidy however many you add.
          </p>
        </div>
      </Container>
    </main>
  );
}
