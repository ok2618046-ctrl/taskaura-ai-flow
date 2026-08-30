import { createFileRoute } from "@tanstack/react-router";

import { SmartInput } from "@/components/taskaura/smart-input";
import { TaskList } from "@/components/taskaura/task-list";

const title = "AI Task Parser — TaskAura";
const description =
  "Type a sentence like “Finish project report by tomorrow 5pm urgent” and TaskAura extracts the title, priority, due date and category instantly.";

export const Route = createFileRoute("/parser")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ParserPage,
});

const EXAMPLES = [
  "Finish project report by tomorrow 5pm urgent",
  "Pay the credit card bill on Friday",
  "Fix printer not working today",
  "Read two chapters someday",
];

function ParserPage() {
  return (
    <div className="space-y-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">AI Task Parser</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Natural language in, structured task out — title, priority, due date and category.
        </p>
      </header>

      <SmartInput autoFocus />

      <section className="mx-auto max-w-3xl">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Things it understands
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {EXAMPLES.map((e) => (
            <li
              key={e}
              className="rounded-xl border border-border bg-surface px-4 py-3 text-xs text-muted-foreground"
            >
              “{e}”
            </li>
          ))}
        </ul>
      </section>

      <TaskList title="Parsed tasks" />
    </div>
  );
}
