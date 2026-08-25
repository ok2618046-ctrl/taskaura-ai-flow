export type Priority = "high" | "medium" | "low";

export type Category = "Work" | "Personal" | "Finance" | "Daily Problem";

export const CATEGORIES: Category[] = ["Work", "Personal", "Finance", "Daily Problem"];
export const PRIORITIES: Priority[] = ["high", "medium", "low"];

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: Category;
  due: string | null; // ISO string
  completed: boolean;
  createdAt: string;
  subtasks: SubTask[];
  breakdownLoading?: boolean;
}

export interface ParsedTask {
  title: string;
  priority: Priority;
  category: Category;
  due: Date | null;
}

export interface SolutionStep {
  title: string;
  detail: string;
}

export interface Solution {
  id: string;
  query: string;
  summary: string;
  steps: SolutionStep[];
  createdAt: string;
}
