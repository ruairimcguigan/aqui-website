import Container from "@/app/_components/container";
import StudyBreadcrumb from "@/app/_components/study-breadcrumb";

// A reconstruction, in my own words, of the "Building with the Claude API"
// material — a practical study reference for how to actually talk to the model
// from code. Gated under /tracker. Companion to the transformer page.

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

export default function ClaudeApiPage() {
  return (
    <main className="pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <StudyBreadcrumb title="Calling the Claude API" />

          <h1 className="mt-4 text-4xl font-bold tracking-tighter md:text-5xl">Calling the Claude API</h1>
          <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
            The practical companion to the transformer page: how you actually talk to a model from code. Reconstructed
            in my own words from the &ldquo;Building with the Claude API&rdquo; material — a reference to revise from, not
            a substitute for doing the course.
          </p>

          {/* 1 */}
          <h2 className={H2}>1 · The shape of every call</h2>
          <p className={P}>
            {`Every request is the same idea: you send a list of messages, you get one message back. Each message has a role — "user" (you) or "assistant" (the model) — and some content. There's no hidden state on the server; a single call is just "here's the conversation so far, what's the next assistant message?"`}
          </p>
          <Code>{`from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from the environment

resp = client.messages.create(
    model="claude-sonnet-...",     # see "choosing a model" below
    max_tokens=1024,               # required: cap on the reply length
    messages=[
        {"role": "user", "content": "Explain RAG in one sentence."},
    ],
)

print(resp.content[0].text)`}</Code>
          <p className={P}>
            {`resp.content is a list of "content blocks" (usually one text block for simple calls) — that's why it's resp.content[0].text, not just resp.text. That shape matters later when a reply contains a tool call instead of text.`}
          </p>

          {/* 2 */}
          <h2 className={H2}>2 · The system prompt</h2>
          <p className={P}>
            {`The system prompt sets the model's role, rules and tone. It's not a message in the list — it's a separate top-level parameter, which keeps "who the model is" cleanly apart from "what the user said".`}
          </p>
          <Code>{`resp = client.messages.create(
    model="claude-sonnet-...",
    max_tokens=1024,
    system="You are a terse senior engineer. Answer only from the context you're given.",
    messages=[{"role": "user", "content": "What's a vector database?"}],
)`}</Code>

          {/* 3 */}
          <h2 className={H2}>3 · Multi-turn conversations</h2>
          <p className={P}>
            <strong className={STRONG}>The API is stateless — it remembers nothing between calls.</strong>{" "}
            {`To have a back-and-forth, you resend the whole conversation each time: append the model's last reply and the new user turn to the messages list, and call again. "Memory" in a chatbot is just you keeping and replaying that list.`}
          </p>
          <Code>{`messages = [{"role": "user", "content": "My name is Ruairi."}]
r1 = client.messages.create(model=M, max_tokens=512, messages=messages)

messages.append({"role": "assistant", "content": r1.content[0].text})
messages.append({"role": "user", "content": "What's my name?"})
r2 = client.messages.create(model=M, max_tokens=512, messages=messages)
# r2 can answer "Ruairi" only because the history was resent`}</Code>
          <p className={P}>
            {`This is also why long conversations cost more and eventually hit the context window — every turn resends everything before it. Managing that history (trimming, summarising) is a real engineering task later.`}
          </p>

          {/* 4 */}
          <h2 className={H2}>4 · The parameters that matter</h2>
          <p className={P}>The handful you'll actually reach for:</p>
          <Code>{`model          which model to use (capability vs speed vs cost — see §5)
max_tokens     REQUIRED. hard cap on the reply's length (in tokens)
temperature    0 = safe/deterministic, higher = more varied  (see the transformer page)
stop_sequences strings that, if generated, stop the reply early
system         the system prompt (§2)
stream         stream the reply as it's generated (§6)`}</Code>
          <p className={P}>
            {`max_tokens catches people out: it's required, and it limits the OUTPUT, not the input. Set it too low and the reply gets cut off mid-sentence. temperature is the "boldness dial" from the transformer page — keep it low (0–0.3) for anything factual, structured, or tested.`}
          </p>

          {/* 5 */}
          <h2 className={H2}>5 · Choosing a model</h2>
          <p className={P}>
            {`Anthropic's models come in tiers, and the names carry a family (Opus, Sonnet, Haiku) plus a version. The concept is stable even as the exact IDs change:`}
          </p>
          <Code>{`Opus     most capable — hardest reasoning / agentic work, priciest & slowest
Sonnet   the balanced default — strong, fast enough, sensible cost
Haiku    fastest & cheapest — high-volume, latency-sensitive, simpler tasks`}</Code>
          <p className={P}>
            {`Pick the cheapest tier that clears the task's bar, and don't hard-code an ID you'll forget to update — model IDs get versioned and deprecated. Check the live models page for the current exact strings and pricing:`}
          </p>
          <p className={P}>
            <a
              href="https://platform.claude.com/docs/en/about-claude/models/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-blue hover:underline"
            >
              platform.claude.com → Models overview ↗
            </a>
          </p>

          {/* 6 */}
          <h2 className={H2}>6 · Streaming</h2>
          <p className={P}>
            {`By default you wait for the whole reply, then get it in one lump. Streaming gives you the text as it's generated, token by token — that's how a chat UI shows words appearing live instead of a long spinner. Same request, you just consume a stream.`}
          </p>
          <Code>{`with client.messages.stream(
    model=M, max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about Kotlin."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)`}</Code>
          <p className={P}>
            {`In a real app the backend consumes this stream and forwards it to the browser (server-sent events), so the key still never leaves the server.`}
          </p>

          {/* 7 */}
          <h2 className={H2}>7 · Getting reliable JSON (structured output)</h2>
          <p className={P}>
            {`Often you don't want prose — you want data your code can parse. Left alone a model might wrap JSON in chatty text or markdown fences, which breaks json.loads. There are two reliable ways to force clean, schema-shaped output:`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Tool use (works everywhere).</strong>{" "}
            {`Define a "tool" whose input schema is the shape you want, and the model fills it in as structured data (more in §8). A long-standing trick even when you don't have a real tool to run.`}
          </p>
          <p className={P}>
            <strong className={STRONG}>Structured outputs / schema mode.</strong>{" "}
            {`Newer models let you hand the API a JSON schema directly and get a guaranteed-valid object back. Cleanest option when available — check the docs for the current parameter and model support.`}
          </p>
          <Code>{`# the shape you want back
schema = {
    "type": "object",
    "properties": {
        "answer": {"type": "string"},
        "found_in_document": {"type": "boolean"},
        "quote": {"type": "string"},
    },
    "required": ["answer", "found_in_document"],
}
# hand this to the API (tool input_schema, or a structured-output param)
# → you get an object matching it, not free-form prose`}</Code>
          <p className={P}>
            {`This is exactly the rung you add to ask.py in Week 6 — it's what later lets your RAG app return an answer plus a citation and an "I don't know" flag.`}
          </p>

          {/* 8 */}
          <h2 className={H2}>8 · Tool use (function calling)</h2>
          <p className={P}>
            {`This is the big one — it's the foundation of agents. You describe tools the model is allowed to use; the model can't run them, but it can ask you to. The loop:`}
          </p>
          <Code>{`1. You send the request WITH a list of tools (name, description, input_schema).
2. If the model wants one, it replies with stop_reason = "tool_use" and a
   tool_use block: the tool name + the arguments it chose (as JSON).
3. YOUR code runs that tool (call the weather API, query the DB, whatever).
4. You send the result back as a "tool_result" block, referencing the call's id.
5. The model uses the result to write its final answer — or asks for another tool.`}</Code>
          <p className={P}>
            {`The model never touches your systems directly — it only ever asks. You stay in control of what actually runs, which is the whole security model of tools and agents. Repeat that loop and you have an agent: perceive (results) → reason (model) → act (tool), over and over.`}
          </p>

          {/* 9 */}
          <h2 className={H2}>9 · Images and other inputs</h2>
          <p className={P}>
            {`Content isn't limited to text. A single user message can carry multiple content blocks — text plus one or more images (as base64 or a URL), and PDFs on supported models. Same call shape; the content list just holds more than one block. Useful for "describe this screenshot" or "extract the fields from this receipt".`}
          </p>

          {/* 10 */}
          <h2 className={H2}>10 · Prompt caching</h2>
          <p className={P}>
            {`If you send the same large, stable chunk of context on every call — a long system prompt, a big document, a tool catalogue — you can mark it as cached. The model reuses the pre-processed version instead of re-reading it each time, which cuts both cost and latency for that portion substantially. You flag the block with a cache_control marker; the first call warms the cache, later calls hit it.`}
          </p>
          <p className={P}>
            {`Worth knowing it exists now; you'll reach for it once your prompts grow big and repetitive.`}
          </p>

          {/* 11 */}
          <h2 className={H2}>11 · Tokens, cost and usage</h2>
          <p className={P}>
            {`Every response reports how many tokens went in and came out — and since you're billed per token (input and output priced separately), that's how you reason about cost. Log it from call one; it's the habit that keeps a project's spend from surprising you.`}
          </p>
          <Code>{`resp = client.messages.create(...)
print(resp.usage.input_tokens, resp.usage.output_tokens)
# rough cost = input_tokens * in_rate + output_tokens * out_rate`}</Code>

          {/* 12 */}
          <h2 className={H2}>12 · Errors, retries and rate limits</h2>
          <p className={P}>
            {`Calls can fail — a 429 when you exceed your rate limit, a 529 when the API is briefly overloaded, timeouts, the occasional 500. The SDK retries transient failures with sensible backoff for you and raises typed exceptions you can catch (e.g. RateLimitError, APIStatusError). In production you add your own handling on top: back off on 429, surface a friendly message, and never let a model failure take down the whole request.`}
          </p>

          {/* 13 — the rule */}
          <div className="mt-8 rounded-xl border border-brand-blue/30 bg-brand-blue/5 p-4 dark:border-brand-blue/40 dark:bg-blue-400/10">
            <p className="text-sm font-semibold text-brand-blue dark:text-blue-300">
              The rule that wraps all of the above
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {`Every one of these calls runs on a server you control, never from a browser or mobile app — the API key is a bearer secret, and anything client-side is readable by the user. Client → your backend → Anthropic. See the backend-proxy note in the ai-engineering repo for the full reasoning and the hardened production version.`}
            </p>
          </div>

          {/* Collapsible: fuller shapes */}
          <details className="group mt-10 rounded-xl border border-slate-200 bg-white p-0 dark:border-slate-700 dark:bg-slate-800/60">
            <summary className="cursor-pointer list-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">
              <span className="text-brand-blue">▸</span> Go deeper: request / response shapes
              <span className="ml-2 font-normal text-slate-400">(the actual JSON under the SDK)</span>
            </summary>
            <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">A full request body</h3>
              <Code>{`POST /v1/messages
{
  "model": "claude-sonnet-...",
  "max_tokens": 1024,
  "system": "You are a terse senior engineer.",
  "temperature": 0.2,
  "messages": [
    { "role": "user", "content": "What's a vector database?" }
  ]
}`}</Code>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">A normal response</h3>
              <Code>{`{
  "id": "msg_01...",
  "role": "assistant",
  "stop_reason": "end_turn",
  "content": [
    { "type": "text", "text": "A database that stores vectors and..." }
  ],
  "usage": { "input_tokens": 18, "output_tokens": 42 }
}`}</Code>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">A tool-use round-trip</h3>
              <Code>{`# 1. request carries the tool definitions
"tools": [
  { "name": "get_weather",
    "description": "Current weather for a city",
    "input_schema": { "type": "object",
      "properties": { "city": { "type": "string" } },
      "required": ["city"] } }
]

# 2. model asks to call it
"stop_reason": "tool_use",
"content": [
  { "type": "tool_use", "id": "toolu_01...",
    "name": "get_weather", "input": { "city": "Belfast" } }
]

# 3. you run get_weather("Belfast"), then send the result back
{ "role": "user", "content": [
    { "type": "tool_result", "tool_use_id": "toolu_01...",
      "content": "12°C, raining" } ] }

# 4. model now writes its final text answer using that result`}</Code>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Streaming events</h3>
              <Code>{`message_start
content_block_start
content_block_delta   ← the text arrives in these, repeatedly
content_block_stop
message_delta          ← carries stop_reason + final usage
message_stop`}</Code>
              <p className={P}>
                {`The SDK's stream helper hides these behind stream.text_stream, but this is what's on the wire — useful when you're forwarding the stream through your own backend.`}
              </p>

              <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">Prompt caching marker</h3>
              <Code>{`"system": [
  { "type": "text", "text": "<a very long, stable instruction block>",
    "cache_control": { "type": "ephemeral" } }
]
# first call writes the cache; subsequent calls read it → cheaper + faster`}</Code>

              <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                {`Exact field names, headers and model IDs move over time — treat these as the shapes to recognise, and check platform.claude.com for the current specifics before you rely on any one detail.`}
              </p>
            </div>
          </details>

          <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-400 dark:border-slate-700">
            Your Weeks 4–6 build reference. Pairs with the Anthropic Academy course linked on those weeks — this is the
            map; the course is the hands-on.
          </p>
        </div>
      </Container>
    </main>
  );
}
