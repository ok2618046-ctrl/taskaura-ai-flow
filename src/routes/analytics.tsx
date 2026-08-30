import { createFileRoute } from "@tanstack/react-router";

import { StatsGrid } from "@/components/taskaura/stats-grid";
import { useTaskAura } from "@/lib/taskaura/store";
import { cn } from "@/lib/utils";

const title = "Analytics — TaskAura";
const description =
  "See completion rate, overdue load, category balance and priority mix across all your TaskAura tasks.";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AnalyticsPage,
});

const PRIORITY_BAR: Record<string, string> = {
  high: "bg-danger",
  medium: "bg-brand",
  low: "bg-aura",
};

function AnalyticsPage() {
  const { stats } = useTaskAura();
  const maxPriority = Math.max(1, ...stats.byPriority.map((p) => p.count));

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          How your workload is distributed right now.
        </p>
      </header>

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Completion by category</h2>
          <ul className="mt-5 space-y-4">
            {stats.byCategory.map((c) => {
              const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0;
              return (
                <li key={c.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">
                      {c.completed}/{c.total} · {pct}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-brand to-aura transition-[width] duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-bold">Priority mix</h2>
          <div className="mt-6 flex h-48 items-end gap-6">
            {stats.byPriority.map((p) => (
              <div key={p.name} className="flex flex-1 flex-col items-center gap-3">
                <span className="text-sm font-semibold">{p.count}</span>
                <div
                  className={cn("w-full rounded-t-lg transition-[height] duration-700", PRIORITY_BAR[p.name])}
                  style={{ height: `${(p.count / maxPriority) * 100}%`, minHeight: 6 }}
                />
                <span className="text-xs capitalize text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
