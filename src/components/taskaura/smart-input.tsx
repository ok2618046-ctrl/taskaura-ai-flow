import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarClock, Folder, Flag, Mic, Sparkles, Type } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDue, parseTaskInput } from "@/lib/taskaura/parser";
import { useTaskAura } from "@/lib/taskaura/store";
import { cn } from "@/lib/utils";

const VOICE_SAMPLES = [
  "Pay the electricity bill tomorrow 7pm urgent",
  "Prepare client presentation by Friday 10am",
  "Call Mom at 7pm",
  "Fix printer not working today, urgent",
];

const PRIORITY_CHIP: Record<string, string> = {
  high: "border-danger/30 bg-danger/10 text-danger",
  medium: "border-brand/30 bg-brand/10 text-brand",
  low: "border-aura/30 bg-aura/10 text-aura",
};

export function SmartInput({ autoFocus = false }: { autoFocus?: boolean }) {
  const { addTask } = useTaskAura();
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo(() => (value.trim() ? parseTaskInput(value) : null), [value]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function commit() {
    if (!parsed) return;
    addTask(parsed);
    toast.success("Parsed and added", {
      description: `${parsed.title} · ${parsed.priority} · ${parsed.category}`,
    });
    setValue("");
  }

  function simulateVoice() {
    if (listening) return;
    setListening(true);
    const sample = VOICE_SAMPLES[Math.floor(Math.random() * VOICE_SAMPLES.length)];
    let i = 0;
    setValue("");
    const timer = window.setInterval(() => {
      i += 1;
      setValue(sample.slice(0, i));
      if (i >= sample.length) {
        window.clearInterval(timer);
        setListening(false);
      }
    }, 32);
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="nebula-ring group relative rounded-2xl">
        <div className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 sm:p-4">
          <Sparkles className="size-5 shrink-0 text-brand" />
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            placeholder="Finish project report by tomorrow 5pm urgent..."
            aria-label="Describe a task in plain language"
            className="w-full min-w-0 border-none bg-transparent text-base outline-hidden placeholder:text-muted-foreground sm:text-lg"
          />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Simulate voice input"
            onClick={simulateVoice}
            className={cn("size-9 shrink-0 rounded-full", listening && "animate-pulse text-aura")}
          >
            <Mic className="size-4" />
          </Button>
          <kbd className="hidden h-6 shrink-0 select-none items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            ⌘ K
          </kbd>
        </div>
      </div>

      {parsed ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip icon={Type} className="border-border bg-muted text-foreground">
            {parsed.title}
          </Chip>
          <Chip icon={CalendarClock} className="border-border bg-muted text-muted-foreground">
            {parsed.due ? formatDue(parsed.due.toISOString()) : "No date detected"}
          </Chip>
          <Chip icon={Flag} className={PRIORITY_CHIP[parsed.priority]}>
            {parsed.priority} priority
          </Chip>
          <Chip icon={Folder} className="border-aura/30 bg-aura/10 text-aura">
            {parsed.category}
          </Chip>
          <Button
            size="sm"
            onClick={commit}
            className="ml-auto rounded-full bg-brand text-brand-foreground hover:bg-brand-light"
          >
            Add task
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs italic text-muted-foreground">
          Tip: “Remind me to call Mom at 7pm” · press ⌘K to focus
        </p>
      )}
    </section>
  );
}

function Chip({
  icon: Icon,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "aura-rise inline-flex max-w-full items-center gap-1.5 truncate rounded-full border px-3 py-1.5 text-xs font-medium capitalize",
        className,
      )}
    >
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{children}</span>
    </span>
  );
}
