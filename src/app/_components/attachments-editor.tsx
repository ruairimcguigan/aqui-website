"use client";

import { useState } from "react";
import { attachmentKind, normaliseUrl, type Attachment } from "@/lib/tracker/plan";

// Icon per detected kind. Links only — the file lives wherever it already does
// (Drive/Docs/Dropbox/etc.); we just keep a labelled pointer per week.
const KIND_ICON: Record<string, string> = {
  doc: "📄",
  sheet: "📊",
  slides: "📽️",
  pdf: "📕",
  drive: "📁",
  link: "🔗",
};

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return "att-" + Date.now() + "-" + Math.random().toString(36).slice(2);
  }
}

export function AttachmentsEditor({
  value,
  onChange,
}: {
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const items = value ?? [];

  function add() {
    const cleanUrl = normaliseUrl(url);
    if (!cleanUrl) return;
    const att: Attachment = {
      id: uid(),
      label: label.trim() || cleanUrl.replace(/^https?:\/\//, "").slice(0, 60),
      url: cleanUrl,
      kind: attachmentKind(cleanUrl),
      addedAt: Date.now(),
    };
    onChange([...items, att]);
    setLabel("");
    setUrl("");
    setAdding(false);
  }

  function remove(id: string) {
    onChange(items.filter((a) => a.id !== id));
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Attachments{items.length > 0 ? ` · ${items.length}` : ""}
        </span>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-xs font-medium text-brand-blue hover:underline"
        >
          {adding ? "Cancel" : "Add link"}
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {items.map((a) => (
            <li key={a.id} className="flex items-center gap-2 text-sm">
              <span aria-hidden>{KIND_ICON[a.kind] ?? "🔗"}</span>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-brand-blue hover:underline"
                title={a.url}
              >
                {a.label}
              </a>
              <button
                onClick={() => remove(a.id)}
                title="Remove"
                aria-label={`Remove ${a.label}`}
                className="text-xs text-slate-400 transition hover:text-red-500"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !adding && (
          <p className="mt-1 text-xs italic text-slate-400">
            Link papers, Google Docs, slides, PDFs… for this week.
          </p>
        )
      )}

      {adding && (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g. RAG survey paper)"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder="Paste a URL (Drive, Docs, PDF…)"
              className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
            <button
              onClick={add}
              disabled={!url.trim()}
              className="rounded-md bg-brand-blue px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              Add
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Tip: keep the file in Drive/Dropbox and paste its share link here.
          </p>
        </div>
      )}
    </div>
  );
}
