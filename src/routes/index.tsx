import { createFileRoute } from "@tanstack/react-router";

import { ProblemSolver } from "@/components/taskaura/problem-solver";
import { SmartInput } from "@/components/taskaura/smart-input";
import { StatsGrid } from "@/components/taskaura/stats-grid";
import { TaskList } from "@/components/taskaura/task-list";

const title = "TaskAura — AI productivity & daily problem solver";
const description =
  "Turn plain sentences into scheduled tasks, break them down into AI sub-steps, and get step-by-step fixes for everyday problems.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-12">
      <h1 className="sr-only">TaskAura dashboard</h1>
      <StatsGrid />
      <SmartInput />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <TaskList />
        </div>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <ProblemSolver compact />
          </div>
        </div>
      </div>
    </div>
  );
}
