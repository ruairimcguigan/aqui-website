import Container from "@/app/_components/container";
import StudyBreadcrumb from "@/app/_components/study-breadcrumb";

// Python ↔ Kotlin/Java idiom reference. Gated under /tracker by middleware.
// Content is data-driven so code snippets live in plain strings (no JSX-brace
// escaping) and the page inherits the site's class-based dark mode.

type Pair = { title: string; note: string; py: string; kt: string };
type Solo = { title: string; note: string; code: string; xref: string };
type Got = { title: string; note: string; code?: string };

const SHARED: Pair[] = [
  {
    title: "Variables & type inference",
    note: "Python is dynamically typed; annotations are optional but expected in serious code. Kotlin infers from val/var.",
    py: `x = 5                # inferred, dynamic
name: str = "Ada"    # optional type hint
total: float = 0.0`,
    kt: `val x = 5            // inferred, static
val name: String = "Ada"
var total = 0.0`,
  },
  {
    title: "Functions & default / named arguments",
    note: "Both support defaults and call-by-name. Python has no return-type enforcement — the hint is advisory.",
    py: `def greet(name: str, loud: bool = False) -> str:
    msg = f"Hi {name}"
    return msg.upper() if loud else msg

greet("Sam", loud=True)`,
    kt: `fun greet(name: String, loud: Boolean = false): String {
    val msg = "Hi $name"
    return if (loud) msg.uppercase() else msg
}
greet("Sam", loud = true)`,
  },
  {
    title: "Lambdas & higher-order functions",
    note: "Python lambdas are single-expression only; anything longer is a named def. Kotlin's trailing-lambda blocks have no limit.",
    py: `double = lambda x: x * 2
nums.sort(key=lambda p: p.age)`,
    kt: `val double = { x: Int -> x * 2 }
nums.sortedBy { it.age }`,
  },
  {
    title: "Transform & filter a collection",
    note: "Kotlin chains .map{}.filter{}; Python's idiomatic form is the comprehension (see Python-only for why).",
    py: `evens = [n * n for n in nums if n % 2 == 0]`,
    kt: `val evens = nums.filter { it % 2 == 0 }
                .map { it * it }`,
  },
  {
    title: "String interpolation",
    note: "Same feature, near-identical ergonomics.",
    py: `f"{name} is {age} ({age * 12} months)"`,
    kt: `"$name is $age (\${age * 12} months)"`,
  },
  {
    title: "Collection literals",
    note: "List, map, set — all first-class in both.",
    py: `xs = [1, 2, 3]
m  = {"a": 1, "b": 2}
s  = {1, 2, 3}`,
    kt: `val xs = listOf(1, 2, 3)
val m  = mapOf("a" to 1, "b" to 2)
val s  = setOf(1, 2, 3)`,
  },
  {
    title: "Absence / null handling",
    note: "Kotlin bakes nullability into the type system and enforces it. Python expresses it with | None but does not enforce it at runtime.",
    py: `name: str | None = find()
length = len(name) if name is not None else 0
value  = cfg.get("k") or "default"`,
    kt: `val name: String? = find()
val length = name?.length ?: 0
val value  = cfg["k"] ?: "default"`,
  },
  {
    title: "Value types / data classes",
    note: "Both auto-generate equality and a readable repr. Python adds @dataclass; for validation you reach for pydantic (heavy in AI work).",
    py: `from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int = 0`,
    kt: `data class User(
    val name: String,
    val age: Int = 0,
)`,
  },
  {
    title: "Ranges & loops",
    note: "Half-open ranges in both. Python has no C-style for — you iterate objects or range().",
    py: `for i in range(n):        # 0..n-1
    ...
for item in items:
    ...`,
    kt: `for (i in 0 until n) {     // 0..n-1
    ...
}
for (item in items) { ... }`,
  },
  {
    title: "Conditional expression",
    note: "Both are expressions that return a value — no C-style ?: in either.",
    py: `label = "adult" if age >= 18 else "minor"`,
    kt: `val label = if (age >= 18) "adult" else "minor"`,
  },
  {
    title: "Multi-way branch",
    note: "Kotlin's when is an exhaustiveness-checked expression. Python's match (3.10+) supports structural patterns but isn't exhaustiveness-checked.",
    py: `match cmd:
    case "go":   run()
    case "stop": halt()
    case _:      unknown()`,
    kt: `when (cmd) {
    "go"   -> run()
    "stop" -> halt()
    else   -> unknown()
}`,
  },
  {
    title: "Exceptions",
    note: "Same try / catch / finally shape; Python names the clause except. Java has checked exceptions — neither Kotlin nor Python does.",
    py: `try:
    risky()
except ValueError as e:
    handle(e)
finally:
    cleanup()`,
    kt: `try {
    risky()
} catch (e: IllegalArgumentException) {
    handle(e)
} finally {
    cleanup()
}`,
  },
  {
    title: "Iterating a map / dict",
    note: "Destructuring the entry works in both.",
    py: `for k, v in scores.items():
    print(k, v)`,
    kt: `for ((k, v) in scores) {
    println("$k $v")
}`,
  },
];

