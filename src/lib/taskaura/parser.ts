import type { Category, ParsedTask, Priority } from "./types";

const HIGH_WORDS = ["urgent", "asap", "critical", "important", "immediately", "high priority", "!!"];
const LOW_WORDS = ["someday", "whenever", "low priority", "eventually", "no rush", "optional"];

const CATEGORY_HINTS: Record<Category, string[]> = {
  Work: [
    "work",
    "project",
    "report",
    "client",
    "meeting",
    "deadline",
    "presentation",
    "email",
    "standup",
    "review",
    "deploy",
    "sprint",
    "boss",
    "team",
  ],
  Finance: [
    "pay",
    "invoice",
    "bill",
    "budget",
    "tax",
    "salary",
    "bank",
    "rent",
    "emi",
    "insurance",
    "audit",
    "expense",
    "subscription",
  ],
  Personal: [
    "gym",
    "mom",
    "dad",
    "family",
    "friend",
    "birthday",
    "grocery",
    "doctor",
    "read",
    "call",
    "workout",
    "dinner",
    "trip",
    "clean",
  ],
  "Daily Problem": [
    "fix",
    "not working",
    "broken",
    "issue",
    "troubleshoot",
    "error",
    "repair",
    "how to",
    "problem",
    "stuck",
  ],
};

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function detectPriority(text: string): { priority: Priority; matched: string[] } {
  const matched: string[] = [];
  let priority: Priority = "medium";
  for (const w of HIGH_WORDS) {
    if (text.includes(w)) {
      priority = "high";
      matched.push(w);
    }
  }
  if (priority === "medium") {
    for (const w of LOW_WORDS) {
      if (text.includes(w)) {
        priority = "low";
        matched.push(w);
      }
    }
  }
  return { priority, matched };
}

function detectCategory(text: string): Category {
  let best: Category = "Personal";
  let bestScore = 0;
  (Object.keys(CATEGORY_HINTS) as Category[]).forEach((cat) => {
    const score = CATEGORY_HINTS[cat].filter((hint) => text.includes(hint)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  });
  return bestScore === 0 ? "Personal" : best;
}

function parseTimeOfDay(text: string): { hours: number; minutes: number; matched: string } | null {
  const m = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
  if (m) {
    let hours = parseInt(m[1]!, 10) % 12;
    if (m[3] === "pm") hours += 12;
    return { hours, minutes: m[2] ? parseInt(m[2], 10) : 0, matched: m[0] };
  }
  const m24 = text.match(/\bat\s+(\d{1,2}):(\d{2})\b/);
  if (m24) {
    return { hours: parseInt(m24[1]!, 10), minutes: parseInt(m24[2]!, 10), matched: m24[0] };
  }
  return null;
}

function parseDay(text: string, now: Date): { date: Date; matched: string } | null {
  const base = new Date(now);
  base.setSeconds(0, 0);

  if (text.includes("day after tomorrow")) {
    const d = new Date(base);
    d.setDate(d.getDate() + 2);
    return { date: d, matched: "day after tomorrow" };
  }
  if (text.includes("tomorrow")) {
    const d = new Date(base);
    d.setDate(d.getDate() + 1);
    return { date: d, matched: "tomorrow" };
  }
  if (text.includes("tonight") || text.includes("today")) {
    return { date: new Date(base), matched: text.includes("tonight") ? "tonight" : "today" };
  }
  if (text.includes("next week")) {
    const d = new Date(base);
    d.setDate(d.getDate() + 7);
    return { date: d, matched: "next week" };
  }

  const inDays = text.match(/\bin\s+(\d{1,2})\s+days?\b/);
  if (inDays) {
    const d = new Date(base);
    d.setDate(d.getDate() + parseInt(inDays[1]!, 10));
    return { date: d, matched: inDays[0] };
  }

  for (let i = 0; i < WEEKDAYS.length; i++) {
    const name = WEEKDAYS[i]!;
    const re = new RegExp(`\\b(next\\s+)?(on\\s+)?${name}\\b`);
    const m = text.match(re);
    if (m) {
      const d = new Date(base);
      let delta = (i - d.getDay() + 7) % 7;
      if (delta === 0 || m[1]) delta = delta === 0 ? 7 : delta;
      d.setDate(d.getDate() + delta);
      return { date: d, matched: m[0] };
    }
  }
  return null;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function parseTaskInput(raw: string, now: Date = new Date()): ParsedTask {
  const text = raw.toLowerCase();

  const { priority, matched: priorityWords } = detectPriority(text);
  const category = detectCategory(text);
  const day = parseDay(text, now);
  const time = parseTimeOfDay(text);

  let due: Date | null = null;
  if (day || time) {
    due = day ? new Date(day.date) : new Date(now);
    if (time) {
      due.setHours(time.hours, time.minutes, 0, 0);
    } else {
      due.setHours(9, 0, 0, 0);
    }
    if (!day && due.getTime() < now.getTime()) {
      due.setDate(due.getDate() + 1);
    }
  }

  // Strip the recognised fragments out of the title.
  let title = raw;
  const strip = [
    ...priorityWords,
    ...(day ? [day.matched] : []),
    ...(time ? [time.matched] : []),
    "by",
    "at",
    "due",
    "remind me to",
    "#work",
    "#personal",
    "#finance",
  ];
  for (const frag of strip) {
    title = title.replace(new RegExp(`\\b${frag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), " ");
  }
  title = title.replace(/[\s]+/g, " ").replace(/[,\-–]+\s*$/, "").trim();
  if (!title) title = raw.trim();

  return { title: titleCase(title), priority, category, due };
}

export function formatDue(iso: string | null): string {
  if (!iso) return "No date";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (sameDay(date, now)) return `Today, ${time}`;
  if (sameDay(date, tomorrow)) return `Tomorrow, ${time}`;
  return `${date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, ${time}`;
}
