import { CalendarClock, Folder, Loader2, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDue } from "@/lib/taskaura/parser";
import { useTaskAura } from "@/lib/taskaura/store";
import type { Priority, Task } from "@/lib/taskaura/types";
import { cn } from "@/lib/utils";

const PRIORITY_BADGE: Record<Priority, string> = {
  high: "border-danger/25 bg-danger/10 text-danger",
  medium: "border-brand/25 bg-brand/10 text-brand",
  low: "border-aura/25 bg-aura/10 text-aura",
};

export function TaskCard({ task }: { task: Task }) {
  const { toggleTask, removeTask, breakdown, toggleSubtask } = useTaskAura();
  const overdue = !task.completed && task.due && new Date(task.due).getTime() < Date.now();
  const doneCount = task.subtasks.filter((s) => s.done).length;

  return (
    <article
      className={cn(
        "aura-rise rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40",
        task.completed && "opacity-60",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            aria-label={`Mark "${task.title}" as ${task.completed ? "active" : "complete"}`}
            className="mt-0.5 size-5 shrink-0 border-2 data-[state=checked]:border-brand data-[state=checked]:bg-brand"
          />
          <div className="min-w-0">
            <h4
              className={cn(
                "font-display text-base font-medium",
                task.completed && "line-through",
              )}
            >
              {task.title}
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className={cn("flex items-center gap-1.5", overdue && "text-danger")}>
                <CalendarClock className="size-3.5" />
                {formatDue(task.due)}
                {overdue ? " · overdue" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Folder className="size-3.5" />
                {task.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className={cn(
              "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              "border",
              PRIORITY_BADGE[task.priority],
            )}
          >
            {task.priority}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete task ${task.title}`}
            onClick={() => removeTask(task.id)}
            className="size-8 text-muted-foreground hover:text-danger"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {task.subtasks.length > 0 ? (
        <div className="mt-4 border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-brand">
              <Sparkles className="size-3.5" /> AI Breakdown
            </span>
            <span className="text-[10px] text-muted-foreground">
              {doneCount}/{task.subtasks.length} steps done
            </span>
          </div>
          <ul className="space-y-2">
            {task.subtasks.map((sub) => (
              <li
                key={sub.id}
                className="aura-rise flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-2.5"
              >
                <Checkbox
                  id={`sub-${sub.id}`}
                  checked={sub.done}
                  onCheckedChange={() => toggleSubtask(task.id, sub.id)}
                  className="size-4 shrink-0 data-[state=checked]:border-aura data-[state=checked]:bg-aura"
                />
                <label
                  htmlFor={`sub-${sub.id}`}
                  className={cn(
                    "cursor-pointer text-xs text-foreground/90",
                    sub.done && "text-muted-foreground line-through",
                  )}
                >
                  {sub.title}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={task.breakdownLoading}
          onClick={() => breakdown(task.id)}
          className="mt-4 w-full border-brand/20 bg-brand/5 text-xs font-semibold text-brand hover:bg-brand hover:text-brand-foreground"
        >
          {task.breakdownLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Thinking through the steps…
            </>
          ) : (
            <>
              <Sparkles className="size-3.5" /> Breakdown with AI
            </>
          )}
        </Button>
      )}
    </article>
  );
}
