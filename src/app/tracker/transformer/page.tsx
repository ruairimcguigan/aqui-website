import Link from "next/link";
import Container from "@/app/_components/container";

// A super-simple, labelled reference for how a Transformer turns text into a
// next-token prediction, and what attention does. Gated under /tracker.
// Diagrams are hand-authored inline SVG, themed via Tailwind fill/stroke classes.

const TOKENS = ["The", "cat", "sat", "on", "the"];
const CX = [110, 170, 230, 290, 350]; // shared column centres for tokens + vectors

export default function TransformerPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="pt-12">
            <Link href="/tracker" className="text-sm font-medium text-brand-blue hover:underline">
              ← Back to tracker
            </Link>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">How a Transformer works</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            The whole job is one thing: <strong className="text-slate-700 dark:text-slate-200">predict the next
            token</strong>. Everything below is the machinery that makes that prediction good. A deliberate
            simplification — the trailer for Week 5.
          </p>

          {/* ---------- Figure 1: the pipeline ---------- */}
          <figure className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <svg
              viewBox="0 0 460 416"
              role="img"
              aria-label="A Transformer turns input text into tokens, then vectors, passes them through repeated attention layers where each token gathers context from the others, and finally predicts the next token."
              className="mx-auto block h-auto w-full max-w-[460px] font-sans text-slate-400 dark:text-slate-500"
            >
              <defs>
                <marker id="a1" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" className="fill-slate-400 dark:fill-slate-500" />
                </marker>
              </defs>

              {/* S1 input */}
              <rect x="80" y="18" width="300" height="40" rx="8" className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600" strokeWidth="1.5" />
              <text x="230" y="43" textAnchor="middle" fontSize="14" className="fill-slate-700 dark:fill-slate-200">&ldquo;The cat sat on the ___&rdquo;</text>

              <line x1="230" y1="58" x2="230" y2="84" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#a1)" />
              <text x="240" y="76" fontSize="11" className="fill-slate-500 dark:fill-slate-400">tokenize</text>

              {/* S2 tokens */}
              {TOKENS.map((t, i) => (
                <g key={t + i}>
                  <rect x={CX[i] - 26} y="88" width="52" height="28" rx="6" className="fill-slate-50 stroke-slate-300 dark:fill-slate-900/40 dark:stroke-slate-600" strokeWidth="1" />
                  <text x={CX[i]} y="106" textAnchor="middle" fontSize="12" className="fill-slate-700 dark:fill-slate-200">{t}</text>
                </g>
              ))}

              <line x1="230" y1="116" x2="230" y2="146" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#a1)" />
              <text x="240" y="136" fontSize="11" className="fill-slate-500 dark:fill-slate-400">embed + add position</text>

              {/* S3 vectors */}
              <rect x="80" y="150" width="300" height="58" rx="8" className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600" strokeWidth="1.5" />
              <text x="230" y="166" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">vectors — each token becomes a list of numbers</text>
              {CX.map((cx, i) => (
                <g key={"v" + i}>
                  <rect x={cx - 15} y="176" width="30" height="24" rx="3" className="fill-slate-50 stroke-slate-300 dark:fill-slate-900/40 dark:stroke-slate-600" strokeWidth="1" />
                  <line x1={cx - 9} y1="182" x2={cx + 9} y2="182" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
                  <line x1={cx - 9} y1="188" x2={cx + 5} y2="188" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
                  <line x1={cx - 9} y1="194" x2={cx + 9} y2="194" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
                </g>
              ))}

              <line x1="230" y1="208" x2="230" y2="236" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#a1)" />
              <text x="240" y="227" fontSize="11" className="fill-slate-500 dark:fill-slate-400">repeat through N layers ↻</text>

              {/* S4 attention (the accent) */}
              <rect x="80" y="238" width="300" height="92" rx="8" className="fill-brand-blue/5 stroke-brand-blue dark:fill-blue-400/10 dark:stroke-blue-400" strokeWidth="1.5" />
              <text x="230" y="256" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-brand-blue dark:fill-blue-400">Attention layer</text>
              {/* arcs: middle token gathers context from the others */}
              {[110, 170, 290, 350].map((x, i) => (
                <path key={"arc" + i} d={`M230,279 Q${(230 + x) / 2},${x === 170 || x === 290 ? 264 : 256} ${x},279`} fill="none" className="stroke-brand-blue/60 dark:stroke-blue-400/60" strokeWidth="1.2" />
              ))}
              {CX.map((cx, i) => (
                <circle key={"d" + i} cx={cx} cy="285" r="6" className={i === 2 ? "fill-brand-blue dark:fill-blue-400" : "fill-slate-300 dark:fill-slate-600"} />
              ))}
              <text x="230" y="318" textAnchor="middle" fontSize="11" className="fill-slate-600 dark:fill-slate-300">every token pulls context from the others</text>

              <line x1="230" y1="330" x2="230" y2="356" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#a1)" />
              <text x="240" y="348" fontSize="11" className="fill-slate-500 dark:fill-slate-400">predict next token</text>

              {/* S5 output */}
              <rect x="150" y="358" width="160" height="40" rx="8" className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600" strokeWidth="1.5" />
              <text x="230" y="383" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-slate-700 dark:fill-slate-200">&rarr; &ldquo;mat&rdquo;</text>
            </svg>
            <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Text → tokens → vectors → repeated attention layers → the next token. Train that guess-the-next-token
              game on the whole internet and the model must learn grammar, facts, and reasoning to win it.
            </figcaption>
          </figure>

          {/* ---------- Zoom: attention ---------- */}
          <h2 className="mt-12 text-2xl font-bold tracking-tight">Zoom in: what attention actually does</h2>
          <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
            Each token produces three vectors — a <strong className="text-slate-700 dark:text-slate-200">Query</strong>,
            a <strong className="text-slate-700 dark:text-slate-200">Key</strong>, and a{" "}
            <strong className="text-slate-700 dark:text-slate-200">Value</strong>. It&apos;s a fuzzy dictionary lookup:
            a token&apos;s Query is compared against every token&apos;s Key, the matches become weights, and the answer
            is a weighted blend of the Values.
          </p>

          <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <svg
              viewBox="0 0 460 250"
              role="img"
              aria-label="The word 'it' sends a Query that is compared to the Keys of other words. 'animal' matches strongly, so its Value dominates the weighted blend that becomes the meaning of 'it'."
              className="mx-auto block h-auto w-full max-w-[460px] font-sans text-slate-400 dark:text-slate-500"
            >
              <defs>
                <marker id="a2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" className="fill-slate-400 dark:fill-slate-500" />
                </marker>
                <marker id="a2hi" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" className="fill-brand-blue dark:fill-blue-400" />
                </marker>
              </defs>

              {/* Query */}
              <rect x="24" y="100" width="96" height="48" rx="8" className="fill-brand-blue/5 stroke-brand-blue dark:fill-blue-400/10 dark:stroke-blue-400" strokeWidth="1.5" />
              <text x="72" y="122" textAnchor="middle" fontSize="15" fontWeight="600" className="fill-slate-700 dark:fill-slate-200">&ldquo;it&rdquo;</text>
              <text x="72" y="138" textAnchor="middle" fontSize="11" className="fill-brand-blue dark:fill-blue-400">Query</text>

              {/* candidate tokens (Key + Value) */}
              {[
                { y: 36, word: "animal", hi: true },
                { y: 105, word: "road", hi: false },
                { y: 174, word: "tired", hi: false },
              ].map((c) => (
                <g key={c.word}>
                  <rect x="300" y={c.y} width="136" height="40" rx="6" className="fill-slate-50 stroke-slate-300 dark:fill-slate-900/40 dark:stroke-slate-600" strokeWidth="1" />
                  <text x="368" y={c.y + 18} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-slate-700 dark:fill-slate-200">{c.word}</text>
                  <text x="368" y={c.y + 32} textAnchor="middle" fontSize="10" className="fill-slate-500 dark:fill-slate-400">Key + Value</text>
                </g>
              ))}

              {/* arrows: weight = thickness */}
              <line x1="120" y1="120" x2="300" y2="56" stroke="currentColor" strokeWidth="3" className="stroke-brand-blue dark:stroke-blue-400" markerEnd="url(#a2hi)" />
              <text x="212" y="78" textAnchor="middle" fontSize="10" className="fill-brand-blue dark:fill-blue-400">high weight</text>

              <line x1="120" y1="126" x2="300" y2="125" stroke="currentColor" strokeWidth="1" markerEnd="url(#a2)" />
              <text x="212" y="118" textAnchor="middle" fontSize="10" className="fill-slate-400 dark:fill-slate-500">low</text>

              <line x1="120" y1="132" x2="300" y2="194" stroke="currentColor" strokeWidth="1" markerEnd="url(#a2)" />
              <text x="210" y="182" textAnchor="middle" fontSize="10" className="fill-slate-400 dark:fill-slate-500">low</text>

              {/* result */}
              <rect x="24" y="176" width="168" height="44" rx="8" className="fill-white stroke-slate-300 dark:fill-slate-800 dark:stroke-slate-600" strokeWidth="1.5" />
              <text x="108" y="203" textAnchor="middle" fontSize="12" className="fill-slate-700 dark:fill-slate-200">blend &rarr; mostly &ldquo;animal&rdquo;</text>
            </svg>
            <figcaption className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              &ldquo;the animal didn&apos;t cross the road because <em>it</em> was tired&rdquo; — &ldquo;it&rdquo; queries
              every word, matches <strong className="text-slate-600 dark:text-slate-300">animal</strong> most, and takes
              its meaning mostly from there. The <strong className="text-slate-600 dark:text-slate-300">Key + Value</strong>
              {" "}travel together as a pair; the <strong className="text-slate-600 dark:text-slate-300">Query</strong> does the lookup.
            </figcaption>
          </figure>

          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            <strong className="text-slate-800 dark:text-slate-100">Engineer&apos;s reassurance:</strong> no magic in
            there — it&apos;s vectors and matrix multiplication learning statistical patterns from data. &ldquo;Attention&rdquo;
            is just relevance weights between tokens and a weighted average. Powerful, but mechanical.
          </p>

          <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-slate-700">
            A simplified mental model for Phase 1. Week 5 (&ldquo;how tokens work, transformer architecture&rdquo;) goes a
            level deeper.
          </p>
        </div>
      </Container>
    </main>
  );
}
