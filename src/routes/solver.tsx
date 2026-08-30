import { createFileRoute } from "@tanstack/react-router";

import { ProblemSolver } from "@/components/taskaura/problem-solver";

const title = "Daily Problem Solver — TaskAura";
const description =
  "Ask any everyday problem — WiFi outages, presentation nerves, a slow laptop — and get a clean, numbered, step-by-step fix.";

export const Route = createFileRoute("/solver")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SolverPage,
});

function SolverPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Daily Problem Solver</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Technical, personal or work — describe it and get a step-by-step plan.
        </p>
      </header>
      <ProblemSolver compact />
    </div>
  );
}
