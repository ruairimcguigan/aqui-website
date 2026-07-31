// Multi-track roadmap library + personalization.
// Tracks are loosely based on the durable pivot paths from the career research:
// AI/ML engineering, security engineering, senior/staff & leadership, and
// specialized data science. The AI-engineering track reuses the detailed plan
// in plan.ts; the others are phased curricula authored here.

import { PLAN, type PlanWeek } from "./plan";

export type TrackWeek = Omit<PlanWeek, "start">;
export type TrackId = "ai-engineering" | "security" | "leadership" | "data-science";

export interface Track {
  id: TrackId;
  name: string;
  blurb: string;
  pythonWeek?: number; // 1-indexed week that can be skipped if already fluent
  weeks: TrackWeek[];
}

// ---- AI / ML Engineering (reuse the detailed 31-week plan) ----
const AI_WEEKS: TrackWeek[] = PLAN.map(({ start: _start, ...rest }) => rest);

// ---- Security Engineering ----
const SECURITY_WEEKS: TrackWeek[] = [
  { week: 1, phase: "Foundations", focus: "Security fundamentals", tasks: "Core concepts: the CIA triad, risk, threat modelling, and the security mindset. Work through Security+ (SY0-701) domains 1–2 as your backbone.", targetHrs: 10 },
  { week: 2, phase: "Foundations", focus: "Threats & cryptography", tasks: "Attack types, malware, social engineering, and applied cryptography (hashing, symmetric/asymmetric, TLS, PKI) — enough to reason about them, not implement them.", targetHrs: 10 },
  { week: 3, phase: "Foundations", focus: "Networking & scripting", tasks: "Refresh networking for security (TCP/IP, DNS, HTTP, firewalls) and get comfortable scripting recon/automation in Python or Bash.", targetHrs: 10 },
  { week: 4, phase: "Application Security", focus: "OWASP Top 10", tasks: "Work through the OWASP Top 10 hands-on with OWASP Juice Shop or WebGoat. Your engineering background makes this the fastest on-ramp into security.", milestone: "OWASP Top 10 exploited & understood", targetHrs: 10 },
  { week: 5, phase: "Application Security", focus: "Injection & auth flaws", tasks: "Deep-dive SQL/command injection, broken authentication, and session management. Break them, then fix them in a real codebase.", targetHrs: 10 },
  { week: 6, phase: "Application Security", focus: "XSS, CSRF, SSRF", tasks: "Client-side and request-forgery classes of bug: how they work, how to detect, and how to remediate. Map each to code you've written before.", targetHrs: 10 },
  { week: 7, phase: "Application Security", focus: "Secure SDLC & SAST/DAST", tasks: "Threat modelling, secure code review, and wiring SAST/DAST/dependency scanning into a CI pipeline.", milestone: "Threat model + secured a vulnerable app", targetHrs: 10 },
  { week: 8, phase: "Application Security", focus: "AppSec project", tasks: "Take an intentionally vulnerable app, write a threat model, find the bugs, and ship fixes with a short write-up. This is portfolio gold.", milestone: "🎯 AppSec case study (on GitHub)", targetHrs: 10 },
  { week: 9, phase: "Application Security", focus: "Buffer & consolidate", tasks: "Catch up, polish the case study, and shore up any weak areas from the AppSec phase.", targetHrs: 10 },
  { week: 10, phase: "Offensive Basics", focus: "Recon & web pentesting", tasks: "Learn practical web pentesting with Burp Suite: recon, mapping, and testing methodology. Start TryHackMe / HackTheBox paths.", targetHrs: 10 },
  { week: 11, phase: "Offensive Basics", focus: "Hands-on labs", tasks: "Grind guided labs and easy boxes. Aim for a steady cadence — the reps build real intuition.", milestone: "First 10 boxes / rooms completed", targetHrs: 10 },
  { week: 12, phase: "Offensive Basics", focus: "Bug bounty basics", tasks: "Learn responsible disclosure and try a bug-bounty platform (HackerOne/Bugcrowd). Even a low-severity valid finding is a strong signal.", targetHrs: 10 },
  { week: 13, phase: "Offensive Basics", focus: "Buffer & write-ups", tasks: "Write up 2–3 boxes or findings clearly — communication is half of security work. Buffer week.", targetHrs: 10 },
  { week: 14, phase: "Cloud & Infra Security", focus: "Cloud security foundations", tasks: "IAM, least privilege, network security groups, and the shared-responsibility model on AWS (or Azure). This is where most modern breaches actually happen.", targetHrs: 10 },
  { week: 15, phase: "Cloud & Infra Security", focus: "Secrets & data protection", tasks: "Secrets management, KMS/encryption, secure storage, and data-protection patterns in cloud environments.", targetHrs: 10 },
  { week: 16, phase: "Cloud & Infra Security", focus: "Container & IaC security", tasks: "Container and Kubernetes security basics, plus scanning infrastructure-as-code (Terraform) for misconfigurations.", milestone: "Secured a cloud deployment end-to-end", targetHrs: 10 },
  { week: 17, phase: "Cloud & Infra Security", focus: "Cloud security project", tasks: "Harden a deliberately-misconfigured cloud environment and document what you changed and why.", milestone: "🎯 Cloud hardening case study", targetHrs: 10 },
  { week: 18, phase: "Cloud & Infra Security", focus: "Buffer & polish", tasks: "Polish the cloud project and consolidate. Buffer week.", targetHrs: 10 },
  { week: 19, phase: "Detection & Response", focus: "Logging & SIEM", tasks: "Detection engineering basics: logging, SIEM concepts, and how defenders spot the attacks you've been practising.", targetHrs: 10 },
  { week: 20, phase: "Detection & Response", focus: "Incident response", tasks: "The IR lifecycle, playbooks, and tabletop thinking. Understand how real incidents are handled end-to-end.", targetHrs: 10 },
  { week: 21, phase: "Launch", focus: "Certify & portfolio", tasks: "Sit Security+ (or a cloud-security cert), or start OSCP prep. Finalise your two security case studies with strong write-ups.", milestone: "Cert booked/passed; portfolio ready", targetHrs: 10 },
  { week: 22, phase: "Launch", focus: "Go to market", tasks: "Reframe CV/LinkedIn as 'Engineer → Security Engineer', volunteer for security work at your current job, and start applying to AppSec/cloud-security roles.", milestone: "Applications out", targetHrs: 10 },
];