const PY_ONLY: Solo[] = [
  {
    title: "Comprehensions (list / dict / set / generator)",
    note: "The default way to build a collection — declarative, often replacing a whole map/filter chain or loop.",
    code: `squares  = [n*n for n in nums]
lookup   = {u.id: u for u in users}
uniques  = {w.lower() for w in words}
lazy     = (n*n for n in nums)     # generator, no list built`,
    xref: "chain .map{}/.filter{}/.associateBy{}/.toSet(). There's no single-expression comprehension — the collection functions are the equivalent.",
  },
  {
    title: "Tuple unpacking & multiple return",
    note: "Functions return tuples freely; you destructure on the way out. Swapping needs no temp.",
    code: `def minmax(xs): return min(xs), max(xs)
lo, hi = minmax(data)
a, b = b, a                 # swap
first, *rest = [1, 2, 3, 4] # first=1, rest=[2,3,4]`,
    xref: "return a Pair/Triple or data class and destructure with val (lo, hi) = … . No *rest spread in destructuring.",
  },
  {
    title: "Slicing & negative indexing",
    note: "A tiny grammar for sub-sequences on any list/str/tuple: [start:stop:step], with negatives counting from the end.",
    code: `xs[1:4]     # items 1,2,3
xs[-1]      # last item
xs[::-1]    # reversed copy
xs[:3], xs[3:]   # split`,
    xref: "subList(), last(), reversed(), take()/drop() — several named calls rather than one slice syntax.",
  },
  {
    title: 'EAFP — "ask forgiveness, not permission"',
    note: "Idiomatic Python tries the operation and catches failure rather than checking preconditions first (LBYL). Often clearer and race-free.",
    code: `try:
    return cache[key]
except KeyError:
    return load(key)
# vs. LBYL: if key in cache: ...`,
    xref: "the JVM habit is to guard first (if map.containsKey…). Both work in Python, but try/except is more Pythonic for the expected-path case.",
  },
  {
    title: "Truthiness of collections",
    note: "Empty containers, 0, \"\" and None are all falsy. You test a collection directly, not its size.",
    code: `if not items:          # empty list/dict/str
    return
name = user_input or "anon"`,
    xref: "no implicit truthiness — you write if (items.isEmpty()). Note: if (list) is a type error in Kotlin but valid (falsy-when-empty) in Python.",
  },
  {
    title: "*args / **kwargs & spread",
    note: "Variadic positional and keyword params, plus * / ** to spread a sequence/dict into a call.",
    code: `def log(*args, **kwargs):
    ...
log(1, 2, level="warn")

opts = {"timeout": 5}
connect(**opts)         # spread dict as kwargs`,
    xref: "vararg covers positional; the * spread exists for arrays, but there's no ** keyword-spread — named args are passed explicitly.",
  },
  {
    title: "Dunder (magic) methods",
    note: "Operator and protocol hooks. Implement __eq__, __repr__, __len__, __iter__, __add__… and your object behaves like a built-in.",
    code: `class Vec:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, o): return Vec(self.x+o.x, self.y+o.y)
    def __repr__(self): return f"Vec({self.x}, {self.y})"`,
    xref: "operator overloading via operator fun plus(), plus toString()/equals() overrides — same idea, named rather than dunder-keyed.",
  },
  {
    title: "Generators — yield",
    note: "A function that produces values lazily, one at a time, holding state between calls. Backs token streaming and large-data pipelines.",
    code: `def chunks(seq, n):
    for i in range(0, len(seq), n):
        yield seq[i:i+n]

for c in chunks(docs, 100): ...`,
    xref: "genuinely close — the sequence { yield(…) } builder and Sequence give the same lazy semantics. One of the few near-exact analogues.",
  },
  {
    title: "Context managers — with",
    note: "Deterministic setup/teardown around a block (files, locks, sessions, timers). Guaranteed cleanup even on exception.",
    code: `with open("f.txt") as f:
    data = f.read()
# f is closed here, always`,
    xref: "File(…).use { } / .bufferedReader().use { } is the direct equivalent (Java's try-with-resources). Python lets you author your own with @contextmanager.",
  },
  {
    title: "Decorators — @",
    note: "Wrap a function/class to add behaviour (caching, timing, routing, auth) without touching its body.",
    code: `from functools import lru_cache

@lru_cache
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)`,
    xref: "no direct equal. Annotations are metadata, not behaviour-wrapping; you'd use higher-order functions, delegation, or a proxy layer. Decorators are genuinely new.",
  },
  {
    title: "Chained comparisons & the walrus",
    note: "Comparisons chain mathematically; := assigns inside an expression.",
    code: `if 0 <= i < len(xs):        # reads like maths
    ...
while (line := f.readline()):   # assign + test
    process(line)`,
    xref: "chained comparisons must be split with &&; assignment isn't an expression, so there's no walrus equivalent.",
  },
  {
    title: "Duck typing & Protocols",
    note: "If it has the methods, it fits — no declared interface needed. Protocol gives structural typing checked statically, without inheritance.",
    code: `from typing import Protocol

class Reader(Protocol):
    def read(self) -> str: ...

def load(r: Reader):   # anything with read() fits
    return r.read()`,
    xref: "nominal typing — a type must declare it implements an interface. Python matches on shape, not name.",
  },
];

