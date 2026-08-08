"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const LEGEND: [string, string][] = [
  ["Bold", "**bold**"],
  ["Italic", "*italic*"],
  ["Heading", "## Heading"],
  ["Quote", "> quote"],
  ["Inline code", "`code`"],
  ["Code block", "``` … ```"],
  ["Bullet list", "- item"],
  ["Numbered", "1. item"],
  ["Checklist", "- [ ] task"],
  ["Link", "[text](url)"],
];

export function MarkdownView({ text }: { text: string }) {
  return (
    <div className="prose-notes">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

export function NotesEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const hasNotes = value.trim().length > 0;

  function wrap(marker: string) {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const sel = value.slice(s, e) || "text";
    onChange(value.slice(0, s) + marker + sel + marker + value.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = s + marker.length;
      el.selectionEnd = s + marker.length + sel.length;
    });
  }

  function prefixLines(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const start = value.lastIndexOf("\n", s - 1) + 1;
    const block = value.slice(start, e) || "text";
    const replaced = block
      .split("\n")
      .map((l) => prefix + l)
      .join("\n");
    onChange(value.slice(0, start) + replaced + value.slice(e));
    requestAnimationFrame(() => el.focus());
  }

  if (!editing) {
    return (
      <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-brand-blue hover:underline"
          >
            {hasNotes ? "Edit" : "Add notes"}
          </button>
        </div>
        {hasNotes ? (
          <div className="mt-1">
            <MarkdownView text={value} />
          </div>
        ) : (
          <p className="mt-1 text-xs italic text-slate-400">Capture quotes, techniques, approaches…</p>
        )}
      </div>
    );
  }

  const toolbar: [string, string, () => void][] = [
    ["B", "bold", () => wrap("**")],
    ["I", "italic", () => wrap("*")],
    ["“ ”", "quote", () => prefixLines("> ")],
    ["</>", "inline code", () => wrap("`")],
    ["• List", "bullet list", () => prefixLines("- ")],
    ["H", "heading", () => prefixLines("## ")],
  ];

  return (
    <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes · markdown</span>
        <button
          onClick={() => setEditing(false)}
          className="text-xs font-medium text-brand-blue hover:underline"
        >
          Done
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1">
        {toolbar.map(([label, title, fn]) => (
          <button
            key={title}
            title={title}
            onClick={fn}
            className="rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-600 transition hover:border-brand-blue dark:border-slate-600 dark:text-slate-300"
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowHelp((h) => !h)}
          className="ml-auto rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-500 transition hover:border-brand-blue dark:border-slate-600"
        >
          {showHelp ? "hide syntax" : "? syntax"}
        </button>
      </div>

      {showHelp && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-md bg-slate-50 p-2 text-xs dark:bg-slate-900/50 sm:grid-cols-3">
          {LEGEND.map(([name, syn]) => (
            <div key={name}>
              <span className="text-slate-400">{name}: </span>
              <code className="text-slate-600 dark:text-slate-300">{syn}</code>
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Write in markdown — > for a quote, ``` for a code block, - for a list…"
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 outline-none focus:border-brand-blue dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
      />

      {value.trim() && (
        <div className="mt-2 rounded-md border border-slate-100 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Preview</div>
          <MarkdownView text={value} />
        </div>
      )}
    </div>
  );
}