// ---- Senior / Staff Engineering & Leadership ----
const LEADERSHIP_WEEKS: TrackWeek[] = [
  { week: 1, phase: "Technical Depth", focus: "System design mastery", tasks: "Level up system design deliberately: scalability, data stores, caching, queues, consistency. Work through a system-design course/book and design one system a week out loud.", targetHrs: 10 },
  { week: 2, phase: "Technical Depth", focus: "Architecture patterns", tasks: "Distributed-systems patterns, trade-off reasoning, and reading real architecture write-ups. Build the vocabulary staff engineers use.", targetHrs: 10 },
  { week: 3, phase: "Technical Depth", focus: "Design docs & RFCs", tasks: "Learn to write crisp design docs and RFCs. Write one for a real problem at your company and circulate it.", milestone: "🎯 A design doc others acted on", targetHrs: 10 },
  { week: 4, phase: "Technical Depth", focus: "Staff archetypes", tasks: "Study the staff-engineer archetypes (tech lead, architect, solver, right-hand). Identify which fits you and the scope gap to close.", targetHrs: 10 },
  { week: 5, phase: "Technical Depth", focus: "Driving technical direction", tasks: "Practice setting technical direction: leading a design review, aligning a team on an approach, and de-risking a big change.", targetHrs: 10 },
  { week: 6, phase: "Influence & Communication", focus: "Technical writing", tasks: "Sharpen written communication — the highest-leverage senior skill. Publish an internal or external technical post.", targetHrs: 10 },
  { week: 7, phase: "Influence & Communication", focus: "Cross-team influence", tasks: "Influence without authority: stakeholder mapping, building consensus, and navigating disagreement. Apply it to a real initiative.", targetHrs: 10 },
  { week: 8, phase: "Influence & Communication", focus: "Mentoring", tasks: "Start mentoring a junior deliberately. Multiplying others is the core of staff/lead impact.", milestone: "Actively mentoring someone", targetHrs: 10 },
  { week: 9, phase: "Influence & Communication", focus: "Buffer & reflect", tasks: "Consolidate, gather feedback on your influence and communication, and adjust. Buffer week.", targetHrs: 10 },
  { week: 10, phase: "The Management Path", focus: "Management fundamentals", tasks: "Read 'The Manager's Path'. Understand the real job of a manager and honestly test whether you want it.", targetHrs: 10 },
  { week: 11, phase: "The Management Path", focus: "1:1s & feedback", tasks: "Learn to run effective 1:1s and give direct, kind feedback. Practise with your mentee and peers.", targetHrs: 10 },
  { week: 12, phase: "The Management Path", focus: "Delivery & process", tasks: "Team delivery: planning, estimation, unblocking, and lightweight process that helps rather than hinders.", targetHrs: 10 },
  { week: 13, phase: "The Management Path", focus: "Hiring & performance", tasks: "Interviewing, building a team, and the basics of performance management and growth conversations.", targetHrs: 10 },
  { week: 14, phase: "The Management Path", focus: "Leadership project", tasks: "Lead a real cross-functional effort end-to-end — the artefact you'll talk about in interviews.", milestone: "🎯 Led a delivery others depended on", targetHrs: 10 },
  { week: 15, phase: "AI Fluency Overlay", focus: "AI literacy for leaders", tasks: "Get genuinely conversant in modern AI/LLMs — enough to lead AI-adjacent teams and make good build/buy calls. Do a couple of hands-on LLM exercises.", targetHrs: 10 },
  { week: 16, phase: "AI Fluency Overlay", focus: "AI strategy", tasks: "How AI reshapes engineering orgs, where it adds value, and how to evaluate AI initiatives critically rather than by hype.", targetHrs: 10 },
  { week: 17, phase: "Launch", focus: "Interview prep", tasks: "Prep for the two interview tracks you'll face: system design and leadership/behavioural (STAR stories from your real work).", milestone: "Interview stories & system-design ready", targetHrs: 10 },
  { week: 18, phase: "Launch", focus: "Go to market", tasks: "Position for staff-IC or engineering-manager roles, update CV/LinkedIn around scope and impact, and start applying.", milestone: "Applications out", targetHrs: 10 },
];