const JVM_ONLY: Solo[] = [
  {
    title: "Compile-time type safety",
    note: "The JVM won't run code that doesn't type-check. Python's hints are optional and checked only by a separate tool, never at runtime.",
    code: `val n: Int = "oops"   // won't compile`,
    xref: "the same mistake runs until it explodes at runtime unless you run pyright in CI. Treat the type checker as your compiler — hence pre-commit.",
  },
  {
    title: "Enforced null safety",
    note: "Kotlin's ? makes nullability a compile error to ignore. Python's | None is documentation the runtime doesn't enforce.",
    code: `val s: String = maybe()   // error if maybe() is nullable
s.length                  // safe, guaranteed non-null`,
    xref: "None.length-style bugs (AttributeError: 'NoneType') are among the most common. The checker catches many; nothing stops them at runtime.",
  },
  {
    title: "Sealed hierarchies + exhaustive when",
    note: "A sealed type + when the compiler forces you to cover completely — add a case and every match site errors until handled.",
    code: `sealed interface Shape
data class Circle(val r: Double) : Shape
data class Square(val s: Double) : Shape

val area = when (shape) {        // must be exhaustive
    is Circle -> PI * shape.r * shape.r
    is Square -> shape.s * shape.s
}`,
    xref: "match with class patterns is close, but exhaustiveness isn't compiler-enforced — a missing case falls through unless you add case _: or lean on the checker.",
  },
  {
    title: "Extension functions",
    note: "Add methods to a type you don't own, callable with dot syntax.",
    code: `fun String.shout() = uppercase() + "!"
"hello".shout()          // "HELLO!"`,
    xref: "no real equivalent. You write a plain function shout(s), or monkey-patch the class (discouraged). Dot-chaining on foreign types isn't idiomatic.",
  },
  {
    title: "Overloading by signature",
    note: "Same name, different parameter types/arity, resolved at compile time.",
    code: `fun area(r: Double) = PI * r * r
fun area(w: Double, h: Double) = w * h`,
    xref: "one function per name (last definition wins). Emulate with default args, *args, or functools.singledispatch for type-based dispatch.",
  },
  {
    title: "Structured concurrency & real parallelism",
    note: "Kotlin coroutines (suspend, scopes) run on JVM threads with true multi-core parallelism.",
    code: `suspend fun load() = coroutineScope {
    val a = async { fetchA() }
    val b = async { fetchB() }
    a.await() + b.await()
}`,
    xref: "async/await + asyncio.gather look similar and are great for I/O — but the GIL means threads give no CPU parallelism. CPU-bound work needs multiprocessing.",
  },
  {
    title: "Access modifiers",
    note: "Real private/protected/internal enforced by the compiler.",
    code: `class Account {
    private var balance = 0.0   // inaccessible outside
}`,
    xref: "convention only. A leading _name means \"internal, don't touch\"; __name triggers name-mangling but is still reachable. Nothing is truly private.",
  },
  {
    title: "Enforced immutability & constants",
    note: "val is a compile-time guarantee; const val is a true constant.",
    code: `val x = 5
x = 6                // compile error
const val MAX = 100`,
    xref: "no enforced immutability for bindings. MAX = 100 is convention; Final is a hint the checker respects but the runtime ignores. Use @dataclass(frozen=True) for immutable objects.",
  },
];

