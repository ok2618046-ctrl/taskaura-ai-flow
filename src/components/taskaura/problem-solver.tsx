import { useState } from "react";
import { CornerDownLeft, History, Loader2, Trash2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTaskAura } from "@/lib/taskaura/store";
import type { Solution } from "@/lib/taskaura/types";
import { cn } from "@/lib/utils";

export function ProblemSolver({ compact = false }: { compact?: boolean }) {
  const { solutions, ask, removeSolution } = useTaskAura();
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(solutions[0]?.id ?? null);

  const active: Solution | undefined =
    solutions.find((s) => s.id === activeId) ?? solutions[0];

  function submit(text: string) {
    const value = text.trim();
    if (!value || thinking) return;
    setThinking(true);
    window.setTimeout(() => {
      const solution = ask(value);
      setActiveId(solution.id);
      setQuery("");
      setThinking(false);
    }, 650);
  }

  return (
    <section className={cn("space-y-5", compact && "rounded-2xl border border-border bg-surface p-6")}>
      <div>
        <h2 className="font-display text-xl font-bold">Daily Problem Solver</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Ask any daily problem — technical, personal or work.
        </p>
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit(query)}
          placeholder="Ask any daily problem (technical, personal, work)..."
          aria-label="Describe your problem"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-hidden transition-colors placeholder:text-muted-foreground focus:border-aura"
        />
        <Button
          size="icon"
          variant="ghost"
          aria-label="Get a step-by-step solution"
          onClick={() => submit(query)}
          className="absolute right-1.5 top-1.5 size-9 text-muted-foreground hover:text-aura"
        >
          {thinking ? <Loader2 className="size-4 animate-spin" /> : <CornerDownLeft className="size-4" />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["WiFi not working", "How to prepare a presentation", "Laptop running slow"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-aura/40 hover:text-aura"
          >
            {s}
          </button>
        ))}
      </div>

      {active ? (
        <article className="aura-rise rounded-xl border border-aura/20 bg-aura/5 p-5">
          <div className="flex items-start gap-2">
            <Wand2 className="mt-0.5 size-4 shrink-0 text-aura" />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold">{active.query}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{active.summary}</p>
            </div>
          </div>

          <ol className="mt-5 space-y-4">
            {active.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-aura/15 text-[10px] font-bold text-aura">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Step {i + 1}: {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      ) : null}

      <div>
        <h4 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <History className="size-3" /> Recent queries
        </h4>
        <div className="space-y-2">
          {solutions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No queries yet.</p>
          ) : (
            solutions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border p-2 pl-3 transition-colors",
                  s.id === active?.id && "border-aura/30 bg-aura/5",
                )}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className="min-w-0 flex-1 truncate text-left text-xs text-muted-foreground hover:text-foreground"
                >
                  {s.query}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove query ${s.query}`}
                  onClick={() => removeSolution(s.id)}
                  className="size-7 shrink-0 text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