// ---- Specialized Data Science ----
const DATA_WEEKS: TrackWeek[] = [
  { week: 1, phase: "Data Foundations", focus: "Python & data stack", tasks: "Python for data plus numpy and pandas. Coming from engineering, focus on idioms and the data-wrangling workflow.", targetHrs: 10 },
  { week: 2, phase: "Data Foundations", focus: "SQL & data wrangling", tasks: "Strong SQL (joins, window functions, aggregation) and cleaning messy real-world data. This is 60% of the actual job.", targetHrs: 10 },
  { week: 3, phase: "Data Foundations", focus: "EDA & visualization", tasks: "Exploratory data analysis and clear visualization (matplotlib/seaborn). Practise telling a story from a dataset.", milestone: "🎯 An EDA notebook worth showing", targetHrs: 10 },
  { week: 4, phase: "Stats & ML", focus: "Statistics", tasks: "Applied statistics and probability: distributions, hypothesis testing, confidence intervals — the reasoning behind the models.", targetHrs: 10 },
  { week: 5, phase: "Stats & ML", focus: "Core ML: regression", tasks: "Linear/logistic regression with scikit-learn; the full train/validate/interpret loop.", targetHrs: 10 },
  { week: 6, phase: "Stats & ML", focus: "Trees & ensembles", tasks: "Decision trees, random forests, and gradient boosting (XGBoost/LightGBM) — the workhorses of tabular ML.", targetHrs: 10 },
  { week: 7, phase: "Stats & ML", focus: "Model evaluation", tasks: "Metrics, cross-validation, over/underfitting, and honest evaluation. Where most beginners go wrong.", targetHrs: 10 },
  { week: 8, phase: "Stats & ML", focus: "ML project", tasks: "End-to-end supervised-learning project on a real dataset, with a clean write-up of your approach and results.", milestone: "🎯 ML project (on GitHub)", targetHrs: 10 },
  { week: 9, phase: "Stats & ML", focus: "Buffer & polish", tasks: "Polish the ML project and consolidate. Buffer week.", targetHrs: 10 },
  { week: 10, phase: "Modern & Deep Learning", focus: "Neural nets & PyTorch", tasks: "Neural network fundamentals and PyTorch basics — enough to build and train a simple model yourself.", targetHrs: 10 },
  { week: 11, phase: "Modern & Deep Learning", focus: "Embeddings & NLP", tasks: "Embeddings, text representations, and modern NLP — the bridge between classic DS and LLM-era work.", targetHrs: 10 },
  { week: 12, phase: "Modern & Deep Learning", focus: "LLMs for data science", tasks: "Using LLMs as a data-science tool: extraction, classification, and augmentation. This is where DS is heading.", targetHrs: 10 },
  { week: 13, phase: "Modern & Deep Learning", focus: "Feature engineering", tasks: "Advanced feature engineering and the craft that separates strong models from mediocre ones.", targetHrs: 10 },
  { week: 14, phase: "Specialization", focus: "Pick a domain", tasks: "Choose a domain to specialise in (fraud, health, fintech, climate). Generic DS is exposed; domain depth is the moat.", targetHrs: 10 },
  { week: 15, phase: "Specialization", focus: "Causal inference", tasks: "Causal reasoning and experimentation (A/B testing) — the interpretation-heavy work that's hardest to automate.", targetHrs: 10 },
  { week: 16, phase: "Specialization", focus: "Domain project", tasks: "A domain-specific project that shows judgement, not just modelling — the resilient part of the field.", milestone: "🎯 Domain-specialised project", targetHrs: 10 },
  { week: 17, phase: "Specialization", focus: "Buffer & polish", tasks: "Polish the domain project and consolidate. Buffer week.", targetHrs: 10 },
  { week: 18, phase: "Production & MLOps", focus: "Deploy a model", tasks: "Package and deploy a model behind an API; understand serving basics. Your engineering background is a big edge here.", milestone: "🎯 Deployed model with an API", targetHrs: 10 },
  { week: 19, phase: "Production & MLOps", focus: "Monitoring & eval", tasks: "Model monitoring, drift, and evaluation in production. Closing the loop is what makes DS trustworthy.", targetHrs: 10 },
  { week: 20, phase: "Production & MLOps", focus: "Reproducibility", tasks: "Experiment tracking, pipelines, and reproducibility — the practices that make you hireable over a notebook hacker.", targetHrs: 10 },
  { week: 21, phase: "Launch", focus: "Portfolio & Kaggle", tasks: "Finalise 2–3 projects, optionally a Kaggle entry, and write them up clearly with your reasoning and results.", milestone: "Portfolio ready", targetHrs: 10 },
  { week: 22, phase: "Launch", focus: "Go to market", tasks: "Reframe CV/LinkedIn around your specialisation, and start applying to data-science roles in your chosen domain.", milestone: "Applications out", targetHrs: 10 },
];

