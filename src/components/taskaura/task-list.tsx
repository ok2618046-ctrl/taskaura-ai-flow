import { useMemo, useState } from "react";
import { Inbox } from "lucide-react";

import { TaskCard } from "@/components/taskaura/task-card";
import { Button } from "@/components/ui/button";
import { useTaskAura } from "@/lib/taskaura/store";
import { CATEGORIES, PRIORITIES, type Category, type Priority } from "@/lib/taskaura/types";
import { cn } from "@/lib/utils";

type Status = "active" | "completed" | "all";

export function TaskList({ title = "Your Focus" }: { title?: string }) {
  const { tasks } = useTaskAura();
  const [status, setStatus] = useState<Status>("active");
  const [category, setCategory] = useState<Category | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (status === "active" && t.completed) return false;
        if (status === "completed" && !t.completed) return false;
        if (category !== "all" && t.category !== category) return false;
        if (priority !== "all" && t.priority !== priority) return false;
        return true;
      }),
    [tasks, status, category, priority],
  );

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h2 className="truncate font-display text-2xl font-bold">{title}</h2>
        <div className="flex shrink-0 gap-2">
          {(["active", "completed", "all"] as Status[]).map((s) => (
            <Button
              key={s}
              size="sm"
              variant="ghost"
              onClick={() => setStatus(s)}
              className={cn(
                "h-7 rounded-md border border-border px-3 text-xs font-medium capitalize text-muted-foreground",
                status === s && "border-brand/20 bg-brand/10 text-brand",
              )}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
          All categories
        </FilterPill>
        {CATEGORIES.map((c) => (
          <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterPill>
        ))}
        <span className="mx-1 hidden w-px bg-border sm:block" />
        <FilterPill active={priority === "all"} onClick={() => setPriority("all")}>
          Any priority
        </FilterPill>
        {PRIORITIES.map((p) => (
          <FilterPill key={p} active={priority === p} onClick={() => setPriority(p)}>
            {p}
          </FilterPill>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-10 text-center">
            <Inbox className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing here. Type a task in the smart bar to add one.
            </p>
          </div>
        ) : (
          filtered.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border border-border px-3 py-1.5 text-xs font-medium capitalize text-muted-foreground transition-colors hover:text-foreground",
        active && "border-aura/30 bg-aura/10 text-aura",
      )}
    >
      {children}
    </button>
  );
}
