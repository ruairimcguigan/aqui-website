import Container from "@/app/_components/container";
import StudyBreadcrumb from "@/app/_components/study-breadcrumb";

// A plain-English, labelled reference for how a Transformer turns text into a
// next-token prediction — with the real maths tucked into a collapsible
// appendix. Gated under /tracker. Diagrams are hand-authored inline SVG, themed
// via Tailwind fill/stroke classes.

const TOKENS = ["The", "cat", "sat", "on", "the"];
const CX = [110, 170, 230, 290, 350]; // shared column centres for tokens + vectors

// Shared styles kept as constants so the long body stays readable.
const H2 = "mt-12 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100";
const P = "mt-3 text-slate-600 dark:text-slate-300";
const STRONG = "font-semibold text-slate-800 dark:text-slate-100";
const PRE =
  "mt-3 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-900/50 dark:text-slate-300";

function Code({ children }: { children: string }) {
  return (
    <pre className={PRE}>
      <code>{children}</code>
    </pre>
  );
}

export default function TransformerPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <StudyBreadcrumb title="How a Transformer works" />

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">How a Transformer works</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            The whole job is one thing: <strong className="text-slate-700 dark:text-slate-200">predict the next
            token</strong>. Everything below is the machinery that makes that prediction good — explained in plain
            English, with the actual maths tucked into a collapsible section at the end for when you want it.
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

          {/* ---------- 1. Tokens and vectors ---------- */}
          <h2 className={H2}>1 · Tokens and numbers</h2>
          <p className={P}>
            The model can&apos;t work with the word &ldquo;cat&rdquo; directly, so text becomes numbers in{" "}
            <strong className={STRONG}>two separate steps</strong> that are easy to blur together.
          </p>
          <p className={P}>
            <strong className={STRONG}>Step A — tokenization.</strong>{" "}
            {`Text is chopped into tokens (roughly word-pieces — "running" might become "run" + "ning"). Every possible token lives in a fixed vocabulary of maybe 50,000–100,000 tokens, each with a permanent ID number. Turning a token into its ID is just a dictionary lookup: "cat" is always, say, 2415.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Step B — embedding.</strong>{" "}
            {`That ID is turned into a list of a few hundred numbers (a "vector") by looking it up in a big table — one row per token ID. That list of numbers is what actually flows into the model.`}
          </p>
          <Code>{`row 464   → [ 0.90,  0.02, −0.31, … ]   ("the")
row 2415  → [ 0.12, −0.83,  0.45, … ]   ("cat")`}</Code>
          <p className={P}>
            <strong className={STRONG}>The ID and the vector are not related by maths.</strong>{" "}
            {`2415 doesn't "add up" to the vector — it's purely an address. Think of a house: 2415 is the house number (which door to go to), and the vector is the furniture inside. The number on the door says nothing about the furniture. Reshuffle the vocabulary so "cat" became ID 9999, move its vector to row 9999, and the model behaves identically. The ID is a name tag for lookup; the vector is the content.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>So where do the vector&apos;s numbers come from?</strong>{" "}
            {`They're learned, not chosen. At the start they're random noise — a brand-new model has random numbers everywhere and predicts gibberish. Those numbers are adjustable dials (part of the model's billions of tunable "weights"). Training slowly turns them: billions of times over, the model sees real text with the next word hidden, guesses, the error is measured, and every dial — including "cat"'s numbers — is nudged a hair in whatever direction would have made the guess better. Nobody ever typed "0.12"; it's the residue of billions of tiny corrections.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Meaning emerges as a side effect.</strong>{" "}
            {`The only pressure is "predict the next word better." To do that, the model is forced to give words used in similar contexts similar vectors — so "cat" and "dog" end up close together, "cat" and "helicopter" far apart. There's an old linguistics line for it: "you shall know a word by the company it keeps." The same random → nudged → meaningful story is true of every number in the model; embeddings are just the easiest place to see it.`}
          </p>

          {/* ---------- 2. Attention ---------- */}
          <h2 className={H2}>2 · Attention — the one big idea</h2>
          <p className={P}>
            {`To understand a word you need its context. In "the trophy didn't fit in the case because it was too big" — what does "it" refer to? You can only tell by looking at the other words. Attention is how the model does that looking: for every token, it scans all the other tokens, decides which are relevant, and pulls in information from them.`}
          </p>
          <p className={P}>
            Each token produces three things — a <strong className={STRONG}>Query</strong> (&ldquo;what I&apos;m
            looking for&rdquo;), a <strong className={STRONG}>Key</strong> (&ldquo;what I&apos;m about&rdquo;), and a{" "}
            <strong className={STRONG}>Value</strong> (&ldquo;the information I&apos;ll hand over&rdquo;). It works like a
            search engine: a token&apos;s Query is matched against every token&apos;s Key, the matches become weights,
            and the result is a weighted blend of the Values.
          </p>

          {/* ---------- Figure 2: attention lookup ---------- */}
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

          <p className={P}>
            The actual formula is short — you only need to recognise it, not derive it. In plain words: compare every
            query to every key, turn those comparisons into percentages that add to 100%, then take a weighted blend of
            the values.
          </p>
          <Code>{`attention = softmax( Q · Kᵀ / √dₖ ) · V`}</Code>
          <p className={P}>
            {`One rule for text generation: a token may only look at tokens before it, never after — when the model is writing, the future words don't exist yet. (That "no peeking ahead" rule is called causal masking.)`}
          </p>

          {/* ---------- 3. Multiple heads ---------- */}
          <h2 className={H2}>3 · Multiple heads — several kinds of attention at once</h2>
          <p className={P}>
            {`A word usually relates to other words in more than one way at the same time — grammar, topic, tone. So instead of doing attention once, the model does it several times in parallel (often 8, or many more), each an independent "head" that specialises in a different kind of relationship. Their results are combined afterwards. The clever part: each head works in a smaller slice of the space, so running eight of them costs about the same as running one big one — several viewpoints, nearly for free.`}
          </p>

          {/* ---------- 4. FFN ---------- */}
          <h2 className={H2}>4 · The &ldquo;thinking&rdquo; step</h2>
          <p className={P}>
            {`Attention mixes information between tokens. After that, each token goes through a small neural network on its own — the feed-forward step — which is where per-word processing happens and where a lot of the model's actual knowledge is stored. A useful mental model: attention decides what's relevant; the feed-forward step digests it. Every layer alternates these two — gather context, then think — and a big model just stacks this pair dozens of times.`}
          </p>

          {/* ---------- 5. Plumbing ---------- */}
          <h2 className={H2}>5 · The plumbing that makes deep models work</h2>
          <p className={P}>
            <strong className={STRONG}>Residual connections:</strong>{" "}
            {`instead of replacing a token's vector at each step, each step adds an adjustment to it. That keeps a clean path running all the way through the model, which is what lets you stack many layers without the signal degrading.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Layer normalization:</strong>{" "}
            {`after each step, the numbers are rescaled back into a tidy range so nothing blows up or shrinks away layer after layer. Think of them as the shock absorbers and guard rails — not glamorous, but without them a deep stack won't train.`}
          </p>

          {/* ---------- 6. Producing the next word ---------- */}
          <h2 className={H2}>6 · Producing the next word</h2>
          <p className={P}>
            {`After the final layer, the model turns the last position's vector into a score for every token in its vocabulary, and softmax turns those into probabilities that sum to 100%. For "the cat sat on the ___" you might get:`}
          </p>
          <Code>{`mat    40%
floor  25%
sofa   20%
bed    15%
… (thousands more, each tiny)`}</Code>
          <p className={P}>
            {`Now it has to pick one. How it picks is controlled by a few knobs — the ones you set in the API — and they don't change the model at all, only how the choice is made from this list.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Greedy — just take the top one.</strong>{" "}
            {`Always pick the highest-probability token, then move on — never reconsider, never look ahead. It's "greedy" in the computer-science sense: grab the best-looking option right in front of you and assume a chain of locally-best choices adds up to the best overall result. The catch: the locally-best word at each step doesn't always give the best overall sentence.`}
          </p>
          <p className={P}>A two-step example makes it undeniable. Suppose the first word is either:</p>
          <Code>{`"nice"        50% likely — but the best word after it is only 30% likely
"absolutely"  40% likely — but it's almost always followed by "gorgeous" (90%)

greedy picks "nice":        0.50 × 0.30 = 0.15
the path it skipped:        0.40 × 0.90 = 0.36   ← more than twice as likely overall`}</Code>
          <p className={P}>
            {`Greedy took "nice" (50 beats 40) and missed the far more probable "absolutely gorgeous" path, because at step one it couldn't see the payoff behind the second word. It optimises the step, not the sentence. So greedy is fast, dead simple and perfectly reproducible — but blind, and it tends to fall into bland, repetitive loops. Its weaknesses are exactly what the alternatives fix: beam search keeps several candidate sentences alive and only commits at the end, and sampling with temperature deliberately doesn't always take the top word.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Temperature — how adventurous the pick is.</strong>{" "}
            {`It reshapes the probability list before choosing. Same model, same ranking — only the spread changes:`}
          </p>
          <Code>{`normal (≈1):   mat 40%   floor 25%   sofa 20%   bed 15%
low   (0.3):   mat 80%   floor 12%   sofa  6%   bed  2%    ← gaps exaggerated
high  (1.5):   mat 31%   floor 27%   sofa 24%   bed 18%    ← gaps flattened`}</Code>
          <p className={P}>
            {`Low temperature makes the leader pull away and long-shots shrink — safe and predictable (at 0 it's exactly greedy). High temperature flattens the gaps so underdogs become real contenders — more varied and creative, and pushed too high it turns to noise. The mental image is a "boldness dial": down = stick to the safe, obvious word; up = willing to gamble.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Top-p and top-k</strong>{" "}
            {`fence off a sensible shortlist of candidates first — top-k keeps the k most likely tokens, top-p keeps the most likely tokens that together add up to p of the probability — so the model never blurts out one of the thousands of near-zero nonsense tokens. Typical setup: top-p/top-k pick the shortlist, temperature decides how boldly to choose from it.`}
          </p>

          {/* when to use box */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/40">
            <p className="font-semibold text-slate-800 dark:text-slate-100">When to use which — the practical part</p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {`Every knob is the same trade-off: reliable and repeatable vs varied and creative.`}
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              <strong className={STRONG}>Greedy / temperature 0</strong>{" "}
              {`— when correctness and consistency beat flair: structured output / JSON extraction, classification and routing, RAG answers grounded in documents (every bit of boldness is room to drift off the source), code generation, and — the big engineering one — anything you're testing or evaluating, where you need same input → same output so a changed answer means your change, not the model rolling dice.`}
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              <strong className={STRONG}>Higher temperature (≈0.7–1.2+)</strong>{" "}
              {`— when variety is the point: brainstorming and ideation, creative and marketing writing, generating several candidates then picking the best, and synthetic test data.`}
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              <strong className={STRONG}>Defaults:</strong>{" "}
              {`0–0.3 for anything programmatic or factual, ~0.7 for open conversation, above 1 only when you're explicitly asking for creativity.`}
            </p>
          </div>

          {/* ---------- 7. How it learns ---------- */}
          <h2 className={H2}>7 · How it learns, and who does the &ldquo;nudging&rdquo;</h2>
          <p className={P}>
            {`Training is simple in concept: show the model enormous amounts of text with the last word hidden, let it guess, and nudge its internal numbers whenever it's wrong. Do that across trillions of words and it gradually gets good at predicting what comes next — and to predict well it's forced to learn grammar, facts, reasoning and style along the way.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>What does the nudging? Nobody — it&apos;s software, not a person.</strong>{" "}
            {`It splits into two jobs. Backpropagation figures out the direction: after a wrong guess it calculates, for every dial, whether turning it up or down would help — just calculus (the chain rule) run backwards. The optimizer then takes the step: a piece of code (commonly one called Adam) turns every dial by a small amount. Then the loop repeats. A human only sets it up once and presses go; no person sees any individual nudge — there are trillions.`}
          </p>
          <p className={P}>
            {`And importantly, the model isn't choosing to improve itself — it has no intent. It's a mathematical process minimising an error number, the way water finds the lowest point in a valley without trying to. "Learning" is just our name for that error going down over millions of automatic steps.`}
          </p>

          {/* ---------- 8. Consequence ---------- */}
          <h2 className={H2}>8 · The one practical consequence to remember</h2>
          <p className={P}>
            {`Attention compares every token to every other token. So if you double the length of the input, the work roughly quadruples. That single fact explains three things you deal with as an engineer: why context windows have a limit, why long prompts are slower and cost more, and why so much engineering effort goes into using context efficiently. Connecting "attention compares everything to everything" to "that's why context is limited and long inputs cost more" is exactly the kind of thing that lands well in an interview.`}
          </p>

          {/* summary */}
          <div className="mt-8 rounded-xl border border-brand-blue/30 bg-brand-blue/5 p-4 dark:border-brand-blue/40 dark:bg-blue-400/10">
            <p className="text-sm font-semibold text-brand-blue dark:text-blue-300">The whole story in six sentences</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {`A transformer turns words into meaning-vectors, then repeatedly does two things: attention (each word gathers context from the relevant other words, using a query–key–value "search") and a feed-forward step (each word is processed on its own). It does the attention part through several parallel "heads" that each catch a different kind of relationship, and stacks this gather-then-think pair many times to build understanding. Residual connections and normalization are the plumbing that keeps a deep stack trainable. At the end it predicts the next word as a probability over its whole vocabulary, and generation is just doing that again and again. It learned all of this by guessing hidden next-words across huge amounts of text and being nudged toward better guesses. And because attention compares everything to everything, long inputs cost disproportionately more — which is why context is finite.`}
            </p>
          </div>

          {/* ---------- Collapsible: the maths ---------- */}
          <details className="group mt-10 rounded-xl border border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-800/60">
            <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">
              <span className="text-brand-blue">▸</span> Go deeper: the actual maths
              <span className="ml-2 font-normal text-slate-400">(optional — past the interview bar for applied roles)</span>
            </summary>
            <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {`Symbols: d_model = main vector width (512 in the original paper). n = sequence length. h = number of heads. d_k, d_v = per-head width (= d_model / h). X = input matrix, shape [n × d_model], one row per token.`}
              </p>

              <h3 className="mt-5 text-base font-bold text-slate-900 dark:text-slate-100">Positional encoding</h3>
              <p className={P}>
                {`Self-attention is order-blind on its own, so position is injected. The original paper adds a fixed sinusoidal vector to each embedding:`}
              </p>
              <Code>{`PE(pos, 2i)   = sin( pos / 10000^(2i / d_model) )
PE(pos, 2i+1) = cos( pos / 10000^(2i / d_model) )`}</Code>
              <p className={P}>
                {`Bounded and defined for any position, so it extrapolates; and for a fixed offset k, PE(pos+k) is a linear function of PE(pos), making "attend 3 tokens back" easy to learn. Modern LLMs mostly use RoPE (rotary embeddings) instead — it rotates Q and K by an angle proportional to position, baking relative position into the dot-product and extrapolating far better.`}
              </p>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Scaled dot-product attention</h3>
              <Code>{`Q = X·W_Q      K = X·W_K      V = X·W_V
  W_Q, W_K : [d_model × d_k]      W_V : [d_model × d_v]
  Q, K : [n × d_k]                V   : [n × d_v]

Attention(Q, K, V) = softmax( Q·Kᵀ / √d_k ) · V

  Q·Kᵀ        → [n × n]  raw similarity score for every token pair
  / √d_k      → keeps dot products from saturating softmax (stable gradients)
  softmax     → each row becomes weights that sum to 1
  · V         → [n × d_v] each token = attention-weighted blend of values`}</Code>
              <p className={P}>
                {`Causal mask (decoders): set scores[i, j] = −∞ for j > i before softmax, so future positions get zero weight.`}
              </p>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Softmax</h3>
              <Code>{`softmax(z)_i = e^(z_i) / Σ_j e^(z_j)          (stable form subtracts max(z) first)

derivative:  ∂s_i / ∂z_j = s_i · (δ_ij − s_j)    (δ_ij = 1 if i=j else 0)`}</Code>
              <p className={P}>
                {`When softmax saturates (one value ≈1) these gradients go to ≈0 — the vanishing-gradient risk the √d_k scaling exists to prevent.`}
              </p>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Multi-head dimensions</h3>
              <Code>{`head_i = Attention(X·W_Q^i, X·W_K^i, X·W_V^i)
MultiHead(X) = Concat(head_1, …, head_h) · W_O

d_k = d_v = d_model / h        paper: d_model=512, h=8 → d_k=d_v=64
each head_i : [n × 64]         concat of 8 heads : [n × 512]
W_O : [h·d_v × d_model] = [512 × 512]`}</Code>
              <p className={P}>
                {`Because each head is d_model/h wide, multi-head costs about the same as one full-width head — several specialised views for roughly the price of one.`}
              </p>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Feed-forward & layer norm</h3>
              <Code>{`FFN(x) = activation(x·W_1 + b_1) · W_2 + b_2
  W_1 : [d_model × d_ff]   W_2 : [d_ff × d_model]   d_ff ≈ 4·d_model (2048)
  activation: ReLU (original) / GELU / SwiGLU (modern)

LayerNorm(x) = γ · (x − μ) / √(σ² + ε) + β     (μ, σ² over the token's own features)

Block (pre-LN):  a = x + MHA(LayerNorm(x));  y = a + FFN(LayerNorm(a))`}</Code>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Training & backprop</h3>
              <Code>{`Loss (cross-entropy):  L = −(1/N) Σ_t log p_t(correct next token)
  perplexity = e^L

Matmul grads:  if Y = X·W  then  ∂L/∂W = Xᵀ·(∂L/∂Y),  ∂L/∂X = (∂L/∂Y)·Wᵀ
Softmax + cross-entropy together:  ∂L/∂logits = p − y   (pred minus one-hot truth)
Residual "+" passes gradient through unchanged — the gradient highway.

Optimizer: AdamW (adaptive per-parameter steps + weight decay), with LR warmup:
  lr = d_model^(−0.5) · min( step^(−0.5), step · warmup^(−1.5) )`}</Code>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Worked dimensions & complexity</h3>
              <Code>{`d_model=512  h=8  d_k=d_v=64  d_ff=2048  N=6      input n=4 tokens

embed → [4×512] → +PE → per-head Q,K,V [4×64]
scores Q·Kᵀ [4×4] → softmax → ·V [4×64] → concat 8 heads [4×512] → ·W_O [4×512]
+residual/norm → FFN [4×512→4×2048→4×512] → +residual/norm   (×6 blocks)
unembed last row [1×512]·[512×V] → softmax → next-token probs

Complexity:  O(n² · d)   ← the n² is why context is finite and long inputs cost more`}</Code>

              <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-slate-100">Interview-depth calibration:</strong>{" "}
                {`speak fluently on the pipeline, the attention formula and the Q/K/V analogy, why scaling exists, causal masking, multi-head's purpose, and the O(n²) consequence — that's genuinely impressive and enough. Understand-once (don't need to recite): the positional/FFN/LayerNorm formulas, the softmax Jacobian, the Adam/warmup schedule. Just be able to name: RoPE, FlashAttention, pre-LN vs post-LN, GELU/SwiGLU, encoder vs decoder. The value of the maths isn't reciting it — it's that "attention lets each token gather context" now sits on something solid.`}
              </p>
            </div>
          </details>

          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
            <strong className="text-slate-800 dark:text-slate-100">Engineer&apos;s reassurance:</strong> no magic in
            there — it&apos;s vectors and matrix multiplication learning statistical patterns from data.
            &ldquo;Attention&rdquo; is just relevance weights between tokens and a weighted average. Powerful, but
            mechanical.
          </p>

          <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-slate-700">
            Your Phase-1 reference for how models actually work. Pairs with the 3Blue1Brown and Karpathy videos linked
            on Weeks 4–5 — this is the map; those are the deep dives.
          </p>
        </div>
      </Container>
    </main>
  );
}
