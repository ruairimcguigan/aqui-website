// Single source of truth for the tracker's study / reference pages.
// Add a new page's entry here and it appears in the /tracker/reference hub
// automatically. Order is roughly the order you meet them in the plan.

export interface Reference {
  slug: string; // lives at /tracker/<slug>
  title: string;
  blurb: string;
  tag: string; // short context chip, e.g. a week or theme
}

export const REFERENCES: Reference[] = [
  {
    slug: "idioms",
    title: "Python for a Kotlin engineer",
    blurb: "A side-by-side idioms cheat sheet for crossing from Kotlin/Swift into Python — reflexes, not syntax.",
    tag: "Wk 3",
  },
  {
    slug: "transformer",
    title: "How a Transformer works",
    blurb: "Plain-English walkthrough — tokens, attention, decoding, training — with the real maths in a collapsible section.",
    tag: "Wk 4–5",
  },
  {
    slug: "claude-api",
    title: "Calling the Claude API",
    blurb: "How you actually talk to the model from code: messages, system prompts, parameters, streaming, tools and structured output.",
    tag: "Wk 4–6",
  },
  {
    slug: "coverage",
    title: "Concept coverage checklist",
    blurb: "The map of every concept the plan covers, so a build-first path never hides an unknown-unknown.",
    tag: "the map",
  },
  {
    slug: "kmp-ui-automator",
    title: "kmp-ui-automator",
    blurb: "Build plan for your headline MCP server — driving Android and iOS from one agent and reporting UI divergence.",
    tag: "MCP · Wk 17",
  },
];

export function referenceBySlug(slug: string): Reference | undefined {
  return REFERENCES.find((r) => r.slug === slug);
}
