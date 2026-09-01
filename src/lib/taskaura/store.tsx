import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { generateSubtasks, solveProblem, uid } from "./ai";
import { breakdownTaskWithAI, solveProblemWithAI } from "./solver.functions";
import { useI18n } from "@/lib/i18n";
import { parseTaskInput } from "./parser";
import type { Category, ParsedTask, Priority, Solution, Task } from "./types";

const STORAGE_KEY = "taskaura-state-v1";

function hoursFromNow(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours, 0, 0, 0);
  return d.toISOString();
}

function seedTasks(): Task[] {
  return [
    {
      id: "seed-task-1",
      title: "Q4 financial audit preparation",
      priority: "high",
      category: "Finance",
      due: hoursFromNow(28),
      completed: false,
      createdAt: hoursFromNow(-48),
      subtasks: [
        { id: "seed-sub-1", title: "Collect all invoices from Oct–Dec", done: true },
        { id: "seed-sub-2", title: "Reconcile bank statements for Q4", done: false },
        { id: "seed-sub-3", title: "Draft executive summary for the board", done: false },
      ],
    },
    {
      id: "seed-task-2",
      title: "Redesign landing page hero section",
      priority: "medium",
      category: "Work",
      due: hoursFromNow(72),
      completed: false,
      createdAt: hoursFromNow(-48),
      subtasks: [],
    },
    {
      id: "seed-task-3",
      title: "Fix the flaky office WiFi in meeting room B",
      priority: "high",
      category: "Daily Problem",
      due: hoursFromNow(6),
      completed: false,
      createdAt: hoursFromNow(-48),
      subtasks: [],
    },
    {
      id: "seed-task-4",
      title: "Call Mom about the weekend plan",
      priority: "low",
      category: "Personal",
      due: hoursFromNow(9),
      completed: false,
      createdAt: hoursFromNow(-48),
      subtasks: [],
    },
    {
      id: "seed-task-5",
      title: "Ship the analytics dashboard v2",
      priority: "medium",
      category: "Work",
      due: hoursFromNow(-20),
      completed: true,
      createdAt: hoursFromNow(-48),
      subtasks: [],
    },
    {
      id: "seed-task-6",
      title: "Renew health insurance policy",
      priority: "low",
      category: "Finance",
      due: hoursFromNow(-4),
      completed: true,
      createdAt: hoursFromNow(-48),
      subtasks: [],
    },
  ];
}

function seedSolutions(): Solution[] {
  return [{ ...solveProblem("WiFi not working at home"), id: "seed-solution-1", createdAt: hoursFromNow(-1) }];
}

interface TaskAuraContextValue {
  tasks: Task[];
  solutions: Solution[];
  addTaskFromText: (raw: string) => Task;
  addTask: (parsed: ParsedTask) => Task;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  breakdown: (id: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  ask: (query: string) => Promise<Solution>;
  removeSolution: (id: string) => void;
  stats: {
    total: number;
    completed: number;
    active: number;
    overdue: number;
    score: number;
    byCategory: { name: Category; total: number; completed: number }[];
    byPriority: { name: Priority; count: number }[];
  };
}

const TaskAuraContext = createContext<TaskAuraContextValue | null>(null);

export function TaskAuraProvider({ children }: { children: ReactNode }) {
  // Seed data is deterministic, so server and client render identically.
  const { lang } = useI18n();
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [solutions, setSolutions] = useState<Solution[]>(seedSolutions);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { tasks: Task[]; solutions: Solution[] };
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.solutions)) setSolutions(parsed.solutions);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, solutions }));
  }, [tasks, solutions, hydrated]);

  const addTask = useCallback((parsed: ParsedTask) => {
    const task: Task = {
      id: uid("task"),
      title: parsed.title,
      priority: parsed.priority,
      category: parsed.category,
      due: parsed.due ? parsed.due.toISOString() : null,
      completed: false,
      createdAt: new Date().toISOString(),
      subtasks: [],
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const addTaskFromText = useCallback(
    (raw: string) => addTask(parseTaskInput(raw)),
    [addTask],
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const breakdown = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, breakdownLoading: true } : t)));
    window.setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                breakdownLoading: false,
                subtasks: t.subtasks.length ? t.subtasks : generateSubtasks(t.title, t.category),
              }
            : t,
        ),
      );
    }, 700);
  }, []);

  const toggleSubtask = useCallback((taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)),
            }
          : t,
      ),
    );
  }, []);

  const ask = useCallback(async (query: string) => {
    try {
      const result = await solveProblemWithAI({ data: { query } });
      const solution: Solution = {
        id: uid("sol"),
        query: query.trim(),
        summary: result.summary,
        steps: result.steps,
        createdAt: new Date().toISOString(),
      };
      setSolutions((prev) =>
        [solution, ...prev.filter((s) => s.query !== solution.query)].slice(0, 12),
      );
      return solution;
    } catch (error) {
      console.error("AI solver failed, using local fallback", error);
      const solution = solveProblem(query);
      setSolutions((prev) =>
        [solution, ...prev.filter((s) => s.query !== solution.query)].slice(0, 12),
      );
      return solution;
    }
  }, []);

  const removeSolution = useCallback((id: string) => {
    setSolutions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const now = Date.now();
    const overdue = tasks.filter(
      (t) => !t.completed && t.due && new Date(t.due).getTime() < now,
    ).length;
    const completionRate = total ? completed / total : 0;
    const penalty = total ? Math.min(0.3, overdue / total) : 0;
    const score = Math.round(Math.max(0, completionRate - penalty * 0.5) * 100);

    const byCategory = (["Work", "Personal", "Finance", "Daily Problem"] as Category[]).map(
      (name) => ({
        name,
        total: tasks.filter((t) => t.category === name).length,
        completed: tasks.filter((t) => t.category === name && t.completed).length,
      }),
    );

    const byPriority = (["high", "medium", "low"] as Priority[]).map((name) => ({
      name,
      count: tasks.filter((t) => t.priority === name).length,
    }));

    return { total, completed, active: total - completed, overdue, score, byCategory, byPriority };
  }, [tasks]);

  const value = useMemo<TaskAuraContextValue>(
    () => ({
      tasks,
      solutions,
      addTask,
      addTaskFromText,
      toggleTask,
      removeTask,
      breakdown,
      toggleSubtask,
      ask,
      removeSolution,
      stats,
    }),
    [
      tasks,
      solutions,
      addTask,
      addTaskFromText,
      toggleTask,
      removeTask,
      breakdown,
      toggleSubtask,
      ask,
      removeSolution,
      stats,
    ],
  );

  return <TaskAuraContext.Provider value={value}>{children}</TaskAuraContext.Provider>;
}

export function useTaskAura() {
  const ctx = useContext(TaskAuraContext);
  if (!ctx) throw new Error("useTaskAura must be used inside TaskAuraProvider");
  return ctx;
}
