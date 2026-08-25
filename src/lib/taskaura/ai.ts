import type { Category, Solution, SolutionStep, SubTask } from "./types";

let counter = 0;
export function uid(prefix = "id") {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

const BREAKDOWN_TEMPLATES: Record<Category, string[][]> = {
  Work: [
    [
      "Clarify the exact deliverable and success criteria",
      "Collect the source material, data and references",
      "Draft a rough structure or outline first",
      "Write / build the full version in one focused block",
      "Review, polish and share with stakeholders",
    ],
  ],
  Finance: [
    [
      "Gather every relevant statement, invoice or receipt",
      "Reconcile the numbers against your records",
      "Flag anything unusual or missing for follow-up",
      "Complete the payment or filing",
      "File the confirmation and set the next reminder",
    ],
  ],
  Personal: [
    [
      "Decide the exact outcome you want from this",
      "Block a realistic slot in your calendar",
      "Prepare whatever you need beforehand",
      "Do it without multitasking",
      "Note how it went so next time is easier",
    ],
  ],
  "Daily Problem": [
    [
      "Reproduce the problem and note exactly when it happens",
      "Try the quickest known fix first",
      "Isolate the cause by ruling out one variable at a time",
      "Apply the real fix and verify it holds",
      "Write down the fix so future-you doesn't re-solve it",
    ],
  ],
};

const KEYWORD_BREAKDOWNS: { match: RegExp; steps: string[] }[] = [
  {
    match: /report|document|write|essay|blog/i,
    steps: [
      "Define the audience and the single key message",
      "Outline the sections with one bullet each",
      "Write a fast first draft without editing",
      "Add data, charts and supporting evidence",
      "Proofread, format and send for review",
    ],
  },
  {
    match: /presentation|deck|pitch|slides/i,
    steps: [
      "Write the one-sentence takeaway of the talk",
      "Storyboard 5–8 slides on paper first",
      "Build the slides with one idea per slide",
      "Rehearse out loud with a timer",
      "Prepare answers for the three likely questions",
    ],
  },
  {
    match: /meeting|sync|call|standup/i,
    steps: [
      "Set the agenda and share it in advance",
      "Prepare your updates and blockers",
      "Run the meeting against the agenda",
      "Capture decisions and owners",
      "Send the follow-up summary same day",
    ],
  },
  {
    match: /design|redesign|ui|landing/i,
    steps: [
      "Collect references and lock a visual direction",
      "Sketch low-fidelity layout options",
      "Build the high-fidelity version with your design tokens",
      "Check responsive and accessibility states",
      "Hand off with specs and assets",
    ],
  },
];

export function generateSubtasks(title: string, category: Category): SubTask[] {
  const keyword = KEYWORD_BREAKDOWNS.find((k) => k.match.test(title));
  const pool = keyword ? keyword.steps : BREAKDOWN_TEMPLATES[category][0];
  const count = Math.min(pool.length, 3 + (title.length % 3));
  return pool.slice(0, count).map((step) => ({ id: uid("sub"), title: step, done: false }));
}

interface SolutionRecipe {
  match: RegExp;
  summary: string;
  steps: SolutionStep[];
}

const SOLUTION_RECIPES: SolutionRecipe[] = [
  {
    match: /wifi|wi-fi|internet|router|network/i,
    summary: "Most home connectivity drops are fixed within the first three checks.",
    steps: [
      { title: "Power-cycle the hardware", detail: "Unplug the router and modem for 60 seconds, then power the modem first and wait for a solid link light." },
      { title: "Confirm where it breaks", detail: "Test another device on the same network. If only one device fails, the issue is that device, not the line." },
      { title: "Refresh the connection", detail: "Forget the network and rejoin it, then flush DNS (ipconfig /flushdns on Windows, sudo dscacheutil -flushcache on macOS)." },
      { title: "Reduce interference", detail: "Switch to the 5 GHz band or a less crowded channel in the router admin panel." },
      { title: "Escalate with evidence", detail: "If the modem shows no sync, run a speed test, screenshot it and contact your ISP with timestamps." },
    ],
  },
  {
    match: /presentation|present|speak|pitch|talk/i,
    summary: "A strong presentation is 20% slides and 80% rehearsed structure.",
    steps: [
      { title: "Name the one takeaway", detail: "Write the single sentence your audience should repeat afterwards. Everything else supports it." },
      { title: "Structure before design", detail: "Use context → problem → insight → recommendation → ask. One idea per slide, headline states the point." },
      { title: "Rehearse out loud, timed", detail: "Three full run-throughs with a timer. Cut anything that makes you rush." },
      { title: "Prepare the hard questions", detail: "List the three questions you hope nobody asks and write crisp answers with backup slides." },
      { title: "Set the room up early", detail: "Test display, audio and clicker 15 minutes before. Keep a PDF backup offline." },
    ],
  },
  {
    match: /slow|laptop|computer|pc|performance|lag/i,
    summary: "Reclaim speed by finding the resource that's actually saturated.",
    steps: [
      { title: "Find the bottleneck", detail: "Open Task Manager / Activity Monitor and sort by CPU, then memory, then disk. Note the top offender." },
      { title: "Trim startup load", detail: "Disable non-essential startup apps and close the background sync tools you don't need right now." },
      { title: "Free storage", detail: "Keep at least 15% of the drive free — clear caches, downloads and old system snapshots." },
      { title: "Update and restart", detail: "Install pending OS and driver updates, then do a full restart rather than a lid-close sleep." },
    ],
  },
  {
    match: /sleep|tired|energy|focus|procrastin/i,
    summary: "Fix the inputs first; motivation follows the routine, not the other way round.",
    steps: [
      { title: "Fix the wake time", detail: "Keep one constant wake time for a week, including weekends. Light exposure within 30 minutes of waking." },
      { title: "Protect the last hour", detail: "No screens, no work messages and dim lighting for the 60 minutes before bed." },
      { title: "Front-load the hard task", detail: "Do the single most important task in your first working block, before email." },
      { title: "Use a 25-minute contract", detail: "Commit to 25 focused minutes with the phone in another room; stopping after is allowed." },
    ],
  },
  {
    match: /money|budget|save|expense|debt/i,
    summary: "Get visibility first, then automate the decisions.",
    steps: [
      { title: "Map the last 60 days", detail: "Export transactions and group them into fixed, variable and impulse spending." },
      { title: "Set the three buckets", detail: "Assign percentages for essentials, savings and free spending, then check reality against them." },
      { title: "Automate on payday", detail: "Standing instruction moves savings out the day salary lands, before spending starts." },
      { title: "Review monthly, not daily", detail: "One 20-minute review per month beats obsessive daily checking." },
    ],
  },
];

const GENERIC_STEPS: SolutionStep[] = [
  { title: "Define the problem precisely", detail: "Write what is happening, what you expected instead, and when it started. Vague problems stay unsolved." },
  { title: "List the likely causes", detail: "Note two or three plausible explanations, ordered by how cheap they are to test." },
  { title: "Test the cheapest cause first", detail: "Change one thing at a time so you know which change mattered." },
  { title: "Apply and verify the fix", detail: "Confirm the original symptom is gone under the same conditions that caused it." },
  { title: "Write down what worked", detail: "A two-line note now saves the same hour of debugging later." },
];

export function solveProblem(query: string): Solution {
  const recipe = SOLUTION_RECIPES.find((r) => r.match.test(query));
  return {
    id: uid("sol"),
    query: query.trim(),
    summary: recipe?.summary ?? "A general problem-solving path that works for most day-to-day blockers.",
    steps: recipe?.steps ?? GENERIC_STEPS,
    createdAt: new Date().toISOString(),
  };
}