const GOTCHAS: Got[] = [
  {
    title: "Mutable default arguments",
    note: "A default like [] is created once and shared across calls — a classic bug.",
    code: `# BUG
def add(x, into=[]): into.append(x); return into
# FIX
def add(x, into=None):
    into = into if into is not None else []`,
  },
  {
    title: "Late-binding closures",
    note: "Lambdas capture the variable, not its value at creation — all three below return 2.",
    code: `fns = [lambda: i for i in range(3)]
# fix: bind per-iteration
fns = [lambda i=i: i for i in range(3)]`,
  },
  {
    title: "Indentation is syntax",
    note: "No braces — whitespace defines blocks. Mixing tabs and spaces is a real error; ruff format keeps it consistent for you.",
  },
  {
    title: "self is explicit",
    note: "Every method takes self as its first parameter, and attributes are self.x. There's no implicit this.",
  },
  {
    title: "is vs ==",
    note: "== compares value; is compares identity. Use == for equality; reserve is for None (x is None). Small-int caching makes is look right until it isn't.",
  },
  {
    title: "Integer division",
    note: "/ always yields a float; // floors. 7 / 2 == 3.5, 7 // 2 == 3. And there's no ++/-- — use i += 1.",
  },
  {
    title: "No block scope",
    note: "Variables from a for/if leak into the enclosing function. The loop variable is still bound after the loop ends.",
  },
  {
    title: "Everything is an object",
    note: "Even int — arbitrary precision, no overflow, no primitives. Functions and classes are first-class values, definable at module level with no wrapping class.",
  },
  {
    title: "Naming convention",
    note: "snake_case for functions and variables, PascalCase for classes, UPPER_CASE for constants — ruff will nudge you off camelCase.",
  },
];

function Pane({ lang, code }: { lang: "py" | "kt"; code: string }) {
  const isPy = lang === "py";
  return (
    <div className="min-w-0 bg-white dark:bg-slate-800/60">
      <div
        className={`px-4 pt-3 text-[11px] font-bold uppercase tracking-wider ${
          isPy ? "text-amber-600 dark:text-amber-400" : "text-violet-600 dark:text-violet-400"
        }`}
      >
        {isPy ? "Python" : "Kotlin / Java"}
      </div>
      <pre className="overflow-x-auto px-4 pb-4 pt-1.5">
        <code className="whitespace-pre font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-100">
          {code}
        </code>
      </pre>
    </div>
  );
}

