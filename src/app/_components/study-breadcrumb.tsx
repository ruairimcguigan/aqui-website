import Link from "next/link";

// Shared breadcrumb for the tracker's study / reference pages:
//   Tracker › Reference › <this page>
// Plain links only, so it works in both server and client ("use client") pages.
export default function StudyBreadcrumb({ title }: { title: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-12 text-sm text-slate-400 dark:text-slate-500"
    >
      <Link href="/tracker" className="font-medium text-brand-blue hover:underline">
        Tracker
      </Link>
      <span aria-hidden>›</span>
      <Link href="/tracker/reference" className="font-medium text-brand-blue hover:underline">
        Reference
      </Link>
      <span aria-hidden>›</span>
      <span className="text-slate-500 dark:text-slate-400">{title}</span>
    </nav>
  );
}