export const TRACKS: Track[] = [
  { id: "ai-engineering", name: "AI / ML Engineering", blurb: "Build on foundation models — RAG, agents, MCP, production LLM systems. The shortest, highest-momentum leap from software engineering.", pythonWeek: 3, weeks: AI_WEEKS },
  { id: "security", name: "Security Engineering", blurb: "The most AI-resilient tech path — AppSec, cloud security, and beyond. Adversarial and accountability-bearing work AI can't own.", weeks: SECURITY_WEEKS },
  { id: "leadership", name: "Senior / Staff & Leadership", blurb: "Move up the stack into staff-IC or engineering management. Judgment, influence, and accountability — the most augment-resistant work.", weeks: LEADERSHIP_WEEKS },
  { id: "data-science", name: "Specialized Data Science", blurb: "Durable only when specialised: ML depth plus a domain and interpretation-heavy work, not generic reporting.", pythonWeek: 1, weeks: DATA_WEEKS },
];

export function getTrack(id: TrackId): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}

export interface OnboardingConfig {
  track: TrackId;
  years: string;
  hours: number;
  pythonFluent: boolean;
  goal: string;
  startISO: string; // yyyy-mm-dd
  createdAt: number;
}

const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmt(d: Date): string {
  return `${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// Turn a saved config into a dated, renumbered PlanWeek[] the tracker renders.
export function generatePlan(config: OnboardingConfig): PlanWeek[] {
  const track = getTrack(config.track);
  let weeks = track.weeks;
  if (config.pythonFluent && track.pythonWeek) {
    weeks = weeks.filter((w) => w.week !== track.pythonWeek);
  }
  const baseMs = new Date(config.startISO + "T00:00:00Z").getTime();
  return weeks.map((w, i) => ({
    ...w,
    week: i + 1,
    start: fmt(new Date(baseMs + i * 7 * 86400000)),
  }));
}

export function estimateMonths(config: OnboardingConfig): number {
  const track = getTrack(config.track);
  let n = track.weeks.length;
  if (config.pythonFluent && track.pythonWeek) n -= 1;
  return Math.max(1, Math.round((n * 10) / config.hours / 4.3));
}