function SharedCard({ r }: { r: Pair }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="px-4 pb-2 pt-4">
        <h3 className="font-semibold tracking-tight">{r.title}</h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{r.note}</p>
      </div>
      <div className="grid grid-cols-1 gap-px bg-slate-200 dark:bg-slate-700 md:grid-cols-2">
        <Pane lang="py" code={r.py} />
        <Pane lang="kt" code={r.kt} />
      </div>
    </div>
  );
}

function SoloCard({ r, code, other }: { r: Solo; code: "py" | "kt"; other: "Python" | "Kotlin / Java" }) {
  const otherIsPy = other === "Python";
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="px-4 pb-1 pt-4">
        <h3 className="font-semibold tracking-tight">{r.title}</h3>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{r.note}</p>
      </div>
      <Pane lang={code} code={r.code} />
      <div
        className={`border-l-4 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300 ${
          otherIsPy ? "border-amber-400" : "border-violet-400"
        }`}
      >
        <span className="font-semibold text-slate-800 dark:text-slate-100">{other}:</span> {r.xref}
      </div>
    </div>
  );
}

function Badge({ children, tone }: { children: string; tone: "blue" | "amber" | "violet" }) {
  const map = {
    blue: "bg-brand-blue/10 text-brand-blue",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  } as const;
  return (
    <span className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide ${map[tone]}`}>{children}</span>
  );
}

export default function IdiomsPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-4xl">
          <StudyBreadcrumb title="Python for a Kotlin engineer" />

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Python for a Kotlin engineer</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            A translation table, not a tutorial. Side-by-side where the two worlds agree, then the reflexes each
            language has that the other doesn&apos;t. <span className="text-amber-600 dark:text-amber-400">Python</span>{" "}
            on the left, <span className="text-violet-600 dark:text-violet-400">Kotlin / Java</span> on the right.
          </p>

          {/* Shared */}
          <div className="mt-12 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Shared idioms</h2>
            <Badge tone="blue">same idea</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The muscle memory transfers; only the syntax changes.
          </p>
          <div className="mt-5 space-y-4">
            {SHARED.map((r) => (
              <SharedCard key={r.title} r={r} />
            ))}
          </div>

          {/* Python-only */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Python-only idioms</h2>
            <Badge tone="amber">new reflexes</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Reflexes Python rewards that a JVM background won&apos;t have wired in — each with its closest Kotlin/Java
            equivalent.
          </p>
          <div className="mt-5 space-y-4">
            {PY_ONLY.map((r) => (
              <SoloCard key={r.title} r={r} code="py" other="Kotlin / Java" />
            ))}
          </div>

          {/* JVM-only */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">JVM-only idioms</h2>
            <Badge tone="violet">what you&apos;ll miss</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Guarantees and tools Python either lacks or only approximates. Knowing what&apos;s gone saves you reaching
            for it.
          </p>
          <div className="mt-5 space-y-4">
            {JVM_ONLY.map((r) => (
              <SoloCard key={r.title} r={r} code="kt" other="Python" />
            ))}
          </div>

          {/* Gotchas */}
          <div className="mt-14 flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Gotchas moving to Python</h2>
            <Badge tone="amber">watch out</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            The places your instincts are actively wrong.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {GOTCHAS.map((g) => (
              <div
                key={g.title}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/60"
              >
                <h4 className="font-semibold tracking-tight">{g.title}</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.note}</p>
                {g.code && (
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
                    <code className="whitespace-pre font-mono text-[12.5px] leading-relaxed text-slate-800 dark:text-slate-100">
                      {g.code}
                    </code>
                  </pre>
                )}
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-slate-700">
            A reference for an experienced JVM engineer picking up Python for AI-engineering work. Syntax reflects
            Python 3.12 and modern Kotlin.
          </p>
        </div>
      </Container>
    </main>
  );
}
